/**
 * Tests for card art manifest — 48 illustrations cover all pack cards.
 * Location: src/services/cardArt/manifest.test.ts
 */
import { describe, expect, it } from 'vitest';
import { BASE_PACK } from '../../game/packs/base-pack';
import {
  ILLUSTRATION_MANIFEST,
  illustrationKeyForCardId,
  illustrationPublicPath,
  resolveCardArtPath,
  resolveCardBackPath,
  resolveCharacterIdleVideoPath,
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
  });

  it('resolves public paths under /cards/{kind}/', () => {
    expect(resolveCardArtPath('knuspergnom')).toBe('/cards/character/knuspergnom.png');
    expect(resolveCardArtPath('fire-attack-2')).toBe('/cards/element/fire-attack.png');
    expect(resolveCardArtPath('arena-spaeti')).toBe('/cards/arena/arena-spaeti.png');
    expect(resolveCardArtPath('glitch-riss')).toBe('/cards/glitch/glitch-riss.png');
    expect(resolveCardArtPath('ulti-knuspergnom')).toBe('/cards/ultimate/ulti-knuspergnom.png');
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
    expect(resolveCardBackPath()).toBe('/cards/card-back.svg');
  });
});
