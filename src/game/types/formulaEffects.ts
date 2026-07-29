/**
 * Structured V5 formula component effects (data-driven resolve).
 * Location: src/game/types/formulaEffects.ts
 */
import type { PrimaryMarkId } from './status';

export type FormulaTechniqueEffect =
  | { kind: 'instant_shield'; amount: number }
  | { kind: 'instant_heal'; amount: number }
  | {
      kind: 'prep_attack';
      combatBonus?: number;
      ignoreShield?: number;
    }
  | { kind: 'prep_block'; combatBonus?: number }
  | { kind: 'prep_boost'; valueBonus?: number };

export type FormulaEssenceEffect = {
  kind: 'mark_if_no_reaction';
  mark: PrimaryMarkId;
};

export type FormulaCatalystEffect =
  | { kind: 'primary_bonus'; amount: number; selfDamage?: number }
  | { kind: 'mirror_shield_on_hit'; amount: number };

/** Pending prep after Formelaktivierung (cleared when consumed). */
export interface FormulaPrepState {
  attackCombatBonus: number;
  attackIgnoreShield: number;
  blockCombatBonus: number;
  boostValueBonus: number;
  /** Essenz: apply this mark on hit if no reaction fired this action. */
  markIfNoReaction?: PrimaryMarkId;
  /** Katalysator: grant shield to attacker on successful hit. */
  mirrorShieldOnHit: number;
  /** Applied immediately after activate (Überladung). */
  pendingSelfDamage: number;
}
