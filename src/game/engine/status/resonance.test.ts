/**
 * Tests for V3 element resonance (#108).
 * Location: src/game/engine/status/resonance.test.ts
 */
import { describe, expect, it } from 'vitest';
import { V2_P100_PACK } from '../../packs/v2';
import { countPartsByElement, resonanceTierFor } from './resonance';

describe('resonance', () => {
  it('tiers 0/2/3 from part counts', () => {
    const parts = V2_P100_PACK.engineParts!.filter((p) => p.element === 'fire').slice(0, 3);
    const bound = parts.map((p, i) => ({
      instanceId: `f${i}`,
      defId: p.id,
      exhausted: false,
      resistanceBonus: 0,
      fetzSlot: (['traeger', 'antrieb', 'aufsatz'] as const)[i],
    }));
    expect(resonanceTierFor(V2_P100_PACK, bound.slice(0, 1), 'fire')).toBe(0);
    expect(resonanceTierFor(V2_P100_PACK, bound.slice(0, 2), 'fire')).toBe(2);
    expect(resonanceTierFor(V2_P100_PACK, bound, 'fire')).toBe(3);
    expect(countPartsByElement(V2_P100_PACK, bound).fire).toBe(3);
  });
});
