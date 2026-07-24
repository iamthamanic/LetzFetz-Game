# Sound Policy — Letz Fetz

Offline Audio-Forge contract. Runtime playback goes through typed `SoundId`s and `audioManager` only — never hardcode `/audio/...` paths in React UI.

## Style

- Rough, physical, dark, urban, industrial
- Worn cards; wood / concrete / metal / paper materials
- Short, dry impacts; controlled glitch accents only
- **No voices**
- **No music beds inside SFX prompts** (music IDs are separate category)

## Categories

| Category | Volume slider | Typical IDs |
|----------|---------------|-------------|
| `sfx` | Settings → Audio → SFX | cards, dice, combat, abilities, round/match |
| `ui` | Settings → Audio → UI | click, confirm, cancel, error, modal |
| `ambience` | Settings → Audio → Ambience | arena loops |
| `music` | Settings → Audio → Music | menu / match beds |

## Volume & mute

```
effective = master × category × baseVolume
```

When `muted` is true, effective volume is **0** (includes file SFX, procedural stingers, and arena video mute wiring).

## Playback rules

- Typed IDs only (`card.clash`, `dice.roll`, …)
- Cooldowns / one-shots for spam-prone events
- **No hover / UI spam SFX**
- Missing asset for a `planned` ID → silent skip (no throw)
- Procedural adapters may stand in until mastered assets are approved
- **Runtime file URLs are approved-only** (`soundRegistry` + Howler)

## Manifest statuses

| Status | Meaning |
|--------|---------|
| `planned` | Listed for forge pipeline; not required at runtime yet |
| `approved` | Reviewed; file under `public/audio/` and registered for runtime |
| `existing` | Legacy alias of approved (still accepted by `audio:verify`) |

## Approval gate

1. Generate + process candidates (`audio:generate` / `audio:process`)
2. Open static review HTML (`audio:review` → `tools/audio-forge/review/index.html`)
3. Copy web master into `public/audio/…`, set manifest `status: approved` + `publicPath`
4. Mirror URL in `soundRegistry.ts`
5. `audio:verify` must exit 0

## Legacy

- Old path: `public/sounds/card-clash.mp3` → migrated to `public/audio/sfx/card-clash.mp3`
- Do not reintroduce `/sounds/` URLs

## Docs

See [`docs/audio-system.md`](../../docs/audio-system.md) for architecture + CLI.
