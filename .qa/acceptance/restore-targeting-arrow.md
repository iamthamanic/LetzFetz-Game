# Acceptance: Restore Targeting Arrow

## Issue
Restore the Hand→Board Richtungspfeil / Zielpfeil (`TargetingArrow`) dropped in WIP commit `5e27f8b` after being added in `27e7462` (PR #35).

## Acceptance criteria
- [x] `TargetingArrow` mounted from `PlaymatBoard` when `pending.type === 'attack'` and no winner
- [x] Source = selected attack hand card (`data-hand-card-id` / `data-selected-attack`)
- [x] Target = selected challenge (`data-challenge-selected`) → first `data-targetable` (Bound / Formel / Konstrukt) → bot dock fallthrough
- [x] Works for V6 Formel challenge targets (formula slot + construct `data-targetable`), not only Bound slots
- [x] Hooks limited to `useState` / `useRef` / `useEffect` (no `useLayoutEffect` / `useCallback`)
- [x] Unit smoke for measurement helper; `npm run checks` green
- [x] E2E expects arrow visible on attack pending again

## Implementation
- `zones/TargetingArrow.tsx` — SVG overlay (coords + `targetableCount`)
- `zones/measureTargetingArrowCoords.ts` — DOM measure helper
- `PlaymatBoard.tsx` — measure on attack pending + resize/scroll; render overlay
- CSS `.targeting-arrow-pulse` already present in `src/index.css`

## Dropped by
`5e27f8b` — WIP removed `TargetingArrow` import + measurement/wiring from old `PlaymatBoard.tsx`
