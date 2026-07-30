# Letz Fetz VFX Studio — Zielarchitektur

Grill-Entscheidung 2026-07-30. Confidence ~99%.

## Intent

Build → **Development** wird 1:1 zum **VFX Studio** (Authoring für Karten-VFX).  
**Combinate** bleibt separat und testet Technik/Essenz/Katalysator-Kombis im gleichen Preview.  
V1 = Authoring + Pack/Rezept-Opt-in. **Keine** In-Game-Effekseer-Runtime auf dem Play-Board.

## UI surfaces

| Surface | Rolle |
|---------|--------|
| Build → Development → **VFX Studio** | Asset Pipeline + Formula Pipeline + Batch UI |
| Build → Combinate | 3 Slots T/E/K; Preview = Studio-Viewport; speichert Kombinationen |
| Material → **Formeln** (ersetzt Fetzgeräte) | Bausteine + Kombinationen, Filter nach Badge |

Badges: immer `Formel` + Rolle (`Technik` \| `Essenz` \| `Katalysator` \| `Kombination`).

## Runtime

- `tools/vfx-worker/` lokal, Port ~8787 (Meshy-Proxy, Jobs, Effekseer-CLI, Batch)
- Preview: Browser Three.js + **real Effekseer WebGL** (`@zaniar/effekseer-webgl-wasm` via `effekseerAdapter.ts`)
- Committed presets: `public/vfx/effects/*.efkefc` (+ `Parts/` / `Texture/`); runtime binary under `public/vfx/effekseer/`
- **Wiring design:** [`effekseer-runtime-wiring.md`](./effekseer-runtime-wiring.md) (Desktop authors `.efkefc`; Studio loads/previews/binds; no in-app editor; no Play-board Effekseer V1)
- CLI/Scripts teilen dieselbe Worker-API
- WIP: lokal / gitignored `vfx-workspace/`
- Approved: Repo `public/vfx/`, Card-Art `public/cards/formula/`
- Bestehende role-prefixed PNGs = Import-Startset

## Graph modes (beide V1)

1. **Asset Pipeline** — Bausteine (Meshy → Normalize → Sockets → Effekseer-Presets → Save)
2. **Formula Pipeline** — T+E+K → Live Preview / Timeline → Hero Frame

Effekseer V1: **nur Preset-Nodes** (Aura, Trail, Impact, …). Erste `.efkefc`: manuell Desktop + Commit.

## Speichern / Ownership

- Studio speichert Bausteine (`ready`) → Material + Combinate-Library
- Combinate: Bausteine **read-only**; speichert Kombi (≥2 Slots) = Recipe + Hero-Frame
- Baustein-Version ↑ → abhängige Kombis `OUTDATED`

## Spiel-Anbindung

| Aktion | Artefakt | Wirkung |
|--------|----------|---------|
| **Zum Spieldeck hinzufügen** | nur Bausteine | Pack JSON, ziehbar |
| **Kombination aktivieren** | Kombination | Feld-Rezept-Vorlage (nie Handkarte) |

- Ziehdeck: nur Einzelkarten (T/E/K)
- On-Board: 2 belegte Formelplätze legal; fehlende Rolle = kein Effekt
- Deck pinnt Version; neue Authoring-Version → `OUTDATED` + Warnung bis Re-Add / Re-Aktivierung

## Batch

Echter lokaler Worker (headless Chromium), gleiche Szene wie Preview. 12×12×12 nach Grundassets.

## Out of scope V1

- Effekseer live im Play-Match
- Freier Effekseer-Node-Editor
- Cloud-Backend fürs Studio
- Alte Engine-Parts-Development / Sandbox-Nav (Sandbox-Code cleanup separat)

## Slice order (GitHub issues)

Siehe Issue-Bodies `Depends on #N`. Kurz:

1. Shell Sandbox→Build (nav)
2. Typed contracts + design landed
3. Delete old Development; Studio shell (React Flow skeleton)
4. vfx-worker stub
5. Material Formeln-Tab
6. Combinate T/E/K slots
7. Asset pipeline MVP + Meshy via worker
8. Shared Three+Effekseer preview
9. Combinate save Kombi + shared preview
10. Pack buttons + OUTDATED
11. Engine 2-slot resolve
12. Batch worker
13. Remove unwired sandbox feature

## GitHub issues

| # | Slice |
|---|--------|
| 250 | Build shell Sandbox→Build |
| 251 | Typed contracts |
| 252 | Studio shell React Flow |
| 253 | vfx-worker stub |
| 254 | Material Formeln tab |
| 255 | Combinate T/E/K slots |
| 256 | Asset pipeline MVP |
| 257 | Shared Three+Effekseer preview |
| 258 | Combinate save Kombi |
| 259 | Pack opt-in buttons + OUTDATED |
| 260 | Engine 2-slot resolve |
| 261 | Batch worker |
| 262 | Remove sandbox feature |
