/**
 * Visual tokens for Letz Fetz grunge TCG card frames.
 * Location: src/components/cards/cardFrameTokens.ts
 */
import type { ForgeCardKind } from '../../services/cardForge/categories';
import type { ForgeElement } from '../../services/cardForge/types';

export const KIND_LABELS: Record<ForgeCardKind, string> = {
  Character: 'CHARACTER',
  Ultimate: 'ULTIMATE',
  Element: 'ELEMENT',
  Arena: 'ARENA',
  Glitch: 'GLITCH',
};

export const ELEMENT_ACCENTS: Record<ForgeElement, { stripe: string; glow: string; badge: string }> = {
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
    stripe: 'bg-sky-400',
    glow: 'from-sky-900/40 via-transparent to-transparent',
    badge: 'text-sky-100 border-sky-600/60 bg-sky-950/70',
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
