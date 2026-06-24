# Acceptance: Bind Snap VFX on Engine Slots (#18)

## Issue
Add bind snap VFX on engine slots — visual snap + slot glow when card lands.

## Acceptance criteria
- [x] Bind-VFX sichtbar (card snap + slot glow pulse)
- [x] Max 4 Slots respektiert (engine enforces; VFX fires per newly bound card)
- [x] prefers-reduced-motion disables both animations

## Implementation
- `src/index.css` — new `slotGlowPulse` keyframes (600ms emerald glow → fade)
  - `.slot-bind-glow` class applied alongside `.card-bind-snap`
  - reduced-motion media query disables both
- `src/components/game/BoundCardSlot.tsx` — adds `slot-bind-glow` class + `data-snap-glow` attribute when `snap` is true
- `src/components/game/presentation/buildBindSnapStep.ts` — `BIND_SNAP_MS` extended from 360→600ms to match glow duration

## Tests
- 147 unit tests pass
- E2E bind test passes (existing snap + new glow)