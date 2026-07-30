/**
 * V5 §19 mono + Dampf outcome smoke (#283).
 * Location: src/game/engine/status/reactionOutcomes.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { V3_PACK, V3_PACK_RULESET as V3_RULESET } from '../../packs/v3/v3-pack';
import { applyStatus, getStatus } from './applyStatus';
import { resolveImpulseReactions } from './reactionChoice';
import { REACTION_LABEL_DE } from './reactions';

function base() {
  return createGame({
    pack: V3_PACK,
    p1CharacterId: V3_PACK.characters[0].id,
    p2CharacterId: V3_PACK.characters[1].id,
    startingPlayer: 'p1',
    seed: 7,
    ruleset: V3_RULESET,
  });
}

describe('V5 §19 mono + Dampf outcomes', () => {
  it('Überhitzt: 1 ignore-shield damage + Brennen', () => {
    let state = base();
    const hp = state.players.p2.hp;
    state = applyStatus(state, 'p2', 'brennen', 3);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1', V3_PACK);
    expect(getStatus(state, 'p2', 'brennen')?.stacks).toBe(1);
    expect(state.players.p2.hp).toBe(hp - 1);
    expect(state.lastEvent).toContain(REACTION_LABEL_DE.inferno);
  });

  it('Überflutet: Durchnässt + Wasser → strip shield or ueberflutet', () => {
    let state = base();
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = resolveImpulseReactions(state, 'p2', 'water', V3_RULESET, 'p1', V3_PACK);
    expect(getStatus(state, 'p2', 'durchnaesst')).toBeUndefined();
    expect(getStatus(state, 'p2', 'ueberflutet')).toBeTruthy();
  });

  it('Versteinert: High mark → High again when no formula to disturb', () => {
    let state = base();
    state = applyStatus(state, 'p2', 'high', 1);
    state = resolveImpulseReactions(state, 'p2', 'earth', V3_RULESET, 'p1', V3_PACK);
    expect(getStatus(state, 'p2', 'high')?.stacks).toBe(1);
  });

  it('Tornado: re-applies Verwirbelt + Nebel', () => {
    let state = base();
    state = applyStatus(state, 'p2', 'aufgewirbelt', 1);
    state = resolveImpulseReactions(state, 'p2', 'air', V3_RULESET, 'p1', V3_PACK);
    expect(getStatus(state, 'p2', 'aufgewirbelt')?.stacks).toBe(1);
    expect(getStatus(state, 'p2', 'nebel')).toBeTruthy();
  });

  it('Geblendet (Licht+Licht): applies geblendet status', () => {
    let state = base();
    state = applyStatus(state, 'p2', 'erleuchtet', 1);
    state = resolveImpulseReactions(state, 'p2', 'light', V3_RULESET, 'p1', V3_PACK);
    expect(getStatus(state, 'p2', 'erleuchtet')).toBeUndefined();
    expect(getStatus(state, 'p2', 'geblendet')).toBeTruthy();
  });

  it('Verdorben: discards a hand card when available', () => {
    let state = base();
    state = {
      ...state,
      players: {
        ...state.players,
        p2: {
          ...state.players.p2,
          hand: [...state.players.p2.hand, { instanceId: 'x', defId: 'fire-attack-2' }],
        },
      },
    };
    const handBefore = state.players.p2.hand.length;
    state = applyStatus(state, 'p2', 'verflucht', 1);
    state = resolveImpulseReactions(state, 'p2', 'shadow', V3_RULESET, 'p1', V3_PACK);
    expect(getStatus(state, 'p2', 'verflucht')).toBeUndefined();
    expect(state.players.p2.hand.length).toBe(handBefore - 1);
  });

  it('Dampf: Durchnässt + Feuer → Nebel, no Brennen', () => {
    let state = base();
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1', V3_PACK);
    expect(getStatus(state, 'p2', 'durchnaesst')).toBeUndefined();
    expect(getStatus(state, 'p2', 'nebel')).toBeTruthy();
    expect(getStatus(state, 'p2', 'brennen')).toBeUndefined();
  });
});
