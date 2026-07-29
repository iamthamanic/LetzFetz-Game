/**
 * Unit tests for board engine snapshot warmup delay.
 * Location: src/features/play/engine3d/boardEngineWarmup.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  BOARD_ENGINE_WARMUP_MS,
  BOARD_ENGINE_WARMUP_REDUCED_MS,
  boardEngineWarmupDelayMs,
} from './boardEngineWarmup';

describe('boardEngineWarmupDelayMs', () => {
  it('uses short delay for reduced motion', () => {
    expect(boardEngineWarmupDelayMs(true)).toBe(BOARD_ENGINE_WARMUP_REDUCED_MS);
  });

  it('waits for montage when motion is allowed', () => {
    expect(boardEngineWarmupDelayMs(false)).toBe(BOARD_ENGINE_WARMUP_MS);
    expect(BOARD_ENGINE_WARMUP_MS).toBeGreaterThan(BOARD_ENGINE_WARMUP_REDUCED_MS);
  });
});
