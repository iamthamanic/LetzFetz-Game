/**
 * Pure loop-point scoring — finds best start/end window by frame similarity.
 * Location: src/services/cardArt/loopPointSearch.ts
 */

export interface LoopCandidate {
  start: number;
  end: number;
  score: number;
}

export interface LoopSearchBounds {
  searchStart: number;
  searchEnd: number;
  targetLoopSec: number;
  sampleStepSec: number;
}

/** Mean absolute RGB difference (0 = identical, 255 = opposite). */
export function frameDifferenceRgb(a: Uint8Array, b: Uint8Array): number {
  if (a.length !== b.length || a.length === 0) return Number.POSITIVE_INFINITY;
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    sum += Math.abs(a[i] - b[i]);
  }
  return sum / a.length;
}

export function buildLoopCandidates(bounds: LoopSearchBounds): Array<{ start: number; end: number }> {
  const { searchStart, searchEnd, targetLoopSec, sampleStepSec } = bounds;
  const candidates: Array<{ start: number; end: number }> = [];
  const maxStart = searchEnd - targetLoopSec;
  if (maxStart < searchStart) return candidates;

  for (let start = searchStart; start <= maxStart + 1e-6; start += sampleStepSec) {
    candidates.push({ start, end: start + targetLoopSec });
  }
  return candidates;
}

export function pickBestLoopCandidate(candidates: LoopCandidate[]): LoopCandidate | null {
  if (candidates.length === 0) return null;
  return candidates.reduce((best, cur) => (cur.score < best.score ? cur : best));
}

/** Average RGB diff at several phase offsets — smoother than single-frame compare. */
export function scoreLoopWindowRgb(
  headFrames: Uint8Array[],
  tailFrames: Uint8Array[],
): number {
  const n = Math.min(headFrames.length, tailFrames.length);
  if (n === 0) return Number.POSITIVE_INFINITY;
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    sum += frameDifferenceRgb(headFrames[i], tailFrames[i]);
  }
  return sum / n;
}

/** Fixed start + sliding end — keeps full span, optimizes outer seam only. */
export function buildEndTrimCandidates(
  fixedStart: number,
  endMin: number,
  endMax: number,
  sampleStepSec: number,
  minSpanSec: number,
): Array<{ start: number; end: number }> {
  const candidates: Array<{ start: number; end: number }> = [];
  if (endMax - fixedStart < minSpanSec) return candidates;
  const clampedMin = Math.max(endMin, fixedStart + minSpanSec);
  for (let end = clampedMin; end <= endMax + 1e-6; end += sampleStepSec) {
    candidates.push({ start: fixedStart, end });
  }
  return candidates;
}

export function effectiveTargetLoopSec(
  searchStart: number,
  searchEnd: number,
  targetLoopSec: number,
  blendSec: number,
  minLoopSec = 3,
): number {
  const region = searchEnd - searchStart;
  const capped = Math.min(targetLoopSec, region - blendSec - 0.2);
  return Math.max(minLoopSec, capped);
}
