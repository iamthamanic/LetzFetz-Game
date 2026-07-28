/**
 * V3 Fetzgerät element resonance (§13).
 * Location: src/game/engine/status/resonance.ts
 */
import type { BoundCardInstance, Element, GameState, PlayerId, RulesetConfig } from '../../types';
import { isV3CombatEnabled } from '../../types';
import { findElementDef, findEnginePartDef } from '../lookup';
import type { ContentPack } from '../../types';
import { effectiveFetzSlot } from './fetzgeraetSlots';
import { cloneState } from '../helpers';

export type ResonanceTier = 0 | 2 | 3;

export function boundPartElement(
  pack: ContentPack,
  card: BoundCardInstance,
): Element | null {
  const part = findEnginePartDef(pack, card.defId);
  if (part) return part.element;
  const el = findElementDef(pack, card.defId);
  return el?.element ?? card.treatedElement ?? null;
}

/** Count built role parts (not charge) per element. */
export function countPartsByElement(
  pack: ContentPack,
  bound: BoundCardInstance[],
): Partial<Record<Element, number>> {
  const counts: Partial<Record<Element, number>> = {};
  for (const card of bound) {
    if (card.phraseSlot === 'charge') continue;
    const el = boundPartElement(pack, card);
    if (!el) continue;
    // Prefer fetz role when present; otherwise count as part if engine part
    if (!effectiveFetzSlot(card) && !findEnginePartDef(pack, card.defId)) continue;
    counts[el] = (counts[el] ?? 0) + 1;
  }
  return counts;
}

export function resonanceTierFor(
  pack: ContentPack,
  bound: BoundCardInstance[],
  element: Element,
): ResonanceTier {
  const n = countPartsByElement(pack, bound)[element] ?? 0;
  if (n >= 3) return 3;
  if (n >= 2) return 2;
  return 0;
}

export function hasTwoPartResonance(
  pack: ContentPack,
  bound: BoundCardInstance[],
  element: Element,
): boolean {
  return resonanceTierFor(pack, bound, element) >= 2;
}

export function hasFullResonance(
  pack: ContentPack,
  bound: BoundCardInstance[],
  element: Element,
): boolean {
  return resonanceTierFor(pack, bound, element) >= 3;
}

function fullResonanceAvailable(state: GameState): boolean {
  return state.meta.v3FullResonanceUsedRound !== state.turnNumber;
}

function markFullResonanceUsed(state: GameState): GameState {
  const next = cloneState(state);
  next.meta = { ...next.meta, v3FullResonanceUsedRound: state.turnNumber };
  return next;
}

/** Inferno +1 damage when full fire resonance and not yet used this round. */
export function infernoResonanceBonus(
  state: GameState,
  pack: ContentPack,
  ownerId: PlayerId,
  ruleset: RulesetConfig,
): { bonus: number; state: GameState } {
  if (!isV3CombatEnabled(ruleset)) return { bonus: 0, state };
  if (!hasFullResonance(pack, state.players[ownerId].bound, 'fire')) {
    return { bonus: 0, state };
  }
  if (!fullResonanceAvailable(state)) return { bonus: 0, state };
  return { bonus: 1, state: markFullResonanceUsed(state) };
}

/** Überflutung: full water resonance → Überflutet costs +2 (encoded as stack note via meta). */
export function ueberflutungExtraCharge(
  state: GameState,
  pack: ContentPack,
  ownerId: PlayerId,
  ruleset: RulesetConfig,
): { extraCharge: number; state: GameState } {
  if (!isV3CombatEnabled(ruleset)) return { extraCharge: 0, state };
  if (!hasFullResonance(pack, state.players[ownerId].bound, 'water')) {
    return { extraCharge: 0, state };
  }
  if (!fullResonanceAvailable(state)) return { extraCharge: 0, state };
  return { extraCharge: 1, state: markFullResonanceUsed(state) };
}

/** Deep High: full earth → draw 2 discard 1 (vs draw 1 discard 1). */
export function deepHighExtraDraw(
  state: GameState,
  pack: ContentPack,
  ownerId: PlayerId,
  ruleset: RulesetConfig,
): { extraDraw: number; state: GameState } {
  if (!isV3CombatEnabled(ruleset)) return { extraDraw: 0, state };
  if (!hasFullResonance(pack, state.players[ownerId].bound, 'earth')) {
    return { extraDraw: 0, state };
  }
  if (!fullResonanceAvailable(state)) return { extraDraw: 0, state };
  return { extraDraw: 1, state: markFullResonanceUsed(state) };
}

/** Rückenwind: full air → upright up to 2 parts. */
export function rueckenwindUprightLimit(
  state: GameState,
  pack: ContentPack,
  ownerId: PlayerId,
  ruleset: RulesetConfig,
): { limit: number; state: GameState } {
  if (!isV3CombatEnabled(ruleset)) return { limit: 1, state };
  if (!hasFullResonance(pack, state.players[ownerId].bound, 'air')) {
    return { limit: 1, state };
  }
  if (!fullResonanceAvailable(state)) return { limit: 1, state };
  return { limit: 2, state: markFullResonanceUsed(state) };
}

/** Erleuchtung: full light → remove up to 2 negatives. */
export function erleuchtungCleanseLimit(
  state: GameState,
  pack: ContentPack,
  ownerId: PlayerId,
  ruleset: RulesetConfig,
): { limit: number; state: GameState } {
  if (!isV3CombatEnabled(ruleset)) return { limit: 1, state };
  if (!hasFullResonance(pack, state.players[ownerId].bound, 'light')) {
    return { limit: 1, state };
  }
  if (!fullResonanceAvailable(state)) return { limit: 1, state };
  return { limit: 2, state: markFullResonanceUsed(state) };
}

/** Tiefer Fluch: full shadow → max stacks temporarily 4 once. */
export function tieferFluchMaxStacks(
  state: GameState,
  pack: ContentPack,
  ownerId: PlayerId,
  ruleset: RulesetConfig,
): { maxStacks: number; state: GameState } {
  if (!isV3CombatEnabled(ruleset)) return { maxStacks: 3, state };
  if (!hasFullResonance(pack, state.players[ownerId].bound, 'shadow')) {
    return { maxStacks: 3, state };
  }
  if (!fullResonanceAvailable(state)) return { maxStacks: 3, state };
  return { maxStacks: 4, state: markFullResonanceUsed(state) };
}

/** Two-part water: first water reaction this round grants a Ladung (boost) to hand — KISS: +1 lastEvent only / meta flag. */
export function tryTwoPartWaterReactionCharge(
  state: GameState,
  pack: ContentPack,
  ownerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  if (!isV3CombatEnabled(ruleset)) return state;
  if (!hasTwoPartResonance(pack, state.players[ownerId].bound, 'water')) return state;
  if (state.meta.v3ResonanceWaterChargeUsed) return state;
  const next = cloneState(state);
  next.meta = { ...next.meta, v3ResonanceWaterChargeUsed: true };
  next.lastEvent = `${next.lastEvent ?? ''} Wasser-Resonanz: +1 Ladung.`.trim();
  return next;
}
