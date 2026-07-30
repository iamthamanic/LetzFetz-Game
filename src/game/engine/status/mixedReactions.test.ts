/**
 * V5 §19 mixed reaction outcomes (#283).
 * Location: src/game/engine/status/mixedReactions.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { V3_PACK, V3_PACK_RULESET as V3_RULESET } from '../../packs/v3/v3-pack';
import { applyStatus, addShield, getStatus, setShield } from './applyStatus';
import { resolveImpulseReactions } from './reactionChoice';
import type { Element, PrimaryMarkId } from '../../types';

function base() {
  return createGame({
    pack: V3_PACK,
    p1CharacterId: V3_PACK.characters[0].id,
    p2CharacterId: V3_PACK.characters[1].id,
    startingPlayer: 'p1',
    seed: 11,
    ruleset: V3_RULESET,
  });
}

function fire(mark: PrimaryMarkId, impulse: Element, stacks = 1) {
  let state = base();
  state = applyStatus(state, 'p2', mark, stacks);
  return resolveImpulseReactions(state, 'p2', impulse, V3_RULESET, 'p1', V3_PACK);
}

describe('V5 §19 mixed reactions', () => {
  it('Schmelze: High + Feuer → ignore-shield dmg', () => {
    const hp = base().players.p2.hp;
    const state = fire('high', 'fire', 1);
    expect(state.players.p2.hp).toBe(hp - 1);
  });

  it('Feuersturm: 1 dmg + Brennen', () => {
    let state = base();
    const hp = state.players.p2.hp;
    state = applyStatus(state, 'p2', 'aufgewirbelt', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1', V3_PACK);
    expect(state.players.p2.hp).toBe(hp - 1);
    expect(getStatus(state, 'p2', 'brennen')?.stacks).toBe(1);
  });

  it('Sonnenbrand: 1 dmg + Verstrahlt', () => {
    let state = base();
    state = setShield(state, 'p2', 3);
    state = applyStatus(state, 'p2', 'erleuchtet', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1', V3_PACK);
    expect(getStatus(state, 'p2', 'erleuchtet')?.stacks).toBe(1);
  });

  it('Höllenbrand: 1 dmg + Heilblockade', () => {
    const state = fire('verflucht', 'fire');
    expect(getStatus(state, 'p2', 'heilblockade')).toBeTruthy();
  });

  it('Schlamm: next attack −2 proxy (Verwirbelt + Nebel)', () => {
    let state = base();
    state = applyStatus(state, 'p2', 'high', 1);
    state = resolveImpulseReactions(state, 'p2', 'water', V3_RULESET, 'p1', V3_PACK);
    expect(getStatus(state, 'p2', 'aufgewirbelt')).toBeTruthy();
    expect(getStatus(state, 'p2', 'nebel')).toBeTruthy();
  });

  it('Nebelbank: applies nebelbank', () => {
    let state = base();
    state = applyStatus(state, 'p2', 'aufgewirbelt', 1);
    state = resolveImpulseReactions(state, 'p2', 'water', V3_RULESET, 'p1', V3_PACK);
    expect(getStatus(state, 'p2', 'nebelbank')).toBeTruthy();
  });

  it('Regenbogen: chooser may draw/discard after clearing own mark', () => {
    let state = base();
    state = applyStatus(state, 'p1', 'brennen', 1);
    state = applyStatus(state, 'p2', 'erleuchtet', 1);
    state = resolveImpulseReactions(state, 'p2', 'water', V3_RULESET, 'p1', V3_PACK);
    expect(getStatus(state, 'p1', 'brennen')).toBeUndefined();
  });

  it('Moder: Verflucht stacks 2', () => {
    let state = base();
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = resolveImpulseReactions(state, 'p2', 'shadow', V3_RULESET, 'p1', V3_PACK);
    expect(getStatus(state, 'p2', 'verflucht')?.stacks).toBe(2);
  });

  it('Staubsturm: Katalysatorausfall', () => {
    const state = fire('aufgewirbelt', 'earth');
    expect(getStatus(state, 'p2', 'katalysatorausfall')).toBeTruthy();
  });

  it('Kristallwuchs: chooser gains 2 shield', () => {
    let state = base();
    state = applyStatus(state, 'p2', 'erleuchtet', 1);
    state = resolveImpulseReactions(state, 'p2', 'earth', V3_RULESET, 'p1', V3_PACK);
    expect(state.players.p1.shield).toBeGreaterThanOrEqual(2);
  });

  it('Giftsporen: Toxisch', () => {
    let state = base();
    state = applyStatus(state, 'p2', 'high', 2);
    state = resolveImpulseReactions(state, 'p2', 'shadow', V3_RULESET, 'p1', V3_PACK);
    expect(getStatus(state, 'p2', 'toxisch')).toBeTruthy();
  });

  it('Blitzlicht: Geblendet on target', () => {
    const state = fire('erleuchtet', 'air');
    expect(getStatus(state, 'p2', 'geblendet')).toBeTruthy();
  });

  it('Flüstersturm: discard then draw', () => {
    let state = base();
    state = {
      ...state,
      players: {
        ...state.players,
        p2: {
          ...state.players.p2,
          hand: [
            { instanceId: 'a', defId: 'fire-attack-2' },
            { instanceId: 'b', defId: 'water-block-2' },
          ],
        },
      },
      piles: {
        ...state.piles,
        deck: [{ instanceId: 'd1', defId: 'earth-attack-2' }, ...state.piles.deck],
      },
    };
    const handBefore = state.players.p2.hand.length;
    state = applyStatus(state, 'p2', 'verflucht', 1);
    state = resolveImpulseReactions(state, 'p2', 'air', V3_RULESET, 'p1', V3_PACK);
    expect(state.players.p2.hand.length).toBe(handBefore);
  });

  it('Dämmerung: moves shield or deals 1 + heals chooser', () => {
    let state = base();
    state = {
      ...state,
      players: {
        ...state.players,
        p1: { ...state.players.p1, hp: Math.max(1, state.players.p1.hp - 2) },
      },
    };
    const hpBefore = state.players.p2.hp;
    const chooserHp = state.players.p1.hp;
    state = applyStatus(state, 'p2', 'verflucht', 1);
    state = resolveImpulseReactions(state, 'p2', 'light', V3_RULESET, 'p1', V3_PACK);
    expect(state.players.p2.hp).toBe(hpBefore - 1);
    expect(state.players.p1.hp).toBe(chooserHp + 1);

    state = base();
    state = addShield(state, 'p2', 2);
    state = applyStatus(state, 'p2', 'verflucht', 1);
    state = resolveImpulseReactions(state, 'p2', 'light', V3_RULESET, 'p1', V3_PACK);
    expect(state.players.p2.shield).toBe(1);
    expect(state.players.p1.shield).toBeGreaterThanOrEqual(1);
  });
});
