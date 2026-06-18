import { describe, it, expect } from 'vitest';
import {
  calculateCombatValue,
  counterBonus,
  resolveDamage,
  challengeSucceeded,
} from './combat';
import { diceBonusFromRoll } from './dice';
import { DEFAULT_RULESET } from '../types';

describe('combat — rulebook §8.1 example', () => {
  it('Feuer 4 Angriff (Wurf 5) vs Wasser 4 Block (Wurf 3) → 1 Schaden', () => {
    const attackRoll = 5;
    const blockRoll = 3;
    const attackDiceBonus = diceBonusFromRoll(attackRoll, DEFAULT_RULESET);
    const blockDiceBonus = diceBonusFromRoll(blockRoll, DEFAULT_RULESET);

    const attackValue = calculateCombatValue({
      cardValue: 4,
      diceRoll: attackRoll,
      diceBonus: attackDiceBonus,
      characterElements: ['earth', 'fire'],
      cardElement: 'fire',
    });

    const blockValue = calculateCombatValue({
      cardValue: 4,
      diceRoll: blockRoll,
      diceBonus: blockDiceBonus,
      characterElements: ['water', 'light'],
      cardElement: 'water',
      attackElement: 'fire',
      blockElement: 'water',
    });

    expect(attackValue).toBe(7);
    expect(blockValue).toBe(6);
    expect(resolveDamage(attackValue, blockValue)).toBe(1);
  });
});

describe('counterBonus', () => {
  it('Wasser kontert Feuer → +1 für Angreifer', () => {
    expect(counterBonus('water', 'fire')).toBe(1);
    expect(counterBonus('fire', 'water')).toBe(0);
  });
});

describe('challengeSucceeded', () => {
  it('requires attack to exceed target (tie survives)', () => {
    expect(challengeSucceeded(6, 3, 3)).toBe(false);
    expect(challengeSucceeded(7, 3, 3)).toBe(true);
  });
});
