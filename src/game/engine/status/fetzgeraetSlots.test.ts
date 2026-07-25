/**
 * Tests for V3 Fetzgerät slots (#107).
 * Location: src/game/engine/status/fetzgeraetSlots.test.ts
 */
import { describe, expect, it } from 'vitest';
import { V3_RULESET, DEFAULT_RULESET, PHRASE_TO_FETZ } from '../../types';
import {
  findFirstFreeFetzSlot,
  occupiedFetzSlots,
  resolveBuildSlots,
} from './fetzgeraetSlots';
import { V2_P100_PACK } from '../../packs/v2';

describe('fetzgeraetSlots', () => {
  it('maps phrase core/mode/tool to Träger/Antrieb/Aufsatz', () => {
    expect(PHRASE_TO_FETZ.core).toBe('traeger');
    expect(PHRASE_TO_FETZ.mode).toBe('antrieb');
    expect(PHRASE_TO_FETZ.tool).toBe('aufsatz');
  });

  it('finds free Fetz slots in order', () => {
    expect(findFirstFreeFetzSlot([])).toBe('traeger');
    expect(
      findFirstFreeFetzSlot([
        {
          instanceId: '1',
          defId: 'x',
          exhausted: false,
          resistanceBonus: 0,
          fetzSlot: 'traeger',
        },
      ]),
    ).toBe('antrieb');
  });

  it('resolveBuildSlots sets fetzSlot under v3Combat', () => {
    const part = V2_P100_PACK.engineParts![0];
    const slots = resolveBuildSlots(V2_P100_PACK, part.id, [], V3_RULESET);
    expect(slots.fetzSlot).toBe('traeger');
    expect(slots.phraseSlot).toBe('core');
  });

  it('still assigns phrase under V1 defaults', () => {
    const part = V2_P100_PACK.engineParts![0];
    const slots = resolveBuildSlots(V2_P100_PACK, part.id, [], DEFAULT_RULESET);
    expect(slots.phraseSlot).toBe('core');
    expect(slots.fetzSlot).toBe('traeger');
  });

  it('counts occupied fetz from legacy phraseSlot', () => {
    const occ = occupiedFetzSlots([
      {
        instanceId: '1',
        defId: 'x',
        exhausted: false,
        resistanceBonus: 0,
        phraseSlot: 'mode',
      },
    ]);
    expect(occ.has('antrieb')).toBe(true);
  });
});
