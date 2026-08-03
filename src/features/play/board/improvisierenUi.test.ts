/**
 * UI helpers for V6 Improvisieren (#374).
 * Location: src/features/play/board/improvisierenUi.test.ts
 */
import { describe, expect, it } from 'vitest';
import { applyAction, createGame, V6_CORE_PACK, V6_PACK_RULESET } from '../../../game';
import { actionPhaseLegalFlags } from './ActionPhaseBar';
import { buildGameViewModel } from './buildGameViewModel';
import { buildPhaseCoachHint } from './phaseCoachHint';
import { getLegalActions } from '../../../game';

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

describe('Improvisieren UI (#374)', () => {
  it('actionPhaseLegalFlags.canImprovise when DISCARD_DRAW is legal', () => {
    const state = advanceToAction();
    const legal = getLegalActions(state, { pack, playerId: 'p1', ruleset: V6_PACK_RULESET });
    expect(actionPhaseLegalFlags(legal).canImprovise).toBe(true);
  });

  it('improvise pending overrides attack/boost to discard-draw and marks playable', () => {
    const state = advanceToAction();
    const viewIdle = buildGameViewModel(state, pack, 'p1', null);
    expect(viewIdle.handCards.some((c) => c.interaction === 'attack' || c.interaction === 'boost')).toBe(
      true,
    );
    expect(viewIdle.handCards.every((c) => !c.isPlayable || c.interaction === 'discard-draw')).toBe(true);

    const viewImprovise = buildGameViewModel(state, pack, 'p1', { type: 'improvise' });
    expect(viewImprovise.handCards.every((c) => c.interaction === 'discard-draw')).toBe(true);
    expect(viewImprovise.handCards.every((c) => c.isPlayable)).toBe(true);

    const hint = buildPhaseCoachHint({
      state,
      view: viewImprovise,
      pending: { type: 'improvise' },
      botThinking: false,
    });
    expect(hint).toContain('Improvisieren');
  });

  it('action-phase coach mentions Improvisieren when DISCARD_DRAW is legal', () => {
    const state = advanceToAction();
    const view = buildGameViewModel(state, pack, 'p1', null);
    const hint = buildPhaseCoachHint({
      state,
      view,
      pending: null,
      botThinking: false,
    });
    expect(hint).toContain('Improvisieren');
  });
});
