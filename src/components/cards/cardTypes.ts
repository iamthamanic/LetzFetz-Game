/**
 * Neutral card presentation types — shared across Forge and Play.
 * Location: src/components/cards/cardTypes.ts
 */

export type CardElement =
  | 'Fire'
  | 'Water'
  | 'Earth'
  | 'Air'
  | 'Light'
  | 'Shadow'
  | 'Neutral'
  | 'Frei';

export type CardKind =
  | 'Character'
  | 'Ultimate'
  | 'Element'
  | 'Arena'
  | 'Glitch'
  | 'Formula'
  | 'Item';

export const CARD_KINDS: CardKind[] = [
  'Character',
  'Ultimate',
  'Element',
  'Arena',
  'Glitch',
  'Formula',
  'Item',
];

export const CARD_ELEMENTS: CardElement[] = [
  'Fire',
  'Water',
  'Earth',
  'Air',
  'Light',
  'Shadow',
  'Neutral',
  'Frei',
];

/** German display labels for element badges. */
export const CARD_ELEMENT_DE: Record<CardElement, string> = {
  Fire: 'Feuer',
  Water: 'Wasser',
  Earth: 'Erde',
  Air: 'Luft',
  Shadow: 'Schatten',
  Light: 'Licht',
  Neutral: 'Neutral',
  Frei: 'Frei',
};
