/**
 * Warmup timing for board Engine-Zone snapshot capture after montage.
 * Location: src/features/play/engine3d/boardEngineWarmup.ts
 */
/** Default wait so montage can finish before toDataURL. */
export const BOARD_ENGINE_WARMUP_MS = 1200;
/** Near-immediate capture when prefers-reduced-motion. */
export const BOARD_ENGINE_WARMUP_REDUCED_MS = 80;

export function boardEngineWarmupDelayMs(reducedMotion: boolean): number {
  return reducedMotion ? BOARD_ENGINE_WARMUP_REDUCED_MS : BOARD_ENGINE_WARMUP_MS;
}
