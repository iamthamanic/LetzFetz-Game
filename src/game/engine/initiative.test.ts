/**
 * Unit tests for initiative W6 comparison.
 * Location: src/game/engine/initiative.test.ts
 */
import { describe, it, expect } from 'vitest';
import { resolveInitiative, startingPlayerFromInitiative } from './initiative';

describe('resolveInitiative', () => {
  it('awards start to higher roll', () => {
    expect(resolveInitiative(6, 1).outcome).toBe('p1');
    expect(resolveInitiative(2, 5).outcome).toBe('p2');
    expect(startingPlayerFromInitiative(resolveInitiative(4, 3))).toBe('p1');
  });

  it('ties require re-roll', () => {
    const tie = resolveInitiative(3, 3);
    expect(tie.outcome).toBe('tie');
    expect(startingPlayerFromInitiative(tie)).toBeNull();
  });
});
