/**
 * V6 character defs — Affinity via elements + fester Passive-Skill (Option B, #349).
 * Location: src/game/packs/v6/characters.ts
 *
 * Affinity = CharacterCardDef.elements (two elements). Engine Affinity ±1 via PICK_V6_AFFINITY.
 * Player term: Passive-Skill. Code fields: passiveSkillId / passiveSkillName / passiveText (no V5 passives/ultis).
 */
import type { CharacterCardDef, Element } from '../../types';
import { BASE_PACK } from '../base-pack';
import { getV6PassiveSkillForCharacter } from './passiveSkills';

const ELEMENT_DE: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

/** V6 cast: same roster ids as Base/V5 for setup continuity; feste Passive-Skills, no Ultis. */
export const V6_CHARACTERS: CharacterCardDef[] = BASE_PACK.characters.map((c) => {
  const skill = getV6PassiveSkillForCharacter(c.id);
  const skillText = skill
    ? `${skill.name}: ${skill.text}`
    : 'Kein fester Passive-Skill (Fallback).';
  return {
    id: c.id,
    name: c.name,
    kind: 'character',
    elements: c.elements,
    role: c.role,
    passiveText: skillText,
    passiveSkillId: skill?.id,
    passiveSkillName: skill?.name,
    ultimateId: '',
    strategyHint: `Nutze Affinität ${ELEMENT_DE[c.elements[0]]}/${ELEMENT_DE[c.elements[1]]} und Passive-Skill ${skill?.name ?? '—'}.`,
  };
});
