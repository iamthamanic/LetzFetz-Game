/**
 * Tests for card art manifest — 48 illustrations cover all pack cards.
 * Location: src/services/cardArt/manifest.test.ts
 */
import { describe, expect, it } from 'vitest';
import { BASE_PACK } from '../../game/packs/base-pack';
import {
  ILLUSTRATION_MANIFEST,
  ENGINE_PART_PNG_ART_SHIPPED,
  enginePartPreviewOrFallback,
  illustrationKeyForCardId,
  illustrationPublicPath,
  resolveCardArtPath,
  resolveCardBackPath,
  resolveCharacterIdleVideoPath,
  resolveElementAttackVideoPath,
  resolveEnginePartArtPath,
  resolveFormulaCombinationArtPath,
  ELEMENT_ATTACK_VIDEO_MANIFEST,
} from './manifest';

function allPackCardIds(): string[] {
  const pack = BASE_PACK;
  return [
    ...pack.characters.map((c) => c.id),
    ...pack.ultimates.map((u) => u.id),
    ...pack.elementCards.map((e) => e.id),
    ...pack.arenas.map((a) => a.id),
    ...pack.glitches.map((g) => g.id),
  ];
}

describe('card art manifest', () => {
  it('defines exactly 48 unique illustrations', () => {
    expect(ILLUSTRATION_MANIFEST).toHaveLength(48);
    const keys = ILLUSTRATION_MANIFEST.map((item) => item.key);
    expect(new Set(keys).size).toBe(48);
  });

  it('maps every pack card id to an illustration key', () => {
    for (const id of allPackCardIds()) {
      expect(illustrationKeyForCardId(id)).toBeTruthy();
    }
  });

  it('shares element art across value variants', () => {
    expect(illustrationKeyForCardId('fire-attack-2')).toBe('fire-attack');
    expect(illustrationKeyForCardId('fire-attack-6')).toBe('fire-attack');
    expect(illustrationKeyForCardId('fire-boost-5a')).toBe('fire-boost');
    expect(illustrationKeyForCardId('shadow-block-4')).toBe('shadow-block');
    expect(illustrationKeyForCardId('v6-fire-attack-2')).toBe('fire-attack');
    expect(illustrationKeyForCardId('v6-water-block-4')).toBe('water-block');
    expect(illustrationKeyForCardId('v6-air-boost-3')).toBe('air-boost');
  });

  it('resolves V5 formula component art under /cards/formula/', () => {
    expect(resolveCardArtPath('v5-technik-impulsgeschoss')).toBe('/cards/formula/impulsgeschoss.png');
    expect(resolveCardArtPath('v5-essenz-luft')).toBe('/cards/formula/luft.png');
    expect(resolveCardArtPath('v5-essenz-schatten')).toBe('/cards/formula/schatten.png');
    expect(resolveCardArtPath('v5-katalysator-spiegelung')).toBe('/cards/formula/spiegelung.png');
  });

  it('resolves V6 formula component art under /cards/formula/', () => {
    expect(resolveCardArtPath('v6-technik-impulsgeschoss')).toBe('/cards/formula/impulsgeschoss.png');
    expect(resolveCardArtPath('v6-essenz-feuer')).toBe('/cards/formula/feuer.png');
    expect(resolveCardArtPath('v6-katalysator-verdichtung')).toBe(
      '/cards/formula/verdichtung.png',
    );
    expect(resolveCardArtPath('v6-katalysator-ueberladung')).toBe(
      '/cards/formula/ueberspannung.png',
    );
    expect(resolveCardArtPath('v6-katalysator-beschwoerung')).toBe('/cards/formula/opfergabe.png');
    expect(resolveCardArtPath('v6-technik-beschwoerungsritual')).toBe(
      '/cards/formula/opfergabe.png',
    );
  });

  it('resolves V5 formula combination art from catalog slug', () => {
    expect(resolveFormulaCombinationArtPath('raubhiebsirenen')).toBe(
      '/cards/formula/raubhiebsirenen.png',
    );
    expect(resolveFormulaCombinationArtPath(' RaubhiebSirenen ')).toBe(
      '/cards/formula/raubhiebsirenen.png',
    );
    expect(resolveFormulaCombinationArtPath('')).toBe('');
    expect(resolveFormulaCombinationArtPath('../evil')).toBe('');
  });

  it('resolves V5/V6 item art under /cards/item/', () => {
    expect(resolveCardArtPath('v5-item-rostiger-nagel')).toBe('/cards/item/rostiger-nagel.png');
    expect(resolveCardArtPath('v5-item-nasser-socken')).toBe('/cards/item/nasser-socken.png');
    expect(resolveCardArtPath('v5-item-kaputter-rueckspiegel')).toBe(
      '/cards/item/kaputter-rueckspiegel.png',
    );
    expect(resolveCardArtPath('v5-item-halbe-dose-energy')).toBe('/cards/item/halbe-dose-energy.png');
    expect(resolveCardArtPath('v5-item-verdaechtiger-pilz')).toBe(
      '/cards/item/verdaechtiger-pilz.png',
    );
    expect(resolveCardArtPath('v5-item-kabelbinder-deluxe')).toBe(
      '/cards/item/kabelbinder-deluxe.png',
    );
    expect(resolveCardArtPath('v6-item-werkzeugkoffer')).toBe('/cards/item/werkzeugkoffer.png');
    expect(resolveCardArtPath('v6-item-gezinkter-wuerfel')).toBe('/cards/item/gezinkter-wuerfel.png');
  });

  it('resolves MVP trio engine PNGs when shipped; blanks others', () => {
    expect(ENGINE_PART_PNG_ART_SHIPPED).toBe(true);
    expect(resolveEnginePartArtPath('v3-part-water-traeger-01')).toBe(
      '/cards/engine/v3-part-water-traeger-01.png',
    );
    expect(resolveEnginePartArtPath('v3-part-shadow-antrieb-01')).toBe(
      '/cards/engine/v3-part-shadow-antrieb-01.png',
    );
    expect(resolveEnginePartArtPath('v3-part-light-aufsatz-01')).toBe(
      '/cards/engine/v3-part-light-aufsatz-01.png',
    );
    expect(resolveEnginePartArtPath('v3-part-fire-antrieb-01')).toBe('');
    expect(resolveCardArtPath('v3-part-fire-antrieb-01')).toBe('');
  });

  it('falls back to PNG path when previewUrl is blank (path helper)', () => {
    expect(enginePartPreviewOrFallback('v3-part-water-traeger-01', '')).toBe(
      '/cards/engine/v3-part-water-traeger-01.png',
    );
    expect(enginePartPreviewOrFallback('v3-part-water-traeger-01', '   ')).toBe(
      '/cards/engine/v3-part-water-traeger-01.png',
    );
    expect(
      enginePartPreviewOrFallback(
        'v3-part-water-traeger-01',
        '/cards/engine/custom-preview.png',
      ),
    ).toBe('/cards/engine/custom-preview.png');
  });

  it('leaves unknown ids empty (no engine registry hit)', () => {
    expect(resolveCardArtPath('v3-part-does-not-exist')).toBe('');
    expect(resolveEnginePartArtPath('v3-part-does-not-exist')).toBe('');
    expect(resolveCardArtPath('unknown-card')).toBe('');
  });

  it('includes style guardrails in every prompt', () => {
    for (const item of ILLUSTRATION_MANIFEST) {
      const lower = item.prompt.toLowerCase();
      const hasTextGuard =
        lower.includes('no text') || lower.includes('no card frame');
      expect(hasTextGuard).toBe(true);
      expect(item.prompt.length).toBeGreaterThan(80);
    }
  });

  it('uses consistent path helper', () => {
    expect(illustrationPublicPath('knuspergnom', 'character')).toBe(
      '/cards/character/knuspergnom.png',
    );
  });

  it('resolves character idle video paths', () => {
    expect(resolveCharacterIdleVideoPath('knuspergnom')).toBe('/videos/character/knuspergnom.mp4');
    expect(resolveCharacterIdleVideoPath('unknown')).toBe('');
  });

  it('resolves shared card back path', () => {
    expect(resolveCardBackPath()).toBe('/brand/letz-fetz-logo.png');
  });

  it('resolves element attack video paths', () => {
    expect(resolveElementAttackVideoPath('fire')).toBe('/videos/element-attack/fire-attack.mp4');
    expect(resolveElementAttackVideoPath('water')).toBe('/videos/element-attack/water-attack.mp4');
    expect(resolveElementAttackVideoPath('shadow')).toBe('/videos/element-attack/shadow-attack.mp4');
  });

  it('element attack video manifest has 6 entries', () => {
    expect(ELEMENT_ATTACK_VIDEO_MANIFEST).toHaveLength(6);
    expect(ELEMENT_ATTACK_VIDEO_MANIFEST).toContain('fire-attack');
    expect(ELEMENT_ATTACK_VIDEO_MANIFEST).toContain('light-attack');
  });
});
