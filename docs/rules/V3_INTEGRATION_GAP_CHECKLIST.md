# V3 Integration — Lückenliste (Dump → Engine → UI)

> **Zweck:** Abgleich von [`../letz-fetz-v3-überarbeitung.md`](../letz-fetz-v3-überarbeitung.md) (§1–§20) mit Code und Play-UI.  
> **Stand:** 2026-07-28 (#147 trigger paths) · Quelle: Repo `main` / Playtest unter `V3_PACK` + `v3Combat` (36 Fetzgerät-Teile).  
> **Cutover-Status:** [`SPIELANLEITUNG_V3_WIP.md`](./SPIELANLEITUNG_V3_WIP.md) §4 — Engine-Default = V3 (`SPIELANLEITUNG_V3_DRAFT.md`, Freigabe 2026-07-27).

## Legende

| Symbol | Bedeutung |
|--------|-----------|
| ✅ | Engine + sichtbare Play-UI (oder Docs) ausreichend für Playtest |
| ⚙️ | Engine vorhanden; UI nur dünn / fehlend |
| 🟡 | Teilweise (Hooks, Subset, Adapter) |
| ❌ | Fehlt oder nur Regeltext |
| 📦 | Content-/Authoring-Lücke (Pack, Texte, Art) |
| 🚫 | Bewusst out-of-scope laut Epic (physisch / Big-Bang) |

---

## A. Regelkern (Dump §1–§9)

| Dump | Thema | Engine | UI / UX | Notiz |
|------|--------|--------|---------|--------|
| §1 | Systemziel / Effektkette | ⚙️ Timing in `actions.ts` + Status-Pipeline | ✅ Tutorial-Coach + Match-Hints | Kette in Tutorial-Partie |
| §2.1 | Direkte Effekte (Katalog) | 🟡 Teilmenge in Combat/Status | ❌ | Nicht jeder Keyword-Effekt als generisches Effect-System |
| §2.2–2.3 | Zustände + Elementmarken | ✅ `types/status.ts`, `applyStatus`, Impulse | ✅ `StatusChips` | Labels DE; kein Teaching/Tooltip-Detail |
| §2.4 / §8–§9 | 21 Reaktionen | ✅ `reactions.ts` + `reactionOutcomes.ts` | 🟡 `ReactionPickModal` nur bei Mehrfachwahl | Einzel-Reaktion ohne Modal/Banner |
| §3 | Elementattribut vs Impuls | ✅ `elementImpulse` Schema + Pack | ❌ Impuls nicht als Keyword auf Karte/Stage | Spieler sieht Element, nicht „Impuls“ |
| §4 | Quellen (Angriff/Block/Fetz/Ulti/…) | 🟡 Combat + Bound + Hooks | 🟡 Karten/Slots | Blueprint/Transform nur Hooks |
| §5.1 | Schaden Block→Schild→HP | ✅ `shield.ts` | 🟡 Schild-Chip | Keine Pipeline-Visualisierung |
| §5.2–5.18 | Heilung, ziehen, filtern, Würfel, … | 🟡 gemischt V1/V3 | ❌ | Viele Katalog-Effekte nicht V3-spezifisch verdrahtet |
| §6 | Primärmarken-Wirkungen | ⚙️ + Ticks | ✅ Chips | Wirkungs-Copy fehlt in UI |
| §7 | Buffs/Debuffs (Nebel, Gift, …) | ⚙️ `tickStatuses` / Konflikte | ✅ Chips | Gleiches: keine Wirkungserklärung |
| §8–§9 | Reaktionsmatrix + Übersicht | ✅ | 🟡 nur Wahl-Modal | Keine Matrix-Hilfe / Log |

---

## B. Kampf- & Gerätesystem (§10–§16)

| Dump | Thema | Engine | UI / UX | Notiz |
|------|--------|--------|---------|--------|
| §10 | Angriffsarten (normal/Status/Element/Reaktion) | 🟡 Combat + Impulse | ❌ | Keine Typ-Unterscheidung in Combat-Stage-Copy |
| §11 | Block / Vollblock / Teilblock / Reaktionsblock | 🟡 `isHit` / `isFullBlock` + Impulse | ❌ | Vollblock-Impuls unsichtbar |
| §12 | Fetzgerät Träger/Antrieb/Aufsatz | ✅ `fetzgeraetSlots.ts` + Adapter; 📦 **36er Roster** (`engineParts36.ts`) | ✅ Slot-Labels Träger/Antrieb/Aufsatz unter `v3Combat`; Charge-Spalte bleibt Adapter | Effekttexte + Ladung-Pool; Trigger: Hit/Block/Incoming/High/Focus/StatusDmg + Activate |
| §13 | Elementresonanz (1/2/3 Teile) | ✅ `resonance.ts` | ✅ `ResonanceHud` am Engine-Row | HUD bei Tier ≥2 |
| §14 | Ultis | 🟡 `ultimate.ts` + V3 Hooks | ❌ | Keine Ulti-V3-Erklärung |
| §15 | Transformationen | 🟡 `transform.ts` | ❌ | Kaum UX |
| §16 | Area51-Blueprints | 🟡 `applyBlueprints.ts` Hooks | 📦 | Content/Authoring dünn; kein Blueprint-UI |

---

## C. Timing, Konflikte, Balance (§17–§20)

| Dump | Thema | Engine | UI / UX | Notiz |
|------|--------|--------|---------|--------|
| §17 | Timing-Reihenfolge | ⚙️ in `actions.ts` verdrahtet | ❌ | Kein Step-Log / Coach |
| §18 | Konfliktregeln | ⚙️ `tickStatuses` + Choice | 🟡 Modal bei Mehrfachwahl | Konflikte sonst still |
| §19 | Balancegrenzen (Stacks, Caps) | ✅ `STATUS_STACK_LIMIT`, `MAX_SHIELD` | ❌ | Nicht kommuniziert |
| §20 | Gesamtsystem | 📄 Dump + WIP | ❌ | Kein In-App-Regeltext |

---

## D. Produkt- / Cutover-Lücken (nicht nur Code)

| Thema | Status | Nächster sinnvoller Schritt |
|--------|--------|----------------------------|
| Engine-Default = V3 (`AGENTS.md`) | ✅ Cutover 2026-07-27 | `DEFAULT_RULESET` + DRAFT |
| `SPIELANLEITUNG_V3_DRAFT.md` | ✅ | Spielbare Kurzprosa |
| Phase-Coach V3-Sprache | ✅ Tutorial + Start/Aktion | Impuls/Marke/Reaktion/Schild |
| Combat-Stage Feedback | ✅ Toasts | siehe Feedback-Ticket |
| Gemeinsamer Ladungspool max. 6 | ✅ `fetzCharge` + Chip | UI Chip am CharacterDock; Confirm-UI für Träger-Spend fehlt |
| Teil-Trigger + Aufsatz activateCost | ✅ Katalog + Combat/Block/Activate + High/Focus/StatusDmg | Once/Zug Flags; optional Confirm-UI für Träger-Spend offen |
| Resonanz-Anzeige | ✅ `ResonanceHud` | Chip am Engine-Row bei Tier ≥2/3 |
| Slot-UX Playmat | ✅ | V3: Träger/Antrieb/Aufsatz Labels (`data-fetz-slot`) |
| Combat-Feedback Toasts | ✅ `CombatFeedbackToasts` | Impuls / Auto-Reaktion / Schild-Absorb |
| Karten-Keyword „Elementimpuls“ | 📦 | Forge + LetzFetzCard + Pack-Texte |
| V3-Tutorial / Onboarding | ✅ Coach-Kette in erster Tutorial-Partie | Screens + Match-Hints |
| Sandbox / Forge auf V3-Fantasy | ✅ Default `V3_PACK` | Forge Lookup + Sandbox Loader |
| Physische Marker/Token | 🚫 | Außerhalb Repo |
| Vollständiger Pack-Rewrite aller Dump-Beispiele | 📦 | Epic: Hooks ja, Big Content nein |

---

## E. Was für „Spielprinzip + UI/UX überarbeitet?“ fehlt konkret

Priorisierte UX-Backlog-Schnitte (Empfehlung):

1. **P0 UX:** Phase-Coach + Combat-Feedback für Impuls → Marke → Reaktion → Schild  
   - ✅ **Wave 1 (2026-07-26):** Setup-Spalte + Tutorial-Tile + `V3TutorialFlow` + `tutorialHints` Coach-Copy  
   - ✅ **Wave 2 (2026-07-27):** `CombatFeedbackToasts` (Impuls / Auto-Reaktion / Schild-Absorb)  
2. **P1 UX:** Resonanz-HUD + Fetzgerät-Slot-Labels am Playmat  
   - ✅ **2026-07-27:** `ResonanceHud` + Träger/Antrieb/Aufsatz Labels unter `v3Combat`  
3. **P1 UX:** Reaktions-Toast auch bei Auto-Resolve (nicht nur Modal) — ✅ über Combat-Feedback  
4. **P2 UX:** Keyword/Tooltip „Elementimpuls“ auf Karten; kurze In-Game-Hilfe  
5. **Docs:** `SPIELANLEITUNG_V3_DRAFT.md` + Cutover AGENTS wenn Playtests grün  

Acceptance: `.qa/acceptance/v3-tutorial-setup-flow.md`  
Code: `setup/V3TutorialFlow.tsx`, `coach/v3CoachCopy.ts`, `GameSetup` phase `tutorial`

Engine-Playtest-Kern (§2–§3, §5.1, §6–§9, §12–§13, Choice §18) ist **weitgehend spielbar** unter Setup-V3.  
**Spielprinzip neu erzählen** in UI/UX ist **nicht** erledigt — nur Overlay (`StatusChips`, `ReactionPickModal`, Setup-Hinweis).

---

## F. Schnellreferenz Code

| Bereich | Pfad |
|---------|------|
| Dump | `docs/letz-fetz-v3-überarbeitung.md` |
| WIP / Cutover | `docs/rules/SPIELANLEITUNG_V3_WIP.md` |
| Status-Typen | `src/game/types/status.ts` |
| Engine Status | `src/game/engine/status/*` |
| Combat/Schild | `src/game/engine/status/shield.ts` |
| Pack | `src/game/packs/v3/` |
| UI Chips | `src/features/play/board/StatusChips.tsx` |
| UI Reaktion | `src/features/play/board/ReactionPickModal.tsx` |
| Epic | `.qa/design/v3-rules-engine.md` |

---

*Living checklist: bei Material-Änderungen an V3 Engine/UI diese Tabelle im selben Change mitziehen.*
