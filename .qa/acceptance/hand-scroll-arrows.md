# Acceptance: Restore HandFan scroll arrows

## Issue
Restore red bidirectional clickable scroll-direction arrows on the player hand (`HandFan`), so overflow hands (e.g. “Hand 6” with ~3 visible cards) show a cue that more cards exist and can be scrolled.

Not the combat `TargetingArrow` (PR #403).

## Acceptance criteria
- [x] Detect `canScrollLeft` / `canScrollRight` on `.hand-fan-row` scroll container
- [x] Prefer right: if `canScrollRight` → red `ChevronRight` top-right (`player-hand-scroll-hint-right`, aria „Nach rechts scrollen“)
- [x] Else if `canScrollLeft` → red `ChevronLeft` top-left (`player-hand-scroll-hint-left`, aria „Nach links scrollen“)
- [x] Clickable: `scrollBy` ~75% of `clientWidth`, `behavior: smooth` (or `auto` if prefers-reduced-motion)
- [x] Frameless red arrow (no stone pill/badge), `absolute` under top edge of `relative` `player-hand`
- [x] CSS nudge: `hand-scroll-hint-arrow` / `--left` / `--right` + keyframes in `src/index.css`
- [x] Keep auto-scroll-to-end on new cards; re-measure hints after
- [x] Hooks only `useState` / `useRef` / `useEffect`
- [x] `GameBoard` and `PlaymatBoard` both mount `HandFan` (same component)
- [x] Unit smoke for scroll metrics helper; `npm run checks` green

## Implementation
- `HandFan.tsx` — scroll metrics + hint buttons
- `handScrollHints.ts` — pure measure / pick helpers
- `src/index.css` — directional nudge animations + reduced-motion
- Unit: `handScrollHints.test.ts`
