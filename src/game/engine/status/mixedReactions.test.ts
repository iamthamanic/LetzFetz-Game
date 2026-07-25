/**
 * Parametrized tests for V3 mixed reactions (§8.8–8.21).
 * Location: src/game/engine/status/mixedReactions.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { BASE_PACK } from '../../packs/base-pack';
import { V3_RULESET, type Element, type PrimaryMarkId } from '../../types';
import { applyStatus, addShield, getStatus, setShield } from './applyStatus';
import { resolveImpulseReactions } from './reactionChoice';

function freshV3() {
  return createGame({
    pack: BASE_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'schluckspecht',
    startingPlayer: 'p1',
    seed: 21,
    ruleset: V3_RULESET,
  });
}

function fire(
  mark: PrimaryMarkId,
  impulse: Element,
  stacks = 1,
) {
  let state = freshV3();
  state = applyStatus(state, 'p2', mark, stacks);
  return resolveImpulseReactions(state, 'p2', impulse, V3_RULESET, 'p1');
}

describe('mixed reactions §8.8–8.21', () => {
  it('Hotbox: High + Feuer → 2 High + Nebel (or Verpeilt on overdose)', () => {
    const state = fire('high', 'fire', 1);
    expect(getStatus(state, 'p2', 'high')?.stacks).toBe(2);
    expect(getStatus(state, 'p2', 'nebel')).toBeTruthy();
  });

  it('Feuersturm: Aufgewirbelt + Feuer → 2 dmg + Brennen', () => {
    let state = freshV3();
    const hp = state.players.p2.hp;
    state = applyStatus(state, 'p2', 'aufgewirbelt', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    expect(state.players.p2.hp).toBe(hp - 2);
    expect(getStatus(state, 'p2', 'brennen')?.stacks).toBe(1);
  });

  it('Sonnenbrand: strips shield and blinds', () => {
    let state = freshV3();
    state = setShield(state, 'p2', 3);
    state = applyStatus(state, 'p2', 'erleuchtet', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V3_RULESET, 'p1');
    // 1 dmg through shield (3→2) then strip up to 2 more → 0
    expect(state.players.p2.shield).toBe(0);
    expect(getStatus(state, 'p2', 'geblendet')).toBeTruthy();
  });

  it('Hexenbrand: Brennen + Verflucht', () => {
    const state = fire('verflucht', 'fire');
    expect(getStatus(state, 'p2', 'brennen')?.stacks).toBe(1);
    expect(getStatus(state, 'p2', 'verflucht')?.stacks).toBe(1);
  });

  it('Kräutersud: heal + High', () => {
    let state = freshV3();
    state = { ...state, players: { ...state.players, p2: { ...state.players.p2, hp: 10 } } };
    state = applyStatus(state, 'p2', 'high', 1);
    state = resolveImpulseReactions(state, 'p2', 'water', V3_RULESET, 'p1');
    expect(state.players.p2.hp).toBe(11);
    expect(getStatus(state, 'p2', 'high')?.stacks).toBe(1);
  });

  it('Wirbel: exhausts upright bound or discards', () => {
    let state = freshV3();
    state = {
      ...state,
      players: {
        ...state.players,
        p2: {
          ...state.players.p2,
          bound: [
            {
              instanceId: 'b1',
              defId: 'fire-attack-3',
              exhausted: false,
              resistanceBonus: 0,
            },
          ],
        },
      },
    };
    state = applyStatus(state, 'p2', 'aufgewirbelt', 1);
    state = resolveImpulseReactions(state, 'p2', 'water', V3_RULESET, 'p1');
    expect(state.players.p2.bound[0].exhausted).toBe(true);
  });

  it('Prisma: three shield without negatives', () => {
    const state = fire('erleuchtet', 'water');
    expect(state.players.p2.shield).toBe(3);
  });

  it('Giftbrühe: Gift stack; discard if already poisoned', () => {
    let state = freshV3();
    state = {
      ...state,
      players: {
        ...state.players,
        p2: {
          ...state.players.p2,
          hand: [
            ...state.players.p2.hand,
            { instanceId: 'extra', defId: 'fire-block-2' },
          ],
        },
      },
    };
    state = applyStatus(state, 'p2', 'gift', 1);
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    const handBefore = state.players.p2.hand.length;
    state = resolveImpulseReactions(state, 'p2', 'shadow', V3_RULESET, 'p1');
    expect(getStatus(state, 'p2', 'gift')?.stacks).toBe(2);
    expect(state.players.p2.hand.length).toBe(handBefore - 1);
  });

  it('Pollenflug: High both + Geblendet on target', () => {
    const state = fire('aufgewirbelt', 'earth');
    expect(getStatus(state, 'p2', 'high')?.stacks).toBe(1);
    expect(getStatus(state, 'p1', 'high')?.stacks).toBe(1);
    expect(getStatus(state, 'p2', 'geblendet')).toBeTruthy();
  });

  it('Growlight: heal, shield, High', () => {
    let state = freshV3();
    state = { ...state, players: { ...state.players, p2: { ...state.players.p2, hp: 10 } } };
    state = applyStatus(state, 'p2', 'erleuchtet', 1);
    state = resolveImpulseReactions(state, 'p2', 'earth', V3_RULESET, 'p1');
    expect(state.players.p2.hp).toBe(11);
    expect(state.players.p2.shield).toBe(1);
    expect(getStatus(state, 'p2', 'high')?.stacks).toBe(1);
  });

  it('Paranoia: High → Verflucht stacks+1', () => {
    let state = freshV3();
    state = applyStatus(state, 'p2', 'high', 2);
    state = resolveImpulseReactions(state, 'p2', 'shadow', V3_RULESET, 'p1');
    expect(getStatus(state, 'p2', 'high')).toBeUndefined();
    expect(getStatus(state, 'p2', 'verflucht')?.stacks).toBe(3);
  });

  it('Blendwerk: Geblendet target + Fokus chooser', () => {
    const state = fire('erleuchtet', 'air');
    expect(getStatus(state, 'p2', 'geblendet')).toBeTruthy();
    expect(getStatus(state, 'p1', 'fokus')).toBeTruthy();
  });

  it('Flüstersturm: discard + Fluch', () => {
    let state = freshV3();
    const handBefore = state.players.p2.hand.length;
    state = applyStatus(state, 'p2', 'verflucht', 1);
    state = resolveImpulseReactions(state, 'p2', 'air', V3_RULESET, 'p1');
    expect(state.players.p2.hand.length).toBe(handBefore - 1);
    expect(getStatus(state, 'p2', 'verflucht')?.stacks).toBe(1);
  });

  it('Finsternis: Ausgeblendet + blocks new shield', () => {
    let state = fire('verflucht', 'light');
    expect(getStatus(state, 'p2', 'ausgeblendet')).toBeTruthy();
    expect(state.meta.v3BlockShieldThisAction).toBe(true);
    const shieldBefore = state.players.p2.shield;
    state = addShield(state, 'p2', 2);
    expect(state.players.p2.shield).toBe(shieldBefore);
  });
});
