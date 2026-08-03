# SPIELANLEITUNG V6 — Draft (spielbare Prosa)

**Status:** Ziel-Engine-Prosa für `v6Formula` / `V6_CORE_PACK` (**Play-Default** nach Cutover #353)  
**Stand:** 2026-08-03  
**Vollkonzept:** [`docs/letz-fetz-v6-spielkonzept.md`](../letz-fetz-v6-spielkonzept.md)

> Kurze spielbare Prosa für Agenten und Playtests. Detailkarten, Rezeptkatalog und Visual-Vertrag stehen im Vollkonzept. Keine Regeln erfinden, die dort nicht stehen.

---

## 1. Identität & Sieg

1-gegen-1-Kartenduell, gemeinsamer Hauptstapel. Jeder Spieler steuert einen Charakter (**zwei Affinitätselemente** + feste Mikro-Macke), baut eine **Formel** (Technik / Essenz / Katalysator) und kämpft mit Angriff, Block, Boost.

**Sieg:** Gegner auf **0 oder weniger** Leben.  
**Zeit (optional):** mehr Leben → sonst mehr Schild → sonst Unentschieden.

---

## 2. Grundwerte (Playtest)

| Parameter | Wert |
|-----------|-----:|
| Startleben / Max. Leben | 30 |
| Max. Schild | 5 |
| Handlimit | 6 |
| Anfangszug ziehen / behalten | 7 → Startspieler 5 · Zweiter 6 |
| Formelplätze | 3 |
| Kostenlose Formeländerung | 1 / Zug |
| Zweite Formeländerung | max. 1, kostet 1 Handabwurf |
| Formelaktivierung | max. 1 / Zug |
| Hauptaktion | max. 1 / Zug |
| Fetzladung | max. 3; +1 nur durch TEK; max. 1 / eigener Zug |
| Affinität | 1× / eigener Zug (Reset eigene Startphase) |
| Elementreaktionen | max. 1 / Timing |
| Konstrukte | max. 1 / Spieler |
| W6 (Aktion) | 1–2 → +0 · 3–4 → +1 · 5–6 → +2 |

Kein Schrottplatz. Match = strikt V6 **oder** strikt V5 — nie mischen.

---

## 3. Partie-Aufbau

1. Charaktere wählen (feste Macke pro Charakter — Option B)  
2. Startspieler zufällig  
3. Arena aufdecken (**vor** Kartenwahl)  
4. Beide ziehen 7; behalten 5 bzw. 6; Rest zurückmischen  
5. Start ohne Schild, Marken, Formel, Fetz, Elementarladung  
6. Startspieler → Startphase  

---

## 4. Zugphasen

```text
Start → Ziehen → Formelphase → Aktionsphase → Ende
```

### Start (Reihenfolge)

1. Arena-Start  
2. Brennen / Status-Ticks  
3. Echo  
4. verzögerte Formeln  
5. Konstrukte (Haltbarkeit −1; bei 0 Ablage)  
6. temporäre Sperren / Fesseln aktualisieren  
7. Technik und Essenz **aufrichten**  
8. Affinität zurücksetzen  

Katalysatoren richten sich **nicht** auf; nach Auflösung Ablage (Echo/Delay: bis Auflösung, dann Ablage).

### Ziehen

Genau 1 Karte. Stapel leer → Ablage mischen. Negative Sofort-Glitches nicht im V6-Core (Chaos später: `V6_CHAOS_EXPANSION`).

**Standard-Glitches (7):** Timing explizit Aktionsphase oder Reaktion. Aktionsphase: Riss (Arena-Swap) · Kurzschluss · Empfang · Systemfehler · Download (Formelziele). Reaktion: Nein, Bruder · Rückkopplung. Riss: siehe §11.

### Formelphase

**A — Verändern:** 1× gratis (Bauen / Ersetzen / Passen); optional 2. Änderung gegen Handabwurf. Rückbau auf Hand beendet die Formelphase → **keine** Aktivierung diesen Zug. Gebaute Komponenten sind sofort verwendbar.

**B — Aktivieren (max 1):**

| Kombi | Rolle |
|-------|--------|
| Essenz allein | Elementarladung |
| TE | elementare Basisfähigkeit |
| TK | elementneutrale Modifikation; Katalysator weg; keine Fetz |
| EK | Ritual/Infusion/Konstrukt; kein direkter Formelschaden |
| TEK | Fusion; +1 Fetz; Katalysator weg |
| — | Passen |

Technik + Essenz erschöpfen. Rezepte = Authoring/Generator — keine Textaddition.

**Essenzen (6):** Feuer Druck · Wasser Heilung · Erde Stabilität · Luft Tempo · Licht Schild · Schatten Fluch.  
**Techniken (10):** Impulsgeschoss … Beschwörungsritual (#381). Slice-1 Katalog **10T×6E×4K = 604** Rezepte; volle 10×10-Matrix später (#383).

Nach **offensiver TEK** in derselben Aktionsphase: **kein** Angriff und **keine** Herausforderung (selbstgerichtete Fusion sperrt nicht).

### Aktionsphase — genau eine Hauptaktion

Angriff · Boost · Gegenstand · Aktions-Glitch · Herausforderung · Improvisieren (1 abwerfen / 2 ziehen) · ausdrücklich erlaubte Sonderaktion.

**Gegenstände (§37–40):** Ausrüstung (Kaputter Rückspiegel, Werkzeugkoffer, Gezinkter Würfel) belegt bis zu **2 Slots** neben dem Formelgestell. Verbrauch (Energy, Pilz, Kabelbinder, Rostiger Nagel, Nasser Socken) von der Hand — **max 1 Verbrauch / eigener Zug**; Nagel/Socken belegen **keinen** dauerhaften Slot.

**Kein** Charakter-Ulti / V5-Großformel. **Überformel** = TEK bei Fetz=3 (fest +2 Primär).

### Elementkarten (Hand-only)

Nur Handaktionen (Angriff / Block / Boost). **Nicht** auf Formelplätze baubar; kein Bound/Aktivieren.  
Wertrollen: **2** Starter · **3** Standard · **4** bedingter Payoff (+1 wenn Gegner Fessel hat) · **6** Rohwert mit Nachteil (−1 Leben nach dem Kampf).

### Ende

Hand ≤ 6; Zugende-Effekte; Gegner ist dran.

---

## 5. Aktionskampf

```text
Angriff = Kartenwert + W6-Bonus + Affinität + Boosts + Formelvorbereitung + Elementarladung + Arena
Block   = Kartenwert + W6-Bonus + Affinität + Formelvorbereitung + Arena
Schaden = max(0, Angriff − Block) → zuerst Schild, dann Leben
```

Verteidigung nur mit Blockkarte (kein Formelabwehrwurf auf Aktionen).

---

## 6. Formelabwehr (gegnergerichtete Formeln)

Kein Block. Modifizierter W6:

| W6 | Ergebnis |
|---:|----------|
| 1–2 | voller Effekt |
| 3–4 | Primärwert/Intensität −1 |
| 5–6 | Primärwert/Intensität −2; gegnergerichteter Essenz-Rider entfällt |

Minimum 0. Fessel-Intensität 1–3; Zielwahl **manuell** auf einen **besetzten** gegnerischen Formelplatz.

---

## 7. Affinität

Zwei Affinitätselemente. 1× / eigener Zug auf passende Karte/Formel:

1. numerischen Wert +1, **oder**  
2. eigenen W6 nach dem Wurf ±1  

Spend auf eigenen Angriff / Herausforderung / Formelaktivierung; Block-Affinität nur im **eigenen** Aktionszug. Nicht zusammen mit Macke auf dieselbe Aktion. Unter V6 kein automatisches Charakter-Element-+1 mehr.

---

## 8. Fetzladung & Überformel

Nur TEK → +1 Fetz (auch wenn abgewehrte Fusion). Max 3.  
Bei 3 Fetz + legaler aufrechter TEK: **Überformel** = dieselbe Fusion mit fest **+2 Primär**; Ladung auf 0; Formelabwehr −1.

---

## 9. Echo, Delay, Konstrukte

- **Echo:** Primär sofort; nächster eigener Start: fest 1 Punkt desselben Primär-Kinds; keine Extra-Fetz.  
- **Delay:** Primär nicht sofort; nächster eigener Start: Primär +2 (nach Abwehr); keine Extra-Fetz.  
- **Konstrukt:** max 1; Haltbarkeit; herausforderbar; Startphase −1 Haltbarkeit; Neu ersetzt Alt.

---

## 10. Herausfordern

Ziel = Formelkomponente **oder** Konstrukt. Kein Lebensschaden. Differenz → stören / zerstören (Sumpf: Zerstörung ab Diff ≥4). Offensive TEK sperrt Herausforderung denselben Zug.

---

## 11. Arenen (Kern)

Immer aktiv, symmetrisch: Späti · Kristall · Vulkan · Sumpf · Club · Schattenbasar (siehe Vollkonzept §29–32 / Engine #350).

**Riss in der Realität:** Aktionsphase-Hauptaktion (`glitch-riss`). Lege die aktuelle Arena ab und decke zufällig eine andere Arena aus dem Pack auf. Die neue Arena gilt sofort. Bereits ausgelöste Effekte der alten Arena werden nicht rückgängig gemacht; Zugende-Trigger der alten Arena greifen nicht mehr, sobald gewechselt wurde.

---

## 12. Legacy / Flags

| Version | Rolle |
|---------|--------|
| V1 | Regression / physisches Kernspiel |
| V3 | Soft-Retire (Fetzgerät) |
| **V5** | Legacy/Regression (`v5Formula`) — Setup-Kachel |
| **V6** | Produktziel + Play-Default (`v6Formula`) |

Bot-Prioritäten: [`V6_BOT_PLAYBOOK.md`](V6_BOT_PLAYBOOK.md).
