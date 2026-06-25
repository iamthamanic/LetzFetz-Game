# Acceptance — Mobile pass for playmat game layout (#21)

## Intent
Playmat spielbar auf 390×844 (iPhone 12/14 class) — Roadmap B-13.

## Acceptance
- [x] verify-ui 390×844 Evidence — `e2e/mobile-playmat-layout.spec.ts` schreibt Screenshots nach `.qa/evidence/mobile-playmat-layout/`
- [x] Alle Zonen erreichbar — Gegner-Engine, Deine Engine, Hand, ActionBar, PhaseCoachBanner sichtbar
- [x] E2E mobile smoke — kein horizontaler Overflow (`scrollWidth <= 390`)

## Changes
- `src/components/game/PlaymatBoard.tsx` — tableau `overflow-x-hidden`, responsive padding (`px-2 sm:px-4`), topbar padding responsive
- `src/components/game/BoundCardRow.tsx` — responsive gap (`gap-2 sm:gap-3`)
- `src/components/game/BoundCardSlot.tsx` — SLOT_DIM responsive (`w-24 sm:w-28` etc.)
- `src/components/game/BoardCard.tsx` — SIZE_OVERRIDES responsive (`w-24 sm:w-28` etc.)
- `src/components/cards/LetzFetzCard.tsx` — `md` size class already responsive (`w-28 sm:w-36`)
- `src/components/game/HandFan.tsx` — responsive padding (`px-2 sm:px-3`) already present
- `src/components/game/GameView.tsx` — header padding responsive (`px-3 sm:px-4`, `gap-2 sm:gap-4`)

## Runtime
- Local: yes (kein Backend betroffen)
- Edge Cases: Safe area nicht explizit behandelt (iOS notch); Hand scrollbar via `overflow-x-auto`