/**
 * Unit tests for the 36 V3 engine part catalog.
 * Location: src/game/packs/v3/engineParts36.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  V3_ENGINE_PARTS_36,
  V3_ENGINE_PARTS_36_BY_ID,
  listV3EnginePartIds,
} from './engineParts36';

describe('V3_ENGINE_PARTS_36', () => {
  it('has exactly 36 unique ids', () => {
    expect(V3_ENGINE_PARTS_36).toHaveLength(36);
    const ids = listV3EnginePartIds();
    expect(new Set(ids).size).toBe(36);
  });

  it('preserves MVP×3 locked ids from ADR #132', () => {
    expect(V3_ENGINE_PARTS_36_BY_ID.has('v3-part-water-traeger-01')).toBe(true);
    expect(V3_ENGINE_PARTS_36_BY_ID.has('v3-part-shadow-antrieb-01')).toBe(true);
    expect(V3_ENGINE_PARTS_36_BY_ID.has('v3-part-light-aufsatz-01')).toBe(true);
  });

  it('covers 6 elements × 3 slots × 2 variants', () => {
    const byKey = new Set(
      V3_ENGINE_PARTS_36.map((p) => `${p.element}|${p.slot}|${p.variant}`),
    );
    expect(byKey.size).toBe(36);
  });
});
