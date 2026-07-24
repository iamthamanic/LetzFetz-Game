# Audio Forge (scaffold stub)

Offline sound inventory for Letz Fetz. Python CLI lands in a later issue.

| File | Role |
|------|------|
| `sound-manifest.json` | First-wave IDs + status + prompts |
| `SOUND_POLICY.md` | Style, categories, mute/volume, playback rules |

Runtime resolution: `src/services/audio/soundRegistry.ts` (typed `SoundId` → public URL).
