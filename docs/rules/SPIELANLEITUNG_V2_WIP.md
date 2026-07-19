# Letz Fetz — Spielanleitung V2 (WIP / Redesign)

> **Status:** Entwurf aus Design-Grill (D1–D35) — **Struktur geschlossen**; noch nicht Engine-Wahrheit, bis V2 freigegeben.  
> **Aktuelle Wahrheit für Code & Playtests:** [`SPIELANLEITUNG_V1.md`](./SPIELANLEITUNG_V1.md)  
> **Pflege:** Bei jeder festgelegten Design-Entscheidung in diesem Dokument nachziehen. Wenn V2 „fertig genug“ ist, ersetzt sie V1 als Regelquelle (AGENTS.md + Engine).

Produktname: **Letz Fetz** (nicht „Lets Fetz“).

---

## 0. Was sich ändern soll (Intent)

V1: Elementkarten können Sofort **oder** gebunden werden; gebundene Karten = Engine mit Element-Synergien und Aktivierung.

V2-Richtung: Die **Engine ist ein Gegenstand / Motor / Waffe**, den man aus Teilen **frei in einer Reihe** zusammensetzt (Vale-Tableau + Believe-in-me-Kombi-Boni). **Fetzen** (Angriff/Block) bleibt Kern; Bauen verzerrt den Fetz, ersetzt ihn nicht.

Referenzen (Inspiration, keine 1:1-Kopie):

- [The Vale of Eternity](https://pegasus.de/The-Vale-of-Eternity/51330G) — freie Auslage, Effekte feuern, Opportunitätskosten
- [Believe in me! (please)](https://gamefound.com/de/projects/wyrmgold/believe-in-me-please) — Kombi von Teilen → Bonus / absurde Identität (nicht zwingend Kopf/Körper/Füße-Slots)

---

## 1. Festgelegte Design-Entscheidungen (Grill-Log)

| ID | Thema | Entscheidung | Code |
|----|--------|--------------|------|
| D1 | Sieg | Gegner auf **0 LP** | LP-Duel bleibt |
| D2 | Engine-Pflicht | Wer nicht baut, verliert systematisch an Druck/Schutz | B |
| D3 | Kern-Fantasy | **Fetzen**; Bau verzerrt, ersetzt nicht | — |
| D4 | Escalation | Primär **V** (Aktivierung / Opportunitätskosten), sekundär **Y** (Kombi); S leicht; M nicht primär | V→Y |
| D5 | Vielfalt | Eine Bau-Regel, viele Waffen durch Kombi (nicht DT-Helden-Kits) | Bedeutung 1 |
| D6 | Charakter | **C1** — 1 Passive + Ult; Engine trägt Vielfalt | C1 |
| D7 | Partielänge | **T2** — mittlere Partie, Bau und Fetz abwechselnd | T2 |
| D8 | Slot-Modell | **E2** — freie Reihe, Nachbar-/Positions-Synergie (keine Rollen-Slots) | E2 |
| D9 | Believe-in-me | Nur **Kombi → Bonus**, nicht feste Körper-Slots | — |
| D10 | Was in die Reihe | Engine-Teile **+ Boost**; Angriff/Block **nur Hand** | B2 |
| D11 | Boost | Alle Boosts = **G5**-Ladungen in der Reihe; manche zünden sofort und verbrauchen sich (**H2**) | H2 |
| D12 | Phrase | **P1** — Tags (Satzglieder); Y-Bonus nur bei erlaubter Reihenfolge/Nachbarschaft; falsche Ordnung erlaubt aber schwächer | P1 |
| D13 | Reihen-Limit | max **4** Teile | N4 |
| D14 | Umsortieren | Erlaubt, aber **teuer** | R2 |
| D15 | Kosten Umsortieren | Verbraucht die **Bau-Aktion** (umsortieren *oder* ein Teil bauen, nicht beides) | C1 |
| D16 | Phrase-Tags | **3** Tag-Arten (T3); Labels: Kern / Modus / Werkzeug | T3 |
| D17 | Tag-Quelle | **TC** — Karte hat bevorzugten Tag; Position (Kern/Modus/Werkzeug) kann umdeuten und ändert die Funktion | TC |
| D18 | Off-Tag | Erlaubt; Position = Funktion; voller Y-/Phrase-Bonus nur wenn bevorzugter Tag = Positionsrolle | X2 |
| D19 | V-Trigger | **V4** — schwache Passive ab Bau + gezielt aktivieren (Kosten/1×); Vale-Präsenz+Feuern, Fetzen bleibt Kern | V4 |
| D20 | Aktivierungs-Kosten | Wie V1: **1 Handkarte abwerfen + erschöpfen**, zählt als **Hauptaktion** (A4 Vale-Vollfeuer bewusst später) | A1 |
| D21 | Boost vs. Phrase | **L4** — N4 = **3 Phrase-Plätze** (Kern/Modus/Werkzeug) + **1 Ladungs-Slot** (Boost); Phrase und Ladung getrennt | L4 |
| D22 | Mono-Element | Bonus nur bei **vollständiger Phrase** (3/3) gleiches Element; Ladung zählt nicht mit (kein M3+) | M3 |
| D23 | Kartenschema Phrase | Neue Kartenart **Engine-Teil** (K1); Angriff/Block/Ladung/Glitch getrennt; Vale-Markt (K4) später | K1 |
| D24 | Herausfordern | Zielt auf **ein Phrase-Teil** (zerstören analog V1); Ladungs-Ziel (H2) / Sabotage (H4) später optional | H1 |
| D25 | Widerstand Phrase-Teil | **Gedruckte Widerstandszahl** pro Engine-Teil (W1); Herausfordern-Math wie V1 | W1 |
| D26 | Startleben | **Lflex** — Playtest-Variable; **Default 30**, Cap = Startwert; final nach Playtests in Anleitung | Lflex/30 |
| D27 | Deck-Größe | **Größeres** Testpack als V1 (~70+) — Fetzen und Teile sollen nicht verhungern | D80 |
| D28 | Teil-Content | Erst **generische** Engine-Teile aus Attribut-Templates (Element × Tag × Widerstand × Passive-/Aktivierungs-Archetyp); absurde Showpieces nachziehen | Ggen |
| D29 | Teil-Schema | **Smin** — id/Name, element, preferredTag, resistance, passiveArchetype, activateArchetype (+ optional image) | Smin |
| D30 | Archetyp-Palette | Start **E3** (je 3 Passive + 3 Aktivierung); **Eflex** — Listen wachsen im Playtest | E3+Eflex |
| D31 | Start-Enums | Passive: `p_atk` / `p_block` / `p_draw` · Aktivierung: `a_dmg` / `a_heal` / `a_exhaust` | D30b |
| D32 | Mono-Bonus Effekt | **MBflex** — Playtest-Variable; **Default MB1** (+1 Angriff und +1 Block solange Mono-Phrase); MB2–MB4 später testen | MBflex/MB1 |
| D33 | Generator-Kopplung | **Cbias** — weiche Defaults Tag→Archetyp; alle Kombis legal; ~20–30 % absichtlich Off-Default | Cbias |
| D34 | Erstes Testpack | **P100** — Zielmix: 24 Angriff / 24 Block / 12 Ladung / 30 Engine-Teil / 10 Glitch (=100); Counts kalibrierbar | P100 |
| D35 | Playtest-Schalter | Cheatbox/Setup: LP **20/25/30** (Default 30) + Mono **MB1–MB4** (Default MB1) | O11 |

**Cbias-Defaults (Generieren):**

| preferredTag | Passive-Default | Aktivierung-Default |
|--------------|----------------|---------------------|
| Kern | `p_atk` | `a_dmg` |
| Modus | `p_draw` | `a_heal` |
| Werkzeug | `p_block` | `a_exhaust` |

### Mindest-Schema Engine-Teil (Smin)

| Feld | Pflicht | Werte / Notes |
|------|---------|----------------|
| `id` | ja | stabiler Key |
| `name` | ja | Platzhalter ok (`Feuer-Kern 01`) |
| `element` | ja | Feuer…Licht (wie V1) |
| `preferredTag` | ja | `core` / `mode` / `tool` ↔ Kern / Modus / Werkzeug |
| `resistance` | ja | Int, typisch 2–6 |
| `passiveArchetype` | ja | Enum — Start: `p_atk` / `p_block` / `p_draw` |
| `activateArchetype` | ja | Enum — Start: `a_dmg` / `a_heal` / `a_exhaust`; Kosten immer A1 |
| `image` | nein | später |

### Erste Archetyp-Enums (Start-E3 — **fest** D31)

**Passive (light, Positionsfunktion):**

| id | Wirkung (Skizze) |
|----|------------------|
| `p_atk` | +1 Angriffswert bei eigenen Angriffen/Herausfordern |
| `p_block` | +1 Blockwert bei eigenem Block |
| `p_draw` | Einmal pro Zug: nach Bauen eines Teils — ziehen 1, abwerfen 1 (Luft-light) |

**Aktivierung (A1-Kosten):**

| id | Wirkung (Skizze) |
|----|------------------|
| `a_dmg` | 2 Schaden am Gegner |
| `a_heal` | 2 Leben heilen |
| `a_exhaust` | 1 gegnerisches Phrase-Teil erschöpfen |

### Noch offen / nächste Arbeit (kein Design-Grill mehr)

| ID | Thema | Status |
|----|--------|--------|
| — | V2-Regeln aus D1–D35 in spielbare Abschnitte | **Draft:** [`SPIELANLEITUNG_V2_DRAFT.md`](./SPIELANLEITUNG_V2_DRAFT.md) |
| — | Pack-Generator Ggen + P100 + Cbias | **Code:** `src/game/packs/v2/` |
| — | Cheatbox O11 (LP + Mono) | **Code:** PlaytestCheatbox + `MatchMeta` |
| — | Exact Counts nach Playtests finalisieren | playtest |
| — | V2 Engine-Freigabe (applyAction folgt Draft) | backlog |

---

## 2. Arbeitsmodell V2 (provisorisch, nicht final)

### 2.1 Sieg & Tempo

- Sieg: Gegner auf 0 Leben.
- Partielänge-Klasse: T2 (mittellang).
- **Startleben / Heilungs-Cap:** Playtest-Variable (**Lflex**), **Default 30**. Final erst nach Playtests; UI soll 20/25/30 umschaltbar machen (O11).

### 2.2 Charakter (C1)

- 2 Elemente (oder Frei/Frei), 1 Passive, 1 Ult (einmal pro Spiel).
- Keine eigenen Geheim-Mechaniken, die die Engine-Vielfalt ersetzen.

### 2.3 Hand-Verben & Kartentypen (K1)

- **Angriff** und **Block** nur von der Hand (Würfelbonus wie V1 vorerst).
- **Engine-Teil** (neu): Phrase — Name, Element, bevorzugter Tag, Passive/Aktivierung; nur bauen, nicht als Angriff spielen.
- **Boost/Ladung:** nur in den Ladungs-Slot (H2/L4).
- Ulti, Glitch, Arena: V1-Baseline, bis explizit geändert.
- Vale-Markt für Teile (**K4**): bewusst später.
- **Deck:** Ziel **P100** (24/24/12/30/10); Exact Counts playtest-variabel.
- **Content:** Engine-Teile zuerst **generisch per Attribut-Template (Ggen)**; Generator nutzt **Cbias**-Defaults (Kern→p_atk/a_dmg, …), ~20–30 % Off-Default; Showpiece-Namen später.
- **Playtest-Schalter (D35):** LP 20/25/30 (Default 30); Mono MB1–MB4 (Default MB1).
- **Herausfordern (H1):** Angriff gegen **ein Phrase-Teil** (nicht Ladung, nicht ganze Phrase). Zielwert mit **gedrucktem Widerstand (W1)** + Block wie V1.### 2.4 Engine-Reihe (E2 + N4 + P1 + R2 + L4)

- **N4 = 3 Phrase + 1 Ladung:** Phrase-Plätze Kern · Modus · Werkzeug + separater Ladungs-Slot.
- Freie Platzierung in den Phrase-Plätzen; **Nachbarn** und **Tag-Reihenfolge** entscheiden Y-Boni (P1).
- **Drei Tag-Arten (T3):** Kern · Modus · Werkzeug.
- **TC + X2:** Bevorzugter Tag auf der Karte; Position setzt die Funktion; Off-Tag erlaubt, aber voller Phrase-/Y-Bonus nur bei Tag = Position.
- Umsortieren (Phrase): erlaubt, kostet die **Bau-Aktion** (R2 + C1) — in dem Zug kein zusätzliches Teil bauen.
- Absurde Teil-Namen (Phrase) sind erwünscht; Grammatik-Bonus nur bei gültiger Tag-Kette.

### 2.5 Boost (H2 + L4)

- Boost wird **gebaut** in den **Ladungs-Slot** (nicht in die Phrase).
- Liegt als **Ladung/Token** (G5); manche zünden sofort und verbrauchen sich; andere halten, bis ausgelöst/abgelaufen.
- Kein Phrase-Tag; unterbricht die Kern→Modus→Werkzeug-Kette nicht (separater Slot).
- Kein zweites paralleles Boost-System.

### 2.6 Escalation (V → Y) — V4

- **Passive (light):** Ab dem Bau verzerrt die Positionsfunktion (Kern/Modus/Werkzeug) bereits Angriff/Block/Hand — schwach, aber spürbar.
- **Aktivieren:** Stärkerer Effekt (Teil und/oder Phrase): **1 Handkarte abwerfen + Teil erschöpfen**, zählt als **Hauptaktion** (A1). Vale-Vollfeuer (A4) ist bewusst zurückgestellt.
- Kombis, Tag-Match (X2) und **Mono-Element (M3 + MBflex):** vollständige Phrase ein Element → Default **MB1** (+1 Angriff und +1 Block); andere MB-Modi playtestbar. Ladung zählt nicht.
---

## 3. Explizit verworfen (für V2)

- Sieg durch Punkte / „Gegenstand fertig“ als Siegziel
- Dice-Throne-style Charakter-Kits als Hauptvielfalt
- Harte Rollen-Slots (E1 / P2) als Pflicht-Raster
- Angriff/Block in die Engine bauen (B3)
- Doppelmodus Sofort+Gebunden auf derselben Karte (K3)
- Kostenloses Umsortieren (R1) oder nie umsortieren (R0) — Stand: R2
- Unbegrenzte Tableau-Größe (N0)
- Mono ab 2 Teilen (M2) oder Mono inkl. Ladung als Default (M3+)

---

## 4. Migrationsnotiz (Engine / Code)

Solange dieser WIP nicht als **V2 freigegeben** ist:

1. `src/game/` folgt **V1**.
2. UI-Begriffe („Engine bauen“) dürfen V2-Sprache vorbereiten, Regeln bleiben V1.
3. Card Forge / Library: neuer Typ **Engine-Teil** vorbereiten; bis V2-Freigabe bleibt Pack inhaltlich V1.

---

## 5. Änderungsprotokoll

| Datum | Änderung |
|-------|----------|
| 2026-07-19 | WIP angelegt; Grill-Entscheidungen D1–D14 dokumentiert; O1–O8 offen |
| 2026-07-19 | D15 = C1 (Umsortieren = Bau-Aktion); O1 geschlossen |
| 2026-07-19 | D16 = T3 (drei Phrase-Tags); O3b Tag-Namen offen |
| 2026-07-19 | D17 = TC (Tag auf Karte + Position ändert Funktion); O3c Off-Tag offen |
| 2026-07-19 | D18 = X2 (Off-Tag ok, voller Bonus nur bei Match) |
| 2026-07-19 | D19 = V4 (Passive light + Aktivieren); O4b Kosten offen |
| 2026-07-19 | D20 = A1 (Aktivieren = Handkarte + erschöpfen + Hauptaktion) |
| 2026-07-19 | D21 = L4 (3 Phrase + 1 Ladungs-Slot) |
| 2026-07-19 | D22 = M3 (Mono nur bei voller Phrase; Ladung zählt nicht) |
| 2026-07-19 | D23 = K1 (Kartenart Engine-Teil); K3 verworfen, K4 später |
| 2026-07-19 | D24 = H1 (Herausfordern = ein Phrase-Teil); H0/H3 verworfen |
| 2026-07-19 | D25 = W1 (gedruckter Widerstand); Engine-Struktur-Ast weitgehend dicht |
| 2026-07-19 | D26 = Lflex Default 30 (Startleben Playtest-Variable; Cap = Start) |
| 2026-07-19 | D27 = D80 (größeres Deck); D28 = Ggen (Template-Teile zuerst) |
| 2026-07-19 | D29 = Smin (Mindest-Felder Engine-Teil); O12 geschlossen |
| 2026-07-19 | D30 = E3+Eflex; Start-Enums vorgeschlagen (D30b Bestätigung offen) |
| 2026-07-19 | D31 = Start-Enums übernommen (p_atk/block/draw · a_dmg/heal/exhaust) |
| 2026-07-19 | D32 = MBflex Default MB1 (+1 Atk/+1 Block bei Mono-Phrase) |
| 2026-07-19 | D33 = Cbias (Tag→Archetyp Defaults; Off-Default-Noise erlaubt) |
| 2026-07-19 | D34 = P100 Testpack-Mix; D35 = Cheatbox LP+Mono; **Design-Grill Struktur geschlossen** |
| 2026-07-19 | Draft-Regeln + Ggen/P100-Code + Cheatbox O11; Engine bleibt V1 |
