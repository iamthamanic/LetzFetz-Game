/**
 * Dev-only playtest gate — never true in production builds.
 * Location: src/services/playtest/isPlaytestMode.ts
 */
export function isPlaytestMode(): boolean {
  if (!import.meta.env.DEV) return false;
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('playtest') === '1') return true;
    return localStorage.getItem('lf-playtest') === '1';
  } catch {
    return false;
  }
}
