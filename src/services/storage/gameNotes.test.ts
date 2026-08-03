/**
 * Unit tests for game notes localStorage.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  GAME_NOTES_STORAGE_KEY,
  createGameNoteId,
  formatGameNoteTimestamp,
  loadGameNotes,
  saveGameNotes,
  type GameNote,
} from './gameNotes';

class MockStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

const sample: GameNote = {
  id: 'n1',
  title: 'Balance',
  content: 'Formel zu stark',
  createdAt: '2026-08-02T10:15:00.000Z',
  updatedAt: '2026-08-02T10:15:00.000Z',
};

describe('gameNotes storage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', new MockStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('round-trips notes', () => {
    expect(saveGameNotes([sample])).toBe(true);
    expect(loadGameNotes()).toEqual([sample]);
    expect(localStorage.getItem(GAME_NOTES_STORAGE_KEY)).toContain('Balance');
  });

  it('drops invalid entries', () => {
    localStorage.setItem(
      GAME_NOTES_STORAGE_KEY,
      JSON.stringify([{ id: 'bad' }, sample, null]),
    );
    expect(loadGameNotes()).toEqual([sample]);
  });

  it('returns empty on corrupt JSON', () => {
    localStorage.setItem(GAME_NOTES_STORAGE_KEY, '{not-json');
    expect(loadGameNotes()).toEqual([]);
  });

  it('formats DE date+time', () => {
    const formatted = formatGameNoteTimestamp('2026-08-02T10:15:00.000Z');
    expect(formatted).toMatch(/\d{2}\.\d{2}\.2026/);
    expect(formatted).toMatch(/\d{2}:\d{2}/);
  });

  it('creates non-empty ids', () => {
    expect(createGameNoteId().length).toBeGreaterThan(4);
  });
});
