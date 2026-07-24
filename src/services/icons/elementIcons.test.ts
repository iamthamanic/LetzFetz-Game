import { describe, expect, it } from 'vitest';
import {
  BRAND_ICON_KEYS,
  characterUsesMysteryIcon,
  cardElementToBrandIconKey,
  resolveBrandIconPath,
  resolveElementIconRasterPath,
} from './elementIcons';

describe('elementIcons', () => {
  it('lists seven brand keys including mystery', () => {
    expect(BRAND_ICON_KEYS).toHaveLength(7);
    expect(BRAND_ICON_KEYS).toContain('mystery');
  });

  it('resolves raster and svg icon paths under public icons folder', () => {
    expect(resolveElementIconRasterPath('fire')).toBe('/icons/elements/fire.png');
    expect(resolveBrandIconPath('fire')).toBe('/icons/elements/fire.svg');
    expect(resolveBrandIconPath('mystery')).toBe('/icons/elements/mystery.svg');
  });

  it('mysterium character uses mystery icon in UI', () => {
    expect(characterUsesMysteryIcon('mysterium')).toBe(true);
    expect(characterUsesMysteryIcon('knuspergnom')).toBe(false);
  });

  it('maps card elements to brand icon keys', () => {
    expect(cardElementToBrandIconKey('Fire')).toBe('fire');
    expect(cardElementToBrandIconKey('Neutral')).toBe('mystery');
    expect(cardElementToBrandIconKey('Frei')).toBe('mystery');
  });
});
