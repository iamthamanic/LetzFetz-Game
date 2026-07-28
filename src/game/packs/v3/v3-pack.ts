/**
 * V3 playtest pack — impulse Fetzen + Fetzgerät parts (§12).
 * Location: src/game/packs/v3/v3-pack.ts
 */
import type { ContentPack, Element, ElementCardDef, RulesetConfig } from '../../types';
import { DEFAULT_RULESET } from '../../types';
import { BASE_PACK } from '../base-pack';
import { V3_ENGINE_PART_DEFS } from './engineParts36';
import { V3_BLUEPRINT_SEED } from './blueprints';

const ELEMENTS: Element[] = ['fire', 'water', 'earth', 'air', 'shadow', 'light'];

const ELEMENT_LABELS: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

/** V3 target mix — 2+2+2 Fetzgerät parts per element (36) → deck 106. */
export const V3_MIX = {
  attack: 24,
  block: 24,
  boost: 12,
  enginePart: 36,
  glitch: 10,
} as const;

/** V3 playtest rules — 30 LP + v3Combat. */
export const V3_PACK_RULESET: RulesetConfig = {
  ...DEFAULT_RULESET,
  startingHp: 30,
  maxHp: 30,
  mainDeckSize: 106,
  v3Combat: true,
};

const BOOST_VALUES = [1, 3] as const;

function makeAttack(
  element: Element,
  value: number,
  copy: number,
  withImpulse: boolean,
): ElementCardDef {
  const label = ELEMENT_LABELS[element];
  return {
    id: `v3-${element}-attack-${value}-${copy}`,
    name: `${label} ${value} Angriff`,
    kind: 'element',
    element,
    cardType: 'attack',
    value,
    instantText: withImpulse
      ? `Angriff ${value}. Treffer: Erzeuge einen ${label}-Impuls.`
      : `Angriff ${value}. Würfle 1W6 für Würfelbonus.`,
    boundText: 'V3: Angriff bleibt Hand-only.',
    ...(withImpulse
      ? { elementImpulse: { element, trigger: 'onHit' as const } }
      : {}),
  };
}

function makeBlock(
  element: Element,
  value: number,
  copy: number,
  withImpulse: boolean,
): ElementCardDef {
  const label = ELEMENT_LABELS[element];
  return {
    id: `v3-${element}-block-${value}-${copy}`,
    name: `${label} ${value} Block`,
    kind: 'element',
    element,
    cardType: 'block',
    value,
    instantText: withImpulse
      ? `Block ${value}. Vollblock: Erzeuge einen ${label}-Impuls auf dem Angreifer.`
      : `Block ${value}. Würfle 1W6 für Würfelbonus.`,
    boundText: 'V3: Block bleibt Hand-only.',
    ...(withImpulse
      ? { elementImpulse: { element, trigger: 'onFullBlock' as const } }
      : {}),
  };
}

function makeBoost(element: Element, value: number): ElementCardDef {
  const label = ELEMENT_LABELS[element];
  return {
    id: `v3-${element}-boost-${value}`,
    name: `${label} ${value} Ladung`,
    kind: 'element',
    element,
    cardType: 'boost',
    value,
    instantText: `Ladung ${value}. Als Boost / Ladung bauen.`,
    boundText: 'V3: Ladung für Fetzgerät-Aktivierung.',
  };
}

/**
 * Build V3 element cards: 24/24/12.
 * Majority of attacks (3/4) and blocks (3/4) carry matching elementImpulse.
 */
export function buildV3ElementCards(): ElementCardDef[] {
  const cards: ElementCardDef[] = [];

  for (const element of ELEMENTS) {
    cards.push(makeAttack(element, 2, 1, true));
    cards.push(makeAttack(element, 4, 1, true));
    cards.push(makeAttack(element, 6, 1, true));
    cards.push(makeAttack(element, 4, 2, false)); // minority without impulse
  }

  for (const element of ELEMENTS) {
    cards.push(makeBlock(element, 2, 1, true));
    cards.push(makeBlock(element, 4, 1, true));
    cards.push(makeBlock(element, 6, 1, true));
    cards.push(makeBlock(element, 4, 2, false));
  }

  for (const element of ELEMENTS) {
    for (const value of BOOST_VALUES) {
      cards.push(makeBoost(element, value));
    }
  }

  return cards;
}

export function buildV3Pack(_seed = 20260725): ContentPack {
  const elementCards = buildV3ElementCards();
  const glitches = BASE_PACK.glitches.slice(0, V3_MIX.glitch);

  return {
    id: 'v3-playtest',
    name: 'Letz Fetz V3 Playtest',
    version: '0.2.0',
    characters: BASE_PACK.characters,
    ultimates: BASE_PACK.ultimates,
    arenas: BASE_PACK.arenas,
    elementCards,
    glitches,
    engineParts: V3_ENGINE_PART_DEFS,
    blueprints: V3_BLUEPRINT_SEED,
  };
}

export const V3_PACK = buildV3Pack();
