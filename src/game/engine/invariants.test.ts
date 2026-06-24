import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { BASE_PACK } from '../packs/base-pack';
import { DEFAULT_RULESET } from '../types';
import { applyAction, getLegalActions } from './actions';
import { createGame } from './createGame';
import { createSeededRng } from './deck';
import {
  assertInvariants,
  collectInvariantViolations,
  countCardsInPlay,
  runSimulation,
} from './invariants';
import { resolveDamage } from './combat';

const CHARACTER_IDS = BASE_PACK.characters.map((c) => c.id);
const ARENA_IDS = BASE_PACK.arenas.map((a) => a.id);

describe('resolveDamage', () => {
  it('never returns negative damage', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 50 }), fc.integer({ min: 0, max: 50 }), (attack, block) => {
        expect(resolveDamage(attack, block)).toBeGreaterThanOrEqual(0);
      }),
    );
  });
});

describe('collectInvariantViolations — setup', () => {
  it('passes for a fresh game', () => {
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      seed: 42,
    });
    const expected = countCardsInPlay(state);
    expect(collectInvariantViolations(state, { expectedCardCount: expected })).toEqual([]);
  });
});

describe('engine invariants — random simulation', () => {
  it('holds across random legal move sequences', () => {
    fc.assert(
      fc.property(
        fc.record({
          seed: fc.integer({ min: 1, max: 1_000_000 }),
          p1Index: fc.integer({ min: 0, max: CHARACTER_IDS.length - 1 }),
          p2Index: fc.integer({ min: 0, max: CHARACTER_IDS.length - 1 }),
          arenaIndex: fc.integer({ min: 0, max: ARENA_IDS.length - 1 }),
          startingPlayer: fc.constantFrom('p1' as const, 'p2' as const),
        }),
        ({ seed, p1Index, p2Index, arenaIndex, startingPlayer }) => {
          const rng = createSeededRng(seed);
          const state = createGame({
            pack: BASE_PACK,
            p1CharacterId: CHARACTER_IDS[p1Index],
            p2CharacterId: CHARACTER_IDS[p2Index],
            arenaId: ARENA_IDS[arenaIndex],
            startingPlayer,
            rng,
          });
          const expectedCardCount = countCardsInPlay(state);

          runSimulation(state, {
            expectedCardCount,
            rng,
            maxSteps: 400,
            pickAction: (actions, pickRng) =>
              actions[Math.floor(pickRng() * actions.length)],
            getLegalActions: (s, playerId) =>
              getLegalActions(s, { pack: BASE_PACK, playerId, rng }),
            applyStep: (s, action, playerId) =>
              applyAction(s, action, playerId, { pack: BASE_PACK, playerId, rng }),
          });
        },
      ),
      { numRuns: 120 },
    );
  });
});

describe('engine invariants — deck reset (§17)', () => {
  it('preserves card count when deck is exhausted and reshuffled', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 500_000 }), (seed) => {
        const rng = createSeededRng(seed);
        let state = createGame({
          pack: BASE_PACK,
          p1CharacterId: 'mysterium',
          p2CharacterId: 'kokabell',
          arenaId: 'arena-spaeti',
          startingPlayer: 'p1',
          rng,
        });
        const expectedCardCount = countCardsInPlay(state);

        const result = runSimulation(state, {
          expectedCardCount,
          rng,
          maxSteps: 350,
          pickAction: (actions, pickRng) => {
            const weighted = actions.flatMap((action) => {
              if (action.type === 'DISCARD_DRAW') return [action, action, action];
              if (action.type === 'ADVANCE_PHASE') return [action, action];
              if (action.type === 'END_TURN') return [action];
              return [action];
            });
            return weighted[Math.floor(pickRng() * weighted.length)];
          },
          getLegalActions: (s, playerId) =>
            getLegalActions(s, { pack: BASE_PACK, playerId, rng }),
          applyStep: (s, action, playerId) =>
            applyAction(s, action, playerId, { pack: BASE_PACK, playerId, rng }),
        });

        expect(countCardsInPlay(result.finalState)).toBe(expectedCardCount);
      }),
      { numRuns: 40 },
    );
  });
});

describe('engine invariants — HP bounds after combat', () => {
  it('keeps HP within [0, maxHp] after random combat steps', () => {
    const rng = createSeededRng(999);
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'stiernackenkommando',
      p2CharacterId: 'pillendoktora',
      seed: 999,
    });
    const expectedCardCount = countCardsInPlay(state);

    const result = runSimulation(state, {
      expectedCardCount,
      rng,
      maxSteps: 200,
      pickAction: (actions) => {
        const combat = actions.filter(
          (a) => a.type === 'PLAY_ATTACK' || a.type === 'CHALLENGE' || a.type === 'PLAY_BLOCK',
        );
        if (combat.length > 0) return combat[0];
        return actions[0];
      },
      getLegalActions: (s, playerId) =>
        getLegalActions(s, { pack: BASE_PACK, playerId, rng }),
      applyStep: (s, action, playerId) =>
        applyAction(s, action, playerId, { pack: BASE_PACK, playerId, rng }),
    });

    assertInvariants(result.finalState, { expectedCardCount });
    expect(result.finalState.players.p1.hp).toBeGreaterThanOrEqual(0);
    expect(result.finalState.players.p1.hp).toBeLessThanOrEqual(DEFAULT_RULESET.maxHp);
    expect(result.finalState.players.p2.hp).toBeGreaterThanOrEqual(0);
    expect(result.finalState.players.p2.hp).toBeLessThanOrEqual(DEFAULT_RULESET.maxHp);
  });
});
