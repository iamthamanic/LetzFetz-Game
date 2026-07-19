/**
 * GamePresentationQueue — UI-only animation sequencing layer.
 * Location: src/components/game/presentation/
 *
 * ## Purpose
 * Sits between engine `dispatch` and immediate React re-render so Deal/Draw/Play
 * animations can run in order without duplicating rules in `src/game/`.
 *
 * ## API
 * | Export | Role |
 * |--------|------|
 * | `usePresentationQueue` | React hook — `enqueue`, `completeStep`, `skip`, `flush` |
 * | `enqueuePresentationSteps` | Pure reducer — append steps (unit-tested) |
 * | `completePresentationStep` | Advance after animation / timer |
 * | `skipPresentation` | Abort sequence, unlock input (`skipped: true`) |
 * | `flushPresentationQueue` | Hard reset (match end / rematch) |
 *
 * ## Usage sketch (GameView)
 * ```ts
 * const presentation = usePresentationQueue({ onQueueIdle: () => setDisplayState(engineState) });
 * // After engine produces next state:
 * presentation.enqueue(dealSteps);
 * // While presentation.isInputLocked — block human dispatch + defer bot ticks
 * ```
 *
 * ## Edge cases
 * - **Bot during animation:** GameView should not run bot effect while `isInputLocked`.
 * - **Reduced motion:** `prefers-reduced-motion` → enqueue calls `skip` immediately.
 * - **Match end:** call `flush()` when `state.winner` is set or on rematch.
 */
export type { PresentationStep, PresentationStepId, PresentationQueueSnapshot } from './types';
export {
  IDLE_PRESENTATION_QUEUE,
  enqueuePresentationSteps,
  completePresentationStep,
  skipPresentation,
  flushPresentationQueue,
  isPresentationIdle,
  pendingPresentationCount,
} from './presentationQueue';
export { prefersReducedMotion } from './prefersReducedMotion';
export { usePresentationQueue } from './usePresentationQueue';
export type { UsePresentationQueueOptions } from './usePresentationQueue';
export {
  buildOpeningDealSteps,
  isOpeningDealStep,
  fullDealRevealCounts,
  OPENING_DEAL_CARD_MS,
  openingDealBeats,
} from './buildOpeningDealSteps';
export type { OpeningDealBeat } from './buildOpeningDealSteps';
export {
  buildDrawCardStep,
  isDrawCardStep,
  findNewlyDrawnCard,
  DRAW_CARD_MS,
  DRAW_CARD_REVEAL_MS,
  DRAW_CARD_FLY_MS,
  DRAW_CARD_HIDDEN_MS,
} from './buildDrawCardStep';
export {
  buildBuildSnapStep,
  isBuildSnapStep,
  findNewlyBuiltCardIds,
  BUILD_SNAP_MS,
  BUILD_FLY_MS,
} from './buildBuildSnapStep';
export type { BuildSnapPayload } from './buildBuildSnapStep';
export {
  buildActivateDiscardStep,
  isActivateDiscardStep,
  findActivatedDiscardCardId,
  ACTIVATE_DISCARD_MS,
} from './buildActivateDiscardStep';
export {
  buildAttackCardFlyStep,
  isAttackCardFlyStep,
  ATTACK_CARD_FLY_MS,
} from './buildAttackCardFlyStep';
export {
  buildInstantGlitchRevealStep,
  buildInstantGlitchRevealSteps,
  isInstantGlitchRevealStep,
  INSTANT_GLITCH_REVEAL_MS,
} from './buildInstantGlitchRevealStep';
export {
  buildDamageHitStep,
  buildDamageHitSteps,
  isDamageHitStep,
  findHpLosses,
  DAMAGE_HIT_MS,
} from './buildDamageHitStep';
export {
  buildCombatResolveSnapshot,
  buildCombatResolveStep,
  isCombatResolveStep,
  COMBAT_RESOLVE_MS,
} from './buildCombatResolveStep';
export type { CombatResolveSnapshot, CombatResolveOutcome } from './buildCombatResolveStep';
export { OpeningDealFly } from './OpeningDealFly';
export { PlaymatCardFly } from './PlaymatCardFly';
export { DrawCardReveal } from './DrawCardReveal';
export { AttackCardFly } from './AttackCardFly';
export { BuildCardFly } from './BuildCardFly';
export { InstantGlitchReveal } from './InstantGlitchReveal';
export { DamageHitReveal } from './DamageHitReveal';
export { CombatResolveShow } from './CombatResolveShow';
export { findRemovedAttackCard } from './buildAttackCardFlyStep';
