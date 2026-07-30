# Acceptance — vfx-studio-shell

<!-- seeded from issue #252 — VFX Studio React Flow shell -->

## Intent

Replace Build → Development engine-parts Meshy pipeline UI with the **VFX Studio** authoring shell: three modes, node library, empty React Flow canvas, inspector placeholder. Combinate tab unchanged.

## User Journey

1. Open Build → **VFX Studio** sub-tab (label "VFX Studio", not "Development").
2. Switch modes: **Assets** | **Formeln** | **Batch**.
3. Left panel lists node categories (Technik, Essenz, Katalysator, Render) as placeholders.
4. Center shows empty React Flow graph.
5. Right panel shows inspector placeholder.
6. Combinate tab behaves exactly as before.

## Problem

Development is still Spec→2D→3D engine-parts authoring; VFX Studio needs a graph shell first.

## Solution

Delete `BuildDevelopmentView` and development-only pipeline UI. Mount `VfxStudioView` with `@xyflow/react`. No Meshy/Effekseer jobs yet.

## Runtime

| Axis | This slice |
|------|------------|
| Local (desktop) | yes |

## Edge Cases

- Combinate tab unchanged this slice.
- Old Development testids removed with deleted UI.
- Session sub-tab id `development` may persist for storage compat; label is "VFX Studio".

## Acceptance

- [ ] Old Development engine-parts UI deleted (no dead re-exports).
- [ ] Studio shell with three modes + React Flow canvas.
- [ ] German UI strings; `data-testid="vfx-studio"`.
- [ ] Node library categories: Technik, Essenz, Katalysator, Render (placeholders).
- [ ] `npm run checks` green.
- [ ] Touched files: zero type escape hatches (`@typed-strict`)

## Design

Epic: `.qa/design/vfx-studio.md`

## Blockers

Depends on #251

## Feature slug

`vfx-studio-shell`
