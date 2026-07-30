/**
 * V5 Fetzladung + Großformel gate tests (#223).
 * Location: src/game/engine/formulaCharge.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from './createGame';
import { applyAction, getLegalActions } from './actions';
import {
  applyGrossformelAftermath,
  countFilledFormulaSlots,
  isFormulaResolvable,
  isFullFormulaActivatable,
} from './formulaCharge';
import { clampFetzCharge, gainFetzCharge } from './status/fetzCharge';
import { BASE_PACK } from '../packs/base-pack';
import type { ContentPack, FormulaBoard, GameState } from '../types';
import { V5_RULESET, maxFetzChargeFor } from '../types';

const TECH: NonNullable<ContentPack['techniques']>[number] = {
  kind: 'technique',
  id: 'test-technik',
  name: 'Durchschuss',
  stability: 3,
  activationMode: 'prep_attack',
  effectText: 'Test',
  formulaEffect: { kind: 'prep_attack', combatBonus: 1 },
};

const ESS: NonNullable<ContentPack['essences']>[number] = {
  kind: 'essence',
  id: 'test-essenz',
  name: 'Glut',
  element: 'fire',
  stability: 2,
  effectText: 'Test',
};

const CAT: NonNullable<ContentPack['catalysts']>[number] = {
  kind: 'catalyst',
  id: 'test-katalysator',
  name: 'Echo',
  stability: 2,
  effectText: 'Test',
};

const V5_PACK: ContentPack = {
  ...BASE_PACK,
  id: 'v5-charge-test',
  name: 'V5 Charge Test',
  techniques: [TECH],
  essences: [ESS],
  catalysts: [CAT],
};

const V5_CTX = {
  pack: V5_PACK,
  playerId: 'p1' as const,
  ruleset: V5_RULESET,
};

function comp(
  slot: 'technik' | 'essenz' | 'katalysator',
  defId: string,
  id: string,
): NonNullable<FormulaBoard['technik']> {
  return {
    instanceId: id,
    defId,
    slot,
    exhausted: false,
    disturbed: false,
    stabilityBonus: 0,
  };
}

function v5Game(): GameState {
  return createGame({
    pack: V5_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'schluckspecht',
    startingPlayer: 'p1',
    seed: 7,
    ruleset: V5_RULESET,
  });
}

describe('fetzCharge cap', () => {
  it('maxFetzChargeFor is 3 under V5_RULESET', () => {
    expect(maxFetzChargeFor(V5_RULESET)).toBe(3);
  });

  it('gainFetzCharge respects max 3', () => {
    let state = v5Game();
    state = gainFetzCharge(state, 'p1', 2, 3);
    state = gainFetzCharge(state, 'p1', 5, 3);
    expect(state.players.p1.fetzCharge).toBe(3);
    expect(clampFetzCharge(99, 3)).toBe(3);
  });
});

describe('isFormulaResolvable', () => {
  it('requires at least two filled slots and one activatable component', () => {
    const fullBoard: FormulaBoard = {
      technik: comp('technik', 'test-technik', 't'),
      essenz: comp('essenz', 'test-essenz', 'e'),
      katalysator: comp('katalysator', 'test-katalysator', 'k'),
    };
    expect(countFilledFormulaSlots(fullBoard)).toBe(3);
    expect(isFormulaResolvable(fullBoard)).toBe(true);

    const twoSlot: FormulaBoard = {
      technik: comp('technik', 'test-technik', 't'),
      essenz: comp('essenz', 'test-essenz', 'e'),
      katalysator: null,
    };
    expect(isFormulaResolvable(twoSlot)).toBe(true);

    const oneSlot: FormulaBoard = {
      technik: comp('technik', 'test-technik', 't'),
      essenz: null,
      katalysator: null,
    };
    expect(isFormulaResolvable(oneSlot)).toBe(false);

    const twoFilledNoneActivatable: FormulaBoard = {
      technik: { ...comp('technik', 'test-technik', 't'), exhausted: true },
      essenz: { ...comp('essenz', 'test-essenz', 'e'), disturbed: true },
      katalysator: null,
    };
    expect(isFormulaResolvable(twoFilledNoneActivatable)).toBe(false);
  });
});

describe('isFullFormulaActivatable', () => {
  it('requires all three upright non-disturbed', () => {
    expect(
      isFullFormulaActivatable({
        technik: comp('technik', 'test-technik', 't'),
        essenz: comp('essenz', 'test-essenz', 'e'),
        katalysator: comp('katalysator', 'test-katalysator', 'k'),
      }),
    ).toBe(true);
    expect(
      isFullFormulaActivatable({
        technik: comp('technik', 'test-technik', 't'),
        essenz: null,
        katalysator: comp('katalysator', 'test-katalysator', 'k'),
      }),
    ).toBe(false);
  });
});

describe('full formula charge gain', () => {
  it('gains +1 on full activate', () => {
    let state = v5Game();
    state.phase = 'build';
    state.activePlayer = 'p1';
    state.players.p1.formula = {
      technik: comp('technik', 'test-technik', 't'),
      essenz: comp('essenz', 'test-essenz', 'e'),
      katalysator: comp('katalysator', 'test-katalysator', 'k'),
    };
    state = applyAction(state, { type: 'FORMULA_ACTIVATE' }, 'p1', V5_CTX);
    expect(state.players.p1.fetzCharge).toBe(1);
  });

  it('rejects technik-only activate', () => {
    let state = v5Game();
    state.phase = 'build';
    state.activePlayer = 'p1';
    state.players.p1.formula = {
      technik: comp('technik', 'test-technik', 't'),
      essenz: null,
      katalysator: null,
    };
    expect(() =>
      applyAction(state, { type: 'FORMULA_ACTIVATE' }, 'p1', V5_CTX),
    ).toThrow(/at least two filled slots/i);
    expect(state.players.p1.fetzCharge).toBe(0);
  });

  it('gains no charge on two-slot activate (missing katalysator)', () => {
    let state = v5Game();
    state.phase = 'build';
    state.activePlayer = 'p1';
    state.players.p1.formula = {
      technik: comp('technik', 'test-technik', 't'),
      essenz: comp('essenz', 'test-essenz', 'e'),
      katalysator: null,
    };
    state = applyAction(state, { type: 'FORMULA_ACTIVATE' }, 'p1', V5_CTX);
    expect(state.players.p1.fetzCharge).toBe(0);
    expect(state.phase).toBe('action');
  });

  it('caps at 3 across repeated full activates', () => {
    let state = v5Game();
    state.players.p1.fetzCharge = 2;
    for (let i = 0; i < 3; i++) {
      state.phase = 'build';
      state.activePlayer = 'p1';
      state.players.p1.formula = {
        technik: comp('technik', 'test-technik', `t${i}`),
        essenz: comp('essenz', 'test-essenz', `e${i}`),
        katalysator: comp('katalysator', 'test-katalysator', `k${i}`),
      };
      state = applyAction(state, { type: 'FORMULA_ACTIVATE' }, 'p1', V5_CTX);
    }
    expect(state.players.p1.fetzCharge).toBe(3);
  });
});

describe('Großformel gate', () => {
  it('does not offer PLAY_ULTIMATE under v5 when charge < 3', () => {
    let state = v5Game();
    state.phase = 'action';
    state.activePlayer = 'p1';
    state.players.p1.fetzCharge = 2;
    state.players.p1.ultimateAvailable = true;
    const ulti = getLegalActions(state, V5_CTX).find((a) => a.type === 'PLAY_ULTIMATE');
    expect(ulti).toBeUndefined();
  });

  it('offers PLAY_ULTIMATE at charge 3', () => {
    let state = v5Game();
    state.phase = 'action';
    state.activePlayer = 'p1';
    state.players.p1.fetzCharge = 3;
    state.players.p1.ultimateAvailable = true;
    const ulti = getLegalActions(state, V5_CTX).find((a) => a.type === 'PLAY_ULTIMATE');
    expect(ulti).toEqual({ type: 'PLAY_ULTIMATE' });
  });

  it('applies aftermath: charge 0, discard kat, exhaust tech/essenz, once', () => {
    let state = v5Game();
    state.phase = 'action';
    state.activePlayer = 'p1';
    state.players.p1.fetzCharge = 3;
    state.players.p1.ultimateAvailable = true;
    state.players.p1.formula = {
      technik: comp('technik', 'test-technik', 't'),
      essenz: comp('essenz', 'test-essenz', 'e'),
      katalysator: comp('katalysator', 'test-katalysator', 'k'),
    };
    const discardBefore = state.piles.discard.length;

    state = applyAction(state, { type: 'PLAY_ULTIMATE' }, 'p1', V5_CTX);
    expect(state.players.p1.fetzCharge).toBe(0);
    expect(state.players.p1.ultimateAvailable).toBe(false);
    expect(state.players.p1.formula.katalysator).toBeNull();
    expect(state.players.p1.formula.technik?.exhausted).toBe(true);
    expect(state.players.p1.formula.essenz?.exhausted).toBe(true);
    expect(state.piles.discard.some((c) => c.instanceId === 'k')).toBe(true);
    expect(state.piles.discard.length).toBeGreaterThan(discardBefore);

    state.phase = 'action';
    state.players.p1.fetzCharge = 3;
    expect(() =>
      applyAction(state, { type: 'PLAY_ULTIMATE' }, 'p1', V5_CTX),
    ).toThrow(/already used/i);
  });

  it('applyGrossformelAftermath is pure helper', () => {
    let state = v5Game();
    state.players.p1.fetzCharge = 3;
    state.players.p1.formula = {
      technik: comp('technik', 'test-technik', 't'),
      essenz: comp('essenz', 'test-essenz', 'e'),
      katalysator: comp('katalysator', 'test-katalysator', 'k'),
    };
    state = applyGrossformelAftermath(state, 'p1');
    expect(state.players.p1.fetzCharge).toBe(0);
    expect(state.players.p1.formula.katalysator).toBeNull();
  });
});

describe('V1 ultimate regression', () => {
  it('still offers PLAY_ULTIMATE without charge gate', () => {
    const ctx = { pack: BASE_PACK, playerId: 'p1' as const };
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 1,
    });
    state.phase = 'action';
    state.activePlayer = 'p1';
    state.players.p1.ultimateAvailable = true;
    state.players.p1.fetzCharge = 0;
    const ulti = getLegalActions(state, ctx).find((a) => a.type === 'PLAY_ULTIMATE');
    expect(ulti).toEqual({ type: 'PLAY_ULTIMATE' });
  });
});
