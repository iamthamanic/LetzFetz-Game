# Feature: Audio-Forge scaffold + mock provider + CLI (+ music beds)

**Issue:** #83  
**featureSlug:** `audio-forge-scaffold`  
**User addendum:** Pulsefront / Iron Surge music beds via AudioManager

## Intent

Scaffold Python Audio Forge (mock provider, CLI, npm stubs, tests) and register existing menu/match music under `public/audio/music/` with typed `playMusic` wiring.

## Happy Path

1. `npm run audio:help` / `audio:generate -- --provider mock --id card.draw` works.
2. `npm run audio:test` (pytest mock) passes.
3. `music.menu.main` / `music.match.default` resolve from registry; App switches beds menu ↔ play with fade.
4. Mute + music volume from settings apply; same bed does not restart on re-render.
5. `npm run checks` green; forge not in Vite deps.

## Implementation Notes

- Python package `tools/audio-forge/audio_forge/` + `bin/run.sh` + npm `audio:*` stubs.
- Copied Pulsefront → `public/audio/music/pulsefront.mp3`, Iron Surge → `iron-surge.mp3`.
- `HowlerAudioAdapter.playMusic` / `stopMusic`; `MusicBedSync` in App composition root.
