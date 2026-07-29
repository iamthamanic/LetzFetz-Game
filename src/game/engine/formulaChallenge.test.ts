/**
 * Unit tests for V5 formula challenge disturb/destroy + start restore (#222).
 * Location: src/game/engine/formulaChallenge.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from './createGame';
import { applyAction, getLegalActions } from './actions';
import {
  formulaChallengeOutcome,
  formulaComponentStability,
  restoreOwnerFormulaAtStart,
} from './formulaChallenge';
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
  stability: 4,
  effectText: 'Test katalysator',
};

const V5_PACK: ContentPack = {
  ...BASE_PACK,
  id: 'v5-challenge-test',
  name: 'V5 Challenge Test Pack',
  techniques: [TECH],
  essences: [ESS],
  catalysts: [CAT],
};

const V5_CTX = {
  pack: V5_PACK,
  playerId: 'p1' as const,
  ruleset: V5_RULESET,
};

function v5Game(): GameState {
  return createGame({
    pack: V5_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'schluckspecht',
    startingPlayer: 'p1',
    seed: 42,
    ruleset: V5_RULESET,
  });
}

describe('formulaChallengeOutcome (§24.2)', () => {
  it('returns none when attack ≤ defense', () => {
    expect(formulaChallengeOutcome(5, 5, false)).toBe('none');
    expect(formulaChallengeOutcome(4, 5, false)).toBe('none');
  });

  it('disturbs on +1–2 margin', () => {
    expect(formulaChallengeOutcome(6, 5, false)).toBe('disturb');
    expect(formulaChallengeOutcome(7, 5, false)).toBe('disturb');
  });

  it('destroys on +3 or more', () => {
    expect(formulaChallengeOutcome(8, 5, false)).toBe('destroy');
    expect(formulaChallengeOutcome(12, 5, false)).toBe('destroy');
  });

  it('destroys already-disturbed when attack is higher', () => {
    expect(formulaChallengeOutcome(6, 5, true)).toBe('destroy');
    expect(formulaChallengeOutcome(5, 5, true)).toBe('none');
  });
});

describe('formulaComponentStability', () => {
  it('adds stabilityBonus to printed stability', () => {
    expect(
      formulaComponentStability(V5_PACK, {
        instanceId: 'x',
        defId: 'test-technik',
        slot: 'technik',
        exhausted: false,
        disturbed: false,
        stabilityBonus: -1,
      }),
    ).toBe(2);
  });
});

describe('restoreOwnerFormulaAtStart', () => {
  it('clears disturbed, exhausted, and stabilityBonus', () => {
    const restored = restoreOwnerFormulaAtStart({
      technik: {
        instanceId: 't1',
        defId: 'test-technik',
        slot: 'technik',
        exhausted: true,
        disturbed: true,
        stabilityBonus: -1,
      },
      essenz: null,
      katalysator: {
        instanceId: 'k1',
        defId: 'test-katalysator',
        slot: 'katalysator',
        exhausted: true,
        disturbed: false,
        stabilityBonus: 2,
      },
    });
    expect(restored.technik).toMatchObject({
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    });
    expect(restored.katalysator).toMatchObject({
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    });
  });
});

describe('V5 CHALLENGE integration', () => {
  it('offers challenges against formula components, not empty bound', () => {
    let state = v5Game();
    state.phase = 'action';
    state.activePlayer = 'p1';
    state.players.p2.bound = [];
    state.players.p2.formula = {
      technik: {
        instanceId: 'ft-1',
        defId: 'test-technik',
        slot: 'technik',
        exhausted: false,
        disturbed: false,
        stabilityBonus: 0,
      },
      essenz: null,
      katalysator: null,
    };
    state.players.p1.hand = [{ instanceId: 'atk', defId: 'fire-attack-4' }];

    const challenges = getLegalActions(state, V5_CTX).filter((a) => a.type === 'CHALLENGE');
    expect(challenges).toEqual([
      {
        type: 'CHALLENGE',
        attackCardInstanceId: 'atk',
        targetBoundInstanceId: 'ft-1',
      },
    ]);
  });

  it('offers no challenges when opponent formula is empty', () => {
    let state = v5Game();
    state.phase = 'action';
    state.activePlayer = 'p1';
    state.players.p2.bound = [];
    state.players.p2.formula = { technik: null, essenz: null, katalysator: null };
    state.players.p1.hand = [{ instanceId: 'atk', defId: 'fire-attack-6' }];

    const challenges = getLegalActions(state, V5_CTX).filter((a) => a.type === 'CHALLENGE');
    expect(challenges).toHaveLength(0);
  });

  it('disturbs technik (stability 3) when margin is +1–2', () => {
    let state = v5Game();
    state.phase = 'action';
    state.activePlayer = 'p1';
    state.players.p2.formula = {
      technik: {
        instanceId: 'ft-1',
        defId: 'test-technik',
        slot: 'technik',
        exhausted: false,
        disturbed: false,
        stabilityBonus: 0,
      },
      essenz: null,
      katalysator: null,
    };
    // water-attack-2: knuspergnom has no water → no affinity. roll 3 → +1 → total 3. vs 3 = none.
    // roll 4 → +1 → total 3. Still 3.
    // water-attack-4 + roll 1–2 (+0) = 4 → diff 1 disturb.
    state.players.p1.hand = [{ instanceId: 'atk', defId: 'water-attack-4' }];
    const hpBefore = state.players.p2.hp;

    state = applyAction(
      state,
      {
        type: 'CHALLENGE',
        attackCardInstanceId: 'atk',
        targetBoundInstanceId: 'ft-1',
        diceRoll: 1,
      },
      'p1',
      V5_CTX,
    );
    expect(state.combat?.mode).toBe('challenge');
    state = applyAction(state, { type: 'PASS_BLOCK' }, 'p2', {
      pack: V5_PACK,
      playerId: 'p2',
      ruleset: V5_RULESET,
    });

    expect(state.players.p2.formula.technik?.disturbed).toBe(true);
    expect(state.players.p2.formula.technik?.instanceId).toBe('ft-1');
    expect(state.players.p2.hp).toBe(hpBefore);
    expect(state.combat).toBeNull();
  });

  it('destroys on +3 margin', () => {
    let state = v5Game();
    state.phase = 'action';
    state.activePlayer = 'p1';
    state.players.p2.formula = {
      essenz: {
        instanceId: 'fe-1',
        defId: 'test-essenz',
        slot: 'essenz',
        exhausted: false,
        disturbed: false,
        stabilityBonus: 0,
      },
      technik: null,
      katalysator: null,
    };
    // essenz stability 2. water-attack-4 + roll 6 (+2) = 6 → diff 4 destroy. No fire affinity.
    state.players.p1.hand = [{ instanceId: 'atk', defId: 'water-attack-4' }];
    const discardBefore = state.piles.discard.length;

    state = applyAction(
      state,
      {
        type: 'CHALLENGE',
        attackCardInstanceId: 'atk',
        targetBoundInstanceId: 'fe-1',
        diceRoll: 6,
      },
      'p1',
      V5_CTX,
    );
    state = applyAction(state, { type: 'PASS_BLOCK' }, 'p2', {
      pack: V5_PACK,
      playerId: 'p2',
      ruleset: V5_RULESET,
    });

    expect(state.players.p2.formula.essenz).toBeNull();
    expect(state.piles.discard.length).toBe(discardBefore + 2); // attack discarded + component
    expect(state.piles.discard.some((c) => c.instanceId === 'fe-1')).toBe(true);
  });

  it('destroys already-disturbed when attack is higher', () => {
    let state = v5Game();
    state.phase = 'action';
    state.activePlayer = 'p1';
    state.players.p2.formula = {
      technik: {
        instanceId: 'ft-1',
        defId: 'test-technik',
        slot: 'technik',
        exhausted: false,
        disturbed: true,
        stabilityBonus: 0,
      },
      essenz: null,
      katalysator: null,
    };
    // water-attack-4 + roll 1 = 4 vs 3 → destroy because already disturbed
    state.players.p1.hand = [{ instanceId: 'atk', defId: 'water-attack-4' }];

    state = applyAction(
      state,
      {
        type: 'CHALLENGE',
        attackCardInstanceId: 'atk',
        targetBoundInstanceId: 'ft-1',
        diceRoll: 1,
      },
      'p1',
      V5_CTX,
    );
    state = applyAction(state, { type: 'PASS_BLOCK' }, 'p2', {
      pack: V5_PACK,
      playerId: 'p2',
      ruleset: V5_RULESET,
    });

    expect(state.players.p2.formula.technik).toBeNull();
  });

  it('restores disturbed components on owner start phase', () => {
    let state = v5Game();
    state.activePlayer = 'p2';
    state.phase = 'start';
    state.players.p2.formula = {
      technik: {
        instanceId: 'ft-1',
        defId: 'test-technik',
        slot: 'technik',
        exhausted: true,
        disturbed: true,
        stabilityBonus: -1,
      },
      essenz: null,
      katalysator: null,
    };

    state = applyAction(state, { type: 'ADVANCE_PHASE' }, 'p2', {
      pack: V5_PACK,
      playerId: 'p2',
      ruleset: V5_RULESET,
    });

    expect(state.players.p2.formula.technik).toMatchObject({
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    });
  });
});
