/**
 * Normalizes pack / forge card data into grunge frame display rows.
 * Location: src/components/cards/cardDisplayModel.ts
 */
import type { ElementCardDef, ElementImpulseKeyword } from '../../game/types';
import type { CardElement, CardKind } from './cardTypes';
import { resolveCardArtPath } from '../../services/cardArt/manifest';
import { CARD_TYPE_EN, KIND_LABELS } from './cardFrameTokens';
import { formatImpulseKeywordChip } from './impulseKeywordCopy';

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
  /** V3 keyword chip when pack card carries elementImpulse. */
  impulseKeywordChip: string | null;
}

function stripPrefix(line: string, prefix: string): string | null {
  if (!line.startsWith(prefix)) return null;
  return line.slice(prefix.length).trim();
}

function parseEffectsToModel(
  type: CardKind,
  effects: string[],
  stats?: {
    hp?: number;
    value?: number;
    cardType?: string;
    resistance?: number;
  },
  elementImpulse?: ElementImpulseKeyword | null,
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
    const bound = stripPrefix(line, 'Gebaut:') || stripPrefix(line, 'Gebunden:');
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
    impulseKeywordChip: elementImpulse ? formatImpulseKeywordChip(elementImpulse) : null,
  };
}

export function buildCardDisplayModel(input: {
  type: CardKind;
  elementDisplay?: string;
  element?: CardElement;
  effects?: string[];
  effects_text?: string;
  stats_json?: {
    hp?: number;
    value?: number;
    cardType?: string;
    resistance?: number;
  };
  elementImpulse?: ElementImpulseKeyword | null;
}): CardDisplayModel {
  const effects =
    input.effects && input.effects.length > 0
      ? input.effects
      : input.effects_text
        ? [input.effects_text]
        : [];

  const model = parseEffectsToModel(
    input.type,
    effects,
    input.stats_json,
    input.elementImpulse,
  );
  model.elementLabel = input.elementDisplay ?? input.element ?? '';
  return model;
}

export function elementDefToCardProps(def: ElementCardDef) {
  return {
    id: def.id,
    name: def.name,
    type: 'Element' as CardKind,
    element: cardElementFromGame(def.element),
    stats_json: {
      value: def.value,
      cardType: def.cardType,
      resistance: def.value,
    },
    effects: [
      `Sofort: ${def.instantText}`,
      ...(def.boundText
        ? [`Gebaut: ${def.boundText}`]
        : def.valueRole
          ? ['Handaktion (V6) — nicht baubar']
          : []),
    ],
    image_asset: resolveCardArtPath(def.id),
    elementImpulse: def.elementImpulse,
  };
}

function cardElementFromGame(element: ElementCardDef['element']): CardElement {
  const map: Record<ElementCardDef['element'], CardElement> = {
    fire: 'Fire',
    water: 'Water',
    earth: 'Earth',
    air: 'Air',
    light: 'Light',
    shadow: 'Shadow',
  };
  return map[element];
}
