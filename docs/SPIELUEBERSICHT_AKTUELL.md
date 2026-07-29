# Letz Fetz — Spielprinzip & Überblick (Stand 2026-07-29)

> **Zweck:** Eine lesbare Übersicht, *wie das Spiel und die App gerade funktionieren* — und wohin V5 geht.  
> **Quellen:** `docs/letz-fetz-v5-spielkonzept.md`, `docs/rules/SPIELANLEITUNG_V5_DRAFT.md`, `docs/rules/SPIELANLEITUNG_V1.md` (Regression), Packs unter `src/game/packs/`.

---

## 1. Was ist Letz Fetz?

**Letz Fetz** ist ein taktisches **1-gegen-1-Kartenduell**.

Jeder Spieler wählt einen **Charakter** (2 Elemente, Passive, Großformel). Im Zug kämpfst du mit Angriff/Block/Boost und baust parallel eine **Formel** aus **Technik · Essenz · Katalysator** (Produktziel V5). Bis zum Engine-Cutover bleibt digital vor allem das **V1-Basisduell** (gebundene Elementkarten) spielbar; V3-Fetzgerät ist Soft-Retire.

**Sieg:** Gegner auf **0 Leben** (oder darunter).

Die App ist eine **digitale Playtest- und Authoring-Plattform** — kein fertiges Steam-Spiel.

---

## 2. Drei Ebenen: „Spielbar heute“ vs. „Legacy V3“ vs. „Produktziel V5“

| Thema | **Heute spielbar** | Legacy V3 | **Produktziel V5** |
|--------|-------------------|-----------|---------------------|
| Leben | **20** (Basis) | V3-Pack oft 30 | **20** Playtest |
| Auslage | max **4** gebundene Elementkarten | Träger / Antrieb / Aufsatz | **3 Formelplätze** |
| Ulti | feste Ulti | + Charge-Pool | **Großformel** bei 3 Fetzladung |
| Kampflayer | optional „V3 Playtest“ | Impulse/Marken/Reaktionen/Schild | bleibt + V5-Matrix/Namen |
| Visual | Karten / optional Fetz-3D | 3D-Kombi | **Formelgestell** + Visual Recipe |

**Play-Setup-Kacheln (aktuell):**

1. **Basis-Pack (V1)** — Badge „Standard“ → Regression  
2. **V2 P100** — historischer Playtest  
3. **V3 Playtest** — Basis + Kampflayer  

**Geplant:** V5-Kachel als neuer Standard (Epic `v5-formula-migration`, Issues #218–#233).

---

## 3. Match-Basics (aktueller Regelkern)

Gemeinsam für V1 und V3-Playtest (Zahlen außer LP/Kampflayer):

| Parameter | Wert |
|-----------|------|
| Spieler | 2 (digital: Mensch vs Heuristik-Bot) |
| Handlimit | **6** |
| Max. gebundene Karten | **4** |
| Zugphasen | 5 (siehe unten) |
| Würfelbonus (W6) | 1–2 → **+0**, 3–4 → **+1**, 5–6 → **+2** |
| Startleben (App-Standard) | **20** |
| Max. Leben | wie Start (V1: 20) |

**Elemente:** Feuer, Wasser, Erde, Luft, Schatten, Licht.

---

## 4. Spielablauf — wann man was machen darf

Regelkern = **V1** (`SPIELANLEITUNG_V1.md`). Digital: du = aktiver Spieler, Bot = Gegner (gleiche Regeln).

### 4.0 Partie-Start (einmalig)

1. Beide wählen einen **Charakter** (Ulti liegt bereit, Passive gilt ab jetzt).  
2. **Startspieler** wird bestimmt (zufällig).  
3. Startspieler zieht **5** Karten, Zweiter **6**.  
4. **1 Arena** zufällig offen in die Mitte (ggf. Arena-W6 jetzt).  
5. Startspieler beginnt mit Phase 1.

Danach wiederholen sich die **5 Phasen** jedes Zugs, bis jemand **≤ 0 LP** hat.

```text
[Start] → [Ziehen] → [Binden] → [1 Hauptaktion] → [Ende]
                              ↑
              Gegner darf nur bei Angriff/Herausfordern blocken
```

---

### 4.1 Matrix: Wann darf ich was?

| Aktion | Wann? | Wer? | Zählt als… |
|--------|--------|------|------------|
| Erschöpfte Karten aufrichten | **Startphase** | Aktiver Spieler | Automatisch / Phase |
| „Am Anfang des Zuges“-Effekte | **Startphase** | Aktiver (+ Arena/Status) | — |
| 1 Karte ziehen | **Ziehphase** | Aktiver | Pflicht (wenn Deck) |
| Sofort-Glitch ausführen | **Beim Ziehen** dieser Karte | Wer gezogen hat | Sofort, keine Ersatzkarte* |
| Playable-Glitch spielen | Timing auf der Karte (oft eigener Zug / Reaktion) | Je Text | Oft **kein** Ersatz für Hauptaktion — siehe Karte |
| **1 Elementkarte binden** | **Bindungsphase** | Aktiver | Genau **1×** (oder skippen) |
| Alte gebundene abwerfen, um Platz | Vor dem Binden bei schon **4** gebundenen | Aktiver | Teil der Bindung |
| **Angriff** aus Hand | **Aktionsphase** | Aktiver | **1 Hauptaktion** |
| **Block** aus Hand | Nur **während** gegnerischem Angriff / Herausfordern | **Verteidiger** | Reaktion, **keine** Hauptaktion |
| **Boost** aus Hand | **Aktionsphase** | Aktiver | **1 Hauptaktion** (kein W6, nicht blockbar) |
| **Gebundene aktivieren** | **Aktionsphase**, Karte nicht erschöpft | Aktiver | **1 Hauptaktion** (Kosten: 1 Handkarte abwerfen + erschöpfen) |
| **Herausfordern** (gegner. Bau angreifen) | **Aktionsphase** | Aktiver | **1 Hauptaktion** |
| **1 abwerfen + 2 ziehen** | **Aktionsphase** | Aktiver | **1 Hauptaktion** |
| **Ulti** | **Aktionsphase**, noch nicht benutzt | Aktiver | **1 Hauptaktion**, i. d. R. nicht blockbar |
| Hand auf 6 trimmen | **Endphase** | Aktiver | Pflicht wenn >6 |
| Passiven Charakter-Trigger | Wenn die Bedingung eintritt (oft „1× pro Zug“) | Je Text | Keine eigene Phase |
| Arena-Trigger | Wenn Arena es sagt | Beide / aktiver | Keine eigene Phase |

\* außer der Glitch-Text sagt ausdrücklich Ersatzkarte.

**Wichtig:** Pro **Aktionsphase** genau **eine** Hauptaktion. Block ist **kein** eigener Zug-Schritt — nur Antwort auf Angriff/Herausfordern.

---

### 4.2 Die fünf Phasen im Detail

#### Phase 1 — Start

**Du machst:**

1. Alle **erschöpften** eigenen gebundenen Karten wieder **aufrichten**.  
2. Effekte mit Timing „am Anfang deines Zuges“ (Charakter, Arena, V3-Status-Ticks).

**Du machst noch nicht:** angreifen, binden, Ulti (außer ein Effekt sagt ausdrücklich etwas anderes).

#### Phase 2 — Ziehen

**Du machst:**

1. **Genau 1** Karte vom Deck auf die Hand.  
2. Ist es ein **Sofort-Glitch** → zeigen, ausführen, ablegen → **keine** Ersatzkarte (außer Text).

**Gegner:** wartet (außer Glitch betrifft ihn sofort).

#### Phase 3 — Binden (Bauen)

**Du darfst:**

- **Genau 1** Elementkarte aus der Hand **offen binden** (Auslage), **oder** die Bindung **überspringen**.  
- Max. **4** gebundene Karten. Willst du bei voller Auslage neu binden → zuerst **1 eigene** gebundene abwerfen.

**Du darfst hier nicht:** angreifen, boost spielen, Ulti, Herausfordern (das ist Phase 4).

Gebundene Karten = deine Engine für spätere Aktivierungen und als Ziele beim Herausfordern.

#### Phase 4 — Aktion (eine Hauptaktion)

Wähle **eine** der folgenden Optionen:

##### A) Angriff spielen

1. Angriffskarte aus der Hand.  
2. **1W6** → Bonus (+0 / +1 / +2).  
3. Kampfwert = Kartenwert + Würfelbonus + Boni (z. B. eigenes Element +1).  
4. **Gegner** darf **genau 1 Blockkarte** spielen (oder passen).  
5. Blockt er: ebenfalls W6 + Blockwert.  
6. Schaden ans Leben = Angriff − Block (min. 0).  
7. Bei V3 zusätzlich: Impulse / Marken / Reaktionen / Schild-Pipeline.

##### B) Boost spielen

- Boost aus der Hand, Effekt ausführen.  
- **Kein** W6, **kein** Block.  
- Zählt als Hauptaktion.

##### C) Gebundene Karte aktivieren

Voraussetzung: eigene gebundene Karte **nicht erschöpft**.

1. **1 Handkarte** abwerfen (Kosten).  
2. Gebundene Karte **erschöpfen**.  
3. Bound-/Element-Effekt ausführen.

##### D) Herausfordern

Ziel = **eine gebundene Karte des Gegners** (nicht sein Leben).

1. Ziel wählen + Angriffskarte spielen + W6.  
2. Gegner darf **1 Block** (mit W6).  
3. Zielwert ≈ Widerstand der Karte + Block + Boni.  
4. Angriff **höher** als Zielwert → Karte **zerstört**; Gleichstand → überlebt.  
5. Normalerweise **kein** LP-Schaden am Gegner.

##### E) Hand umwälzen

- 1 abwerfen, **2** ziehen — eine Hauptaktion (wenn Hand schlecht ist).

##### F) Ultimativkarte

- Einmal pro Partie.  
- Hauptaktion.  
- Effekt laut Ulti-Text; i. d. R. **nicht** mit Block verhinderbar.  
- Danach Ulti „verbraucht“.

Nach der Hauptaktion → Phase 5 (ggf. nach aufgelösten Reaktionen/Choices in der App).

#### Phase 5 — Ende

1. Handlimit **6**: überschüssige Karten abwerfen.  
2. „Bis Ende des Zuges“-Effekte enden.  
3. Gegner wird aktiver Spieler → dessen Phase 1.

---

### 4.3 Was der Gegner wann darf

| Situation | Gegner darf |
|-----------|-------------|
| Deine Start-/Zieh-/Bindungs-/Endphase | In der Regel **nichts** (außer Passive/Arena/Glitch trifft ihn) |
| Du spielst **Angriff** | **1 Blockkarte** oder passen |
| Du **herausforderst** | **1 Blockkarte** oder passen |
| Du spielst Boost / Ulti / Aktivierung | Normalerweise **kein** Block (außer Kartentext) |
| Sein eigener Zug | Alles wie oben als aktiver Spieler |

---

### 4.4 Mini-Beispiel: ein kompletter Zug

1. **Start** — erschöpfte Bau-Karten aufrichten.  
2. **Ziehen** — 1 Karte; kein Sofort-Glitch.  
3. **Binden** — z. B. Feuer-Boost in die Auslage (jetzt 2 von 4 Slots).  
4. **Aktion** — Feuer-4-Angriff: W6 = 5 → +2; Charakter hat Feuer → +1 → Angriff 7. Gegner blockt Wasser-4: W6 = 3 → +1 + Element → Block 6. **1 Schaden**.  
5. **Ende** — Hand ≤ 6; Zug an den Bot.

---

### 4.5 Kampfwert (nur Angriff & Block)

```text
Kampfwert = Kartenwert + W6-Bonus (+0/+1/+2) + weitere Boni
```

W6-Bonus gilt **nicht** für Boost, Ulti, reine Aktivierungen, Glitches, Heilung.

Bei **V3 Playtest:** Schaden läuft Block → **Schild** → Leben; Impulse können Marken/Reaktionen auslösen (siehe Abschnitt 7).

---

## 5. Charaktere (alle aus Basis-Pack)

Jeder Charakter: **2 Elemente**, **Passive**, **1 Ulti** (einmal / Partie).

| Charakter | Elemente | Rolle | Passive (Kurz) | Ulti |
|-----------|----------|-------|---------------|------|
| **Knuspergnom** | Erde / Feuer | Allrounder | 1×/Zug bei Feuer- oder Erde-Bau: 1 abwerfen, 1 ziehen | *Mit Alles und Scharf* — 5 Schaden, 3 heilen, optional 1 bauen |
| **Schluckspecht** | Wasser / Licht | Sustain | 1×/gegner. Zug bei **Vollblock**: +1 LP | *Lass laufen, Bruder* — 4 heilen, 3 Schaden (+ Zug wenn danach hinterher) |
| **Stiernackenkommando** | Schatten / Luft | Bruiser | Nach erlittenem Schaden: nächster Angriff/Herausfordern **+1** (max +2) | *Rückhandbombe* — nächster Angriff doppelt, dann −1 LP |
| **Kokabell** | Erde / Licht | Defensive | 1×/Zug bei Heilung: gebaute Karte **+1 Widerstand** bis nächster Zug | *Golden (S)hou(we)r…* — LP auf 12 falls darunter; bis 2 aufrichten |
| **Pillendoktora** | Luft / Feuer | Risk/Reward | 1×/Zug bei Boost: wählen — ziehen/−1 LP **oder** 1 Schaden **oder** heile 1 | *3 Tage wach* — 4 heilen, 4 Schaden, 2 ziehen, 1 abwerfen |
| **Dripministerin** | Wasser / Schatten | Control | 1×/Zug wenn gegner. Bau erschöpft/zerstört: ziehen, dann abwerfen | *Runway ins Schattenreich* — Gegner 2 abwerfen, −3 LP, 1 Bau erschöpfen |
| **Das Mysterium** | Licht / Schatten | Flex | 1×/Zug: gespielte/gebaute Karte als **beliebiges Element** | *Echo der ungeschriebenen Mythen* — Gegner-Ulti kopieren, dann ziehen |

---

## 6. Kartentypen — was sie können

### 6.1 Elementkarten (Hand)

| Typ | Sofort | Gebunden (Auslage) |
|-----|--------|---------------------|
| **Angriff** | Kampfwert + W6; Schaden ans Leben (nach Block) | In V3 oft „Hand-only“-Hinweis; Bound-Texte je Karte |
| **Block** | Gegen Angriff; Vollblock = Angriff komplett verhindert | analog |
| **Boost / Ladung** | Soforteffekt / Tempo; V3: Ladung für Fetzgerät-Aktivierung | oft als Ressource |

**Basis-Pack:** je Element Angriff 2/4/6, Block 2/4/6, Boosts 1/3/5/5 → **60** Elementkarten.  
**V3-Pack-Content:** 24 Angriff + 24 Block + 12 Ladung; Mehrheit Angriff/Block mit **Elementimpuls** (Treffer bzw. Vollblock).

### 6.2 Glitches (10 im Basis-Pack)

Zwei Arten:

- **Playable** — Timing steht auf der Karte (eigener Zug / Reaktion)  
- **Instant** — beim Ziehen sofort

Beispiele:

| Glitch | Effekt (Kurz) |
|--------|----------------|
| Riss in der Realität | Arena wechseln |
| Nein, Bruder | Gegner-Boost verhindern |
| Kurzschluss | 1 gegner. Bau erschöpfen |
| Rückkopplung | Angriffsschaden −2 |
| Schlechter Empfang | Gegner darf außer Ziehphase nicht ziehen |
| Systemfehler | Bau verliert Aktivierungseffekt kurz |
| Illegaler Download | Gegner-Aktivierung kopieren (Kosten: 1 abwerfen) |
| Selbstschaden.exe | −2 LP (Instant) |
| Datenleck | Beide ziehen 1 (Instant) |
| Absturz | 1 abwerfen oder −1 LP (Instant) |

### 6.3 Arenen (6)

Gemeinsame Struktur: Basiseffekt + Trigger + Sonderregel (manchmal W6-Varianten).

| Arena | Fokus |
|-------|--------|
| Späti der Erleuchtung | Boosts, Filter |
| Kristallkathedrale | Heilung, Licht, Ulti-Zug |
| Vulkan der schlechten Entscheidungen | Angriffsdruck, Selbstschaden-Risiko |
| Sumpf der passiv-aggressiven Heilung | Block, Herausfordern härter |
| Club der fliegenden Backpfeifen | Luft / Umbau (W6-Varianten) |
| Schattenbasar der toxischen Angebote | Sabotage / Discard (W6-Varianten) |

### 6.4 Ultimativkarten

- Einmal pro Partie  
- Hauptaktion  
- Nach Nutzung „verbraucht“  
- In der Regel **nicht** wie ein normaler Angriff blockbar  

(Siehe Tabelle Charaktere.)

### 6.5 Fetzgerät-Teile (V3-Content, 36)

Nur im **`V3_PACK`**-Content vollständig: **6 Elemente × 2 Träger × 2 Antrieb × 2 Aufsatz = 36**.

| Slot | Rolle (Zielmodell) |
|------|---------------------|
| **Träger** | Chassis / oft an Kampfaktionen gekoppelt |
| **Antrieb** | erzeugt oft **Ladung** |
| **Aufsatz** | verbraucht Ladung für Effekte |

Gemeinsamer **Ladungspool** (Ziel: max. 6). **Resonanz:** mehrere gleiche Elemente auf dem Gerät → Pair/Full-Boni.

In der App: **Build → Combinate** steckt Teile optisch zusammen; Kampfwerte dort sind kosmetisch. Echtes Slot-Kämpfen braucht V3-Kampflayer + passende Karten im Match.

---

## 7. V3-Kampflayer (wenn aktiv)

Kurzkette:

```text
Aktion / Treffer / Vollblock
  → Elementimpuls?
  → schon Marke vorhanden?
      nein → Primärmarke setzen
      ja  → Reaktion aus Matrix (max. 1 pro Aktion; Wahl bei Mehrdeutigkeit)
  → Schaden: Block → Schild → Leben
```

**Primärmarken (Beispiele):**  
Feuer→Brennen, Wasser→Durchnässt, Erde→High, Luft→Aufgewirbelt, Licht→Erleuchtet, Schatten→Verflucht.

**Reaktionen:** Kombination Impuls + vorhandene Marke → eine von vielen Matrix-Reaktionen (z. B. Feuer+Wasser → Dampf/Nebel-Linie).  
**Schild:** Puffer vor Leben; max. begrenzt (Zielmodell 5); ersetzt keinen Vollblock.

Details: `docs/letz-fetz-v3-überarbeitung.md`.

---

## 8. Digitale App — wer macht was wo

| Bereich | Wer | Was |
|---------|-----|-----|
| **Play** | Spieler | Solo vs Bot; Charakter wählen; Kartenset wählen; komplette Partie |
| **Material (Forge)** | Author / Designer | Kartenbibliothek, Preview, Overlays/Art, Custom-Content |
| **Build → Combinate** | Designer / Playtester | Fertige/freigegebene **Teile** in 3 Slots stecken, 2D/3D-Vorschau, Ergebnis-Optik |
| **Build → Development** | Asset-Pipeline | Ein Teil Spec → Concept → Kontext → Isoliert → Multiview → 3D → Publish; Meshy über Bridge/Agent |
| **Settings / Menü** | Alle | Audio, Display, Navigation |

**Noch nicht Produkt:** Online-P2P-1v1, Tauri-Desktop, Steam, Hot-Seat als Hauptmodus, dedizierter Game-State-Server.

---

## 9. Typischer Ablauf in der App (Play)

1. Menü → **Play** → Charakter + Kartenset wählen.  
2. Engine macht Aufbau (Hände, Arena) wie in **§4.0**.  
3. Du spielst die fünf Phasen (**§4.2**); der Bot antwortet vor allem mit **Block**, wenn du angreifst/herausforderst.  
4. Wiederholen bis **0 LP**.  

UI-Hinweise („was jetzt?“): Phase-Coach in Play zeigt legale Züge; Details immer in **§4**.

---

## 10. Was du wo nachschlagen solltest

| Frage | Dokument / Code |
|-------|-----------------|
| V5 Vollkonzept | `docs/letz-fetz-v5-spielkonzept.md` |
| V5 Kurzprosa | `docs/rules/SPIELANLEITUNG_V5_DRAFT.md` |
| Physisches / Engine-V1 (Regression) | `docs/rules/SPIELANLEITUNG_V1.md` |
| V3 Dump (historisch) | `docs/letz-fetz-v3-überarbeitung.md` |
| V3 Cutover-Status (historisch) | `docs/rules/SPIELANLEITUNG_V3_WIP.md` |
| Basis-Karten & Charaktere | `src/game/packs/base-pack.ts` |
| V3 Elementmix + 36 Teile (legacy) | `src/game/packs/v3/` |
| Play-Pack-Wahl | `src/features/play/setup/resolveGamePackChoice.ts` |
| V5 Epic / Issues | `.qa/design/v5-formula-migration.md` |
| Projekt-Architektur | `AGENTS.md` |

---

## 11. Ein-Satz-Fazit

**Heute** spielst du digital vor allem das **V1-Basisduell**; **V5** ist das Produktziel (**Formel** Technik/Essenz/Katalysator, Formelgestell, Visual Recipe, 20 LP) — Epic #218–#233 setzt den Cutover um; V3-Fetzgerät wird soft-retired.

