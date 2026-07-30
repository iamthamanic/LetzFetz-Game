/**
 * Pure geometry for Combinate slot→preview connection paths.
 * Location: src/features/build/buildSlotConnectionPaths.ts
 */
import type { BuildSlotRole } from './model/buildTypes';

export interface ConnectionPoint {
  x: number;
  y: number;
}

export interface SlotAnchorPoint extends ConnectionPoint {
  role: BuildSlotRole;
}

export interface SlotConnectionGeometry {
  /** Path from each filled slot port up to the shared merge rail. */
  curves: Array<{ role: BuildSlotRole; d: string }>;
  /** Vertical stem from merge rail into the preview port. */
  stem: string;
  /** Arrowhead at the preview entry. */
  arrow: string;
  merge: ConnectionPoint;
  target: ConnectionPoint;
}

/**
 * Build SVG path data when ≥1 slots feed the preview.
 *
 * Topology (always visible, even when a slot sits under the preview center):
 *   slot → up to railY → horizontal to mergeX → vertical stem into preview.
 */
export function buildSlotConnectionGeometry(
  slots: SlotAnchorPoint[],
  target: ConnectionPoint,
): SlotConnectionGeometry | null {
  if (slots.length < 1) return null;

  const avgSlotY = slots.reduce((sum, s) => sum + s.y, 0) / slots.length;
  const gap = Math.max(48, avgSlotY - target.y);

  /** Rail sits in the gap, leaving a long clear stem into the preview. */
  const railY = target.y + Math.min(gap * 0.62, gap - 36);
  const merge: ConnectionPoint = {
    x: target.x,
    y: railY,
  };

  const curves = slots.map((slot) => {
    const rise = Math.max(20, slot.y - railY);
    const bendY = slot.y - rise * 0.55;
    /** Soft vertical leave, then horizontal into the merge on the rail. */
    const d = [
      `M ${slot.x.toFixed(1)} ${slot.y.toFixed(1)}`,
      `C ${slot.x.toFixed(1)} ${bendY.toFixed(1)}, ${slot.x.toFixed(1)} ${railY.toFixed(1)}, ${slot.x.toFixed(1)} ${railY.toFixed(1)}`,
      `L ${merge.x.toFixed(1)} ${merge.y.toFixed(1)}`,
    ].join(' ');
    return { role: slot.role, d };
  });

  const stemTop = target.y;
  const stem = `M ${merge.x.toFixed(1)} ${merge.y.toFixed(1)} L ${target.x.toFixed(1)} ${stemTop.toFixed(1)}`;
  const arrowSize = 7;
  const arrow = [
    `M ${target.x.toFixed(1)} ${stemTop.toFixed(1)}`,
    `L ${(target.x - arrowSize).toFixed(1)} ${(stemTop + arrowSize + 2).toFixed(1)}`,
    `L ${(target.x + arrowSize).toFixed(1)} ${(stemTop + arrowSize + 2).toFixed(1)}`,
    'Z',
  ].join(' ');

  return { curves, stem, arrow, merge, target };
}
