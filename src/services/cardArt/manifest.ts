/**
 * Card art manifest — 48 shared illustrations mapped to all 90 pack cards.
 * Location: src/services/cardArt/manifest.ts
 */
import type { Element } from '../../game/types';
import { CHARACTER_PROMPTS } from './prompts/characters';
import { ULTIMATE_PROMPTS } from './prompts/ultimates';
import {
  ALL_ELEMENT_CARD_TYPES,
  ALL_ELEMENTS,
  elementIllustrationPrompt,
  type ElementCardType,
} from './prompts/elements';
import { ARENA_PROMPTS } from './prompts/arenas';
import { GLITCH_PROMPTS } from './prompts/glitches';

export type IllustrationKind = 'character' | 'ultimate' | 'element' | 'arena' | 'glitch';

export interface IllustrationDef {
  key: string;
  kind: IllustrationKind;
  prompt: string;
}

function elementKey(element: Element, cardType: ElementCardType): string {
  return `${element}-${cardType}`;
}

/** All 48 unique illustration definitions for batch generation. */
export function buildIllustrationManifest(): IllustrationDef[] {
  const items: IllustrationDef[] = [];

  for (const [key, prompt] of Object.entries(CHARACTER_PROMPTS)) {
    items.push({ key, kind: 'character', prompt });
  }
  for (const [key, prompt] of Object.entries(ULTIMATE_PROMPTS)) {
    items.push({ key, kind: 'ultimate', prompt });
  }
  for (const element of ALL_ELEMENTS) {
    for (const cardType of ALL_ELEMENT_CARD_TYPES) {
      items.push({
        key: elementKey(element, cardType),
        kind: 'element',
        prompt: elementIllustrationPrompt(element, cardType),
      });
    }
  }
  for (const [key, prompt] of Object.entries(ARENA_PROMPTS)) {
    items.push({ key, kind: 'arena', prompt });
  }
  for (const [key, prompt] of Object.entries(GLITCH_PROMPTS)) {
    items.push({ key, kind: 'glitch', prompt });
  }

  return items;
}

export const ILLUSTRATION_MANIFEST = buildIllustrationManifest();

const manifestByKey = new Map(ILLUSTRATION_MANIFEST.map((item) => [item.key, item]));

/** Public URL path for a generated illustration PNG. */
export function illustrationPublicPath(key: string, kind: IllustrationKind): string {
  return `/cards/${kind}/${key}.png`;
}

/** Resolve illustration key from any base-pack card id. */
export function illustrationKeyForCardId(cardId: string): string | null {
  const elementMatch = cardId.match(
    /^(fire|water|earth|air|shadow|light)-(attack|block|boost)(?:-\d+[ab]?)?$/,
  );
  if (elementMatch) {
    return `${elementMatch[1]}-${elementMatch[2]}`;
  }

  if (cardId.startsWith('ulti-')) return cardId;
  if (cardId.startsWith('arena-')) return cardId;
  if (cardId.startsWith('glitch-')) return cardId;

  if (CHARACTER_PROMPTS[cardId]) return cardId;

  return null;
}

/** Default image path for a pack card id, or empty string if unknown. */
export function resolveCardArtPath(cardId: string): string {
  const key = illustrationKeyForCardId(cardId);
  if (!key) return '';
  const def = manifestByKey.get(key);
  if (!def) return '';
  return illustrationPublicPath(key, def.kind);
}

export function getIllustrationDef(key: string): IllustrationDef | undefined {
  return manifestByKey.get(key);
}
