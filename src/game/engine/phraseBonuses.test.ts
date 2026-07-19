/**
 * Unit tests for V2 challenge, passives, and activate (issue #46).
 */
import { describe, expect, it } from 'vitest';
import type { ContentPack, EnginePartCardDef } from '../types';
import { createGame } from './createGame';
import { applyAction, getLegalActions } from './actions';
import { calculateCombatValue, challengeSucceeded } from './combat';
import { countPassiveBonus, challengeTargetResistance } from './phraseBonuses';
import { BASE_PACK } from '../packs/base-pack';
import { V2_P100_PACK } from '../packs/v2';

const V1_CTX = { pack: BASE_PACK, playerId: 'p1' as const };

const TEST_PARTS: EnginePartCardDef[] = [
  {
    id: 'test-part-atk',
    name: 'Test Kern',
    kind: 'enginePart',
    element: 'fire',
    preferredTag: 'core',
    resistance: 3,
    passiveArchetype: 'p_atk',
    activateArchetype: 'a_dmg',
  },
  {
    id: 'test-part-block',
    name: 'Test Werkzeug',
    kind: 'enginePart',
    element: 'earth',
    preferredTag: 'tool',
    resistance: 2,
    passiveArchetype: 'p_block',
    activateArchetype: 'a_exhaust',
  },
  {
    id: 'test-part-heal',
    name: 'Test Modus',
    kind: 'enginePart',
    element: 'water',
    preferredTag: 'mode',
    resistance: 4,
    passiveArchetype: 'p_draw',
    activateArchetype: 'a_heal',
  },
];

const TEST_V2_PACK: ContentPack = {
  ...V2_P100_PACK,
  engineParts: [...(V2_P100_PACK.engineParts ?? []), ...TEST_PARTS],
};

const TEST_CTX = { pack: TEST_V2_PACK, playerId: 'p1' as const };

function actionState(seed = 9001) {
  let state = createGame({
    pack: TEST_V2_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'schluckspecht',
    startingPlayer: 'p1',
    seed,
  });
  state.phase = 'action';
  state.activePlayer = 'p1';
  return state;
}

describe('phraseBonuses helpers', () => {
  it('uses printed resistance for engine parts', () => {
    expect(
      challengeTargetResistance(TEST_V2_PACK, {
        instanceId: 'b1',
        defId: 'test-part-atk',
        exhausted: false,
        resistanceBonus: 1,
        phraseSlot: 'core',
      }),
    ).toBe(4);
  });

  it('counts matching passives on phrase slots only', () => {
    const bound = [
      {
        instanceId: 'b1',
        defId: 'test-part-atk',
        exhausted: false,
        resistanceBonus: 0,
        phraseSlot: 'core' as const,
      },
      {
        instanceId: 'b2',
        defId: 'test-part-block',
        exhausted: false,
        resistanceBonus: 0,
        phraseSlot: 'tool' as const,
      },
      {
        instanceId: 'c1',
        defId: 'v2-fire-boost-1',
        exhausted: false,
        resistanceBonus: 0,
        phraseSlot: 'charge' as const,
      },
    ];
    expect(countPassiveBonus(TEST_V2_PACK, bound, 'p_atk')).toBe(1);
    expect(countPassiveBonus(TEST_V2_PACK, bound, 'p_block')).toBe(1);
  });
});

describe('V2 CHALLENGE', () => {
  it('does not offer challenge against charge slot', () => {
    const state = {
      ...actionState(),
      players: {
        ...actionState().players,
        p1: {
          ...actionState().players.p1,
          hand: [{ instanceId: 'atk', defId: 'v2-fire-attack-6-1' }],
        },
        p2: {
          ...actionState().players.p2,
          bound: [
            {
              instanceId: 'charge',
              defId: 'v2-fire-boost-1',
              exhausted: false,
              resistanceBonus: 0,
              phraseSlot: 'charge' as const,
            },
          ],
        },
      },
    };

    const challenges = getLegalActions(state, TEST_CTX).filter((a) => a.type === 'CHALLENGE');
    expect(challenges).toHaveLength(0);
  });

  it('destroys engine part using printed resistance', () => {
    let state = actionState();
    state.players.p1.hand = [{ instanceId: 'atk', defId: 'v2-fire-attack-4-1' }];
    state.players.p2.bound = [
      {
        instanceId: 'target',
        defId: 'test-part-atk',
        exhausted: false,
        resistanceBonus: 0,
        phraseSlot: 'core',
      },
    ];

    state = applyAction(
      state,
      {
        type: 'CHALLENGE',
        attackCardInstanceId: 'atk',
        targetBoundInstanceId: 'target',
        diceRoll: 6,
      },
      'p1',
      TEST_CTX,
    );
    state = applyAction(state, { type: 'PASS_BLOCK' }, 'p2', {
      pack: TEST_V2_PACK,
      playerId: 'p2',
    });

    expect(state.players.p2.bound).toHaveLength(0);
    expect(state.lastEvent).toContain('Test Kern');
  });

  it('fails when attack does not exceed printed resistance', () => {
    let state = actionState();
    state.players.p1.hand = [{ instanceId: 'atk', defId: 'v2-fire-attack-2-1' }];
    state.players.p2.bound = [
      {
        instanceId: 'target',
        defId: 'test-part-heal',
        exhausted: false,
        resistanceBonus: 0,
        phraseSlot: 'mode',
      },
    ];

    state = applyAction(
      state,
      {
        type: 'CHALLENGE',
        attackCardInstanceId: 'atk',
        targetBoundInstanceId: 'target',
        diceRoll: 1,
      },
      'p1',
      TEST_CTX,
    );
    state = applyAction(state, { type: 'PASS_BLOCK' }, 'p2', {
      pack: TEST_V2_PACK,
      playerId: 'p2',
    });

    expect(state.players.p2.bound).toHaveLength(1);
    expect(state.lastEvent).toContain('fehlgeschlagen');
  });
});

describe('V2 passives in combat', () => {
  it('p_atk adds +1 to attack value when built', () => {
    const state = actionState();
    const withPassive = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          bound: [
            {
              instanceId: 'b1',
              defId: 'test-part-atk',
              exhausted: false,
              resistanceBonus: 0,
              phraseSlot: 'core' as const,
            },
          ],
        },
      },
    };

    const attackDef = TEST_V2_PACK.elementCards.find((c) => c.id === 'v2-fire-attack-4-1')!;
    const base = calculateCombatValue({
      cardValue: attackDef.value,
      diceRoll: 3,
      diceBonus: 1,
      characterElements: ['fire', 'earth'],
      cardElement: 'fire',
    });
    const boosted = calculateCombatValue({
      cardValue: attackDef.value,
      diceRoll: 3,
      diceBonus: 1,
      characterElements: ['fire', 'earth'],
      cardElement: 'fire',
      extraBonus: countPassiveBonus(TEST_V2_PACK, withPassive.players.p1.bound, 'p_atk'),
    });
    expect(boosted - base).toBe(1);
  });

  it('p_block adds +1 to block value when built', () => {
    const bound = [
      {
        instanceId: 'b1',
        defId: 'test-part-block',
        exhausted: false,
        resistanceBonus: 0,
        phraseSlot: 'tool' as const,
      },
    ];
    const blockDef = TEST_V2_PACK.elementCards.find((c) => c.cardType === 'block' && c.value === 2)!;
    const base = calculateCombatValue({
      cardValue: blockDef.value,
      diceRoll: 3,
      diceBonus: 1,
      characterElements: ['fire', 'earth'],
      cardElement: blockDef.element,
      attackElement: 'fire',
      blockElement: blockDef.element,
    });
    const boosted = calculateCombatValue({
      cardValue: blockDef.value,
      diceRoll: 3,
      diceBonus: 1,
      characterElements: ['fire', 'earth'],
      cardElement: blockDef.element,
      attackElement: 'fire',
      blockElement: blockDef.element,
      extraBonus: countPassiveBonus(TEST_V2_PACK, bound, 'p_block'),
    });
    expect(boosted - base).toBe(1);
  });
});

describe('V2 ACTIVATE_BOUND', () => {
  function activatePart(
    partId: string,
    boundId: string,
    handDiscardId: string,
    playerId: 'p1' | 'p2' = 'p1',
  ) {
    let state = actionState();
    state.players[playerId].bound = [
      {
        instanceId: boundId,
        defId: partId,
        exhausted: false,
        resistanceBonus: 0,
        phraseSlot: 'core',
      },
    ];
    state.players[playerId].hand = [
      { instanceId: handDiscardId, defId: 'v2-fire-attack-2-1' },
      { instanceId: 'extra', defId: 'v2-water-attack-2-1' },
    ];
    state = applyAction(
      state,
      {
        type: 'ACTIVATE_BOUND',
        boundInstanceId: boundId,
        discardHandInstanceId: handDiscardId,
      },
      playerId,
      { pack: TEST_V2_PACK, playerId },
    );
    return state;
  }

  it('a_dmg deals 2 damage and exhausts part', () => {
    const state = activatePart('test-part-atk', 'my-part', 'discard-1');
    expect(state.players.p2.hp).toBe(18);
    expect(state.players.p1.bound[0]?.exhausted).toBe(true);
    expect(state.phase).toBe('end');
  });

  it('a_heal restores 2 life and exhausts part', () => {
    let state = actionState();
    state.players.p1.hp = 10;
    state.players.p1.bound = [
      {
        instanceId: 'heal-part',
        defId: 'test-part-heal',
        exhausted: false,
        resistanceBonus: 0,
        phraseSlot: 'mode',
      },
    ];
    state.players.p1.hand = [
      { instanceId: 'discard-1', defId: 'v2-fire-attack-2-1' },
    ];
    state = applyAction(
      state,
      {
        type: 'ACTIVATE_BOUND',
        boundInstanceId: 'heal-part',
        discardHandInstanceId: 'discard-1',
      },
      'p1',
      TEST_CTX,
    );
    expect(state.players.p1.hp).toBe(12);
    expect(state.players.p1.bound[0]?.exhausted).toBe(true);
  });

  it('a_exhaust exhausts one opponent phrase part', () => {
    let state = actionState();
    state.players.p1.bound = [
      {
        instanceId: 'my-part',
        defId: 'test-part-block',
        exhausted: false,
        resistanceBonus: 0,
        phraseSlot: 'tool',
      },
    ];
    state.players.p1.hand = [{ instanceId: 'discard-1', defId: 'v2-fire-attack-2-1' }];
    state.players.p2.bound = [
      {
        instanceId: 'opp-part',
        defId: 'test-part-atk',
        exhausted: false,
        resistanceBonus: 0,
        phraseSlot: 'core',
      },
    ];
    state = applyAction(
      state,
      {
        type: 'ACTIVATE_BOUND',
        boundInstanceId: 'my-part',
        discardHandInstanceId: 'discard-1',
      },
      'p1',
      { pack: TEST_V2_PACK, playerId: 'p1' },
    );
    expect(state.players.p1.bound[0]?.exhausted).toBe(true);
    expect(state.players.p2.bound[0]?.exhausted).toBe(true);
  });

  it('rejects activate on exhausted part', () => {
    let state = actionState();
    state.players.p1.bound = [
      {
        instanceId: 'my-part',
        defId: 'test-part-atk',
        exhausted: true,
        resistanceBonus: 0,
        phraseSlot: 'core',
      },
    ];
    state.players.p1.hand = [{ instanceId: 'discard-1', defId: 'v2-fire-attack-2-1' }];
    expect(() =>
      applyAction(
        state,
        {
          type: 'ACTIVATE_BOUND',
          boundInstanceId: 'my-part',
          discardHandInstanceId: 'discard-1',
        },
        'p1',
        TEST_CTX,
      ),
    ).toThrow(/Cannot activate/);
  });
});

describe('V1 activate regression', () => {
  it('still uses element bound activation path', () => {
    let state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 500,
    });
    state.phase = 'action';
    state.activePlayer = 'p1';
    state.players.p1.bound = [
      {
        instanceId: 'bound-fire',
        defId: 'fire-boost-3',
        exhausted: false,
        resistanceBonus: 0,
      },
    ];
    state.players.p1.hand = [
      { instanceId: 'discard-1', defId: 'fire-attack-2' },
      { instanceId: 'discard-2', defId: 'water-attack-2' },
    ];
    const hpBefore = state.players.p2.hp;
    state = applyAction(
      state,
      {
        type: 'ACTIVATE_BOUND',
        boundInstanceId: 'bound-fire',
        discardHandInstanceId: 'discard-1',
      },
      'p1',
      V1_CTX,
    );
    expect(state.players.p2.hp).toBe(hpBefore - 2);
    expect(state.players.p1.bound[0]?.exhausted).toBe(true);
  });

  it('V1 challenge still uses element card value as resistance', () => {
    expect(
      challengeSucceeded(6, challengeTargetResistance(BASE_PACK, {
        instanceId: 'b1',
        defId: 'water-block-2',
        exhausted: false,
        resistanceBonus: 0,
      }), 0, 1),
    ).toBe(true);
  });
});
