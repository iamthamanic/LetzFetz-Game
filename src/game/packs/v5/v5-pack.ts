/**
 * V5 playtest pack — MVP-9 Formel + Gegenstände + Base-Element/Glitch-Mix.
 * Location: src/game/packs/v5/v5-pack.ts
 *
 * Deck size is below the long-term 106 target until full formula content (#231).
 */
import type { ContentPack, RulesetConfig } from '../../types';
import { DEFAULT_RULESET } from '../../types';
import { BASE_PACK } from '../base-pack';
import {
  V5_MVP_CATALYSTS,
  V5_MVP_ESSENCES,
  V5_MVP_ITEMS,
  V5_MVP_TECHNIQUES,
} from './mvpCards';

/** Documented mix — actual count = sum of included defs (one instance each). */
export const V5_MIX = {
  element: BASE_PACK.elementCards.length,
  technique: V5_MVP_TECHNIQUES.length,
  essence: V5_MVP_ESSENCES.length,
  catalyst: V5_MVP_CATALYSTS.length,
  item: V5_MVP_ITEMS.length,
  glitch: BASE_PACK.glitches.length,
} as const;

export const V5_PACK_MAIN_DECK_SIZE =
  V5_MIX.element +
  V5_MIX.technique +
  V5_MIX.essence +
  V5_MIX.catalyst +
  V5_MIX.item +
  V5_MIX.glitch;

/** V5 playtest rules — 20 LP, formula + combat, charge max 3. */
export const V5_PACK_RULESET: RulesetConfig = {
  ...DEFAULT_RULESET,
  maxBoundCards: 3,
  mainDeckSize: V5_PACK_MAIN_DECK_SIZE,
  v3Combat: true,
  v5Formula: true,
  maxFetzCharge: 3,
};

export function buildV5Pack(): ContentPack {
  return {
    id: 'v5-mvp',
    name: 'V5 Formel MVP',
    version: '0.1.0',
    characters: BASE_PACK.characters,
    ultimates: BASE_PACK.ultimates,
    arenas: BASE_PACK.arenas,
    elementCards: BASE_PACK.elementCards,
    glitches: BASE_PACK.glitches,
    techniques: V5_MVP_TECHNIQUES,
    essences: V5_MVP_ESSENCES,
    catalysts: V5_MVP_CATALYSTS,
    items: V5_MVP_ITEMS,
  };
}

export const V5_PACK: ContentPack = buildV5Pack();
