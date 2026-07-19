/**
 * Unit tests for V2 Ggen + P100 pack mix.
 */
import { describe, expect, it } from 'vitest';
import { createSeededRng, buildMainDeckInstances, resetInstanceIdCounter } from '../../engine/deck';
import {
  CBIAS_DEFAULTS,
  generateEngineParts,
  measureOffBiasRate,
  P100_MIX,
  V2_P100_PACK,
  buildV2P100Pack,
} from './index';

describe('generateEngineParts (Ggen + Cbias)', () => {
  it('emits Smin fields and requested count', () => {
    const parts = generateEngineParts({ count: 30, rng: createSeededRng(1) });
    expect(parts).toHaveLength(30);
    for (const part of parts) {
      expect(part.kind).toBe('enginePart');
      expect(part.id).toBeTruthy();
      expect(part.name).toBeTruthy();
      expect(part.element).toBeTruthy();
      expect(['core', 'mode', 'tool']).toContain(part.preferredTag);
      expect(part.resistance).toBeGreaterThanOrEqual(2);
      expect(part.resistance).toBeLessThanOrEqual(6);
      expect(['p_atk', 'p_block', 'p_draw']).toContain(part.passiveArchetype);
      expect(['a_dmg', 'a_heal', 'a_exhaust']).toContain(part.activateArchetype);
    }
  });

  it('keeps off-bias roughly in 15–40% band for seeded runs', () => {
    const rates: number[] = [];
    for (let seed = 1; seed <= 8; seed++) {
      const parts = generateEngineParts({
        count: 60,
        offBiasRate: 0.25,
        rng: createSeededRng(seed * 97),
      });
      rates.push(measureOffBiasRate(parts));
    }
    const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
    expect(avg).toBeGreaterThanOrEqual(0.15);
    expect(avg).toBeLessThanOrEqual(0.4);
  });

  it('documents Cbias defaults', () => {
    expect(CBIAS_DEFAULTS.core).toEqual({ passive: 'p_atk', activate: 'a_dmg' });
    expect(CBIAS_DEFAULTS.mode).toEqual({ passive: 'p_draw', activate: 'a_heal' });
    expect(CBIAS_DEFAULTS.tool).toEqual({ passive: 'p_block', activate: 'a_exhaust' });
  });
});

describe('V2_P100_PACK', () => {
  it('matches P100 mix 24/24/12/30/10', () => {
    const pack = V2_P100_PACK;
    const attacks = pack.elementCards.filter((c) => c.cardType === 'attack');
    const blocks = pack.elementCards.filter((c) => c.cardType === 'block');
    const boosts = pack.elementCards.filter((c) => c.cardType === 'boost');
    expect(attacks).toHaveLength(P100_MIX.attack);
    expect(blocks).toHaveLength(P100_MIX.block);
    expect(boosts).toHaveLength(P100_MIX.boost);
    expect(pack.engineParts).toHaveLength(P100_MIX.enginePart);
    expect(pack.glitches).toHaveLength(P100_MIX.glitch);
  });

  it('builds a 100-card main deck including engine parts', () => {
    resetInstanceIdCounter();
    const deck = buildMainDeckInstances(V2_P100_PACK, createSeededRng(42));
    expect(deck).toHaveLength(100);
  });

  it('is deterministic for a fixed seed', () => {
    const a = buildV2P100Pack(99);
    const b = buildV2P100Pack(99);
    expect(a.engineParts?.map((p) => p.id)).toEqual(b.engineParts?.map((p) => p.id));
  });

  it('reuses V1 characters and arenas', () => {
    expect(V2_P100_PACK.characters.length).toBeGreaterThan(0);
    expect(V2_P100_PACK.arenas.length).toBeGreaterThan(0);
    expect(V2_P100_PACK.ultimates.length).toBe(V2_P100_PACK.characters.length);
  });
});
