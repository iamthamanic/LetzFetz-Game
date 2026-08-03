/**
 * V6 element cards — hand-only (attack / block / boost). Spielkonzept §36.
 * Location: src/content/v6/cards/elementCards.ts
 *
 * Own V6 defs (not Base/V5 with ignored bound). No boundText / bound-build path.
 * Value roles: 2 starter · 3 standard · 4 conditional payoff · 6 raw with drawback.
 * Out of scope: full 60-TE formula matrix.
 */
import type { Element, ElementCardDef, ElementValueRole } from '../../../game/types';

const ELEMENT_LABELS: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

const ELEMENTS: Element[] = ['fire', 'water', 'earth', 'air', 'shadow', 'light'];

const COMBAT_VALUES = [2, 3, 4, 6] as const;

const VALUE_ROLE: Record<(typeof COMBAT_VALUES)[number], ElementValueRole> = {
  2: 'starter',
  3: 'standard',
  4: 'payoff',
  6: 'drawback',
};

const ROLE_LABEL_DE: Record<ElementValueRole, string> = {
  starter: 'Starter',
  standard: 'Standard',
  payoff: 'Payoff',
  drawback: 'Rohwert mit Nachteil',
};

const BOOST_INSTANT: Record<Element, string> = {
  fire: 'Füge dem Gegner 2 Schaden zu.',
  water: 'Heile 2 Leben.',
  earth: 'Eine deiner Formelkomponenten bekommt bis zu deinem nächsten Zug +2 Stabilität.',
  air: 'Ziehe 2 Karten und wirf danach 1 Karte ab.',
  shadow: 'Gegner wirft 1 Karte ab. Gegner wählt.',
  light: 'Ziehe 1 Karte und heile 1 Leben.',
};

function combatInstantText(
  cardType: 'attack' | 'block',
  value: (typeof COMBAT_VALUES)[number],
  role: ElementValueRole,
): string {
  const base =
    cardType === 'attack'
      ? `Angriff ${value}. Würfle 1W6 für Würfelbonus.`
      : `Block ${value}. Würfle 1W6 für Würfelbonus.`;
  if (role === 'payoff') {
    return `${base} Payoff: +1 Wert, wenn der Gegner mindestens eine Formelkomponente mit Fessel hat.`;
  }
  if (role === 'drawback') {
    return `${base} Nachteil: nach dem Kampf −1 Leben.`;
  }
  return `${base} (${ROLE_LABEL_DE[role]})`;
}

function elementCardsFor(element: Element): ElementCardDef[] {
  const label = ELEMENT_LABELS[element];
  const cards: ElementCardDef[] = [];

  for (const value of COMBAT_VALUES) {
    const role = VALUE_ROLE[value];
    cards.push({
      id: `v6-${element}-attack-${value}`,
      name: `${label} ${value} Angriff`,
      kind: 'element',
      element,
      cardType: 'attack',
      value,
      valueRole: role,
      instantText: combatInstantText('attack', value, role),
    });
    cards.push({
      id: `v6-${element}-block-${value}`,
      name: `${label} ${value} Block`,
      kind: 'element',
      element,
      cardType: 'block',
      value,
      valueRole: role,
      instantText: combatInstantText('block', value, role),
    });
  }

  cards.push({
    id: `v6-${element}-boost-3`,
    name: `${label} 3 Boost`,
    kind: 'element',
    element,
    cardType: 'boost',
    value: 3,
    valueRole: 'standard',
    instantText: `${BOOST_INSTANT[element]} (Standard)`,
  });

  return cards;
}

/** V6 element share of the main deck — hand actions only. */
function buildV6ElementCards(): ElementCardDef[] {
  return ELEMENTS.flatMap(elementCardsFor);
}

export const V6_ELEMENT_CARDS: ElementCardDef[] = buildV6ElementCards();

export const V6_ELEMENT_MIX = {
  attack: 24,
  block: 24,
  boost: 6,
  total: 54,
} as const;
