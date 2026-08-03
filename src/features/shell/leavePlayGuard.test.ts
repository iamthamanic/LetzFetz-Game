/**
 * Unit tests for leave-Play navigation policy.
 * Location: src/features/shell/leavePlayGuard.test.ts
 */
import { describe, expect, it } from 'vitest';
import { classifyLeavePlay } from './leavePlayGuard';

describe('classifyLeavePlay', () => {
  it('does not gate same-view or non-Play leaves', () => {
    expect(classifyLeavePlay('play', 'play', true)).toBe('none');
    expect(classifyLeavePlay('forge', 'menu', true)).toBe('none');
    expect(classifyLeavePlay('menu', 'play', true)).toBe('none');
  });

  it('blocks Hauptmenü leave during a live match (history/tabs cannot eject)', () => {
    expect(classifyLeavePlay('play', 'menu', true)).toBe('block-leave-to-menu');
  });

  it('soft-pauses when leaving Play to Material/Build during a live match', () => {
    expect(classifyLeavePlay('play', 'forge', true)).toBe('confirm-pause-match');
    expect(classifyLeavePlay('play', 'build', true)).toBe('confirm-pause-match');
  });

  it('confirms setup leave when Play has no live match', () => {
    expect(classifyLeavePlay('play', 'menu', false)).toBe('confirm-leave-setup');
    expect(classifyLeavePlay('play', 'forge', false)).toBe('confirm-leave-setup');
  });
});
