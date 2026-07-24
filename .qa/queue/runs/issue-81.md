# Issue #81 — sound-manifest-policy

## Phases
- implement: DONE — manifest, policy, registry, migrate clash to /audio/sfx/
- verify-ticket: PASS — npm run checks (build + 263 tests)
- verify-ui: SKIP — no UI surface
- review: ACCEPT — shared audio registry; no feature→feature; typed SoundId
- ecc-check: READY (pending commit)
- PR: pending

## Diff summary
- tools/audio-forge/sound-manifest.json + SOUND_POLICY.md + README
- public/sounds/card-clash.mp3 → public/audio/sfx/card-clash.mp3
- src/services/audio/soundRegistry.ts (+ tests)
- types SoundId first-wave; clashSound/howler use registry

## Acceptance
- Manifest lists first-wave IDs ✓
- Policy documents style + mute/volume ✓
- card.clash from public/audio; typed ID ✓
- npm run checks ✓
