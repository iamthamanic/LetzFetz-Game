/**
 * V5 Formelphase actions — build / replace / activate / schnellmix / skip (#220).
 * Location: src/game/engine/formulaPhase.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from './createGame';
import { applyAction, getLegalActions } from './actions';
import { formulaSlotForDef, findFormulaComponentDef } from './formulaSlots';
import { BASE_PACK } from '../packs/base-pack';
import type { ContentPack, GameState } from '../types';
import { V5_RULESET } from '../types';

const TECH: NonNullable<ContentPack['techniques']>[number] = {
  kind: 'technique',
  id: 'test-technik',
  name: 'Durchschuss',
  stability: 3,
  activationMode: 'prep_attack',
  effectText: 'Test technik',
};

const ESS: NonNullable<ContentPack['essences']>[number] = {
  kind: 'essence',
  id: 'test-essenz',
  name: 'Glut',
  element: 'fire',
  stability: 2,
  effectText: 'Test essenz',
};

const CAT: NonNullable<ContentPack['catalysts']>[number] = {
  kind: 'catalyst',
  id: 'test-katalysator',
  name: 'Echo',
  stability: 2,
  effectText: 'Test katalysator',
};

const V5_PACK: ContentPack = {
  ...BASE_PACK,
  id: 'v5-formula-test',
  name: 'V5 Formula Test Pack',
  techniques: [TECH],
  essences: [ESS],
  catalysts: [CAT],
};

const V5_CTX = {
  pack: V5_PACK,
  playerId: 'p1' as const,
  ruleset: V5_RULESET,
};

const V1_CTX = { pack: BASE_PACK, playerId: 'p1' as const };

function advanceToBuild(state: GameState, ctx: typeof V5_CTX | typeof V1_CTX): GameState {
  let next = state;
  if (next.phase === 'start') {
    next = applyAction(next, { type: 'ADVANCE_PHASE' }, 'p1', ctx);
  }
  if (next.phase === 'draw') {
    next = applyAction(next, { type: 'ADVANCE_PHASE' }, 'p1', ctx);
  }
  return next;
}

function withFormulaHand(state: GameState, defIds: string[]): GameState {
  return {
    ...state,
    players: {
      ...state.players,
      p1: {
        ...state.players.p1,
        hand: defIds.map((defId, i) => ({ instanceId: `fh-${i}`, defId })),
        formula: {
          technik: null,
          essenz: null,
          katalysator: null,
        },
      },
    },
  };
}

describe('formulaSlots helpers', () => {
  it('maps technique/essence/catalyst to FormulaSlot', () => {
    expect(formulaSlotForDef(V5_PACK, 'test-technik')).toBe('technik');
    expect(formulaSlotForDef(V5_PACK, 'test-essenz')).toBe('essenz');
    expect(formulaSlotForDef(V5_PACK, 'test-katalysator')).toBe('katalysator');
    expect(formulaSlotForDef(V5_PACK, 'unknown')).toBeUndefined();
  });

  it('finds formula component defs', () => {
    expect(findFormulaComponentDef(V5_PACK, 'test-technik')?.kind).toBe('technique');
    expect(findFormulaComponentDef(V5_PACK, 'attack-fire-1')).toBeUndefined();
  });
});

describe('V5 Formelphase — getLegalActions', () => {
  it('offers formula actions and never element BUILD_CARD', () => {
    let state = advanceToBuild(
      createGame({
        pack: V5_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 220,
        ruleset: V5_RULESET,
      }),
      V5_CTX,
    );
    state = withFormulaHand(state, ['test-technik', 'test-essenz']);

    const legal = getLegalActions(state, V5_CTX);
    expect(legal.some((a) => a.type === 'SKIP_BUILD')).toBe(true);
    expect(legal.some((a) => a.type === 'FORMULA_BUILD' && a.cardInstanceId === 'fh-0')).toBe(
      true,
    );
    expect(legal.some((a) => a.type === 'FORMULA_SCHNELLMIX')).toBe(true);
    expect(legal.some((a) => a.type === 'BUILD_CARD')).toBe(false);
    expect(legal.some((a) => a.type === 'FORMULA_ACTIVATE')).toBe(false);
  });

  it('offers ACTIVATE only with two or more filled slots', () => {
    let state = advanceToBuild(
      createGame({
        pack: V5_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 221,
        ruleset: V5_RULESET,
      }),
      V5_CTX,
    );
    state = withFormulaHand(state, ['test-technik']);
    state = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          formula: {
            technik: {
              instanceId: 'old-t',
              defId: 'test-technik',
              slot: 'technik',
              exhausted: false,
              disturbed: false,
              stabilityBonus: 0,
            },
            essenz: null,
            katalysator: null,
          },
        },
      },
    };

    const legal = getLegalActions(state, V5_CTX);
    expect(legal.some((a) => a.type === 'FORMULA_REPLACE' && a.cardInstanceId === 'fh-0')).toBe(
      true,
    );
    expect(legal.some((a) => a.type === 'FORMULA_BUILD' && a.cardInstanceId === 'fh-0')).toBe(
      false,
    );
    expect(legal.some((a) => a.type === 'FORMULA_ACTIVATE')).toBe(false);
  });

  it('offers ACTIVATE with two filled slots', () => {
    let state = advanceToBuild(
      createGame({
        pack: V5_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 2211,
        ruleset: V5_RULESET,
      }),
      V5_CTX,
    );
    state = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          formula: {
            technik: {
              instanceId: 'old-t',
              defId: 'test-technik',
              slot: 'technik',
              exhausted: false,
              disturbed: false,
              stabilityBonus: 0,
            },
            essenz: {
              instanceId: 'old-e',
              defId: 'test-essenz',
              slot: 'essenz',
              exhausted: false,
              disturbed: false,
              stabilityBonus: 0,
            },
            katalysator: null,
          },
        },
      },
    };

    const legal = getLegalActions(state, V5_CTX);
    expect(legal.some((a) => a.type === 'FORMULA_ACTIVATE')).toBe(true);
  });
});

describe('V5 Formelphase — applyAction', () => {
  it('builds into empty matching slot then advances to action', () => {
    let state = advanceToBuild(
      createGame({
        pack: V5_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 222,
        ruleset: V5_RULESET,
      }),
      V5_CTX,
    );
    state = withFormulaHand(state, ['test-essenz']);

    state = applyAction(state, { type: 'FORMULA_BUILD', cardInstanceId: 'fh-0' }, 'p1', V5_CTX);

    expect(state.phase).toBe('action');
    expect(state.players.p1.formula.essenz?.defId).toBe('test-essenz');
    expect(state.players.p1.formula.essenz?.exhausted).toBe(false);
    expect(state.players.p1.hand).toHaveLength(0);
  });

  it('replace discards old component and places new same-slot type', () => {
    let state = advanceToBuild(
      createGame({
        pack: V5_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 223,
        ruleset: V5_RULESET,
      }),
      V5_CTX,
    );
    state = withFormulaHand(state, ['test-katalysator']);
    state = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          formula: {
            technik: null,
            essenz: null,
            katalysator: {
              instanceId: 'old-k',
              defId: 'test-katalysator',
              slot: 'katalysator',
              exhausted: false,
              disturbed: false,
              stabilityBonus: 0,
            },
          },
        },
      },
      piles: { ...state.piles, discard: [] },
    };

    state = applyAction(
      state,
      { type: 'FORMULA_REPLACE', cardInstanceId: 'fh-0' },
      'p1',
      V5_CTX,
    );

    expect(state.phase).toBe('action');
    expect(state.players.p1.formula.katalysator?.instanceId).toBe('fh-0');
    expect(state.piles.discard.some((c) => c.instanceId === 'old-k')).toBe(true);
  });

  it('activate exhausts upright non-disturbed; ignores disturbed', () => {
    let state = advanceToBuild(
      createGame({
        pack: V5_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 224,
        ruleset: V5_RULESET,
      }),
      V5_CTX,
    );
    state = withFormulaHand(state, []);
    state = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          formula: {
            technik: {
              instanceId: 't1',
              defId: 'test-technik',
              slot: 'technik',
              exhausted: false,
              disturbed: false,
              stabilityBonus: 0,
            },
            essenz: {
              instanceId: 'e1',
              defId: 'test-essenz',
              slot: 'essenz',
              exhausted: false,
              disturbed: true,
              stabilityBonus: 0,
            },
            katalysator: {
              instanceId: 'k1',
              defId: 'test-katalysator',
              slot: 'katalysator',
              exhausted: true,
              disturbed: false,
              stabilityBonus: 0,
            },
          },
        },
      },
    };

    state = applyAction(state, { type: 'FORMULA_ACTIVATE' }, 'p1', V5_CTX);

    expect(state.phase).toBe('action');
    expect(state.players.p1.formula.technik?.exhausted).toBe(true);
    expect(state.players.p1.formula.essenz?.exhausted).toBe(false);
    expect(state.players.p1.formula.essenz?.disturbed).toBe(true);
    expect(state.players.p1.formula.katalysator?.exhausted).toBe(true);
    expect(state.lastEvent).toMatch(/Formel aktiviert/);
  });

  it('schnellmix discards formula card without needing a board slot', () => {
    let state = advanceToBuild(
      createGame({
        pack: V5_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 225,
        ruleset: V5_RULESET,
      }),
      V5_CTX,
    );
    state = withFormulaHand(state, ['test-technik']);
    state = { ...state, piles: { ...state.piles, discard: [] } };

    state = applyAction(
      state,
      { type: 'FORMULA_SCHNELLMIX', cardInstanceId: 'fh-0' },
      'p1',
      V5_CTX,
    );

    expect(state.phase).toBe('action');
    expect(state.players.p1.hand).toHaveLength(0);
    expect(state.players.p1.formula.technik).toBeNull();
    expect(state.piles.discard.some((c) => c.defId === 'test-technik')).toBe(true);
    expect(state.lastEvent).toMatch(/Schnellmix/);
  });

  it('skip / pass advances without board change', () => {
    let state = advanceToBuild(
      createGame({
        pack: V5_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 226,
        ruleset: V5_RULESET,
      }),
      V5_CTX,
    );
    state = withFormulaHand(state, ['test-technik']);

    state = applyAction(state, { type: 'SKIP_BUILD' }, 'p1', V5_CTX);

    expect(state.phase).toBe('action');
    expect(state.players.p1.formula.technik).toBeNull();
    expect(state.players.p1.hand).toHaveLength(1);
    expect(state.lastEvent).toBe('Formelphase gepasst.');
  });

  it('rejects BUILD into occupied slot', () => {
    let state = advanceToBuild(
      createGame({
        pack: V5_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 227,
        ruleset: V5_RULESET,
      }),
      V5_CTX,
    );
    state = withFormulaHand(state, ['test-technik']);
    state = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          formula: {
            technik: {
              instanceId: 'old',
              defId: 'test-technik',
              slot: 'technik',
              exhausted: false,
              disturbed: false,
              stabilityBonus: 0,
            },
            essenz: null,
            katalysator: null,
          },
        },
      },
    };

    expect(() =>
      applyAction(state, { type: 'FORMULA_BUILD', cardInstanceId: 'fh-0' }, 'p1', V5_CTX),
    ).toThrow(/REPLACE/);
  });
});

describe('V1 regression — build without v5Formula', () => {
  it('still offers BUILD_CARD / SKIP_BUILD and builds element cards', () => {
    let state = advanceToBuild(
      createGame({
        pack: BASE_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 100,
      }),
      V1_CTX,
    );

    const legal = getLegalActions(state, V1_CTX);
    expect(legal.some((a) => a.type === 'SKIP_BUILD')).toBe(true);
    expect(legal.some((a) => a.type === 'BUILD_CARD')).toBe(true);
    expect(legal.some((a) => a.type === 'FORMULA_BUILD')).toBe(false);

    const build = legal.find((a) => a.type === 'BUILD_CARD');
    expect(build).toBeDefined();
    if (!build || build.type !== 'BUILD_CARD') return;

    state = applyAction(state, build, 'p1', V1_CTX);
    expect(state.phase).toBe('action');
    expect(state.players.p1.bound.length).toBe(1);
  });

  it('rejects FORMULA_BUILD when v5Formula is off', () => {
    let state = advanceToBuild(
      createGame({
        pack: BASE_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 101,
      }),
      V1_CTX,
    );
    state = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'x', defId: 'test-technik' }],
        },
      },
    };

    expect(() =>
      applyAction(state, { type: 'FORMULA_BUILD', cardInstanceId: 'x' }, 'p1', V1_CTX),
    ).toThrow(/v5Formula/);
  });
});
