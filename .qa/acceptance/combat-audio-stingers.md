# Acceptance: Combat SFX Stingers (#16)

## Issue
Add combat SFX stingers service — timed SFX for Play, Block, Damage.

## Acceptance criteria
- [x] 3 stingers wired in CombatStage (play, block, damage)
- [x] Kein Sound ohne User-Geste (Policy) — AudioContext created lazily on first `onStart`
- [x] Mute respektiert (localStorage `letz-fetz-muted`)
- [x] Dokumentiert in acceptance doc

## Implementation
- `src/services/audio/combatStingers.ts` — Web Audio procedural stingers (no MP3 needed)
  - `playStinger(kind)` — oscillator + optional noise burst per stinger type
  - `playStingerSequence(kinds, intervalMs)` — chain stingers (block → damage)
  - `isMuted()` / `setMuted()` — localStorage-backed mute toggle
  - `unlockAudio()` — call on user gesture to satisfy autoplay policy
- `GameView.tsx` — stingers fire on combat state transitions:
  - `combat` null→non-null → "play" stinger (attack/challenge initiated)
  - `lastEvent` contains "Block" + "Schaden"/"zerstört" → "block" + "damage" sequence
  - `lastEvent` contains "Block" + "geblockt" → "block" stinger only
  - `unlockAudio()` called in `onStart` handler

## Tests
- Unit: `combatStingers.test.ts` (9 tests — mute state, play, sequence, unlock)
- E2E: existing combat tests still green