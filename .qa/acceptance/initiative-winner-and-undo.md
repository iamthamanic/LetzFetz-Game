# Acceptance — Initiative winner reveal + app undo history

## Intent

After initiative dice fall into view and settle, the winning character appears centered with „{Name} beginnt“ before the intro continues. AppNav Zurück/Vor undoes and redoes user actions (view switches, setup steps, human game actions), not only top-level tabs.

## Preconditions

- Play → Bot-Duell → Partie starten
- AppNav history buttons visible

## Happy Path

1. Letz Fetz → dice drop in and tumble, then settle
2. Winner character centers; status shows „{Charaktername} beginnt“
3. After a short beat → crash → arena teaser
4. Zurück undoes last committed action (e.g. last human move, setup step, or view change); Vor redoes

## Edge Cases

- Tie → re-roll; no winner reveal until a side wins
- `prefers-reduced-motion` → skip tumble/crash; winner text still shown briefly
- Undo after leaving Play keeps Play mounted (hidden) so game undo still works

## Out of Scope

- Undo of bot-only turns in isolation (bot moves roll back with the preceding human action)
- Undo of Card Forge field edits / network saves
- Hot-seat or P2P undo

## Implementation Notes

- Files: `MatchIntro.tsx` (winner phase), `W6Die3D.tsx` + `index.css` (drop + tumble), `AppHistoryContext.tsx`, `App.tsx` (views stay mounted), `AppNav`, `GameView`, `GameSetup` (controlled + history)
- Undo stack covers: view tabs, setup phase/character, match start, human game actions, intro skip, new game
- Not covered: Card Forge field edits / network saves; bot-only steps (roll back with preceding human action)
