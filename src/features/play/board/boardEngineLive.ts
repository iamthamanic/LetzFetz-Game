/**
 * Whether Fetzgerät Live-3D board zone is shown for the active ruleset.
 * Location: src/features/play/board/boardEngineLive.ts
 *
 * V5 Formel matches use FormulaRig only — Bound/Fetz-3D is legacy (soft-retire).
 */
export function shouldShowBoardEngineLiveZone(v5FormulaEnabled: boolean): boolean {
  return !v5FormulaEnabled;
}
