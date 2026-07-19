/**
 * V2 P100 playtest pack — Ggen engine parts + calibrated element mix.
 * Location: src/game/packs/v2/p100-pack.ts
 * Engine still follows V1 until V2 is released; this pack is content + deck size.
 */
import type { ContentPack, Element, ElementCardDef } from '../../types';
import { createSeededRng } from '../../engine/deck';
import { BASE_PACK } from '../base-pack';
import { generateEngineParts } from './generateEngineParts';

const ELEMENTS: Element[] = ['fire', 'water', 'earth', 'air', 'shadow', 'light'];

const ELEMENT_LABELS: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

/** P100 target mix (D34). */
export const P100_MIX = {
  attack: 24,
  block: 24,
  boost: 12,
  enginePart: 30,
  glitch: 10,
} as const;

const BOOST_VALUES = [1, 3] as const;

function makeAttack(element: Element, value: number, copy: number): ElementCardDef {
  const label = ELEMENT_LABELS[element];
  return {
    id: `v2-${element}-attack-${value}-${copy}`,
    name: `${label} ${value} Angriff`,
    kind: 'element',
    element,
    cardType: 'attack',
    value,
    instantText: `Angriff ${value}. Würfle 1W6 für Würfelbonus.`,
    boundText: 'V2: Angriff bleibt Hand-only — nicht bauen.',
  };
}

function makeBlock(element: Element, value: number, copy: number): ElementCardDef {
  const label = ELEMENT_LABELS[element];
  return {
    id: `v2-${element}-block-${value}-${copy}`,
    name: `${label} ${value} Block`,
    kind: 'element',
    element,
    cardType: 'block',
    value,
    instantText: `Block ${value}. Würfle 1W6 für Würfelbonus.`,
    boundText: 'V2: Block bleibt Hand-only — nicht bauen.',
  };
}

function makeBoost(element: Element, value: number): ElementCardDef {
  const label = ELEMENT_LABELS[element];
  return {
    id: `v2-${element}-boost-${value}`,
    name: `${label} ${value} Ladung`,
    kind: 'element',
    element,
    cardType: 'boost',
    value,
    instantText: `Ladung ${value}. In den Ladungs-Slot bauen (V2 H2).`,
    boundText: 'V2: nur Ladungs-Slot.',
  };
}

/** Build P100 element cards: 24/24/12 across six elements. */
export function buildP100ElementCards(): ElementCardDef[] {
  const cards: ElementCardDef[] = [];

  // 24 attacks = 4 per element (values 2,4,6 + one extra 4)
  for (const element of ELEMENTS) {
    cards.push(makeAttack(element, 2, 1));
    cards.push(makeAttack(element, 4, 1));
    cards.push(makeAttack(element, 6, 1));
    cards.push(makeAttack(element, 4, 2));
  }

  // 24 blocks — same pattern
  for (const element of ELEMENTS) {
    cards.push(makeBlock(element, 2, 1));
    cards.push(makeBlock(element, 4, 1));
    cards.push(makeBlock(element, 6, 1));
    cards.push(makeBlock(element, 4, 2));
  }

  // 12 boosts = 2 per element
  for (const element of ELEMENTS) {
    for (const value of BOOST_VALUES) {
      cards.push(makeBoost(element, value));
    }
  }

  return cards;
}

export function buildV2P100Pack(seed = 20260719): ContentPack {
  const rng = createSeededRng(seed);
  const elementCards = buildP100ElementCards();
  const engineParts = generateEngineParts({ count: P100_MIX.enginePart, rng });
  const glitches = BASE_PACK.glitches.slice(0, P100_MIX.glitch);

  return {
    id: 'v2-p100',
    name: 'Letz Fetz V2 P100 Playtest',
    version: '0.1.0-draft',
    characters: BASE_PACK.characters,
    ultimates: BASE_PACK.ultimates,
    arenas: BASE_PACK.arenas,
    elementCards,
    glitches,
    engineParts,
  };
}

export const V2_P100_PACK = buildV2P100Pack();
