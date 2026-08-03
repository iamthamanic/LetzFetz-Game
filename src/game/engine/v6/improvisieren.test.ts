/**
 * V6 Improvisieren (#374): DISCARD_DRAW under v6Formula.
 * Location: src/game/engine/v6/improvisieren.test.ts
 */
import { describe, expect, it } from 'vitest';
import { applyAction, getLegalActions } from '../actions';
import { createGame } from '../createGame';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';

const pack = V6_CORE_PACK;
const p1 = pack.characters[0].id;
const p2 = pack.characters[1]?.id ?? p1;

function advanceToAction() {
  let state = createGame({
    pack,
    p1CharacterId: p1,
    p2CharacterId: p2,
    ruleset: V6_PACK_RULESET,
    startingPlayer: 'p1',
    seed: 374,
  });
  while (state.phase !== 'action' && !state.winner) {
    const pid = state.activePlayer;
    const act =
      state.phase === 'build' ? ({ type: 'SKIP_BUILD' } as const) : ({ type: 'ADVANCE_PHASE' } as const);
    state = applyAction(state, act, pid, { pack, playerId: pid, ruleset: V6_PACK_RULESET });
  }
  return state;
}

describe('V6 Improvisieren (DISCARD_DRAW)', () => {
  it('lists DISCARD_DRAW for each hand card in action phase under v6Formula', () => {
    const state = advanceToAction();
    expect(state.phase).toBe('action');
    const legal = getLegalActions(state, { pack, playerId: 'p1', ruleset: V6_PACK_RULESET });
    const discardDraws = legal.filter((a) => a.type === 'DISCARD_DRAW');
    expect(discardDraws.length).toBe(state.players.p1.hand.length);
    expect(discardDraws.length).toBeGreaterThan(0);
  });

  it('discards 1, draws 2, ends main action, and labels lastEvent Improvisieren', () => {
    let state = advanceToAction();
    const handBefore = state.players.p1.hand.length;
    const discardId = state.players.p1.hand[0].instanceId;
    state = applyAction(
      state,
      { type: 'DISCARD_DRAW', discardInstanceId: discardId },
      'p1',
      { pack, playerId: 'p1', ruleset: V6_PACK_RULESET },
    );
    expect(state.players.p1.hand.length).toBe(handBefore - 1 + 2);
    expect(state.phase).toBe('end');
    expect(state.lastEvent).toBe('Improvisieren: 1 Karte abgeworfen, 2 gezogen.');
  });
});
