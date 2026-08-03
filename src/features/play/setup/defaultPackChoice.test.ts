/**
 * defaultPackChoice is V6 after Play-Default cutover (#353).
 * Location: src/features/play/setup/defaultPackChoice.test.ts
 */
import { describe, expect, it } from 'vitest';
import { defaultPackChoice } from './GameSetup';

describe('defaultPackChoice', () => {
  it('returns v6 as Play-Default', () => {
    expect(defaultPackChoice(false)).toBe('v6');
    expect(defaultPackChoice(true)).toBe('v6');
  });
});
