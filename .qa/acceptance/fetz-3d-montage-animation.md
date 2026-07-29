# Acceptance: fetz-3d-montage-animation

**Issue:** #186  
**Slug:** `fetz-3d-montage-animation`  
**Runtime:** Local browser (R3F)

## Intent

Extend Fetzgerät montage beyond whole-assembly scale-in: Träger appears, then Antrieb docks along the socket axis, then Aufsatz docks (Brief §12). `prefers-reduced-motion` shows the assembled pose with no tweens.

## Preconditions

- `WeaponAssembler` mounts carrier → drive (`SOCKET_DRIVE`) → attachment (`SOCKET_OUTPUT`)
- Materials/outline from #183 available
- Shared presentational code under `src/components/engine3d/three/` only

## Happy Path

1. Player opens Fetzgerät 3D preview with Antrieb + Aufsatz
2. System plays a short staggered dock sequence (position offset → socket), not only scale
3. Player sees clear assembly; with reduced-motion, pose is immediately assembled

## Acceptance Criteria

- [ ] Montage shows staggered Antrieb / Aufsatz docking (evidence)
- [ ] `prefers-reduced-motion` skips tweens (assembled pose)
- [ ] Vitest covers montage progress math; `npm run checks` green
- [ ] Touched files: zero type escape hatches; no `three` under `src/game/`

## Edge Cases

- Carrier-only → no fake drive/attachment motion
- Recipe change mid-animation → clean restart
- Reduced motion → assembled pose, zero tween
- Attachment without drive → no attachment dock tween (assembler already skips attach)

## Security Coverage

| Item | Status |
|------|--------|
| F-03 secrets | N/A — client animation only |
| P-04 secrets in git | N/A |

## Implementation Notes

- `EngineAnimations.ts` + Vitest: phase windows, dock offsets, reduced-motion assembled pose
- `WeaponAssembler` applies pose in `useFrame` after socket attach; recipe change resets progress
- Docs: `docs/engine-system/rendering.md` montage section
- Evidence: `.qa/evidence/fetz-3d-montage-animation.md`
