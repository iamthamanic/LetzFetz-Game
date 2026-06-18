/**
 * Normalizes pack / forge card data into grunge frame display rows.
 * Location: src/components/cards/cardDisplayModel.ts
 */
import type { ElementCardDef } from '../../game/types';
import type { ForgeCardKind } from '../../services/cardForge/categories';
import type { ForgeElement } from '../../services/cardForge/types';
import { resolveCardArtPath } from '../../services/cardArt/manifest';
import { CARD_TYPE_EN, KIND_LABELS } from './cardFrameTokens';

export interface CardTextBlock {
  label: string;
  text: string;
}

export interface CardStatCell {
  label: string;
  value: string;
}

export interface CardDisplayModel {
  kindLabel: string;
  elementLabel: string;
  statCells: CardStatCell[];
  textBlocks: CardTextBlock[];
  footerBullets: string[];
}

function stripPrefix(line: string, prefix: string): string | null {
  if (!line.startsWith(prefix)) return null;
  return line.slice(prefix.length).trim();
}

function parseEffectsToModel(
  type: ForgeCardKind,
  effects: string[],
  stats?: {
    hp?: number;
    value?: number;
    cardType?: string;
    resistance?: number;
  },
): CardDisplayModel {
  const textBlocks: CardTextBlock[] = [];
  const footerBullets: string[] = [];
  const statCells: CardStatCell[] = [];

  if (type === 'Element' && stats?.cardType) {
    statCells.push({
      label: 'TYPE',
      value: CARD_TYPE_EN[stats.cardType] ?? stats.cardType.toUpperCase(),
    });
  }
  if (type === 'Element' && stats?.value != null) {
    statCells.push({ label: 'VALUE', value: String(stats.value) });
    statCells.push({ label: 'RESIST', value: String(stats.resistance ?? stats.value) });
  }
  if (type === 'Character' && stats?.hp != null) {
    statCells.push({ label: 'HP', value: String(stats.hp) });
  }

  for (const line of effects) {
    const instant = stripPrefix(line, 'Sofort:');
    if (instant) {
      textBlocks.push({ label: 'INSTANT', text: instant });
      continue;
    }
    const bound = stripPrefix(line, 'Gebunden:');
    if (bound) {
      textBlocks.push({ label: 'BOUND', text: bound });
      continue;
    }
    const passive = stripPrefix(line, 'Passiv:');
    if (passive) {
      textBlocks.push({ label: 'PASSIVE', text: passive });
      continue;
    }
    const effect = stripPrefix(line, 'Effekt:');
    if (effect) {
      textBlocks.push({ label: 'EFFECT', text: effect });
      continue;
    }
    const role = stripPrefix(line, 'Rolle:');
    if (role) {
      textBlocks.push({ label: 'ROLE', text: role });
      continue;
    }
    const trigger = stripPrefix(line, 'Trigger:');
    if (trigger) {
      textBlocks.push({ label: 'TRIGGER', text: trigger });
      continue;
    }
    const base = stripPrefix(line, 'Grundeffekt:');
    if (base) {
      textBlocks.push({ label: 'BASE', text: base });
      continue;
    }
    const rule = stripPrefix(line, 'Sonderregel:');
    if (rule) {
      textBlocks.push({ label: 'RULE', text: rule });
      continue;
    }
    const timing = stripPrefix(line, 'Timing:');
    if (timing) {
      textBlocks.push({ label: 'TIMING', text: timing });
      continue;
    }
    if (line.startsWith('Varianten ')) {
      footerBullets.push(line);
      continue;
    }
    if (line.startsWith('Elemente:') || line.startsWith('Charakter:') || line.startsWith('Ulti:')) {
      footerBullets.push(line);
      continue;
    }
    if (line.startsWith('Typ:') || line.startsWith('Wert:') || line.startsWith('Widerstand:')) {
      continue;
    }
    if (line.startsWith('Strategie:')) {
      footerBullets.push(line);
      continue;
    }
    footerBullets.push(line);
  }

  return {
    kindLabel: KIND_LABELS[type],
    elementLabel: '',
    statCells,
    textBlocks,
    footerBullets,
  };
}

export function buildCardDisplayModel(input: {
  type: ForgeCardKind;
  elementDisplay?: string;
  element?: ForgeElement;
  effects?: string[];
  effects_text?: string;
  stats_json?: {
    hp?: number;
    value?: number;
    cardType?: string;
    resistance?: number;
  };
}): CardDisplayModel {
  const effects =
    input.effects && input.effects.length > 0
      ? input.effects
      : input.effects_text
        ? [input.effects_text]
        : [];

  const model = parseEffectsToModel(input.type, effects, input.stats_json);
  model.elementLabel = input.elementDisplay ?? input.element ?? '';
  return model;
}

export function elementDefToForgeProps(def: ElementCardDef) {
  return {
    id: def.id,
    name: def.name,
    type: 'Element' as ForgeCardKind,
    element: forgeElementFromGame(def.element),
    stats_json: {
      value: def.value,
      cardType: def.cardType,
      resistance: def.value,
    },
    effects: [
      `Sofort: ${def.instantText}`,
      `Gebunden: ${def.boundText}`,
    ],
    image_asset: resolveCardArtPath(def.id),
  };
}

function forgeElementFromGame(element: ElementCardDef['element']): ForgeElement {
  const map: Record<ElementCardDef['element'], ForgeElement> = {
    fire: 'Fire',
    water: 'Water',
    earth: 'Earth',
    air: 'Air',
    light: 'Light',
    shadow: 'Shadow',
  };
  return map[element];
}
