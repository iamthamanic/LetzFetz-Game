import type { ContentPack, ElementCardDef, GameAction, GameState, PlayerId } from '../types';
import { getLegalActions, findElementDef, applyAction, type PackContext } from './actions';
import { rulesetFromState } from './rulesetFromState';
import { diceBonusFromRoll, rollD6 } from './dice';
import { DEFAULT_RULESET, isV5FormulaEnabled } from '../types';
import { calculateCombatValue, resolveDamage, challengeSucceeded } from './combat';
import { challengeTargetResistance } from './phraseBonuses';
import {
  findFormulaComponent,
  formulaChallengeOutcome,
  formulaComponentStability,
} from './formulaChallenge';
import { getCharacterElements } from './helpers';

const BOT_ID: PlayerId = 'p2';
const HUMAN_ID: PlayerId = 'p1';
const DICE_ROLLS = [1, 2, 3, 4, 5, 6] as const;

function handDef(
  state: GameState,
  playerId: PlayerId,
  instanceId: string,
  pack: ContentPack,
): ElementCardDef | undefined {
  const card = state.players[playerId].hand.find((c) => c.instanceId === instanceId);
  return card ? findElementDef(pack, card.defId) : undefined;
}

function attackValue(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  def: ElementCardDef,
  diceRoll: number,
): number {
  const bonus = diceBonusFromRoll(diceRoll, DEFAULT_RULESET);
  return calculateCombatValue({
    cardValue: def.value,
    diceRoll,
    diceBonus: bonus,
    characterElements: getCharacterElements(pack, state.players[playerId].characterId),
    cardElement: def.element,
  });
}

function blockValue(
  state: GameState,
  pack: ContentPack,
  def: ElementCardDef,
  diceRoll: number,
  attackElement: ElementCardDef['element'] | undefined,
): number {
  const bonus = diceBonusFromRoll(diceRoll, DEFAULT_RULESET);
  return calculateCombatValue({
    cardValue: def.value,
    diceRoll,
    diceBonus: bonus,
    characterElements: getCharacterElements(pack, state.players[BOT_ID].characterId),
    cardElement: def.element,
    attackElement,
    blockElement: def.element,
  });
}

function elementSynergyBonus(pack: ContentPack, state: GameState, element: string): number {
  const elements = getCharacterElements(pack, state.players[BOT_ID].characterId);
  return elements.includes(element as (typeof elements)[number]) ? 2 : 0;
}

function bestBlockAction(
  state: GameState,
  pack: ContentPack,
  actions: GameAction[],
): GameAction {
  if (!state.combat) return { type: 'PASS_BLOCK' };

  // Prefer Kaputter Rückspiegel (−1 attack) before choosing block/pass.
  const reactionItem = actions.find(
    (a): a is Extract<GameAction, { type: 'PLAY_ITEM' }> => a.type === 'PLAY_ITEM',
  );
  if (reactionItem && state.combat.attackValue >= 2 && !state.combat.rueckspiegelArmed) {
    return reactionItem;
  }

  const { attackValue: atkVal, attackCardDefId } = state.combat;
  const attackDef = findElementDef(pack, attackCardDefId);
  const blockActions = actions.filter(
    (a): a is Extract<GameAction, { type: 'PLAY_BLOCK' }> => a.type === 'PLAY_BLOCK',
  );

  let best: GameAction = { type: 'PASS_BLOCK' };
  let bestDamage = atkVal;

  for (const action of blockActions) {
    const def = handDef(state, BOT_ID, action.cardInstanceId, pack);
    if (!def) continue;
    for (const roll of DICE_ROLLS) {
      const blockVal = blockValue(state, pack, def, roll, attackDef?.element);
      const damage = resolveDamage(atkVal, blockVal);
      if (damage < bestDamage) {
        bestDamage = damage;
        best = { ...action, diceRoll: roll };
      }
    }
  }

  if (bestDamage === 0 && best.type === 'PLAY_BLOCK') {
    return best;
  }

  const botHp = state.players[BOT_ID].hp;
  if (bestDamage >= botHp && best.type === 'PASS_BLOCK') {
    return best;
  }

  return best;
}

function pickBestBuild(state: GameState, pack: ContentPack, actions: GameAction[]): GameAction {
  const v5 = isV5FormulaEnabled(rulesetFromState(state));

  if (v5) {
    const activate = actions.find((a) => a.type === 'FORMULA_ACTIVATE');
    if (activate) {
      const board = state.players[BOT_ID].formula;
      const filled = [board.technik, board.essenz, board.katalysator].filter(Boolean).length;
      if (filled >= 2) return activate;
    }

    const builds = actions.filter(
      (a): a is Extract<
        GameAction,
        { type: 'FORMULA_BUILD' | 'FORMULA_REPLACE' | 'FORMULA_SCHNELLMIX' }
      > =>
        a.type === 'FORMULA_BUILD' ||
        a.type === 'FORMULA_REPLACE' ||
        a.type === 'FORMULA_SCHNELLMIX',
    );
    if (builds.length === 0) {
      return actions.find((a) => a.type === 'FORMULA_ACTIVATE') ??
        actions.find((a) => a.type === 'SKIP_BUILD') ??
        { type: 'SKIP_BUILD' };
    }

    const prefer = (type: GameAction['type']) => builds.filter((a) => a.type === type);
    for (const type of ['FORMULA_BUILD', 'FORMULA_REPLACE', 'FORMULA_SCHNELLMIX'] as const) {
      const group = prefer(type);
      if (group.length === 0) continue;
      // Prefer essences when building (elemental), then any first legal.
      const withEssence = group.find((a) => {
        const card = state.players[BOT_ID].hand.find((c) => c.instanceId === a.cardInstanceId);
        return card ? Boolean(pack.essences?.find((e) => e.id === card.defId)) : false;
      });
      return withEssence ?? group[0];
    }
  }

  const builds = actions.filter((a): a is Extract<GameAction, { type: 'BUILD_CARD' }> => a.type === 'BUILD_CARD');
  if (builds.length === 0) return { type: 'SKIP_BUILD' };

  let best = builds[0];
  let bestScore = -Infinity;

  for (const action of builds) {
    const def = handDef(state, BOT_ID, action.cardInstanceId, pack);
    if (!def) continue;
    let score = def.value + elementSynergyBonus(pack, state, def.element);
    if (def.cardType === 'attack') score += 2;
    if (def.cardType === 'block') score += 1;

    if (def.cardType === 'attack') {
      const boundAttacks = state.players[BOT_ID].bound.filter((b) => {
        const boundDef = findElementDef(pack, b.defId);
        return boundDef?.cardType === 'attack';
      }).length;
      if (boundAttacks >= 2) score -= 6;
    }

    if (action.discardBoundId) {
      const bound = state.players[BOT_ID].bound.find((b) => b.instanceId === action.discardBoundId);
      const boundDef = bound ? findElementDef(pack, bound.defId) : undefined;
      if (bound && boundDef) {
        score -= boundDef.value * 0.5;
        if (bound.exhausted) score += 2;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      best = action;
    }
  }

  return best;
}

function pickBestAttack(
  state: GameState,
  pack: ContentPack,
  actions: Extract<GameAction, { type: 'PLAY_ATTACK' }>[],
): Extract<GameAction, { type: 'PLAY_ATTACK' }> | null {
  if (actions.length === 0) return null;

  const humanHp = state.players[HUMAN_ID].hp;
  let best = actions[0];
  let bestScore = -Infinity;

  for (const action of actions) {
    const def = handDef(state, BOT_ID, action.cardInstanceId, pack);
    if (!def) continue;
    let maxVal = 0;
    for (const roll of DICE_ROLLS) {
      maxVal = Math.max(maxVal, attackValue(state, pack, BOT_ID, def, roll));
    }
    let score = maxVal + elementSynergyBonus(pack, state, def.element);
    if (humanHp <= 8) score += 4;
    if (humanHp <= maxVal) score += 6;
    if (score > bestScore) {
      bestScore = score;
      best = action;
    }
  }

  const def = handDef(state, BOT_ID, best.cardInstanceId, pack);
  const minThreshold = humanHp <= 10 ? 2 : 4;
  if (!def || def.value < minThreshold) return null;

  return { ...best, diceRoll: rollD6() };
}

function pickBestChallenge(
  state: GameState,
  pack: ContentPack,
  actions: Extract<GameAction, { type: 'CHALLENGE' }>[],
): Extract<GameAction, { type: 'CHALLENGE' }> | null {
  if (actions.length === 0) return null;

  const v5 = isV5FormulaEnabled(rulesetFromState(state));
  let best = actions[0];
  let bestScore = -Infinity;

  for (const action of actions) {
    const atkDef = handDef(state, BOT_ID, action.attackCardInstanceId, pack);
    if (!atkDef) continue;

    let maxAtk = 0;
    for (const roll of DICE_ROLLS) {
      maxAtk = Math.max(maxAtk, attackValue(state, pack, BOT_ID, atkDef, roll));
    }

    if (v5) {
      const target = findFormulaComponent(
        state.players[HUMAN_ID].formula,
        action.targetBoundInstanceId,
      );
      if (!target) continue;
      const stability = formulaComponentStability(pack, target);
      const outcome = formulaChallengeOutcome(maxAtk, stability, target.disturbed);
      let score = maxAtk + stability * (outcome === 'destroy' ? 2 : outcome === 'disturb' ? 1.2 : 0.3);
      if (target.disturbed) score += 1;
      if (score > bestScore) {
        bestScore = score;
        best = action;
      }
      continue;
    }

    const target = state.players[HUMAN_ID].bound.find(
      (b) => b.instanceId === action.targetBoundInstanceId,
    );
    if (!target) continue;

    const targetResistance = challengeTargetResistance(pack, target);
    const margin = state.arena.arenaId === 'arena-sumpf' ? 2 : 1;
    const succeeds = challengeSucceeded(maxAtk, targetResistance, 0, margin);
    let score = maxAtk + targetResistance * (succeeds ? 2 : 0.3);
    if (target.exhausted) score -= 2;
    if (score > bestScore) {
      bestScore = score;
      best = action;
    }
  }

  if (v5) {
    const target = findFormulaComponent(state.players[HUMAN_ID].formula, best.targetBoundInstanceId);
    if (!target) return null;
    const stability = formulaComponentStability(pack, target);
    if (stability < 2) return null;
    return { ...best, diceRoll: rollD6() };
  }

  const target = state.players[HUMAN_ID].bound.find((b) => b.instanceId === best.targetBoundInstanceId);
  if (!target) return null;
  const targetResistance = challengeTargetResistance(pack, target);
  if (targetResistance < 3) return null;

  return { ...best, diceRoll: rollD6() };
}

/** Heuristic scores for V3 reaction picks (higher = preferred when harming opponent). */
const REACTION_PICK_SCORE: Record<string, number> = {
  inferno: 12,
  feuersturm: 11,
  sonnenbrand: 10,
  hexenbrand: 9,
  tiefer_fluch: 8,
  paranoia: 8,
  hotbox: 7,
  pollenflug: 6,
  wirbel: 6,
  dampf: 5,
  ueberflutung: 5,
  kraeutersud: 4,
  deep_high: 4,
  erleuchtung: 3,
  finsternis: 7,
  blitzschlag: 8,
  erdbeben: 7,
  tsunami: 8,
  tornado: 7,
  sonnensturm: 8,
  schattenklinge: 8,
};

function pickBestReaction(
  state: GameState,
  actions: Extract<GameAction, { type: 'PICK_REACTION' }>[],
): GameAction {
  if (actions.length === 1) return actions[0];
  const pending = state.pendingChoice;
  const targetIsOpponent =
    pending?.type === 'pick-reaction' && pending.targetId !== BOT_ID;

  let best = actions[0];
  let bestScore = -Infinity;
  for (const action of actions) {
    const base = REACTION_PICK_SCORE[action.reactionId] ?? 1;
    // Prefer damaging picks vs opponent; invert slightly when self-targeted.
    const score = targetIsOpponent ? base : -base;
    if (score > bestScore) {
      bestScore = score;
      best = action;
    }
  }
  // Deterministic tie-break: lexicographic reactionId
  const tied = actions.filter((a) => {
    const base = REACTION_PICK_SCORE[a.reactionId] ?? 1;
    const score = targetIsOpponent ? base : -base;
    return score === bestScore;
  });
  if (tied.length > 1) {
    return [...tied].sort((a, b) => a.reactionId.localeCompare(b.reactionId))[0];
  }
  return best;
}

/** Heuristic bot for solo playtests — improved build, combat, and pressure. */
export function chooseBotAction(state: GameState, pack: ContentPack): GameAction | null {
  const actions = getLegalActions(state, { pack, playerId: BOT_ID });
  if (actions.length === 0) {
    // Pending choice may belong to human — bot has nothing
    const asHuman = getLegalActions(state, { pack, playerId: HUMAN_ID });
    if (state.pendingChoice && asHuman.length > 0) return null;
    return null;
  }

  if (state.pendingChoice) {
    const reactionPicks = actions.filter(
      (a): a is Extract<GameAction, { type: 'PICK_REACTION' }> => a.type === 'PICK_REACTION',
    );
    if (reactionPicks.length > 0) {
      return pickBestReaction(state, reactionPicks);
    }
    const pill = actions.filter(
      (a): a is Extract<GameAction, { type: 'PICK_PILLENDOKTORA' }> =>
        a.type === 'PICK_PILLENDOKTORA',
    );
    if (pill.length > 0) {
      const hp = state.players[BOT_ID].hp;
      if (hp <= 12) {
        return pill.find((a) => a.option === 'heal-1') ?? pill[0];
      }
      const oppHp = state.players[HUMAN_ID].hp;
      if (oppHp <= 8) {
        return pill.find((a) => a.option === 'deal-1') ?? pill[0];
      }
      return pill.find((a) => a.option === 'deal-1') ?? pill[0];
    }
    const myst = actions.filter(
      (a): a is Extract<GameAction, { type: 'PICK_MYSTERIUM_ELEMENT' }> =>
        a.type === 'PICK_MYSTERIUM_ELEMENT',
    );
    if (myst.length > 0) {
      const preferred = ['light', 'shadow', 'fire', 'water', 'earth', 'air'] as const;
      for (const el of preferred) {
        const hit = myst.find((a) => a.element === el);
        if (hit) return hit;
      }
      return myst[0];
    }
    const affinity = actions.filter(
      (a): a is Extract<GameAction, { type: 'PICK_V6_AFFINITY' }> =>
        a.type === 'PICK_V6_AFFINITY',
    );
    if (affinity.length > 0) {
      return (
        affinity.find((a) => a.mode === 'value-plus') ??
        affinity.find((a) => a.mode === 'dice-plus') ??
        affinity[0]
      );
    }
    return (
      actions.find((a) => a.type === 'TAKE_OPTIONAL_DRAW') ??
      actions.find((a) => a.type === 'RESOLVE_DRAW_DISCARD') ??
      actions.find((a) => a.type === 'BUILD_CARD') ??
      actions.find((a) => a.type === 'PASS_PENDING') ??
      actions[0]
    );
  }

  if (state.combat) {
    return bestBlockAction(state, pack, actions);
  }

  if (state.phase === 'start' || state.phase === 'draw') {
    return { type: 'ADVANCE_PHASE' };
  }

  if (state.phase === 'build') {
    return pickBestBuild(state, pack, actions);
  }

  if (state.phase === 'action') {
    const humanHp = state.players[HUMAN_ID].hp;
    const botHp = state.players[BOT_ID].hp;

    if (state.players[BOT_ID].ultimateAvailable) {
      const ulti = actions.find((a) => a.type === 'PLAY_ULTIMATE');
      const v5 = isV5FormulaEnabled(rulesetFromState(state));
      const chargeOk =
        !v5 || state.players[BOT_ID].fetzCharge >= 3;
      if (
        ulti &&
        chargeOk &&
        (botHp <= 14 || humanHp <= 9 || (botHp <= 18 && humanHp >= 16) || (v5 && state.players[BOT_ID].fetzCharge >= 3))
      ) {
        return ulti;
      }
    }

    const items = actions.filter(
      (a): a is Extract<GameAction, { type: 'PLAY_ITEM' }> => a.type === 'PLAY_ITEM',
    );
    if (items.length > 0 && botHp <= 16) {
      return items[0];
    }

    const challenges = actions.filter(
      (a): a is Extract<GameAction, { type: 'CHALLENGE' }> => a.type === 'CHALLENGE',
    );
    const challenge = pickBestChallenge(state, pack, challenges);
    if (challenge) return challenge;

    const attacks = actions.filter(
      (a): a is Extract<GameAction, { type: 'PLAY_ATTACK' }> => a.type === 'PLAY_ATTACK',
    );
    const attack = pickBestAttack(state, pack, attacks);
    if (attack) return attack;

    if (botHp <= 14) {
      const healBoost = actions.find((a) => {
        if (a.type !== 'PLAY_BOOST') return false;
        const def = handDef(state, BOT_ID, a.cardInstanceId, pack);
        return def?.element === 'water' || def?.element === 'light';
      });
      if (healBoost) return healBoost;
    }

    const fireBoost = actions.find((a) => {
      if (a.type !== 'PLAY_BOOST') return false;
      const def = handDef(state, BOT_ID, a.cardInstanceId, pack);
      return def?.element === 'fire' || def?.element === 'shadow';
    });
    if (fireBoost && attacks.length === 0) return fireBoost;

    const activate = actions.find((a) => a.type === 'ACTIVATE_BOUND');
    if (activate && state.players[BOT_ID].hand.length >= 2) return activate;

    const discardDraw = actions.find((a) => a.type === 'DISCARD_DRAW');
    if (discardDraw && state.players[BOT_ID].hand.length >= 5) return discardDraw;

    if (attacks.length > 0) {
      return { ...attacks[0], diceRoll: rollD6() };
    }

    return { type: 'END_TURN' };
  }

  if (state.phase === 'end') {
    return { type: 'END_TURN' };
  }

  return actions[0];
}

export function runBotTurn(
  state: GameState,
  pack: ContentPack,
  maxSteps = 24,
): GameState {
  let current = state;
  const ctx: PackContext = { pack, playerId: BOT_ID, ruleset: rulesetFromState(state) };

  for (let i = 0; i < maxSteps; i++) {
    if (current.winner || current.activePlayer !== BOT_ID) break;
    const action = chooseBotAction(current, pack);
    if (!action) break;
    current = applyAction(current, action, BOT_ID, {
      ...ctx,
      ruleset: rulesetFromState(current),
    });
    if (current.combat && current.combat.defenderId === BOT_ID) {
      const blockAction = chooseBotAction(current, pack);
      if (blockAction) {
        current = applyAction(current, blockAction, BOT_ID, {
          ...ctx,
          ruleset: rulesetFromState(current),
        });
      }
    }
  }

  return current;
}
