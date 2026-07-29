/**
 * Display DTOs for Fetzgerät adapters + pair/full resonance hints (Brief §9).
 * Location: src/game/engine/adapterPairDisplay.ts
 * Pure TS — no React, DOM, or Three.js. Not match truth.
 */
import type {
  BoundCardInstance,
  ContentPack,
  Element,
  RulesetConfig,
} from '../types';
import { isV3CombatEnabled } from '../types';
import type { EngineRecipe } from '../types/engineVisual';
import { boundToRecipe } from './engineRecipe';
import { findEnginePartDef } from './lookup';
import { resonanceTierFor, type ResonanceTier } from './status/resonance';

/** Visual joint between assembled parts (mesh selection later — YAGNI). */
export type AdapterKind = 'drive' | 'attachment';

export interface AdapterSelection {
  kind: AdapterKind;
  /** German HUD / montage hint. */
  labelDe: string;
  fromSlot: 'traeger' | 'antrieb';
  toSlot: 'antrieb' | 'aufsatz';
  /** Element of the part being attached, when known from pack. */
  element: Element | null;
}

/** Pair (tier 2) or full (tier 3) resonance copy for HUD — not applied effects. */
export interface PairReactionDisplay {
  element: Element;
  tier: 2 | 3;
  titleDe: string;
  textDe: string;
}

/** V3 §13 two-part resonance — display only (engine applies via resonance.ts). */
const PAIR_REACTION_TEXT: Record<Element, { titleDe: string; textDe: string }> = {
  fire: {
    titleDe: 'Feuer-Paarresonanz',
    textDe: 'Erster Brennen-Stapel pro Runde verursacht sofort einen Schaden.',
  },
  water: {
    titleDe: 'Wasser-Paarresonanz',
    textDe: 'Erste Wasserreaktion pro Runde erzeugt eine Ladung.',
  },
  earth: {
    titleDe: 'Erde-Paarresonanz',
    textDe: 'Erstes ausgegebenes High pro Zug erzeugt eine Ladung.',
  },
  air: {
    titleDe: 'Luft-Paarresonanz',
    textDe:
      'Erstes erschöpftes eigenes Teil pro Runde darf sofort wieder aufgerichtet werden.',
  },
  light: {
    titleDe: 'Licht-Paarresonanz',
    textDe: 'Erste Reinigung pro Runde erzeugt einen Schild.',
  },
  shadow: {
    titleDe: 'Schatten-Paarresonanz',
    textDe: 'Erster angewendeter Fluch pro Runde darf auf zwei Stapel erhöht werden.',
  },
};

/** V3 §13 full resonance — display only. */
const FULL_REACTION_TEXT: Record<Element, { titleDe: string; textDe: string }> = {
  fire: {
    titleDe: 'Feuer-Volle Resonanz',
    textDe: 'Inferno verursacht einen zusätzlichen Schaden.',
  },
  water: {
    titleDe: 'Wasser-Volle Resonanz',
    textDe: 'Überflutet erhöht die Kosten um zwei Ladungen statt einer.',
  },
  earth: {
    titleDe: 'Erde-Volle Resonanz',
    textDe: 'Deep High zieht zwei Karten und wirft nur eine ab.',
  },
  air: {
    titleDe: 'Luft-Volle Resonanz',
    textDe: 'Rückenwind richtet bis zu zwei Teile auf.',
  },
  light: {
    titleDe: 'Licht-Volle Resonanz',
    textDe: 'Erleuchtung entfernt bis zu zwei negative Status.',
  },
  shadow: {
    titleDe: 'Schatten-Volle Resonanz',
    textDe: 'Tiefer Fluch kann das Maximum einmalig auf vier erhöhen.',
  },
};

const ELEMENT_ORDER: readonly Element[] = [
  'fire',
  'water',
  'earth',
  'air',
  'light',
  'shadow',
];

function partElement(pack: ContentPack, defId: string | undefined): Element | null {
  if (!defId) return null;
  return findEnginePartDef(pack, defId)?.element ?? null;
}

/**
 * Deterministic adapter joints for an assembled recipe.
 * Incomplete / empty → []. Never throws.
 */
export function selectAdapters(
  recipe: EngineRecipe,
  pack: ContentPack,
): AdapterSelection[] {
  const out: AdapterSelection[] = [];
  const hasCarrier = Boolean(recipe.carrierId);
  const hasDrive = Boolean(recipe.driveId);
  const hasAttachment = Boolean(recipe.attachmentId);

  if (hasCarrier && hasDrive) {
    out.push({
      kind: 'drive',
      labelDe: 'Adapter Antrieb',
      fromSlot: 'traeger',
      toSlot: 'antrieb',
      element: partElement(pack, recipe.driveId),
    });
  }

  if (hasAttachment && (hasDrive || hasCarrier)) {
    out.push({
      kind: 'attachment',
      labelDe: 'Adapter Aufsatz',
      fromSlot: hasDrive ? 'antrieb' : 'traeger',
      toSlot: 'aufsatz',
      element: partElement(pack, recipe.attachmentId),
    });
  }

  return out;
}

/**
 * Adapter joints from bound role cards (derives recipe first).
 * Incomplete → []. Never throws.
 */
export function selectAdaptersFromBound(
  bound: BoundCardInstance[],
  pack: ContentPack,
): AdapterSelection[] {
  return selectAdapters(boundToRecipe(bound), pack);
}

/**
 * Pair + full resonance display DTOs for HUD (V3 §13 prose).
 * V1 / v3Combat off → []. Incomplete bound → []. Never throws.
 */
export function resolvePairReactions(
  bound: BoundCardInstance[],
  pack: ContentPack,
  ruleset: RulesetConfig,
): PairReactionDisplay[] {
  if (!isV3CombatEnabled(ruleset)) return [];

  const out: PairReactionDisplay[] = [];
  for (const element of ELEMENT_ORDER) {
    const tier: ResonanceTier = resonanceTierFor(pack, bound, element);
    if (tier >= 2) {
      const pair = PAIR_REACTION_TEXT[element];
      out.push({
        element,
        tier: 2,
        titleDe: pair.titleDe,
        textDe: pair.textDe,
      });
    }
    if (tier >= 3) {
      const full = FULL_REACTION_TEXT[element];
      out.push({
        element,
        tier: 3,
        titleDe: full.titleDe,
        textDe: full.textDe,
      });
    }
  }
  return out;
}

/** Alias matching Brief naming for pair/full display resolution. */
export const resolvePairReactionDisplay = resolvePairReactions;
