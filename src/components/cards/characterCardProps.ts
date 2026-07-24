/**
 * Bridges pure game card defs (character, ultimate, arena, glitch) to the grunge frame.
 * Location: src/components/cards/characterCardProps.ts
 */
import type {
  ArenaCardDef,
  CharacterCardDef,
  GlitchCardDef,
  UltimateCardDef,
} from '../../game/types';
import { resolveCardArtPath } from '../../services/cardArt/manifest';
import type { CardElement, CardKind } from './cardTypes';
import type { LetzFetzCardProps } from './LetzFetzCard';

function cardElementFromGame(element: string): CardElement {
  const map: Record<string, CardElement> = {
    fire: 'Fire',
    water: 'Water',
    earth: 'Earth',
    air: 'Air',
    light: 'Light',
    shadow: 'Shadow',
  };
  return map[element] ?? 'Neutral';
}

export function characterDefToCardProps(def: CharacterCardDef): Partial<LetzFetzCardProps> {
  return {
    id: def.id,
    name: def.name,
    type: 'Character' as CardKind,
    element: 'Neutral',
    elementDisplay: def.elements.map((e) => cardElementFromGame(e)).join(' / '),
    stats_json: { hp: 20 },
    effects: [def.passiveText, `Rolle: ${def.role}`, `Strategie: ${def.strategyHint}`],
    image_asset: resolveCardArtPath(def.id),
  };
}

export function ultimateDefToCardProps(def: UltimateCardDef): Partial<LetzFetzCardProps> {
  return {
    id: def.id,
    name: def.name,
    type: 'Ultimate' as CardKind,
    element: 'Neutral',
    effects: [def.effectText],
    image_asset: resolveCardArtPath(def.id),
  };
}

export function arenaDefToCardProps(def: ArenaCardDef): Partial<LetzFetzCardProps> {
  return {
    id: def.id,
    name: def.name,
    type: 'Arena' as CardKind,
    element: 'Neutral',
    effects: [
      `Grundeffekt: ${def.baseEffect}`,
      `Trigger: ${def.trigger}`,
      `Sonderregel: ${def.specialRule}`,
      ...(def.d6Variants ? [`Varianten ${def.d6Variants.join(' / ')}`] : []),
    ],
    image_asset: resolveCardArtPath(def.id),
  };
}

export function glitchDefToCardProps(def: GlitchCardDef): Partial<LetzFetzCardProps> {
  return {
    id: def.id,
    name: def.name,
    type: 'Glitch' as CardKind,
    element: 'Neutral',
    effects: [`Timing: ${def.timing}`, def.effectText],
    image_asset: resolveCardArtPath(def.id),
  };
}
