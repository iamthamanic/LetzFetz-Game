import { describe, expect, it } from 'vitest';
import {
  ELEMENT_ATTACK_VIDEO_PROMPTS,
  ALL_ELEMENTS_WITH_ATTACK_VIDEOS,
  ELEMENT_ATTACK_VIDEO_DURATION,
  elementAttackVideoPrompt,
  elementAttackVideoKey,
} from './elementAttackVideos';
import type { Element } from '../../../game/types';

describe('elementAttackVideos', () => {
  it('has prompts for all 6 elements', () => {
    for (const element of ALL_ELEMENTS_WITH_ATTACK_VIDEOS) {
      expect(ELEMENT_ATTACK_VIDEO_PROMPTS[element]).toBeTruthy();
      expect(ELEMENT_ATTACK_VIDEO_PROMPTS[element].length).toBeGreaterThan(50);
    }
  });

  it('elementAttackVideoPrompt returns the same prompt as the map', () => {
    const element: Element = 'fire';
    expect(elementAttackVideoPrompt(element)).toBe(ELEMENT_ATTACK_VIDEO_PROMPTS.fire);
  });

  it('elementAttackVideoKey returns element-attack format', () => {
    expect(elementAttackVideoKey('water')).toBe('water-attack');
    expect(elementAttackVideoKey('shadow')).toBe('shadow-attack');
  });

  it('has 5 second duration', () => {
    expect(ELEMENT_ATTACK_VIDEO_DURATION).toBe(5);
  });

  it('all 6 elements are covered', () => {
    expect(ALL_ELEMENTS_WITH_ATTACK_VIDEOS).toHaveLength(6);
    expect(ALL_ELEMENTS_WITH_ATTACK_VIDEOS).toContain('fire');
    expect(ALL_ELEMENTS_WITH_ATTACK_VIDEOS).toContain('water');
    expect(ALL_ELEMENTS_WITH_ATTACK_VIDEOS).toContain('earth');
    expect(ALL_ELEMENTS_WITH_ATTACK_VIDEOS).toContain('air');
    expect(ALL_ELEMENTS_WITH_ATTACK_VIDEOS).toContain('shadow');
    expect(ALL_ELEMENTS_WITH_ATTACK_VIDEOS).toContain('light');
  });
});