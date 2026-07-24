import { describe, expect, it } from 'vitest';
import { createGame, BASE_PACK } from '../../../game';
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

  it('hints build phase when build is legal', () => {
    const { state, view, pending, botThinking } = ctx({
      patch: (s) => ({ ...s, phase: 'build' }),
    });
    const hint = buildPhaseCoachHint({ state, view, pending, botThinking });
    expect(hint).toBe(
      'Tippe „Engine bauen“, um eine Karte in die Engine zu legen — oder „Skip Bau-Phase“.',
    );
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
          mode: 'player' as const,
          attackCardDefId: 'fire-attack-4',
          attackRoll: 3,
        },
      }),
    });
    const hint = buildPhaseCoachHint({ state, view, pending, botThinking });
    expect(hint).toContain('Blockiere den Angriff');
    expect(hint).toContain('Würfel erst danach');
  });

  it('hints mandatory hand discard during must-discard pending', () => {
    const { state, view, pending, botThinking } = ctx({
      patch: (s) => ({
        ...s,
        pendingChoice: { type: 'must-discard', playerId: 'p1', source: 'spaeti' },
      }),
    });
    const hint = buildPhaseCoachHint({ state, view, pending, botThinking });
    expect(hint).toContain('Wirf 1 Handkarte ab');
    expect(view.handCards.some((c) => c.interaction === 'discard-draw' && c.isPlayable)).toBe(true);
  });
});
