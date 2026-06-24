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
import type { CharacterCardDef, Element } from '../../game/types';
import { BASE_PACK } from '../../game/packs/base-pack';
import type { ForgeCardData, ForgeElement } from '../../services/cardForge/types';

const FORGE_ELEMENT_TO_GAME: Partial<Record<ForgeElement, Element>> = {
  Fire: 'fire',
  Water: 'water',
  Earth: 'earth',
  Air: 'air',
  Light: 'light',
  Shadow: 'shadow',
};

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

function forgeElementsToGame(elements?: [ForgeElement, ForgeElement]): [Element, Element] {
  if (elements?.length === 2) {
    return [
      FORGE_ELEMENT_TO_GAME[elements[0]] ?? 'earth',
      FORGE_ELEMENT_TO_GAME[elements[1]] ?? 'fire',
    ];
  }
  return ['earth', 'fire'];
}

function effectField(effects: string[] | undefined, prefix: string): string {
  const line = effects?.find((e) => e.startsWith(prefix));
  return line ? line.slice(prefix.length).trim() : '';
}

/** Map Card Forge character row → game CharacterCardDef for CharacterSelectCard preview. */
export function forgeCharacterDefFromCard(
  card: Pick<
    ForgeCardData,
    'id' | 'name' | 'type' | 'elements' | 'effects'
  >,
): CharacterCardDef | null {
  if (card.type !== 'Character') return null;

  const fromPack = BASE_PACK.characters.find((c) => c.id === card.id);
  if (fromPack) {
    return { ...fromPack, name: card.name || fromPack.name };
  }

  return {
    id: card.id,
    name: card.name || 'Unbenannt',
    kind: 'character',
    elements: forgeElementsToGame(card.elements),
    role: effectField(card.effects, 'Rolle: ') || '—',
    passiveText: effectField(card.effects, 'Passiv: ') || card.effects?.[0] || '',
    ultimateId: '',
    strategyHint: effectField(card.effects, 'Strategie: '),
  };
}
