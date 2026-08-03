/**
 * Unit tests for V5 Formula play overlay merge.
 * Location: src/game/packs/mergeFormulaPlayOverlay.test.ts
 */
import { describe, expect, it } from 'vitest';
import { V5_PACK } from './v5';
import { buildMainDeckInstances, createSeededRng } from '../engine/deck';
import { countOverlayDeckExtras, mergeFormulaPlayOverlay } from './mergeFormulaPlayOverlay';
import type { DeckOptInEntry } from './formulaPlayOverlayTypes';

const studioTechnik: DeckOptInEntry = {
  cardId: 'studio-technik-alpha',
  role: 'technik',
  name: 'Studio Alpha',
  pinnedVersion: 1,
  addedAt: '2026-01-01T00:00:00.000Z',
};

describe('mergeFormulaPlayOverlay', () => {
  it('does not duplicate shipped V5 bausteine', () => {
    const merged = mergeFormulaPlayOverlay(V5_PACK, [
      {
        cardId: 'v5-technik-impulsgeschoss',
        role: 'technik',
        name: 'Durchschuss',
        pinnedVersion: 1,
        addedAt: '2026-01-01T00:00:00.000Z',
      },
    ]);
    expect(merged.techniques?.length).toBe(V5_PACK.techniques?.length);
    expect(countOverlayDeckExtras(V5_PACK, [])).toBe(0);
  });

  it('appends studio-only bausteine as playable stubs', () => {
    const merged = mergeFormulaPlayOverlay(V5_PACK, [studioTechnik]);
    expect(merged.techniques?.some((t) => t.id === studioTechnik.cardId)).toBe(true);
    expect(countOverlayDeckExtras(V5_PACK, [studioTechnik])).toBe(1);

    const rng = createSeededRng(42);
    const deck = buildMainDeckInstances(merged, rng);
    expect(deck.some((c) => c.defId === studioTechnik.cardId)).toBe(true);
  });

  it('increases main deck size only for overlay extras', () => {
    const baseSize = buildMainDeckInstances(V5_PACK, createSeededRng(1)).length;
    const mergedSize = buildMainDeckInstances(
      mergeFormulaPlayOverlay(V5_PACK, [studioTechnik]),
      createSeededRng(1),
    ).length;
    expect(mergedSize).toBe(baseSize + 1);
  });
});
