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
    if (!effectiveFetzSlot(card) && card.phraseSlot === 'charge') continue;
    if (card.phraseSlot === 'charge') continue;
    const el = boundPartElement(pack, card);
    if (!el) continue;
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

export interface ResonanceFlags {
  /** Full resonance already used this round (turnNumber). */
  v3FullResonanceUsedRound?: number;
  v3ResonanceFireBurnTickUsed?: boolean;
  v3ResonanceWaterChargeUsed?: boolean;
  v3ResonanceEarthHighUsed?: boolean;
  v3ResonanceAirUprightUsed?: boolean;
  v3ResonanceLightCleanseUsed?: boolean;
  v3ResonanceShadowCurseUsed?: boolean;
}

/** Inferno +1 damage when full fire resonance and not yet used this round. */
export function infernoResonanceBonus(
  state: GameState,
  pack: ContentPack,
  ownerId: PlayerId,
  ruleset: RulesetConfig,
): { bonus: number; state: GameState } {
  if (!isV3CombatEnabled(ruleset)) return { bonus: 0, state };
  const tier = resonanceTierFor(pack, state.players[ownerId].bound, 'fire');
  if (tier < 3) return { bonus: 0, state };
  if (state.meta.v3FullResonanceUsedRound === state.turnNumber) {
    return { bonus: 0, state };
  }
  const next = cloneState(state);
  next.meta = { ...next.meta, v3FullResonanceUsedRound: state.turnNumber };
  return { bonus: 1, state: next };
}

export function hasTwoPartResonance(
  pack: ContentPack,
  bound: BoundCardInstance[],
  element: Element,
): boolean {
  return resonanceTierFor(pack, bound, element) >= 2;
}
