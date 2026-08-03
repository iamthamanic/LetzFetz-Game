/**
 * Binding Slice-1 card id set (V6 Rules Contract Slice 1).
 * Location: src/content/v6/slice1Ids.ts
 */

export const V6_SLICE1_TECHNIQUE_IDS = [
  'v6-technik-impulsgeschoss',
  'v6-technik-adrenalinschrei',
  'v6-technik-magiepanzer',
] as const;

export const V6_SLICE1_ESSENCE_IDS = [
  'v6-essenz-feuer',
  'v6-essenz-wasser',
  'v6-essenz-luft',
] as const;

export const V6_SLICE1_CATALYST_IDS = [
  'v6-katalysator-ueberladung',
  'v6-katalysator-verdichtung',
  'v6-katalysator-sofortzuender',
  'v6-katalysator-opfergabe',
] as const;

export const V6_SLICE1_ARENA_IDS = ['arena-spaeti', 'arena-vulkan'] as const;

export type V6Slice1TechniqueId = (typeof V6_SLICE1_TECHNIQUE_IDS)[number];
export type V6Slice1EssenceId = (typeof V6_SLICE1_ESSENCE_IDS)[number];
export type V6Slice1CatalystId = (typeof V6_SLICE1_CATALYST_IDS)[number];
