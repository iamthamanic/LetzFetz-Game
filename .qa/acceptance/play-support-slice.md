# Feature: Play Support Slice

<!-- auto-generated for issue #61 -->

## Intent

Relocate Play-owned support services from shared `src/services/` into `src/features/play/services/` without behavior changes. Shared services (`cardArt`, `icons`, `history`, `storage`) stay in place.

## Happy Path

- [ ] `src/services/bot/` → `src/features/play/services/bot/` (incl. tests)
- [ ] `src/services/audio/` → `src/features/play/services/audio/` (incl. tests)
- [ ] `src/services/playtest/` → `src/features/play/services/playtest/`
- [ ] Old directories deleted; no re-export stubs
- [ ] All callers updated: `App.tsx`, `components/game/*`, `vite-plugins/llmBotApi.ts`
- [ ] Internal imports in moved modules point at `src/game/` correctly
- [ ] `npm run checks` green
- [ ] Playwright smoke (if env available): `e2e/game-duel-board-ui.spec.ts`, `e2e/game-cheatbox.spec.ts`

## Screenshots

| Step | Filename |
|------|----------|
| 1 | N/A — path move only |

## Implementation Notes

- Pure relocation; no logic or API changes.
- Play slice boundary: bot LLM client, combat audio, dev playtest gates.
