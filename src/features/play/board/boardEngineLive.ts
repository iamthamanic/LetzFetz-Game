/**
 * Whether Fetzgerät Live-3D board zone is shown for the active ruleset.
 * Location: src/features/play/board/boardEngineLive.ts
 *
 * V5 Formel matches use FormulaRig compose (§28.1) — Bound/Fetz-3D is legacy (soft-retire).
 */
export function shouldShowBoardEngineLiveZone(v5FormulaEnabled: boolean): boolean {
  return !v5FormulaEnabled;
}

/** V5 default board visual is Formelgestell compose, not Fetz-3D. */
export function shouldShowFormulaGestellCompose(v5FormulaEnabled: boolean): boolean {
  return v5FormulaEnabled;
}
