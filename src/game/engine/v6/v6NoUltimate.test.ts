/**
 * V6: no PLAY_ULTIMATE under v6Formula (#333).
 * Location: src/game/engine/v6/v6NoUltimate.test.ts
 */
import { describe, expect, it } from 'vitest';
import { applyAction, getLegalActions } from '../actions';
import { createGame } from '../createGame';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';

describe('V6 no character ultimates', () => {
  it('does not offer PLAY_ULTIMATE and rejects apply', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 42,
      startingPlayer: 'p1',
    });
    state = {
      ...state,
      phase: 'action',
      players: {
        ...state.players,
        p1: { ...state.players.p1, ultimateAvailable: true, fetzCharge: 3 },
      },
    };
    const ctx = { pack: V6_CORE_PACK, playerId: 'p1' as const, ruleset: V6_PACK_RULESET };
    expect(getLegalActions(state, ctx).some((a) => a.type === 'PLAY_ULTIMATE')).toBe(false);
    expect(() => applyAction(state, { type: 'PLAY_ULTIMATE' }, 'p1', ctx)).toThrow(/v6Formula/);
  });
});
