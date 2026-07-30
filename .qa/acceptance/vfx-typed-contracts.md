# Acceptance — vfx-typed-contracts

<!-- seeded from issue #251 — VFX Studio typed asset contracts -->

## Intent

Land shared TypeScript contracts for VFX Studio assets, React Flow wire payloads, and the asset status machine — no UI yet beyond types and Vitest.

## User Journey

1. Dev imports typed `TechniqueAsset` / `EssenceAsset` / `CatalystAsset` / `FormulaRecipe` / `RenderOutput`.
2. Status enum: `DRAFT` | `QUEUED` | `GENERATING` | `REVIEW_REQUIRED` | `READY` | `FAILED` | `OUTDATED`.
3. Handle wire types for React Flow: `ImageAsset`, `ModelAsset`, `TextureAsset`, `EffectAsset`, …

## Problem

No shared contract layer for Studio ↔ Worker ↔ Combinate ↔ Material.

## Solution

`src/features/build/vfx/types/` — feature-owned parsers that narrow from `unknown` (no `any`, no `@ts-ignore`). Design: `.qa/design/vfx-studio.md`.

## Runtime

| Axis | This slice |
|------|------------|
| Local (desktop) | yes |

## Edge Cases

- Invalid JSON → explicit parse failure, no `any`.
- Unknown `kind` / status → rejected with clear error.

## Acceptance

- [ ] Typed contracts + Vitest round-trip / narrow tests.
- [ ] Status + asset-kind enums exported.
- [ ] Design doc `.qa/design/vfx-studio.md` in repo.
- [ ] `npm run checks` green.
- [ ] Touched files: zero type escape hatches (`@typed-strict`)

## Design

Epic: `.qa/design/vfx-studio.md`

## Blockers

Depends on #250

## Feature slug

`vfx-typed-contracts`
