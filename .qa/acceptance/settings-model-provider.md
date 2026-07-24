# Feature: Settings model, storage, mute migration, SettingsProvider

<!-- refined by @implement from issue #78 -->

## Intent

Introduce a versioned `GameSettings` model, persist under `letz-fetz-settings`, migrate legacy `letz-fetz-muted` once then delete that key, and mount `SettingsProvider` in `App.tsx`. No full Settings UI yet.

**featureSlug:** `settings-model-provider`

## Preconditions

- App boots on local web with localStorage available or gracefully degraded.
- Legacy mute may or may not exist under `letz-fetz-muted`.

## Happy Path

- [ ] Versioned `GameSettings` defaults load when no stored record exists.
- [ ] Valid settings round-trip via load/save to `letz-fetz-settings`.
- [ ] Legacy `letz-fetz-muted` migrates into `audio.muted` once; old key deleted.
- [ ] `SettingsProvider` wraps the app from `App.tsx` and exposes get/update/reset.
- [ ] Vitest covers defaults, validate, load, save, migrate.
- [ ] `npm run checks` green; no `any` / `@ts-*` on touched files.

## Edge Cases

- [ ] Corrupt / wrong-version / non-object JSON → defaults (no crash).
- [ ] localStorage blocked → in-memory defaults; writes fail soft.
- [ ] Legacy mute values `0` / `1` / absent handled.

## Nicht-Ziele

- Full Settings UI, Howler, display fullscreen, sound files.

## Security Coverage

- F-01 Input validation: persisted JSON entered as `unknown`, validated before use.
- P-04 No secrets in localStorage settings payload.
- Out of scope: Auth (B-*), P2P, UGC card content.

## Screenshots

N/A — no UI in this issue.

## Implementation Notes

- `src/services/settings/`: types, defaults, validate, storage, SettingsProvider
- Storage key `letz-fetz-settings`; legacy `letz-fetz-muted` migrated in `loadGameSettings`
- `App.tsx` wraps `AppShell` with `SettingsProvider`
- Vitest: `settings.test.ts`
