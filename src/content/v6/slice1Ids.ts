/**
 * Binding Slice-1 card id set (V6 Rules Contract Slice 1).
 * Location: src/content/v6/slice1Ids.ts
 *
 * Catalog (#383): 10T×6E×10K — supported catalysts playable; unsupported
 * catalysts emit explicit `availability: unsupported` recipes (no invent §50.3).
 */

export const V6_SLICE1_TECHNIQUE_IDS = [
  'v6-technik-impulsgeschoss',
  'v6-technik-adrenalinschrei',
  'v6-technik-fintenschnitt',
  'v6-technik-brechschlag',
  'v6-technik-kettenfessel',
  'v6-technik-bannkreis',
  'v6-technik-ueberraschungsangriff',
  'v6-technik-schicksalmanifestation',
  'v6-technik-magiepanzer',
  'v6-technik-beschwoerungsritual',
] as const;

export const V6_SLICE1_ESSENCE_IDS = [
  'v6-essenz-feuer',
  'v6-essenz-wasser',
  'v6-essenz-erde',
  'v6-essenz-luft',
  'v6-essenz-licht',
  'v6-essenz-schatten',
] as const;

/**
 * All ten V6 core Katalysatoren (Echo … Opfergabe).
 */
export const V6_SLICE1_CATALYST_IDS = [
  'v6-katalysator-echo',
  'v6-katalysator-ueberladung',
  'v6-katalysator-verdichtung',
  'v6-katalysator-ausbreitung',
  'v6-katalysator-kettenkopplung',
  'v6-katalysator-verzoegerung',
  'v6-katalysator-sofortzuender',
  'v6-katalysator-spiegelung',
  'v6-katalysator-umkehrung',
  'v6-katalysator-opfergabe',
] as const;

/**
 * Catalysts that expand into the recipe matrix (#383 = all ten).
 * Playable vs unsupported is decided per transform `availability`.
 */
export const V6_MATRIX_CATALYST_IDS = V6_SLICE1_CATALYST_IDS;

/** V6 core arenas (#350) — full set under v6Formula; not tied to recipe lock. */
export const V6_SLICE1_ARENA_IDS = [
  'arena-spaeti',
  'arena-kristall',
  'arena-vulkan',
  'arena-sumpf',
  'arena-club',
  'arena-schattenbasar',
] as const;

export type V6Slice1TechniqueId = (typeof V6_SLICE1_TECHNIQUE_IDS)[number];
export type V6Slice1EssenceId = (typeof V6_SLICE1_ESSENCE_IDS)[number];
export type V6Slice1CatalystId = (typeof V6_SLICE1_CATALYST_IDS)[number];
export type V6MatrixCatalystId = (typeof V6_MATRIX_CATALYST_IDS)[number];
