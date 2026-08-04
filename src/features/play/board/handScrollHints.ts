/**
 * Pure scroll-overflow metrics for HandFan directional hints.
 * Location: src/features/play/board/handScrollHints.ts
 */

export const HAND_SCROLL_END_SLACK_PX = 2;
/** Sideways scroll step when a hint chevron is clicked (~75% of visible width). */
export const HAND_SCROLL_STEP_RATIO = 0.75;

export type HandScrollMetrics = {
  scrollLeft: number;
  clientWidth: number;
  scrollWidth: number;
};

export type HandScrollHintDirection = 'left' | 'right';

/** Whether the hand row can scroll further left / right. */
export function measureHandScrollHints(
  metrics: HandScrollMetrics,
  slackPx: number = HAND_SCROLL_END_SLACK_PX,
): { canScrollLeft: boolean; canScrollRight: boolean } {
  const overflow = metrics.scrollWidth > metrics.clientWidth + slackPx;
  if (!overflow) {
    return { canScrollLeft: false, canScrollRight: false };
  }
  return {
    canScrollLeft: metrics.scrollLeft > slackPx,
    canScrollRight:
      metrics.scrollLeft + metrics.clientWidth < metrics.scrollWidth - slackPx,
  };
}

/**
 * Prefer “more content to the right”; at the right end show left instead.
 * At most one hint is active.
 */
export function pickHandScrollHint(
  canScrollLeft: boolean,
  canScrollRight: boolean,
): HandScrollHintDirection | null {
  if (canScrollRight) return 'right';
  if (canScrollLeft) return 'left';
  return null;
}
