/**
 * DOM measurement for TargetingArrow — hand card → challenge target or bot dock.
 * Location: src/features/play/board/zones/measureTargetingArrowCoords.ts
 */
import type { TargetingArrowCoords } from './TargetingArrow';

export interface TargetingArrowRootRect {
  width: number;
  height: number;
}

export interface MeasureTargetingArrowInput {
  root: HTMLElement;
  /** Selected attack hand card instance id. */
  attackInstanceId: string;
  /** Optional selected challenge / formula / construct target. */
  targetBoundInstanceId?: string;
}

export interface MeasureTargetingArrowResult {
  rootRect: TargetingArrowRootRect;
  coords: TargetingArrowCoords | null;
}

/**
 * Measure source (hand) and target (selected challenge → first targetable → bot dock)
 * relative to the playmat root.
 */
export function measureTargetingArrowCoords(
  input: MeasureTargetingArrowInput,
): MeasureTargetingArrowResult {
  const { root, attackInstanceId, targetBoundInstanceId } = input;
  const rect = root.getBoundingClientRect();
  const rootRect = { width: rect.width, height: rect.height };

  const selectedCard =
    (root.querySelector(
      `[data-hand-card-id="${attackInstanceId}"]`,
    ) as HTMLElement | null) ??
    (root.querySelector('[data-selected-attack="true"]') as HTMLElement | null);

  if (!selectedCard) {
    return { rootRect, coords: null };
  }

  const sourceRect = selectedCard.getBoundingClientRect();
  const source = {
    x: sourceRect.left + sourceRect.width / 2 - rect.left,
    y: sourceRect.bottom - rect.top,
  };

  let targetEl: HTMLElement | null = null;
  if (targetBoundInstanceId) {
    targetEl = root.querySelector(
      '[data-challenge-selected="true"]',
    ) as HTMLElement | null;
  }
  if (!targetEl) {
    // Bound slots, formula components, and construct zone all expose data-targetable.
    targetEl = root.querySelector('[data-targetable="true"]') as HTMLElement | null;
  }

  let target: { x: number; y: number } | null = null;
  if (targetEl) {
    const targetRect = targetEl.getBoundingClientRect();
    target = {
      x: targetRect.left + targetRect.width / 2 - rect.left,
      y: targetRect.top + targetRect.height / 2 - rect.top,
    };
  } else {
    const dock = root.querySelector(
      '[data-character-dock="bot"]',
    ) as HTMLElement | null;
    if (dock) {
      const dockRect = dock.getBoundingClientRect();
      target = {
        x: dockRect.left + dockRect.width / 2 - rect.left,
        y: dockRect.top + dockRect.height / 2 - rect.top,
      };
    }
  }

  return { rootRect, coords: target ? { source, target } : null };
}
