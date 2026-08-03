/**
 * V6 formula engine public surface.
 * Location: src/game/engine/v6/index.ts
 */
export type { FormulaActivationPlan } from './formulaActivationPlan';
export { planFormulaActivation, revalidateFormulaPlan } from './planFormulaActivation';
export type { PlanFormulaActivationInput } from './planFormulaActivation';
export { applyV6FormulaActivate, executeFormulaActivation } from './executeFormulaActivation';
export { applyV6DefenseToPrimary, v6DefenseStagesFromRoll } from './formulaDefense';
export {
  applyFesselToBoard,
  applyFesselToPlayer,
  applyV6DefenseToIntensity,
  tickFesselAndRestoreOwnerFormulaV6,
} from './fessel';
export { findV6Recipe, getV6RecipeById } from './recipeLookup';
export {
  applyV6AffinityMode,
  formulaAffinityElement,
  shouldOfferV6Affinity,
  shouldOfferV6AffinityOnBlock,
} from './affinity';
export {
  constructDisplayName,
  V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID,
} from './constructs';
