/**
 * V5 MVP formula + item card defs (9 + 6).
 * Location: src/game/packs/v5/mvpCards.ts
 */
import type {
  CatalystCardDef,
  EssenceCardDef,
  ItemCardDef,
  TechniqueCardDef,
} from '../../types';

/** MVP Technik ×3 (design epic). */
export const V5_MVP_TECHNIQUES: TechniqueCardDef[] = [
  {
    kind: 'technique',
    id: 'v5-technik-durchschuss',
    name: 'Durchschuss',
    stability: 3,
    activationMode: 'prep_attack',
    effectText: 'Der nächste Angriff ignoriert 1 Schild.',
    formulaEffect: { kind: 'prep_attack', ignoreShield: 1 },
  },
  {
    kind: 'technique',
    id: 'v5-technik-notfallbarriere',
    name: 'Notfallbarriere',
    stability: 4,
    activationMode: 'instant',
    effectText: 'Erhalte 1 Schild.',
    formulaEffect: { kind: 'instant_shield', amount: 1 },
  },
  {
    kind: 'technique',
    id: 'v5-technik-rueckhandtechnik',
    name: 'Rückhandtechnik',
    stability: 3,
    activationMode: 'prep_attack',
    effectText: 'Der nächste Angriff erhält +1.',
    formulaEffect: { kind: 'prep_attack', combatBonus: 1 },
  },
];

/** MVP Essenz ×3. */
export const V5_MVP_ESSENCES: EssenceCardDef[] = [
  {
    kind: 'essence',
    id: 'v5-essenz-eingekochte-glut',
    name: 'Eingekochte Glut',
    element: 'fire',
    stability: 2,
    effectText:
      'Fügt die Formel Lebensschaden zu und entsteht keine Reaktion, erhält das Ziel Brennen.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'brennen' },
  },
  {
    kind: 'essence',
    id: 'v5-essenz-ueberdrucktes-kondensat',
    name: 'Überdrucktes Kondensat',
    element: 'water',
    stability: 3,
    effectText: 'Entsteht keine Reaktion, erhält das Ziel Durchnässt.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'durchnaesst' },
  },
  {
    kind: 'essence',
    id: 'v5-essenz-kraeuterstaub',
    name: 'Kräuterstaub',
    element: 'earth',
    stability: 2,
    effectText: 'Entsteht keine Reaktion, erhält das Ziel High.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'high' },
  },
];

/** MVP Katalysator ×3. */
export const V5_MVP_CATALYSTS: CatalystCardDef[] = [
  {
    kind: 'catalyst',
    id: 'v5-katalysator-echo',
    name: 'Echo',
    stability: 2,
    effectText: 'Wiederhole zu Beginn deines nächsten Zuges 1 Punkt des Primärwerts.',
    // Echo timing deferred — stub as primary_bonus 0 until echo engine slice.
    formulaEffect: { kind: 'primary_bonus', amount: 0 },
  },
  {
    kind: 'catalyst',
    id: 'v5-katalysator-ueberladung',
    name: 'Überladung',
    stability: 2,
    effectText: 'Erhöhe den Primärwert um 2. Nach vollständiger Auflösung verlierst du 1 Leben.',
    formulaEffect: { kind: 'primary_bonus', amount: 2, selfDamage: 1 },
  },
  {
    kind: 'catalyst',
    id: 'v5-katalysator-spiegelung',
    name: 'Spiegelung',
    stability: 3,
    effectText:
      'Offensive Formel: Nach erfolgreichem Treffer erhältst du 1 Schild.',
    formulaEffect: { kind: 'mirror_shield_on_hit', amount: 1 },
  },
];

/** §21 Gegenstände (6) — content present; play wiring may follow in later issues. */
export const V5_MVP_ITEMS: ItemCardDef[] = [
  {
    kind: 'item',
    id: 'v5-item-nasser-socken',
    name: 'Nasser Socken',
    timing: 'action',
    effectText:
      'Die nächste von dir gespielte Elementkarte erhält zusätzlich Wasser. Verursacht sie einen erfolgreichen Treffer, entsteht mindestens Durchnässt, sofern keine Reaktion entsteht.',
  },
  {
    kind: 'item',
    id: 'v5-item-kaputter-rueckspiegel',
    name: 'Kaputter Rückspiegel',
    timing: 'reaction',
    effectText:
      'Wenn du angegriffen wirst: Angriffswert −1. Bei Vollblock erhält der Angreifer Verstrahlt.',
  },
  {
    kind: 'item',
    id: 'v5-item-halbe-dose-energy',
    name: 'Halbe Dose Energy',
    timing: 'action',
    effectText: 'Ziehe 2 Karten. Zu Beginn deines nächsten Zuges verlierst du 1 Leben.',
  },
  {
    kind: 'item',
    id: 'v5-item-rostiger-nagel',
    name: 'Rostiger Nagel',
    timing: 'action',
    effectText: 'Dein nächster Angriff ignoriert 2 Schild.',
  },
  {
    kind: 'item',
    id: 'v5-item-verdaechtiger-pilz',
    name: 'Verdächtiger Pilz',
    timing: 'action',
    effectText: 'Erhalte 2 Schild und High.',
  },
  {
    kind: 'item',
    id: 'v5-item-kabelbinder-deluxe',
    name: 'Kabelbinder Deluxe',
    timing: 'action',
    effectText: 'Störe eine gegnerische Formelkomponente mit Stabilität 3 oder weniger.',
  },
];
