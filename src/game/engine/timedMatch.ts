/**
 * Timed match end — resolve winner by LP when the clock expires.
 * Location: src/game/engine/timedMatch.ts
 */
import type { GameState, MatchMeta, MatchWinner } from '../types';

export const DEFAULT_TIMED_MATCH_MINUTES = 30;
export const MIN_TIMED_MATCH_MINUTES = 1;
export const MAX_TIMED_MATCH_MINUTES = 60;

/** Clamp user minutes into the allowed timed-match range. */
export function clampTimedMatchMinutes(minutes: number): number {
  if (!Number.isFinite(minutes)) return DEFAULT_TIMED_MATCH_MINUTES;
  return Math.min(
    MAX_TIMED_MATCH_MINUTES,
    Math.max(MIN_TIMED_MATCH_MINUTES, Math.floor(minutes)),
  );
}

/** Format remaining ms as mm:ss (floored seconds; never negative). */
export function formatMatchTimerMmSs(remainingMs: number): string {
  const totalSec = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Accumulated pause + open pause segment (if currently paused). */
function getTimedMatchPausedExtraMs(meta: MatchMeta, nowMs: number): number {
  const settled = meta.matchPausedTotalMs ?? 0;
  const pauseStarted = meta.matchPauseStartedAtMs;
  if (pauseStarted == null) return settled;
  return settled + Math.max(0, nowMs - pauseStarted);
}

/**
 * Remaining wall time for a timed match (ms), or null when not timed / incomplete meta.
 * Accounts for soft-pause accumulation.
 */
export function getTimedMatchRemainingMs(state: GameState, nowMs: number): number | null {
  if (state.meta.matchEndMode !== 'timed') return null;
  const startedAt = state.meta.matchStartedAtMs;
  const durationMs = state.meta.matchDurationMs;
  if (startedAt == null || durationMs == null || durationMs <= 0) return null;
  const deadline = startedAt + durationMs + getTimedMatchPausedExtraMs(state.meta, nowMs);
  return Math.max(0, deadline - nowMs);
}

/**
 * Soft-pause accounting for the match clock (UI pause / leave-play).
 * Idempotent when already in the requested pause state.
 */
export function applyTimedMatchPause(
  state: GameState,
  paused: boolean,
  nowMs: number,
): GameState {
  if (state.meta.matchEndMode !== 'timed') return state;
  const pauseStarted = state.meta.matchPauseStartedAtMs;

  if (paused) {
    if (pauseStarted != null) return state;
    return {
      ...state,
      meta: {
        ...state.meta,
        matchPauseStartedAtMs: nowMs,
      },
    };
  }

  if (pauseStarted == null) return state;
  const add = Math.max(0, nowMs - pauseStarted);
  return {
    ...state,
    meta: {
      ...state.meta,
      matchPausedTotalMs: (state.meta.matchPausedTotalMs ?? 0) + add,
      matchPauseStartedAtMs: undefined,
    },
  };
}

/** Higher LP wins; equal LP → draw. Does not mutate when already decided or not timed. */
export function resolveTimedMatchExpiry(state: GameState, nowMs: number): GameState {
  if (state.winner) return state;
  if (state.meta.matchEndMode !== 'timed') return state;
  const remaining = getTimedMatchRemainingMs(state, nowMs);
  if (remaining == null || remaining > 0) return state;

  const p1Hp = state.players.p1.hp;
  const p2Hp = state.players.p2.hp;
  let winner: MatchWinner;
  if (p1Hp > p2Hp) winner = 'p1';
  else if (p2Hp > p1Hp) winner = 'p2';
  else winner = 'draw';

  return {
    ...state,
    winner,
    lastEvent:
      winner === 'draw'
        ? 'Zeit abgelaufen — Unentschieden (gleich viel Leben).'
        : `Zeit abgelaufen — ${winner === 'p1' ? 'P1' : 'P2'} gewinnt mit mehr Leben.`,
  };
}
