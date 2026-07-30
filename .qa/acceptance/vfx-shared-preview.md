# Acceptance — vfx-shared-preview

<!-- seeded from issue #257 — Shared Three.js + Effekseer preview -->

## Intent

Shared preview viewport for VFX Studio (Formula Pipeline) and Build → Combinate: Three.js scene plus Effekseer preset adapter. One working Aura stand-in until committed `.efkefc` files exist under `public/vfx/effects/`.

## User Journey

1. Open Build → **VFX Studio** → **Formeln** — preview shows Aura effect with timeline scrub.
2. Open Build → **Combinate** — same preview component in center pane.
3. Scrub timeline; hero-frame ms updates.
4. Missing `.efkefc` → German placeholder label, particle stand-in, no crash.

## Problem

No unified VFX preview; Combinate and Studio use placeholders.

## Solution

- `VfxSharedPreview` under `src/features/build/vfx/preview/`
- R3F canvas (patterns from `BuildOrbitCanvas`)
- Effekseer adapter interface + stub; `@zaniar/effekseer-webgl-wasm` documented for future wiring (MIT)
- Default preset Aura at `/vfx/effects/aura.efkefc`
- `public/vfx/effects/README.md` for real asset commits

## Runtime

| Axis | This slice |
|------|------------|
| Local (desktop) | yes |

## Edge Cases

- Tab hidden (`active=false`) → canvas not mounted.
- Unknown preset id → German „Effekt nicht gefunden“.
- HEAD probe fails → stand-in, no throw.

## Acceptance

- [ ] `data-testid="vfx-shared-preview"` on root.
- [ ] Aura preset plays (stand-in or real efkefc) in Studio Formeln mode.
- [ ] Combinate preview pane mounts same component.
- [ ] Timeline scrub + hero-frame ms display.
- [ ] Missing effect → German placeholder, no crash.
- [ ] `npm run checks` green.
- [ ] Touched files: zero type escape hatches.

## Design

Epic: `.qa/design/vfx-studio.md` (slice #257)

## Blockers

Depends on #252, #253

## Feature slug

`vfx-shared-preview`
