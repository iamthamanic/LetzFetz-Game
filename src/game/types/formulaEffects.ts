/**
 * Structured V5 formula component effects (data-driven resolve).
 * Location: src/game/types/formulaEffects.ts
 */
import type { PrimaryMarkId } from './status';

export type FormulaTechniqueEffect =
  | { kind: 'instant_shield'; amount: number }
  | { kind: 'instant_heal'; amount: number }
  | { kind: 'instant_clear_own_mark' }
  | { kind: 'instant_enemy_stability'; amount: number }
  | { kind: 'instant_retrieve_formula' }
  | { kind: 'enemy_next_attack_penalty'; amount: number }
  | {
      kind: 'prep_attack';
      combatBonus?: number;
      ignoreShield?: number;
      /** Kettenhieb: strip this much shield when the attack deals HP damage. */
      stripShieldOnHpDamage?: number;
      /** Fächerstoß: element impulse already on tie. */
      impulseOnTie?: boolean;
    }
  | {
      kind: 'prep_block';
      combatBonus?: number;
      /** Retourkutsche: damage attacker on full block. */
      thornsOnFullBlock?: number;
    }
  | {
      kind: 'prep_boost';
      valueBonus?: number;
      /** Fokuskurbel: after non-numeric boost, draw 1 and discard 1. */
      filterHandIfNoValue?: boolean;
    };

export type FormulaEssenceEffect =
  | { kind: 'mark_if_no_reaction'; mark: PrimaryMarkId }
  | {
      kind: 'reaction_bonus_then_stability';
      reactionDamageBonus: number;
      stabilityDelta: number;
    }
  | { kind: 'amplify_heal_or_shield'; amount: number }
  | { kind: 'stability_buff_used'; amount: number }
  | { kind: 'w6_bonus'; amount: number; max: number }
  | { kind: 'clear_mark_or_shield' }
  | { kind: 'lifesteal_on_hp'; amount: number };

export type FormulaCatalystEffect =
  | {
      kind: 'primary_bonus';
      amount: number;
      selfDamage?: number;
      /** Verdichtung: also buff used components' stability. */
      stabilityBuffUsed?: number;
      /** Sofortzünder: draw 1 then discard 1 after resolve. */
      drawDiscardAfter?: boolean;
    }
  | { kind: 'mirror_shield_on_hit'; amount: number }
  | {
      kind: 'echo_next_start';
      amount: number;
      /** Doppelecho: katalysator stays exhausted next start. */
      stayExhausted?: boolean;
    }
  | { kind: 'spread_stability'; amount: number }
  | { kind: 'chain_same_action'; amount: number }
  | { kind: 'delay_primary'; bonus: number }
  | { kind: 'invert_damage_heal'; maxPoints: number }
  | { kind: 'offer_discard_for_bonus'; amount: number }
  | { kind: 'safety_valve' };

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
  /** Kettenhieb */
  stripShieldOnHpDamage: number;
  /** Fächerstoß */
  impulseOnTie: boolean;
  /** Retourkutsche */
  thornsOnFullBlock: number;
  /** Explosionspüree */
  reactionDamageBonus: number;
  /** Sogschatten */
  lifestealOnHp: number;
  /** Druckluftkonzentrat */
  w6Bonus: number;
  w6BonusMax: number;
  /** Fokuskurbel */
  boostFilterHandIfNoValue: boolean;
  /** Spiegelung defensive: damage attacker on full block / shield gain. */
  mirrorThornsOnFullBlock: number;
  /** Kettenkopplung */
  chainSameActionBonus: number;
  /** Primary action type prepared by Technik (for chain / boost consume). */
  preparedActionType?: 'attack' | 'block' | 'boost';
}
