/**
 * V3 pack unit tests — 36 authored Fetzgerät parts (2+2+2).
 * Location: src/game/packs/v3/v3-pack.test.ts
 */
import { describe, expect, it } from 'vitest';
import { V3_PACK, V3_MIX, V3_PACK_RULESET, buildV3Pack } from './v3-pack';
import { V3_ENGINE_PART_DEFS } from './engineParts36';

const ELEMENTS = ['fire', 'water', 'earth', 'air', 'shadow', 'light'] as const;
const ROLES = ['traeger', 'antrieb', 'aufsatz'] as const;

describe('V3_PACK', () => {
  it('matches mix counts', () => {
    expect(V3_PACK.elementCards.filter((c) => c.cardType === 'attack')).toHaveLength(
      V3_MIX.attack,
    );
    expect(V3_PACK.elementCards.filter((c) => c.cardType === 'block')).toHaveLength(
      V3_MIX.block,
    );
    expect(V3_PACK.elementCards.filter((c) => c.cardType === 'boost')).toHaveLength(
      V3_MIX.boost,
    );
    expect(V3_PACK.engineParts).toHaveLength(V3_MIX.enginePart);
    expect(V3_MIX.enginePart).toBe(36);
    expect(V3_PACK.glitches).toHaveLength(V3_MIX.glitch);
  });

  it('majority of attacks/blocks have elementImpulse', () => {
    const attacks = V3_PACK.elementCards.filter((c) => c.cardType === 'attack');
    const blocks = V3_PACK.elementCards.filter((c) => c.cardType === 'block');
    const attackWith = attacks.filter((c) => c.elementImpulse).length;
    const blockWith = blocks.filter((c) => c.elementImpulse).length;
    expect(attackWith).toBeGreaterThanOrEqual(18);
    expect(blockWith).toBeGreaterThanOrEqual(18);
    for (const c of attacks) {
      if (c.elementImpulse) {
        expect(c.elementImpulse.trigger).toBe('onHit');
        expect(c.elementImpulse.element).toBe(c.element);
      }
    }
    for (const c of blocks) {
      if (c.elementImpulse) {
        expect(c.elementImpulse.trigger).toBe('onFullBlock');
        expect(c.elementImpulse.element).toBe(c.element);
      }
    }
  });

  it('engine parts are 2+2+2 per element with effectText', () => {
    expect(V3_PACK.engineParts).toEqual(V3_ENGINE_PART_DEFS);
    for (const element of ELEMENTS) {
      const ofElement = V3_PACK.engineParts!.filter((p) => p.element === element);
      expect(ofElement).toHaveLength(6);
      for (const role of ROLES) {
        expect(ofElement.filter((p) => p.preferredRole === role)).toHaveLength(2);
      }
    }
    for (const p of V3_PACK.engineParts!) {
      expect(p.preferredRole).toBeTruthy();
      expect(p.effectText?.length).toBeGreaterThan(20);
      expect(p.id).toMatch(
        /^v3-part-(fire|water|earth|air|shadow|light)-(traeger|antrieb|aufsatz)-0[12]$/,
      );
    }
  });

  it('ruleset is 30 HP with v3Combat and deck 106', () => {
    expect(V3_PACK_RULESET.startingHp).toBe(30);
    expect(V3_PACK_RULESET.v3Combat).toBe(true);
    expect(V3_PACK_RULESET.mainDeckSize).toBe(106);
    const total =
      V3_MIX.attack + V3_MIX.block + V3_MIX.boost + V3_MIX.enginePart + V3_MIX.glitch;
    expect(total).toBe(106);
  });

  it('is deterministic (static roster)', () => {
    const a = buildV3Pack(42);
    const b = buildV3Pack(99);
    expect(a.engineParts?.map((p) => p.id)).toEqual(b.engineParts?.map((p) => p.id));
  });
});
