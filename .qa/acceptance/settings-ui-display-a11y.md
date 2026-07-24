# Feature: Settings UI + Display + Accessibility

<!-- seeded by ecc-runner from issue #80 on 2026-07-24 — @implement may refine -->

## Intent
Ship Settings sections Audio / Display / Gameplay / Accessibility, displayService + browser fullscreen adapter, CSS vars / data attributes for scale/contrast, a test-sound control, and Playwright coverage for mute/slider/persist/reset. Migrate Settings UI cleanly (shell → `features/settings` allowed; App composition root).
**featureSlug:** `settings-ui-display-a11y`
**Depends on:** #78, #79

## Happy Path
- [ ] - [ ] Sections Audio / Display / Gameplay / A11y present and Deutsch.
- [ ] - [ ] displayService + fullscreen adapter; no UI `transform: scale`.
- [ ] - [ ] Test sound works; mute/volume persist; reset works.
- [ ] - [ ] Playwright covers mute / slider / persist / reset.
- [ ] - [ ] Clean Settings relocation; `npm run checks` green.

## Edge Cases
- [ ] (from .qa/edge-cases.md + @implement)

## Regression
- [ ] Feed and topic routes still load

## Assumptions
- none

## Screenshots
| Step | Filename |
|------|----------|
| 1 | `01-happy-path.png` |

## Implementation Notes
<!-- filled after coding -->

## Implementation Notes
- Migrated SettingsView to features/settings with Audio/Display/Gameplay/A11y
- displayService + DisplaySettingsSync; CSS --lf-ui-scale (no transform:scale)
- Playwright e2e/settings-audio-persist.spec.ts
- Deleted features/shell/SettingsView.tsx
