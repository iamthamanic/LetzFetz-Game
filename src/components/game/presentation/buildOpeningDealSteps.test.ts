import { describe, expect, it } from 'vitest';
import { createGame, BASE_PACK } from '../../../game';
import { DEFAULT_RULESET } from '../../../game/types/ruleset';
import {
  buildOpeningDealSteps,
  OPENING_DEAL_CARD_MS,
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

  it('creates 11 staggered deal steps for 5+6 hands', () => {
    const steps = buildOpeningDealSteps(state);
    expect(steps).toHaveLength(
      DEFAULT_RULESET.p1StartingHand + DEFAULT_RULESET.p2SecondHand,
    );
    expect(steps.every((s) => s.kind === 'deal-card')).toBe(true);
    expect(steps.every((s) => s.durationMs === OPENING_DEAL_CARD_MS)).toBe(true);
  });

  it('deals starting player hand before opponent', () => {
    const steps = buildOpeningDealSteps(state);
    const firstFive = steps.slice(0, DEFAULT_RULESET.p1StartingHand);
    const lastSix = steps.slice(DEFAULT_RULESET.p1StartingHand);
    expect(firstFive.every((s) => s.payload?.playerId === 'p1')).toBe(true);
    expect(lastSix.every((s) => s.payload?.playerId === 'p2')).toBe(true);
  });

  it('returns empty when hand sizes do not match setup deal', () => {
    const patched = {
      ...state,
      players: {
        ...state.players,
        p1: { ...state.players.p1, hand: state.players.p1.hand.slice(0, 2) },
      },
    };
    expect(buildOpeningDealSteps(patched)).toEqual([]);
  });
});
