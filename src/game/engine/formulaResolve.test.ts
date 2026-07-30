/**
 * V5 formula resolution tests.
 * Location: src/game/engine/formulaResolve.test.ts
 */
import { describe, expect, it } from 'vitest';
import { applyAction } from './actions';
import { createGame } from './createGame';
import { BASE_PACK } from '../packs/base-pack';
import { V5_RULESET, type ContentPack } from '../types';
import {
  resolveFormulaActivate,
  takeBoostPrepBonus,
  armChainSameAction,
  takeChainSameActionBonus,
  takeReactionDamageBonus,
  emptyFormulaPrep,
} from './formulaResolve';
import { applyStatus, getStatus } from './status/applyStatus';
import { applyElementEffect } from './effects';

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
  it('rejects single-slot resolve', () => {
    const state = createGame({
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
    expect(() => resolveFormulaActivate(state, PACK, 'p1', V5_RULESET)).toThrow(
      /at least two filled slots/i,
    );
  });

  it('two slots without katalysator: prep from tech + mark from essenz', () => {
    let state = createGame({
      pack: PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 11,
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
    state.players.p1.formula.essenz = {
      instanceId: 'e1',
      defId: 'ess-fire',
      slot: 'essenz',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state = resolveFormulaActivate(state, PACK, 'p1', V5_RULESET);
    expect(state.players.p1.formulaPrep?.attackCombatBonus).toBe(1);
    expect(state.players.p1.formulaPrep?.markIfNoReaction).toBe('brennen');
    expect(state.players.p1.formula.katalysator).toBeNull();
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

  it('FORMULA_ACTIVATE through applyAction sets prep with two filled slots', () => {
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
            essenz: {
              instanceId: 'e1',
              defId: 'ess-fire',
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
    state = applyAction(state, { type: 'FORMULA_ACTIVATE' }, 'p1', ctx);
    expect(state.phase).toBe('action');
    expect(state.players.p1.formulaPrep?.attackCombatBonus).toBe(1);
    expect(state.players.p1.formulaPrep?.markIfNoReaction).toBe('brennen');
  });

  it('FORMULA_ACTIVATE rejects single filled slot via applyAction', () => {
    let state = createGame({
      pack: PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 5,
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
    expect(() => applyAction(state, { type: 'FORMULA_ACTIVATE' }, 'p1', ctx)).toThrow(
      /at least two filled slots/i,
    );
  });

  it('Klarspüler clears own mark; Echo schedules next-start bonus', () => {
    const pack: ContentPack = {
      ...PACK,
      techniques: [
        ...PACK.techniques!,
        {
          kind: 'technique',
          id: 'tech-clear',
          name: 'Klarspüler',
          stability: 3,
          activationMode: 'instant',
          effectText: 'clear',
          formulaEffect: { kind: 'instant_clear_own_mark' },
        },
      ],
      catalysts: [
        {
          kind: 'catalyst',
          id: 'cat-echo',
          name: 'Echo',
          stability: 2,
          effectText: 'echo',
          formulaEffect: { kind: 'echo_next_start', amount: 1 },
        },
      ],
    };
    let state = createGame({
      pack,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 9,
      ruleset: V5_RULESET,
    });
    state = applyStatus(state, 'p1', 'brennen', 1);
    state.players.p1.formula.technik = {
      instanceId: 't1',
      defId: 'tech-clear',
      slot: 'technik',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state.players.p1.formula.katalysator = {
      instanceId: 'k1',
      defId: 'cat-echo',
      slot: 'katalysator',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state = resolveFormulaActivate(state, pack, 'p1', V5_RULESET);
    expect(getStatus(state, 'p1', 'brennen')).toBeUndefined();
    expect(state.meta.v5EchoPrimary?.p1).toBe(1);
  });

  it('Sperrkreis sets enemy attack penalty; Betonkern buffs stability', () => {
    const pack: ContentPack = {
      ...PACK,
      techniques: [
        {
          kind: 'technique',
          id: 'tech-ring',
          name: 'Sperrkreis',
          stability: 4,
          activationMode: 'instant',
          effectText: '−1',
          formulaEffect: { kind: 'enemy_next_attack_penalty', amount: 1 },
        },
      ],
      essences: [
        {
          kind: 'essence',
          id: 'ess-beton',
          name: 'Betonkern',
          element: 'earth',
          stability: 4,
          effectText: '+1 stab',
          formulaEffect: { kind: 'stability_buff_used', amount: 1 },
        },
      ],
    };
    let state = createGame({
      pack,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 10,
      ruleset: V5_RULESET,
    });
    state.players.p1.formula.technik = {
      instanceId: 't1',
      defId: 'tech-ring',
      slot: 'technik',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state.players.p1.formula.essenz = {
      instanceId: 'e1',
      defId: 'ess-beton',
      slot: 'essenz',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state = resolveFormulaActivate(state, pack, 'p1', V5_RULESET);
    expect(state.meta.v5NextAttackPenalty?.p2).toBe(1);
    expect(state.players.p1.formula.technik?.stabilityBonus).toBe(1);
    expect(state.players.p1.formula.essenz?.stabilityBonus).toBe(1);
  });

  it('prep_boost sets value bonus; takeBoostPrepBonus consumes it', () => {
    const pack: ContentPack = {
      ...PACK,
      techniques: [
        {
          kind: 'technique',
          id: 'tech-focus',
          name: 'Fokuskurbel',
          stability: 3,
          activationMode: 'prep_boost',
          effectText: '+1',
          formulaEffect: { kind: 'prep_boost', valueBonus: 1, filterHandIfNoValue: true },
        },
      ],
      essences: [
        {
          kind: 'essence',
          id: 'ess-air',
          name: 'Druckluft',
          element: 'air',
          stability: 3,
          effectText: 'w6',
          formulaEffect: { kind: 'w6_bonus', amount: 1, max: 2 },
        },
      ],
    };
    let state = createGame({
      pack,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 12,
      ruleset: V5_RULESET,
    });
    state.players.p1.formula.technik = {
      instanceId: 't1',
      defId: 'tech-focus',
      slot: 'technik',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state.players.p1.formula.essenz = {
      instanceId: 'e1',
      defId: 'ess-air',
      slot: 'essenz',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state = resolveFormulaActivate(state, pack, 'p1', V5_RULESET);
    expect(state.players.p1.formulaPrep?.boostValueBonus).toBe(1);
    expect(state.players.p1.formulaPrep?.boostFilterHandIfNoValue).toBe(true);
    expect(state.players.p1.formulaPrep?.w6Bonus).toBe(1);
    expect(state.players.p1.formulaPrep?.preparedActionType).toBe('boost');

    const taken = takeBoostPrepBonus(state, 'p1');
    expect(taken.valueBonus).toBe(1);
    expect(taken.filterHandIfNoValue).toBe(true);
    expect(taken.state.players.p1.formulaPrep?.boostValueBonus ?? 0).toBe(0);
  });

  it('chain_same_action arms meta after success and consumes on next action', () => {
    let state = createGame({
      pack: PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 13,
      ruleset: V5_RULESET,
    });
    state.players.p1.formulaPrep = {
      ...emptyFormulaPrep(),
      attackCombatBonus: 1,
      chainSameActionBonus: 1,
      preparedActionType: 'attack',
    };
    state = armChainSameAction(state, 'p1', 'attack');
    expect(state.meta.v5ChainSameAction?.p1).toEqual({ action: 'attack', bonus: 1 });
    const taken = takeChainSameActionBonus(state, 'p1', 'attack');
    expect(taken.bonus).toBe(1);
    expect(taken.state.meta.v5ChainSameAction?.p1).toBeNull();
  });

  it('reactionDamageBonus is consumed once via takeReactionDamageBonus', () => {
    let state = createGame({
      pack: PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 14,
      ruleset: V5_RULESET,
    });
    state.players.p1.formulaPrep = {
      ...emptyFormulaPrep(),
      reactionDamageBonus: 1,
    };
    const taken = takeReactionDamageBonus(state, 'p1');
    expect(taken.bonus).toBe(1);
    expect(taken.state.players.p1.formulaPrep).toBeNull();
  });

  it('fire boost with amountBonus deals +1 damage', () => {
    let state = createGame({
      pack: PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 15,
      ruleset: V5_RULESET,
    });
    const hpBefore = state.players.p2.hp;
    state = applyElementEffect(state, 'p1', 'fire', () => 0.5, V5_RULESET, {
      pack: PACK,
      amountBonus: 1,
    });
    expect(state.players.p2.hp).toBe(hpBefore - 3);
  });

  it('prep_attack impulseOnTie flag is set for Fächerstoß-style tech', () => {
    const pack: ContentPack = {
      ...PACK,
      techniques: [
        {
          kind: 'technique',
          id: 'tech-fan',
          name: 'Fächerstoß',
          stability: 2,
          activationMode: 'prep_attack',
          effectText: 'tie',
          formulaEffect: { kind: 'prep_attack', combatBonus: -1, impulseOnTie: true },
        },
      ],
      catalysts: [
        {
          kind: 'catalyst',
          id: 'cat-chain',
          name: 'Kettenkopplung',
          stability: 3,
          effectText: 'chain',
          formulaEffect: { kind: 'chain_same_action', amount: 1 },
        },
      ],
    };
    let state = createGame({
      pack,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 16,
      ruleset: V5_RULESET,
    });
    state.players.p1.formula.technik = {
      instanceId: 't1',
      defId: 'tech-fan',
      slot: 'technik',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state.players.p1.formula.katalysator = {
      instanceId: 'c1',
      defId: 'cat-chain',
      slot: 'katalysator',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state = resolveFormulaActivate(state, pack, 'p1', V5_RULESET);
    expect(state.players.p1.formulaPrep?.impulseOnTie).toBe(true);
    expect(state.players.p1.formulaPrep?.attackCombatBonus).toBe(-1);
    expect(state.players.p1.formulaPrep?.chainSameActionBonus).toBe(1);
    expect(state.players.p1.formulaPrep?.preparedActionType).toBe('attack');
  });

  it('instant heal/shield/enemy stability/retrieve and remaining essence kinds resolve', () => {
    const pack: ContentPack = {
      ...PACK,
      techniques: [
        {
          kind: 'technique',
          id: 'tech-heal',
          name: 'Erste Hilfe',
          stability: 2,
          activationMode: 'instant',
          effectText: 'heal',
          formulaEffect: { kind: 'instant_heal', amount: 1 },
        },
        {
          kind: 'technique',
          id: 'tech-sog',
          name: 'Soggriff',
          stability: 3,
          activationMode: 'instant',
          effectText: 'stab',
          formulaEffect: { kind: 'instant_enemy_stability', amount: -1 },
        },
      ],
      essences: [
        {
          kind: 'essence',
          id: 'ess-amp',
          name: 'Tiefenwasser',
          element: 'water',
          stability: 3,
          effectText: 'amp',
          formulaEffect: { kind: 'amplify_heal_or_shield', amount: 1 },
        },
        {
          kind: 'essence',
          id: 'ess-clear',
          name: 'Reinlicht',
          element: 'light',
          stability: 2,
          effectText: 'clear',
          formulaEffect: { kind: 'clear_mark_or_shield' },
        },
        {
          kind: 'essence',
          id: 'ess-life',
          name: 'Sogschatten',
          element: 'shadow',
          stability: 3,
          effectText: 'ls',
          formulaEffect: { kind: 'lifesteal_on_hp', amount: 1 },
        },
        {
          kind: 'essence',
          id: 'ess-react',
          name: 'Explosionspüree',
          element: 'fire',
          stability: 2,
          effectText: 'rx',
          formulaEffect: {
            kind: 'reaction_bonus_then_stability',
            reactionDamageBonus: 1,
            stabilityDelta: -1,
          },
        },
      ],
      catalysts: [
        {
          kind: 'catalyst',
          id: 'cat-spread',
          name: 'Ausbreitung',
          stability: 2,
          effectText: 'spread',
          formulaEffect: { kind: 'spread_stability', amount: 1 },
        },
        {
          kind: 'catalyst',
          id: 'cat-delay',
          name: 'Verzögerung',
          stability: 2,
          effectText: 'delay',
          formulaEffect: { kind: 'delay_primary', bonus: 1 },
        },
        {
          kind: 'catalyst',
          id: 'cat-invert',
          name: 'Umkehrung',
          stability: 2,
          effectText: 'inv',
          formulaEffect: { kind: 'invert_damage_heal', maxPoints: 1 },
        },
        {
          kind: 'catalyst',
          id: 'cat-offer',
          name: 'Opfergabe',
          stability: 2,
          effectText: 'offer',
          formulaEffect: { kind: 'offer_discard_for_bonus', amount: 1 },
        },
        {
          kind: 'catalyst',
          id: 'cat-safe',
          name: 'Sicherheitsventil',
          stability: 2,
          effectText: 'safe',
          formulaEffect: { kind: 'safety_valve' },
        },
        {
          kind: 'catalyst',
          id: 'cat-mirror',
          name: 'Spiegelung',
          stability: 3,
          effectText: 'mirror',
          formulaEffect: { kind: 'mirror_shield_on_hit', amount: 1 },
        },
      ],
    };

    let state = createGame({
      pack,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 17,
      ruleset: V5_RULESET,
    });
    state.players.p1.hp = 10;
    state.players.p1.formula.technik = {
      instanceId: 't1',
      defId: 'tech-heal',
      slot: 'technik',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state.players.p1.formula.essenz = {
      instanceId: 'e1',
      defId: 'ess-amp',
      slot: 'essenz',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state = resolveFormulaActivate(state, pack, 'p1', V5_RULESET);
    expect(state.players.p1.hp).toBe(12);

    state = createGame({
      pack,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 18,
      ruleset: V5_RULESET,
    });
    state.players.p2.formula.technik = {
      instanceId: 'et1',
      defId: 'tech-heal',
      slot: 'technik',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state.players.p1.formula.technik = {
      instanceId: 't1',
      defId: 'tech-sog',
      slot: 'technik',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state.players.p1.formula.katalysator = {
      instanceId: 'c1',
      defId: 'cat-mirror',
      slot: 'katalysator',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    const stabBefore = state.players.p2.formula.technik!.stabilityBonus;
    state = resolveFormulaActivate(state, pack, 'p1', V5_RULESET);
    expect(state.players.p2.formula.technik?.stabilityBonus).toBe(stabBefore - 1);

    state = createGame({
      pack,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 19,
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
    state.players.p1.formula.essenz = {
      instanceId: 'e1',
      defId: 'ess-react',
      slot: 'essenz',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state = resolveFormulaActivate(state, pack, 'p1', V5_RULESET);
    expect(state.players.p1.formulaPrep?.reactionDamageBonus).toBe(1);
    expect(
      (state.players.p1.formula.technik?.stabilityBonus ?? 0) +
        (state.players.p1.formula.essenz?.stabilityBonus ?? 0),
    ).toBeLessThan(0);

    state = createGame({
      pack,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 20,
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
    state.players.p1.formula.essenz = {
      instanceId: 'e1',
      defId: 'ess-life',
      slot: 'essenz',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state.players.p1.formula.katalysator = {
      instanceId: 'c1',
      defId: 'cat-delay',
      slot: 'katalysator',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state = resolveFormulaActivate(state, pack, 'p1', V5_RULESET);
    expect(state.meta.v5DelayedPrimary?.p1).toBeGreaterThan(0);
    expect(state.players.p1.formulaPrep?.lifestealOnHp).toBe(1);

    state = createGame({
      pack,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 21,
      ruleset: V5_RULESET,
    });
    state = applyStatus(state, 'p1', 'brennen', 1);
    state.players.p1.hand = [{ instanceId: 'h1', defId: 'fire-boost-1' }];
    state.players.p1.formula.technik = {
      instanceId: 't1',
      defId: 'tech-slash',
      slot: 'technik',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state.players.p1.formula.essenz = {
      instanceId: 'e1',
      defId: 'ess-clear',
      slot: 'essenz',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state.players.p1.formula.katalysator = {
      instanceId: 'c1',
      defId: 'cat-safe',
      slot: 'katalysator',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    state = resolveFormulaActivate(state, pack, 'p1', V5_RULESET);
    expect(getStatus(state, 'p1', 'brennen')).toBeUndefined();
  });
});
