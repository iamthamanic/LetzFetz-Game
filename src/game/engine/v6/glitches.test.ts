/**
 * V6 Standard-Glitches — pack timing + formula targets under v6Formula (#378).
 * Location: src/game/engine/v6/glitches.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { applyAction, getLegalActions } from '../actions';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6/v6-pack';
import { V6_STANDARD_GLITCHES } from '../../../content/v6/cards/glitchCards';
import { BASE_PACK } from '../../packs/base-pack';

const CTX = {
  pack: V6_CORE_PACK,
  playerId: 'p1' as const,
  ruleset: V6_PACK_RULESET,
};

function formulaComp(instanceId: string, defId: string) {
  return {
    instanceId,
    defId,
    slot: 'technik' as const,
    exhausted: false,
    disturbed: false,
    stabilityBonus: 0,
  };
}

function baseState() {
  return createGame({
    pack: V6_CORE_PACK,
    p1CharacterId: V6_CORE_PACK.characters[0].id,
    p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
    startingPlayer: 'p1',
    seed: 42,
    ruleset: V6_PACK_RULESET,
  });
}

describe('V6 Standard-Glitches §9 / §37–40', () => {
  it('ships 7 playable glitches with Aktionsphase/Reaktion timing and no Sofort', () => {
    expect(V6_STANDARD_GLITCHES).toHaveLength(7);
    expect(V6_CORE_PACK.glitches).toHaveLength(7);
    expect(V6_CORE_PACK.glitches.every((g) => g.glitchType === 'playable')).toBe(true);
    expect(V6_CORE_PACK.glitches.some((g) => g.glitchType === 'instant')).toBe(false);
    for (const g of V6_CORE_PACK.glitches) {
      expect(g.timing).toMatch(/Aktionsphase|Reaktion/);
      expect(g.effectText.trim().length).toBeGreaterThan(5);
    }
    const names = V6_CORE_PACK.glitches.map((g) => g.name);
    expect(names).not.toContain('Selbstschaden.exe');
    expect(names).not.toContain('Datenleck');
    expect(names).not.toContain('Absturz');
  });

  it('does not put Sofort-Glitches into the V6 shared deck', () => {
    const state = baseState();
    const instantIds = new Set(
      BASE_PACK.glitches.filter((g) => g.glitchType === 'instant').map((g) => g.id),
    );
    const allDefIds = [
      ...state.piles.deck.map((c) => c.defId),
      ...state.players.p1.hand.map((c) => c.defId),
      ...state.players.p2.hand.map((c) => c.defId),
    ];
    expect(allDefIds.some((id) => instantIds.has(id))).toBe(false);
  });

  it('lists Aktions-Glitch in legalActions and exhausts opponent formula (Kurzschluss)', () => {
    let state = baseState();
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'g1', defId: 'glitch-kurzschluss' }],
        },
        p2: {
          ...state.players.p2,
          formula: {
            technik: formulaComp('ft1', V6_CORE_PACK.techniques![0].id),
            essenz: null,
            katalysator: null,
          },
        },
      },
    };
    const legal = getLegalActions(state, CTX);
    expect(
      legal.some(
        (a) =>
          a.type === 'PLAY_GLITCH' &&
          a.glitchInstanceId === 'g1' &&
          a.targetBoundInstanceId === 'ft1',
      ),
    ).toBe(true);

    state = applyAction(
      state,
      { type: 'PLAY_GLITCH', glitchInstanceId: 'g1', targetBoundInstanceId: 'ft1' },
      'p1',
      CTX,
    );
    expect(state.players.p2.formula.technik?.exhausted).toBe(true);
    expect(state.lastEvent).toMatch(/Kurzschluss/);
  });

  it('Systemfehler disturbs a formula component', () => {
    let state = baseState();
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'g1', defId: 'glitch-systemfehler' }],
        },
        p2: {
          ...state.players.p2,
          formula: {
            technik: formulaComp('ft1', V6_CORE_PACK.techniques![0].id),
            essenz: null,
            katalysator: null,
          },
        },
      },
    };
    state = applyAction(
      state,
      { type: 'PLAY_GLITCH', glitchInstanceId: 'g1', targetBoundInstanceId: 'ft1' },
      'p1',
      CTX,
    );
    expect(state.players.p2.formula.technik?.disturbed).toBe(true);
    expect(state.meta.activationLockedBoundId).toBe('ft1');
  });

  it('Illegaler Download exhausts formula, discards, and draws', () => {
    let state = baseState();
    const deckTop = state.piles.deck[0];
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [
            { instanceId: 'g1', defId: 'glitch-download' },
            { instanceId: 'h1', defId: V6_CORE_PACK.elementCards[0].id },
          ],
        },
        p2: {
          ...state.players.p2,
          formula: {
            technik: formulaComp('ft1', V6_CORE_PACK.techniques![0].id),
            essenz: null,
            katalysator: null,
          },
        },
      },
    };
    const handBefore = state.players.p1.hand.length;
    state = applyAction(
      state,
      {
        type: 'PLAY_GLITCH',
        glitchInstanceId: 'g1',
        targetBoundInstanceId: 'ft1',
        discardHandInstanceId: 'h1',
      },
      'p1',
      CTX,
    );
    expect(state.players.p2.formula.technik?.exhausted).toBe(true);
    expect(state.players.p1.hand.some((c) => c.instanceId === 'g1')).toBe(false);
    expect(state.players.p1.hand.some((c) => c.instanceId === 'h1')).toBe(false);
    // Discarded 2 (glitch + hand), drew 1 → net −1 from handBefore unless deck empty edge.
    expect(state.players.p1.hand.length).toBe(handBefore - 2 + 1);
    if (deckTop) {
      expect(state.players.p1.hand.some((c) => c.instanceId === deckTop.instanceId)).toBe(true);
    }
  });

  it('lists reaction Nein, Bruder on boost-interrupt', () => {
    let state = baseState();
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      pendingChoice: {
        type: 'boost-interrupt',
        boosterId: 'p1',
        boostInstanceId: 'b1',
        boostDefId: V6_CORE_PACK.elementCards.find((c) => c.cardType === 'boost')?.id ?? 'boost',
      },
      players: {
        ...state.players,
        p2: {
          ...state.players.p2,
          hand: [{ instanceId: 'g-nein', defId: 'glitch-nein' }],
        },
      },
    };
    const legal = getLegalActions(state, { ...CTX, playerId: 'p2' });
    expect(
      legal.some((a) => a.type === 'PLAY_GLITCH' && a.glitchInstanceId === 'g-nein'),
    ).toBe(true);
  });
});
