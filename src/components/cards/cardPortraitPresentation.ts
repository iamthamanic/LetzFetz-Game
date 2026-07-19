/**
 * Portrait card chrome — subtitle, effect line, element badge, header icons.
 * Location: src/components/cards/cardPortraitPresentation.ts
 */
import type { Element } from '../../game/types';
import type { ForgeCardKind } from '../../services/cardForge/categories';
import type { ForgeElement } from '../../services/cardForge/types';
import type { BrandIconKey } from '../../services/icons/elementIcons';
import {
  characterUsesMysteryIcon,
  elementToBrandIconKey,
} from '../../services/icons/elementIcons';
import type { CardNamePlateSize } from '../ui/CardNamePlate';
import { buildCardDisplayModel } from './cardDisplayModel';

export type CardPortraitSize = 'sm' | 'md' | 'lg' | 'fluid';

/** Prefer Sofort (hand/combat) or Gebaut (engine slots) for the effect line. */
export type CardEffectFocus = 'instant' | 'bound';

export const FORGE_ELEMENT_DE: Record<ForgeElement, string> = {
  Fire: 'Feuer',
  Water: 'Wasser',
  Earth: 'Erde',
  Air: 'Luft',
  Shadow: 'Schatten',
  Light: 'Licht',
  Neutral: 'Neutral',
  Frei: 'Frei',
};

export interface CardPortraitInput {
  id: string;
  type: ForgeCardKind;
  element: ForgeElement;
  elementDisplay?: string;
  gameElements?: [Element, Element];
  role?: string;
  effects?: string[];
  effects_text?: string;
  stats_json?: {
    hp?: number;
    value?: number;
    cardType?: string;
    resistance?: number;
  };
  size?: CardPortraitSize;
  effectFocus?: CardEffectFocus;
}

export interface CardPortraitPresentation {
  /** e.g. role for characters; null for elements (name already has type). */
  subtitle: string | null;
  /** Short engine effect text (Sofort or Gebaut). */
  effectLine: string | null;
  /** @deprecated Prefer elementBadge — type is in the card name. */
  typeBadge: string | null;
  /** Text badge on art, e.g. "Feuer" / "Erde". */
  elementBadge: string | null;
  /** When false, portrait skips the top parchment icon bar (more art). */
  showHeader: boolean;
  headerIcons: BrandIconKey[];
  useMysteryIcon: boolean;
  namePlateSize: CardNamePlateSize;
  imageFit: 'cover' | 'contain';
}

function effectField(effects: string[] | undefined, prefix: string): string {
  const line = effects?.find((e) => e.startsWith(prefix));
  return line ? line.slice(prefix.length).trim() : '';
}

function clampLine(text: string, maxLen: number): string {
  const line = text.trim().replace(/\s+/g, ' ');
  if (line.length <= maxLen) return line;
  return `${line.slice(0, maxLen - 1)}…`;
}

function firstLine(text: string | undefined | null, maxLen = 96): string | null {
  if (!text?.trim()) return null;
  return clampLine(text, maxLen);
}

function namePlateSizeForCard(size: CardPortraitSize | undefined): CardNamePlateSize {
  if (size === 'sm') return 'sm';
  if (size === 'md') return 'md';
  return 'lg';
}

function elementEffectLine(
  effects: string[] | undefined,
  focus: CardEffectFocus,
  size: CardPortraitSize | undefined,
): string | null {
  const instant = effectField(effects, 'Sofort: ');
  const bound =
    effectField(effects, 'Gebaut: ') || effectField(effects, 'Gebunden: ');
  const primary = focus === 'bound' ? bound || instant : instant || bound;
  if (!primary) return null;
  const maxLen = size === 'sm' ? 42 : size === 'md' ? 64 : 88;
  return firstLine(primary, maxLen);
}

export function buildCardPortraitPresentation(input: CardPortraitInput): CardPortraitPresentation {
  const display = buildCardDisplayModel({
    type: input.type,
    element: input.element,
    elementDisplay: input.elementDisplay,
    effects: input.effects,
    effects_text: input.effects_text,
    stats_json: input.stats_json,
  });

  const namePlateSize = namePlateSizeForCard(input.size);
  let subtitle: string | null = null;
  let effectLine: string | null = null;
  let typeBadge: string | null = null;
  let elementBadge: string | null = null;
  let showHeader = true;
  let headerIcons: BrandIconKey[] = [];
  const useMysteryIcon =
    input.type === 'Character' ? characterUsesMysteryIcon(input.id) : false;

  switch (input.type) {
    case 'Character': {
      if (useMysteryIcon) {
        headerIcons = ['mystery'];
      } else if (input.gameElements?.length === 2) {
        headerIcons = input.gameElements.map(elementToBrandIconKey);
      } else {
        headerIcons = ['mystery'];
      }
      subtitle =
        input.role ??
        effectField(input.effects, 'Rolle: ') ??
        display.textBlocks.find((b) => b.label === 'ROLE')?.text ??
        null;
      break;
    }
    case 'Element': {
      // Name plate already has type + value; art shows type — no header icons / type badge.
      showHeader = false;
      headerIcons = [];
      typeBadge = null;
      elementBadge =
        input.elementDisplay?.trim() ||
        FORGE_ELEMENT_DE[input.element] ||
        input.element;
      if (elementBadge === 'Neutral') elementBadge = null;
      subtitle = null;
      effectLine = elementEffectLine(
        input.effects,
        input.effectFocus ?? 'instant',
        input.size,
      );
      break;
    }
    case 'Ultimate': {
      headerIcons = ['mystery'];
      subtitle =
        firstLine(effectField(input.effects, 'Effekt: ')) ??
        firstLine(display.textBlocks.find((b) => b.label === 'EFFECT')?.text) ??
        firstLine(input.effects?.[0]) ??
        null;
      break;
    }
    case 'Arena': {
      headerIcons = ['mystery'];
      subtitle =
        firstLine(effectField(input.effects, 'Trigger: ')) ??
        firstLine(effectField(input.effects, 'Grundeffekt: ')) ??
        null;
      break;
    }
    case 'Glitch': {
      showHeader = false;
      headerIcons = [];
      elementBadge = 'Glitch';
      subtitle = null;
      effectLine =
        firstLine(effectField(input.effects, 'Effekt: ')) ??
        firstLine(display.textBlocks[0]?.text) ??
        null;
      break;
    }
  }

  return {
    subtitle: subtitle ? firstLine(subtitle, 120) : null,
    effectLine,
    typeBadge,
    elementBadge,
    showHeader,
    headerIcons,
    useMysteryIcon,
    namePlateSize,
    imageFit: 'cover',
  };
}
