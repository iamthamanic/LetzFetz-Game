/**
 * Unit tests for AudioManager and volume formula (no sound card required).
 * Location: src/services/audio/audioManager.test.ts
 */
import { afterEach, describe, expect, it } from 'vitest';
import { audioManager } from './audioManager';
import { CLASH_GONG_ATTACK_LEAD_SEC, CLASH_IMPACT_FRACTION } from './clashSound';
import { effectiveVolume, type AppliedAudioSettings } from './types';

const base: AppliedAudioSettings = {
  muted: false,
  master: 1,
  sfx: 1,
  ui: 1,
  ambience: 0.6,
  music: 0.7,
};

describe('effectiveVolume', () => {
  it('returns 0 when muted', () => {
    expect(effectiveVolume({ ...base, muted: true }, 'sfx', 1)).toBe(0);
  });

  it('multiplies master × category × base', () => {
    expect(
      effectiveVolume({ ...base, master: 0.5, sfx: 0.4 }, 'sfx', 0.5),
    ).toBeCloseTo(0.1);
  });

  it('clamps to 1', () => {
    expect(effectiveVolume({ ...base, master: 1, sfx: 1 }, 'sfx', 2)).toBe(1);
  });
});

describe('clash timing constants', () => {
  it('keeps impact fraction at 85%', () => {
    expect(CLASH_IMPACT_FRACTION).toBe(0.85);
  });

  it('starts the gong slightly before impact', () => {
    expect(CLASH_GONG_ATTACK_LEAD_SEC).toBeGreaterThan(0);
    expect(CLASH_GONG_ATTACK_LEAD_SEC).toBeLessThan(0.1);
  });
});

describe('audioManager', () => {
  afterEach(() => {
    audioManager._resetForTests();
  });

  it('applySettings muted makes isMuted true and play is no-op', () => {
    audioManager.applySettings({
      muted: true,
      master: 1,
      sfx: 1,
      ui: 1,
      ambience: 0.6,
      music: 0.7,
    });
    expect(audioManager.isMuted()).toBe(true);
    expect(() => audioManager.playStinger('play')).not.toThrow();
    expect(() => audioManager.playClashAt(0)).not.toThrow();
    expect(() => audioManager.play('combat.block')).not.toThrow();
  });

  it('playWithCooldown suppresses rapid repeats', () => {
    expect(audioManager.playWithCooldown('ui.click', 5000)).toBe(true);
    expect(audioManager.playWithCooldown('ui.click', 5000)).toBe(false);
  });

  it('unlock and unmuted stinger do not throw without AudioContext', () => {
    audioManager.applySettings({
      muted: false,
      master: 1,
      sfx: 1,
      ui: 1,
      ambience: 0.6,
      music: 0.7,
    });
    expect(() => audioManager.unlock()).not.toThrow();
    expect(() => audioManager.playStinger('block')).not.toThrow();
    expect(() =>
      audioManager.playStingerSequence(['block', 'damage'], 10),
    ).not.toThrow();
  });
});
