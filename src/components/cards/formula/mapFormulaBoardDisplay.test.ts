/**
 * Unit tests for FormulaBoard → rack display mapping.
 * Location: src/components/cards/formula/mapFormulaBoardDisplay.test.ts
 */
import { describe, expect, it } from 'vitest';
import { V5_PACK } from '../../../game/packs/v5';
import type { FormulaBoard } from '../../../game/types';
import {
  findComboForFilledSlots,
  mapEquipmentForDisplay,
  mapFormulaSlotsForDisplay,
} from './mapFormulaBoardDisplay';

describe('mapFormulaSlotsForDisplay', () => {
  it('maps Technik face with art path and real name (not compose Klischee)', () => {
    const formula: FormulaBoard = {
      technik: {
        instanceId: 't1',
        defId: 'v5-technik-impulsgeschoss',
        slot: 'technik',
        exhausted: false,
        disturbed: false,
        stabilityBonus: 0,
      },
      essenz: null,
      katalysator: null,
    };
    const slots = mapFormulaSlotsForDisplay(V5_PACK, formula);
    expect(slots.technik?.card.name).toBe('Impulsgeschoss');
    expect(slots.technik?.card.role).toBe('technik');
    expect(slots.technik?.card.imageUrl).toContain('/cards/formula/impulsgeschoss.png');
    expect(slots.technik?.card.effectText.length).toBeGreaterThan(0);
  });

  it('marks exhausted / disturbed state', () => {
    const formula: FormulaBoard = {
      technik: {
        instanceId: 't1',
        defId: 'v5-technik-impulsgeschoss',
        slot: 'technik',
        exhausted: true,
        disturbed: true,
        stabilityBonus: 0,
      },
      essenz: null,
      katalysator: null,
    };
    const slots = mapFormulaSlotsForDisplay(V5_PACK, formula);
    expect(slots.technik?.exhausted).toBe(true);
    expect(slots.technik?.disturbed).toBe(true);
  });
});

describe('findComboForFilledSlots', () => {
  it('returns null with fewer than 2 slots', () => {
    const formula: FormulaBoard = {
      technik: {
        instanceId: 't1',
        defId: 'v5-technik-impulsgeschoss',
        slot: 'technik',
        exhausted: false,
        disturbed: false,
        stabilityBonus: 0,
      },
      essenz: null,
      katalysator: null,
    };
    const slots = mapFormulaSlotsForDisplay(V5_PACK, formula);
    expect(findComboForFilledSlots(slots)).toBeNull();
  });

  it('resolves catalog combo for TE pair', () => {
    const formula: FormulaBoard = {
      technik: {
        instanceId: 't1',
        defId: 'v5-technik-impulsgeschoss',
        slot: 'technik',
        exhausted: false,
        disturbed: false,
        stabilityBonus: 0,
      },
      essenz: {
        instanceId: 'e1',
        defId: 'v5-essenz-feuer',
        slot: 'essenz',
        exhausted: false,
        disturbed: false,
        stabilityBonus: 0,
      },
      katalysator: null,
    };
    const slots = mapFormulaSlotsForDisplay(V5_PACK, formula);
    const combo = findComboForFilledSlots(slots);
    expect(combo).not.toBeNull();
    expect(combo?.name.length).toBeGreaterThan(0);
  });
});

describe('mapEquipmentForDisplay', () => {
  it('maps equipment with item art path', () => {
    const items = mapEquipmentForDisplay(V5_PACK, [
      { instanceId: 'eq1', defId: 'v5-item-werkzeugkoffer' },
    ]);
    expect(items).toHaveLength(1);
    expect(items[0]?.name).toBe('Werkzeugkoffer');
    expect(items[0]?.imageUrl).toContain('/cards/item/werkzeugkoffer.png');
  });
});
