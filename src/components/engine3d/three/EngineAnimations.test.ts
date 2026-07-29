/**
 * Unit tests for montage attach animation math (no WebGL).
 * Location: src/components/engine3d/three/EngineAnimations.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  MONTAGE_DOCK_DISTANCE,
  advanceMontageProgress,
  easeOutCubic,
  montagePhaseWindows,
  phaseLocalProgress,
  resolveMontagePose,
} from './EngineAnimations';

describe('easeOutCubic / phaseLocalProgress', () => {
  it('clamps and eases', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
    expect(phaseLocalProgress(0.1, 0.2, 0.4)).toBe(0);
    expect(phaseLocalProgress(0.5, 0.2, 0.4)).toBe(1);
    expect(phaseLocalProgress(0.3, 0.2, 0.4)).toBeCloseTo(0.5);
  });
});

describe('montagePhaseWindows', () => {
  it('carrier-only uses full window and no dock phases', () => {
    const w = montagePhaseWindows({ hasDrive: false, hasAttachment: false });
    expect(w.drive).toBeNull();
    expect(w.attachment).toBeNull();
    expect(w.carrier).toEqual([0, 1]);
  });

  it('drive without attachment skips attachment window', () => {
    const w = montagePhaseWindows({ hasDrive: true, hasAttachment: false });
    expect(w.drive).not.toBeNull();
    expect(w.attachment).toBeNull();
  });

  it('full stack staggers drive before attachment', () => {
    const w = montagePhaseWindows({ hasDrive: true, hasAttachment: true });
    expect(w.drive).not.toBeNull();
    expect(w.attachment).not.toBeNull();
    expect(w.drive![0]).toBeLessThan(w.attachment![0]);
    expect(w.drive![1]).toBeLessThanOrEqual(w.attachment![1]);
  });
});

describe('advanceMontageProgress', () => {
  it('advances and clamps to 1', () => {
    expect(advanceMontageProgress(0, 0.5, 1)).toBeCloseTo(0.5);
    expect(advanceMontageProgress(0.9, 1, 1)).toBe(1);
  });
});

describe('resolveMontagePose', () => {
  const full = { hasDrive: true, hasAttachment: true };

  it('reduced motion is immediately assembled', () => {
    const pose = resolveMontagePose(0, full, true);
    expect(pose.phase).toBe('assembled');
    expect(pose.rootScale).toBe(1);
    expect(pose.driveLocalZ).toBe(0);
    expect(pose.attachmentLocalZ).toBe(0);
    expect(pose.driveScale).toBe(1);
    expect(pose.attachmentScale).toBe(1);
  });

  it('start of full montage: carrier small, parts offset along +Z', () => {
    const pose = resolveMontagePose(0, full, false);
    expect(pose.rootScale).toBeCloseTo(0.15);
    expect(pose.driveLocalZ).toBeCloseTo(MONTAGE_DOCK_DISTANCE);
    expect(pose.attachmentLocalZ).toBeCloseTo(MONTAGE_DOCK_DISTANCE);
    expect(pose.phase).toBe('carrier');
  });

  it('mid drive phase: drive closer than start, attachment still far', () => {
    const early = resolveMontagePose(0.05, full, false);
    const midDrive = resolveMontagePose(0.4, full, false);
    expect(midDrive.driveLocalZ).toBeLessThan(early.driveLocalZ);
    expect(midDrive.attachmentLocalZ).toBeGreaterThan(0.2);
    expect(midDrive.phase).toBe('drive');
  });

  it('late attachment phase docks tip after drive settled', () => {
    const late = resolveMontagePose(0.7, full, false);
    expect(late.driveLocalZ).toBeLessThan(0.05);
    expect(late.attachmentLocalZ).toBeGreaterThan(0);
    expect(late.attachmentLocalZ).toBeLessThan(MONTAGE_DOCK_DISTANCE);
    expect(late.phase).toBe('attachment');
  });

  it('complete pose is assembled at origin', () => {
    const pose = resolveMontagePose(1, full, false);
    expect(pose.phase).toBe('assembled');
    expect(pose.rootScale).toBeCloseTo(1);
    expect(pose.driveLocalZ).toBe(0);
    expect(pose.attachmentLocalZ).toBe(0);
  });

  it('carrier-only never invents drive offsets', () => {
    const pose = resolveMontagePose(0.5, { hasDrive: false, hasAttachment: false }, false);
    expect(pose.driveLocalZ).toBe(0);
    expect(pose.attachmentLocalZ).toBe(0);
    expect(pose.phase).toBe('carrier');
  });
});
