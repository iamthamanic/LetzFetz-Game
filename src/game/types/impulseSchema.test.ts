/**
 * Tests for V3 pack impulse keyword schema.
 * Location: src/game/types/impulseSchema.test.ts
 */
import { describe, expect, it } from 'vitest';
import { BASE_PACK } from '../packs/base-pack';
import {
  parseElementImpulseKeyword,
  validateCardElementImpulse,
} from './impulseSchema';

describe('impulseSchema', () => {
  it('parses valid onHit keyword', () => {
    expect(parseElementImpulseKeyword({ element: 'fire', trigger: 'onHit' })).toEqual({
      element: 'fire',
      trigger: 'onHit',
    });
  });

  it('returns null when absent', () => {
    expect(parseElementImpulseKeyword(undefined)).toBeNull();
    expect(validateCardElementImpulse({ id: 'x' })).toBeNull();
  });

  it('rejects unknown element / trigger', () => {
    expect(() => parseElementImpulseKeyword({ element: 'plasma', trigger: 'onHit' })).toThrow(
      /element/,
    );
    expect(() =>
      parseElementImpulseKeyword({ element: 'fire', trigger: 'onPlay' }),
    ).toThrow(/trigger/);
  });

  it('seed: fire-attack-6 has Treffer Feuerimpuls', () => {
    const card = BASE_PACK.elementCards.find((c) => c.id === 'fire-attack-6');
    expect(card?.elementImpulse).toEqual({ element: 'fire', trigger: 'onHit' });
    expect(
      validateCardElementImpulse({
        id: card!.id,
        elementImpulse: card!.elementImpulse,
      }),
    ).toEqual({ element: 'fire', trigger: 'onHit' });
  });

  it('legacy cards without impulse remain valid', () => {
    const card = BASE_PACK.elementCards.find((c) => c.id === 'water-attack-2');
    expect(card?.elementImpulse).toBeUndefined();
  });
});
