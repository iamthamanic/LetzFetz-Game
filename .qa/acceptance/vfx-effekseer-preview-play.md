# Feature: vfx-effekseer-preview-play

Issue: #301  
Design: `.qa/design/effekseer-runtime-wiring.md`

## Intent

When Effekseer adapter reports ready and createEffect succeeds, shared preview plays the real effect; Timeline/Hero scrub drive playhead. Stand-in only if instance unavailable.

## Happy Path

1. loadState ready → createEffect on R3F GL context → instance live.
2. Status chip: `Effekseer aktiv`.
3. Timeline scrub → setPlayheadMs; renderFrame on invalidate.
4. Stand-in only when instance null / not live.

## Edge Cases

- createEffect null after ready → stand-in.
- Unmount disposes instance.

## Implementation Notes

<!-- filled after coding -->

## Implementation Notes
- `EffekseerPlayback` R3F bridge creates effect on shared GL, seeks via `setPlayheadMs`, draws via `renderFrame`.
- Stand-in only when `!effectLive`; status chip shows „Effekseer aktiv“.
