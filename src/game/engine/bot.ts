import type { ContentPack, ElementCardDef, GameAction, GameState, PlayerId } from '../types';
import { getLegalActions, findElementDef, applyAction, type PackContext } from './actions';
import { rulesetFromState } from './rulesetFromState';
import { diceBonusFromRoll, rollD6 } from './dice';
import { DEFAULT_RULESET } from '../types';
import { calculateCombatValue, resolveDamage, challengeSucceeded } from './combat';
import { challengeTargetResistance } from './phraseBonuses';
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
      if (boundDef) {
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

  let best = actions[0];
  let bestScore = -Infinity;

  for (const action of actions) {
    const atkDef = handDef(state, BOT_ID, action.attackCardInstanceId, pack);
    if (!atkDef) continue;
    const target = state.players[HUMAN_ID].bound.find((b) => b.instanceId === action.targetBoundInstanceId);
    if (!target) continue;

    let maxAtk = 0;
    for (const roll of DICE_ROLLS) {
      maxAtk = Math.max(maxAtk, attackValue(state, pack, BOT_ID, atkDef, roll));
    }

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

  const target = state.players[HUMAN_ID].bound.find((b) => b.instanceId === best.targetBoundInstanceId);
  if (!target) return null;
  const targetResistance = challengeTargetResistance(pack, target);
  if (targetResistance < 3) return null;

  return { ...best, diceRoll: rollD6() };
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
      if (ulti && (botHp <= 14 || humanHp <= 9 || (botHp <= 18 && humanHp >= 16))) {
        return ulti;
      }
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
