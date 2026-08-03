/**
 * V6 core pack — Slice-1 INTERNAL (not Play-Default).
 * Location: src/game/packs/v6/v6-pack.ts
 *
 * Content/recipes from `src/content/v6` → generator → `src/generated/v6`.
 * Must not import V5 formula combination tables.
 */
import type { ContentPack, RulesetConfig } from '../../types';
import { V6_RULESET } from '../../types';
import { BASE_PACK } from '../base-pack';
import {
  V6_SLICE1_ARENAS,
  V6_SLICE1_CATALYSTS,
  V6_SLICE1_ESSENCES,
  V6_SLICE1_TECHNIQUES,
} from '../../../content/v6/cards/slice1Cards';
import { V6_PLAYTEST_ECHO_DELAY_CATALYSTS } from '../../../content/v6/cards/playtestEchoDelayCards';
import { V6_CHARACTERS } from './characters';

/** V6 pack ruleset identity — INTERNAL only until PLAYABLE cutover. */
export const V6_PACK_RULESET: RulesetConfig = {
  ...V6_RULESET,
};

/**
 * Slice-1 INTERNAL pack: Slice-1 formula cards + Späti/Vulkan;
 * V6 characters (affinity scaffold, no V5 passives/ultis); base elements/glitches for scaffolding.
 */
export function buildV6CorePack(): ContentPack {
  return {
    id: 'v6-core',
    name: 'V6 Core Slice-1 (INTERNAL) — 105-Rezept-Katalog',
    version: '0.1.1-slice1',
    characters: V6_CHARACTERS,
    ultimates: [],
    arenas: V6_SLICE1_ARENAS,
    elementCards: BASE_PACK.elementCards,
    glitches: BASE_PACK.glitches.filter((g) => g.glitchType !== 'instant'),
    techniques: V6_SLICE1_TECHNIQUES,
    essences: V6_SLICE1_ESSENCES,
    /** Slice-1 locked set + Echo/Delay playtest catalysts (#344; not in 105 matrix). */
    catalysts: [...V6_SLICE1_CATALYSTS, ...V6_PLAYTEST_ECHO_DELAY_CATALYSTS],
    items: [],
  };
}

export const V6_CORE_PACK: ContentPack = buildV6CorePack();
