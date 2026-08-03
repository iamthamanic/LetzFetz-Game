/**
 * V5 §21 Gegenstände effect parity + reaction combat window (#282).
 * Location: src/game/engine/v5Items.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from './createGame';
import { applyAction, getLegalActions } from './actions';
import { V5_PACK, V5_PACK_RULESET } from '../packs/v5/v5-pack';
import { V5_ITEMS } from '../packs/v5/formulaCards';
import { getStatus } from './status/applyStatus';
import { emptyFormulaPrep } from './formulaResolve';

const CTX = {
  pack: V5_PACK,
  playerId: 'p1' as const,
  ruleset: V5_PACK_RULESET,
};

function baseState() {
  return createGame({
    pack: V5_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'schluckspecht',
    startingPlayer: 'p1',
    seed: 42,
    ruleset: V5_PACK_RULESET,
  });
}

describe('V5 items §21', () => {
  it('ships all 8 items with action or reaction timing', () => {
    expect(V5_ITEMS).toHaveLength(8);
    expect(V5_ITEMS.filter((i) => i.timing === 'action')).toHaveLength(6);
    expect(V5_ITEMS.filter((i) => i.timing === 'reaction')).toHaveLength(2);
  });

  it('Rostiger Nagel arms ignore-shield prep', () => {
    let state = baseState();
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'nagel', defId: 'v5-item-rostiger-nagel' }],
          formulaPrep: null,
        },
      },
    };
    state = applyAction(state, { type: 'PLAY_ITEM', cardInstanceId: 'nagel' }, 'p1', CTX);
    expect(state.players.p1.formulaPrep?.attackIgnoreShield).toBe(2);
  });

  it('Verdächtiger Pilz grants shield + High', () => {
    let state = baseState();
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'pilz', defId: 'v5-item-verdaechtiger-pilz' }],
          shield: 0,
        },
      },
    };
    state = applyAction(state, { type: 'PLAY_ITEM', cardInstanceId: 'pilz' }, 'p1', CTX);
    expect(state.players.p1.shield).toBe(2);
    expect(getStatus(state, 'p1', 'high')?.stacks).toBe(1);
  });

  it('Halbe Dose Energy draws 2 and sets hangover −1 HP next start', () => {
    let state = baseState();
    const handBefore = 1;
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'energy', defId: 'v5-item-halbe-dose-energy' }],
          hp: 18,
        },
      },
      piles: {
        ...state.piles,
        deck: [
          { instanceId: 'd1', defId: 'fire-attack-3' },
          { instanceId: 'd2', defId: 'water-attack-2' },
          ...state.piles.deck,
        ],
      },
    };
    state = applyAction(state, { type: 'PLAY_ITEM', cardInstanceId: 'energy' }, 'p1', CTX);
    expect(state.players.p1.hand.length).toBe(handBefore - 1 + 2);
    expect(state.meta.v5EnergyHangover?.p1).toBe(1);

    // End turn → opponent start → back to p1 start
    state = { ...state, phase: 'end', activePlayer: 'p1', pendingChoice: null, combat: null };
    state = applyAction(state, { type: 'END_TURN' }, 'p1', CTX);
    expect(state.activePlayer).toBe('p2');
    state = { ...state, phase: 'end', activePlayer: 'p2' };
    state = applyAction(state, { type: 'END_TURN' }, 'p2', { ...CTX, playerId: 'p2' });
    expect(state.activePlayer).toBe('p1');
    expect(state.phase).toBe('start');
    const hpBefore = state.players.p1.hp;
    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', CTX);
    expect(state.players.p1.hp).toBe(hpBefore - 1);
    expect(state.meta.v5EnergyHangover?.p1 ?? 0).toBe(0);
  });

  it('Nasser Socken arms water impulse + Durchnässt fallback', () => {
    let state = baseState();
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'socken', defId: 'v5-item-nasser-socken' }],
          formulaPrep: null,
        },
      },
    };
    state = applyAction(state, { type: 'PLAY_ITEM', cardInstanceId: 'socken' }, 'p1', CTX);
    expect(state.players.p1.formulaPrep?.extraHitImpulse).toBe('water');
    expect(state.players.p1.formulaPrep?.markIfNoReaction).toBe('durchnaesst');
  });

  it('Kabelbinder Deluxe disturbs low-stability formula component', () => {
    let state = baseState();
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'kabel', defId: 'v5-item-kabelbinder-deluxe' }],
        },
        p2: {
          ...state.players.p2,
          formula: {
            technik: {
              instanceId: 't1',
              defId: 'v5-technik-durchschuss',
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
    state = applyAction(state, { type: 'PLAY_ITEM', cardInstanceId: 'kabel' }, 'p1', CTX);
    expect(state.players.p2.formula.technik?.disturbed).toBe(true);
  });

  it('Kaputter Rückspiegel is legal in combat and reduces attackValue', () => {
    let state = baseState();
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      combat: {
        attackerId: 'p1',
        defenderId: 'p2',
        attackCardDefId: 'fire-attack-2',
        attackRoll: 4,
        attackValue: 5,
        mode: 'player',
      },
      players: {
        ...state.players,
        p2: {
          ...state.players.p2,
          hand: [{ instanceId: 'spiegel', defId: 'v5-item-kaputter-rueckspiegel' }],
        },
      },
    };
    const legal = getLegalActions(state, { ...CTX, playerId: 'p2' });
    expect(legal.some((a) => a.type === 'PLAY_ITEM' && a.cardInstanceId === 'spiegel')).toBe(
      true,
    );
    // Not legal for attacker / outside combat
    expect(
      getLegalActions(
        { ...state, combat: null, activePlayer: 'p2', phase: 'action' },
        { ...CTX, playerId: 'p2' },
      ).some((a) => a.type === 'PLAY_ITEM' && a.cardInstanceId === 'spiegel'),
    ).toBe(false);

    state = applyAction(
      state,
      { type: 'PLAY_ITEM', cardInstanceId: 'spiegel' },
      'p2',
      { ...CTX, playerId: 'p2' },
    );
    expect(state.combat?.attackValue).toBe(4);
    expect(state.combat?.rueckspiegelArmed).toBe(true);
    expect(state.players.p2.hand.some((c) => c.instanceId === 'spiegel')).toBe(false);
  });

  it('Kaputter Rückspiegel Vollblock applies Verstrahlt to attacker', () => {
    let state = baseState();
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      combat: {
        attackerId: 'p1',
        defenderId: 'p2',
        attackCardDefId: 'fire-attack-2',
        attackRoll: 1,
        attackValue: 2,
        mode: 'player',
        rueckspiegelArmed: true,
      },
      players: {
        ...state.players,
        p2: {
          ...state.players.p2,
          hand: [{ instanceId: 'blk', defId: 'water-block-6' }],
          formulaPrep: emptyFormulaPrep(),
        },
      },
    };
    // Force high block via diceRoll
    state = applyAction(
      state,
      { type: 'PLAY_BLOCK', cardInstanceId: 'blk', diceRoll: 6 },
      'p2',
      { ...CTX, playerId: 'p2' },
    );
    expect(state.combat).toBeNull();
    expect(getStatus(state, 'p1', 'erleuchtet')?.stacks).toBe(1);
  });
});
