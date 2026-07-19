/**
 * Unit tests for V2 phrase board build (issue #45).
 */
import { describe, expect, it } from 'vitest';
import { createGame } from './createGame';
import { applyAction, getLegalActions } from './actions';
import { findEnginePartDef, findElementDef } from './lookup';
import {
  findFirstFreePhraseSlot,
  isV2Pack,
  PHRASE_SLOT_ORDER,
} from './phraseBuild';
import { collectInvariantViolations } from './invariants';
import { BASE_PACK } from '../packs/base-pack';
import { V2_P100_PACK } from '../packs/v2';

const V1_CTX = { pack: BASE_PACK, playerId: 'p1' as const };
const V2_CTX = { pack: V2_P100_PACK, playerId: 'p1' as const };

function advanceToBind(state: ReturnType<typeof createGame>) {
  let next = state;
  if (next.phase === 'start') {
    next = applyAction(next, { type: 'ADVANCE_PHASE' }, 'p1', V2_CTX);
  }
  if (next.phase === 'draw') {
    next = applyAction(next, { type: 'ADVANCE_PHASE' }, 'p1', V2_CTX);
  }
  return next;
}

function firstHandCardMatching(
  state: ReturnType<typeof createGame>,
  pack: typeof BASE_PACK,
  predicate: (defId: string) => boolean,
) {
  return state.players.p1.hand.find((c) => predicate(c.defId));
}

describe('phraseBuild helpers', () => {
  it('detects V2 pack via engineParts', () => {
    expect(isV2Pack(V2_P100_PACK)).toBe(true);
    expect(isV2Pack(BASE_PACK)).toBe(false);
  });

  it('picks first free slot core → mode → tool', () => {
    expect(findFirstFreePhraseSlot([])).toBe('core');
    expect(
      findFirstFreePhraseSlot([
        {
          instanceId: 'b1',
          defId: 'x',
          exhausted: false,
          resistanceBonus: 0,
          phraseSlot: 'core',
        },
      ]),
    ).toBe('mode');
    expect(PHRASE_SLOT_ORDER).toEqual(['core', 'mode', 'tool']);
  });
});

describe('V2 phrase build — applyAction', () => {
  it('builds engine part into first free phrase slot', () => {
    let state = advanceToBind(
      createGame({
        pack: V2_P100_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 4242,
      }),
    );

    const partCard = firstHandCardMatching(state, V2_P100_PACK, (defId) =>
      Boolean(findEnginePartDef(V2_P100_PACK, defId)),
    );
    expect(partCard).toBeTruthy();

    state = applyAction(
      state,
      { type: 'BUILD_CARD', cardInstanceId: partCard!.instanceId },
      'p1',
      V2_CTX,
    );

    expect(state.phase).toBe('action');
    expect(state.players.p1.bound).toHaveLength(1);
    expect(state.players.p1.bound[0]?.phraseSlot).toBe('core');
  });

  it('builds boost only into charge slot', () => {
    let state = advanceToBind(
      createGame({
        pack: V2_P100_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 5151,
      }),
    );

    const boostDef = V2_P100_PACK.elementCards.find((c) => c.cardType === 'boost');
    expect(boostDef).toBeTruthy();
    state = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [
            ...state.players.p1.hand,
            { instanceId: 'test-boost', defId: boostDef!.id },
          ],
        },
      },
    };

    state = applyAction(
      state,
      { type: 'BUILD_CARD', cardInstanceId: 'test-boost' },
      'p1',
      V2_CTX,
    );

    expect(state.players.p1.bound).toHaveLength(1);
    expect(state.players.p1.bound[0]?.phraseSlot).toBe('charge');
  });

  it('does not offer bind for attack or block in V2', () => {
    const state = advanceToBind(
      createGame({
        pack: V2_P100_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 6161,
      }),
    );

    const buildActions = getLegalActions(state, V2_CTX).filter((a) => a.type === 'BUILD_CARD');
    for (const action of buildActions) {
      if (action.type !== 'BUILD_CARD') continue;
      const card = state.players.p1.hand.find((c) => c.instanceId === action.cardInstanceId);
      expect(card).toBeTruthy();
      const element = findElementDef(V2_P100_PACK, card!.defId);
      expect(element?.cardType).not.toBe('attack');
      expect(element?.cardType).not.toBe('block');
    }
  });

  it('blocks a fourth phrase build when core, mode, tool are full', () => {
    const state = advanceToBind(
      createGame({
        pack: V2_P100_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 7171,
      }),
    );

    const partInHand = firstHandCardMatching(state, V2_P100_PACK, (defId) =>
      Boolean(findEnginePartDef(V2_P100_PACK, defId)),
    );
    expect(partInHand).toBeTruthy();

    const fullPhraseState = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          bound: [
            {
              instanceId: 'slot-core',
              defId: 'v2-part-fire-core-01',
              exhausted: false,
              resistanceBonus: 0,
              phraseSlot: 'core' as const,
            },
            {
              instanceId: 'slot-mode',
              defId: 'v2-part-water-mode-01',
              exhausted: false,
              resistanceBonus: 0,
              phraseSlot: 'mode' as const,
            },
            {
              instanceId: 'slot-tool',
              defId: 'v2-part-earth-tool-01',
              exhausted: false,
              resistanceBonus: 0,
              phraseSlot: 'tool' as const,
            },
          ],
        },
      },
    };

    const buildActions = getLegalActions(fullPhraseState, V2_CTX).filter(
      (a) => a.type === 'BUILD_CARD',
    );
    const freshPartBuilds = buildActions.filter((a) => {
      const card = fullPhraseState.players.p1.hand.find(
        (c) => c.instanceId === a.cardInstanceId,
      );
      return card && findEnginePartDef(V2_P100_PACK, card.defId) && !a.discardBoundId;
    });
    expect(freshPartBuilds).toHaveLength(0);
  });
});

describe('V2 phrase build — invariants', () => {
  it('accepts valid V2 bound layout', () => {
    let state = advanceToBind(
      createGame({
        pack: V2_P100_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 8181,
      }),
    );

    const partCard = firstHandCardMatching(state, V2_P100_PACK, (defId) =>
      Boolean(findEnginePartDef(V2_P100_PACK, defId)),
    );
    state = applyAction(
      state,
      { type: 'BUILD_CARD', cardInstanceId: partCard!.instanceId },
      'p1',
      V2_CTX,
    );

    expect(collectInvariantViolations(state, { pack: V2_P100_PACK })).toEqual([]);
  });
});

describe('V1 bind regression', () => {
  it('still binds element cards without phraseSlot', () => {
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 100,
    });
    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', V1_CTX);
    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p1', V1_CTX);

    const buildActions = getLegalActions(state, V1_CTX).filter((a) => a.type === 'BUILD_CARD');
    expect(buildActions.length).toBeGreaterThan(0);

    state = applyAction(state, buildActions[0], 'p1', V1_CTX);
    expect(state.players.p1.bound[0]?.phraseSlot).toBeUndefined();
    expect(collectInvariantViolations(state, { pack: BASE_PACK })).toEqual([]);
  });
});
