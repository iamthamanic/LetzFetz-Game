# Audio Forge

Offline sound pipeline for Letz Fetz. **Not** part of the Vite frontend bundle.

| File / package | Role |
|----------------|------|
| `sound-manifest.json` | First-wave IDs + status + prompts |
| `SOUND_POLICY.md` | Style, categories, mute/volume rules |
| `audio_forge/` | Python CLI + providers + FFmpeg process |
| `requirements.txt` | Dev/CI Python deps (stdlib-only for mock path) |

## Setup

```bash
cd tools/audio-forge
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Requires **Python 3.11+**. Process step also needs **FFmpeg** on `PATH`.

If `python3` is missing, npm scripts print a clear error.

## CLI (via npm stubs)

From repo root (`Letz-Fetz-Game/`):

```bash
npm run audio:help
npm run audio:audit
npm run audio:plan -- --dry-run
npm run audio:generate -- --provider mock --id card.draw
npm run audio:process -- --id card.draw
npm run audio:test
```

### Exit codes (`audio:audit`)

| Code | Meaning |
|------|---------|
| 0 | Clean — used IDs are in the manifest; existing/approved files present |
| 1 | Used ID missing from manifest and/or existing asset file missing |
| 2 | Manifest / CLI error |

### `audio:plan`

Adds **planned** rows for literal IDs found in `src/` that are missing from the manifest. **Never** overwrites curated `prompt` (or other fields) on existing entries.

### `audio:generate`

| Flag | Meaning |
|------|---------|
| `--provider mock` | Deterministic placeholder WAV (default, CI-safe) |
| `--provider stable_audio_local` | Local model only — **fails loud** if not installed |
| `--id` / `--ids` | One id or comma-separated batch |

`stable_audio_local` never calls paid cloud APIs. Configure a local command:

```bash
export AUDIO_FORGE_STABLE_AUDIO_CMD='my-local-infer --prompt {prompt} --out {out}'
npm run audio:generate -- --provider stable_audio_local --id card.draw
```

Placeholders: `{prompt}` `{out}` `{id}` (shell-quoted by the adapter).

### `audio:process`

Requires FFmpeg. Reads candidates → writes:

| Dir | Contents |
|-----|----------|
| `tools/audio-forge/output/masters/` | Loudnorm master WAV |
| `tools/audio-forge/output/web/` | `.mp3` + `.ogg` |

```bash
npm run audio:process -- --id card.draw
npm run audio:process -- --id card.draw --input path/to/candidate.wav
```

Direct:

```bash
PYTHONPATH=tools/audio-forge python3 -m audio_forge --help
PYTHONPATH=tools/audio-forge python3 -m audio_forge generate --provider mock --id card.draw
PYTHONPATH=tools/audio-forge python3 -m audio_forge process --id card.draw
```

## Providers

| Provider | Status |
|----------|--------|
| `mock` | Deterministic placeholder WAV (CI-safe, no GPU/API) |
| `stable_audio_local` | Local only — clear install error if missing; **no** cloud fallback |

## Manifest

Do not hardcode `/audio/...` paths in React. Runtime uses typed `SoundId` + `soundRegistry.ts`.
