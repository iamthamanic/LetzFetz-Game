/**
 * CSS 3D W6 die — presentation only; face value comes from the engine roll.
 * Location: src/features/play/board/W6Die3D.tsx
 */
import React from 'react';
import { prefersReducedMotion } from '../presentation/prefersReducedMotion';

/** Full tumble + land duration — must match CSS animation + MatchIntro timer. */
export const W6_DIE_ROLL_MS = 1600;

/** Cube rotations that bring the given face to the front. */
const FACE_ROTATION: Record<number, string> = {
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateX(0deg) rotateY(-90deg)',
  3: 'rotateX(0deg) rotateY(180deg)',
  4: 'rotateX(0deg) rotateY(90deg)',
  5: 'rotateX(-90deg) rotateY(0deg)',
  6: 'rotateX(90deg) rotateY(0deg)',
};

interface W6Die3DProps {
  value: number;
  label: string;
  rolling: boolean;
  /** Bumps remount/animation when a new roll starts with same value. */
  rollKey: number;
  /** Applied in the same frame rolling ends (green win / muted lose). */
  outcome?: 'win' | 'lose' | null;
}

export function W6Die3D({ value, label, rolling, rollKey, outcome = null }: W6Die3DProps) {
  const face = Math.max(1, Math.min(6, value));
  const reduced = prefersReducedMotion();
  // Parent ends the roll and sets outcome together — no early internal settle.
  const settled = reduced || !rolling;

  const endTransform = FACE_ROTATION[face];
  const outcomeClass =
    outcome === 'win' ? 'w6-die-cube--win' : outcome === 'lose' ? 'w6-die-cube--lose' : '';

  return (
    <div
      className={`flex flex-col items-center gap-2 ${outcome === 'win' ? 'w6-die--win' : ''} ${
        outcome === 'lose' ? 'w6-die--lose' : ''
      }`}
      data-testid="w6-die-3d"
      data-outcome={outcome ?? 'none'}
    >
      <span
        className={`text-xs font-semibold uppercase tracking-wider ${
          outcome === 'win' ? 'text-emerald-400' : 'text-stone-400'
        }`}
      >
        {label}
      </span>
      <div
        className={`w6-die-scene ${!reduced && rolling ? 'w6-die-scene--dropping' : ''}`}
        aria-hidden={!settled}
      >
        <div
          key={rollKey}
          className={`w6-die-cube ${
            reduced || settled ? 'w6-die-cube--settled' : 'w6-die-cube--rolling'
          } ${outcomeClass}`}
          style={
            {
              ['--w6-end' as string]: endTransform,
              transform: reduced || settled ? endTransform : undefined,
            } as React.CSSProperties
          }
          data-face={face}
          data-settled={settled ? 'true' : 'false'}
        >
          {([1, 2, 3, 4, 5, 6] as const).map((n) => (
            <div key={n} className={`w6-die-face w6-die-face--${n}`} aria-hidden>
              <span>{n}</span>
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only" aria-live="polite">
        {settled ? `${label}: ${face}` : `${label}: würfelt`}
      </span>
      {settled && (
        <span
          className={`text-lg font-black tabular-nums ${
            outcome === 'win' ? 'text-emerald-300' : 'text-amber-300'
          }`}
          data-testid="w6-die-value"
        >
          {face}
        </span>
      )}
    </div>
  );
}
