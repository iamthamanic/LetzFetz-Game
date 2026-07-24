# Audio Forge

Offline sound pipeline for Letz Fetz. **Not** part of the Vite frontend bundle.

| File / package | Role |
|----------------|------|
| `sound-manifest.json` | First-wave IDs + status + prompts |
| `SOUND_POLICY.md` | Style, categories, mute/volume rules |
| `audio_forge/` | Python CLI + mock provider |
| `requirements.txt` | Dev/CI Python deps (stdlib-only for mock path) |

## Setup

```bash
cd tools/audio-forge
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Requires **Python 3.11+**. If `python3` is missing, npm scripts print a clear error.

## CLI (via npm stubs)

From repo root (`Letz-Fetz-Game/`):

```bash
npm run audio:help
npm run audio:generate -- --provider mock --id card.draw
npm run audio:test
```

Direct:

```bash
PYTHONPATH=tools/audio-forge python3 -m audio_forge --help
PYTHONPATH=tools/audio-forge python3 -m audio_forge generate --provider mock --id card.draw
```

## Providers

| Provider | Status |
|----------|--------|
| `mock` | Deterministic placeholder WAV + metadata (CI-safe) |
| `stable_audio_local` | Later issue — fail loud if missing |

## Manifest

Do not hardcode `/audio/...` paths in React. Runtime uses typed `SoundId` + `soundRegistry.ts`.
