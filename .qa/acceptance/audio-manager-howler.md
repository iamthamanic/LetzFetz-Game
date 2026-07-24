# Feature: AudioManager + Howler + procedural adapters

<!-- refined by @implement from issue #79 -->

## Intent

Add Howler + adapters behind a single `AudioManager` public API, migrate clash timing and combat stingers into `src/services/audio`, wire Play callers, apply settings from SettingsProvider. Unit tests without a sound card.

**featureSlug:** `audio-manager-howler`

## Happy Path

- [ ] howler + @types/howler installed
- [ ] `audioManager` is sole public React API; adapters internal
- [ ] Clash + stingers under `src/services/audio/`; old play paths deleted
- [ ] PlayView / MatchIntro use AudioManager
- [ ] `applySettings` respects mute and master×category volume
- [ ] Unit tests pass without sound card; `npm run checks` green

## Edge Cases

- [ ] Autoplay unlock on gesture
- [ ] Missing clash MP3 fails soft
- [ ] Suspended AudioContext resume

## Security Coverage

- No API keys; static asset URLs only
- Out of scope: Auth, P2P, UGC validation

## Implementation Notes

- `src/services/audio/`: audioManager, howler + procedural adapters, clashSound, AudioSettingsSync
- Migrated play audio; deleted `features/play/services/audio/*`
- PlayView / MatchIntro call `audioManager` only
- howler + @types/howler added to package.json
