/**
 * V2 phrase board build helpers — slot assignment and legality.
 * Location: src/game/engine/phraseBuild.ts
 */
import type { BoundCardInstance, ContentPack, PhraseSlot } from '../types';
import { findElementDef, findEnginePartDef } from './lookup';

export const PHRASE_SLOT_ORDER: PhraseSlot[] = ['core', 'mode', 'tool'];

/** V2 matches use packs that include engine parts. */
export function isV2Pack(pack: ContentPack): boolean {
  return (pack.engineParts?.length ?? 0) > 0;
}

export function occupiedPhraseSlots(bound: BoundCardInstance[]): Set<PhraseSlot> {
  const slots = new Set<PhraseSlot>();
  for (const card of bound) {
    if (card.phraseSlot) slots.add(card.phraseSlot);
  }
  return slots;
}

/** First empty core → mode → tool slot. */
export function findFirstFreePhraseSlot(bound: BoundCardInstance[]): PhraseSlot | null {
  const occupied = occupiedPhraseSlots(bound);
  for (const slot of PHRASE_SLOT_ORDER) {
    if (!occupied.has(slot)) return slot;
  }
  return null;
}

export function hasChargeCard(bound: BoundCardInstance[]): boolean {
  return bound.some((b) => b.phraseSlot === 'charge');
}

export function canBuildEnginePart(bound: BoundCardInstance[]): boolean {
  return findFirstFreePhraseSlot(bound) !== null;
}

export function canBuildBoost(bound: BoundCardInstance[]): boolean {
  return !hasChargeCard(bound);
}

export function phraseSlotCards(bound: BoundCardInstance[]): BoundCardInstance[] {
  return bound.filter((b) => b.phraseSlot && b.phraseSlot !== 'charge');
}

/** Resolve target slot after optional discard (V2 bind phase). */
export function resolveV2BuildSlot(
  pack: ContentPack,
  defId: string,
  bound: BoundCardInstance[],
): PhraseSlot {
  const part = findEnginePartDef(pack, defId);
  if (part) {
    const slot = findFirstFreePhraseSlot(bound);
    if (!slot) throw new Error('No free phrase slot');
    return slot;
  }

  const element = findElementDef(pack, defId);
  if (element?.cardType === 'boost') {
    if (hasChargeCard(bound)) throw new Error('Charge slot occupied');
    return 'charge';
  }

  throw new Error('Cannot build this card in V2');
}
