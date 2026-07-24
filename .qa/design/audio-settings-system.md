# Design: Audio + Settings System (Audio Forge)

**Epic slug:** `audio-settings-forge`  
**Status:** READY for implement  
**Stack:** Vite + React 18 + Tailwind — local-first; no Next.js / DaisyUI  
**Binding:** `AGENTS.md`, `.cursor/rules/project-core.mdc`

## Problem & Intent

Play has ad-hoc audio (`features/play/services/audio/{clashSound,combatStingers}`) with a single mute key (`letz-fetz-muted`). Settings is notes/about only. There is no shared volume model, no typed sound IDs, no Howler layer, and no offline Audio-Forge pipeline for generating/mastering SFX.

**Intent:** Ship a local-first **GameSettings** model + **AudioManager** (Howler + procedural adapters) as shared services, a real Settings UI (Audio / Display / Gameplay / A11y), a sound manifest + policy, wire critical play SFX, and an offline Audio-Forge toolchain (audit → plan → generate → process → review → verify) — without putting API keys or generation in the frontend.

## Non-Goals

- Runtime cloud generation / API keys in the browser
- Music generation as a required epic deliverable (deferred / optional issue 10)
- Replacing Rules Engine timing or adding audio into `src/game/`
- Feature→feature imports or re-export stubs
- Hover/UI spam SFX
- Supabase/Appwrite as audio backends
- `transform: scale` for UI scale (use CSS vars / root font / data attributes)

## Assumptions

- Mute migration: read `letz-fetz-muted` once → map into `GameSettings.audio.muted` → persist `letz-fetz-settings` → delete old key.
- Architecture (binding): **AudioManager + settings persistence = shared** under `src/services/audio/` and `src/services/settings/`. Move play-owned audio into shared in the AudioManager issue; update imports; delete old paths; **no re-export stubs**.
- Settings UI may live in `src/features/settings/` with `App.tsx` as composition root (migrate cleanly from `features/shell/SettingsView`).
- Volume formula: `effective = master × category × baseVolume` (0 when muted).
- Sound style: rough, physical, dark, urban, industrial; worn cards; wood/concrete/metal/paper; short dry impacts; controlled glitch accents; no voices; no music in SFX prompts.
- First asset exists: `public/sounds/card-clash.mp3` → migrate under `public/audio/` per manifest.

## Options Considered

### Option A: Shared AudioManager + shared settings (recommended)

- Summary: `src/services/settings/` (model, storage, provider) + `src/services/audio/` (AudioManager, adapters, typed IDs). React only talks to AudioManager + SettingsProvider.
- Pros: Matches AGENTS shared-layer rules; one mute/volume path; play becomes a caller; forge tooling stays under `tools/`.
- Cons: One migration PR to move play audio.
- Evidence: Current mute key + play-only audio already leak across shell/settings needs.

### Option B: Keep audio under `features/play`

- Pros: Smaller first diff.
- Cons: Settings/shell cannot apply volume without feature→feature or stub; violates binding decision.

### Option C: Howler directly in components

- Pros: Fast demos.
- Cons: Violates “no Howler in React”; hard to test; mute races.

## Decision

**Chosen:** Option A  
**Why:** Binding architecture decision; KISS public API; SOLID (adapters); YAGNI (no runtime generation).

## Cross-Domain Sign-Off

| Domain | Status | Note |
|--------|--------|------|
| KISS | OK | One AudioManager public API; one settings key |
| SOLID | OK | Adapters behind AudioManager; display fullscreen adapter |
| DRY | OK | Typed IDs + manifest; no hardcoded paths in UI |
| Security | OK | No API keys in frontend; forge local-only; validate persisted JSON as `unknown` |
| UI/UX | OK | Deutsch UI; Styleguide primitives; no transform:scale |
| Scaling | OK | Manifest + forge pipeline scales asset count offline |
| Testability | OK | Vitest without sound card; Playwright for settings; Python mock provider |
| Maintainability | OK | Relocation deletes old paths; docs in `docs/audio-system.md` |

## Confidence

**85%** — Scope is large but cut into 9 ordered issues with clear deps.

## Architecture

```
App.tsx (composition root)
  └─ SettingsProvider  →  src/services/settings/
  └─ features/settings/SettingsView  (UI; may migrate from shell)
  └─ features/play/*  →  audioManager.play(id) / unlock / applySettings

src/services/audio/
  audioManager.ts          # ONLY public API for React
  howlerAudioAdapter.ts
  proceduralAudioAdapter.ts
  types.ts                 # SoundId, categories
  (migrated clash + stingers internals)

src/services/settings/
  types.ts / validate.ts / storage.ts / SettingsProvider.tsx

tools/audio-forge/         # Python — NOT in frontend bundle
  sound-manifest.json
  CLI: audit | plan | generate | process | review | verify
```

### Sound policy (summary)

- Typed IDs only (`card.clash`, `dice.roll`, …) — UI never hardcodes `/audio/...` paths.
- Categories: `sfx` | `ui` | `ambience` | `music` — each has a volume slider; master + mute.
- Cooldowns / one-shots for spam-prone events; **no hover spam**.
- Procedural adapters remain for stingers until mastered assets exist.
- Mute applies to HTMLMediaElement arena video as well (issue 5).

### First sound IDs (manifest; `planned` unless existing)

`card.draw`, `card.play`, `card.discard`, `card.reveal`, `card.destroy`, `card.shuffle`, `card.clash` (existing → migrate), `dice.roll`, `dice.settle`, `combat.attack`, `combat.block`, `combat.damage.light`, `combat.damage.heavy`, `combat.critical`, `ability.ready`, `ability.activate`, `ability.corrupt`, `round.start`, `round.end`, `match.victory`, `match.defeat`, `ui.click`, `ui.confirm`, `ui.cancel`, `ui.error`, `ui.invalid`, `ui.modal.open`, `ui.modal.close`, `ambience.arena.default`, `music.menu.main`, `music.match.default`

### Deferred

| Item | Notes |
|------|--------|
| Music generation / long-form loops | Optional issue 10; not in epic cut 1–9 |
| Stable Audio local hardware limits | Issue 8 installs locally; clear error if missing — no silent cloud fallback |
| Tauri FS settings | Same localStorage contract for now |
| Full ambience/music wiring in play | Manifest + volumes exist; playback wiring can stay minimal until assets approved |

## Issue table (1–9)

| # | Title | Priority | Depends | featureSlug |
|---|--------|----------|---------|-------------|
| 1 | Settings model, storage, mute migration, SettingsProvider | P0 | — | `settings-model-provider` |
| 2 | AudioManager + Howler + procedural adapters; migrate clash/stingers | P0 | #1 | `audio-manager-howler` |
| 3 | Settings UI + Display + Accessibility | P0 | #1,#2 | `settings-ui-display-a11y` |
| 4 | Sound manifest + policy + migrate card-clash paths | P1 | #2 | `sound-manifest-policy` |
| 5 | Wire critical play SFX via presentation queue + match flow | P1 | #2,#4 | `play-sfx-wiring` |
| 6 | Audio-Forge scaffold + mock provider + CLI | P1 | #4 | `audio-forge-scaffold` |
| 7 | audio:audit + audio:plan | P1 | #5,#6 | `audio-audit-plan` |
| 8 | audio:generate + audio:process | P2 | #6 | `audio-generate-process` |
| 9 | Review, integrate, verify + docs | P1 | #7,#8 | `audio-review-integrate-docs` |

## Implementation Sketch

1. Versioned `GameSettings` + migrate mute → provider in App.
2. Add howler; AudioManager; move play audio → shared; callers update.
3. Settings UI sections + displayService + Playwright.
4. Manifest + policy + `public/audio/` migration.
5. Presentation-queue / match-flow SFX (typed IDs, cooldowns).
6–9. Offline forge pipeline + docs; keep forge out of Vite bundle.

## Open Questions

- None blocking epic start. Music generation remains optional post-epic.

## Ready for /implement

YES — after GitHub issues 1–9 exist with `agent-ready` and Depends-on links.
