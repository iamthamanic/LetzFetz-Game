/**
 * V6 Slice-1 match lifecycle tests (#320).
 * Location: src/game/engine/v6/v6MatchLifecycle.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { applyAction } from '../actions';
import { restoreOwnerFormulaAtStartV6 } from '../formulaChallenge';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';
import { V5_PACK } from '../../packs/v5';
import { V5_RULESET } from '../../types';
import type { FormulaComponentInstance } from '../../types';

describe('V6 match lifecycle', () => {
  it('opening draw 7 then keep 5 (start) / 6 (second); remainder back in deck', () => {
    const state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      startingPlayer: 'p1',
      seed: 42,
    });
    expect(V6_PACK_RULESET.openingDrawCount).toBe(7);
    expect(state.players.p1.hand).toHaveLength(5);
    expect(state.players.p2.hand).toHaveLength(6);
    expect(state.players.p1.hp).toBe(30);
    expect(state.meta.v6FormulaEnabled).toBe(true);
  });

  it('V5 opening unchanged (draw = keep counts)', () => {
    const state = createGame({
      pack: V5_PACK,
      p1CharacterId: V5_PACK.characters[0].id,
      p2CharacterId: V5_PACK.characters[1]?.id ?? V5_PACK.characters[0].id,
      ruleset: V5_RULESET,
      startingPlayer: 'p1',
      seed: 42,
    });
    expect(state.players.p1.hand).toHaveLength(V5_RULESET.p1StartingHand);
    expect(state.players.p2.hand).toHaveLength(V5_RULESET.p2SecondHand);
  });

  it('start phase uprights Technik/Essenz only — catalyst stays exhausted', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      startingPlayer: 'p1',
      seed: 1,
    });
    const mk = (
      slot: 'technik' | 'essenz' | 'katalysator',
      defId: string,
      exhausted: boolean,
    ): FormulaComponentInstance => ({
      instanceId: `${slot}-1`,
      defId,
      slot,
      exhausted,
      disturbed: true,
      stabilityBonus: 1,
    });
    state = {
      ...state,
      phase: 'start',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          formula: {
            technik: mk('technik', 'v6-technik-impulsgeschoss', true),
            essenz: mk('essenz', 'v6-essenz-feuer', true),
            katalysator: mk('katalysator', 'v6-katalysator-verdichtung', true),
          },
        },
      },
    };

    const restored = restoreOwnerFormulaAtStartV6(state.players.p1.formula);
    expect(restored.technik?.exhausted).toBe(false);
    expect(restored.essenz?.exhausted).toBe(false);
    expect(restored.katalysator?.exhausted).toBe(true);

    const next = applyAction(
      state,
      { type: 'ADVANCE_PHASE' },
      'p1',
      { pack: V6_CORE_PACK, ruleset: V6_PACK_RULESET, rng: () => 0.5, playerId: 'p1' },
    );
    expect(next.phase).toBe('draw');
    expect(next.players.p1.formula.technik?.exhausted).toBe(false);
    expect(next.players.p1.formula.essenz?.exhausted).toBe(false);
    expect(next.players.p1.formula.katalysator?.exhausted).toBe(true);
  });
});
