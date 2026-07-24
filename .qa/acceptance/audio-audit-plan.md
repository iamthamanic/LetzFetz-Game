# Feature: audio:audit + audio:plan

**Issue:** #84  
**featureSlug:** `audio-audit-plan`

## Intent

AST/static scan of TS/TSX SoundId literals vs manifest; `audio:plan` adds planned rows without clobbering curated prompts.

## Happy Path

1. `npm run audio:audit` reports used / missing / unused + exit codes.
2. `npm run audio:plan -- --dry-run` shows additions; write mode preserves prompts.
3. Python tests cover merge behavior; README documents commands.

## Implementation Notes

- `audio_forge/scan.py` regex literal scan (documented dynamic-ID limitation).
- `audio_forge/audit_plan.py` + CLI wiring; stubs remain for process/review/verify.
