/**
 * V5 §25 character passive hooks (minimal subset for playtest).
 * Location: src/game/engine/characterPassives.ts
 */
import type { ContentPack, GameState, PlayerId, RulesetConfig } from '../types';
import { isV5FormulaEnabled } from '../types';
import { cloneState, drawForPlayer, clampHp } from './helpers';
import { formulaComponentElement } from './formulaChallenge';
import type { Rng } from './deck';

function passiveUsed(state: GameState, playerId: PlayerId, key: string): boolean {
  return (state.meta.v5PassiveUsed?.[playerId] ?? []).includes(key);
}

function markPassiveUsed(state: GameState, playerId: PlayerId, key: string): GameState {
  const next = cloneState(state);
  const prev = next.meta.v5PassiveUsed ?? { p1: [], p2: [] };
  next.meta.v5PassiveUsed = {
    p1: [...(prev.p1 ?? [])],
    p2: [...(prev.p2 ?? [])],
    [playerId]: [...(prev[playerId] ?? []), key],
  };
  return next;
}

/** Schluckspecht — once per opponent turn on full block: heal 1. */
export function trySchluckspechtFullBlockHeal(
  state: GameState,
  defenderId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  if (!isV5FormulaEnabled(ruleset)) return state;
  if (state.players[defenderId].characterId !== 'schluckspecht') return state;
  if (passiveUsed(state, defenderId, 'schluckspecht-fullblock')) return state;

  let next = markPassiveUsed(state, defenderId, 'schluckspecht-fullblock');
  next.players[defenderId].hp = clampHp(next.players[defenderId].hp + 1, ruleset);
  next.lastEvent = `${next.lastEvent ?? ''} Schluckspecht: +1 Leben.`.trim();
  return next;
}

/**
 * Knuspergnom — once per turn after building earth/fire formula component:
 * discard 1 (last hand card) and draw 1 (auto for deterministic playtest).
 */
export function tryKnuspergnomFormulaFilter(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  builtInstanceId: string,
  rng: Rng,
  ruleset: RulesetConfig,
): GameState {
  if (!isV5FormulaEnabled(ruleset)) return state;
  if (state.players[playerId].characterId !== 'knuspergnom') return state;
  if (passiveUsed(state, playerId, 'knuspergnom-filter')) return state;

  const formula = state.players[playerId].formula;
  const built =
    formula.technik?.instanceId === builtInstanceId
      ? formula.technik
      : formula.essenz?.instanceId === builtInstanceId
        ? formula.essenz
        : formula.katalysator?.instanceId === builtInstanceId
          ? formula.katalysator
          : null;
  if (!built) return state;

  const element = formulaComponentElement(pack, built);
  if (element !== 'earth' && element !== 'fire') return state;

  let next = markPassiveUsed(state, playerId, 'knuspergnom-filter');
  if (next.players[playerId].hand.length === 0) {
    next.lastEvent = `${next.lastEvent ?? ''} Knuspergnom: Filter (keine Handkarte).`.trim();
    return next;
  }
  const removed = next.players[playerId].hand.pop();
  if (removed) next.piles.discard.push(removed);
  next = drawForPlayer(next, playerId, 1, rng, ruleset, { allowExtra: true });
  next.lastEvent = `${next.lastEvent ?? ''} Knuspergnom: 1 abgeworfen, 1 gezogen.`.trim();
  return next;
}

/** Stiernacken — after HP damage: +1 next attack/challenge, max stored +2. */
export function tryStiernackenRevengeBonus(
  state: GameState,
  damagedPlayerId: PlayerId,
  hpDamage: number,
  ruleset: RulesetConfig,
): GameState {
  if (!isV5FormulaEnabled(ruleset)) return state;
  if (hpDamage <= 0) return state;
  if (state.players[damagedPlayerId].characterId !== 'stiernackenkommando') return state;

  const next = cloneState(state);
  const prev = next.meta.v5RevengeBonus ?? { p1: 0, p2: 0 };
  const current = prev[damagedPlayerId] ?? 0;
  next.meta.v5RevengeBonus = {
    p1: prev.p1 ?? 0,
    p2: prev.p2 ?? 0,
    [damagedPlayerId]: Math.min(2, current + 1),
  };
  return next;
}

/** Consume stored revenge bonus into attack value (returns bonus used). */
export function consumeStiernackenRevengeBonus(
  state: GameState,
  attackerId: PlayerId,
): { state: GameState; bonus: number } {
  const bonus = state.meta.v5RevengeBonus?.[attackerId] ?? 0;
  if (bonus <= 0) return { state, bonus: 0 };
  const next = cloneState(state);
  const prev = next.meta.v5RevengeBonus ?? { p1: 0, p2: 0 };
  next.meta.v5RevengeBonus = {
    p1: prev.p1 ?? 0,
    p2: prev.p2 ?? 0,
    [attackerId]: 0,
  };
  return { state: next, bonus };
}
