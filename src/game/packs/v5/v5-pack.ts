/**
 * V5 playtest pack — full formula set (12+12+12) + Gegenstände + Base-Element/Glitch-Mix.
 * Location: src/game/packs/v5/v5-pack.ts
 *
 * Concept target main deck = 106 (24+24+6 elements + 36 formula + 6 items + 10 glitches).
 * Current element mix still comes from BASE_PACK (60) → actual size = 60+10+36+6 = 112
 * until a dedicated element rematch issue.
 */
import type { ContentPack, RulesetConfig } from '../../types';
import { DEFAULT_RULESET } from '../../types';
import { BASE_PACK } from '../base-pack';
import {
  V5_CATALYSTS,
  V5_ESSENCES,
  V5_ITEMS,
  V5_TECHNIQUES,
} from './formulaCards';
import { V5_CHARACTERS, V5_ULTIMATES } from './characters';

/** Documented mix — actual count = sum of included defs (one instance each). */
export const V5_MIX = {
  element: BASE_PACK.elementCards.length,
  technique: V5_TECHNIQUES.length,
  essence: V5_ESSENCES.length,
  catalyst: V5_CATALYSTS.length,
  item: V5_ITEMS.length,
  glitch: BASE_PACK.glitches.length,
} as const;

/** Spielkonzept §3.1 target when element counts match 24/24/6. */
export const V5_TARGET_MAIN_DECK_SIZE = 106;

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
    name: 'V5 Formel',
    version: '0.2.0',
    characters: V5_CHARACTERS,
    ultimates: V5_ULTIMATES,
    arenas: BASE_PACK.arenas,
    elementCards: BASE_PACK.elementCards,
    glitches: BASE_PACK.glitches,
    techniques: V5_TECHNIQUES,
    essences: V5_ESSENCES,
    catalysts: V5_CATALYSTS,
    items: V5_ITEMS,
  };
}

export const V5_PACK: ContentPack = buildV5Pack();
