/**
 * V6 core Gegenstände — Ausrüstung (2 slots) + Verbrauch (§37–40).
 * Location: src/content/v6/cards/itemCards.ts
 *
 * SoT for V6_CORE_PACK.items. Effects resolved in engine via item slug
 * (shared with V5 where text matches).
 */
import type { ItemCardDef } from '../../../game/types';

/** V6 Ausrüstung — board slots (max 2). */
export const V6_EQUIPMENT_ITEMS: ItemCardDef[] = [
  {
    kind: 'item',
    id: 'v6-item-kaputter-rueckspiegel',
    name: 'Kaputter Rückspiegel',
    timing: 'reaction',
    permanence: 'equipment',
    effectText:
      'Ausrüstung. Einmal pro eigenem Zug, wenn du angegriffen wirst: Angriffswert −1. Bei Vollblock erhält der Angreifer Verstrahlt.',
  },
  {
    kind: 'item',
    id: 'v6-item-werkzeugkoffer',
    name: 'Werkzeugkoffer',
    timing: 'action',
    permanence: 'equipment',
    effectText:
      'Ausrüstung. Einmal pro eigenem Zug aktivieren: Wirf 1 Handkarte ab und ziehe 1 Karte.',
  },
  {
    kind: 'item',
    id: 'v6-item-gezinkter-wuerfel',
    name: 'Gezinkter Würfel',
    timing: 'reaction',
    permanence: 'equipment',
    effectText:
      'Ausrüstung. Einmal pro eigenem Zug im Kampf: Verändere den Angriffswert um ±1 (Abwehrhilfe).',
  },
];

/** V6 Verbrauch — hand play, no permanent equipment slot. */
export const V6_CONSUMABLE_ITEMS: ItemCardDef[] = [
  {
    kind: 'item',
    id: 'v6-item-halbe-dose-energy',
    name: 'Halbe Dose Energy',
    timing: 'action',
    permanence: 'consumable',
    effectText: 'Ziehe 2 Karten. Zu Beginn deines nächsten Zuges verlierst du 1 Leben.',
  },
  {
    kind: 'item',
    id: 'v6-item-verdaechtiger-pilz',
    name: 'Verdächtiger Pilz',
    timing: 'action',
    permanence: 'consumable',
    effectText: 'Erhalte 2 Schild und High.',
  },
  {
    kind: 'item',
    id: 'v6-item-kabelbinder-deluxe',
    name: 'Kabelbinder Deluxe',
    timing: 'action',
    permanence: 'consumable',
    effectText: 'Störe eine gegnerische Formelkomponente mit Stabilität 3 oder weniger.',
  },
  {
    kind: 'item',
    id: 'v6-item-rostiger-nagel',
    name: 'Rostiger Nagel',
    timing: 'action',
    permanence: 'consumable',
    effectText:
      'Verbrauch. Dein nächster Angriff ignoriert 2 Schild. Belegt keinen Ausrüstungsslot.',
  },
  {
    kind: 'item',
    id: 'v6-item-nasser-socken',
    name: 'Nasser Socken',
    timing: 'action',
    permanence: 'consumable',
    effectText:
      'Verbrauch. Dein nächster Angriff erhält zusätzlich Wasser; bei Treffer ohne Reaktion mindestens Durchnässt. Belegt keinen Ausrüstungsslot.',
  },
];

/** Full V6 item set for the core pack (8). */
export const V6_ITEMS: ItemCardDef[] = [...V6_EQUIPMENT_ITEMS, ...V6_CONSUMABLE_ITEMS];
