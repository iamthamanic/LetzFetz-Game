/**
 * V6 Fessel engine tests (#342 + manual Zielwahl).
 * Location: src/game/engine/v6/fessel.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { applyAction, getLegalActions } from '../actions';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';
import type { FormulaComponentInstance, GameState } from '../../types';
import {
  applyFesselToBoard,
  applyV6DefenseToIntensity,
  occupiedFesselSlots,
  tickFesselAndRestoreOwnerFormulaV6,
} from './fessel';
import { applyV6FormulaActivate } from './executeFormulaActivation';
import { chooseBotAction } from '../bot';

function place(
  state: GameState,
  playerId: 'p1' | 'p2',
  slot: 'technik' | 'essenz' | 'katalysator',
  defId: string,
  instanceId: string,
): GameState {
  const next = structuredClone(state);
  const comp: FormulaComponentInstance = {
    instanceId,
    defId,
    slot,
    exhausted: false,
    disturbed: false,
    stabilityBonus: 0,
  };
  next.players[playerId].formula[slot] = comp;
  next.phase = 'build';
  next.activePlayer = playerId;
  return next;
}

describe('applyV6DefenseToIntensity', () => {
  it('reduces intensity by defense stages', () => {
    expect(applyV6DefenseToIntensity(2, 1, 0)).toBe(1);
    expect(applyV6DefenseToIntensity(1, 2, 0)).toBe(0);
    expect(applyV6DefenseToIntensity(2, 2, -1)).toBe(1);
  });
});

describe('Fessel apply + start tick', () => {
  it('applies intensity to chosen slot and decays on start restore', () => {
    const board = {
      technik: {
        instanceId: 't1',
        defId: 'v6-technik-impulsgeschoss',
        slot: 'technik' as const,
        exhausted: false,
        disturbed: false,
        stabilityBonus: 0,
      },
      essenz: null,
      katalysator: null,
    };
    const applied = applyFesselToBoard(board, 2, { slot: 'technik' });
    expect(applied.appliedTo?.fesselIntensity).toBe(2);

    const tick = tickFesselAndRestoreOwnerFormulaV6(applied.board);
    expect(tick.board.technik?.exhausted).toBe(true);
    expect(tick.board.technik?.fesselBlocksActivation).toBe(true);
    expect(tick.board.technik?.fesselIntensity).toBe(1);
    expect(tick.notes.some((n) => n.includes('Fessel 2'))).toBe(true);

    const tick2 = tickFesselAndRestoreOwnerFormulaV6(tick.board);
    expect(tick2.board.technik?.fesselBlocksActivation).toBe(false);
    expect(tick2.board.technik?.exhausted).toBe(true);
    expect(tick2.board.technik?.fesselIntensity).toBeUndefined();
  });

  it('occupiedFesselSlots skips empty slots', () => {
    expect(
      occupiedFesselSlots({
        technik: null,
        essenz: {
          instanceId: 'e1',
          defId: 'v6-essenz-feuer',
          slot: 'essenz',
          exhausted: false,
          disturbed: false,
          stabilityBonus: 0,
        },
        katalysator: null,
      }),
    ).toEqual(['essenz']);
  });

  it('Glutfessel TE opens Fessel target pending after weak defense', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 9,
    });
    state = place(state, 'p1', 'technik', 'v6-technik-magiepanzer', 't1');
    state = place(state, 'p1', 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'p2', 'technik', 'v6-technik-impulsgeschoss', 'ot1');
    state = place(state, 'p2', 'essenz', 'v6-essenz-wasser', 'oe1');
    state = place(state, 'p2', 'katalysator', 'v6-katalysator-verdichtung', 'ok1');

    const next = applyV6FormulaActivate(state, V6_CORE_PACK, 'p1', V6_PACK_RULESET, () => 0.01, {
      defenseRoll: 1,
      asOverformula: false,
    });
    expect(next.pendingChoice?.type).toBe('v6-fessel-target');
    if (next.pendingChoice?.type !== 'v6-fessel-target') throw new Error('expected pending');
    expect(next.pendingChoice.intensity).toBe(2);
    expect(next.players.p2.formula.technik?.fesselIntensity).toBeUndefined();

    const legal = getLegalActions(next, {
      pack: V6_CORE_PACK,
      playerId: 'p1',
      ruleset: V6_PACK_RULESET,
    });
    const slots = legal
      .filter((a): a is Extract<(typeof legal)[number], { type: 'PICK_V6_FESSEL_TARGET' }> =>
        a.type === 'PICK_V6_FESSEL_TARGET',
      )
      .map((a) => a.slot);
    expect(slots.sort()).toEqual(['essenz', 'katalysator', 'technik'].sort());

    const applied = applyAction(
      next,
      { type: 'PICK_V6_FESSEL_TARGET', slot: 'essenz' },
      'p1',
      { pack: V6_CORE_PACK, ruleset: V6_PACK_RULESET, rng: () => 0.01, playerId: 'p1' },
    );
    expect(applied.pendingChoice).toBeNull();
    expect(applied.players.p2.formula.essenz?.fesselIntensity).toBe(2);
    expect(applied.players.p2.formula.technik?.fesselIntensity).toBeUndefined();
    expect(applied.lastEvent ?? '').toMatch(/Fessel/);
  });

  it('bot prefers Katalysator among occupied Fessel targets', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 12,
    });
    state = place(state, 'p2', 'technik', 'v6-technik-impulsgeschoss', 'ot1');
    state = place(state, 'p2', 'katalysator', 'v6-katalysator-verdichtung', 'ok1');
    state = {
      ...state,
      activePlayer: 'p2',
      pendingChoice: {
        type: 'v6-fessel-target',
        playerId: 'p2',
        targetPlayerId: 'p1',
        intensity: 2,
      },
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          formula: {
            technik: {
              instanceId: 'ht1',
              defId: 'v6-technik-impulsgeschoss',
              slot: 'technik',
              exhausted: false,
              disturbed: false,
              stabilityBonus: 0,
            },
            essenz: {
              instanceId: 'he1',
              defId: 'v6-essenz-feuer',
              slot: 'essenz',
              exhausted: false,
              disturbed: false,
              stabilityBonus: 0,
            },
            katalysator: {
              instanceId: 'hk1',
              defId: 'v6-katalysator-verdichtung',
              slot: 'katalysator',
              exhausted: false,
              disturbed: false,
              stabilityBonus: 0,
            },
          },
        },
      },
    };
    const pick = chooseBotAction(state, V6_CORE_PACK);
    expect(pick).toEqual({ type: 'PICK_V6_FESSEL_TARGET', slot: 'katalysator' });
  });

  it('defense 5–6 can zero Fessel intensity (no pending)', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 10,
    });
    state = place(state, 'p1', 'technik', 'v6-technik-magiepanzer', 't1');
    state = place(state, 'p1', 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'p2', 'technik', 'v6-technik-impulsgeschoss', 'ot1');

    const next = applyV6FormulaActivate(state, V6_CORE_PACK, 'p1', V6_PACK_RULESET, () => 0.01, {
      defenseRoll: 6,
      asOverformula: false,
    });
    expect(next.pendingChoice).toBeNull();
    expect(next.players.p2.formula.technik?.fesselIntensity).toBeUndefined();
  });

  it('empty opponent board skips Fessel pending', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 13,
    });
    state = place(state, 'p1', 'technik', 'v6-technik-magiepanzer', 't1');
    state = place(state, 'p1', 'essenz', 'v6-essenz-feuer', 'e1');

    const next = applyV6FormulaActivate(state, V6_CORE_PACK, 'p1', V6_PACK_RULESET, () => 0.01, {
      defenseRoll: 1,
      asOverformula: false,
    });
    expect(next.pendingChoice).toBeNull();
    expect(next.lastEvent ?? '').toMatch(/kein Ziel/);
  });

  it('start phase surfaces Fessel notes via ADVANCE_PHASE', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 11,
    });
    state = place(state, 'p1', 'technik', 'v6-technik-impulsgeschoss', 't1');
    state = {
      ...state,
      phase: 'start',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          formula: {
            ...state.players.p1.formula,
            technik: {
              ...state.players.p1.formula.technik!,
              fesselIntensity: 3,
              exhausted: false,
              disturbed: false,
            },
          },
        },
      },
    };
    const next = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', {
      pack: V6_CORE_PACK,
      ruleset: V6_PACK_RULESET,
      rng: () => 0.5,
      playerId: 'p1',
    });
    expect(next.players.p1.formula.technik?.disturbed).toBe(true);
    expect(next.players.p1.formula.technik?.exhausted).toBe(true);
    expect(next.lastEvent ?? '').toMatch(/Fessel/);
  });
});
