import type { Element } from './elements';

/** Tunable rules — defaults match Letz Fetz V1 rulebook. */
export interface RulesetConfig {
  startingHp: number;
  maxHp: number;
  maxBoundCards: number;
  handLimit: number;
  p1StartingHand: number;
  p2SecondHand: number;
  mainDeckSize: number;
  diceBonusTable: { min: number; max: number; bonus: number }[];
}

export const DEFAULT_RULESET: RulesetConfig = {
  startingHp: 20,
  maxHp: 20,
  maxBoundCards: 4,
  handLimit: 6,
  p1StartingHand: 5,
  p2SecondHand: 6,
  mainDeckSize: 70,
  diceBonusTable: [
    { min: 1, max: 2, bonus: 0 },
    { min: 3, max: 4, bonus: 1 },
    { min: 5, max: 6, bonus: 2 },
  ],
};

export type PlayerId = 'p1' | 'p2';

export type TurnPhase = 'start' | 'draw' | 'bind' | 'action' | 'end';

export const TURN_PHASES: TurnPhase[] = ['start', 'draw', 'bind', 'action', 'end'];

export interface CharacterElements {
  primary: Element;
  secondary: Element;
}
