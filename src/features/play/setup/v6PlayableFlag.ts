/**
 * INTERNAL / playtest gate for V6 Setup exposure.
 * Location: src/features/play/setup/v6PlayableFlag.ts
 *
 * Default OFF — Play-Default remains V5 until explicit cutover.
 * Enable: `VITE_V6_PLAYABLE=true` or localStorage `letz-fetz:v6-playable=1`.
 */
export const V6_PLAYABLE_STORAGE_KEY = 'letz-fetz:v6-playable';

/** Test-only override; null = consult env/storage. */
let testOverride: boolean | null = null;

export function setV6PlayableTestOverride(value: boolean | null): void {
  testOverride = value;
}

export function isV6PlayableEnabled(): boolean {
  if (testOverride !== null) return testOverride;
  try {
    if (import.meta.env.VITE_V6_PLAYABLE === 'true') return true;
  } catch {
    // non-vite test env
  }
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(V6_PLAYABLE_STORAGE_KEY) === '1') {
      return true;
    }
  } catch {
    // SSR / restricted storage
  }
  return false;
}
