/**
 * DEV / worker gate for headless batch preview (Playwright target URL).
 * Location: src/features/build/vfx/batch/isVfxBatchPreview.ts
 */
export function isVfxBatchPreview(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get('vfx-batch-preview') !== '1') return false;
  if (import.meta.env.DEV) return true;
  return import.meta.env.VITE_VFX_BATCH_PREVIEW === 'true';
}
