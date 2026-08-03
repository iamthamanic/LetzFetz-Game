/**
 * defaultPackChoice stays V5 when V6 flag is on (#336).
 * Location: src/features/play/setup/defaultPackChoice.test.ts
 */
import { describe, expect, it } from 'vitest';
import { defaultPackChoice } from './GameSetup';

describe('defaultPackChoice', () => {
  it('returns v5 whether V6 playable flag is on or off', () => {
    expect(defaultPackChoice(false)).toBe('v5');
    expect(defaultPackChoice(true)).toBe('v5');
  });
});
