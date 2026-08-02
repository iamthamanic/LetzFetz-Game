# Feature: V6 Slice 0 — import-boundary probes + AGENTS/docs

**Issue:** #313

## Intent
Extend architecture probes for V6↔V5 isolation; document INTERNAL foundation; Play-Default stays V5.

## Implementation Notes
- In-repo: `scripts/check-v6-v5-isolation.sh` + `npm run check:v6-v5-isolation` in `npm run checks`
- Workspace skill: A10 in `@letz-fetz-check` run-probes (outside package git root)
- AGENTS.md + `docs/letz-fetz-v6-spielkonzept.md` Slice 0 tracking; Play-Default remains V5
