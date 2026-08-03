/**
 * V6 Formeländerung limits + Rückbau (#375).
 * Location: src/game/engine/v6/formulaChangeRueckbau.test.ts
 */
import { describe, expect, it } from 'vitest';
import { applyAction, getLegalActions } from '../actions';
import { createGame } from '../createGame';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';
import { V5_PACK } from '../../packs/v5';
import { V5_RULESET } from '../../types';
import type { ContentPack, FormulaComponentInstance, GameState } from '../../types';

const pack = V6_CORE_PACK;
const p1 = pack.characters[0].id;
const p2 = pack.characters[1]?.id ?? p1;
const ctx = { pack, playerId: 'p1' as const, ruleset: V6_PACK_RULESET };

function advanceToBuild(state: GameState): GameState {
  let next = state;
  if (next.phase === 'start') {
    next = applyAction(next, { type: 'ADVANCE_PHASE' }, 'p1', ctx);
  }
  if (next.phase === 'draw') {
    next = applyAction(next, { type: 'ADVANCE_PHASE' }, 'p1', ctx);
  }
  return next;
}

function withHandAndFormula(
  state: GameState,
  handDefIds: string[],
  formula: {
    technik?: FormulaComponentInstance | null;
    essenz?: FormulaComponentInstance | null;
    katalysator?: FormulaComponentInstance | null;
  } = {},
): GameState {
  return {
    ...state,
    players: {
      ...state.players,
      p1: {
        ...state.players.p1,
        hand: handDefIds.map((defId, i) => ({ instanceId: `h-${i}`, defId })),
        formula: {
          technik: formula.technik ?? null,
          essenz: formula.essenz ?? null,
          katalysator: formula.katalysator ?? null,
        },
      },
    },
  };
}

function pickTechniqueId(content: ContentPack): string {
  return content.techniques?.[0]?.id ?? '';
}

function pickEssenceId(content: ContentPack): string {
  return content.essences?.[0]?.id ?? '';
}

function pickFillerId(content: ContentPack): string {
  return (
    content.elementCards?.[0]?.id ??
    content.catalysts?.[0]?.id ??
    content.techniques?.[1]?.id ??
    pickTechniqueId(content)
  );
}

describe('V6 Formeländerung + Rückbau (#375)', () => {
  it('first FORMULA_BUILD is free and stays in build phase', () => {
    let state = advanceToBuild(
      createGame({
        pack,
        p1CharacterId: p1,
        p2CharacterId: p2,
        ruleset: V6_PACK_RULESET,
        startingPlayer: 'p1',
        seed: 375,
      }),
    );
    const tech = pickTechniqueId(pack);
    const filler = pickFillerId(pack);
    state = withHandAndFormula(state, [tech, filler]);
    const legal = getLegalActions(state, ctx);
    expect(
      legal.some(
        (a) => a.type === 'FORMULA_BUILD' && a.cardInstanceId === 'h-0' && !a.discardHandInstanceId,
      ),
    ).toBe(true);

    state = applyAction(
      state,
      { type: 'FORMULA_BUILD', cardInstanceId: 'h-0' },
      'p1',
      ctx,
    );
    expect(state.phase).toBe('build');
    expect(state.meta.v6FormulaChangesThisTurn?.p1).toBe(1);
    expect(state.players.p1.formula.technik?.instanceId).toBe('h-0');
  });

  it('second change requires discard; third is illegal', () => {
    let state = advanceToBuild(
      createGame({
        pack,
        p1CharacterId: p1,
        p2CharacterId: p2,
        ruleset: V6_PACK_RULESET,
        startingPlayer: 'p1',
        seed: 376,
      }),
    );
    const tech = pickTechniqueId(pack);
    const ess = pickEssenceId(pack);
    const filler = pickFillerId(pack);
    state = withHandAndFormula(state, [tech, ess, filler]);

    state = applyAction(state, { type: 'FORMULA_BUILD', cardInstanceId: 'h-0' }, 'p1', ctx);
    expect(state.phase).toBe('build');

    const legal2 = getLegalActions(state, ctx);
    expect(
      legal2.some(
        (a) =>
          a.type === 'FORMULA_BUILD' &&
          a.cardInstanceId === 'h-1' &&
          a.discardHandInstanceId === 'h-2',
      ),
    ).toBe(true);
    expect(
      legal2.some(
        (a) =>
          (a.type === 'FORMULA_BUILD' || a.type === 'FORMULA_REPLACE') && !a.discardHandInstanceId,
      ),
    ).toBe(false);

    state = applyAction(
      state,
      { type: 'FORMULA_BUILD', cardInstanceId: 'h-1', discardHandInstanceId: 'h-2' },
      'p1',
      ctx,
    );
    expect(state.phase).toBe('build');
    expect(state.meta.v6FormulaChangesThisTurn?.p1).toBe(2);
    expect(state.players.p1.hand.some((c) => c.instanceId === 'h-2')).toBe(false);

    const legal3 = getLegalActions(state, ctx);
    expect(legal3.some((a) => a.type === 'FORMULA_BUILD' || a.type === 'FORMULA_REPLACE')).toBe(
      false,
    );
  });

  it('FORMULA_RETURN ends Formelphase without activate', () => {
    let state = advanceToBuild(
      createGame({
        pack,
        p1CharacterId: p1,
        p2CharacterId: p2,
        ruleset: V6_PACK_RULESET,
        startingPlayer: 'p1',
        seed: 377,
      }),
    );
    const tech = pickTechniqueId(pack);
    state = withHandAndFormula(state, [], {
      technik: {
        instanceId: 't-board',
        defId: tech,
        slot: 'technik',
        exhausted: false,
        disturbed: false,
        stabilityBonus: 0,
      },
    });

    const legal = getLegalActions(state, ctx);
    expect(legal.some((a) => a.type === 'FORMULA_RETURN' && a.formulaInstanceId === 't-board')).toBe(
      true,
    );

    state = applyAction(
      state,
      { type: 'FORMULA_RETURN', formulaInstanceId: 't-board' },
      'p1',
      ctx,
    );
    expect(state.phase).toBe('action');
    expect(state.players.p1.formula.technik).toBeNull();
    expect(state.players.p1.hand.some((c) => c.instanceId === 't-board')).toBe(true);
    expect(state.meta.v6FormulaRueckbauThisTurn?.p1).toBe(true);
    expect(state.lastEvent).toContain('Rückbau');
  });

  it('V5 FORMULA_BUILD still ends phase (regression)', () => {
    const v5Ctx = { pack: V5_PACK, playerId: 'p1' as const, ruleset: V5_RULESET };
    let state = createGame({
      pack: V5_PACK,
      p1CharacterId: V5_PACK.characters[0].id,
      p2CharacterId: V5_PACK.characters[1]?.id ?? V5_PACK.characters[0].id,
      ruleset: V5_RULESET,
      startingPlayer: 'p1',
      seed: 378,
    });
    if (state.phase === 'start') {
      state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', v5Ctx);
    }
    if (state.phase === 'draw') {
      state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', v5Ctx);
    }
    const tech = V5_PACK.techniques?.[0]?.id;
    if (!tech) return;
    state = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'v5-h0', defId: tech }],
          formula: { technik: null, essenz: null, katalysator: null },
        },
      },
    };
    state = applyAction(state, { type: 'FORMULA_BUILD', cardInstanceId: 'v5-h0' }, 'p1', v5Ctx);
    expect(state.phase).toBe('action');
  });
});
