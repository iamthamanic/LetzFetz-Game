/**
 * Authored V3 Fetzgerät parts — 6×(2 Träger + 2 Antrieb + 2 Aufsatz) = 36.
 * Source: docs/art/engine-part-concepts-v3.md + 36er-Kanon.
 * Location: src/game/packs/v3/engineParts36.ts
 *
 * Also exports V3EnginePartRef catalog for 3D registry (same 36 ids).
 */
import type {
  ActivateArchetype,
  Element,
  EnginePartCardDef,
  FetzgeraetSlot,
  PassiveArchetype,
} from '../../types';
import { FETZ_TO_PHRASE } from '../../types';

/** Role → legacy archetype defaults (hooks still use these until effect cutover). */
export const ROLE_BIAS: Record<
  FetzgeraetSlot,
  { passive: PassiveArchetype; activate: ActivateArchetype }
> = {
  traeger: { passive: 'p_atk', activate: 'a_dmg' },
  antrieb: { passive: 'p_draw', activate: 'a_heal' },
  aufsatz: { passive: 'p_block', activate: 'a_exhaust' },
};

interface PartSeed {
  id: string;
  name: string;
  element: Element;
  preferredRole: FetzgeraetSlot;
  resistance: number;
  effectText: string;
  activateCost?: number;
  /** Override activate archetype when Aufsatz is damage-forward. */
  activateArchetype?: ActivateArchetype;
}

const PART_SEEDS: PartSeed[] = [
  // —— Feuer ——
  {
    id: 'v3-part-fire-traeger-01',
    name: 'Kometensehne',
    element: 'fire',
    preferredRole: 'traeger',
    resistance: 4,
    effectText:
      'Einmal pro Zug, wenn dein Angriff trifft: Du darfst 1 Ladung ausgeben. Erzeuge einen Feuerimpuls auf dem Ziel. Falls dadurch eine Elementreaktion entsteht, verursache 1 zusätzlichen direkten Schaden.',
  },
  {
    id: 'v3-part-fire-traeger-02',
    name: 'Magmatreterboots mit Rückwärtsgang',
    element: 'fire',
    preferredRole: 'traeger',
    resistance: 6,
    effectText:
      'Einmal pro Zug, wenn du einen Angriff ankündigst: Du darfst 1 Ladung ausgeben. Der Angriff erhält +1 Angriff. Besitzt das Ziel bereits Brennen, verursache nach der Aktion zusätzlich 1 direkten Schaden.',
  },
  {
    id: 'v3-part-fire-antrieb-01',
    name: 'Rezept für Hitzewallungen',
    element: 'fire',
    preferredRole: 'antrieb',
    resistance: 4,
    effectText:
      'Einmal pro Zug, wenn ein Charakter durch einen Status oder eine Elementreaktion Schaden erleidet: Erhalte 1 Ladung. War Feuer an der Reaktion beteiligt, repariere zusätzlich 1 Widerstand dieses Teils.',
  },
  {
    id: 'v3-part-fire-antrieb-02',
    name: 'Brandbeschleuniger mit TÜV-Siegel',
    element: 'fire',
    preferredRole: 'antrieb',
    resistance: 4,
    effectText:
      'Einmal pro Zug, wenn dein Angriff mindestens 1 Schaden verursacht: Erhalte 1 Ladung. Besitzt das Ziel vor dem Schaden Brennen, erhalte stattdessen 2 Ladungen.',
  },
  {
    id: 'v3-part-fire-aufsatz-01',
    name: 'Aschenhenker',
    element: 'fire',
    preferredRole: 'aufsatz',
    resistance: 4,
    activateCost: 3,
    activateArchetype: 'a_dmg',
    effectText:
      'Aktivieren – 3 Ladungen: Erschöpfe Aschenhenker. Verursache 2 Schaden. Du darfst 1 Brennen vom Ziel entfernen. Falls du dies tust, verursache 2 zusätzlichen Schaden.',
  },
  {
    id: 'v3-part-fire-aufsatz-02',
    name: 'Feuerteufeltrigger',
    element: 'fire',
    preferredRole: 'aufsatz',
    resistance: 3,
    activateCost: 2,
    activateArchetype: 'a_dmg',
    effectText:
      'Aktivieren – 2 Ladungen: Erschöpfe Feuerteufeltrigger. Erzeuge einen Feuerimpuls auf einem Ziel. Falls dadurch eine Elementreaktion entsteht, verursache 1 direkten Schaden.',
  },

  // —— Wasser ——
  {
    id: 'v3-part-water-traeger-01',
    name: 'Rettungsring mit Selbstbeteiligung',
    element: 'water',
    preferredRole: 'traeger',
    resistance: 4,
    effectText:
      'Einmal pro Zug, wenn du Schaden erhalten würdest: Du darfst 1 Ladung ausgeben. Reduziere den Schaden um 1. Wird der Schaden dadurch auf 0 reduziert, erzeuge einen Wasserimpuls auf dem Angreifer.',
  },
  {
    id: 'v3-part-water-traeger-02',
    name: 'Tauchglockenpanzer Modell Badewanne',
    element: 'water',
    preferredRole: 'traeger',
    resistance: 6,
    effectText:
      'Einmal pro Zug, nachdem du einen Block gespielt hast: Du darfst 1 Ladung ausgeben. Erhalte 1 Schild. War es ein Vollblock, erhalte insgesamt 2 Schild.',
  },
  {
    id: 'v3-part-water-antrieb-01',
    name: 'Rostiges Hochdruckreiniger-Ventil',
    element: 'water',
    preferredRole: 'antrieb',
    resistance: 4,
    effectText:
      'Einmal pro Zug, wenn du mindestens 1 Schaden blockst oder 1 Leben heilst: Erhalte 1 Ladung. Bei einem Vollblock oder einer Statusentfernung erhalte stattdessen 2 Ladungen.',
  },
  {
    id: 'v3-part-water-antrieb-02',
    name: 'Waschtrommelturbine',
    element: 'water',
    preferredRole: 'antrieb',
    resistance: 5,
    effectText:
      'Einmal pro Zug, wenn eine Elementmarke oder ein Status entfernt wird: Erhalte 1 Ladung. Wurde die Marke durch eine Elementreaktion entfernt, darfst du anschließend 1 Karte ziehen und 1 Karte abwerfen.',
  },
  {
    id: 'v3-part-water-aufsatz-01',
    name: 'Dominas Wasserpeitschendorn',
    element: 'water',
    preferredRole: 'aufsatz',
    resistance: 3,
    activateCost: 2,
    activateArchetype: 'a_dmg',
    effectText:
      'Aktivieren – 2 Ladungen: Erschöpfe Dominas Wasserpeitschendorn. Verursache 1 Schaden. Erzeuge anschließend einen Wasserimpuls auf dem Ziel. Falls eine Reaktion entsteht, verursache 1 zusätzlichen Schaden.',
  },
  {
    id: 'v3-part-water-aufsatz-02',
    name: 'Unterwasser-Tacker',
    element: 'water',
    preferredRole: 'aufsatz',
    resistance: 4,
    activateCost: 3,
    effectText:
      'Aktivieren – 3 Ladungen: Erschöpfe Unterwasser-Tacker. Erschöpfe ein aufgerichtetes gegnerisches Fetzgerät-Teil. Erzeuge anschließend einen Wasserimpuls auf dessen Besitzer. Besitzt der Gegner kein aufgerichtetes Teil, wirft er stattdessen 1 Karte ab.',
  },

  // —— Erde ——
  {
    id: 'v3-part-earth-traeger-01',
    name: 'Schneewittchens Rosendorn',
    element: 'earth',
    preferredRole: 'traeger',
    resistance: 5,
    effectText:
      'Einmal pro Zug, wenn du einen Block spielst: Du darfst 1 Ladung ausgeben. Der Block erhält +1 Block. Bei einem Vollblock erzeuge einen Erdeimpuls auf dir selbst.',
  },
  {
    id: 'v3-part-earth-traeger-02',
    name: 'Gartenzwerg-Exoskelett',
    element: 'earth',
    preferredRole: 'traeger',
    resistance: 6,
    effectText:
      'Einmal pro Zug, wenn du einen Würfel neu würfelst: Du darfst 1 Ladung ausgeben. Du darfst zwischen dem ursprünglichen und dem neuen Ergebnis wählen. Wurde für den Neuwurf High ausgegeben, repariere zusätzlich 1 Widerstand eines eigenen Fetzgerät-Teils.',
  },
  {
    id: 'v3-part-earth-antrieb-01',
    name: 'nuklear betriebenes Sonnenblumenkernmagazin',
    element: 'earth',
    preferredRole: 'antrieb',
    resistance: 4,
    effectText:
      'Einmal pro Zug, wenn du High erhältst oder einen High-Stapel ausgibst: Erhalte 1 Ladung. Entstand oder wurde High durch eine Erde-Reaktion verwendet, erhalte stattdessen 2 Ladungen.',
  },
  {
    id: 'v3-part-earth-antrieb-02',
    name: 'Sojasoßen-Politur',
    element: 'earth',
    preferredRole: 'antrieb',
    resistance: 4,
    effectText:
      'Einmal pro Zug, wenn du Schild erhältst, einen Vollblock erzielst oder ein Teil reparierst: Erhalte 1 Ladung. Besitzt du mindestens 1 High, darfst du zusätzlich 1 Widerstand eines eigenen Teils reparieren.',
  },
  {
    id: 'v3-part-earth-aufsatz-01',
    name: 'Asphaltbrockenhammer aus kontrolliertem Rückbau',
    element: 'earth',
    preferredRole: 'aufsatz',
    resistance: 5,
    activateCost: 3,
    activateArchetype: 'a_dmg',
    effectText:
      'Aktivieren – 3 Ladungen: Erschöpfe Asphaltbrockenhammer aus kontrolliertem Rückbau. Verursache 2 Schaden an einem gegnerischen Fetzgerät-Teil. Erzeuge anschließend einen Erdeimpuls auf dessen Besitzer. Wird das Teil dadurch zerstört, erhalte 1 Schild.',
  },
  {
    id: 'v3-part-earth-aufsatz-02',
    name: 'Saatbrecheraufsatz mit Keimgarantie',
    element: 'earth',
    preferredRole: 'aufsatz',
    resistance: 3,
    activateCost: 2,
    activateArchetype: 'a_dmg',
    effectText:
      'Aktivieren – 2 Ladungen: Erschöpfe Saatbrecheraufsatz mit Keimgarantie. Erzeuge einen Erdeimpuls auf einem gewählten Charakter. Ziehe anschließend 1 Karte und wirf 1 Karte ab. Falls eine Elementreaktion entsteht, erhalte 1 Ladung.',
  },

  // —— Luft ——
  {
    id: 'v3-part-air-traeger-01',
    name: 'Gleitsegelharnisch mit Gepäckverlust',
    element: 'air',
    preferredRole: 'traeger',
    resistance: 5,
    effectText:
      'Einmal pro Zug, wenn eines deiner Fetzgerät-Teile erschöpft wird: Du darfst 1 Ladung ausgeben. Du erhältst Fokus. War das erschöpfte Teil ein Luftteil, erhalte zusätzlich 1 Schild.',
  },
  {
    id: 'v3-part-air-traeger-02',
    name: 'Drachenflügeldorn in Handgepäckgröße',
    element: 'air',
    preferredRole: 'traeger',
    resistance: 4,
    effectText:
      'Einmal pro Zug, nachdem du einen Würfel neu gewürfelt oder verändert hast: Du darfst 1 Ladung ausgeben. Erzeuge einen Luftimpuls auf dem Ziel der aktuellen Aktion. Falls dadurch eine Reaktion entsteht, erhält die Aktion +1 Angriff oder +1 Block.',
  },
  {
    id: 'v3-part-air-antrieb-01',
    name: 'Tornadoling aus Freilandhaltung',
    element: 'air',
    preferredRole: 'antrieb',
    resistance: 4,
    effectText:
      'Einmal pro Zug, wenn ein Fetzgerät-Teil außerhalb des normalen Zugbeginns erschöpft oder aufgerichtet wird: Erhalte 1 Ladung. Wurde in derselben Aktion ein Teil erschöpft und ein anderes aufgerichtet, erhalte stattdessen 2 Ladungen.',
  },
  {
    id: 'v3-part-air-antrieb-02',
    name: 'Druckluftpfandflasche',
    element: 'air',
    preferredRole: 'antrieb',
    resistance: 5,
    effectText:
      'Einmal pro Zug, wenn du Fokus erhältst oder einen Würfel neu würfelst: Erhalte 1 Ladung. Wurde der Neuwurf durch Fokus ermöglicht, erhalte stattdessen 2 Ladungen.',
  },
  {
    id: 'v3-part-air-aufsatz-01',
    name: 'Sturmpfahl',
    element: 'air',
    preferredRole: 'aufsatz',
    resistance: 4,
    activateCost: 2,
    activateArchetype: 'a_dmg',
    effectText:
      'Aktivieren – 2 Ladungen: Erschöpfe Sturmpfahl. Verursache 1 Schaden. Besitzt das Ziel eine Elementmarke, die nicht Aufgewirbelt ist, erzeuge anschließend einen Luftimpuls. Besitzt es keine passende Marke, verursache stattdessen 1 zusätzlichen Schaden.',
  },
  {
    id: 'v3-part-air-aufsatz-02',
    name: 'Schallmauer-Dosenöffner',
    element: 'air',
    preferredRole: 'aufsatz',
    resistance: 3,
    activateCost: 3,
    effectText:
      'Aktivieren – 3 Ladungen: Erschöpfe Schallmauer-Dosenöffner. Erzeuge einen Luftimpuls auf einem gewählten Charakter. Falls dadurch eine Elementreaktion entsteht, richte ein anderes eigenes erschöpftes Fetzgerät-Teil auf.',
  },

  // —— Schatten ——
  {
    id: 'v3-part-shadow-traeger-01',
    name: 'Lucifers Höllenherz',
    element: 'shadow',
    preferredRole: 'traeger',
    resistance: 6,
    effectText:
      'Einmal pro Zug, wenn der Gegner einen negativen Status erhält: Du darfst 1 Ladung ausgeben. Verursache 1 direkten Schaden. War der Status Verflucht, heile zusätzlich 1 Leben.',
  },
  {
    id: 'v3-part-shadow-traeger-02',
    name: 'Verfluchtes Fieberthermometer',
    element: 'shadow',
    preferredRole: 'traeger',
    resistance: 4,
    effectText:
      'Einmal pro Zug, wenn der Gegner Leben heilt oder Schild erhalten würde: Du darfst 1 Ladung ausgeben. Reduziere die Heilung oder den Schild um 1. Wird der Wert dadurch auf 0 reduziert, erzeuge einen Schattenimpuls auf dem Gegner.',
  },
  {
    id: 'v3-part-shadow-antrieb-01',
    name: 'Nekropulsturbine',
    element: 'shadow',
    preferredRole: 'antrieb',
    resistance: 5,
    effectText:
      'Einmal pro Zug, wenn ein negativer Status angewendet wird: Erhalte 1 Ladung. War der Status Verflucht oder entstand eine Schattenreaktion, erhalte stattdessen 2 Ladungen.',
  },
  {
    id: 'v3-part-shadow-antrieb-02',
    name: 'Geisterbatterie ohne Rückgaberecht',
    element: 'shadow',
    preferredRole: 'antrieb',
    resistance: 4,
    effectText:
      'Einmal pro Zug, wenn ein Spieler eine Karte abwirft oder ein Charakterpassiv-Effekt ignoriert wird: Erhalte 1 Ladung. War der betroffene Spieler dein Gegner, darfst du zusätzlich 1 Widerstand dieses Teils reparieren.',
  },
  {
    id: 'v3-part-shadow-aufsatz-01',
    name: 'Seelenschlucker',
    element: 'shadow',
    preferredRole: 'aufsatz',
    resistance: 4,
    activateCost: 2,
    effectText:
      'Aktivieren – 2 Ladungen: Erschöpfe Seelenschlucker. Der Gegner wirft 1 Karte ab. Ist der Gegner Verflucht, heile zusätzlich 1 Leben.',
  },
  {
    id: 'v3-part-shadow-aufsatz-02',
    name: 'Sargnagel-Automatik',
    element: 'shadow',
    preferredRole: 'aufsatz',
    resistance: 3,
    activateCost: 3,
    effectText:
      'Aktivieren – 3 Ladungen: Erschöpfe Sargnagel-Automatik. Erzeuge einen Schattenimpuls auf dem Gegner. Falls dadurch eine Elementreaktion entsteht, erschöpfe zusätzlich ein gegnerisches Fetzgerät-Teil.',
  },

  // —— Licht ——
  {
    id: 'v3-part-light-traeger-01',
    name: 'Gebrauchte Engelflügel',
    element: 'light',
    preferredRole: 'traeger',
    resistance: 4,
    effectText:
      'Einmal pro Zug, wenn du einen Block spielst oder Leben heilst: Du darfst 1 Ladung ausgeben. Erhalte 1 Schild. Bei einem Vollblock erzeuge zusätzlich einen Lichtimpuls auf dir selbst.',
  },
  {
    id: 'v3-part-light-traeger-02',
    name: 'Lucifers Heiligenschein',
    element: 'light',
    preferredRole: 'traeger',
    resistance: 5,
    effectText:
      'Einmal pro Zug, nachdem du einen negativen Status erhältst: Du darfst 1 Ladung ausgeben. Du erhältst Erleuchtet. Besitzt du bereits Erleuchtet, erhalte stattdessen 1 Schild.',
  },
  {
    id: 'v3-part-light-antrieb-01',
    name: 'Lichtkristallakku',
    element: 'light',
    preferredRole: 'antrieb',
    resistance: 4,
    effectText:
      'Einmal pro Zug, wenn du Schild erhältst oder einen negativen Status entfernst: Erhalte 1 Ladung. Erhältst du gleichzeitig mindestens 2 Schild, erhalte stattdessen 2 Ladungen.',
  },
  {
    id: 'v3-part-light-antrieb-02',
    name: 'Heiligenschein-Lichtmaschine',
    element: 'light',
    preferredRole: 'antrieb',
    resistance: 5,
    effectText:
      'Einmal pro Zug, wenn du einen Vollblock erzielst oder eine Lichtreaktion auslöst: Erhalte 1 Ladung. Geschieht beides in derselben Aktion, erhalte stattdessen 2 Ladungen.',
  },
  {
    id: 'v3-part-light-aufsatz-01',
    name: 'Segenrückstoßschalldämpfer',
    element: 'light',
    preferredRole: 'aufsatz',
    resistance: 3,
    activateCost: 2,
    activateArchetype: 'a_heal',
    effectText:
      'Aktivieren – 2 Ladungen: Erschöpfe Segenrückstoßschalldämpfer. Heile 1 Leben. Erzeuge anschließend einen Lichtimpuls auf dir selbst. Falls dadurch eine Elementreaktion entsteht, erhalte zusätzlich 1 Schild.',
  },
  {
    id: 'v3-part-light-aufsatz-02',
    name: 'Heiligknall',
    element: 'light',
    preferredRole: 'aufsatz',
    resistance: 2,
    activateCost: 3,
    activateArchetype: 'a_dmg',
    effectText:
      'Aktivieren – 3 Ladungen: Erschöpfe Heiligknall. Das Ziel erhält Geblendet. Besitzt das Ziel bereits eine Elementmarke, erzeuge anschließend einen Lichtimpuls auf ihm.',
  },
];

function toDef(seed: PartSeed): EnginePartCardDef {
  const bias = ROLE_BIAS[seed.preferredRole];
  return {
    id: seed.id,
    name: seed.name,
    kind: 'enginePart',
    element: seed.element,
    preferredTag: FETZ_TO_PHRASE[seed.preferredRole],
    preferredRole: seed.preferredRole,
    resistance: seed.resistance,
    passiveArchetype: bias.passive,
    activateArchetype: seed.activateArchetype ?? bias.activate,
    effectText: seed.effectText,
    ...(seed.activateCost != null ? { activateCost: seed.activateCost } : {}),
  };
}

/** Canonical V3 Fetzgerät card defs (36) for V3_PACK / effects. */
export const V3_ENGINE_PART_DEFS: EnginePartCardDef[] = PART_SEEDS.map(toDef);

/** @deprecated Alias — prefer V3_ENGINE_PART_DEFS for card defs. */
export const V3_ENGINE_PART_CARDS: EnginePartCardDef[] = V3_ENGINE_PART_DEFS;

/** Lightweight refs for 3D registry / asset CLI (stable ids + slot + variant). */
export interface V3EnginePartRef {
  id: string;
  name: string;
  slot: FetzgeraetSlot;
  element: Element;
  variant: 1 | 2;
}

function variantFromId(id: string): 1 | 2 {
  const suffix = id.slice(-2);
  return suffix === '02' ? 2 : 1;
}

/** All 36 part refs — order matches authored seeds (3D / registry contract). */
export const V3_ENGINE_PARTS_36: readonly V3EnginePartRef[] = V3_ENGINE_PART_DEFS.map((def) => ({
  id: def.id,
  name: def.name,
  slot: def.preferredRole ?? 'traeger',
  element: def.element,
  variant: variantFromId(def.id),
}));

export const V3_ENGINE_PARTS_36_BY_ID: ReadonlyMap<string, V3EnginePartRef> = new Map(
  V3_ENGINE_PARTS_36.map((p) => [p.id, p]),
);

export function listV3EnginePartIds(): readonly string[] {
  return V3_ENGINE_PARTS_36.map((p) => p.id);
}

/** @deprecated Prefer V3_ENGINE_PART_DEFS — kept for pack index exports. */
export function generateFetzParts(_options?: { count?: number; rng?: () => number }): EnginePartCardDef[] {
  // ponytail: static roster; rng/count ignored after 36 cutover
  return V3_ENGINE_PART_DEFS;
}
