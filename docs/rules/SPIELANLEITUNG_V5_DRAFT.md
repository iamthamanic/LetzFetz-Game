# SPIELANLEITUNG V5 — Draft (spielbare Prosa)

**Status:** Ziel-Regelwahrheit für den V5-Cutover (Engine hinter `v5Formula` bis Play-Default)  
**Stand:** 2026-07-29  
**Vollkonzept:** [`docs/letz-fetz-v5-spielkonzept.md`](../letz-fetz-v5-spielkonzept.md)

> Diese Datei ist die **kurze spielbare Prosa** für Agenten und Playtests. Detailkarten, Matrix und Visual-Vertrag stehen im Vollkonzept.

---

## 1. Identität & Sieg

1-gegen-1-Kartenduell, gemeinsamer Hauptstapel. Jeder Spieler hat Charakter (2 Elemente, Passive, Großformel), baut eine **Formel** (Technik / Essenz / Katalysator) und kämpft mit Angriff, Block, Boost.

**Sieg:** Gegner auf **0 oder weniger** Leben.

---

## 2. Grundwerte (Playtest)

| Parameter | Wert |
|-----------|-----:|
| Startleben / Max. Leben | 20 |
| Max. Schild | 5 |
| Handlimit | 6 |
| Startkarten | 5 / 6 |
| Formelplätze | 3 |
| Formelaktionen / Formelphase | max. 1 |
| Hauptaktionen / Aktionsphase | max. 1 |
| Fetzladung | max. 3 |
| Großformel | 1× / Partie |
| Reaktionen | max. 1 / Aktion |
| W6 | 1–2 → +0 · 3–4 → +1 · 5–6 → +2 |

---

## 3. Partie-Aufbau

1. Charaktere wählen  
2. Startspieler zufällig  
3. 1 Arena offen  
4. Hände 5 / 6  
5. Start ohne Schild, Status, Formel, Ladung  
6. Startspieler → Startphase  

---

## 4. Zugphasen

```text
Start → Ziehen → Formelphase → Aktionsphase → Ende
```

### Start
Erschöpfte Formelkomponenten aufrichten; gestörte wiederherstellen; Start-Effekte; Brennen/Ticks; verzögerte Formel-/Echo-Effekte; Arena.

### Ziehen
Genau 1 Karte. Sofort-Glitch: ausführen, ablegen, keine Ersatzkarte (außer Text).

### Formelphase — genau eine Formelaktion
- **Bauen:** Technik/Essenz/Katalysator in leeren Platz (wirksam ab nächstem Zug aktivierbar)  
- **Ersetzen:** alte ablegen, neue desselben Typs  
- **Aktivieren:** mindestens **zwei** belegte Plätze; aufgerichtete, nicht gestörte Komponenten gemeinsam (fehlende Rolle = kein Effekt); danach erschöpft  
- **Schnellmix:** Formelkarte aus Hand für Einzeleffekt abwerfen  
- **Passen**

### Aktionsphase — genau eine Hauptaktion
Angriff · Boost · Aktions-Glitch · Gegenstand · Formelkomponente herausfordern · Improvisieren (1 abwerfen / 2 ziehen) · Großformel (nur bei 3 Fetzladung) · andere ausdrücklich markierte Aktion.

### Ende
Hand ≤ 6; Zugende-Effekte; Gegner ist dran.

---

## 5. Kampf

```text
Angriffswert = Kartenwert + W6-Bonus + Affinität (+1) + Boosts + Formeleffekte
Blockwert   = Kartenwert + W6-Bonus + Affinität + Formeleffekte
Schaden     = max(0, Angriff − Block) → zuerst Schild, dann Leben
```

Erfolgreicher Treffer: Angriff > Block (auch wenn Schild alles abfängt).  
Vollblock: Block ≥ Angriff → kein Schaden; Block kann Impuls auslösen.

---

## 6. Primär- / Sekundärelement

| Quelle | Rolle |
|--------|--------|
| Aktionskarte | Basisaktion, Stärke, **Primärelement** |
| Technik | Ausführungsform — **kein** Element |
| Essenz | **Sekundärelement** + Status |
| Katalysator | Timing / Transformation / Verhalten |
| Primär + Sekundär | Reaktion |

Visuell: Primär 60–70 %, Sekundär 30–40 %, Reaktion kurz dominant (siehe Vollkonzept §28).

---

## 7. Formel & Fetzladung

Teilformel (≥2 Plätze belegt) darf aktiviert werden; fehlende Rolle trägt nichts bei. Einzelplatz-Aktivierung ist nicht erlaubt.

Volle Formel = Technik + Essenz + Katalysator.  
Erfolgreiche Aktivierung der **vollen** Formel → **+1 Fetzladung** (max 3), wenn Effekt nicht vollständig verhindert.

Bei 3 Ladung: **Großformel** in der Aktionsphase. Danach Ladung 0, Katalysator abgelegt, Technik/Essenz erschöpft, Großformel verbraucht.

---

## 8. Impulse, Marken, Reaktionen

Impuls bei erfolgreichem Element-Angriff, Vollblock, Essenz, markierten Effekten.  
Max. **eine** Primärmarke. Zweiter Impuls → Reaktion → Marke weg.  
Max. eine Reaktion pro Aktion. Matrix: Vollkonzept §18–§20.

---

## 9. Herausfordern

Ziel = gegnerische Formelkomponente. Verteidigung = Stabilität + optionaler Block + W6 + Affinität.

| Differenz | Ergebnis |
|-----------|----------|
| Angriff ≤ Verteidigung | nichts |
| +1–2 | **gestört** (quer; Effekt/Element ignoriert; Restore in Startphase) |
| +3 oder mehr | **zerstört** (Ablage; Platz leer) |
| schon gestört + Angriff höher | zerstört |

Kein Lebensschaden durch Herausforderung.

---

## 10. Legacy

| Version | Rolle |
|---------|--------|
| V1 | Regression / physisches Kernspiel (`SPIELANLEITUNG_V1.md`, Play „Basis“) |
| V2 | Historisch (Phrase) |
| V3 | Vorgänger-Kampflayer + Fetzgerät-Slots — Soft-Retire zugunsten Formel |
| **V5** | Produktziel: Formel + Visual Recipe |

Engine-Default bis Cutover: bestehendes spielbares Pack (heute oft Basis/V3-Flag). Nach Cutover: `v5Formula` + `V5_PACK`.
