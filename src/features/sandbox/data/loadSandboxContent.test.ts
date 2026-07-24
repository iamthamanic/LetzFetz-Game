/**
 * Unit tests for Sandbox content loader (BASE_PACK + overlays).
 * Location: src/features/sandbox/data/loadSandboxContent.test.ts
 */
import { describe, expect, it } from 'vitest';
import { BASE_PACK } from '../../../game/packs/base-pack';
import { loadSandboxContent } from './loadSandboxContent';

describe('loadSandboxContent', () => {
  it('loads pack cards and arenas without overlays', () => {
    const content = loadSandboxContent({ pack: BASE_PACK, overlays: [] });
    expect(content.arenas).toHaveLength(BASE_PACK.arenas.length);
    expect(content.cards.length).toBeGreaterThan(0);
    expect(content.arenas[0]?.id).toBe(BASE_PACK.arenas[0]?.id);
    expect(content.cards.every((c) => c.id.length > 0)).toBe(true);
  });

  it('applies valid overlays for known pack ids', () => {
    const knownId = BASE_PACK.characters[0]?.id;
    expect(knownId).toBeTruthy();
    const content = loadSandboxContent({
      pack: BASE_PACK,
      overlays: [
        {
          id: knownId!,
          image_asset: '/custom.png',
          notes: 'overlay note',
        },
      ],
    });
    const card = content.cards.find((c) => c.id === knownId);
    expect(card?.imageAsset).toBe('/custom.png');
    expect(card?.notes).toBe('overlay note');
  });

  it('ignores overlays for unknown card ids', () => {
    const content = loadSandboxContent({
      pack: BASE_PACK,
      overlays: [{ id: 'not-a-real-card', notes: 'ghost' }],
    });
    expect(content.cards.some((c) => c.id === 'not-a-real-card')).toBe(false);
    expect(content.cards.every((c) => c.notes !== 'ghost')).toBe(true);
  });

  it('exposes arena d6Variants when present', () => {
    const withVariants = BASE_PACK.arenas.find((a) => a.d6Variants);
    if (!withVariants) {
      // Pack may omit variants — still must return arenas.
      const content = loadSandboxContent({ pack: BASE_PACK, overlays: [] });
      expect(content.arenas.length).toBe(BASE_PACK.arenas.length);
      return;
    }
    const content = loadSandboxContent({ pack: BASE_PACK, overlays: [] });
    const arena = content.arenas.find((a) => a.id === withVariants.id);
    expect(arena?.d6Variants).toEqual(withVariants.d6Variants);
  });
});
