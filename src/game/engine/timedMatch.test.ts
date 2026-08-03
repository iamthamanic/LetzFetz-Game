/**
 * Unit tests for timed match end mode.
 * Location: src/game/engine/timedMatch.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from './createGame';
import { applyAction } from './actions';
import {
  applyTimedMatchPause,
  clampTimedMatchMinutes,
  DEFAULT_TIMED_MATCH_MINUTES,
  formatMatchTimerMmSs,
  getTimedMatchRemainingMs,
  MAX_TIMED_MATCH_MINUTES,
  MIN_TIMED_MATCH_MINUTES,
  resolveTimedMatchExpiry,
} from './timedMatch';
import { BASE_PACK } from '../packs/base-pack';

const BASE = {
  pack: BASE_PACK,
  p1CharacterId: 'knuspergnom' as const,
  p2CharacterId: 'schluckspecht' as const,
  startingPlayer: 'p1' as const,
  seed: 7,
};

describe('clampTimedMatchMinutes', () => {
  it('defaults and clamps', () => {
    expect(clampTimedMatchMinutes(Number.NaN)).toBe(DEFAULT_TIMED_MATCH_MINUTES);
    expect(clampTimedMatchMinutes(0)).toBe(MIN_TIMED_MATCH_MINUTES);
    expect(clampTimedMatchMinutes(999)).toBe(MAX_TIMED_MATCH_MINUTES);
    expect(clampTimedMatchMinutes(10.9)).toBe(10);
  });
});

describe('createGame timed meta', () => {
  it('stores standard by default', () => {
    const state = createGame(BASE);
    expect(state.meta.matchEndMode).toBe('standard');
    expect(state.meta.matchDurationMs).toBeUndefined();
    expect(state.meta.matchStartedAtMs).toBeUndefined();
  });

  it('stores timed duration and start', () => {
    const state = createGame({
      ...BASE,
      matchEndMode: 'timed',
      timedMatchMinutes: 5,
      matchStartedAtMs: 1_000_000,
    });
    expect(state.meta.matchEndMode).toBe('timed');
    expect(state.meta.matchDurationMs).toBe(5 * 60_000);
    expect(state.meta.matchStartedAtMs).toBe(1_000_000);
  });

  it('defaults timed minutes to 30 when omitted', () => {
    const state = createGame({
      ...BASE,
      matchEndMode: 'timed',
      matchStartedAtMs: 1_000_000,
    });
    expect(state.meta.matchDurationMs).toBe(DEFAULT_TIMED_MATCH_MINUTES * 60_000);
  });
});

describe('resolveTimedMatchExpiry', () => {
  it('does nothing before expiry', () => {
    const state = createGame({
      ...BASE,
      matchEndMode: 'timed',
      timedMatchMinutes: 10,
      matchStartedAtMs: 0,
    });
    const next = resolveTimedMatchExpiry(state, 60_000);
    expect(next.winner).toBeNull();
  });

  it('awards higher LP after expiry', () => {
    let state = createGame({
      ...BASE,
      matchEndMode: 'timed',
      timedMatchMinutes: 1,
      matchStartedAtMs: 0,
    });
    state = {
      ...state,
      players: {
        ...state.players,
        p1: { ...state.players.p1, hp: 12 },
        p2: { ...state.players.p2, hp: 8 },
      },
    };
    const next = resolveTimedMatchExpiry(state, 60_000);
    expect(next.winner).toBe('p1');
  });

  it('draws on equal LP after expiry', () => {
    let state = createGame({
      ...BASE,
      matchEndMode: 'timed',
      timedMatchMinutes: 1,
      matchStartedAtMs: 0,
    });
    state = {
      ...state,
      players: {
        ...state.players,
        p1: { ...state.players.p1, hp: 15 },
        p2: { ...state.players.p2, hp: 15 },
      },
    };
    const next = resolveTimedMatchExpiry(state, 60_000);
    expect(next.winner).toBe('draw');
  });

  it('applyAction refuses plays after timed expiry', () => {
    let state = createGame({
      ...BASE,
      matchEndMode: 'timed',
      timedMatchMinutes: 1,
      matchStartedAtMs: 0,
    });
    state = {
      ...state,
      phase: 'action',
      players: {
        ...state.players,
        p1: { ...state.players.p1, hp: 10 },
        p2: { ...state.players.p2, hp: 5 },
      },
    };
    // Force expiry by patching startedAt far in the past relative to Date.now()
    state = {
      ...state,
      meta: {
        ...state.meta,
        matchStartedAtMs: Date.now() - 120_000,
        matchDurationMs: 60_000,
      },
    };
    const next = applyAction(state, { type: 'END_TURN' }, 'p1', {
      pack: BASE_PACK,
      playerId: 'p1',
    });
    expect(next.winner).toBe('p1');
  });

  it('soft pause extends deadline and freezes remaining', () => {
    let state = createGame({
      ...BASE,
      matchEndMode: 'timed',
      timedMatchMinutes: 1,
      matchStartedAtMs: 0,
    });
    // 30s already elapsed → 30s left; pause freezes that remainder.
    state = applyTimedMatchPause(state, true, 30_000);
    expect(getTimedMatchRemainingMs(state, 30_000)).toBe(30_000);
    expect(getTimedMatchRemainingMs(state, 45_000)).toBe(30_000);
    expect(resolveTimedMatchExpiry(state, 90_000).winner).toBeNull();

    state = applyTimedMatchPause(state, false, 50_000);
    expect(state.meta.matchPausedTotalMs).toBe(20_000);
    expect(state.meta.matchPauseStartedAtMs).toBeUndefined();
    expect(getTimedMatchRemainingMs(state, 50_000)).toBe(30_000);
    expect(resolveTimedMatchExpiry(state, 79_999).winner).toBeNull();
    expect(resolveTimedMatchExpiry(state, 80_000).winner).not.toBeNull();
  });
});

describe('formatMatchTimerMmSs', () => {
  it('formats floored mm:ss', () => {
    expect(formatMatchTimerMmSs(0)).toBe('00:00');
    expect(formatMatchTimerMmSs(1_500)).toBe('00:01');
    expect(formatMatchTimerMmSs(65_000)).toBe('01:05');
    expect(formatMatchTimerMmSs(30 * 60_000)).toBe('30:00');
  });
});
