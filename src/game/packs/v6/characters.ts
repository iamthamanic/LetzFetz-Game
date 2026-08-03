/**
 * V6 character defs — affinity scaffold, no V5 passives/ultimates.
 * Location: src/game/packs/v6/characters.ts
 *
 * Affinity = CharacterCardDef.elements (two elements). Engine Affinity ±1 via PICK_V6_AFFINITY.
 */
import type { CharacterCardDef, Element } from '../../types';
import { BASE_PACK } from '../base-pack';

const ELEMENT_DE: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

function affinityScaffoldText(elements: [Element, Element]): string {
  const a = ELEMENT_DE[elements[0]];
  const b = ELEMENT_DE[elements[1]];
  return (
    `Affinität ${a}/${b}: 1× pro eigenem Zug/Durchlauf ±1 auf Wert oder eigenen W6 ` +
    `einer Karte/Formel dieser Elemente (nach dem Wurf). Keine V5-Passive, keine Ulti.`
  );
}

/** V6 cast: same roster ids as Base/V5 for setup continuity; stripped of V5 power text. */
export const V6_CHARACTERS: CharacterCardDef[] = BASE_PACK.characters.map((c) => ({
  id: c.id,
  name: c.name,
  kind: 'character',
  elements: c.elements,
  role: c.role,
  passiveText: affinityScaffoldText(c.elements),
  ultimateId: '',
  strategyHint: `Nutze Affinität ${ELEMENT_DE[c.elements[0]]}/${ELEMENT_DE[c.elements[1]]}; Formeln statt Ultis.`,
}));
