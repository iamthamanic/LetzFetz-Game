/**
 * V6 feste Charakter-Passive-Skills (Option B — issue #349).
 * Location: src/game/packs/v6/passiveSkills.ts
 *
 * Player-facing term: **Passive-Skill** (historical grill alias: „Macke“).
 * Power budget: docs/letz-fetz-v6-spielkonzept.md §28.4–28.6 Alt-B grill texts.
 */
export interface V6PassiveSkillDef {
  id: string;
  name: string;
  /** German effect text shown as character passiveText. */
  text: string;
}

/** One fester Passive-Skill per V6 roster id (code ids: passiveSkill*). */
export const V6_CHARACTER_PASSIVE_SKILLS: Record<string, V6PassiveSkillDef> = {
  knuspergnom: {
    id: 'resteverwertung',
    name: 'Resteverwertung',
    text:
      '1×/eigener Zug: Nach der 2. Formeländerung oberste Karte ansehen; oben lassen oder unterlegen.',
  },
  schluckspecht: {
    id: 'erst-mal-gucken',
    name: 'Erst mal gucken',
    text:
      '1×/eigener Zug: Nach Vollblock die obersten 2 Karten ansehen und neu anordnen (behalten oder tauschen).',
  },
  stiernackenkommando: {
    id: 'jetzt-erst-recht',
    name: 'Jetzt erst recht',
    text:
      '1×/eigener Zug: Nach Lebensschaden 1 Handkarte unter den Stapel legen und 1 ziehen.',
  },
  kokabell: {
    id: 'nachjustiert',
    name: 'Nachjustiert',
    text:
      '1×/eigener Zug: Nach Heilung oder Schildgewinn +1 Stabilität an einer eigenen Formelkomponente bis zur nächsten Startphase.',
  },
  pillendoktora: {
    id: 'dosisaenderung',
    name: 'Dosisänderung',
    text: '1×/eigener Zug: Nach Boost 1 ziehen, dann 1 abwerfen.',
  },
  dripministerin: {
    id: 'schwachstelle-erkannt',
    name: 'Schwachstelle erkannt',
    text:
      '1×/eigener Zug: Nach Störung einer gegnerischen Formelkomponente Scry 1 (oben lassen oder unterlegen).',
  },
  mysterium: {
    id: 'falsche-farbe',
    name: 'Falsche Farbe',
    text:
      '1×/eigener Zug: Eine Elementkarte ohne Affinitätselement für Affinität als Affinitätselement behandeln; echtes Element / Impulse / Reaktionen unverändert.',
  },
};

export function getV6PassiveSkillForCharacter(characterId: string): V6PassiveSkillDef | undefined {
  return V6_CHARACTER_PASSIVE_SKILLS[characterId];
}
