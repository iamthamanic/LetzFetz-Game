/**
 * Higgsfield prompts for UI element + mystery icons (not full card illustrations).
 * Location: src/services/cardArt/prompts/elementSymbols.ts
 */
import type { Element } from '../../../game/types/elements';

export type BrandIconKey = Element | 'mystery';

const ICON_STYLE =
  'Letz Fetz TCG UI icon, single bold symbol centered, grunge wheatpaste sticker on dirty beige parchment circle #D9D1C1, ' +
  'thick black outline, subtle blood red splatter accent, Berlin alley grime, no card frame, no extra text, ' +
  'icon fills circle, transparent-friendly edges, high contrast';

const MYSTERY_PROMPT =
  `${ICON_STYLE}, large bold question mark ? symbol, purple-black mist wisps, mystery unknown element`;

const ELEMENT_SYMBOL: Record<Element, string> = {
  fire: `${ICON_STYLE}, bold flame fire symbol, orange red glow`,
  water: `${ICON_STYLE}, water droplet wave symbol, cyan blue glow`,
  earth: `${ICON_STYLE}, mountain rock leaf earth symbol, green brown glow`,
  air: `${ICON_STYLE}, wind swirl cyclone symbol, sky blue glow`,
  shadow: `${ICON_STYLE}, crescent moon void shadow symbol, purple black glow`,
  light: `${ICON_STYLE}, radiant sun light beams symbol, warm gold white glow`,
};

export function elementSymbolPrompt(key: BrandIconKey): string {
  if (key === 'mystery') return MYSTERY_PROMPT;
  return ELEMENT_SYMBOL[key];
}

export const ALL_BRAND_ICON_KEYS: BrandIconKey[] = [
  'fire',
  'water',
  'earth',
  'air',
  'shadow',
  'light',
  'mystery',
];
