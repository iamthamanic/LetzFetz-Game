/**
 * Tests for character idle video prompts and loop config.
 * Location: src/services/cardArt/prompts/characterIdleVideos.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  CHARACTER_IDLE_LOOP_BLEND_SEC,
  CHARACTER_IDLE_MASTER_DURATION,
  CHARACTER_IDLE_PLAYBACK_SLOW_FACTOR,
  CHARACTER_IDLE_PROMPTS,
  CHARACTER_IDLE_REGEN_IDS,
  characterIdleBakedDurationSec,
  characterIdleFullTrimBounds,
  characterIdleLoopBlendForScore,
  characterIdleLoopWindow,
  characterIdleVideoPrompt,
} from './characterIdleVideos';

describe('characterIdleVideos', () => {
  it('uses adaptive full-span slow-mo bake defaults', () => {
    expect(CHARACTER_IDLE_MASTER_DURATION).toBe(12);
    expect(CHARACTER_IDLE_PLAYBACK_SLOW_FACTOR).toBe(2);
    expect(CHARACTER_IDLE_LOOP_BLEND_SEC).toBe(0.65);
    expect(characterIdleBakedDurationSec('knuspergnom')).toBeCloseTo(22.6, 1);
    expect(characterIdleBakedDurationSec('kokabell')).toBeCloseTo(28.6, 1);
    expect(characterIdleBakedDurationSec('pillendoktora')).toBeCloseTo(28.6, 1);
  });

  it('lists four regen candidates', () => {
    expect(CHARACTER_IDLE_REGEN_IDS).toEqual([
      'knuspergnom',
      'pillendoktora',
      'stiernackenkommando',
      'dripministerin',
    ]);
  });

  it('scales blend with loop score', () => {
    expect(characterIdleLoopBlendForScore(10)).toBe(0.65);
    expect(characterIdleLoopBlendForScore(22)).toBe(0.85);
    expect(characterIdleLoopBlendForScore(33)).toBe(1.0);
    expect(characterIdleLoopBlendForScore(50)).toBe(1.1);
  });

  it('requires locked camera and loop-ready motion in every prompt', () => {
    for (const prompt of Object.values(CHARACTER_IDLE_PROMPTS)) {
      expect(prompt.toLowerCase()).toContain('locked camera');
      expect(prompt.toLowerCase()).toContain('loop-ready');
    }
  });

  it('knuspergnom uses one full spit rotation per clip', () => {
    const prompt = characterIdleVideoPrompt('knuspergnom') ?? '';
    expect(prompt.toLowerCase()).toContain('360-degree rotation');
    expect(prompt.toLowerCase()).toContain('döner spit');
  });

  it('pillendoktora avoids one-shot gestures', () => {
    const prompt = characterIdleVideoPrompt('pillendoktora') ?? '';
    expect(prompt.toLowerCase()).toContain('no arm gestures');
    expect(prompt.toLowerCase()).not.toContain('adjusts glasses');
  });

  it('exposes baked playback window from nominal trim × slow factor', () => {
    const bounds = characterIdleFullTrimBounds('knuspergnom');
    expect(bounds.end - bounds.start).toBeCloseTo(11.3, 1);
    const win = characterIdleLoopWindow('knuspergnom');
    expect(win?.bakedSeamless).toBe(true);
    expect(win?.end).toBeCloseTo(characterIdleBakedDurationSec('knuspergnom') - 0.04, 2);
  });
});
