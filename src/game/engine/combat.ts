import type { Element } from '../types';
import { countersElement } from '../types';

export interface CombatBonusInput {
  cardValue: number;
  diceRoll: number;
  diceBonus: number;
  characterElements: Element[];
  cardElement: Element;
  /** +1 when attack element counters block element (attack vs block only). */
  attackElement?: Element;
  blockElement?: Element;
  extraBonus?: number;
}

/** +1 if card element matches either character element. */
export function characterElementBonus(
  cardElement: Element,
  characterElements: Element[],
): number {
  return characterElements.includes(cardElement) ? 1 : 0;
}

export function counterBonus(attackElement: Element, blockElement: Element): number {
  return countersElement(attackElement, blockElement) ? 1 : 0;
}

export function calculateCombatValue(input: CombatBonusInput): number {
  const elementBonus = characterElementBonus(input.cardElement, input.characterElements);
  const counter =
    input.attackElement && input.blockElement
      ? counterBonus(input.attackElement, input.blockElement)
      : 0;
  return (
    input.cardValue +
    input.diceBonus +
    elementBonus +
    counter +
    (input.extraBonus ?? 0)
  );
}

export function resolveDamage(attackValue: number, blockValue: number): number {
  const damage = attackValue - blockValue;
  return damage > 0 ? damage : 0;
}

/** Challenge: attack must exceed resistance + block (+ bonuses). */
export function challengeSucceeded(
  attackValue: number,
  targetResistance: number,
  blockValue: number,
  margin = 1,
): boolean {
  const targetValue = targetResistance + blockValue;
  return attackValue > targetValue + (margin - 1);
}
