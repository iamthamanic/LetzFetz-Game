# Acceptance — remove-sandbox-feature

## Intent

Delete the unwired `src/features/sandbox/` tree and its unit tests after the Build nav cutover (#250). No re-export stubs.

## Preconditions

- Build shell nav cutover delivered (#250): primary nav mounts `BuildView`, not `SandboxView`
- `App.tsx` has no `SandboxView` import

## Happy Path

1. `src/features/sandbox/` directory is fully removed (components, model, data, storage, tests)
2. `rg 'SandboxView|features/sandbox'` over `src/` returns no matches
3. `npm run checks` passes (build + unit tests)

## Edge Cases

- TabTone CSS token `sandbox` (amber Build chrome) may remain — out of scope
- VFX Studio / BuildView `tone: 'sandbox'` unchanged — styling only

## Out of scope

- Renaming TabTone `sandbox` → `build`
- `.project-memory` / memory-live-doc viewer JSON refresh
- VFX Studio feature work

## Security Coverage

- N/A — dead code removal only

## Implementation Notes

- Deleted `src/features/sandbox/**` including `loadSandboxContent*.test.ts` and `sandboxSessionStorage*.test.ts`
- Updated `AGENTS.md`, `docs/FEATURES.md`, `docs/en/*` where Sandbox was listed as primary feature
- `.cursor/rules/project-core.mdc`: Build replaces Sandbox in slice order
