import type { ContentPack, GameAction, GameState, PlayerId } from '../types';
import { getLegalActions, findElementDef, applyAction, type PackContext } from './actions';
import { diceBonusFromRoll, rollD6 } from './dice';
import { DEFAULT_RULESET } from '../types';
import { calculateCombatValue, resolveDamage } from './combat';
import { getCharacterElements } from './helpers';

const BOT_ID: PlayerId = 'p2';

function bestBlockAction(
  state: GameState,
  pack: ContentPack,
  actions: GameAction[],
): GameAction {
  if (!state.combat) return { type: 'PASS_BLOCK' };
  const { attackValue, attackCardDefId } = state.combat;
  const attackDef = findElementDef(pack, attackCardDefId);
  const blockActions = actions.filter(
    (a): a is Extract<GameAction, { type: 'PLAY_BLOCK' }> => a.type === 'PLAY_BLOCK',
  );

  let best: GameAction = { type: 'PASS_BLOCK' };
  let bestDamage = attackValue;

  for (const action of blockActions) {
    const card = state.players[BOT_ID].hand.find((c) => c.instanceId === action.cardInstanceId);
    const def = card ? findElementDef(pack, card.defId) : undefined;
    if (!def) continue;
    const roll = 4;
    const bonus = diceBonusFromRoll(roll, DEFAULT_RULESET);
    const blockValue = calculateCombatValue({
      cardValue: def.value,
      diceRoll: roll,
      diceBonus: bonus,
      characterElements: getCharacterElements(pack, state.players[BOT_ID].characterId),
      cardElement: def.element,
      attackElement: attackDef?.element,
      blockElement: def.element,
    });
    const damage = resolveDamage(attackValue, blockValue);
    if (damage < bestDamage) {
      bestDamage = damage;
      best = { ...action, diceRoll: roll };
    }
  }

  return best;
}

/** Simple heuristic bot for solo playtests. */
export function chooseBotAction(state: GameState, pack: ContentPack): GameAction | null {
  const actions = getLegalActions(state, { pack, playerId: BOT_ID });
  if (actions.length === 0) return null;

  if (state.combat) {
    return bestBlockAction(state, pack, actions);
  }

  if (state.phase === 'start' || state.phase === 'draw') {
    return { type: 'ADVANCE_PHASE' };
  }

  if (state.phase === 'bind') {
    const bind = actions.find((a) => a.type === 'BIND_CARD');
    return bind ?? { type: 'SKIP_BIND' };
  }

  if (state.phase === 'action') {
    if (state.players[BOT_ID].ultimateAvailable && state.players[BOT_ID].hp <= 10) {
      const ulti = actions.find((a) => a.type === 'PLAY_ULTIMATE');
      if (ulti) return ulti;
    }

    const challenges = actions.filter((a) => a.type === 'CHALLENGE');
    if (challenges.length > 0 && state.players[BOT_ID].hp > 8) {
      let best = challenges[0] as Extract<GameAction, { type: 'CHALLENGE' }>;
      let bestValue = 0;
      for (const a of challenges) {
        if (a.type !== 'CHALLENGE') continue;
        const card = state.players[BOT_ID].hand.find((c) => c.instanceId === a.attackCardInstanceId);
        const def = card ? findElementDef(pack, card.defId) : undefined;
        if (def && def.value > bestValue) {
          bestValue = def.value;
          best = a;
        }
      }
      if (bestValue >= 4) {
        return { ...best, diceRoll: rollD6() };
      }
    }

    const attacks = actions.filter((a) => a.type === 'PLAY_ATTACK');
    if (attacks.length > 0) {
      let best = attacks[0] as Extract<GameAction, { type: 'PLAY_ATTACK' }>;
      let bestValue = 0;
      for (const a of attacks) {
        if (a.type !== 'PLAY_ATTACK') continue;
        const card = state.players[BOT_ID].hand.find((c) => c.instanceId === a.cardInstanceId);
        const def = card ? findElementDef(pack, card.defId) : undefined;
        if (def && def.value > bestValue) {
          bestValue = def.value;
          best = a;
        }
      }
      if (bestValue >= 4) {
        return { ...best, diceRoll: rollD6() };
      }
    }

    const hp = state.players[BOT_ID].hp;
    if (hp <= 12) {
      const waterBoost = actions.find((a) => {
        if (a.type !== 'PLAY_BOOST') return false;
        const card = state.players[BOT_ID].hand.find((c) => c.instanceId === a.cardInstanceId);
        const def = card ? findElementDef(pack, card.defId) : undefined;
        return def?.element === 'water';
      });
      if (waterBoost) return waterBoost;
    }

    if (attacks.length > 0) {
      const best = attacks[0] as Extract<GameAction, { type: 'PLAY_ATTACK' }>;
      return { ...best, diceRoll: rollD6() };
    }

    const fireBoost = actions.find((a) => a.type === 'PLAY_BOOST');
    if (fireBoost) return fireBoost;

    const activate = actions.find((a) => a.type === 'ACTIVATE_BOUND');
    if (activate) return activate;

    const discardDraw = actions.find((a) => a.type === 'DISCARD_DRAW');
    if (discardDraw) return discardDraw;

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
  maxSteps = 20,
): GameState {
  let current = state;
  const ctx: PackContext = { pack, playerId: BOT_ID };

  for (let i = 0; i < maxSteps; i++) {
    if (current.winner || current.activePlayer !== BOT_ID) break;
    const action = chooseBotAction(current, pack);
    if (!action) break;
    current = applyAction(current, action, BOT_ID, ctx);
    if (current.combat && current.combat.defenderId === BOT_ID) {
      const blockAction = chooseBotAction(current, pack);
      if (blockAction) {
        current = applyAction(current, blockAction, BOT_ID, ctx);
      }
    }
  }

  return current;
}
