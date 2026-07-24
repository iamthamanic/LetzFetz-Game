# AGENTS.md — Letz Fetz

Dieses Dokument ist die **verbindliche Projektkarte** für Menschen und KI-Agenten.
Lies es zuerst, bevor du Code änderst.

## Was ist dieses Projekt?

**Letz Fetz** ist ein taktisches 1-gegen-1-Kartenduell (physisches Regelwerk V1).
Dieses Repo ist die **digitale Playtest- und Authoring-Plattform** — kein fertiges Steam-Spiel.

| Ziel | Beschreibung |
|------|--------------|
| **Primär** | Regeln digital testen (Balance, Flow, Edge Cases) bevor das physische Kartenspiel produziert wird |
| **Sekundär** | Base Pack + später Custom Content (Charaktere, Packs) |
| **Später** | Remote 1v1 (P2P), Desktop (Tauri), optional Steam |

### Was dieses Repo **ist**

- Card Forge (Karten/Arenen erstellen und verwalten)
- Visueller Arena-Tisch (freies Platzieren — Sandbox)
- **Zukünftig:** Rules Engine + spielbare Game-Ansicht (Solo vs Bot, dann P2P)
- Local-first: Spielbar ohne Backend

### Was dieses Repo **nicht** ist

- Kein Ersatz für das physische Regelbuch als PDF
- Kein dedizierter Multiplayer-Game-Server (P2P mit Host-Authority)
- Kein Hot-Seat-Hauptmodus (versteckte Handinformationen!)
- Kein Next.js- / DaisyUI-Projekt

---

## Tech Stack (verbindlich)

| Bereich | Technologie | Warum |
|---------|-------------|-------|
| Frontend | **Vite + React 18** | Schnelle Iteration, Tauri-kompatibel, Build läuft |
| Styling | **Tailwind CSS** | Bereits im Einsatz, volle Kontrolle über Theme |
| Icons | **lucide-react** | Konsistent, bereits genutzt |
| UI-Bausteine | **Eigene Primitives** in `src/components/ui/` | Styleguide-konform, kein DaisyUI |
| Game Logic | **Pure TypeScript** in `src/game/` | Testbar, plattformunabhängig, kein React |
| Backend (jetzt) | **Keins für Spiel** — lokale JSON/Packs | Schnellster Weg zum ersten Testspiel |
| Backend (später) | **Optional:** Appwrite (self-hosted) für Content-Sync; Signaling **pluggable** (siehe unten) | Kein Game-State-Server |
| Legacy | Supabase Edge Functions | Nur Card Forge bis Migration; Signaling ggf. Supabase Realtime als Übergang |
| Desktop (später) | **Tauri** | Erst wenn Web-Spiel stabil läuft |
| Tests | **Vitest** (aktiv für `src/game/`) | Rules Engine unit-testbar; UI-Tests gezielt |

**Nicht verwenden:** Next.js, DaisyUI, Colyseus/Nakama/Photon als Game-State-Server, boardgame.io als Engine-Ersatz.

---

## Architektur

Hybrid **Vertical Slice** unter `src/features/` — Feature-owned React/UI + Adapter; bewährte Shared-Kernel bleiben horizontal.

```
Letz-Fetz-Game/src/
├── game/                 # Rules Engine — KEIN React, KEIN DOM (unverändert)
│   ├── engine/           # Zuglogik, Kampf, Effekte
│   ├── types/            # GameState, Actions, Cards
│   └── packs/            # Base Pack JSON (Seed)
├── features/             # Feature-Slices (Ziel)
│   ├── sandbox/          # Freier Arena-Tisch (local-first) — MVP 0.1
│   ├── shell/            # Nav/Menu/Settings
│   ├── forge/            # Card Forge
│   └── play/             # Solo-Spiel (PlayView entry, board, setup, presentation)
├── components/
│   ├── ui/               # UI Primitives (bleiben shared)
│   ├── cards/            # Neutrale Karten-Präsentation (cross-feature)
│   ├── character/        # Shared character detail panels (Forge + Play setup)
│   └── …                 # Legacy-Pfade bis jeweilige Slice-Issue löscht
├── services/
│   ├── storage/          # localStorage (Overlays, später Tauri FS)
│   ├── history/          # AppHistory — shared, unverändert
│   ├── cardArt/          # Shared Art
│   ├── icons/            # Shared Icons
│   └── transport/        # local | webrtc-p2p (später); signaling pluggable
├── utils/
└── App.tsx               # Composition Root — importiert Feature-Entries
```

### Schichtenregeln

1. **`src/game/`** importiert weder React, DOM, Feature-, Komponenten- noch Transport-Code.
2. **`src/features/<feature>/`** darf importieren: `src/game/`, `src/components/ui/`, neutrales `src/components/cards/`, shared `src/components/character/`, shared `services/history|cardArt|icons|storage`. **Kein** Feature→Feature-Import.
3. **`src/components/ui/`** enthält keine Feature- oder Rules-Engine-Businesslogik.
4. **`src/components/cards/`** bleibt neutral — keine Imports aus `features/`.
5. **`src/services/`** behält nur echte Cross-Feature-/Platform-Fähigkeiten. Feature-owned Code wandert mit dem jeweiligen Slice.
6. **`App.tsx`** bleibt Composition Root; Feature-Businesslogik gehört nicht in die App-Root.
7. **AppHistory** (`services/history`) bleibt shared und funktional unverändert.
8. **Relocation:** Importe und Tests im selben Change umstellen, alten Pfad löschen. **Keine** Re-Export-Stubs, Forwarding-Module oder Alias-Bridges.
9. Shared-Layer dürfen **nicht** nach `src/features/` importieren (Dependency-Richtung: App → features → shared).
10. Persistierte/externe Daten betreten Typed Code als `unknown` und werden explizit genarrowed. Touched files: kein `any`, kein `@ts-*`, keine Lint/Type-Suppressions.
11. **UI** ruft fürs echte Spiel `dispatch(action)` auf; Engine validiert und gibt neuen State zurück. Sandbox ist freier Tisch ohne Engine-Ausführung.

### Migrations-Reihenfolge (kein Big-Bang)

1. Architekturvertrag + Sandbox Foundations (`vsa-sandbox-foundation`)
2. Sandbox local-first Slice (`sandbox-local-slice`) — MVP 0.1
3. Shell → Forge → Shared-Card-Boundary → Play (Support → Setup → Presentation → Board → Entry)

Design: `.qa/design/vertical-slice-architecture.md`

---

## Produkt- & Spielregeln (Kurzreferenz)

- 1v1, 20 Leben, 5 Zugphasen, max 4 gebundene Karten, Handlimit 6
- Elemente: Feuer, Wasser, Erde, Luft, Schatten, Licht
- W6-Würfelbonus: 1–2 → +0, 3–4 → +1, 5–6 → +2

### Regelquellen (verbindlich)

| Dokument | Rolle |
|----------|--------|
| [`docs/rules/SPIELANLEITUNG_V1.md`](Letz-Fetz-Game/docs/rules/SPIELANLEITUNG_V1.md) | **Aktuelle Wahrheit** — physisches V1 + Rules Engine (`src/game/`) |
| [`docs/rules/SPIELANLEITUNG_V2_DRAFT.md`](Letz-Fetz-Game/docs/rules/SPIELANLEITUNG_V2_DRAFT.md) | V2 spielbarer Draft — **noch nicht** Engine-Wahrheit |
| [`docs/rules/SPIELANLEITUNG_V2_WIP.md`](Letz-Fetz-Game/docs/rules/SPIELANLEITUNG_V2_WIP.md) | Redesign-Entwurf (Grill/Design D1–D35) |

**Bei Unklarheit:** Spielanleitung V1 schlägt Prototyp-Code und Chat-Erinnerung.

**Pflege-Pflicht für Agenten:**

1. Regel- oder Kartentext-Änderungen an **V1** → `SPIELANLEITUNG_V1.md` sofort mitziehen.
2. Design-Entscheidungen zum Engine-/Fetzen-Redesign → `SPIELANLEITUNG_V2_WIP.md` (Festgelegt / Offen / Verworfen); spielbare Formulierung → `SPIELANLEITUNG_V2_DRAFT.md`.
3. Erst wenn V2 explizit freigegeben ist, wird sie V1 als Regelquelle ersetzen; bis dahin implementiert `src/game/` **V1**.
4. Kurzreferenz in diesem Abschnitt und in `.cursor/rules/game-engine.mdc` bei Regelbrüchen aktualisieren.

---

## Sprache & Naming

| Bereich | Sprache |
|---------|---------|
| UI (Labels, Fehler, Tooltips) | **Deutsch** |
| Code, Variablen, Kommentare | **Englisch** |
| Produktname | **Letz Fetz** (nicht „Lets Fetz“) |
| Git Commits | Englisch, imperativ |

---

## UI / UX

Vollständiger Styleguide: [`Letz-Fetz-Game/docs/UI_STYLEGUIDE.md`](Letz-Fetz-Game/docs/UI_STYLEGUIDE.md)

**Kurz:**

- **Hybrid-Ton:** verspielt im Spiel (Emojis, Gradients), nüchtern im Editor (Card Forge)
- Immer Primitives aus `components/ui/` für Buttons, Inputs, Modals
- Keine neuen Ad-hoc-Button-Styles in Feature-Komponenten
- React Hooks: nur `useState`, `useRef`, `useEffect` (Projektstandard)

---

## Implementierungs-Prioritäten

Reihenfolge einhalten, nicht überspringen:

1. **Phase 0:** Card-Schema, Rules Engine, Base Pack JSON, Unit-Tests
2. **Phase 1:** Game UI, Solo vs Heuristik-Bot, komplette Partie spielbar
3. **Phase 1b:** UI-Primitives extrahieren, bestehende Screens migrieren
4. **Phase 2:** WebRTC P2P (Host-Authority) + **pluggable Signaling** — kein dedizierter Game-Server
5. **Phase 3:** Tauri Desktop, Pack Import/Export
6. **Phase 4:** Steam (viel später)

---

## Backend & Multiplayer

### Jetzt (Local-first)

- Packs als JSON; **kein Server** für Spielzustand, Züge oder Hände
- Solo vs Heuristik-Bot über `src/services/transport/local`

### Phase 2 — Online 1v1 (Architektur)

**Modell:** WebRTC **P2P** mit **Host-Authority**. Der Host führt `applyAction()` in `src/game/` aus; der Client sendet nur Actions und erhält den für ihn sichtbaren State. **Verdeckte Hände** verlassen den Host nicht.

| Schicht | Was | Wo |
|---------|-----|-----|
| Rules Engine | Züge, Phasen, Kampf, Validierung | `src/game/` (authoritative beim Host) |
| Game-Daten | Actions + gefilterter State | WebRTC **DataChannel** (verschlüsselt P2P) |
| Signaling | Raum, SDP Offer/Answer, ICE | **Pluggable** — siehe unten |
| Relay (optional) | NAT/Firewall | **TURN** (z. B. coturn, metered) — unabhängig vom Signaling-Backend |

**Signaling ist nur Verbindungsaufbau** — kein Multiplayer-Backend, kein Match-State, keine Kartenhände auf dem Server.

#### Pluggable Signaling (Phase 2)

Implementierung in `src/services/transport/` — UI und Engine bleiben backend-agnostisch:

| Backend | Rolle | Wann sinnvoll |
|---------|-------|----------------|
| **Minimal WebSocket** | Nur Room + Message-Relay | Default/YAGNI für ersten PvP-Test |
| **Supabase Realtime** | Channel pro Match | Schnellster Start (Forge nutzt Supabase bereits) |
| **Appwrite Realtime** | Channel pro Match | Wenn C-3 Content-Migration ohnehin kommt |

Eine Implementierung wählen; **nicht** mehrere parallel produktiv betreiben. Wechsel nur über Transport-Interface.

**Nicht für Signaling / Multiplayer:** Colyseus, Nakama, Photon, boardgame.io-Server — das sind **Game-State-Server** und passen nicht zu Hidden-Information + Host-Authority (Overkill, falsches Modell).

### Content & Forge (Phase 1b / C — getrennt von PvP)

- **Optional:** Appwrite (self-hosted) für Card-Forge-Sync, Storage, Auth — **unabhängig** von der Signaling-Wahl
- **Legacy:** Supabase Edge Functions für Card Forge bis Migration (C-3)
- **Supabase:** nicht für neue **Game-Features** (Engine, Match-UI); Realtime nur als **eine** Signaling-Option in Phase 2, nicht als Game-Backend

### Phase 4 (Steam, später)

- Web-PvP: weiter WebRTC + pluggable Signaling
- Steam-Build: optional **Steam Networking** statt Web-Signaling — Transport-Schicht erweitern, Engine unverändert

---

## Agent-Workflows

### Pipeline (Projekt-Skills)

```
@pingpong-solution  →  @implement  →  @verify-ticket  →  @verify-ui  →  @review-ticket
```

Optional vor dem Bauen: **`@mine-stars`** (Prior Art aus GitHub-Stars — nur auf Wunsch).

### Globale Helfer-Skills (ECC, `~/.cursor/skills/`)

Werden **nicht** statt der Pipeline-Skills ausgeführt — jeder Pipeline-Schritt **soll** die passenden Helfer an der markierten Stelle anstoßen oder empfehlen. **Projekt-Rules schlagen ECC-Defaults** (kein Next.js, kein DaisyUI, Vitest-Pflicht nur in `src/game/`).

| Phase | Projekt-Skill | Globale Helfer (wann) |
|-------|---------------|------------------------|
| Exploration | `@pingpong-solution` | `@search-first` vor Optionen; `@documentation-lookup` für SOTA/API; optional `@mine-stars`; `@security-review` wenn Security im Cross-Domain-Matrix relevant |
| Umsetzung | `@implement` | `@search-first` vor neuem Code/Deps; `@documentation-lookup` für fremde APIs; `@security-review` bei Auth, UGC, Storage, P2P, Secrets |
| Technische Prüfung | `@verify-ticket` | Checkliste entspricht `@verification-loop` (AGENTS.md `npm run checks`); bei sensiblen Diffs `@security-review` |
| UI-Prüfung | `@verify-ui` | Nach grünem `@verify-ticket`; bei Auth/Input-UI `@security-review` |
| Lange Session | — | `@strategic-compact` an logischen Breakpoints |

Kurzablauf Feature:

1. **`AGENTS.md` + `.cursor/rules/`** lesen
2. **`@pingpong-solution`** → `.qa/design/` (explorative Features)
3. **`@implement`** → `.qa/acceptance/` vor Code
4. **`@verify-ticket`** → Build/Tests/Acceptance
5. **`@verify-ui`** → Browser/Evidence (bei UI-Änderungen)

---

## Qualität & Validierung

**Definition of Done** (vor PR oder „fertig“):

- `cd Letz-Fetz-Game && npm run checks` grün (build + unit tests)
- Änderungen an `src/game/` → passende Vitest-Tests
- UI-Änderungen → Styleguide + Primitives; bei Sprint-Features Evidence in `.qa/evidence/` wenn Acceptance es verlangt
- Keine Secrets in Git; UGC/Karten vor Engine-Nutzung validieren

Vor größeren Änderungen:

```bash
cd Letz-Fetz-Game
npm run checks   # build + unit tests
```

Einzeln: `npm run build`, `npm test`

Code-Qualität: `npx fallow` im `Letz-Fetz-Game/`-Ordner.

Neue Game-Logik **muss** Unit-Tests in `src/game/` haben.

---

## Sicherheit

- Keine Secrets in Git (`.env` nur lokal)
- Rules Engine ist authoritative — UI darf Regeln nicht allein durchsetzen
- Bei P2P: Host validiert alle Aktionen; kein Backend sieht verdeckte Handkarten
- User-generierte Karteninhalte: validieren vor Engine-Nutzung

---

## Cursor Rules

Zusätzliche, dateispezifische Regeln liegen in `.cursor/rules/*.mdc`.
AGENTS.md = Vision & Architektur; `.mdc` = konkrete Code-Patterns.

Globale Agent-Skills (Pipeline + ECC-Helfer): siehe **Agent-Workflows** oben; installiert unter `~/.cursor/skills/`.

---

## Referenzen

| Dokument | Inhalt |
|----------|--------|
| [SPIELANLEITUNG_V1.md](Letz-Fetz-Game/docs/rules/SPIELANLEITUNG_V1.md) | Verbindliches Regelwerk V1 (Engine + physisch) |
| [SPIELANLEITUNG_V2_DRAFT.md](Letz-Fetz-Game/docs/rules/SPIELANLEITUNG_V2_DRAFT.md) | V2 spielbarer Draft (Pack/Cheatbox vorgezogen) |
| [SPIELANLEITUNG_V2_WIP.md](Letz-Fetz-Game/docs/rules/SPIELANLEITUNG_V2_WIP.md) | Engine-/Fetzen-Redesign Grill-Log |
| [DESIGN.md](Letz-Fetz-Game/DESIGN.md) | Agent UI Brief — Navigation, Hybrid-Ton, Anti-Patterns |
| [UI_STYLEGUIDE.md](Letz-Fetz-Game/docs/UI_STYLEGUIDE.md) | Tokens, Komponenten, Spiel- vs Editor-UI |
| [product-roadmap.md](.qa/design/product-roadmap.md) | Sprint-Backlog, Stufen A/B/C |
| [README.md](Letz-Fetz-Game/README.md) | Dev-Setup (`npm i`, `npm run dev`) |
| Figma | https://www.figma.com/design/wRBtVn8juwrMypsLFH740a/Letz-Fetz-Game |

## Living documentation

After material changes, run `@memory-live-doc` (or rely on `@implement` / `@ecc-check` / `@commit-push-safe` / `@project-setup` integration).

- Do not invent features in docs without evidence.
- Storage: `Letz-Fetz-Game/.project-memory/` (bilingual DE+EN JSON; human docs under `Letz-Fetz-Game/docs/` + `docs/en/`).
- Interactive viewer: `Letz-Fetz-Game/docs/memory-live-doc/viewer/` (GitHub Pages).
- First setup: `@project-setup` Step 9 or `@memory-live-doc bootstrap`.
