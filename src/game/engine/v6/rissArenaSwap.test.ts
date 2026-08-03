/**
 * V6 Riss in der Realität — Arena-Swap Hauptaktion (#379 / §29–32).
 * Location: src/game/engine/v6/rissArenaSwap.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { applyAction, getLegalActions } from '../actions';
import { onEndTurnArena, switchArena } from '../arena';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6/v6-pack';
import { v6ClubAirValueBonus } from './arenas';

/** Deterministic RNG: always returns `values[i]` then 0. */
function seqRng(...values: number[]): () => number {
  let i = 0;
  return () => {
    const v = values[i] ?? 0;
    i += 1;
    return v;
  };
}

function baseState(arenaId = 'arena-spaeti') {
  return createGame({
    pack: V6_CORE_PACK,
    p1CharacterId: V6_CORE_PACK.characters[0].id,
    p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
    arenaId,
    startingPlayer: 'p1',
    seed: 42,
    ruleset: V6_PACK_RULESET,
  });
}

describe('V6 Riss Arena-Swap (§29–32)', () => {
  it('lists glitch-riss as legal Aktions-Hauptaktion under v6Formula', () => {
    let state = baseState();
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'riss1', defId: 'glitch-riss' }],
        },
      },
    };
    const legal = getLegalActions(state, {
      pack: V6_CORE_PACK,
      playerId: 'p1',
      ruleset: V6_PACK_RULESET,
    });
    expect(
      legal.some((a) => a.type === 'PLAY_GLITCH' && a.glitchInstanceId === 'riss1'),
    ).toBe(true);
  });

  it('swaps to a different pack arena, costs Hauptaktion, preserves v6 meta + HP/Schild', () => {
    let state = baseState('arena-vulkan');
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'riss1', defId: 'glitch-riss' }],
          hp: 22,
          shield: 3,
        },
      },
      meta: {
        ...state.meta,
        v6FormulaEnabled: true,
        v6AffinityAvailable: { p1: false, p2: true },
        v6EchoQueue: { p1: [], p2: [] },
        v6ConsumablePlayed: { p1: true, p2: false },
        vulkanAttackBonusUsed: { p1: true, p2: false },
      },
    };

    // From vulkan, others[0] = spaeti when rng returns 0.
    state = applyAction(
      state,
      { type: 'PLAY_GLITCH', glitchInstanceId: 'riss1' },
      'p1',
      {
        pack: V6_CORE_PACK,
        playerId: 'p1',
        ruleset: V6_PACK_RULESET,
        rng: seqRng(0),
      },
    );

    expect(state.arena.arenaId).toBe('arena-spaeti');
    expect(state.arena.d6Variant).toBeNull();
    expect(state.phase).toBe('end');
    expect(state.players.p1.hand.some((c) => c.instanceId === 'riss1')).toBe(false);
    expect(state.players.p1.hp).toBe(22);
    expect(state.players.p1.shield).toBe(3);
    expect(state.meta.v6FormulaEnabled).toBe(true);
    expect(state.meta.v6AffinityAvailable?.p1).toBe(false);
    expect(state.meta.v6ConsumablePlayed?.p1).toBe(true);
    expect(state.meta.vulkanAttackBonusUsed.p1).toBe(false);
    expect(state.lastEvent).toMatch(/Riss in der Realität/);
    expect(state.lastEvent).toMatch(/Späti/);
  });

  it('new arena applies immediately (Club Luft-Bonus after Riss)', () => {
    let state = baseState('arena-spaeti');
    // From spaeti: others = [kristall, vulkan, sumpf, club, schattenbasar] → index 3 = club
    state = switchArena(state, V6_CORE_PACK.arenas, seqRng(0.7)); // floor(0.7 * 5) = 3 → club
    expect(state.arena.arenaId).toBe('arena-club');
    expect(v6ClubAirValueBonus(state, 'air', V6_PACK_RULESET)).toBe(1);
    expect(v6ClubAirValueBonus(state, 'fire', V6_PACK_RULESET)).toBe(0);
    expect(state.lastEvent).toMatch(/Club/);
  });

  it('does not apply old Vulkan end-turn penalty after leaving Vulkan', () => {
    let state = baseState('arena-vulkan');
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'riss1', defId: 'glitch-riss' }],
          hp: 25,
        },
      },
      meta: {
        ...state.meta,
        didAttackOrChallengeThisTurn: false,
      },
    };
    const hpBefore = state.players.p1.hp;
    state = applyAction(
      state,
      { type: 'PLAY_GLITCH', glitchInstanceId: 'riss1' },
      'p1',
      {
        pack: V6_CORE_PACK,
        playerId: 'p1',
        ruleset: V6_PACK_RULESET,
        rng: seqRng(0),
      },
    );
    expect(state.arena.arenaId).not.toBe('arena-vulkan');
    state = onEndTurnArena(state, 'p1', V6_PACK_RULESET);
    expect(state.players.p1.hp).toBe(hpBefore);
  });
});
