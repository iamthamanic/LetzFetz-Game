/**
 * Bridges pure game card defs (character, ultimate, arena, glitch) to the grunge frame.
 * Location: src/components/cards/characterCardProps.ts
 */
import {
  resolveCardArtPath,
  type CharacterCardDef,
  type UltimateCardDef,
  type ArenaCardDef,
  type GlitchCardDef,
} from '../../services/cardArt/manifest';
import type { ForgeCardKind } from '../../services/cardForge/categories';
import type { ForgeElement } from '../../services/cardForge/types';
import type { LetzFetzCardProps } from './LetzFetzCard';

function forgeElementFromGame(element: string): ForgeElement {
  const map: Record<string, ForgeElement> = {
    fire: 'Fire',
    water: 'Water',
    earth: 'Earth',
    air: 'Air',
    light: 'Light',
    shadow: 'Shadow',
  };
  return map[element] ?? 'Neutral';
}

export function characterDefToForgeProps(def: CharacterCardDef): Partial<LetzFetzCardProps> {
  return {
    id: def.id,
    name: def.name,
    type: 'Character' as ForgeCardKind,
    element: 'Neutral',
    elementDisplay: def.elements.map((e) => forgeElementFromGame(e)).join(' / '),
    stats_json: { hp: 20 },
    effects: [def.passiveText, `Rolle: ${def.role}`, `Strategie: ${def.strategyHint}`],
    image_asset: resolveCardArtPath(def.id),
  };
}

export function ultimateDefToForgeProps(def: UltimateCardDef): Partial<LetzFetzCardProps> {
  return {
    id: def.id,
    name: def.name,
    type: 'Ultimate' as ForgeCardKind,
    element: 'Neutral',
    effects: [def.effectText],
    image_asset: resolveCardArtPath(def.id),
  };
}

export function arenaDefToForgeProps(def: ArenaCardDef): Partial<LetzFetzCardProps> {
  return {
    id: def.id,
    name: def.name,
    type: 'Arena' as ForgeCardKind,
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

export function glitchDefToForgeProps(def: GlitchCardDef): Partial<LetzFetzCardProps> {
  return {
    id: def.id,
    name: def.name,
    type: 'Glitch' as ForgeCardKind,
    element: 'Neutral',
    effects: [`Timing: ${def.timing}`, def.effectText],
    image_asset: resolveCardArtPath(def.id),
  };
}
