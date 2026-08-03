# Feature: Leave-match / leave-Play navigation guard

## Intent

Stop accidental “kick to main menu” / tab switches during Play setup or an active match — especially when the app header (`z-[250]`) sits above modals and history Zurück bypassed leave confirms.

## Happy Path

- [ ] During an active match, switching to Material / Build asks confirm; Cancel stays on Play; OK pauses the match and keeps GameState mounted
- [ ] During an active match, history Zurück that would open **Hauptmenü** asks **end-match** confirm (not soft-pause); Cancel stays; OK ends + remounts
- [ ] During Play setup, Zurück / tab leave asks confirm; Cancel stays on Play; OK keeps setup mounted in the background
- [ ] Pause only toggles soft-pause — does not change tab or remount PlayView
- [ ] Returning to Play after a confirmed Material/Build leave does **not** remount / wipe setup or match
- [ ] Brand logo home still ends the session (with confirm) and remounts a fresh Play session

## Regression

- [ ] History Vor/Zurück cancel leaves the stack index unchanged
- [ ] Settings modal still opens without leaving Play
- [ ] `npm run build` green

## Implementation Notes

- Files: `src/App.tsx`, `src/features/shell/leavePlayGuard.ts` (+ test), `src/services/history/AppHistoryContext.tsx` (+ test), `src/features/play/PlayView.tsx` (sync matchActive notify)
- Single gate `applyViewChange` used by tabs and history undo/redo
- **Hole closed:** Menu→Play history undo used soft-pause and parked a live match behind Hauptmenü — now `confirm-end-match` + `resetPlaySession`
- `matchActiveRef` updated synchronously via `handleMatchActiveChange` / match start|end notify
- Remount (`playSessionKey++`) only via brand home / end-match-to-menu / explicit session reset
