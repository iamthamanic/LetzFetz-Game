# V6 Slice 0 — Import boundary + Play-Default note

**Issue:** #313

## Isolation

V6 paths must not import V5 formula combination SoT:

- `src/content/v6/**`
- `src/generated/v6/**`
- `src/game/packs/v6/**`

Banned: `packs/v5/formulaCombinations` (and catalog equivalents).

## Checks

```bash
npm run check:v6-v5-isolation
# folded into npm run checks
```

Workspace skill `@letz-fetz-check` probe **A10** mirrors the same rule
(`.agents/skills/letz-fetz-check/` — outside package git root in this workspace layout).

## Play-Default

**V5 remains Play-Default** until explicit PLAYABLE cutover. V6 Slice 0 is INTERNAL only.
