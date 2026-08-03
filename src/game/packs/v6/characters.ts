/**
 * V6 character defs — Affinity via elements + feste Macke (Option B, #349).
 * Location: src/game/packs/v6/characters.ts
 *
 * Affinity = CharacterCardDef.elements (two elements). Engine Affinity ±1 via PICK_V6_AFFINITY.
 * Macke = mackeId / mackeName / passiveText (no V5 passives/ultis).
 */
import type { CharacterCardDef, Element } from '../../types';
import { BASE_PACK } from '../base-pack';
import { getV6MackeForCharacter } from './mackes';

const ELEMENT_DE: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

/** V6 cast: same roster ids as Base/V5 for setup continuity; feste Macken, no Ultis. */
export const V6_CHARACTERS: CharacterCardDef[] = BASE_PACK.characters.map((c) => {
  const macke = getV6MackeForCharacter(c.id);
  const mackeText = macke
    ? `${macke.name}: ${macke.text}`
    : 'Keine feste Macke (Fallback).';
  return {
    id: c.id,
    name: c.name,
    kind: 'character',
    elements: c.elements,
    role: c.role,
    passiveText: mackeText,
    mackeId: macke?.id,
    mackeName: macke?.name,
    ultimateId: '',
    strategyHint: `Nutze Affinität ${ELEMENT_DE[c.elements[0]]}/${ELEMENT_DE[c.elements[1]]} und Macke ${macke?.name ?? '—'}.`,
  };
});
