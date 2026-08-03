/**
 * V3 Fetzgerät slot helpers (Träger / Antrieb / Aufsatz).
 * Location: src/game/engine/status/fetzgeraetSlots.ts
 */
import type {
  BoundCardInstance,
  ContentPack,
  FetzgeraetSlot,
  PhraseSlot,
  RulesetConfig,
} from '../../types';
import { FETZ_TO_PHRASE, PHRASE_TO_FETZ, isV3CombatEnabled } from '../../types';
import { findEnginePartDef, findElementDef } from '../lookup';
import {
  findFirstFreePhraseSlot,
  hasChargeCard,
  occupiedPhraseSlots,
} from '../phraseBuild';

export const FETZ_SLOT_ORDER: FetzgeraetSlot[] = ['traeger', 'antrieb', 'aufsatz'];

export function preferredRoleForPart(
  pack: ContentPack,
  defId: string,
): FetzgeraetSlot | null {
  const part = findEnginePartDef(pack, defId);
  if (!part) return null;
  if (part.preferredRole) return part.preferredRole;
  return PHRASE_TO_FETZ[part.preferredTag];
}

export function occupiedFetzSlots(bound: BoundCardInstance[]): Set<FetzgeraetSlot> {
  const slots = new Set<FetzgeraetSlot>();
  for (const card of bound) {
    if (card.fetzSlot) {
      slots.add(card.fetzSlot);
      continue;
    }
    if (card.phraseSlot && card.phraseSlot !== 'charge') {
      slots.add(PHRASE_TO_FETZ[card.phraseSlot]);
    }
  }
  return slots;
}

export function findFirstFreeFetzSlot(bound: BoundCardInstance[]): FetzgeraetSlot | null {
  const occupied = occupiedFetzSlots(bound);
  for (const slot of FETZ_SLOT_ORDER) {
    if (!occupied.has(slot)) return slot;
  }
  return null;
}

export function canBuildFetzPart(bound: BoundCardInstance[]): boolean {
  return findFirstFreeFetzSlot(bound) !== null;
}

/**
 * Resolve build slot: under v3Combat use Fetzgerät roles; otherwise V2 phrase.
 * Returns both phraseSlot (compat) and fetzSlot (V3).
 */
export function resolveBuildSlots(
  pack: ContentPack,
  defId: string,
  bound: BoundCardInstance[],
  ruleset: RulesetConfig,
): { phraseSlot: PhraseSlot; fetzSlot?: FetzgeraetSlot } {
  const part = findEnginePartDef(pack, defId);
  if (part) {
    if (isV3CombatEnabled(ruleset)) {
      const fetzSlot = findFirstFreeFetzSlot(bound);
      if (!fetzSlot) throw new Error('No free Fetzgerät slot');
      return { phraseSlot: FETZ_TO_PHRASE[fetzSlot], fetzSlot };
    }
    const slot = findFirstFreePhraseSlot(bound);
    if (!slot) throw new Error('No free phrase slot');
    return {
      phraseSlot: slot,
      fetzSlot: slot === 'charge' ? undefined : PHRASE_TO_FETZ[slot],
    };
  }

  const element = findElementDef(pack, defId);
  if (element?.cardType === 'boost') {
    if (hasChargeCard(bound)) throw new Error('Charge slot occupied');
    return { phraseSlot: 'charge' };
  }

  throw new Error('Cannot build this card');
}

export function fetzSlotCards(bound: BoundCardInstance[]): BoundCardInstance[] {
  return bound.filter((b) => {
    if (b.fetzSlot) return true;
    return Boolean(b.phraseSlot && b.phraseSlot !== 'charge');
  });
}

export function effectiveFetzSlot(card: BoundCardInstance): FetzgeraetSlot | null {
  if (card.fetzSlot) return card.fetzSlot;
  if (card.phraseSlot && card.phraseSlot !== 'charge') {
    return PHRASE_TO_FETZ[card.phraseSlot];
  }
  return null;
}

/** Exhaust / upright helpers for Wirbel / Rückenwind. */
export function exhaustFirstUpright(
  bound: BoundCardInstance[],
): BoundCardInstance[] {
  const idx = bound.findIndex((b) => !b.exhausted && effectiveFetzSlot(b));
  if (idx < 0) return bound;
  return bound.map((b, i) => (i === idx ? { ...b, exhausted: true } : b));
}

export function uprightFirstExhausted(
  bound: BoundCardInstance[],
): BoundCardInstance[] {
  const idx = bound.findIndex((b) => b.exhausted && effectiveFetzSlot(b));
  if (idx < 0) return bound;
  return bound.map((b, i) => (i === idx ? { ...b, exhausted: false } : b));
}

export function countOccupiedFetz(bound: BoundCardInstance[]): number {
  return occupiedFetzSlots(bound).size;
}

export function legacyOccupiedCount(bound: BoundCardInstance[]): number {
  return occupiedPhraseSlots(bound).size;
}
