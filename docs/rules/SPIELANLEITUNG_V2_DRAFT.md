# Letz Fetz — Spielanleitung V2 (Draft)

> **Status:** Ausformulierter Draft aus Grill D1–D35 — **noch nicht Engine-Wahrheit**.  
> **Aktuelle Wahrheit für Code:** [`SPIELANLEITUNG_V1.md`](./SPIELANLEITUNG_V1.md)  
> **Design-Log:** [`SPIELANLEITUNG_V2_WIP.md`](./SPIELANLEITUNG_V2_WIP.md)

Produktname: **Letz Fetz**.

---

## 1. Ziel des Spiels

Zwei Spieler duellieren sich. Wer den Gegner auf **0 Leben** bringt, gewinnt.

- Partielänge-Ziel: mittellang (T2) — Bauen und Fetzen wechseln sich ab.
- Wer nicht baut, verliert systematisch an Druck und Schutz (Engine-Pflicht).

---

## 2. Startaufstellung

| Parameter | Default (Playtest) | Schalter |
|-----------|-------------------|----------|
| Startleben / Heilungs-Cap | **30** | Cheatbox: 20 / 25 / 30 (Cap = Startwert) |
| Charakter | 1 Karte + Passive + Ult (1×/Partie) | wie V1 |
| Handstart | wie V1 (5 / 6) | — |
| Haupt-Deck | **P100**-Mix (siehe §8) | Exact Counts kalibrierbar |

Würfelbonus (W6) vorerst wie V1: 1–2 → +0, 3–4 → +1, 5–6 → +2.

---

## 3. Kartentypen

| Typ | Wo | Rolle |
|-----|-----|--------|
| **Angriff** | nur Hand | Fetzen — Schaden / Herausfordern |
| **Block** | nur Hand | Fetzen — Verteidigung |
| **Engine-Teil** | Hand → Phrase-Reihe | Bau-Teile (Kern / Modus / Werkzeug) |
| **Ladung (Boost)** | Hand → Ladungs-Slot | G5-Ladung; manche zünden sofort und verbrauchen sich |
| **Glitch** | wie V1 | Sofort / spielbar |
| **Charakter / Ult / Arena** | wie V1-Baseline | bis explizit geändert |

Angriff und Block werden **nicht** in die Engine gebaut.

---

## 4. Engine-Reihe (Phrase + Ladung)

### 4.1 Layout (N4 = L4)

Jeder Spieler hat:

1. **Drei Phrase-Plätze** — Rollen: **Kern · Modus · Werkzeug** (von links nach rechts als bevorzugte Lesereihenfolge).
2. **Einen Ladungs-Slot** — nur für Boost/Ladung; kein Phrase-Tag.

Maximal **4** gebaute Karten insgesamt (3 Phrase + 1 Ladung).

### 4.2 Bauen

- In der Bau-Phase: **entweder** ein Engine-Teil (oder eine Ladung) bauen **oder** die Phrase umsortieren — nicht beides.
- Umsortieren kostet die Bau-Aktion (R2 + C1).

### 4.3 Tags (T3 + TC + X2)

Jedes Engine-Teil hat einen **bevorzugten Tag** (`core` / `mode` / `tool` ↔ Kern / Modus / Werkzeug).

- Die **Position** legt die aktuelle Funktion fest (Passive light).
- Off-Tag ist erlaubt: Teil darf auf „falscher“ Position liegen.
- **Voller Phrase-/Y-Bonus** nur, wenn bevorzugter Tag = Positionsrolle.

### 4.4 Escalation (V4)

- **Passive (light):** Ab dem Bau verzerrt die Positionsfunktion Angriff, Block oder Hand — schwach, aber spürbar.
- **Aktivieren:** Stärkerer Effekt. Kosten (A1): **1 Handkarte abwerfen + Teil erschöpfen**, zählt als **Hauptaktion**.

Start-Archetypen (E3):

| Passive | Skizze |
|---------|--------|
| `p_atk` | +1 Angriffswert bei eigenen Angriffen/Herausfordern |
| `p_block` | +1 Blockwert bei eigenem Block |
| `p_draw` | 1×/Zug nach Bauen eines Teils: ziehen 1, abwerfen 1 |

| Aktivierung | Skizze |
|-------------|--------|
| `a_dmg` | 2 Schaden am Gegner |
| `a_heal` | 2 Leben heilen |
| `a_exhaust` | 1 gegnerisches Phrase-Teil erschöpfen |

---

## 5. Fetzen (Kampf)

### 5.1 Spielerangriff

Angriff von der Hand wie V1 (Wert + Würfelbonus + Passive/Mono). Block von der Hand. Überschuss = Schaden an Leben.

### 5.2 Herausfordern (H1 + W1)

- Ziel: **ein Phrase-Teil** des Gegners (nicht Ladung, nicht „ganze Phrase“).
- Zielwert: **gedruckter Widerstand** des Teils + ggf. Boni.
- Math / Block / Zerstörung: analog V1 Herausfordern gegen gebundene Karte.

---

## 6. Mono-Element (M3 + MBflex)

Wenn alle **drei** Phrase-Teile dasselbe Element haben (Ladung zählt nicht):

| Modus | Effekt (Playtest) |
|-------|-------------------|
| **MB1** (Default) | +1 Angriff und +1 Block, solange Mono gilt |
| MB2 | +2 Angriff (Block unverändert) — Test |
| MB3 | +2 Block (Angriff unverändert) — Test |
| MB4 | +1 Angriff, +1 Block, +1 Ziehen beim Zugstart — Test |

Cheatbox schaltet MB1–MB4; Engine wendet Mono erst nach V2-Freigabe an.

---

## 7. Ladung (H2)

- Boost wird nur in den **Ladungs-Slot** gebaut.
- Liegt als Ladung/Token; unterbricht die Phrase-Kette nicht.
- Manche Ladungen zünden sofort und verbrauchen sich; andere halten bis Auslösung/Ablauf (Details follow V1-Boost-Effekte bis neu spezifiziert).

---

## 8. Testpack P100

Zielmix (D34):

| Kategorie | Anzahl |
|-----------|--------|
| Angriff | 24 |
| Block | 24 |
| Ladung (Boost) | 12 |
| Engine-Teil | 30 |
| Glitch | 10 |
| **Summe** | **100** |

Engine-Teile: **Ggen** — generisch aus Element × bevorzugter Tag × Widerstand × Archetypen; **Cbias** weiche Tag→Archetyp-Defaults mit ~20–30 % Off-Default.

Mindest-Felder Engine-Teil (Smin): `id`, `name`, `element`, `preferredTag`, `resistance`, `passiveArchetype`, `activateArchetype`.

---

## 9. Was V2 bewusst nicht ist

- Sieg durch „Gegenstand fertig“ / Punkte
- Feste Körper-Slots statt freier Phrase
- Angriff/Block in die Reihe bauen
- Doppelmodus Sofort+Gebunden auf derselben Karte
- Kostenloses Umsortieren
- Mono ab 2 Teilen oder Mono inkl. Ladung als Default

---

## 10. Migrationsnotiz

1. Code in `src/game/` folgt **V1**, bis dieser Draft freigegeben wird.
2. Pack `v2-p100` und Cheatbox-O11 dürfen vorgezogen werden.
3. Bei Freigabe: AGENTS.md + Engine auf dieses Dokument umstellen; WIP-Log bleibt Historie.
