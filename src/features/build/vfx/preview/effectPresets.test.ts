/**
 * Unit tests for VFX effect preset registry.
 * Location: src/features/build/vfx/preview/effectPresets.test.ts
 */
import { describe, expect, it } from 'vitest';
import { resolveEffectPreset, VFX_EFFECT_PRESETS } from './effectPresets';

describe('resolveEffectPreset', () => {
  it('returns aura preset by id', () => {
    const preset = resolveEffectPreset('aura');
    expect(preset).not.toBeNull();
    expect(preset?.efkefcPath).toBe('/vfx/effects/aura.efkefc');
    expect(preset?.defaultHeroFrameMs).toBeGreaterThan(0);
  });

  it('returns null for unknown id', () => {
    expect(resolveEffectPreset('unknown-vfx')).toBeNull();
    expect(resolveEffectPreset(null)).toBeNull();
  });

  it('registers four built-in categories', () => {
    expect(VFX_EFFECT_PRESETS).toHaveLength(4);
    const ids = VFX_EFFECT_PRESETS.map((p) => p.id);
    expect(ids).toEqual(['aura', 'trail', 'impact', 'ambient']);
  });
});
