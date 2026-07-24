/**
 * Unit tests for play SFX bridge mapping (no sound card).
 * Location: src/features/play/audio/playSfxBridge.test.ts
 */
import { afterEach, describe, expect, it } from 'vitest';
import { audioManager } from '../../../services/audio/audioManager';
import {
  playInvalidAction,
  playMatchOutcome,
  soundIdForPresentationStart,
} from './playSfxBridge';

describe('soundIdForPresentationStart', () => {
  it('maps critical presentation kinds to typed IDs', () => {
    expect(soundIdForPresentationStart('draw-card')).toBe('card.draw');
    expect(soundIdForPresentationStart('build-snap')).toBe('card.play');
    expect(soundIdForPresentationStart('activate-discard')).toBe('card.discard');
    expect(soundIdForPresentationStart('attack-card-fly')).toBe('combat.attack');
    expect(soundIdForPresentationStart('combat-resolve')).toBe('dice.roll');
    expect(soundIdForPresentationStart('damage-hit')).toBe('combat.damage.light');
    expect(soundIdForPresentationStart('unknown')).toBeNull();
  });
});

describe('playSfxBridge cooldowns', () => {
  afterEach(() => {
    audioManager._resetForTests();
  });

  it('invalid action and match outcome do not throw', () => {
    expect(() => playInvalidAction()).not.toThrow();
    expect(() => playInvalidAction()).not.toThrow();
    expect(() => playMatchOutcome(true)).not.toThrow();
    expect(() => playMatchOutcome(false)).not.toThrow();
  });
});
