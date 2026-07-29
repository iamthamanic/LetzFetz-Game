# Issue #222 — V5 challenge disturb/destroy + start restore

- Started: 2026-07-29
- Phase: implement
- Branch: issue/222-v5-challenge-disturbed
- Slug: v5-challenge-disturbed

## Log
- Bootstrapped from stale #221 (already merged as #238)
- Locked #222, seeded acceptance

## verify-ticket
- npm run checks PASS (build + 531 tests)
- typed-strict: no escape hatches in touched files
- AC: margin table, disturb, destroy, start restore, empty formula — covered by formulaChallenge.test.ts
- UI: N/A (engine-only) — skip verify-ui
- Result: PASS

## review-ticket
- BASE: main (pre-commit), HEAD: working tree
- Architecture: pure formulaChallenge module; actions branches on v5Formula; V1 path untouched
- Scope: matches acceptance; bot minimal wiring only
- typed-strict: PASS
- Verdict: ACCEPT

## ecc-check
- test-gate / npm run checks: PASS
- Secure-by-Default: N/A engine-only (checklist OOS)
- memory-live-doc: deferred to post-merge batch (engine slice; docs already V5 §24)
- Verdict: READY
