import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import {
  isMuted,
  setMuted,
  playStinger,
  playStingerSequence,
  unlockAudio,
  type StingerKind,
} from './combatStingers';

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

describe('combatStingers', () => {
  beforeEach(() => {
    const storage = new MockStorage();
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('window', {
      localStorage: storage,
      setTimeout: (fn: () => void, ms: number) => setTimeout(fn, ms),
      AudioContext: vi.fn(() => ({
        state: 'running',
        currentTime: 0,
        sampleRate: 44100,
        destination: { connect: vi.fn() },
        createGain: vi.fn(() => ({
          gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
          connect: vi.fn(),
        })),
        createOscillator: vi.fn(() => ({
          type: 'square',
          frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        })),
        createBuffer: vi.fn(() => ({ getChannelData: () => new Float32Array(10) })),
        createBufferSource: vi.fn(() => ({
          buffer: null,
          connect: vi.fn(),
          start: vi.fn(),
        })),
        createBiquadFilter: vi.fn(() => ({
          type: 'lowpass',
          frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
          connect: vi.fn(),
        })),
        resume: vi.fn(() => Promise.resolve()),
      })),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('mute state', () => {
    it('isMuted returns false by default', () => {
      expect(isMuted()).toBe(false);
    });

    it('setMuted(true) persists and isMuted reads it', () => {
      setMuted(true);
      expect(localStorage.getItem('letz-fetz-muted')).toBe('1');
      expect(isMuted()).toBe(true);
    });

    it('setMuted(false) clears mute', () => {
      setMuted(true);
      setMuted(false);
      expect(isMuted()).toBe(false);
    });
  });

  describe('playStinger', () => {
    it('does not throw when muted', () => {
      setMuted(true);
      expect(() => playStinger('play')).not.toThrow();
    });

    it('does not throw when AudioContext is unavailable', () => {
      vi.stubGlobal('AudioContext', undefined);
      expect(() => playStinger('block')).not.toThrow();
    });

    it('playStinger is a no-op when muted (no AudioContext created)', () => {
      setMuted(true);
      expect(() => playStinger('damage' as StingerKind)).not.toThrow();
    });
  });

  describe('playStingerSequence', () => {
    it('does not throw when muted', () => {
      setMuted(true);
      expect(() => playStingerSequence(['block', 'damage'])).not.toThrow();
    });

    it('does not throw when AudioContext is unavailable', () => {
      vi.stubGlobal('AudioContext', undefined);
      expect(() => playStingerSequence(['play'])).not.toThrow();
    });
  });

  describe('unlockAudio', () => {
    it('does not throw without AudioContext', () => {
      vi.stubGlobal('AudioContext', undefined);
      expect(() => unlockAudio()).not.toThrow();
    });
  });
});