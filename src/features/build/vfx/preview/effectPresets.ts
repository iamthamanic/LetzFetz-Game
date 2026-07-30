/**
 * Built-in Effekseer preset registry for VFX preview.
 * Location: src/features/build/vfx/preview/effectPresets.ts
 */
import type { VfxEffectPresetCategory } from '../types/wireTypes';

export interface VfxEffectPresetDefinition {
  id: string;
  labelDe: string;
  category: VfxEffectPresetCategory;
  /** Public URL under /vfx/effects/ */
  efkefcPath: string;
  /** Default clip length for timeline scrub (ms). */
  durationMs: number;
  /** Suggested hero frame for card art capture (ms). */
  defaultHeroFrameMs: number;
}

export const VFX_EFFECT_PRESETS: readonly VfxEffectPresetDefinition[] = [
  {
    id: 'aura',
    labelDe: 'Aura',
    category: 'aura',
    efkefcPath: '/vfx/effects/aura.efkefc',
    durationMs: 3000,
    defaultHeroFrameMs: 1200,
  },
  {
    id: 'trail',
    labelDe: 'Trail',
    category: 'trail',
    efkefcPath: '/vfx/effects/trail.efkefc',
    durationMs: 2500,
    defaultHeroFrameMs: 900,
  },
  {
    id: 'impact',
    labelDe: 'Impact',
    category: 'impact',
    efkefcPath: '/vfx/effects/impact.efkefc',
    durationMs: 1800,
    defaultHeroFrameMs: 600,
  },
  {
    id: 'ambient',
    labelDe: 'Ambient',
    category: 'ambient',
    efkefcPath: '/vfx/effects/ambient.efkefc',
    durationMs: 4000,
    defaultHeroFrameMs: 2000,
  },
] as const;

export function resolveEffectPreset(
  presetId: string | null | undefined,
): VfxEffectPresetDefinition | null {
  if (!presetId) return null;
  return VFX_EFFECT_PRESETS.find((p) => p.id === presetId) ?? null;
}

/** Returns true when the efkefc file responds OK to HEAD. */
export async function probeEffectFile(path: string): Promise<boolean> {
  try {
    const res = await fetch(path, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}
