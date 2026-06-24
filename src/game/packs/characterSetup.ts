/**
 * Pure helpers for character setup UI (carousel tabs).
 * Location: src/game/packs/characterSetup.ts
 */
import type { CharacterCardDef, ContentPack, Element, UltimateCardDef } from '../types';
import { BASE_PACK } from './base-pack';

const ELEMENT_LABELS: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

export function formatCharacterElements(elements: [Element, Element]): string {
  if (elements[0] === 'light' && elements[1] === 'shadow') {
    return 'Frei / Frei';
  }
  return `${ELEMENT_LABELS[elements[0]]} / ${ELEMENT_LABELS[elements[1]]}`;
}

export function getUltimateForCharacter(
  character: CharacterCardDef,
  pack: ContentPack = BASE_PACK,
): UltimateCardDef | undefined {
  return pack.ultimates.find((u) => u.id === character.ultimateId);
}
