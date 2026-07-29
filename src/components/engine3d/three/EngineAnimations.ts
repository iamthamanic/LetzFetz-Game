/**
 * General montage attach animation (Brief §12) — pure math, no React.
 * Location: src/components/engine3d/three/EngineAnimations.ts
 * Carrier appear → drive docks along socket axis → attachment docks.
 */
export const MONTAGE_DOCK_DISTANCE = 0.42;
/** Progress units per second (full 0→1 ≈ 1.1s at default). */
export const MONTAGE_PROGRESS_SPEED = 0.9;

export type MontagePartsPresent = {
  hasDrive: boolean;
  hasAttachment: boolean;
};

export type MontagePhase = 'carrier' | 'drive' | 'attachment' | 'assembled';

export type MontagePose = {
  rootScale: number;
  /** Local offset on SOCKET_DRIVE child (approach along +Z). */
  driveLocalZ: number;
  driveScale: number;
  /** Local offset on SOCKET_OUTPUT child. */
  attachmentLocalZ: number;
  attachmentScale: number;
  phase: MontagePhase;
};

export type MontagePhaseWindows = {
  carrier: [number, number];
  drive: [number, number] | null;
  attachment: [number, number] | null;
};

function clamp01(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t;
}

export function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - (1 - x) ** 3;
}

/** Local 0→1 progress inside [start, end]. */
export function phaseLocalProgress(
  global: number,
  start: number,
  end: number,
): number {
  if (end <= start) return global >= end ? 1 : 0;
  if (global <= start) return 0;
  if (global >= end) return 1;
  return (global - start) / (end - start);
}

/**
 * Stagger windows for present parts. Missing drive/attachment collapse
 * so carrier-only never invents fake dock motion.
 */
export function montagePhaseWindows(
  parts: MontagePartsPresent,
): MontagePhaseWindows {
  if (!parts.hasDrive) {
    return {
      carrier: [0, 1],
      drive: null,
      attachment: null,
    };
  }
  if (!parts.hasAttachment) {
    return {
      carrier: [0, 0.38],
      drive: [0.28, 0.95],
      attachment: null,
    };
  }
  return {
    carrier: [0, 0.28],
    drive: [0.22, 0.55],
    attachment: [0.48, 0.92],
  };
}

export function advanceMontageProgress(
  current: number,
  deltaSeconds: number,
  speed: number = MONTAGE_PROGRESS_SPEED,
): number {
  return clamp01(current + Math.max(0, deltaSeconds) * speed);
}

function dockFromProgress(local: number): { z: number; scale: number } {
  const e = easeOutCubic(local);
  return {
    z: MONTAGE_DOCK_DISTANCE * (1 - e),
    scale: 0.82 + e * 0.18,
  };
}

function resolvePhase(
  progress: number,
  windows: MontagePhaseWindows,
): MontagePhase {
  if (progress >= 0.999) return 'assembled';
  const { carrier, drive, attachment } = windows;
  if (attachment && progress >= attachment[0] && progress < attachment[1]) {
    return 'attachment';
  }
  if (drive && progress >= drive[0] && progress < drive[1]) {
    return 'drive';
  }
  if (progress < carrier[1]) return 'carrier';
  if (attachment && progress >= attachment[0]) return 'attachment';
  if (drive && progress >= drive[0]) return 'drive';
  return 'assembled';
}

/**
 * Resolve root + part poses for a montage clock.
 * `reducedMotion` → assembled pose (no offsets, scale 1).
 */
export function resolveMontagePose(
  progress: number,
  parts: MontagePartsPresent,
  reducedMotion: boolean,
): MontagePose {
  if (reducedMotion) {
    return {
      rootScale: 1,
      driveLocalZ: 0,
      driveScale: 1,
      attachmentLocalZ: 0,
      attachmentScale: 1,
      phase: 'assembled',
    };
  }

  const windows = montagePhaseWindows(parts);
  const p = clamp01(progress);
  const carrierLocal = phaseLocalProgress(p, windows.carrier[0], windows.carrier[1]);
  const rootScale = 0.15 + easeOutCubic(carrierLocal) * 0.85;

  let driveLocalZ = 0;
  let driveScale = 1;
  if (windows.drive && parts.hasDrive) {
    const d = dockFromProgress(
      phaseLocalProgress(p, windows.drive[0], windows.drive[1]),
    );
    driveLocalZ = d.z;
    driveScale = d.scale;
  }

  let attachmentLocalZ = 0;
  let attachmentScale = 1;
  if (windows.attachment && parts.hasAttachment) {
    const a = dockFromProgress(
      phaseLocalProgress(p, windows.attachment[0], windows.attachment[1]),
    );
    attachmentLocalZ = a.z;
    attachmentScale = a.scale;
  }

  return {
    rootScale,
    driveLocalZ,
    driveScale,
    attachmentLocalZ,
    attachmentScale,
    phase: resolvePhase(p, windows),
  };
}
