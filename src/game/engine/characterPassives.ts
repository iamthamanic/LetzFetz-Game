/**
 * V5 §25 character passive hooks.
 * Location: src/game/engine/characterPassives.ts
 */
import type {
  ContentPack,
  Element,
  GameState,
  PlayerId,
  RulesetConfig,
} from '../types';
import { isV5FormulaEnabled } from '../types';
import { cloneState, drawForPlayer, clampHp } from './helpers';
import { formulaComponentElement, listFormulaComponents } from './formulaChallenge';
import { opponentOf } from './createGame';
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
  const hpBefore = next.players[defenderId].hp;
  next.players[defenderId].hp = clampHp(next.players[defenderId].hp + 1, ruleset);
  next.lastEvent = `${next.lastEvent ?? ''} Schluckspecht: +1 Leben.`.trim();
  return tryKokabellStabilityOnHeal(
    next,
    defenderId,
    Math.max(0, next.players[defenderId].hp - hpBefore),
    ruleset,
  );
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

/**
 * Kokabell — once per turn after gaining HP: +1 stability on one own formula
 * component until next start (stored on stabilityBonus; cleared by start restore).
 */
export function tryKokabellStabilityOnHeal(
  state: GameState,
  playerId: PlayerId,
  hpGained: number,
  ruleset: RulesetConfig,
): GameState {
  if (!isV5FormulaEnabled(ruleset)) return state;
  if (hpGained <= 0) return state;
  if (state.players[playerId].characterId !== 'kokabell') return state;
  if (passiveUsed(state, playerId, 'kokabell-heal')) return state;

  const comps = listFormulaComponents(state.players[playerId].formula);
  if (comps.length === 0) return state;

  let next = markPassiveUsed(state, playerId, 'kokabell-heal');
  const first = comps[0];
  const c = next.players[playerId].formula[first.slot];
  if (c) {
    next.players[playerId].formula[first.slot] = {
      ...c,
      stabilityBonus: c.stabilityBonus + 1,
    };
  }
  next.lastEvent = `${next.lastEvent ?? ''} Kokabell: +1 Stabilität.`.trim();
  return next;
}

/** Open Pillendoktora boost choice once per turn after a resolved boost. */
export function tryOpenPillendoktoraBoost(
  state: GameState,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  if (!isV5FormulaEnabled(ruleset)) return state;
  if (state.players[playerId].characterId !== 'pillendoktora') return state;
  if (passiveUsed(state, playerId, 'pillendoktora-boost')) return state;
  if (state.pendingChoice) return state;

  const next = cloneState(state);
  next.pendingChoice = { type: 'pillendoktora-boost', playerId };
  next.lastEvent = `${next.lastEvent ?? ''} Pillendoktora: wähle Boost-Effekt.`.trim();
  return next;
}

export type PillendoktoraOption = 'draw-lose-hp' | 'deal-1' | 'heal-1';

/** Resolve Pillendoktora boost pick and mark passive used. */
export function resolvePillendoktoraBoost(
  state: GameState,
  playerId: PlayerId,
  option: PillendoktoraOption,
  rng: Rng,
  ruleset: RulesetConfig,
): GameState {
  if (state.pendingChoice?.type !== 'pillendoktora-boost') {
    throw new Error('No Pillendoktora pending');
  }
  if (state.pendingChoice.playerId !== playerId) {
    throw new Error('Not Pillendoktora chooser');
  }

  let next = markPassiveUsed(state, playerId, 'pillendoktora-boost');
  next.pendingChoice = null;
  const opp = opponentOf(playerId);

  switch (option) {
    case 'draw-lose-hp':
      next.players[playerId].hp = clampHp(next.players[playerId].hp - 1, ruleset);
      next = drawForPlayer(next, playerId, 1, rng, ruleset, { allowExtra: true });
      next.lastEvent = 'Pillendoktora: 1 gezogen, −1 Leben.';
      break;
    case 'deal-1':
      next.players[opp].hp = clampHp(next.players[opp].hp - 1, ruleset);
      next.lastEvent = 'Pillendoktora: 1 Schaden.';
      break;
    case 'heal-1':
      next.players[playerId].hp = clampHp(next.players[playerId].hp + 1, ruleset);
      next.lastEvent = 'Pillendoktora: +1 Leben.';
      next = tryKokabellStabilityOnHeal(next, playerId, 1, ruleset);
      break;
  }
  return next;
}

/**
 * Dripministerin — once per turn when an opponent formula component is
 * disturbed or destroyed: draw 1 then must-discard.
 */
export function tryDripministerinFilter(
  state: GameState,
  playerId: PlayerId,
  rng: Rng,
  ruleset: RulesetConfig,
): GameState {
  if (!isV5FormulaEnabled(ruleset)) return state;
  if (state.players[playerId].characterId !== 'dripministerin') return state;
  if (passiveUsed(state, playerId, 'dripministerin-filter')) return state;
  if (state.pendingChoice) return state;

  let next = markPassiveUsed(state, playerId, 'dripministerin-filter');
  next = drawForPlayer(next, playerId, 1, rng, ruleset, { allowExtra: true });
  if (next.players[playerId].hand.length === 0) {
    next.lastEvent = `${next.lastEvent ?? ''} Dripministerin: gezogen (nichts abzuwerfen).`.trim();
    return next;
  }
  next.pendingChoice = {
    type: 'must-discard',
    playerId,
    source: 'dripministerin',
  };
  next.lastEvent = `${next.lastEvent ?? ''} Dripministerin: 1 gezogen — wirf 1 ab.`.trim();
  return next;
}

/** Open Mysterium element pick once per turn when playing an element card. */
export function tryOpenMysteriumElement(
  state: GameState,
  playerId: PlayerId,
  subjectInstanceId: string,
  subjectKind: 'element-card' | 'essence',
  ruleset: RulesetConfig,
): GameState {
  if (!isV5FormulaEnabled(ruleset)) return state;
  if (state.players[playerId].characterId !== 'mysterium') return state;
  if (passiveUsed(state, playerId, 'mysterium-element')) return state;
  if (state.pendingChoice) return state;

  const next = cloneState(state);
  next.pendingChoice = {
    type: 'mysterium-element',
    playerId,
    subjectInstanceId,
    subjectKind,
  };
  next.lastEvent = `${next.lastEvent ?? ''} Mysterium: wähle ein Element.`.trim();
  return next;
}

/** Apply chosen Mysterium element for this turn's affinity override. */
export function resolveMysteriumElement(
  state: GameState,
  playerId: PlayerId,
  element: Element,
): GameState {
  if (state.pendingChoice?.type !== 'mysterium-element') {
    throw new Error('No Mysterium pending');
  }
  if (state.pendingChoice.playerId !== playerId) {
    throw new Error('Not Mysterium chooser');
  }

  let next = markPassiveUsed(state, playerId, 'mysterium-element');
  next.pendingChoice = null;
  const prev = next.meta.v5MysteriumElement ?? { p1: null, p2: null };
  next.meta.v5MysteriumElement = {
    p1: prev.p1 ?? null,
    p2: prev.p2 ?? null,
    [playerId]: element,
  };
  next.lastEvent = `Mysterium: Element ${element}.`;
  return next;
}

/** Read and clear Mysterium element override (optional peek without clear). */
export function peekMysteriumElement(
  state: GameState,
  playerId: PlayerId,
): Element | null {
  return state.meta.v5MysteriumElement?.[playerId] ?? null;
}
