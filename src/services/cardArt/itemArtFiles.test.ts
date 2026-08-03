/**
 * V5 item art files on disk (#285).
 * Location: src/services/cardArt/itemArtFiles.test.ts
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { V5_ITEMS } from '../../game/packs/v5/formulaCards';
import { resolveCardArtPath } from './manifest';

describe('V5 item art files', () => {
  it('ships a PNG for every V5 item and resolves the public path', () => {
    expect(V5_ITEMS).toHaveLength(8);
    for (const item of V5_ITEMS) {
      const match = item.id.match(/^v5-item-([a-z0-9-]+)$/);
      expect(match, item.id).toBeTruthy();
      const slug = match![1];
      const abs = resolve(process.cwd(), 'public/cards/item', `${slug}.png`);
      expect(existsSync(abs), abs).toBe(true);
      expect(resolveCardArtPath(item.id)).toBe(`/cards/item/${slug}.png`);
    }
  });
});
