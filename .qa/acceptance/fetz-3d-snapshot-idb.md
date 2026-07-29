# Acceptance: fetz-3d-snapshot-idb

**Issue:** #188  
**Slug:** `fetz-3d-snapshot-idb`  
**Runtime:** Local browser (IndexedDB)

## Intent

Persist engine snapshots across reloads in IndexedDB (Brief §13), keyed by `createRenderKey`, with corrupt-entry drop. In-memory remains L1.

## Preconditions

- Sync L1 cache in `engine-snapshot-cache.ts`
- `requestEngineSnapshot` / board warmup write via `setEngineSnapshot`

## Happy Path

1. Player / zone warms a snapshot into L1
2. System also writes IndexedDB (L2)
3. After reload + hydrate: hit from IDB → L1 without WebGL while `renderVersion` matches

## Acceptance Criteria

- [ ] Snapshots survive reload at same renderKey (hydrate → L1 hit)
- [ ] Corrupt / stale entries dropped
- [ ] Vitest (mock IDB) + `npm run checks`; `rendering.md` updated
- [ ] Touched files: zero type escape hatches

## Edge Cases

- Corrupt / old renderVersion → miss + delete
- Private mode / IDB missing → memory-only, no crash
- Quota exceeded → soft-fail, optional DE console warn

## Security Coverage

| Item | Status |
|------|--------|
| F-03 secrets | N/A — local snapshot data URLs only |
| P-04 secrets in git | N/A |

## Implementation Notes

- `engine-snapshot-idb.ts` — L2 persist store (IndexedDB or Map mock); write-through from `setEngineSnapshot`
- `hydrateEngineSnapshotCache` on `PlayView` mount; corrupt/stale `rv*` dropped
- Vitest with Map-backed store (reload + corrupt/stale cases)
- Docs: `rendering.md` L1/L2 snapshot section
