/**
 * V5 formula resolution tests.
 * Location: src/game/engine/formulaResolve.test.ts
 */
import { describe, expect, it } from 'vitest';
import { applyAction } from './actions';
import { createGame } from './createGame';
import { BASE_PACK } from '../packs/base-pack';
import { V5_RULESET, type ContentPack } from '../types';
import { resolveFormulaActivate } from './formulaResolve';

const PACK: ContentPack = {
  ...BASE_PACK,
  id: 'v5-resolve-mini',
  name: 'V5 Resolve Mini',
  techniques: [
    {
      kind: 'technique',
      id: 'tech-slash',
      name: 'Rückhand',
      stability: 3,
      activationMode: 'prep_attack',
      effectText: '+1 Angriff',
      formulaEffect: { kind: 'prep_attack', combatBonus: 1 },
    },
    {
      kind: 'technique',
      id: 'tech-barrier',
      name: 'Barriere',
      stability: 4,
      activationMode: 'instant',
      effectText: '1 Schild',
      formulaEffect: { kind: 'instant_shield', amount: 1 },
    },
    {
      kind: 'technique',
      id: 'tech-drill',
      name: 'Durchschuss',
      stability: 3,
      activationMode: 'prep_attack',
      effectText: 'Ignoriert 1 Schild',
      formulaEffect: { kind: 'prep_attack', ignoreShield: 1 },
    },
  ],
  essences: [
    {
      kind: 'essence',
      id: 'ess-fire',
      name: 'Glut',
      element: 'fire',
      stability: 2,
      effectText: 'Brennen',
      formulaEffect: { kind: 'mark_if_no_reaction', mark: 'brennen' },
    },
  ],
  catalysts: [
    {
      kind: 'catalyst',
      id: 'cat-over',
      name: 'Überladung',
      stability: 2,
      effectText: '+2 / −1 LP',
      formulaEffect: { kind: 'primary_bonus', amount: 2, selfDamage: 1 },
    },
  ],
};

describe('resolveFormulaActivate', () => {
  it('tech only: prep_attack sets combat bonus', () => {
    let state = createGame({
      pack: PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 1,
      ruleset: V5_RULESET,
    });
    state.players.p1.formula.technik = {
      instanceId: 't1',
      defId: 'tech-slash',
      slot: 'technik',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state = resolveFormulaActivate(state, PACK, 'p1', V5_RULESET);
    expect(state.players.p1.formula.technik?.exhausted).toBe(true);
    expect(state.players.p1.formulaPrep?.attackCombatBonus).toBe(1);
  });

  it('tech + essence: shield instant + mark prep', () => {
    let state = createGame({
      pack: PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 2,
      ruleset: V5_RULESET,
    });
    state.players.p1.formula.technik = {
      instanceId: 't1',
      defId: 'tech-barrier',
      slot: 'technik',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state.players.p1.formula.essenz = {
      instanceId: 'e1',
      defId: 'ess-fire',
      slot: 'essenz',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state = resolveFormulaActivate(state, PACK, 'p1', V5_RULESET);
    expect(state.players.p1.shield).toBe(1);
    expect(state.players.p1.formulaPrep?.markIfNoReaction).toBe('brennen');
  });

  it('full formula: catalyst adds primary bonus and self-damage', () => {
    let state = createGame({
      pack: PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 3,
      ruleset: V5_RULESET,
    });
    const hpBefore = state.players.p1.hp;
    state.players.p1.formula.technik = {
      instanceId: 't1',
      defId: 'tech-drill',
      slot: 'technik',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state.players.p1.formula.essenz = {
      instanceId: 'e1',
      defId: 'ess-fire',
      slot: 'essenz',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state.players.p1.formula.katalysator = {
      instanceId: 'c1',
      defId: 'cat-over',
      slot: 'katalysator',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state = resolveFormulaActivate(state, PACK, 'p1', V5_RULESET);
    expect(state.players.p1.hp).toBe(hpBefore - 1);
    expect(state.players.p1.formulaPrep?.attackCombatBonus).toBe(2);
    expect(state.players.p1.formulaPrep?.attackIgnoreShield).toBe(1);
    expect(state.players.p1.formula.katalysator?.exhausted).toBe(true);
  });

  it('FORMULA_ACTIVATE through applyAction sets prep', () => {
    let state = createGame({
      pack: PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 4,
      ruleset: V5_RULESET,
    });
    const ctx = { pack: PACK, playerId: 'p1' as const };
    state = {
      ...state,
      phase: 'build',
      activePlayer: 'p1',
      meta: { ...state.meta, v5FormulaEnabled: true, v3CombatEnabled: true },
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          formula: {
            technik: {
              instanceId: 't1',
              defId: 'tech-slash',
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
    state = applyAction(state, { type: 'FORMULA_ACTIVATE' }, 'p1', ctx);
    expect(state.phase).toBe('action');
    expect(state.players.p1.formulaPrep?.attackCombatBonus).toBe(1);
  });
});
