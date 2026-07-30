# Acceptance — vfx-normalize-node

<!-- seeded from issue #276 — VFX Studio real Normalize node -->

## Intent

Replace the Normalize **stub** with a real node that standardizes Meshy GLB output: compute bounds, unify scale (longest axis = 1), ground-center pivot, and emit typed `ModelAsset` metadata (`scale`, `pivot`, `bounds`) for downstream pipeline nodes.

## User Journey

1. Connect Meshy output → **Normalisieren** node.
2. Node loads GLB bounds (Three.js Box3 in browser when available; sensible defaults when mock GLB is missing).
3. Node shows German bounds summary and status **READY** or **FAILED** — no „Stub“ copy in library or node chrome.
4. Socket / Save downstream receive normalized `ModelAsset` + `glbUrl`.

## Problem

MVP #256 left Normalize as identity pass-through labeled „Stub — Identity“.

## Solution

- Pure TS helpers: AABB → `{ scale, pivot, bounds }` targeting unit size.
- Browser `loadGlbBounds` via Three.js `GLTFLoader` + `Box3`.
- Extend `ModelAsset` wire type with `scale`, `pivot`, `bounds`.
- Wire `runNormalizeNode` into `useAssetPipelineGraph` after Meshy success and on connect.

## Runtime

| Axis | This slice |
|------|------------|
| Local (desktop) | yes |

## Edge Cases

- Missing/invalid GLB URL → **FAILED** with German error, no crash.
- Mock Meshy GLB path without binary → default unit bounds, scale ≈ 1, **READY**.
- Degenerate/zero-size bounds → safe fallback scale 1.

## Acceptance

- [ ] No „Stub“ on Normalisieren in `VfxNodeLibrary` or `VfxNormalizeNode`.
- [ ] Output `ModelAsset` includes typed `scale`, `pivot`, `bounds`.
- [ ] Connected pipeline propagates normalized result downstream.
- [ ] Vitest for normalize helpers; `npm run checks` green.
- [ ] Touched files: zero type escape hatches (`@typed-strict`)

## Design

Epic: `.qa/design/vfx-studio.md` (Normalize node)

## Blockers

None

## Feature slug

`vfx-normalize-node`
