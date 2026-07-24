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

When `muted` is true, effective volume is **0** (includes file SFX, procedural stingers, and later arena video mute wiring).

## Playback rules

- Typed IDs only (`card.clash`, `dice.roll`, …)
- Cooldowns / one-shots for spam-prone events
- **No hover / UI spam SFX**
- Missing asset for a `planned` ID → silent skip (no throw)
- Procedural adapters may stand in until mastered assets are approved

## Manifest statuses

| Status | Meaning |
|--------|---------|
| `existing` | File present under `public/audio/` and registered for runtime |
| `planned` | Listed for forge pipeline; not required at runtime yet |
| `approved` | (later) Reviewed and allowed in the runtime registry |

## Legacy

- Old path: `public/sounds/card-clash.mp3` → migrated to `public/audio/sfx/card-clash.mp3`
- Do not reintroduce `/sounds/` URLs
