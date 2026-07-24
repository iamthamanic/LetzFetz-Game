# Intake: Audio + Settings Forge — Issue Draft

**Epic slug:** `audio-settings-forge`  
**Design:** [audio-settings-system.md](../design/audio-settings-system.md)  
**Status:** READY — create GitHub issues 1–9 in order  
**Stack assumption:** Vite + React 18 + Tailwind; local-first; `AGENTS.md` binding.

## Epic Cut / Deferred

- No runtime cloud generation; no API keys in frontend.
- Music generation / long-form loops → optional issue 10 (not in this cut).
- No Howler imports in React components; no hardcoded sound paths in UI.
- No `transform: scale` for UI scale; no hover-spam SFX.
- No Rules Engine / `src/game/` audio coupling.
- No re-export stubs on relocation.

## Slice Order

| # | Title | Priority | featureSlug | dependsOn |
|---|-------|----------|-------------|-----------|
| 1 | Settings model, storage, mute migration, SettingsProvider | P0 | `settings-model-provider` | — |
| 2 | AudioManager + Howler + procedural adapters; migrate clash/stingers | P0 | `audio-manager-howler` | #1 |
| 3 | Settings UI + Display + Accessibility | P0 | `settings-ui-display-a11y` | #1,#2 |
| 4 | Sound manifest + policy + migrate card-clash paths | P1 | `sound-manifest-policy` | #2 |
| 5 | Wire critical play SFX via presentation queue + match flow | P1 | `play-sfx-wiring` | #2,#4 |
| 6 | Audio-Forge scaffold + mock provider + CLI | P1 | `audio-forge-scaffold` | #4 |
| 7 | audio:audit + audio:plan | P1 | `audio-audit-plan` | #5,#6 |
| 8 | audio:generate + audio:process | P2 | `audio-generate-process` | #6 |
| 9 | Review, integrate, verify + docs | P1 | `audio-review-integrate-docs` | #7,#8 |

---

## 1. Settings model, storage, mute migration, SettingsProvider

- **Priority:** P0
- **Labels:** `P0`, `agent-ready`
- **Depends on:** —
- **Feature slug:** `settings-model-provider`

### Body

## Intent

Introduce a versioned `GameSettings` model, persist it under `letz-fetz-settings`, migrate legacy `letz-fetz-muted` once then delete that key, and mount a `SettingsProvider` in `App.tsx`. No full Settings UI yet.

## User Journey

1. Developer loads the app; settings hydrate from localStorage or defaults.
2. Existing users with `letz-fetz-muted=1` keep mute after upgrade; old key is gone.
3. Settings can be read/updated via provider context for later UI and AudioManager.

## Problem

Mute lives only as `letz-fetz-muted` inside play audio modules. There is no shared settings model, validation, or provider — Settings screen cannot grow without ad-hoc keys.

## Solution

- Add `src/services/settings/` with types, validate (parse `unknown`), storage load/save, defaults, mute migration.
- Storage key: `letz-fetz-settings` (versioned). On first load: if legacy mute key present, map into `audio.muted`, save new record, remove `letz-fetz-muted`.
- `SettingsProvider` wraps the app in `App.tsx` (composition root). Context is OK as provider pattern (hooks remain useState/useRef/useEffect inside).
- Vitest: defaults, validate valid/invalid, load/save, migrate-once semantics.
- No full Settings UI in this issue.

## Runtime

| Axis | This slice |
|------|------------|
| Local web | localStorage settings |
| Cloud-hosted web | Same browser-local |
| Tauri | Same WebView localStorage for now |

## Edge Cases

- Missing / corrupt / wrong-version JSON → defaults (no crash).
- Legacy mute `0` / `1` / absent; migrate only once.
- localStorage blocked → in-memory defaults; app stays usable.
- Concurrent tabs: last-write-wins acceptable for MVP.

## Nicht-Ziele

- Full Settings UI sections, display fullscreen, Howler, sound files.
- Feature→feature imports.

## Acceptance

- [ ] `GameSettings` versioned model + `letz-fetz-settings` load/save/validate.
- [ ] Legacy `letz-fetz-muted` migrated once then deleted.
- [ ] `SettingsProvider` mounted from `App.tsx`.
- [ ] Vitest covers defaults / validate / load / save / migrate.
- [ ] Touched files: no `any`, no `@ts-*` suppressions (`@typed-strict`).
- [ ] `npm run checks` green.

## Design

Epic: `.qa/design/audio-settings-system.md`

## Runner

Labels: P0, agent-ready  
Feature slug: `settings-model-provider`

---

## 2. AudioManager + Howler + procedural adapters; migrate clash/stingers

- **Priority:** P0
- **Labels:** `P0`, `agent-ready`
- **Depends on:** Settings model / SettingsProvider issue
- **Feature slug:** `audio-manager-howler`

### Body

## Intent

Add Howler + adapters behind a single `AudioManager` public API, migrate clash timing and combat stingers from `features/play/services/audio` into `src/services/audio`, wire callers, and apply settings from the provider. Unit tests must run without a sound card.

## User Journey

1. Play / MatchIntro call `audioManager` (unlock, play clash, stingers) — no direct Howler.
2. Mute/volume from settings affect playback via `applySettings`.
3. Old play audio paths are gone (no stubs).

## Problem

Audio is play-owned, mute is a private key, and there is no Howler adapter or shared API — settings and future SFX cannot share one pipeline.

## Solution

- `npm i howler` + `@types/howler`.
- `src/services/audio/`: `audioManager` (ONLY public React API), `howlerAudioAdapter`, `proceduralAudioAdapter`, types.
- Migrate `clashSound` sample-accurate scheduling + `combatStingers`; update `PlayView` / `MatchIntro` imports; **delete** `features/play/services/audio/**` in the same change (no re-exports).
- `applySettings` from SettingsProvider changes.
- Volume: `master × category × baseVolume`; muted → silent.
- Vitest without requiring audio hardware (mock adapters / jsdom-safe).

## Runtime

| Axis | This slice |
|------|------------|
| Local web | Howler + Web Audio procedural |
| CI | Unit tests with mocks; no sound card |

## Edge Cases

- Autoplay policy: unlock on user gesture.
- Missing clash MP3: fail soft (no throw).
- Suspended AudioContext resume.
- Settings change mid-play updates gains / mute.

## Nicht-Ziele

- Full sound manifest, forge CLI, Settings UI sections, wiring all play events.

## Acceptance

- [ ] howler + types installed; AudioManager is sole public API for React.
- [ ] Clash timing + stingers live under `src/services/audio/`; old play paths deleted; callers updated.
- [ ] Settings applied via provider; mute/volume respected.
- [ ] Unit tests pass without sound card.
- [ ] `@typed-strict`; `npm run checks` green.

## Design

Epic: `.qa/design/audio-settings-system.md`

## Blockers

Depends on settings-model-provider

## Runner

Labels: P0, agent-ready  
Feature slug: `audio-manager-howler`

---

## 3. Settings UI + Display + Accessibility

- **Priority:** P0
- **Labels:** `P0`, `agent-ready`
- **Depends on:** settings-model-provider, audio-manager-howler
- **Feature slug:** `settings-ui-display-a11y`

### Body

## Intent

Ship Settings sections Audio / Display / Gameplay / Accessibility, displayService + browser fullscreen adapter, CSS vars / data attributes for scale/contrast, a test-sound control, and Playwright coverage for mute/slider/persist/reset. Migrate Settings UI cleanly (shell → `features/settings` allowed; App composition root).

## User Journey

1. User opens Settings; adjusts mute, master/category volumes, UI scale, reduced motion, high contrast.
2. Test sound plays via AudioManager.
3. Reload keeps preferences; Reset restores defaults.
4. Fullscreen toggle works when browser allows.

## Problem

Settings is notes/about only; no display/a11y controls; mute cannot be managed outside play code paths.

## Solution

- Settings UI sections with Styleguide primitives (`components/ui/`); German labels.
- `displayService` + browser fullscreen adapter; UI scale via CSS variables / `data-*` — **never** `transform: scale` for the whole UI.
- Wire AudioManager test sound; persist via SettingsProvider.
- Playwright: mute, slider, persist across reload, reset.
- Migrate from `features/shell/SettingsView` → `features/settings/` (or equivalent) without feature→feature imports; update `App.tsx`; delete old path.

## Runtime

| Axis | This slice |
|------|------------|
| Local web | Fullscreen + CSS vars |
| Mobile | Fullscreen may no-op gracefully |

## Edge Cases

- Fullscreen denied / unsupported.
- Slider extremes 0 and 1.
- Reset while muted and scaled.
- Prefers-reduced-motion OS + in-app toggle interaction.

## Nicht-Ziele

- Sound manifest forge; generating assets; wiring all play SFX.

## Acceptance

- [ ] Sections Audio / Display / Gameplay / A11y present and Deutsch.
- [ ] displayService + fullscreen adapter; no UI `transform: scale`.
- [ ] Test sound works; mute/volume persist; reset works.
- [ ] Playwright covers mute / slider / persist / reset.
- [ ] Clean Settings relocation; `npm run checks` green.

## Design

Epic: `.qa/design/audio-settings-system.md`

## Blockers

Depends on settings-model-provider and audio-manager-howler

## Runner

Labels: P0, agent-ready  
Feature slug: `settings-ui-display-a11y`

---

## 4. Sound manifest + policy + migrate card-clash paths

- **Priority:** P1
- **Labels:** `P1`, `agent-ready`
- **Depends on:** audio-manager-howler
- **Feature slug:** `sound-manifest-policy`

### Body

## Intent

Add `tools/audio-forge/sound-manifest.json` with §18 IDs (planned/existing), document sound policy, and move/copy `card-clash` under `public/audio/` with source/legacy notes. Update AudioManager paths to typed IDs — no hardcoded UI paths.

## User Journey

1. Developer opens manifest and sees all first-wave IDs with status.
2. `card.clash` resolves to the migrated public audio path.
3. Policy doc states style, categories, mute formula, no-voice / no-music-in-SFX.

## Problem

Clash URL is hardcoded (`/sounds/card-clash.mp3`); no central inventory or generation contract for forge.

## Solution

- Create `tools/audio-forge/sound-manifest.json` with IDs listed in design (status `planned` unless existing).
- Sound policy markdown under `tools/audio-forge/` or `docs/` (epic final docs land in issue 9; policy stub OK here).
- Move/copy asset to `public/audio/…`; keep or redirect legacy `/sounds/` only if needed for one release — prefer update callers and remove dead path.
- AudioManager / registry resolves by typed ID.

## Runtime

| Axis | This slice |
|------|------------|
| Local / CI | Static files + JSON manifest |

## Edge Cases

- Missing file for planned ID → no throw on play.
- Duplicate IDs rejected by schema/validation if present.

## Nicht-Ziele

- Generating new assets; full play wiring; Python forge CLI (issue 6).

## Acceptance

- [ ] Manifest lists all first-wave IDs with status.
- [ ] Policy documents style + volume/mute rules.
- [ ] `card.clash` served from `public/audio/`; callers use typed ID.
- [ ] `npm run checks` green.

## Design

Epic: `.qa/design/audio-settings-system.md`

## Blockers

Depends on audio-manager-howler

## Runner

Labels: P1, agent-ready  
Feature slug: `sound-manifest-policy`

---

## 5. Wire critical play SFX via presentation queue + match flow

- **Priority:** P1
- **Labels:** `P1`, `agent-ready`
- **Depends on:** audio-manager-howler, sound-manifest-policy
- **Feature slug:** `play-sfx-wiring`

### Body

## Intent

Map presentation-queue `onStepComplete` kinds and match-flow events to typed sound IDs (dice, turn start, win/lose, invalid action, etc.), respect mute for arena video, apply cooldowns, and avoid hover spam.

## User Journey

1. During a match, key actions produce SFX through AudioManager.
2. Global mute silences SFX and arena video.
3. Rapid repeated events do not spam (cooldowns).

## Problem

Only clash + a few stingers fire; presentation steps and match outcomes are silent; video ignores mute.

## Solution

- Wire `onStepComplete` kind → typed IDs; dice roll/settle; TurnStart; win/lose; invalid action; ability/combat as available.
- Arena video respects mute (and preferably master/music-or-ambience category if applicable).
- Cooldown / dedupe for spam-prone kinds; **no hover SFX**.
- Prefer existing presentation queue hooks; keep engine free of audio.

## Runtime

| Axis | This slice |
|------|------------|
| Local play | SFX via AudioManager |

## Edge Cases

- Missing assets: silent skip.
- Mute toggled mid-match.
- Double-firing same step.

## Nicht-Ziele

- Generating missing WAV/MP3; forge CLI; music beds required.

## Acceptance

- [ ] Critical play events map to typed IDs via AudioManager.
- [ ] Arena video respects mute.
- [ ] Cooldowns; no hover spam.
- [ ] `npm run checks` green; focused tests where practical.

## Design

Epic: `.qa/design/audio-settings-system.md`

## Blockers

Depends on audio-manager-howler and sound-manifest-policy

## Runner

Labels: P1, agent-ready  
Feature slug: `play-sfx-wiring`

---

## 6. Audio-Forge scaffold + mock provider + CLI

- **Priority:** P1
- **Labels:** `P1`, `agent-ready`
- **Depends on:** sound-manifest-policy
- **Feature slug:** `audio-forge-scaffold`

### Body

## Intent

Scaffold Python package under `tools/audio-forge/` with `requirements.txt`, README, mock provider, CLI entrypoints, npm script stubs, and Python tests using the mock (CI-friendly).

## User Journey

1. Developer runs forge CLI help / mock generate against planned IDs.
2. CI runs Python tests with mock — no GPU / paid API.

## Problem

No offline toolchain exists to eventually fill the manifest.

## Solution

- Python package layout under `tools/audio-forge/`.
- Mock provider returns deterministic placeholder audio or metadata.
- CLI skeleton; npm scripts as stubs pointing at the Python module.
- Ensure forge deps stay out of the Vite frontend bundle.

## Runtime

| Axis | This slice |
|------|------------|
| Dev / CI | Python + mock |

## Edge Cases

- Missing Python / venv → clear error message.
- Empty manifest handling.

## Nicht-Ziele

- Real Stable Audio generation (issue 8); audit AST (issue 7); review HTML (issue 9).

## Acceptance

- [ ] Package + requirements + README + mock provider + CLI.
- [ ] npm script stubs present.
- [ ] Python tests with mock pass.
- [ ] Frontend bundle unchanged regarding forge deps.

## Design

Epic: `.qa/design/audio-settings-system.md`

## Blockers

Depends on sound-manifest-policy

## Runner

Labels: P1, agent-ready  
Feature slug: `audio-forge-scaffold`

---

## 7. audio:audit + audio:plan

- **Priority:** P1
- **Labels:** `P1`, `agent-ready`
- **Depends on:** play-sfx-wiring, audio-forge-scaffold
- **Feature slug:** `audio-audit-plan`

### Body

## Intent

AST-based `audio:audit` reporting typed ID usage vs manifest, with clear exit codes; `audio:plan` only adds planned entries without overwriting curated prompts.

## User Journey

1. Developer runs audit → report of used / missing / unused IDs.
2. Plan adds missing planned rows; curated prompt text preserved.

## Problem

No automated inventory of code IDs vs manifest.

## Solution

- AST (or equivalent static) scan of TS/TSX for sound ID literals / AudioManager calls.
- Report + exit codes (e.g. missing assets vs clean).
- Plan merges new planned entries only; never clobber curated prompts.

## Runtime

| Axis | This slice |
|------|------------|
| Dev / CI | Node and/or Python CLI via npm scripts |

## Edge Cases

- Dynamic IDs / non-literal: documented limitation in report.
- Empty codebase usage.

## Nicht-Ziele

- Generation / FFmpeg processing.

## Acceptance

- [ ] `audio:audit` produces report + exit codes.
- [ ] `audio:plan` adds planned entries without overwriting curated prompts.
- [ ] Documented in forge README; tests cover merge behavior.

## Design

Epic: `.qa/design/audio-settings-system.md`

## Blockers

Depends on play-sfx-wiring and audio-forge-scaffold

## Runner

Labels: P1, agent-ready  
Feature slug: `audio-audit-plan`

---

## 8. audio:generate + audio:process

- **Priority:** P2
- **Labels:** `P2`, `agent-ready`
- **Depends on:** audio-forge-scaffold
- **Feature slug:** `audio-generate-process`

### Body

## Intent

Provider adapter `stable_audio_local` with a clear install error (no silent cloud fallback); FFmpeg process step producing masters + web formats; mock path works in CI.

## User Journey

1. With local model installed: generate candidates for planned IDs.
2. Without model: explicit install error — never silent cloud call.
3. Process step normalizes to masters + web formats via FFmpeg.
4. CI uses mock generate + process fixtures.

## Problem

Scaffold has no real/local provider adapter or mastering step.

## Solution

- `stable_audio_local` adapter; fail loud if missing.
- FFmpeg process pipeline; masters + web formats under forge output dirs.
- Mock continues to work for CI.

## Runtime

| Axis | This slice |
|------|------------|
| Local GPU/CPU | Optional Stable Audio |
| CI | Mock only |

## Edge Cases

- FFmpeg missing → clear error.
- Partial batch failure per ID.

## Nicht-Ziele

- Auto-approving into runtime registry (issue 9); cloud paid APIs as default.

## Acceptance

- [ ] Local provider adapter + clear missing-install error (no silent cloud).
- [ ] FFmpeg process produces masters + web formats.
- [ ] Mock works in CI; tests green.
- [ ] No secrets / API keys required for default path.

## Design

Epic: `.qa/design/audio-settings-system.md`

## Blockers

Depends on audio-forge-scaffold

## Runner

Labels: P2, agent-ready  
Feature slug: `audio-generate-process`

---

## 9. Review, integrate, verify + docs

- **Priority:** P1
- **Labels:** `P1`, `agent-ready`
- **Depends on:** audio-audit-plan, audio-generate-process
- **Feature slug:** `audio-review-integrate-docs`

### Body

## Intent

Ship static review HTML, ensure runtime registry only includes approved assets, add `audio:verify`, write `docs/audio-system.md`, and confirm forge dependencies never enter the frontend bundle.

## User Journey

1. Designer/dev opens review HTML for candidates.
2. Approved IDs land in the runtime registry; verify CLI confirms integrity.
3. Docs explain architecture, policy, forge commands, and hardware limits.

## Problem

No approval gate or end-to-end docs; risk of shipping unapproved or forge-coupled frontend code.

## Solution

- Static review HTML under tools/audio-forge (or docs artifact).
- Registry loads only approved entries.
- `audio:verify` checks manifest ↔ files ↔ registry consistency.
- `docs/audio-system.md` (DE/EN pointers as needed).
- Bundle check / documentation that forge is tools-only.

## Runtime

| Axis | This slice |
|------|------------|
| Dev | Review + verify |
| Prod web | Approved static audio only |

## Edge Cases

- Approved ID missing file → verify fails.
- Unapproved file present but not registered → OK / warned per policy.

## Nicht-Ziele

- Mandatory music generation; rewriting Settings/AudioManager architecture.

## Acceptance

- [ ] Static review HTML available.
- [ ] Runtime registry = approved only.
- [ ] `audio:verify` works with clear exit codes.
- [ ] `docs/audio-system.md` written; forge not in frontend bundle.
- [ ] `npm run checks` green.

## Design

Epic: `.qa/design/audio-settings-system.md`

## Blockers

Depends on audio-audit-plan and audio-generate-process

## Runner

Labels: P1, agent-ready  
Feature slug: `audio-review-integrate-docs`
