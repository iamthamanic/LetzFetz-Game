/**
 * Tests for V3 element resonance (#108 / content cutover).
 * Location: src/game/engine/status/resonance.test.ts
 */
import { describe, expect, it } from 'vitest';
import { V3_PACK } from '../../packs/v3';
import { V3_RULESET } from '../../types';
import { createGame } from '../createGame';
import {
  countPartsByElement,
  hasFullResonance,
  hasTwoPartResonance,
  infernoResonanceBonus,
  resonanceTierFor,
} from './resonance';

describe('resonance', () => {
  it('tiers 0/2/3 from part counts', () => {
    const parts = V3_PACK.engineParts!.filter((p) => p.element === 'fire').slice(0, 3);
    const bound = parts.map((p, i) => ({
      instanceId: `f${i}`,
      defId: p.id,
      exhausted: false,
      resistanceBonus: 0,
      fetzSlot: (['traeger', 'antrieb', 'aufsatz'] as const)[i],
    }));
    expect(resonanceTierFor(V3_PACK, bound.slice(0, 1), 'fire')).toBe(0);
    expect(resonanceTierFor(V3_PACK, bound.slice(0, 2), 'fire')).toBe(2);
    expect(resonanceTierFor(V3_PACK, bound, 'fire')).toBe(3);
    expect(countPartsByElement(V3_PACK, bound).fire).toBe(3);
    expect(hasTwoPartResonance(V3_PACK, bound.slice(0, 2), 'fire')).toBe(true);
    expect(hasFullResonance(V3_PACK, bound, 'fire')).toBe(true);
  });

  it('infernoResonanceBonus once per round', () => {
    let state = createGame({
      pack: V3_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 1,
      ruleset: V3_RULESET,
    });
    const parts = V3_PACK.engineParts!.filter((p) => p.element === 'fire').slice(0, 3);
    state.players.p1.bound = parts.map((p, i) => ({
      instanceId: `f${i}`,
      defId: p.id,
      exhausted: false,
      resistanceBonus: 0,
      fetzSlot: (['traeger', 'antrieb', 'aufsatz'] as const)[i],
    }));
    const first = infernoResonanceBonus(state, V3_PACK, 'p1', V3_RULESET);
    expect(first.bonus).toBe(1);
    const second = infernoResonanceBonus(first.state, V3_PACK, 'p1', V3_RULESET);
    expect(second.bonus).toBe(0);
  });
});
