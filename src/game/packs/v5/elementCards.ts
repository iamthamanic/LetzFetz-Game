/**
 * V5 element mix for §3.1 — 24 attack + 24 block + 6 boost = 54.
 * Location: src/game/packs/v5/elementCards.ts
 */
import type { Element, ElementCardDef } from '../../types';

const ELEMENT_LABELS: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

const BOUND_ACTIVATE: Record<Element, string> = {
  fire: 'Aktivieren: Füge dem Gegner 2 Schaden zu.',
  water: 'Aktivieren: Heile 2 Leben.',
  earth: 'Aktivieren: Eine deiner gebauten Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.',
  air: 'Aktivieren: Ziehe 2 Karten und wirf danach 1 Karte ab.',
  shadow: 'Aktivieren: Erschöpfe 1 gegnerische gebaute Karte.',
  light: 'Aktivieren: Ziehe 1 Karte und heile 1 Leben.',
};

const BOOST_INSTANT: Record<Element, string> = {
  fire: 'Füge dem Gegner 2 Schaden zu.',
  water: 'Heile 2 Leben.',
  earth: 'Eine deiner gebauten Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.',
  air: 'Ziehe 2 Karten und wirf danach 1 Karte ab.',
  shadow: 'Gegner wirft 1 Karte ab. Gegner wählt.',
  light: 'Ziehe 1 Karte und heile 1 Leben.',
};

const ELEMENTS: Element[] = ['fire', 'water', 'earth', 'air', 'shadow', 'light'];

/** Combat values: 4 attack + 4 block per element → 24+24. */
const COMBAT_VALUES = [2, 3, 4, 6] as const;

function elementCardsFor(element: Element): ElementCardDef[] {
  const label = ELEMENT_LABELS[element];
  const bound = BOUND_ACTIVATE[element];
  const boostInstant = BOOST_INSTANT[element];
  const cards: ElementCardDef[] = [];

  for (const value of COMBAT_VALUES) {
    cards.push({
      id: `${element}-attack-${value}`,
      name: `${label} ${value} Angriff`,
      kind: 'element',
      element,
      cardType: 'attack',
      value,
      instantText: `Angriff ${value}. Würfle 1W6 für Würfelbonus.`,
      boundText: bound,
    });
    cards.push({
      id: `${element}-block-${value}`,
      name: `${label} ${value} Block`,
      kind: 'element',
      element,
      cardType: 'block',
      value,
      instantText: `Block ${value}. Würfle 1W6 für Würfelbonus.`,
      boundText: bound,
    });
  }

  // One boost per element → 6 total (§3.1).
  cards.push({
    id: `${element}-boost-3`,
    name: `${label} 3 Boost`,
    kind: 'element',
    element,
    cardType: 'boost',
    value: 3,
    instantText: boostInstant,
    boundText: bound,
  });

  return cards;
}

/** Spielkonzept §3.1 element share of the main deck. */
export function buildV5ElementCards(): ElementCardDef[] {
  return ELEMENTS.flatMap(elementCardsFor);
}

export const V5_ELEMENT_CARDS: ElementCardDef[] = buildV5ElementCards();

export const V5_ELEMENT_MIX = {
  attack: 24,
  block: 24,
  boost: 6,
  total: 54,
} as const;
