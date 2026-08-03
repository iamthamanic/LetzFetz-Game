/**
 * Visual tokens for Letz Fetz grunge TCG card frames.
 * Location: src/components/cards/cardFrameTokens.ts
 */
import type { Element } from '../../game/types';
import type { CardElement, CardKind } from './cardTypes';

/** Dual-element side stripe — character portrait cards */
export const CHARACTER_ELEMENT_STRIPE_FROM: Record<Element, string> = {
  fire: 'from-red-600/90',
  water: 'from-cyan-600/90',
  earth: 'from-lime-600/90',
  air: 'from-stone-200/90',
  shadow: 'from-purple-600/90',
  light: 'from-amber-300/90',
};

export const CHARACTER_ELEMENT_STRIPE_TO: Record<Element, string> = {
  fire: 'to-red-900/80',
  water: 'to-cyan-900/80',
  earth: 'to-lime-900/80',
  air: 'to-stone-700/80',
  shadow: 'to-purple-900/80',
  light: 'to-amber-700/80',
};

export const KIND_LABELS: Record<CardKind, string> = {
  Character: 'CHARACTER',
  Ultimate: 'ULTIMATE',
  Element: 'ELEMENT',
  Arena: 'ARENA',
  Glitch: 'GLITCH',
  Formula: 'FORMEL',
  Item: 'GEGENSTAND',
};

/** Formel role tags — matches Combinate slot colors (Technik / Essenz / Katalysator). */
export const FORMULA_ROLE_BADGE: Record<string, string> = {
  Technik: 'text-emerald-200 border-emerald-500/60 bg-emerald-950/90',
  Essenz: 'text-sky-200 border-sky-500/60 bg-sky-950/90',
  Katalysator: 'text-amber-200 border-amber-500/60 bg-amber-950/90',
  Kombination: 'text-violet-200 border-violet-400/60 bg-violet-950/90',
};

const DEFAULT_PORTRAIT_BADGE = 'text-amber-100 border-amber-950/40 bg-stone-950/80';

/** Portrait art-corner badge classes; Formel roles get slot colors. */
export function portraitBadgeClass(label: string | null | undefined): string {
  if (!label) return DEFAULT_PORTRAIT_BADGE;
  return FORMULA_ROLE_BADGE[label] ?? DEFAULT_PORTRAIT_BADGE;
}

export const ELEMENT_ACCENTS: Record<CardElement, { stripe: string; glow: string; badge: string }> = {
  Fire: {
    stripe: 'bg-red-600',
    glow: 'from-red-900/40 via-transparent to-transparent',
    badge: 'text-red-200 border-red-700/60 bg-red-950/70',
  },
  Water: {
    stripe: 'bg-cyan-600',
    glow: 'from-cyan-900/40 via-transparent to-transparent',
    badge: 'text-cyan-100 border-cyan-700/60 bg-cyan-950/70',
  },
  Earth: {
    stripe: 'bg-lime-700',
    glow: 'from-lime-900/40 via-transparent to-transparent',
    badge: 'text-lime-100 border-lime-800/60 bg-lime-950/70',
  },
  Air: {
    stripe: 'bg-stone-300',
    glow: 'from-stone-800/40 via-transparent to-transparent',
    badge: 'text-stone-100 border-stone-400/55 bg-stone-700/75',
  },
  Light: {
    stripe: 'bg-amber-300',
    glow: 'from-amber-900/30 via-transparent to-transparent',
    badge: 'text-amber-100 border-amber-600/60 bg-amber-950/70',
  },
  Shadow: {
    stripe: 'bg-purple-700',
    glow: 'from-purple-900/50 via-transparent to-transparent',
    badge: 'text-purple-100 border-purple-700/60 bg-purple-950/70',
  },
  Neutral: {
    stripe: 'bg-stone-500',
    glow: 'from-stone-900/40 via-transparent to-transparent',
    badge: 'text-stone-200 border-stone-600/60 bg-stone-950/70',
  },
  Frei: {
    stripe: 'bg-fuchsia-500',
    glow: 'from-fuchsia-900/40 via-transparent to-transparent',
    badge: 'text-fuchsia-100 border-fuchsia-700/60 bg-fuchsia-950/70',
  },
};

export const CARD_TYPE_EN: Record<string, string> = {
  attack: 'ATTACK',
  block: 'BLOCK',
  boost: 'BOOST',
  Angriff: 'ATTACK',
  Block: 'BLOCK',
  Boost: 'BOOST',
};
