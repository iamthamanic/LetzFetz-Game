/**
 * Unit tests for V6 Echo/Delay Play surface helpers (#345).
 * Location: src/features/play/board/v6EchoDelaySurface.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../../../game/engine/createGame';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../../game/packs/v6';
import type { GameState } from '../../../game/types';
import {
  buildV6EchoDelaySurface,
  pendingCatalystTiming,
} from './v6EchoDelaySurface';

function baseState(): GameState {
  return createGame({
    pack: V6_CORE_PACK,
    p1CharacterId: V6_CORE_PACK.characters[0].id,
    p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
    ruleset: V6_PACK_RULESET,
    seed: 11,
  });
}

describe('v6EchoDelaySurface', () => {
  it('returns empty chips when queues are empty', () => {
    const state = baseState();
    expect(buildV6EchoDelaySurface(state, 'p1')).toEqual([]);
    expect(pendingCatalystTiming(state, 'p1', 'k1')).toBeNull();
  });

  it('builds German Echo + Delay chips from meta queues', () => {
    const state = baseState();
    state.meta.v6EchoQueue = {
      p1: [
        {
          recipeId: 'r-echo',
          recipeName: 'Glutimpuls-Echo',
          kind: 'damage',
          value: 3,
          target: 'opponent',
          offensive: true,
          catalystInstanceId: 'k-echo',
          echoAmount: 1,
        },
      ],
      p2: [],
    };
    state.meta.v6DelayQueue = {
      p1: [
        {
          recipeId: 'r-delay',
          recipeName: 'Glutimpuls-Verzögerung',
          kind: 'damage',
          value: 5,
          target: 'opponent',
          offensive: true,
          catalystInstanceId: 'k-delay',
        },
      ],
      p2: [],
    };

    const chips = buildV6EchoDelaySurface(state, 'p1');
    expect(chips).toHaveLength(2);
    expect(chips[0]?.kind).toBe('echo');
    expect(chips[0]?.labelDe).toMatch(/Echo/);
    expect(chips[0]?.labelDe).toMatch(/\+1 Schaden/);
    expect(chips[1]?.kind).toBe('delay');
    expect(chips[1]?.labelDe).toMatch(/Verzögerung/);
    expect(chips[1]?.labelDe).toMatch(/5 Schaden/);
  });

  it('maps seated catalyst instance to pending timing', () => {
    const state = baseState();
    state.meta.v6EchoQueue = {
      p1: [
        {
          recipeId: 'r-echo',
          recipeName: 'Echo',
          kind: 'damage',
          value: 3,
          target: 'opponent',
          offensive: true,
          catalystInstanceId: 'k-echo',
          echoAmount: 1,
        },
      ],
      p2: [],
    };
    expect(pendingCatalystTiming(state, 'p1', 'k-echo')).toBe('echo');
    expect(pendingCatalystTiming(state, 'p1', 'other')).toBeNull();
  });
});
