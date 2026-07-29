# Acceptance: fetz-3d-toon-materials

**Issue:** #183  
**Slug:** `fetz-3d-toon-materials`  
**Runtime:** Local browser (R3F)

## Intent

Central toon/material mapping and outline for the engine assembler so all parts share one cartoon look (Brief §11). Gameplay never reads material names.

## Preconditions

- `WeaponAssembler` / `PartModel` load GLBs under `src/components/engine3d/three/`
- ADR D6 materials follow-up open

## Happy Path

1. Player opens Fetzgerät 3D preview
2. System applies central toon materials (+ outline when enabled) to loaded GLBs
3. Player sees consistent cartoon look instead of default PBR

## Acceptance Criteria

- [ ] Central material map + toon (and outline or documented fallback) active in assembler
- [ ] `rendering.md` describes contract; `ENGINE_RENDER_VERSION` bumped on look change
- [ ] Evidence note for MVP trio; `npm run checks` green
- [ ] Touched files: zero type escape hatches; no `three` under `src/game/`

## Edge Cases

- Unknown material → fallback toon, no crash
- `prefers-reduced-motion` / low-end → outline off
- No Three imports under `src/game/`

## Security Coverage

| Item | Status |
|------|--------|
| F-03 secrets | N/A — client materials only |
| P-04 secrets in git | N/A |

## Implementation Notes

- `EngineMaterials.ts` + tests; wired in `PartModel` / `WeaponAssembler`
- Outline via EdgesGeometry; gated by reduced-motion / low-end
- `ENGINE_RENDER_VERSION` → 3; `rendering.md` materials section
- Evidence: `.qa/evidence/fetz-3d-toon-materials.md`
