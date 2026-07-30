/**
 * VFX Studio asset lifecycle status machine.
 * Location: src/features/build/vfx/types/status.ts
 * Design: .qa/design/vfx-studio.md
 */

export const VFX_ASSET_STATUSES = [
  'DRAFT',
  'QUEUED',
  'GENERATING',
  'REVIEW_REQUIRED',
  'READY',
  'FAILED',
  'OUTDATED',
] as const;

export type VfxAssetStatus = (typeof VFX_ASSET_STATUSES)[number];

export function isVfxAssetStatus(value: unknown): value is VfxAssetStatus {
  return typeof value === 'string' && (VFX_ASSET_STATUSES as readonly string[]).includes(value);
}

/** Narrow unknown JSON into a VfxAssetStatus; throws on invalid values. */
export function parseVfxAssetStatus(raw: unknown): VfxAssetStatus {
  if (!isVfxAssetStatus(raw)) {
    throw new Error(
      `status must be one of: ${VFX_ASSET_STATUSES.join(', ')}`,
    );
  }
  return raw;
}
