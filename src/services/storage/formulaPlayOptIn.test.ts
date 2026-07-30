/**
 * Unit tests for Formula play opt-in localStorage.
 * Location: src/services/storage/formulaPlayOptIn.test.ts
 */
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  FORMULA_PLAY_OPTIN_STORAGE_KEY,
  addBausteinToPlayDeck,
  activateFormulaRecipe,
  deckOptInFreshness,
  getDeckOptIn,
  getActivatedRecipe,
  isActivatedRecipeOutdated,
  isDeckOptInOutdated,
  loadFormulaPlayOptInStore,
  parseFormulaPlayOptInStore,
  summarizeOutdatedOptIns,
} from './formulaPlayOptIn';

class MockStorage {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
  clear(): void {
    this.map.clear();
  }
}

describe('formulaPlayOptIn', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', new MockStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns empty store when storage missing', () => {
    expect(loadFormulaPlayOptInStore().deckOptIns).toEqual([]);
  });

  it('parses valid store and drops corrupt entries', () => {
    const parsed = parseFormulaPlayOptInStore({
      version: 1,
      deckOptIns: [
        {
          cardId: 'studio-t1',
          role: 'technik',
          name: 'Studio T',
          pinnedVersion: 1,
          addedAt: '2026-01-01T00:00:00.000Z',
        },
        { cardId: '', role: 'technik' },
      ],
      activatedRecipes: [],
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    expect(parsed.deckOptIns).toHaveLength(1);
    expect(parsed.deckOptIns[0]?.cardId).toBe('studio-t1');
  });

  it('adds baustein to deck overlay with version pin', () => {
    expect(
      addBausteinToPlayDeck({
        cardId: 'studio-t1',
        role: 'technik',
        name: 'Test Technik',
        pinnedVersion: 2,
      }),
    ).toBe(true);

    const entry = getDeckOptIn('studio-t1');
    expect(entry?.pinnedVersion).toBe(2);
    expect(entry?.role).toBe('technik');
  });

  it('updates existing deck opt-in on re-add', () => {
    addBausteinToPlayDeck({
      cardId: 'v5-technik-durchschuss',
      role: 'technik',
      name: 'Durchschuss',
      pinnedVersion: 1,
    });
    addBausteinToPlayDeck({
      cardId: 'v5-technik-durchschuss',
      role: 'technik',
      name: 'Durchschuss',
      pinnedVersion: 3,
    });
    expect(getDeckOptIn('v5-technik-durchschuss')?.pinnedVersion).toBe(3);
    expect(loadFormulaPlayOptInStore().deckOptIns).toHaveLength(1);
  });

  it('activates recipe separately from deck opt-ins', () => {
    addBausteinToPlayDeck({
      cardId: 'studio-t1',
      role: 'technik',
      name: 'T',
      pinnedVersion: 1,
    });
    expect(
      activateFormulaRecipe({
        recipeId: 'kombi-1',
        name: 'Feuerbohrer',
        pinnedRecipeVersion: 1,
        techniqueId: 'studio-t1',
        essenceId: 'v5-essenz-feuer',
        catalystId: null,
        techniqueVersion: 1,
        essenceVersion: 1,
        catalystVersion: null,
      }),
    ).toBe(true);

    expect(getActivatedRecipe('kombi-1')?.techniqueId).toBe('studio-t1');
    expect(localStorage.getItem(FORMULA_PLAY_OPTIN_STORAGE_KEY)).toContain('activatedRecipes');
  });

  it('detects outdated deck and recipe pins', () => {
    const deckEntry = {
      cardId: 'x',
      role: 'technik' as const,
      name: 'X',
      pinnedVersion: 1,
      addedAt: '2026-01-01T00:00:00.000Z',
    };
    expect(isDeckOptInOutdated(deckEntry, 2)).toBe(true);
    expect(deckOptInFreshness(deckEntry, 1)).toBe('fresh');
    expect(deckOptInFreshness(deckEntry, 2)).toBe('outdated');

    const recipeEntry = {
      recipeId: 'kombi-1',
      name: 'K',
      pinnedRecipeVersion: 1,
      techniqueId: 't1',
      essenceId: null,
      catalystId: null,
      techniqueVersion: 1,
      essenceVersion: null,
      catalystVersion: null,
      activatedAt: '2026-01-01T00:00:00.000Z',
    };
    expect(
      isActivatedRecipeOutdated(recipeEntry, {
        recipeVersion: 1,
        techniqueVersion: 2,
        essenceVersion: null,
        catalystVersion: null,
      }),
    ).toBe(true);
  });

  it('summarizes outdated counts via injected resolvers', () => {
    addBausteinToPlayDeck({
      cardId: 'a',
      role: 'essenz',
      name: 'A',
      pinnedVersion: 1,
    });
    const store = loadFormulaPlayOptInStore();
    const summary = summarizeOutdatedOptIns({
      deckOptIns: store.deckOptIns,
      activatedRecipes: store.activatedRecipes,
      resolveBausteinVersion: (id) => (id === 'a' ? 2 : 1),
      resolveRecipeSnapshot: () => null,
    });
    expect(summary.outdatedDeckCount).toBe(1);
    expect(summary.hasOutdated).toBe(true);
  });
});
