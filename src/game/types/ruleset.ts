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
  /**
   * When true, V3 combat layer (statuses, shield, impulses, reactions) is active.
   * Default false — Engine-Default bleibt V1 bis Cutover (SPIELANLEITUNG_V3_WIP).
   */
  v3Combat?: boolean;
  /**
   * When true, V5 Formelboard (Technik/Essenz/Katalysator) replaces Bound-4 / Fetzgerät
   * for formula play. Combat layer typically also on. See SPIELANLEITUNG_V5_DRAFT.md.
   * Mutually exclusive with `v6Formula`.
   */
  v5Formula?: boolean;
  /**
   * When true, V6 Formel ruleset identity is active (INTERNAL foundation).
   * Mutually exclusive with `v5Formula`. Not Play-Default until PLAYABLE cutover.
   * See docs/letz-fetz-v6-spielkonzept.md §0.
   */
  v6Formula?: boolean;
  /** V5/V6 Fetzladung cap (default 3 when formula ruleset). Ignored when unset under legacy. */
  maxFetzCharge?: number;
}

/** Canonical match ruleset identity flags (never mix V5 + V6 formula). */
export interface MatchRulesetIdentity {
  v3Combat: boolean;
  v5Formula: boolean;
  v6Formula: boolean;
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
  v3Combat: false,
  v5Formula: false,
  v6Formula: false,
};

/** V1 defaults with V3 combat enabled (playtests / unit tests). */
export const V3_RULESET: RulesetConfig = {
  ...DEFAULT_RULESET,
  v3Combat: true,
};

/** V5 formula playtest defaults (20 LP, combat + formula, charge max 3). */
export const V5_RULESET: RulesetConfig = {
  ...DEFAULT_RULESET,
  maxBoundCards: 3,
  mainDeckSize: 106,
  v3Combat: true,
  v5Formula: true,
  v6Formula: false,
  maxFetzCharge: 3,
};

/**
 * V6 formula INTERNAL defaults (combat + v6Formula, charge max 3).
 * Not Play-Default until PLAYABLE cutover — tests/helpers only for Slice 0.
 */
export const V6_RULESET: RulesetConfig = {
  ...DEFAULT_RULESET,
  maxBoundCards: 3,
  mainDeckSize: 106,
  v3Combat: true,
  v5Formula: false,
  v6Formula: true,
  maxFetzCharge: 3,
};

/** Default V5 Fetzladung maximum when ruleset omits maxFetzCharge. */
export const V5_MAX_FETZ_CHARGE = 3;

/** Default V6 Fetzladung maximum when ruleset omits maxFetzCharge. */
export const V6_MAX_FETZ_CHARGE = 3;

export function assertExclusiveFormulaRuleset(ruleset: RulesetConfig): void {
  if (ruleset.v5Formula === true && ruleset.v6Formula === true) {
    throw new Error('RULESET_MIX: v5Formula and v6Formula are mutually exclusive');
  }
}

export function matchRulesetIdentityFrom(ruleset: RulesetConfig): MatchRulesetIdentity {
  assertExclusiveFormulaRuleset(ruleset);
  return {
    v3Combat: ruleset.v3Combat === true,
    v5Formula: ruleset.v5Formula === true,
    v6Formula: ruleset.v6Formula === true,
  };
}

export function isV3CombatEnabled(ruleset: RulesetConfig): boolean {
  return ruleset.v3Combat === true;
}

export function isV5FormulaEnabled(ruleset: RulesetConfig): boolean {
  return ruleset.v5Formula === true;
}

export function isV6FormulaEnabled(ruleset: RulesetConfig): boolean {
  return ruleset.v6Formula === true;
}

export function maxFetzChargeFor(ruleset: RulesetConfig): number {
  if (typeof ruleset.maxFetzCharge === 'number') return ruleset.maxFetzCharge;
  if (isV6FormulaEnabled(ruleset)) return V6_MAX_FETZ_CHARGE;
  if (isV5FormulaEnabled(ruleset)) return V5_MAX_FETZ_CHARGE;
  return 6;
}

export type PlayerId = 'p1' | 'p2';

export type TurnPhase = 'start' | 'draw' | 'build' | 'action' | 'end';

export const TURN_PHASES: TurnPhase[] = ['start', 'draw', 'build', 'action', 'end'];

export interface CharacterElements {
  primary: Element;
  secondary: Element;
}
