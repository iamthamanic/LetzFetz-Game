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
} from './buildOpeningDealSteps';
export { OpeningDealFly } from './OpeningDealFly';
