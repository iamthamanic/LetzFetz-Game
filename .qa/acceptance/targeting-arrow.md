# Acceptance: Targeting Arrow (#14)

## Issue
Add targeting arrow for attack and challenge.

## Acceptance criteria
- [x] Pfeil bei Attack/Challenge sichtbar
- [x] Ziel-Highlight (bestehend via `isTargetable` auf BoundCardSlot)
- [x] Desktop + Mobile smoke (E2E)
- [x] `npm run checks` grün

## Implementation
- `TargetingArrow.tsx` — SVG overlay on playmat, source = player-hand zone, target = opponent-character (direct) or combat (challenge)
- `data-target-type` = `challenge` | `direct`; `data-targetable-count` = count of targetable opponent slots
- Rendered in `PlaymatBoard` when `pending.type === 'attack'`
- CSS pulse animation on the arrow path
- `prefers-reduced-motion` disables pulse

## Tests
- E2E: `targeting arrow appears when attack card selected`
- Unit: existing 136 tests still green