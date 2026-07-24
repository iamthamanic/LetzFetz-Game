import { describe, expect, it } from 'vitest';
import { createGame, BASE_PACK } from '../../../game';
import { DEFAULT_RULESET } from '../../../game/types/ruleset';
import {
  buildOpeningDealSteps,
  OPENING_DEAL_CARD_MS,
  openingDealBeats,
} from './buildOpeningDealSteps';

describe('buildOpeningDealSteps', () => {
  const state = createGame({
    pack: BASE_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'kokabell',
    startingPlayer: 'p1',
    seed: 99,
    arenaId: 'arena-spaeti',
  });

  it('creates parallel beats for both hands (max length)', () => {
    const steps = buildOpeningDealSteps(state);
    expect(steps).toHaveLength(
      Math.max(DEFAULT_RULESET.p1StartingHand, DEFAULT_RULESET.p2SecondHand),
    );
    expect(steps.every((s) => s.kind === 'deal-card')).toBe(true);
    expect(steps.every((s) => s.durationMs === OPENING_DEAL_CARD_MS)).toBe(true);
  });

  it('deals human and bot cards in the same beat', () => {
    const steps = buildOpeningDealSteps(state);
    const first = openingDealBeats(steps[0]!);
    expect(first).toHaveLength(2);
    expect(first.map((b) => b.playerId).sort()).toEqual(['p1', 'p2']);
  });

  it('extra bot cards after human hand is full', () => {
    const steps = buildOpeningDealSteps(state);
    const last = openingDealBeats(steps[steps.length - 1]!);
    expect(last).toHaveLength(1);
    expect(last[0]?.playerId).toBe('p2');
  });

  it('still deals in parallel when p2 starts', () => {
    const botFirst = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'kokabell',
      startingPlayer: 'p2',
      seed: 42,
      arenaId: 'arena-spaeti',
    });
    const steps = buildOpeningDealSteps(botFirst);
    expect(steps.length).toBeGreaterThan(0);
    expect(openingDealBeats(steps[0]!).some((b) => b.playerId === 'p1')).toBe(true);
    expect(openingDealBeats(steps[0]!).some((b) => b.playerId === 'p2')).toBe(true);
  });

  it('still deals when hand sizes are already trimmed', () => {
    const patched = {
      ...state,
      players: {
        ...state.players,
        p1: { ...state.players.p1, hand: state.players.p1.hand.slice(0, 2) },
      },
    };
    const steps = buildOpeningDealSteps(patched);
    expect(steps).toHaveLength(Math.max(2, state.players.p2.hand.length));
    expect(steps.every((s) => s.locksInput === true)).toBe(true);
  });

  it('returns empty outside opening start phase', () => {
    const midGame = { ...state, turnNumber: 2, phase: 'draw' as const };
    expect(buildOpeningDealSteps(midGame)).toEqual([]);
  });
});
