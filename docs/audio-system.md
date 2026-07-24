# Audio system — Letz Fetz

Local-first audio architecture for playtest: typed sound IDs, Settings volumes, Howler/procedural adapters, and an offline **Audio Forge** toolchain. Forge code never ships in the Vite frontend bundle.

## Runtime (browser)

```
App → SettingsProvider → AudioManager (only public API for React)
         ↓
   howlerAudioAdapter / proceduralAudioAdapter
         ↓
   soundRegistry.ts  →  publicUrl only for status=approved
         ↓
   public/audio/**  (static files)
```

| Piece | Path | Notes |
|-------|------|--------|
| Settings model | `src/services/settings/` | master + category volumes + mute |
| AudioManager | `src/services/audio/audioManager.ts` | `play` / `playMusic` / `unlock` / `applySettings` |
| Registry | `src/services/audio/soundRegistry.ts` | Typed `SoundId`; **approved-only** file URLs |
| Manifest (source of truth for IDs) | `tools/audio-forge/sound-manifest.json` | Offline forge + policy |

**Rules**

- UI never hardcodes `/audio/...` paths — use `audioManager.play(id)`.
- `planned` IDs may be referenced in code; missing files → silent skip.
- Procedural stingers (combat) until mastered assets are approved.
- Mute applies via Settings (and arena video mute wiring where implemented).

## Sound policy (summary)

Full text: [`tools/audio-forge/SOUND_POLICY.md`](../tools/audio-forge/SOUND_POLICY.md)

- Style: rough, physical, dark, urban, industrial; no voices; no music inside SFX prompts.
- Volume: `effective = master × category × baseVolume` (0 when muted).
- Categories: `sfx` | `ui` | `ambience` | `music`.

### Manifest statuses

| Status | Runtime file URL? | Meaning |
|--------|-------------------|---------|
| `planned` | No | Forge pipeline target |
| `approved` | Yes | Reviewed; file under `public/audio/` + registry URL |
| `existing` | Yes (legacy alias) | Treated like approved by `audio:verify` |

## Audio Forge (tools only)

Package: `tools/audio-forge/` — Python 3.11+, **not** imported by Vite.

```bash
cd tools/audio-forge && python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

| npm script | Role |
|------------|------|
| `audio:audit` | Code `SoundId` literals vs manifest |
| `audio:plan` | Add missing planned rows (never overwrite prompts) |
| `audio:generate` | Candidates (`mock` or `stable_audio_local`) |
| `audio:process` | FFmpeg → masters + web mp3/ogg |
| `audio:review` | Static HTML review sheet |
| `audio:verify` | Manifest ↔ files ↔ registry + forge-not-in-bundle checks |
| `audio:test` | pytest |

### Generate / process

- Default CI path: `--provider mock` (no GPU, no API keys).
- `stable_audio_local`: set `AUDIO_FORGE_STABLE_AUDIO_CMD` with `{prompt}` `{out}` `{id}` — **never** silent cloud fallback.
- Process requires **FFmpeg** on `PATH`.

### Review → approve → verify

1. `npm run audio:generate -- --provider mock --id card.draw`
2. `npm run audio:process -- --id card.draw`
3. `npm run audio:review` → open `tools/audio-forge/review/index.html`
4. Copy mastered web file into `public/audio/...`, set manifest `status` to `approved` + `publicPath`, update `soundRegistry.ts`
5. `npm run audio:verify` (exit 0)

### `audio:verify` exit codes

| Code | Meaning |
|------|---------|
| 0 | OK (extra unregistered public files → warnings only) |
| 1 | Integrity failure (missing approved file, registry mismatch, forge deps in package.json, etc.) |
| 2 | Manifest / CLI error |

## Hardware limits (local generation)

| Path | Requirement |
|------|-------------|
| Mock | None (stdlib WAV) |
| `stable_audio_local` | Local GPU/CPU + configured command; optional `stable_audio_tools` import |
| Process | FFmpeg |
| Music generation | Optional / deferred — not required for playtest |

## Bundle isolation

- No `audio-forge` / `audio_forge` / `stable-audio` packages in `package.json` dependencies.
- App `src/` must not import the Python package; tests may **read** `sound-manifest.json` as data.
- `audio:verify` enforces the above.

## Related

- Design: `.qa/design/audio-settings-system.md`
- Epic issues: `.qa/intake/audio-settings-forge-issues.md`
- Styleguide: `docs/UI_STYLEGUIDE.md` (Settings UI Deutsch)
