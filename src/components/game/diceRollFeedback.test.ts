import { describe, expect, it } from 'vitest';
import { buildDiceRollFeedback, formatDiceBonusLabel } from './diceRollFeedback';

describe('diceRollFeedback', () => {
  it('formats bonus labels for rulebook tiers', () => {
    expect(formatDiceBonusLabel(0)).toBe('Bonus +0');
    expect(formatDiceBonusLabel(1)).toBe('Bonus +1');
    expect(formatDiceBonusLabel(2)).toBe('Bonus +2');
  });

  it('maps roll to bonus via engine dice table', () => {
    expect(buildDiceRollFeedback(2)).toEqual({
      roll: 2,
      bonus: 0,
      bonusLabel: 'Bonus +0',
    });
    expect(buildDiceRollFeedback(4).bonus).toBe(1);
    expect(buildDiceRollFeedback(6).bonusLabel).toBe('Bonus +2');
  });
});
