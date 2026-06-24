import { describe, expect, it } from 'vitest';
import { createGame, BASE_PACK } from '../../game';
import { buildGameViewModel } from './buildGameViewModel';
import { buildPhaseCoachHint } from './phaseCoachHint';

const pack = BASE_PACK;

function ctx(overrides: {
  pending?: null;
  botThinking?: boolean;
  patch?: (state: ReturnType<typeof createGame>) => ReturnType<typeof createGame>;
} = {}) {
  let state = createGame({
    pack,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'kokabell',
    startingPlayer: 'p1',
    seed: 42,
    arenaId: 'arena-spaeti',
  });
  if (overrides.patch) state = overrides.patch(state);
  const view = buildGameViewModel(state, pack, 'p1', overrides.pending ?? null);
  return {
    state,
    view,
    pending: overrides.pending ?? null,
    botThinking: overrides.botThinking ?? false,
  };
}

describe('buildPhaseCoachHint', () => {
  it('hints start phase on human turn', () => {
    const hint = buildPhaseCoachHint(ctx());
    expect(hint).toBe('Starte deinen Zug.');
  });

  it('hints bind phase when bind is legal', () => {
    const { state, view, pending, botThinking } = ctx({
      patch: (s) => ({ ...s, phase: 'bind' }),
    });
    const hint = buildPhaseCoachHint({ state, view, pending, botThinking });
    expect(hint).toBe('Binde eine Karte an einen Engine-Slot.');
  });

  it('hints bot thinking when not human turn', () => {
    const { state, view, pending } = ctx({
      patch: (s) => ({ ...s, activePlayer: 'p2', phase: 'draw' }),
    });
    const hint = buildPhaseCoachHint({
      state,
      view,
      pending,
      botThinking: true,
    });
    expect(hint).toBe('Gegner denkt…');
  });

  it('hints block window during combat defense', () => {
    const { state, view, pending, botThinking } = ctx({
      patch: (s) => ({
        ...s,
        activePlayer: 'p2',
        combat: {
          attackerId: 'p2',
          defenderId: 'p1',
          attackValue: 5,
          mode: 'attack' as const,
          attackCardInstanceId: 'x',
        },
      }),
    });
    const hint = buildPhaseCoachHint({ state, view, pending, botThinking });
    expect(hint).toContain('Blockiere den Angriff');
  });
});
