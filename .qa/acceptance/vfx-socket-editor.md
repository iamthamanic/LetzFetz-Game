# Acceptance — vfx-socket-editor

<!-- seeded from issue #277 — VFX Studio Socket editor with 3D gizmo -->

## Intent

Replace the Socket **stub** with a real Socket-Editor node: place named sockets on the technique model via XYZ inputs and optional 3D gizmo in the shared VFX preview.

## User Journey

1. Connect normalized model → **Socket** node.
2. Select socket role (essenceOrigin, trailStart, trailEnd, impact, auraCenter, catalystOrbit, cameraFocus).
3. Edit XYZ in inspector or drag gizmo in shared preview; values update on the node.
4. Technique save includes full `sockets` map — no „Stub“ label.

## Problem

MVP #256 left Socket as default coords (0,0,0) labeled „Stub — Default-Koords“.

## Solution

- Named socket roles + default map helpers (pure TS + Vitest).
- Socket node UI lists active role; inspector shows XYZ.
- `VfxSharedPreview` / R3F scene shows markers + optional `TransformControls` for active socket.
- Persist `sockets` into `TechniqueAsset` on save.
- German UI; remove Stub copy.

## Runtime

| Axis | This slice |
|------|------------|
| Local (desktop) | yes |

## Edge Cases

- No model connected → German hint, sockets editable as drafts.
- Depends on Normalize output when wired.

## Acceptance

- [ ] No „Stub“ on Socket in library or node.
- [ ] At least essenceOrigin + impact + trailStart/End editable via gizmo or XYZ.
- [ ] Saved TechniqueAsset includes sockets map.
- [ ] Shared preview shows socket markers.
- [ ] `npm run checks` green; typed-strict clean.

## Design

Epic: `.qa/design/vfx-studio.md` (Socket-Editor-Node)

## Blockers

Depends on #276 (merged)

## Feature slug

`vfx-socket-editor`
