/**
 * Brand element + mystery icon paths for UI (CharacterSelectCard, etc.).
 * Location: src/services/icons/elementIcons.ts
 */
import type { Element } from '../../game/types/elements';
import type { ForgeElement } from '../cardForge/types';
import type { BrandIconKey } from '../cardArt/prompts/elementSymbols';

export type { BrandIconKey };

export const BRAND_ICON_KEYS: BrandIconKey[] = [
  'fire',
  'water',
  'earth',
  'air',
  'shadow',
  'light',
  'mystery',
];

/** Das Mysterium has no element — UI shows ?? icon only. */
export const MYSTERY_CHARACTER_ID = 'mysterium';

export function characterUsesMysteryIcon(characterId: string): boolean {
  return characterId === MYSTERY_CHARACTER_ID;
}

/** HF element PNGs in public/icons/elements/ — same pattern as AppBrand logo. */
export const ELEMENT_ICON_SRC: Record<Exclude<BrandIconKey, 'mystery'>, string> = {
  fire: '/icons/elements/fire.png',
  water: '/icons/elements/water.png',
  earth: '/icons/elements/earth.png',
  air: '/icons/elements/air.png',
  shadow: '/icons/elements/shadow.png',
  light: '/icons/elements/light.png',
};

export function resolveElementIconRasterPath(key: BrandIconKey): string {
  if (key === 'mystery') return resolveBrandIconPath('mystery');
  return ELEMENT_ICON_SRC[key];
}

/** SVG placeholder when raster missing (e.g. mystery). */
export function resolveBrandIconPath(key: BrandIconKey): string {
  return `/icons/elements/${key}.svg`;
}

export function elementToBrandIconKey(element: Element): BrandIconKey {
  return element;
}

export function forgeElementToBrandIconKey(element: ForgeElement): BrandIconKey {
  const map: Record<ForgeElement, BrandIconKey> = {
    Fire: 'fire',
    Water: 'water',
    Earth: 'earth',
    Air: 'air',
    Light: 'light',
    Shadow: 'shadow',
    Neutral: 'mystery',
    Frei: 'mystery',
  };
  return map[element] ?? 'mystery';
}
