/**
 * Portrait card chrome — subtitle, header icons, name plate sizing (CharacterSelectCard parity).
 * Location: src/components/cards/cardPortraitPresentation.ts
 */
import type { Element } from '../../game/types';
import type { ForgeCardKind } from '../../services/cardForge/categories';
import type { ForgeElement } from '../../services/cardForge/types';
import type { BrandIconKey } from '../../services/icons/elementIcons';
import {
  characterUsesMysteryIcon,
  elementToBrandIconKey,
  forgeElementToBrandIconKey,
} from '../../services/icons/elementIcons';
import type { CardNamePlateSize } from '../ui/CardNamePlate';
import { buildCardDisplayModel } from './cardDisplayModel';
import { CARD_TYPE_EN } from './cardFrameTokens';

export type CardPortraitSize = 'sm' | 'md' | 'lg' | 'fluid';

const CARD_TYPE_DE: Record<string, string> = {
  attack: 'Angriff',
  block: 'Block',
  boost: 'Boost',
  Angriff: 'Angriff',
  Block: 'Block',
  Boost: 'Boost',
  ATTACK: 'Angriff',
  BLOCK: 'Block',
  BOOST: 'Boost',
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
}

export interface CardPortraitPresentation {
  subtitle: string | null;
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

function elementSubtitle(stats?: CardPortraitInput['stats_json']): string | null {
  const typeKey = stats?.cardType ?? '';
  const typeDe =
    CARD_TYPE_DE[typeKey] ??
    CARD_TYPE_DE[CARD_TYPE_EN[typeKey] ?? ''] ??
    (typeKey ? typeKey : '');
  const val = stats?.value;
  if (typeDe && val != null) return `${typeDe} · Wert ${val}`;
  if (typeDe) return typeDe;
  if (val != null) return `Wert ${val}`;
  return null;
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
      headerIcons = [forgeElementToBrandIconKey(input.element)];
      subtitle = elementSubtitle(input.stats_json);
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
      headerIcons = ['mystery'];
      subtitle =
        firstLine(effectField(input.effects, 'Effekt: ')) ??
        firstLine(display.textBlocks[0]?.text) ??
        null;
      break;
    }
  }

  return {
    subtitle: subtitle ? firstLine(subtitle, 120) : null,
    headerIcons,
    useMysteryIcon,
    namePlateSize,
    imageFit: 'cover',
  };
}
