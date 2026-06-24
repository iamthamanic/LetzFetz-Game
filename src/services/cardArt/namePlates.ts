/**
 * HF name plate PNGs in public/cards/text/ — same pattern as element icons / logo.
 * Location: src/services/cardArt/namePlates.ts
 */

/** Character ids with raster name plates in public/cards/text/{id}.png */
export const CHARACTER_NAME_PLATE_IDS = [
  'knuspergnom',
  'schluckspecht',
  'stiernackenkommando',
  'kokabell',
  'pillendoktora',
  'dripministerin',
  'mysterium',
] as const;

export type CharacterNamePlateId = (typeof CHARACTER_NAME_PLATE_IDS)[number];

/** @deprecated Use CHARACTER_NAME_PLATE_IDS */
export const BUNDLED_NAME_PLATE_IDS = CHARACTER_NAME_PLATE_IDS;

/** @deprecated Use hasNamePlateRaster */
export const ALPHA_NAME_PLATE_IDS: readonly string[] = CHARACTER_NAME_PLATE_IDS;

export function namePlateKeyForCardId(cardId: string): string {
  if (cardId.startsWith('ulti-')) return cardId.slice(5);
  return cardId;
}

export function namePlatePublicPath(cardId: string): string {
  return `/cards/text/${namePlateKeyForCardId(cardId)}.png`;
}

export function hasNamePlateRaster(cardId: string): boolean {
  const key = namePlateKeyForCardId(cardId);
  return (CHARACTER_NAME_PLATE_IDS as readonly string[]).includes(key);
}

/** Base-pack character id (not ulti-* or forge custom). */
export function isCharacterCardId(cardId: string): boolean {
  return (CHARACTER_NAME_PLATE_IDS as readonly string[]).includes(cardId);
}

/** @deprecated Use hasNamePlateRaster */
export function hasBundledNamePlate(cardId: string): boolean {
  return hasNamePlateRaster(cardId);
}

/** @deprecated Use hasNamePlateRaster */
export function hasAlphaNamePlate(cardId: string): boolean {
  return hasNamePlateRaster(cardId);
}
