/**
 * V6 Playable gate — post-cutover (#353) V6 is always available.
 * Location: src/features/play/setup/v6PlayableFlag.ts
 *
 * Legacy opt-in keys (`VITE_V6_PLAYABLE`, localStorage) are ignored for enablement.
 * Test override remains for unit/e2e isolation (force off).
 */
export const V6_PLAYABLE_STORAGE_KEY = 'letz-fetz:v6-playable';

/** German one-liner — kept for docs; flag no longer required after cutover. */
export const V6_PLAYABLE_ENABLE_HINT_DE =
  'V6 ist Play-Default. V5 bleibt als Legacy-Kachel wählbar.';

/** Test-only override; null = V6 playable (cutover default). */
let testOverride: boolean | null = null;

export function setV6PlayableTestOverride(value: boolean | null): void {
  testOverride = value;
}

export function isV6PlayableEnabled(): boolean {
  if (testOverride !== null) return testOverride;
  return true;
}
