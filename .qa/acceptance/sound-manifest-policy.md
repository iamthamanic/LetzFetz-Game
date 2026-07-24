# Feature: Sound manifest + policy + migrate card-clash paths

**Issue:** #81  
**featureSlug:** `sound-manifest-policy`  
**Design:** `.qa/design/audio-settings-system.md`

## Intent

Centralize first-wave sound IDs in `tools/audio-forge/sound-manifest.json`, document sound policy (style, categories, mute/volume), migrate `card-clash` to `public/audio/`, and resolve playback via typed IDs — no hardcoded `/audio/...` or `/sounds/...` paths in UI.

## Preconditions

- #79 AudioManager / Howler merged on `main`
- Existing asset was at `public/sounds/card-clash.mp3`

## Happy Path

1. Developer opens `tools/audio-forge/sound-manifest.json` and sees all first-wave IDs with `status` (`existing` | `planned`).
2. `card.clash` resolves to `/audio/sfx/card-clash.mp3` via the sound registry.
3. Policy doc states style, categories, volume formula, mute, no-voice / no-music-in-SFX.
4. Callers use `SoundId` / `audioManager.play(...)` only; legacy `/sounds/` path is gone.
5. `npm run checks` green.

## Edge Cases

- Missing file for a `planned` ID → play is a no-op (no throw).
- Duplicate IDs in manifest → validation rejects (test coverage).
- UI must not hardcode public audio URLs.

## Nicht-Ziele

- Generating new assets; full play SFX wiring (#82); Python forge CLI (#83).

## Security Coverage

| Item | Status |
|------|--------|
| F-03 XSS / unsafe HTML | Out of scope — no user HTML |
| B-01 Auth | Out of scope — no backend |
| B-04 Secrets | PASS — no API keys; forge stays offline tools |
| P-04 Sensitive data in logs | Out of scope — static assets only |

## Regression

- MatchIntro clash timing still uses `CLASH_IMPACT_FRACTION` / `playClashAt`
- Settings mute / volume still applied via AudioManager

## Assumptions

- Public URL for clash: `/audio/sfx/card-clash.mp3`
- Manifest is the forge contract; runtime registry mirrors approved/existing paths only

## Screenshots

N/A — no UI surface in this slice.

## Implementation Notes

- Added `tools/audio-forge/sound-manifest.json` (31 first-wave IDs) + `SOUND_POLICY.md` + stub README.
- Migrated `public/sounds/card-clash.mp3` → `public/audio/sfx/card-clash.mp3`; removed `/sounds/`.
- New `soundRegistry.ts` resolves typed IDs; `clashSound` / Howler use registry URLs.
- Expanded `SoundId` union to full first wave; Vitest covers registry ↔ manifest sync.
