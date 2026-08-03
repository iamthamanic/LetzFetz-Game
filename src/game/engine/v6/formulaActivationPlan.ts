/**
 * V6 formula activation plan types (UI + execute SoT).
 * Location: src/game/engine/v6/formulaActivationPlan.ts
 */
import type { PlayerId } from '../../types';
import type { V6GeneratedRecipeKind } from '../../../generated/v6/formulaRecipes.generated';
import type { V6RecipeTimingMode } from './echoDelay';

export type V6PrimaryKind =
  | 'damage'
  | 'heal'
  | 'shield'
  | 'prep_attack'
  | 'prep_block'
  | 'prep_boost'
  | 'fessel';

export interface V6PlanPrimary {
  kind: V6PrimaryKind;
  value: number;
  target: 'opponent' | 'self';
  offensive: boolean;
}

export interface V6PlanRider {
  id: string;
  summary: string;
  defenseSuppressible: boolean;
  suppressed: boolean;
}

export interface V6FormulaDefensePreview {
  /** Natural W6 before modifiers (1–6). */
  naturalRoll: number;
  /** Defense stages from bands: 0 / 1 / 2. */
  stages: 0 | 1 | 2;
  primaryAfterDefense: number;
  /** Intensity after defense (Fessel / non-numeric); null when recipe has no intensity. */
  intensityAfterDefense: number | null;
  riderSuppressed: boolean;
}

export interface FormulaActivationPlan {
  recipeId: string;
  kind: V6GeneratedRecipeKind;
  name: string;
  actorId: PlayerId;
  primary: V6PlanPrimary;
  rider: V6PlanRider | null;
  intensity: number | null;
  catalystConsumed: boolean;
  catalystInstanceId: string | null;
  grantsFetz: boolean;
  fetzDelta: number;
  /** Spend all charge when firing Überformel. */
  spendAllFetz: boolean;
  postFormulaActionLock: 'none' | 'attack_and_challenge';
  formulaDefense: V6FormulaDefensePreview | null;
  offerDiscardRequired: boolean;
  offerDiscardBonus: number;
  selfDamage: number;
  drawDiscardAfter: boolean;
  stabilityBuffUsed: number;
  formulaDefensePenalty: number;
  /** Echo / Delay timing (§8). Default immediate. */
  timingMode: V6RecipeTimingMode;
  /** Echo: points of primary to replay next Startphase. */
  echoAmount: number;
  /** Delay: bonus added to deferred primary value. */
  delayBonus: number;
  eventSummary: string;
}
