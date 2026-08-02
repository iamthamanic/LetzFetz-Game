/**
 * V6 core pack stub — INTERNAL foundation (not Play-Default).
 * Location: src/game/packs/v6/v6-pack.ts
 *
 * Content/recipes will grow via `src/content/v6` → generator → `src/generated/v6`.
 * Must not import V5 formula combination tables.
 */
import type { ContentPack, RulesetConfig } from '../../types';
import { V6_RULESET } from '../../types';
import { BASE_PACK } from '../base-pack';

/** V6 pack ruleset identity — INTERNAL only until PLAYABLE cutover. */
export const V6_PACK_RULESET: RulesetConfig = {
  ...V6_RULESET,
};

/**
 * Minimal INTERNAL pack: reuses base characters/arenas/elements/glitches;
 * formula slots empty until content slices fill them.
 */
export function buildV6CorePack(): ContentPack {
  return {
    id: 'v6-core',
    name: 'V6 Core (INTERNAL)',
    version: '0.0.1',
    characters: BASE_PACK.characters,
    ultimates: BASE_PACK.ultimates,
    arenas: BASE_PACK.arenas,
    elementCards: BASE_PACK.elementCards,
    glitches: BASE_PACK.glitches,
    techniques: [],
    essences: [],
    catalysts: [],
    items: [],
  };
}

export const V6_CORE_PACK: ContentPack = buildV6CorePack();
