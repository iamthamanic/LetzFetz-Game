# Letz Fetz — Spielanleitung V3 (WIP)

> **Status:** Ziel-Regelmodell aus `docs/letz-fetz-v3-überarbeitung.md` (2026-07-25) — **noch nicht** Engine-Default-Wahrheit.  
> **Engine heute:** [`SPIELANLEITUNG_V1.md`](./SPIELANLEITUNG_V1.md) bis Flag-/Cutover-Freigabe.  
> **Ziel:** V3 1:1 — Elementimpulse, Marken, 21 Reaktionen, Schild, Träger/Antrieb/Aufsatz, Resonanz.  
> **Epic:** `.qa/design/v3-rules-engine.md` (ersetzt soft-layered `v3-effect-reaction-system.md`).

Produktname: **Letz Fetz**.

---

## 0. Beziehung zu V1 / V2

| Quelle | Rolle |
|--------|--------|
| V1 | Aktuelle Engine-Wahrheit + physisches Playtest-Baseline |
| V2 WIP/DRAFT | Vorgänger-Redesign (Phrase-Reihe D8/E2, Pack/Cheatbox) — **nicht** dauerhafte Zielwahrheit gegen V3 |
| V3 WIP (dieses Doc) | **Ziel-Regelmodell** für Migration; Engine-Slices hinter Rollout-Flag |
| V3 DRAFT | Später: spielbare Prosa, wenn Matrix + Slots eingefroren |

**Produktentscheidung (LOCKED 2026-07-25):** Implementiere V3 1:1 als Target. **Nicht** V3 verdünnen, um V2 freie Phrase-Reihe als permanente Wahrheit zu halten.

---

## 1. Festgelegt (Grill / Intake)

| ID | Thema | Entscheidung |
|----|--------|--------------|
| V3-D1 | Regelquelle | Dump `letz-fetz-v3-überarbeitung.md` = kanonischer Inhalt (§1–§20) |
| V3-D2 | Fetzgerät | **Träger / Antrieb / Aufsatz** (§12) — Zielmodell, nicht nur Soft-Tags |
| V3-D3 | vs V2 D8/E2 | V2 freie Reihe wird **zugunsten V3-Slots adaptiert/ersetzt**; Phrase ist Migrationspfad, keine Endwahrheit |
| V3-D4 | Rollout | Engine darf vertikal slicen + Flag; Target bleibt volles V3 |
| V3-D5 | Reaktionwahl | Mehrfach → aktiver Spieler (`pendingChoice`); max 1 Reaktion/Aktion (§3, §18) |
| V3-D6 | Schaden | Block → Schild → Verhinderung → Leben (§5.1); Schild ≠ Vollblock |
| V3-D7 | Soft-layer Design | Vorherige Annahme „V3 nur Kampflayer auf Phrase“ → **verworfen** |

---

## 2. Konflikt V2 Phrase vs V3 Slots

| V2 (D8/E2/L4) | V3 (§12) | Auflösung |
|---------------|----------|-----------|
| Freie Reihe, Nachbar-Synergie | Rollen-Slots Träger/Antrieb/Aufsatz | **V3 gewinnt als Ziel** |
| `phraseSlot`: core/mode/tool/charge | Träger/Antrieb/Aufsatz + Ladung | Engine migriert; Legacy-Phrase nur Adapter bis Cutover |
| Preferierte Rollen als Tags | Harte Slot-Semantik | Tags allein reichen nicht |

V2_WIP D8 bleibt historisch lesbar; neue Arbeit folgt V3.

---

## 3. Kanonischer Regelvolltext

Der vollständige Systemtext (Effektebenen, Marken, Matrix 21, Timing §17, Konflikte §18, Balance §19) steht in:

**[`../letz-fetz-v3-überarbeitung.md`](../letz-fetz-v3-überarbeitung.md)**

Dieses WIP-Dokument pflegt Status, Konflikte und Cutover. Inhaltliche Regeländerungen an V3 → Dump **und** hier Statuszeile mitziehen.

---

## 4. Engine-Cutover (Kurz)

1. P0: Status/Schild/Impuls/Reaktionskern + Mono + Dampf hinter Flag  
2. P1: 15 Mischreaktionen, Ticks, Slots, Resonanz, Play-UI  
3. P2: Ulti/Transform/Blueprint-Hooks, Pack-Schema, Bot, E2E  
4. Explizite Freigabe → V3 ersetzt V1 als Engine-Wahrheit in AGENTS.md  

Bis Schritt 4: Default-Partie = V1-Verhalten.

---

## 5. Offen

- [ ] Pack-Keyword-Schema für Impulse (Issue Pack-Schema)
- [ ] Physische Marker/Token außerhalb Repo
- [ ] V3_DRAFT spielbare Kurzprosa nach P0-Playtests
