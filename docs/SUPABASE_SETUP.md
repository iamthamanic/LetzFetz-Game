# Supabase-Projekt: Setup & Sichern

Dieses Repo enthält alles, um das Supabase-Projekt **Letzfetzprototype** wieder aufzusetzen oder weiterzuentwickeln.

**Projekt löschen:** Nach dem Commit aller Supabase-Dateien kannst du das Projekt im [Supabase Dashboard](https://supabase.com/dashboard) unter Settings → General → „Delete project“ löschen. Alle relevanten Inhalte (Schema, Daten, Edge-Function-Code) liegen im Repo; Wiederherstellung siehe unten „Restore aus Backup“ bzw. „Neues Projekt aus Repo“.

## PROJECT_REF

- **PROJECT_REF:** `tprhkqoiomnojudkwyut`
- Dashboard: https://supabase.com/dashboard/project/tprhkqoiomnojudkwyut

## Voraussetzungen

- **Git:** Repo ausgecheckt
- **Supabase CLI:** `supabase --version` (fehlt → siehe [Installation](https://supabase.com/docs/guides/cli))
  - macOS: `brew install supabase/tap/supabase`
- **Docker:** laufen lassen (für lokale DB und `db dump`)
- Optional: `jq` für JSON (ansonsten z.B. Python)

## Login & Link

1. Einloggen (falls noch nicht):
   ```bash
   supabase login
   ```
   Token im Browser einfügen, wenn angezeigt.

2. Projekt linken:
   ```bash
   export PROJECT_REF="tprhkqoiomnojudkwyut"
   supabase link --project-ref "$PROJECT_REF"
   ```
   Bei DB-Passwort-Abfrage: Passwort aus dem Supabase-Dashboard (Settings → Database) verwenden oder:
   ```bash
   export SUPABASE_DB_PASSWORD="dein-db-passwort"
   supabase link --project-ref "$PROJECT_REF"
   ```

## Inhalte im Repo

| Was | Wo |
|-----|-----|
| DB-Schema (Migrationen) | `supabase/migrations/` |
| Edge Function Source | `supabase/functions/make-server-c701770f/` |
| Backup (Schema+Data, ein Snapshot) | `supabase/backups/schema_and_data_LATEST.sql` |
| Config | `supabase/config.toml` |
| PROJECT_REF / Anon Key | `src/utils/supabase/info.tsx` (Frontend) |

## Backup-Befehle

Nach erfolgreichem `supabase link` und laufendem Docker:

- Schema + Data in dateierte Datei:
  ```bash
  supabase db dump -f supabase/backups/schema_and_data_$(date +%Y%m%d_%H%M%S).sql
  ```
- Dieselbe Datei als aktuellen Snapshot versionieren:
  ```bash
  cp supabase/backups/schema_and_data_*.sql supabase/backups/schema_and_data_LATEST.sql
  ```
  Nur `schema_and_data_LATEST.sql` wird per `.gitignore`-Ausnahme ins Repo eingecheckt; andere `*.sql` in `supabase/backups/` bleiben ignoriert.

Optional – Full Dump (größer, für kompletten Restore):
```bash
supabase db dump -f supabase/backups/full_dump_$(date +%Y%m%d_%H%M%S).sql --data-only
# oder ohne --data-only für Schema+Data wie oben
```

## Restore aus Backup

Mit gelinktem Projekt (Remote):

```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" -f supabase/backups/schema_and_data_LATEST.sql
```

Ersetze `[PASSWORD]` und `[PROJECT_REF]` (z.B. `tprhkqoiomnojudkwyut`). Connection string auch im Dashboard unter Settings → Database.

### Neues Projekt (nach Löschung des alten)

1. Im [Supabase Dashboard](https://supabase.com/dashboard) neues Projekt anlegen.
2. DB-Passwort und Connection String unter Settings → Database notieren; neuen **Project Ref** und **Anon Key** unter API notieren.
3. Restore: `psql "postgresql://postgres:[PASSWORD]@db.[NEUER_REF].supabase.co:5432/postgres" -f supabase/backups/schema_and_data_LATEST.sql`
4. Edge Function deployen: `supabase link --project-ref [NEUER_REF]` dann `supabase functions deploy make-server-c701770f --project-ref [NEUER_REF]`
5. In `src/utils/supabase/info.tsx` den neuen `projectId` und `publicAnonKey` eintragen.

## Im Repo vs. separat sichern

| Im Repo | Separat sichern |
|---------|------------------|
| Migrationen (`supabase/migrations/`) | DB-Passwort (Dashboard) |
| Edge Function Code (`supabase/functions/`) | Service Role Key (Dashboard → API) |
| `schema_and_data_LATEST.sql` (ein Snapshot) | Weitere Backup-Dateien (lokal/offline) |
| PROJECT_REF, Anon Key (in `info.tsx`) | Geheime Keys nicht ins Repo committen |

## Edge Function deployen

Nach Änderungen in `supabase/functions/make-server-c701770f/`:

```bash
supabase functions deploy make-server-c701770f --project-ref tprhkqoiomnojudkwyut
```

Secrets (z.B. für externe APIs) im Dashboard unter Edge Functions → Secrets setzen oder per CLI.
