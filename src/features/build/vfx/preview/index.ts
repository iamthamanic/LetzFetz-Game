/**
 * Public exports for shared VFX preview slice.
 * Location: src/features/build/vfx/preview/index.ts
 */
export { VfxSharedPreview, type VfxSharedPreviewHandle, type VfxSharedPreviewProps } from './VfxSharedPreview';
export {
  VFX_EFFECT_PRESETS,
  probeEffectFile,
  resolveEffectPreset,
  type VfxEffectPresetDefinition,
} from './effectPresets';
export {
  getEffekseerAdapter,
  setEffekseerAdapterForTests,
  WasmEffekseerAdapter,
  type EffekseerAdapter,
  type EffekseerEffectInstance,
  type EffekseerLoadState,
} from './effekseerAdapter';
