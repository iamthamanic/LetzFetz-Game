/**
 * V6 core pack — Play-Default after cutover (#353).
 * Location: src/game/packs/v6/v6-pack.ts
 *
 * Content/recipes from `src/content/v6` → generator → `src/generated/v6`.
 * Must not import V5 formula combination tables.
 */
import type { ContentPack, RulesetConfig } from '../../types';
import { V6_RULESET } from '../../types';
import {
  V6_SLICE1_ARENAS,
  V6_SLICE1_CATALYSTS,
  V6_SLICE1_ESSENCES,
  V6_SLICE1_TECHNIQUES,
} from '../../../content/v6/cards/slice1Cards';
import { V6_PLAYTEST_ECHO_DELAY_CATALYSTS } from '../../../content/v6/cards/playtestEchoDelayCards';
import { V6_PLAYTEST_BESCHWOERUNG_CATALYSTS } from '../../../content/v6/cards/playtestConstructCards';
import { V6_ELEMENT_CARDS } from '../../../content/v6/cards/elementCards';
import { V6_ITEMS } from '../../../content/v6/cards/itemCards';
import { V6_STANDARD_GLITCHES } from '../../../content/v6/cards/glitchCards';
import { V6_CHARACTERS } from './characters';

/** V6 pack ruleset identity — INTERNAL only until PLAYABLE cutover. */
export const V6_PACK_RULESET: RulesetConfig = {
  ...V6_RULESET,
};

/**
 * Slice-1 pack: Slice-1 formula cards + 6 V6 core arenas;
 * V6 characters (affinity + Macken); V6 hand-only element cards (§36);
 * Standard-Glitches with explicit timing (no Sofort-Negativ / Chaos).
 */
export function buildV6CorePack(): ContentPack {
  return {
    id: 'v6-core',
    name: 'V6 Core Slice-1 (INTERNAL) — 198-Rezept-Katalog',
    version: '0.1.5-slice1',
    characters: V6_CHARACTERS,
    ultimates: [],
    arenas: V6_SLICE1_ARENAS,
    elementCards: V6_ELEMENT_CARDS,
    glitches: V6_STANDARD_GLITCHES,
    techniques: V6_SLICE1_TECHNIQUES,
    essences: V6_SLICE1_ESSENCES,
    /** Slice-1 locked set + Echo/Delay/Beschwörung playtest catalysts (not in locked matrix). */
    catalysts: [
      ...V6_SLICE1_CATALYSTS,
      ...V6_PLAYTEST_ECHO_DELAY_CATALYSTS,
      ...V6_PLAYTEST_BESCHWOERUNG_CATALYSTS,
    ],
    items: V6_ITEMS,
  };
}

export const V6_CORE_PACK: ContentPack = buildV6CorePack();
