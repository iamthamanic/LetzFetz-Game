/**
 * Dev/perf gate for engine FPS HUD — `?enginePerf=1` or localStorage.
 * Location: src/components/engine3d/enginePerfFlag.ts
 */
export function isEnginePerfHudEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('enginePerf') === '1') return true;
    return localStorage.getItem('lf-engine-perf') === '1';
  } catch {
    return false;
  }
}
