import { describe, expect, it } from 'vitest';
import {
  CHARACTER_NAME_PLATE_IDS,
  hasNamePlateRaster,
  isCharacterCardId,
  namePlateKeyForCardId,
  namePlatePublicPath,
} from './namePlates';

describe('namePlates', () => {
  it('maps ulti cards to character plate keys', () => {
    expect(namePlateKeyForCardId('ulti-knuspergnom')).toBe('knuspergnom');
    expect(namePlatePublicPath('ulti-knuspergnom')).toBe('/cards/text/knuspergnom.png');
  });

  it('knows all character raster name plates', () => {
    expect(CHARACTER_NAME_PLATE_IDS).toHaveLength(7);
    expect(CHARACTER_NAME_PLATE_IDS).toContain('knuspergnom');
    expect(CHARACTER_NAME_PLATE_IDS).toContain('mysterium');
    expect(hasNamePlateRaster('knuspergnom')).toBe(true);
    expect(hasNamePlateRaster('ulti-kokabell')).toBe(true);
    expect(hasNamePlateRaster('arena-spaeti')).toBe(false);
  });

  it('detects base character ids for written name plates', () => {
    expect(isCharacterCardId('knuspergnom')).toBe(true);
    expect(isCharacterCardId('ulti-knuspergnom')).toBe(false);
  });
});
