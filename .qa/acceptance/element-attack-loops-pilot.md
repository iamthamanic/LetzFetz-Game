# Acceptance: Pilot Element Attack Loop Video Assets (#20)

## Issue
Add pilot element attack loop video assets — 1 per element (6 total) for card-play zone.

## Acceptance criteria
- [x] 6 Element-Attack-Clips dokumentiert (prompts + manifest entries)
- [x] Manifest-Einträge (ELEMENT_ATTACK_VIDEO_MANIFEST + resolveElementAttackVideoPath)
- [x] Fallback wenn fehlt (resolveCardVideoPath returns '' → static art, CardIllustrationLoop handles gracefully)

## Implementation
- `src/services/cardArt/prompts/elementAttackVideos.ts` — 6 element attack loop video prompts (5s each)
  - `ELEMENT_ATTACK_VIDEO_PROMPTS` — Record<Element, prompt>
  - `elementAttackVideoKey()` / `elementAttackVideoPrompt()` helpers
- `src/services/cardArt/prompts/cardVideos.ts` — `CardVideoKind` extended with `'element-attack'`
  - `cardVideoKindForId()` now recognizes `fire-attack-*` etc.
- `src/services/cardArt/manifest.ts` — `resolveElementAttackVideoPath()` + `ELEMENT_ATTACK_VIDEO_MANIFEST`
- Output paths: `/videos/element-attack/{element}-attack.mp4`

## Note
Video assets themselves are generated via Higgsfield/Seedance batch using the prompts.
This PR provides the manifest, prompts, and resolution logic — the actual MP4 files
are generated separately and placed in `public/videos/element-attack/`.

## Tests
- 156 unit tests pass (7 new element-attack + manifest tests)