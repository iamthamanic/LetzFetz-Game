/**
 * Unit tests for V3 Ulti/Blueprint HUD surface builder.
 * Location: src/features/play/board/v3HookSurface.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame, V3_PACK } from '../../../game';
import { DOUBLE_REACTION_LIMIT } from '../../../game/engine/status/v3CombatHooks';
import { buildV3HookSurface } from './v3HookSurface';

function baseState() {
  return createGame({
    pack: V3_PACK,
    p1CharacterId: 'schluckspecht',
    p2CharacterId: 'knuspergnom',
    startingPlayer: 'p1',
    seed: 49,
  });
}

describe('buildV3HookSurface', () => {
  it('returns empty when no ulti and no hooks', () => {
    const state = baseState();
    state.players.p1.ultimateAvailable = false;
    expect(buildV3HookSurface(state, V3_PACK, 'p1')).toEqual([]);
  });

  it('surfaces Ulti bereit when ultimateAvailable', () => {
    const state = baseState();
    state.players.p1.ultimateAvailable = true;
    const chips = buildV3HookSurface(state, V3_PACK, 'p1');
    expect(chips.some((c) => c.id === 'ulti-ready' && c.labelDe === 'Ulti bereit')).toBe(true);
  });

  it('surfaces active combat hook meta as German chips', () => {
    const state = baseState();
    state.players.p1.ultimateAvailable = false;
    state.meta = {
      ...state.meta,
      v3CombatEnabled: true,
      v3ReactionLimitThisAction: DOUBLE_REACTION_LIMIT,
      v3DampfBecomesDichterNebel: true,
      v3PreserveFirstConsumedMark: true,
    };
    const ids = buildV3HookSurface(state, V3_PACK, 'p1').map((c) => c.id);
    expect(ids).toContain('double-reaction');
    expect(ids).toContain('dampf-dichter-nebel');
    expect(ids).toContain('mark-preserve');
  });

  it('surfaces Transformiert when player is in v3TransformedPlayers', () => {
    const state = baseState();
    state.players.p1.ultimateAvailable = false;
    state.meta = {
      ...state.meta,
      v3CombatEnabled: true,
      v3TransformedPlayers: ['p1'],
    };
    const chips = buildV3HookSurface(state, V3_PACK, 'p1');
    expect(chips.some((c) => c.id === 'transformed' && c.labelDe === 'Transformiert')).toBe(
      true,
    );
  });
});
