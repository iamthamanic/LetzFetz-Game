# Feature: Wire critical play SFX via presentation queue + match flow

**Issue:** #82  
**featureSlug:** `play-sfx-wiring`  
**Design:** `.qa/design/audio-settings-system.md`

## Intent

Map presentation-queue step starts and match-flow events to typed `SoundId`s via AudioManager, mute arena video with settings, apply cooldowns, no hover spam.

## Preconditions

- #79 AudioManager and #81 sound registry on `main`

## Happy Path

1. Presentation steps (draw/play/discard/attack/combat/damage) trigger typed SFX on step start.
2. Dice roll/settle, turn start, win/lose, invalid action fire via AudioManager.
3. Arena teaser video respects mute / ambience volume.
4. Rapid repeats are cooldown-suppressed.
5. `npm run checks` green.

## Edge Cases

- Missing planned assets → silent skip (no throw).
- Mute mid-match updates video + SFX.
- Double-firing same step → cooldown.

## Nicht-Ziele

- Generating assets; forge CLI; music beds; hover SFX.

## Security Coverage

| Item | Status |
|------|--------|
| B-04 Secrets | Out of scope — no keys |
| F-03 XSS | Out of scope — no HTML injection |

## Implementation Notes

- `playSfxBridge.ts` maps kinds → SoundIds; `audioManager.playWithCooldown`.
- `usePresentationQueue` fires `onStepStart` for every active step id change.
- MatchIntro arena video uses `useSettings` + `effectiveVolume(ambience)`.
- Combat stingers migrated to typed IDs; invalid/win/lose/dice/round.start wired.
