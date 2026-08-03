# Letz Fetz V6 — Spielkonzept & Integrationsvertrag

**Status:** DRAFT zur Review — finale Form folgt nach User-Abnahme  
**Stand:** 2026-08-03  
**Basis:** V6-Vollkonzept + Grill-Antworten (Cutover, Generator, UI-Gates, Passiven)  

**Slice 0 tracking (GitHub):** #310 ruleset identity · #311 content/pack stub · #312 recipe generator CI · #313 import-boundary probes + AGENTS note. Play-Default remains **V5** until PLAYABLE cutover.

**Slice 1 tracking (GitHub):** #318 authoring/recipes · #319 engine plan/execute · #320 match lifecycle · #321 UI preview=plan · #322 Setup INTERNAL smoke (flag). Play-Default remains **V5** (no AGENTS cutover in Slice 1).

**PLAYABLE-Prep tracking (GitHub):** #333 characters/affinity scaffold · #334 recipe authoring harden · #335 Spielregeln/Katalog V6 · #336 setup flag polish. Play-Default remains **V5**.

**Full integration (GitHub):** #341 Affinität ±1 Engine · #342 Fessel-UI · #343 recipe catalog · #344 Echo/Delay · #345 Echo UI · #346 Konstrukte · #347 Konstrukt UI · #348 Überformel · #349 Passives (A/B) · #350 Arenas · #351 Bot · #352 SPIELANLEITUNG · #353 Default cutover · #354 V5 Legacy.

**V6_PLAYABLE:** Setup tile `v6` only when `VITE_V6_PLAYABLE=true` or `localStorage['letz-fetz:v6-playable']='1'`. Default pack choice stays **V5** even when the tile is visible (flag ≠ cutover). Combo visual = T+E+K component arts (not a blocker).

> **Leitsatz:** Der Charakter bestimmt den Rahmen. Die Karten bestimmen die Möglichkeiten. Der Spieler bestimmt das Ergebnis.

Dieses Dokument hält fest, was für Integration und Playtest **als geklärt gilt**. Offene Punkte stehen am Ende unter §99. Es ersetzt noch nicht die Engine-Prosa (`SPIELANLEITUNG_V6_*`) — die entsteht nach Finalisierung.

---

## 0. Integrationsvertrag (Repo)

| Entscheidung | Festlegung |
|--------------|------------|
| Play-Default sobald erster V6-Slice **spielbar** ist | **V6 ist Default** (`v6Formula` / `V6_PACK`). V5 bleibt Regression / Legacy-Kachel |
| Match-Regeln | **Nie mischen.** Ein Match = strikt V5 **oder** strikt V6. Falsche Action → hard throw (wie heute bei Flag-Mismatch) |
| Content-Vollständigkeit | Pflichtkombinationen (TE-Basen, Katalysator-Transformationen, Umkehrung, Opfergabe, Echo-/Spread-Regeln, Überformel) sind **authoring-vollständig** bevor ein spielbares V6-Pack shipt. Lücken = Build-Fehler, kein Runtime-Fallback |
| Formel-SoT | Strukturierte Authoring-Tabellen → **Build-Time-Generator** → generierter `FormulaRecipe`-Katalog. Runtime = Lookup + State-Checks + Zahlenauflösung |
| UI vs Engine | Engine darf intern hinter Flag mergen. **Öffentlich spielbar** nur, wenn Mechaniken im aktiven Pack eine korrekte UI haben (Vorschau = Auflösung) |
| V5-Legacy | Bleibt spielbar und regressionsfähig, bis offizielles V5-Retirement |

### Feature-Flags (Konzept)

```text
V6_ENGINE_INTERNAL   — Code/Tests erlaubt, kein Menüeintrag
V6_PLAYABLE_MODE     — Spieler darf V6 wählen / Default
```

Kein sichtbarer Chaosmodus-Stub im ersten Release.

---

## 1. Grundidee

Kompetitives 1v1 mit gemeinsamem verdecktem Hauptstapel.

Jeder Spieler:

- steuert einen Charakter mit zwei Affinitätselementen und einer kleinen taktischen Passive (siehe §28),
- baut eine Formel aus Technik · Essenz · Katalysator,
- spielt Angriffe, Blocks, Boosts, Gegenstände und Glitches,
- reagiert auf das gegnerische Formelbrett,
- sammelt Fetzladung nur durch vollständige Fusionen (TEK),
- erzeugt die **Überformel** aus der **aktuell** liegenden legalen TEK (nicht charaktergebunden).

---

## 2. Warum V6 (Kurz)

| V5-Problem | V6-Antwort |
|------------|------------|
| Effekte = Textaddition → Utility/Kontrolle oft wirkungslos | Handgefertigte TE-Basen + explizite Katalysator-Transformationen |
| Starke Charakterpassiven + feste Ultis diktieren Strategie | Affinität ±1 + Mikro-Passive / Pre-Match-Mack; Überformel aus aktueller Fusion |
| Katalysatoren richten sich wieder auf → Wiederhol-Fusionen | Katalysator bei Verwendung **ablegen** |
| Elementkarten beim Bauen oft identisch | Elementkarten nur Handaktionen; Wertrollen differenziert |
| Formelabwehr 5–6 löscht teure Fusionen zu oft | Abgestufte Reduktion, selten vollständige Vernichtung |

V6 ersetzt nicht das Grundspiel, sondern die **Funktionsweise der Kombinationen**.

---

## 3. Was aus V5 Kern bleibt

1v1 · gemeinsamer Hauptstapel · 30 Leben · max 5 Schild · Handlimit 6 · 3 Formelplätze · Technik/Essenz/Katalysator · Angriff/Block/Boost · Formel- + Aktionsphase · W6-Aktionsbonus · getrennte Verteidigung Formel vs Aktion · Elementarladung · Marken/Reaktionen · Herausfordern · Gegenstände/Ausrüstung · Glitches · Arenen · Fetzladung · Sieg bei 0 Leben · optionaler Zeitsieg.

---

## 4. Grundwerte V6

| Parameter | Wert |
|-----------|-----:|
| Startleben / Maxleben | 30 |
| Max Schild | 5 |
| Handlimit | 6 |
| Anfangszug: ziehen | 7 |
| Startspieler behält | 5 |
| Zweiter behält | 6 |
| Formelplätze | 3 |
| Kostenlose Formeländerung | 1 / Zug |
| Zweite Formeländerung | max 1, kostet 1 Handabwurf |
| Formelaktivierungen | max 1 / Zug |
| Hauptaktionen | max 1 / Zug |
| Fetzladung | max 3; +1 nur durch TEK; max 1 / eigener Zug |
| Affinität | 1× / Runde |
| Elementreaktionen | max 1 / Aktion |
| Ausrüstungsplätze | 2 |
| Konstrukte | max 1 / Spieler |
| Verbrauchsgegenstände | max 1 / eigener Zug |

Nicht behaltene Anfangskarten → zurück in den Hauptstapel. Kein Schrottplatz.

---

## 5. Sieg

**Standard:** Gegner ≤ 0 Leben.

**Zeit:** mehr Leben → sonst mehr Schild → sonst Unentschieden.

---

## 6. Partieaufbau

1. Charaktere wählen (+ Passive/Mack laut §28).  
2. Startspieler zufällig.  
3. Arena zufällig aufdecken (**vor** Kartenwahl).  
4. Beide ziehen 7; behalten 5 bzw. 6; Rest zurückmischen.  
5. Start ohne Schild, Marken, Formel, Fetz, Elementarladung.  
6. Startspieler beginnt.

Arena vor Auswahl: Umgebung beeinflusst, welche Anfangskarten behalten werden.

---

## 7. Zugstruktur

```text
Startphase → Ziehphase → Formelphase → Aktionsphase → Endphase
```

---

## 8. Startphase (Reihenfolge)

1. Arena-Startphaseneffekte  
2. Brennen / Status-Ticks  
3. Echo  
4. verzögerte Formeln  
5. Konstrukte  
6. temporäre Sperren/Fesseln aktualisieren  
7. Technik und Essenz **aufrichten**  
8. Affinität zurücksetzen (neue Runde)

**Katalysatoren richten sich nicht auf.** Nach vollständiger Auflösung: abgelegt (Echo/Verzögerung: bis zu ihrer Auflösung, dann abgelegt).

---

## 9. Ziehphase

Genau 1 Karte vom gemeinsamen Stapel. Stapel leer → Ablage mischen.

**Negative Sofort-Glitches** (Selbstschaden.exe, Datenleck, Absturz) sind **nicht** im V6-Core-Pack. Kein Chaosmodus im ersten Slice. Später: separates `V6_CHAOS_EXPANSION`.

---

## 10–11. Formelphase

### Abschnitt A — Verändern

- 1× kostenlos: Bauen **oder** Ersetzen **oder** Passen.  
- Optional 2×: eine weitere Änderung gegen Abwurf einer Handkarte.  
- Keine 3. Änderung.  
- **Rückbau** (Komponente auf die Hand): beendet Formelphase; **keine** Aktivierung in diesem Zug.

Bauen: Typ muss Platz matchen; sofort verwendbar.  
Ersetzen: Ablegen + gleiche Klasse.

### Abschnitt B — Aktivieren (max 1)

| Kombi | Rolle |
|-------|--------|
| Essenz allein | Elementarladung |
| TE | elementare Basisfähigkeit (handgefertigt) |
| TK | elementneutrale Modifikation; Katalysator verbraucht; keine Fetzladung |
| EK | Ritual/Infusion; kein direkter Formelschaden |
| TEK | Fusion; 1 Fetzladung; Katalysator verbraucht |
| keine | Passen |

Technik + Essenz erschöpfen. Katalysator bei TK/EK/TEK nach Auflösung ablegen (Echo/Verzögerung: Spezialtiming).

---

## 12–14. Komponentenrollen

- **Technik** = Verb (Handlung).  
- **Essenz** = Spielweise (Element, Rider, Marke/Reaktion, offensiv/defensiv/utility).  
- **Katalysator** = Timing/Risiko/Kosten/Zielstruktur/Stärke — **Einmalentscheidung**.

---

## 15. Solo-Essenz → Elementarladung

Bedingungen: nur Essenz gewählt; noch keine Ladung darauf; aufrecht, ungestört.

Effekt: Essenz erschöpfen, Ladung legen; kein Formelangriff, keine Fetz, keine Marke, keine Reaktion.

Nutzung bei Aktionsangriff mit passendem Primärelement — Bonus aus **natürlichem** W6:

| Nat. W6 | Bonus |
|--------:|------:|
| 1–2 | +3 |
| 3–6 | +2 |

Verlust: Essenz entfernt/ersetzt/zerstört; Technik/Katalysator auf geladenes Brett gebaut/ersetzt; Ladung verbraucht.

---

## 16–19. TE / TK / EK / TEK

- **TE:** 60 handgefertigte Basen (Name, Effekt, Ziel, Primärwert, Rider, Marke/Reaktion, Katalysator-Schnittstellen). Keine Textaddition.  
- **TK:** ohne Element/Marke/Reaktion/Rider; Katalysator verbraucht; keine Fetz.  
- **EK:** kein direkter Formelschaden; Infusion/Ladung/Buff/Konstrukt etc.  
- **TEK:** TE-Basis + Katalysatortransformation → ein Anzeigename + ein aufgelöster Effekt.

---

## 20–21. Offensivbegrenzung

Nach offensiver TE/TK: Aktionsangriff weiter erlaubt (Zweierformeln bewusst begrenzter Schaden).

Nach **offensiver TEK** (gegnergerichteter Haupteffekt: Schaden, Schildverlust, Fessel, Störung, Destabilisierung, …): in derselben Aktionsphase **kein** normaler Angriff und **keine** Herausforderung.

Erlaubt: Boost, Gegenstand, Glitch, Improvisieren, ausdrücklich erlaubte nichtoffensive Aktion.  
**Kettenkopplung** kann Folgeangriff freischalten (mit −2 Kampfwert).  
Rein selbstgerichtete Fusion sperrt den Angriff nicht.

---

## 22. Aktionsphase

Max 1 Hauptaktion: Angriff · Boost · Gegenstand · Aktions-Glitch · Herausforderung · Improvisieren · Sonderaktion.

**Improvisieren:** 1 Handkarte abwerfen, 2 ziehen. Kostet die Hauptaktion (kein Angriff). Ersatz für Schrottplatz.

---

## 23. Aktionskampf

```text
Angriff = Kartenwert + W6-Bonus + Affinität + Boosts + Formelvorbereitung + Elementarladung + Arena
Block   = Kartenwert + W6-Bonus + Affinität + Formelvorbereitung + Arena
Schaden = max(0, Angriff − Block) → zuerst Schild, dann Leben
```

W6-Bonus Aktion: 1–2 → +0 · 3–4 → +1 · 5–6 → +2.  
Verteidigung nur mit Blockkarte (kein Formelabwehrwurf).

---

## 24. Formelabwehr (nur gegen gegnergerichtete Formeln)

Kein Block. Modifizierter W6:

| W6 | Ergebnis |
|---:|----------|
| 1–2 | voller Effekt |
| 3–4 | Primärwert/Intensität −1 |
| 5–6 | Primärwert/Intensität −2; gegnergerichteter Essenz-Rider entfällt |

Minimum 0. Nichtnumerische Effekte über Intensitätsstufen (z. B. Fessel 1–3).

---

## 25. Marken, Impulse, Reaktionen

Impuls nur wenn im vollständigen Effekt steht. Max 1 Reaktion pro Aktion.  
Reaktionsmatrix: für ersten V6-Playtest übernehmbar; geändert wird vor allem, **welche** Kombis Impulse erzeugen.

---

## 26–27. Fetzladung & Überformel

**Fetz:** nur TEK → genau +1; max 1/Zug; max 3. TE/TK/EK/Echo/Verzögerung/Überformel erzeugen keine (zusätzliche) Ladung. Abgewehrte Fusion gibt trotzdem Ladung. Überformel setzt auf 0.

**Überformel:** bei 3 Fetz + legaler aufrechter TEK: verstärkte Version derselben Fusion (+2 Primär **oder** +1 Intensität; verstärkter Rider; Formelabwehr −1). Keine charaktergebundenen Großformeln im Standard.

Kosmetik (Name/Animation) darf charakterabhängig sein; Mechanik nicht.

---

## 28. Charaktere, Affinität, Passiven

### 28.1 Affinität

Zwei Affinitätselemente. 1×/Runde auf Karte/Formel eines dieser Elemente:

1. numerischen Wert +1, **oder**  
2. eigenen W6 nach dem Wurf ±1.

Nicht zweimal auf dieselbe Aktion. Passive und Affinität nicht auf dieselbe Aktion.

### 28.2 Alte V5-Passiven / Ultis

Hard-remove aus `V6_PACK` und V6-Schema. Bleiben nur in V5 / später optional Heldenmodus.

### 28.3 Passive-Modell (Empfehlung zur Review)

**Bevorzugt (User-Richtung: wie Artefaktwahl / Waffenwahl vor Match):**

Vor der Partie wählt jeder Spieler **eine Macke** aus einem **gemeinsamen, neutralen Passive-Pool** (sichtbar, begrenzt, symmetrische Power).

- Charakter liefert: Optik, Affinitäten, Überformel-Präsentation.  
- Macke liefert: genau eine Mikro-Passive für die Partie.  
- Keine exklusiven Rezepte pro Charakter.  
- Gleiches Power-Budget für alle Macken (unten).

**Alternative B (falls Pool zu spät):** feste Mikro-Passive pro Charakter (Knuspergnom Resteverwertung, Schluckspecht Erst mal gucken, …) — ebenfalls Budget-konform, aber stärker charaktergekoppelt.

Finale Form: User entscheidet A vs B in der Review. **Beide** erfüllen: keine V5-Passiven, kein direkter Schaden/Heil-Engine, kein Fetz, keine Extra-Aktion.

### 28.4 Power-Budget (jede Passive / Macke)

1. max 1× / Runde  
2. kein Stapeln/Speichern über Runden hinaus (außer explizit designed und budgetiert)  
3. kein direkter Fetzgewinn  
4. keine zusätzliche Formelaktivierung  
5. keine zusätzliche Hauptaktion  
6. ca. ±1 / Scry / leichter Kartenfilter  
7. nicht zusammen mit Affinität auf dieselbe Aktion  
8. keine exklusiven Formelrezepte  

### 28.5 Erlaubte Kategorien

Information · Flexibilität · Risikokontrolle — keine „zweite Engine“.

### 28.6 Beispiel-Pool (Draft — Namen/Texte reviewbar)

| Macke | Effekt (1×/Runde bzw. wie angegeben) |
|-------|--------------------------------------|
| Bastler | Nach zweiter Formeländerung: Scry 1 (oben lassen oder unterlegen) |
| Zocker | Eigenen W6 ±1 |
| Hamster | Beim Abwerfen: Karte unter Stapel statt Ablage (1×) |
| Späher | Nach Vollblock: oberste 2 neu anordnen |
| Improvisateur | Beim ersten Improvisieren der Partie: 3 ziehen, 2 abwerfen |
| Resteverwerter | Nach Abwurf für 2. Formeländerung: oberste Karte ansehen, optional unterlegen |
| Nachjustierer | Nach Heilung oder Schildgewinn: +1 Stabilität an eigener Komponente bis nächste Startphase |
| Schwachstellenleser | Nach Störung gegnerischer Komponente: Scry 1 |
| Dosiswechsler | Nach Boost: ziehen, dann abwerfen |
| Falsche Farbe | 1× Elementkarte für Affinität als Affinitätselement behandeln; echtes Element/Reaktionen unverändert |

Charakter-feste Texte aus dem Grill-Antwortblock bleiben als **Backup-Liste für Alternative B** gültig, wenn Pool-Modell abgelehnt wird.

---

## 29–32. Arenen

Immer aktiv, symmetrisch. Kern-Arenen laut V6-Doc (Späti, Kristall, Vulkan, Sumpf, Club, Schattenbasar) mit V6-Anpassungen (Vulkan: nur erster gegnergerichteter Schadenseffekt/Zug; Club: Luft-W6 bewusst ±1, etc.).

**Riss in der Realität:** Hauptaktion — Arena ablegen, neue zufällig; gilt sofort; alte Trigger nicht rückgängig.

---

## 33–35. Content-Rahmen (Techniken / Essenzen / Katalysatoren)

Zehn Techniken (Impulsgeschoss … Beschwörungsritual) mit je 6 Essenz-Ausprägungen = **60 TE-Basen**.  
Zehn Katalysatoren (Echo … Opfergabe) mit **expliziten** Transformationen / Unsupported-Einträgen.  
Umkehrung, Opfergabe, Echo-Teile, Spread-Ziele: **nie generisch geraten** — nur approved Authoring.

Vollständige Kartentabellen: Quelle ist das Authoring unter `src/content/v6/` (nach Anlage); dieses Spielkonzept hält die **Regeln**, nicht jede Zeile der 60×Katalysator-Matrix.

Essenz-Identitäten (Designregel): Feuer Druck · Wasser Heilung/Reinigung · Erde Stabilität · Luft Tempo/Würfel · Licht Schild/Reinigung · Schatten Fluch/Erschöpfung.

---

## 36. Elementkarten

Nur Handaktionen (Angriff/Block/Boost). Kein Bauen auf Formelplätze. Kein `boundEffect` in V6-Schema.  
Eigene V6-Definitionen (nicht V5-Objekt mit ignoriertem Feld).  
Wertrollen: 2 Starter · 3 Standard · 4 bedingter Payoff · 6 Rohwert mit Nachteil.

---

## 37–40. Gegenstände, Glitches, Artefakte

- Ausrüstung: Kaputter Rückspiegel, Werkzeugkoffer, Gezinkter Würfel (2 Slots).  
- Verbrauch: Halbe Dose Energy, Verdächtiger Pilz, Kabelbinder Deluxe, Rostiger Nagel, Nasser Socken — **kein** dauerhafter Ausrüstungsslot für Nagel/Socken.  
- Standard-Glitches mit klarem Timing; Sofort-Negativ → später Chaos-Expansion.  
- Artefakt-Auktion: optional, **standard aus**, kein Kernbalancing.

---

## 41–42. Herausfordern & Konstrukte

Herausforderung: Wert vs Stabilität/Haltbarkeit (+ Mods). Differenz → stören / zerstören; kein Lebensschaden. Offensive TEK sperrt Herausforderung im Zug.

Konstrukte: max 1; Haltbarkeit; herausforderbar; keine Fetz; nicht Ausrüstung/Formelkomponente. Neu ersetzt alt. Einstieg über Beschwörungsritual.

---

## 50. Technische Architektur

### 50.1 Modi & Packs

```text
v6Formula + V6_PACK   — Default Play (wenn playable)
v5Formula + V5_PACK   — Legacy / Regression
```

### 50.2 Authoring → Generator → Runtime

```text
src/content/v6/          # SoT (techniques, essences, catalysts, te-recipes, …)
        ↓ build-time generator + validation
src/generated/v6/        # formula-recipes.generated.(json|ts) — nie manuell
        ↓
Runtime: formulaRecipeMap.get(key) → executeFormulaRecipe
```

Fehlende Pflichtkombination / unreviewed Effekt / doppelter Key → **Build fail**.  
`availability: "unsupported"` muss explizit sein (keine stille Lücke).

### 50.3 Runtime darf / darf nicht

**Darf:** Lookup, Ziel-/State-Checks, Formelabwehr, Clamps, Trigger registrieren, Effekte ausführen, `planFormulaActivation` für UI.

**Darf nicht:** fehlende Umkehrung erfinden, Primärwert „raten“, Schaden→Heilung-Fallback, Spiegelung selbst wählen, Effekt still weglassen.

### 50.4 Cutover V5-Systeme in V6

| System | V6 |
|--------|-----|
| Charakterpassiven V5 | hard-remove aus Pack/Schema/Trigger |
| Feste Großformeln | hard-remove; nur Überformel |
| Gebaute Elementkarten | hard-remove Regeln/Schema/UI/Resolver |
| Sofort-Glitches | nicht im Core-Slice |
| 744er Katalog | kein V6-Import; Datei bleibt für V5 bis Retirement |

Architekturtest: kein Import von `legacy/v5` in V6-Pfade.

### 50.5 UI / Plan

Eine Berechnung:

```ts
planFormulaActivation(...) → FormulaActivationPlan
UI rendert Plan
execute / revalidate+execute
```

Hard-Gate-Test: Preview repräsentiert Execution (Primärwert, Ziele, Katalysatorverbrauch, Fetz, Angriffssperre, Delay/Echo, Marken, Kosten).

### 50.6 Vertikale Slices (UI-Gates)

| Slice | Engine | UI vor playable |
|-------|--------|-----------------|
| 1 TEK-Kern | Katalysator ablegen, Fetz nur TEK, Angriffssperre; Überformel ggf. noch aus | Formelvorschau, Verbrauchshinweis, Fetz, Sperre |
| 2 Intensität | Fesselstufen, Formelabwehr neu | Fessel-UI, Abwehr-Preview/Log |
| 3 Echo/Delay | Warteschlangen | Echo-/Verzögerungsanzeige |
| 4 Konstrukte | Beschwörung | Konstrukt-Zone |

Mechanik ohne UI darf intern existieren, aber nicht im aktivierten spielbaren Pack.

### 50.7 Bot

Eigene Bewertungsmodelle für TE/TK/EK/TEK/Überformel/Improvisieren/Herausfordern. Nicht nur Schadensmax. Bot-Playbook erst, wenn Slice playable.

---

## 51. Empfohlene Umsetzungsreihenfolge (verkürzt)

1. `v6Formula` + leeres/teilweises `V6_PACK` hinter `INTERNAL`  
2. Authoring-Schema + Generator + Validierung (fail-closed)  
3. Affinität; V5-Passiven/Ultis aus V6 entfernt  
4. Katalysatorverbrauch; Fetz nur TEK  
5. TE/TK/EK/TEK Resolver auf Recipes  
6. Formelabwehr V6; Offensivsperre  
7. Anfangshand 7→5/6; zweite Formeländerung; Improvisieren  
8. Elementkarten V6-only; Arenen V6  
9. Passive-Pool oder feste Mikro-Passiven (§28)  
10. Formelvorschau = Plan; `PLAYABLE` + Default V6  
11. Überformel; Echo/Delay; Konstrukte (eigene Slices)  
12. Bot + Telemetrie  
13. Chaos/Artefakte später  

---

## 52. Playtest-Messwerte (behalten)

Kartenqualität · Formelvielfalt · Entscheidungstiefe · Charakter-/Macken-Balance · Arenen · Tempo (erste Fusion / 3 Fetz / Überformel / Partiedauer).

---

## 60. Kurzreferenz

```text
Start → 1 ziehen → ≤2 Formeländerungen → ≤1 Formel → ≤1 Hauptaktion → Handlimit
1. Änderung gratis; 2. kostet Abwurf; Rückbau = keine Aktivierung
Essenz=Ladung · TE=Basis · TK=neutral · EK=Ritual · TEK=Fusion+1 Fetz
Katalysator nach Nutzung weg
Offensive TEK: kein Angriff/Herausfordern
Formelabwehr: 1–2 voll · 3–4 −1 · 5–6 −2 & Rider weg
Aktion: nur Block
Überformel: 3 Fetz + aktuelle TEK verstärkt
Charakter: Affinitäten + Macke/Passive (Budget)
Arena immer · kein Schrott · Improvisieren 1→2
```

---

## 99. Offen für deine finale Form (Review-Checklist)

Bitte abhaken / korrigieren:

- [ ] Passive-Modell: **A Pool vor Match** (empfohlen) vs **B feste Charakter-Mikro-Passiven** vs Hybrid  
- [ ] Ob Passive-Pool **vor** Charakterwahl, **danach**, oder parallel zur Arena-Reveal  
- [ ] Ob erste playable Version Überformel schon enthält oder Slice-1 ohne  
- [ ] Ob `V6_PACK` physisch unter `src/content/v6` + `src/generated/v6` liegt (Pfad ok?)  
- [ ] Generator-Output: JSON vs TS  
- [ ] Heldenmodus: nur Notiz oder schon Flag-Name reservieren  
- [ ] Ob V5-Menü-Kachel sofort „Legacy“ heißt oder „V5 Regression“  
- [x] Exact Start: Affinität „pro Runde“ = **einmal pro eigenem Zug/Durchlauf** (Reset eigene Startphase; Spend auf eigenen Angriff/Challenge oder eigenen Block). Playtest-Default via #341 — nicht beide Halbzüge als eine gemeinsame Runde. 

Nach deiner finalen Form: dieses Doc auf **verbindlich** setzen und `SPIELANLEITUNG_V6_DRAFT.md` + AGENTS-Kurzreferenz nachziehen.

---

## Änderungslog

| Datum | Änderung |
|-------|----------|
| 2026-08-03 | Erster DRAFT aus V6-Vollkonzept + Grill-Antworten 1b/2/3/4/5/6 + Passive-Pool-Empfehlung |
| 2026-08-03 | Slice 0 Issues #310–#313 getrackt; Play-Default bleibt V5 bis PLAYABLE |
| 2026-08-03 | Slice 1 Issues #318–#322 getrackt; Play-Default bleibt V5 |
| 2026-08-03 | #341 Affinität ±1 Engine: „pro Runde“ = eigener Zug/Durchlauf (§99 locked playtest default) |
