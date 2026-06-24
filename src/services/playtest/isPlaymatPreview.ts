/**
 * DEV gate for playmat zone layout preview.
 * Location: src/services/playtest/isPlaymatPreview.ts
 */
export function isPlaymatPreview(): boolean {
  if (!import.meta.env.DEV) return false;
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('playmat-preview') === '1';
}
