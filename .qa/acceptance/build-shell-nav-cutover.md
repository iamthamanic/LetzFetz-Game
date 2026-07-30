# Acceptance — build-shell-nav-cutover

## Intent

Replace the shell **Sandbox** menu/nav entry with **Build**, mounting `BuildView` from `src/features/build/` so the Architecture cutover (`build-workbench` replaces Sandbox menu entry) is visible in the running app.

## Preconditions

- App loads at `/`
- `src/features/build/BuildView.tsx` exists with Combinate | Development sub-tabs

## Happy Path

1. Main menu shows a **Build** item (not Sandbox) with hint about Meshy / Formel workbench
2. Header nav tab **Build** is visible (`data-testid="nav-tab-build"`)
3. Clicking Build shows `data-testid="build-view"` with Combinate / Development tabs
4. Sandbox free-table UI is not reachable from primary nav/menu

## Edge Cases

- History undo/redo across tabs still works with view id `build`
- Leaving Play via nav to Build then back to Play still returns to mode select (existing e2e)

## Out of scope

- Deleting `src/features/sandbox/` tree (follow-up cleanup)
- Animation polish unrelated to Build nav
- Renaming TabTone `sandbox` CSS token (amber stays for Build chrome)

## Security Coverage

- N/A — local UI navigation only; no auth, UGC, or network

## Implementation Notes

- `AppView`: `arena` → `build`
- `App.tsx` mounts `BuildView` with `active={currentView === 'build'}` (no Sandbox mount)
- Shell: AppNav + MainMenu labels **Build**, icon Boxes, tone amber (`sandbox`)
- E2E: `smoke` + `build-shell-nav`; removed `sandbox-local-session`; duel/cheatbox nav click → Build
- `src/features/sandbox/` left in place (unwired) for follow-up delete
- `npm run checks` green (2026-07-30)
