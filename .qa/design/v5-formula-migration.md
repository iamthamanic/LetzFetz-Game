# Epic: V5 Formula Migration

**Slug:** `v5-formula-migration`  
**Stand:** 2026-07-29  
**Source of truth:** `docs/letz-fetz-v5-spielkonzept.md`  
**Locale:** de (UI) / en (code)

---

## Problem & Intent

Das spielbare Produkt hängt an **V1 Bound-4** bzw. **V3 Fetzgerät (Träger/Antrieb/Aufsatz + Charge 6)**. V5 ersetzt die permanente Auslage durch eine **Formel** aus Technik / Essenz / Katalysator, verschiebt Aktivierung in die **Formelphase**, begrenzt **Fetzladung auf 3** (Großformel), und verlangt ein **Visual-Recipe** (Technik = Hauptform), bevor Meshy skaliert.

Ziel: Ein spielbarer **V5-Playtest-Default** (20 LP, Shared Deck, Formelphase, Challenge gestört/zerstört, Visual-Vertrag + Formelgestell-MVP), bei dem Legacy-Pfade (Base/V1, optional V3) regressierbar bleiben.

## Non-Goals (explizit deferred)

| Deferred | Warum |
|----------|--------|
| Alle 36 Formel-Meshy-GLBs | §28: zuerst MVP 3+3+3 = 27 Kombis |
| WebP-Sparmodus / zweite Render-Pipeline | Erst nach Performance-Messung |
| Online P2P / Tauri / Steam | Phase 2+ außerhalb V5-Cutover |
| V1 Base-Pack entfernen | Regression behalten (`'base'`) |
| Hard-delete aller V3-Engine-Part-Assets | Soft-retire aus Default-Play; Forge/Build später retarget |
| 1.728 hardcodierte Animations-IDs | Visual Recipe aus Eigenschaften |

## Assumptions (locked)

1. Play-Default nach Cutover = **V5**; `'base'` bleibt V1-Regression.
2. Phase `build` → Formelphase (Actions: bauen / ersetzen / aktivieren / Schnellmix / passen).
3. Primärelement = Aktionskarte; Essenz = Sekundär; Technik = Form ohne Element (§17.0).
4. Charge max **3**; Großformel erst bei 3 Ladung (nicht freie Ulti im V5-Ruleset).
5. Visual: `TechniqueVisual` / `EssenceVisual` / `CatalystVisual` + `VisualRecipe` **vor** neuer Meshy-Produktion.
6. Formelgestell zeigt **komponierten Kern**, nicht drei gleichwertige Karten.
7. `typed-strict` / Boy Scout auf allen touched files; kein `any`.

## Options

| Option | Pros | Cons |
|--------|------|------|
| **A. Big-bang replace engine** | Ein Wahrheitszustand | Hohes Regressionsrisiko, lange PRs |
| **B. Flag `v5Formula` parallel (gewählt)** | V1/Base bleibt; schrittweise Cutover | Zwei Pfade bis Cleanup-Slice |
| **C. Nur Docs + UI Mock** | Schnell sichtbar | Kein spielbarer Test |

**Decision:** Option B — Ruleset-/Pack-Flag, vertikale Slices Engine → Pack → Play UI → Bot → Build-Retarget → Legacy-Cleanup.

## Cross-domain

| Domain | Sign-off |
|--------|----------|
| Rules Engine | Pure TS in `src/game/`; Vitest Pflicht |
| Play UI | `src/features/play/`; Deutsch; Primitives |
| Build | Combinate-Slots retarget; Development authoring behalten |
| Visual | Recipe ersetzt `EngineRecipe` für V5-Matches; Fetz-3D nicht Default |
| Security | Keine Secrets; Pack-JSON als `unknown` narrowen |

## Runtime matrix

| Area | Local Vite | Cloud | Tauri |
|------|------------|-------|-------|
| Engine / Packs | yes | n/a | later same |
| Play Solo vs Bot | yes | n/a | later |
| Build authoring | yes (dev bridge) | n/a | later |
| Meshy | offline CLI / MCP, not match runtime | — | — |

## UI direction (Play Formelgestell)

Hybrid-Ton wie Styleguide: verspielte Arena, klare Lesbarkeit. Formelgestell: Essenzbehälter → Technikkern (komponiert) → Katalysatorring. Keine drei gleich großen Produktkarten als Hauptlesart. Kein neues DaisyUI/Next.

## Implementation sketch (paths)

- Types: `src/game/types/` — formula slots, card kinds, visual contracts, ruleset `v5Formula`
- Engine: `src/game/engine/actions.ts`, neue `formula*.ts`, charge cap, challenge disturb, ultimate gate
- Status/reactions: adapt `src/game/engine/status/*` an V5 §17–20
- Pack: `src/game/packs/v5/` — MVP 9 + Gegenstände + Deck-Mix
- Play: setup `resolveGamePackChoice.ts`, board FormulaRig, wire actions
- Visual: `formulaVisual.ts` / `visualRecipe.ts` (ersetzt Nutzung von `engineRecipe` im V5-Pfad)
- Bot: `src/game/engine/bot.ts`
- Build: `buildTypes` slots → technik/essenz/katalysator
- Docs: `SPIELANLEITUNG_V5_DRAFT.md`, AGENTS, SPIELUEBERSICHT, `.cursor/rules`

## MVP 0.1 cut (Ponytail Rung 1)

**In MVP issues:** Docs, types, Formelphase, Resolution-Kern, Challenge, Charge/Großformel, Combat-Align, MVP-Pack 9, Play default, Formula Rig UI, Visual Recipe data, Play action wiring, Bot, Build slot rename, E2E smoke, Legacy soft-retire.

**Out of MVP issues (later / P2 content):** Restliche 27 Formel-Kartentexte, volle Reaktions-Copy-Parity falls Restlücken, Meshy-Batch für 9+, Character-Flavor-Pass alle 7 Großformeln wenn nicht in Pack-Slice, WebP mode.

## MVP-9 Komponenten (fest)

| Rolle | IDs (DE) |
|-------|----------|
| Technik | Durchschuss, Notfallbarriere, Rückhandtechnik |
| Essenz | Eingekochte Glut (Feuer), Überdrucktes Kondensat (Wasser), Kräuterstaub (Erde) |
| Katalysator | Echo, Überladung, Spiegelung |
