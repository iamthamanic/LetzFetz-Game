# Letz Fetz V5 — vollständiges Spielkonzept

**Status:** verbindliche Gesamtübersicht für den ersten V5-Playtest  
**Stand:** 29.07.2026

> Dieses Dokument führt den bisherigen spielbaren Kern von Letz Fetz mit dem neuen Formelsystem zusammen.  
> Beibehalten werden insbesondere: 1-gegen-1-Duell, gemeinsamer Kartenstapel, Element-Angriffe, Blocks, Boosts, W6-Bonus, Charaktere mit zwei Elementen, Passive, Arenen, Glitches, Schild, Elementmarken, Reaktionen und das gezielte Herausfordern gegnerischer Auslagen.  
> Ersetzt werden die gebundene Vier-Karten-Auslage und das physische Fetzgerät durch eine aus **Technik, Essenz und Katalysator** bestehende Formel.  
> **Visuell:** Die Technik ist die Hauptform; Essenz und Katalysator transformieren sie. Datenvertrag vor Meshy. MVP zuerst mit **3+3+3** Komponenten (§28).

---

# 1. Spielidentität

**Letz Fetz** ist ein taktisches 1-gegen-1-Kartenduell mit einem gemeinsamen chaotischen Kartenstapel.

Jeder Spieler:

- wählt einen Charakter mit zwei Elementaffinitäten,
- kämpft direkt mit Angriff-, Block- und Boostkarten,
- baut parallel eine eigene Formel aus drei Komponenten,
- verändert damit seine späteren Aktionen,
- löst Elementmarken und Reaktionen aus,
- stört die gegnerische Formel,
- lädt eine charaktereigene Großformel auf.

## Zentrales Spielgefühl

```text
Jeden Zug sofort kämpfen
+
über mehrere Züge eine Formel entwickeln
+
mit den gezogenen Karten improvisieren
+
die gegnerische Strategie lesen und stören
```

## Sieg

Der Gegner verliert, sobald seine Lebenspunkte auf **0 oder weniger** fallen.

---

# 2. Verbindliche Grundwerte

| Parameter | V5-Wert |
|---|---:|
| Spieler | 2 |
| Startleben | 20 |
| Maximales Leben | 20 |
| Maximales Schild | 5 |
| Handlimit | 6 |
| Startkarten Startspieler | 5 |
| Startkarten zweiter Spieler | 6 |
| Kartenstapel | 1 gemeinsamer Stapel |
| Formelplätze | 3 |
| Formelaktivierungen | maximal 1 pro eigener Formelphase |
| Hauptaktionen | maximal 1 pro eigener Aktionsphase |
| Fetzladung | maximal 3 |
| Großformel | einmal pro Partie |
| Reaktionen | maximal 1 pro Aktion |
| W6-Bonus bei 1–2 | +0 |
| W6-Bonus bei 3–4 | +1 |
| W6-Bonus bei 5–6 | +2 |

---

# 3. Spielmaterial

## 3.1 Gemeinsamer Hauptstapel

Alle Spieler ziehen aus demselben Stapel.

| Kartentyp | Anzahl |
|---|---:|
| Element-Angriff | 24 |
| Element-Block | 24 |
| Element-Boost | 6 |
| Techniken | 12 |
| Essenzen | 12 |
| Katalysatoren | 12 |
| Gegenstände | 6 |
| Glitches | 10 |
| **Gesamt** | **106** |

Zusätzlich außerhalb des Hauptstapels:

| Kartentyp | Anzahl |
|---|---:|
| Charaktere | 7 |
| Arenen | 6 |

## 3.2 Gemeinsamer Ablagestapel

Alle verwendeten, zerstörten oder abgeworfenen Karten kommen auf einen gemeinsamen Ablagestapel.

Ist der Hauptstapel leer:

1. Der gemeinsame Ablagestapel wird gemischt.
2. Er wird zum neuen Hauptstapel.
3. Karten in Händen, Formeln, Statusbereichen und als aktive Effekte bleiben liegen.

---

# 4. Kartenarten im Überblick

| Typ | Hauptaufgabe |
|---|---|
| Angriff | direkter Schaden und Elementimpuls |
| Block | Reaktion auf Angriff oder Herausforderung |
| Boost | starke vorbereitende oder unterstützende Hauptaktion |
| Technik | bestimmt, **wie** eine Formel ausgeführt wird |
| Essenz | bestimmt das zusätzliche Element und dessen Wirkung |
| Katalysator | verändert Stärke, Timing oder Verhalten |
| Gegenstand | einmaliger taktischer Effekt |
| Glitch | chaotischer Sofort-, Aktions- oder Reaktionseffekt |
| Arena | globale Regeländerung für beide Spieler |
| Charakter | Affinitäten, Passive und Großformel |

---

# 5. Aufbau einer Partie

1. Beide Spieler wählen je einen Charakter.
2. Ein Startspieler wird zufällig bestimmt.
3. Eine Arena wird zufällig offen ausgelegt.
4. Der Startspieler zieht 5 Karten.
5. Der zweite Spieler zieht 6 Karten.
6. Beide beginnen ohne Schild, Status, Formelkomponenten und Fetzladung.
7. Der Startspieler beginnt mit seiner Startphase.

---

# 6. Zugphasen

```text
1. Startphase
2. Ziehphase
3. Formelphase
4. Aktionsphase
5. Endphase
```

## 6.1 Startphase

Der aktive Spieler führt in dieser Reihenfolge aus:

1. Eigene erschöpfte Formelkomponenten werden aufgerichtet.
2. Gestörte eigene Formelkomponenten werden wiederhergestellt.
3. Effekte „zu Beginn deines Zuges“ werden ausgelöst.
4. Brennen und andere zeitgebundene Effekte werden abgewickelt.
5. Verzögerte Formel- und Echoeffekte werden ausgelöst.
6. Arenaeffekte werden geprüft.

## 6.2 Ziehphase

1. Der aktive Spieler zieht genau 1 Karte.
2. Ist es ein Sofort-Glitch, wird er sofort ausgeführt und abgelegt.
3. Es wird keine Ersatzkarte gezogen, außer ein Kartentext sagt dies ausdrücklich.

## 6.3 Formelphase

Der aktive Spieler führt **genau eine Formelaktion** aus:

### A. Formelkomponente bauen

Eine Technik, Essenz oder ein Katalysator wird aus der Hand in den passenden Platz gelegt.

```text
[Technik] [Essenz] [Katalysator]
```

- Der Platz muss leer sein.
- Die neue Komponente ist aufgerichtet.
- Sie kann erst ab dem nächsten Zug aktiviert werden, weil die Formelaktion bereits verbraucht ist.

### B. Formelkomponente ersetzen

- Eine vorhandene Komponente wird abgelegt.
- Eine neue Karte desselben Platztyps wird aus der Hand eingesetzt.
- Das Ersetzen zählt als vollständige Formelaktion.

### C. Formel aktivieren

- Mindestens **zwei** der drei Plätze müssen belegt sein; fehlende Rolle liefert keinen Effekt.
- Einzelplatz-Aktivierung ist **nicht** erlaubt.
- Die derzeit aufgerichteten Komponenten werden gemeinsam verwendet.
- Alle dabei verwendeten Komponenten werden anschließend erschöpft.
- Gestörte Komponenten werden ignoriert.
- Der Effekt richtet sich nach der vorhandenen Kombination.

### D. Schnellmix

Eine Formelkarte wird aus der Hand abgeworfen, um ihren alleinigen Effekt einmalig zu verwenden.

- Technik: verwendet ihren gedruckten Grundeffekt einmal.
- Essenz: versieht die nächste passende Elementkarte mit dieser Essenz.
- Katalysator: wendet seinen Modifikator einmal auf den nächsten kompatiblen Effekt an.

### E. Passen

Es passiert nichts.

## 6.4 Aktionsphase

Der aktive Spieler führt **genau eine Hauptaktion** aus:

- Angriffskarte spielen
- Boostkarte spielen
- Aktions-Glitch spielen
- Gegenstand verwenden
- eine gegnerische Formelkomponente herausfordern
- improvisieren
- Charakter-Großformel verwenden
- eine andere ausdrücklich als Hauptaktion gekennzeichnete Karte spielen

Eine in der Formelphase aktivierte Vorbereitung kann diese Hauptaktion verändern.

## 6.5 Endphase

1. Hand auf maximal 6 Karten reduzieren.
2. Effekte „bis zum Ende des Zuges“ beenden.
3. Einmalige Vorbereitungen entfernen, falls sie nicht ausgelöst wurden.
4. Der Gegner wird aktiver Spieler.

---

# 7. Kampfregeln

## 7.1 Angriff

1. Eine Angriffskarte aus der Hand spielen.
2. W6 würfeln.
3. Angriffswert berechnen.
4. Der Gegner darf eine Blockkarte spielen oder passen.
5. Bei Block wird ebenfalls gewürfelt.
6. Differenz wird als Schaden abgewickelt.
7. Danach werden Elementimpuls, Marke oder Reaktion aufgelöst.

```text
Angriffswert
= Kartenwert
+ W6-Bonus
+ Charakteraffinität
+ Boosts
+ Formeleffekte
+ weitere Modifikatoren
```

## 7.2 Block

```text
Blockwert
= Kartenwert
+ W6-Bonus
+ Charakteraffinität
+ Formeleffekte
+ weitere Modifikatoren
```

## 7.3 Charakteraffinität

Entspricht das Element einer Angriff- oder Blockkarte einem der beiden Charakterelemente:

```text
+1 Kampfwert
```

Dieser Bonus gilt höchstens einmal pro Karte.

## 7.4 Schaden

```text
Schaden = Angriffswert − Blockwert
```

Minimum: 0.

Schaden wird abgewickelt:

```text
zuerst Schild
danach Leben
```

## 7.5 Vollblock

Ein Vollblock entsteht, wenn:

```text
Blockwert >= Angriffswert
```

Dann entsteht kein Schaden.

Eine erfolgreiche Blockkarte kann bei Vollblock einen Elementimpuls auslösen.

## 7.6 Erfolgreicher Treffer

Ein Angriff gilt als erfolgreich, sobald:

```text
Angriffswert > Blockwert
```

Das gilt auch dann, wenn das Schild den gesamten Schaden aufnimmt.

---

# 8. Element-Angriffskarten

Jedes Element besitzt vier Angriffskarten:

```text
Wert 2
Wert 4
Wert 4
Wert 6
```

Bei einem erfolgreichen Treffer erzeugt die Karte einen Impuls ihres Elements.

## Feuer

| Karte | Wert |
|---|---:|
| Funkenklatsche | 2 |
| Grillzangen-Gerade | 4 |
| Aschenbackpfeife | 4 |
| Vulkanvolle Kanne | 6 |

## Wasser

| Karte | Wert |
|---|---:|
| Pfützenpiekser | 2 |
| Druckdusche | 4 |
| Waschgang | 4 |
| Rohrbruch | 6 |

## Erde

| Karte | Wert |
|---|---:|
| Kieselklatsche | 2 |
| Bordsteinwurf | 4 |
| Asphaltbrocken | 4 |
| Abrissbirne | 6 |

## Luft

| Karte | Wert |
|---|---:|
| Luftnummer | 2 |
| Föhnfront | 4 |
| Propellerpatsche | 4 |
| Orkan-Ohrfeige | 6 |

## Licht

| Karte | Wert |
|---|---:|
| Taschenlampenblitz | 2 |
| Scheinwerferstrahl | 4 |
| Prisma-Piekser | 4 |
| Sonnenstich | 6 |

## Schatten

| Karte | Wert |
|---|---:|
| Schattenstupser | 2 |
| Hinterhofhaken | 4 |
| Schwarzer Nachtritt | 4 |
| Höllenrückhand | 6 |

---

# 9. Element-Blockkarten

Jedes Element besitzt vier Blockkarten:

```text
Wert 2
Wert 4
Wert 4
Wert 6
```

Bei einem Vollblock erzeugt die Karte einen Impuls ihres Elements gegen den Angreifer.

## Feuer

| Karte | Wert |
|---|---:|
| Topflappen-Parade | 2 |
| Ofentür | 4 |
| Grilldeckel | 4 |
| Brandschutzwand | 6 |

## Wasser

| Karte | Wert |
|---|---:|
| Nasser Lappen | 2 |
| Duschvorhang | 4 |
| Wellenbrecher | 4 |
| Hochwasserwall | 6 |

## Erde

| Karte | Wert |
|---|---:|
| Blumentopfdeckel | 2 |
| Sandsack | 4 |
| Betonplatte | 4 |
| Bunkerwand | 6 |

## Luft

| Karte | Wert |
|---|---:|
| Windjacke | 2 |
| Luftpolster | 4 |
| Gegenwind | 4 |
| Tornadoschild | 6 |

## Licht

| Karte | Wert |
|---|---:|
| Sonnenbrille | 2 |
| Spiegelplatte | 4 |
| Lichtbrecher | 4 |
| Heiligenscheinwall | 6 |

## Schatten

| Karte | Wert |
|---|---:|
| Kapuzenparade | 2 |
| Schwarzer Vorhang | 4 |
| Schlagschatten | 4 |
| Finsterniswand | 6 |

---

# 10. Element-Boostkarten

Boosts werden normalerweise als Hauptaktion gespielt.

Sie werden nicht gewürfelt und können nicht mit einer normalen Blockkarte verhindert werden.

| Element | Karte | Effekt |
|---|---|---|
| Feuer | **Zündstoff** | Dein nächster Angriff erhält +2 und zusätzlich Feuer. Der Effekt bleibt bis zum nächsten eigenen erfolgreichen oder erfolglosen Angriff bestehen. |
| Wasser | **Nachfüllen** | Heile 2. Falls du Durchnässt bist, entferne Durchnässt und heile stattdessen 3. |
| Erde | **Fest verwurzelt** | Erhalte 3 Schild, maximal bis zum Schildlimit 5. |
| Luft | **Rückenwind** | Ziehe 2 Karten, wirf danach 1 Karte ab. Dein nächster W6-Bonus auf Angriff oder Block erhält +1, maximal +2. |
| Licht | **Erleuchtung** | Entferne eine eigene Primärmarke oder einen negativen Reaktionseffekt. Ziehe danach 1 Karte. |
| Schatten | **Dunkler Deal** | Wähle: Ziehe 2 Karten und verliere 1 Leben, oder der Gegner wirft 1 Karte seiner Wahl ab. |

---

# 11. Formelsystem

## 11.1 Formelplätze

```text
Technik
+ Essenz
+ Katalysator
= vollständige Formel
```

## 11.2 Rollen

| Platz | Frage |
|---|---|
| Technik | Was geschieht und wie wird es ausgeführt? |
| Essenz | Welches zusätzliche Element und welche Elementwirkung kommen hinzu? |
| Katalysator | Wie werden Stärke, Timing oder Verhalten verändert? |

## 11.3 Aktivierungsarten

| Typ | Bedeutung |
|---|---|
| Sofort | Effekt geschieht direkt in der Formelphase |
| Vorbereitung: Angriff | verändert den nächsten Angriff in diesem Zug |
| Vorbereitung: Boost | verändert den nächsten Boost |
| Vorbereitung: Block | verändert den nächsten Block bis zur nächsten Startphase |
| Reaktion | wartet auf einen definierten gegnerischen Trigger |

## 11.4 Verwendete Komponenten

Bei einer Formelaktivierung werden alle aufgerichteten, nicht gestörten Komponenten verwendet.

Beispiele:

```text
nur Technik
→ Technik wird erschöpft

Technik + Essenz
→ beide werden erschöpft

Essenz + Katalysator
→ beide werden erschöpft

volle Formel
→ alle drei werden erschöpft
```

## 11.5 Teilformeln

| Vorhandene Karten | Ergebnis |
|---|---|
| nur Technik | **nicht** als Formel aktivierbar (nur Vorschau/Authoring) |
| nur Essenz | **nicht** als Formel aktivierbar |
| nur Katalysator | **nicht** als Formel aktivierbar |
| Technik + Essenz | elementarer Technikskill (aktivierbar) |
| Technik + Katalysator | modifizierter Technikskill (aktivierbar) |
| Essenz + Katalysator | flexible Infusion (aktivierbar) |
| alle drei | vollständige Formel mit Fetzladung |

## 11.6 Volle Formel und Fetzladung

Eine vollständige Formel besteht aus allen drei Plätzen.

Sie erhält 1 Fetzladung, wenn:

- die Formel vollständig war,
- die Aktivierung tatsächlich ausgelöst wurde,
- und ihr Effekt nicht vollständig verhindert wurde.

Maximum: 3 Fetzladung.

Bei 3 Fetzladung kann die charaktereigene Großformel in der Aktionsphase verwendet werden.

Nach der Großformel:

1. Fetzladung wird auf 0 gesetzt.
2. Der Katalysator wird abgelegt.
3. Technik und Essenz werden erschöpft.
4. Die Großformel gilt für diese Partie als verbraucht.

---

# 12. Technik-Karten

Techniken sind neutral. Sie liefern kein eigenes Element.

| Technik | Modus | Stabilität | Grundeffekt | Visuelle Grundform |
|---|---|---:|---|---|
| **Rückhandtechnik** | Vorbereitung: Angriff | 3 | Der nächste Angriff erhält +1. | breiter Schlagbogen |
| **Durchschuss** | Vorbereitung: Angriff | 3 | Der nächste Angriff ignoriert 1 Schild. | gerader Bohrstrahl |
| **Fächerstoß** | Vorbereitung: Angriff | 2 | Der nächste Angriff erhält −1 Kampfwert, erzeugt seinen Elementimpuls aber bereits bei Gleichstand. | breiter Fächer |
| **Kettenhieb** | Vorbereitung: Angriff | 3 | Verursacht der nächste Angriff Lebensschaden, verliert der Gegner zusätzlich 1 Schild. | verzweigter Schlag |
| **Notfallbarriere** | Sofort | 4 | Erhalte 1 Schild. | halbrunder Schildbogen |
| **Retourkutsche** | Vorbereitung: Block | 3 | Der nächste Block erhält +1. Bei Vollblock erleidet der Angreifer 1 Schaden. | Gegenbogen |
| **Erste-Hilfe-Ritual** | Sofort | 2 | Heile 1. | aufsteigende Welle |
| **Klarspüler** | Sofort | 3 | Entferne eine eigene Primärmarke. | reinigender Kreis |
| **Fokuskurbel** | Vorbereitung: Boost | 3 | Der nächste Boost mit Zahlenwert erhält +1; ohne Zahlenwert ziehst du danach 1 und wirfst 1 ab. | fokussierende Spirale |
| **Sperrkreis** | Sofort | 4 | Der nächste gegnerische Angriff erhält −1 Kampfwert. | Bodenring |
| **Soggriff** | Sofort | 2 | Eine gegnerische Formelkomponente erhält bis zu deren nächster Startphase −1 Stabilität. | Haken- und Zuglinie |
| **Rückrufzeichen** | Sofort | 2 | Nimm eine Formelkarte aus dem Ablagestapel auf die Hand und wirf danach 1 Handkarte ab. | rücklaufende Rune |

---

# 13. Essenz-Karten

Essenzen geben einer Formel ein zusätzliches Element.

Bei einer Vorbereitung wird das Element der ausgespielten Angriff-, Block- oder Boostkarte **nicht ersetzt**, sondern ergänzt.

| Essenz | Element | Stabilität | Effekt |
|---|---|---:|---|
| **Eingekochte Glut** | Feuer | 2 | Fügt die Formel Lebensschaden zu und entsteht keine Reaktion, erhält das Ziel Brennen. |
| **Explosionspüree** | Feuer | 2 | Die erste durch diese Formel ausgelöste Reaktion verursacht +1 Schaden. Danach erhalten die verwendeten Formelkomponenten bis zur nächsten Startphase −1 Stabilität. |
| **Überdrucktes Kondensat** | Wasser | 3 | Entsteht keine Reaktion, erhält das Ziel Durchnässt. |
| **Tiefenwasserextrakt** | Wasser | 3 | Heilt die Formel oder erzeugt Schild, erhöht sich der erste Zahlenwert um 1. |
| **Kräuterstaub** | Erde | 2 | Entsteht keine Reaktion, erhält das Ziel High. |
| **Betonkern** | Erde | 4 | Alle bei der Aktivierung verwendeten Formelkomponenten erhalten bis zur nächsten Startphase +1 Stabilität. |
| **Wirbelluft** | Luft | 2 | Entsteht keine Reaktion, erhält das Ziel Verwirbelt. |
| **Druckluftkonzentrat** | Luft | 3 | Der nächste zugehörige Angriff oder Block erhält +1 auf seinen W6-Bonus, maximal +2. |
| **Prismalicht** | Licht | 2 | Entsteht keine Reaktion, erhält das Ziel Verstrahlt. |
| **Reinlicht** | Licht | 3 | Entferne bei Aktivierung eine eigene Primärmarke. Gibt es keine, erhältst du 1 Schild. |
| **Fluchruß** | Schatten | 2 | Entsteht keine Reaktion, erhält das Ziel Verflucht. |
| **Sogschatten** | Schatten | 3 | Fügt die Formel Lebensschaden zu, heile 1. Maximal einmal pro Aktivierung. |

---

# 14. Katalysator-Karten

Katalysatoren sind neutral.

Der Begriff **Primärwert** bezeichnet den wichtigsten Zahlenwert des Formeleffekts:

- Angriffserhöhung
- Schaden
- Blockerhöhung
- Schild
- Heilung
- Stabilitätsveränderung

| Katalysator | Stabilität | Effekt |
|---|---:|---|
| **Echo** | 2 | Wiederhole zu Beginn deines nächsten Zuges 1 Punkt des Primärwerts. |
| **Doppelecho** | 2 | Wiederhole zu Beginn deines nächsten Zuges bis zu 2 Punkte des Primärwerts. Dieser Katalysator bleibt in deiner nächsten Startphase erschöpft. |
| **Überladung** | 2 | Erhöhe den Primärwert um 2. Nach vollständiger Auflösung verlierst du 1 Leben. |
| **Verdichtung** | 4 | Erhöhe den Primärwert um 1. Alle verwendeten Formelkomponenten erhalten bis zur nächsten Startphase +1 Stabilität. |
| **Ausbreitung** | 3 | Ein gegnergerichteter Effekt berührt zusätzlich eine Formelkomponente: Sie erhält bis zur nächsten Startphase −1 Stabilität. Ein selbstgerichteter Effekt gibt zusätzlich einer eigenen Komponente +1 Stabilität. |
| **Kettenkopplung** | 3 | Wird die vorbereitete Aktion erfolgreich, erhält deine nächste Aktion desselben Typs +1. |
| **Verzögerung** | 3 | Der Primäreffekt geschieht nicht sofort, sondern zu Beginn deines nächsten Zuges und erhält +2 auf seinen Primärwert. |
| **Sofortzünder** | 2 | Reduziere den Primärwert um 1. Ziehe nach der Auflösung 1 Karte und wirf anschließend 1 Karte ab. |
| **Spiegelung** | 3 | Offensive Formel: Nach erfolgreichem Treffer erhältst du 1 Schild. Defensive Formel: Bei Vollblock oder Schildgewinn erleidet der Gegner 1 Schaden. |
| **Umkehrung** | 2 | Wähle bei Aktivierung: Bis zu 2 Punkte Schaden werden zu Heilung oder bis zu 2 Punkte Heilung/Schild werden zu Schaden. Das Ziel muss legal bleiben. |
| **Opfergabe** | 3 | Du darfst bei Aktivierung 1 Handkarte abwerfen. Tust du dies, erhöht sich der Primärwert um 2. |
| **Sicherheitsventil** | 4 | Verhindere den ersten Selbstschaden oder Kartenabwurf, den die eigene Formel verursachen würde. Entferne danach eine eigene Primärmarke. |

---

# 15. Formelauflösung

## 15.1 Reihenfolge

```text
1. Technik bestimmt Modus und Ziel.
2. Essenz ergänzt Element und Essenzeffekt.
3. Katalysator verändert Primärwert, Timing oder Ziel.
4. Handkarte liefert bei Vorbereitungen Typ, Grundwert und erstes Element.
5. Charakteraffinität und Boosts werden berechnet.
6. Angriff oder Block wird aufgelöst.
7. Elementreaktion oder Primärmarke wird bestimmt.
8. verzögerte Nebenwirkungen werden angelegt.
9. verwendete Formelkomponenten werden erschöpft.
10. gegebenenfalls wird 1 Fetzladung erzeugt.
```

## 15.2 Kein neues Einzelbild pro Kombination

Die Regeln werden aus den drei Komponenten berechnet. Nur besondere Signaturkombinationen erhalten einen handgeschriebenen Namen oder ein eigenes Artwork.

---

# 16. Beispiele für Teil- und Vollformeln

## Nur Technik

```text
Durchschuss
```

Aktivierung:

```text
Der nächste Angriff ignoriert 1 Schild.
```

## Nur Essenz

```text
Eingekochte Glut
```

Aktivierung:

```text
Die nächste passende Elementkarte erhält zusätzlich Feuer.
```

## Nur Katalysator

```text
Echo
```

Aktivierung:

```text
Der nächste kompatible Effekt wiederholt zu Beginn deines nächsten Zuges 1 Punkt.
```

## Technik + Essenz

```text
Durchschuss + Eingekochte Glut
```

Aktivierung:

```text
Der nächste Angriff ignoriert 1 Schild und erhält zusätzlich Feuer.
```

## Technik + Katalysator

```text
Notfallbarriere + Echo
```

Aktivierung:

```text
Erhalte 1 Schild.
Zu Beginn deines nächsten Zuges erhältst du erneut 1 Schild.
```

## Essenz + Katalysator

```text
Eingekochte Glut + Echo
```

Aktivierung:

```text
Die nächste passende Elementkarte erhält zusätzlich Feuer.
1 Punkt ihres Primärwerts wird zu Beginn deines nächsten Zuges wiederholt.
```

## Vollständige Formel

```text
Durchschuss
+ Eingekochte Glut
+ Echo
```

Aktivierung:

```text
Der nächste Angriff:
- ignoriert 1 Schild,
- erhält zusätzlich Feuer,
- kann eine Reaktion auslösen,
- wiederholt zu Beginn deines nächsten Zuges 1 Schaden.
```

---

# 17. Elementimpulse, Primärmarken und Reaktionen

## 17.0 Primär- und Sekundärelement (verbindlich)

Rollen in einer kombinierten Aktion:

| Quelle | Bestimmt |
|---|---|
| **Aktionskarte** (Angriff/Block/Boost) | Basisaktion, Stärke, **Primärelement** |
| **Technik** | Ausführungsform (Silhouette, Delivery, Cast-Geometrie) — **kein** eigenes Element |
| **Essenz** | **Sekundärelement** + Status-/Materialwirkung |
| **Katalysator** | Timing, Wiederholung, Zielverhalten, Transformation |
| **Primär + Sekundär** | welche **Reaktion** entsteht (falls Marke/Impuls-Paar greift) |

Beispiel:

```text
Wasser-Angriff
+ Durchschuss
+ Feueressenz
+ Echo

= Wasserbohrstrahl mit Feuerkern
= zweifache Aktivierung (Echo)
= bei Treffer Dampfreaktion (Wasser + Feuer)
```

**Visuelle Gewichtung** (dauerhaft auf Formelgestell und Cast):

| Schicht | Anteil |
|---|---:|
| Primärelement (Aktionskarte) | 60–70 % |
| Sekundärelement (Essenz) | 30–40 % |
| Reaktion beim Treffer | kurzfristig dominant, dann abklingen |

Ohne diese Gewichtung kann derselbe Angriff einmal wie Feuer und einmal wie Wasser gelesen werden — das ist verboten.

## 17.1 Entstehung eines Impulses

Ein Impuls entsteht:

- bei einem erfolgreichen Angriff mit einer Element-Angriffskarte,
- bei einem Vollblock mit einer Element-Blockkarte,
- durch eine Essenz,
- durch ausdrücklich gekennzeichnete Boosts, Gegenstände, Glitches oder Großformeln.

## 17.2 Maximal eine Primärmarke

Ein Spieler kann gleichzeitig maximal **eine Primärmarke** besitzen.

Erhält ein Spieler einen Impuls und besitzt keine Marke:

```text
Impuls setzt die passende Primärmarke.
```

Besitzt er bereits eine Marke:

```text
Impuls + vorhandene Marke
→ Reaktion
→ vorhandene Marke wird entfernt
```

## 17.3 Zwei Elemente in einer Formelaktion

Besteht eine Formelaktion aus:

```text
Element der Handkarte
+
Element der Essenz
```

können diese beiden Elemente direkt miteinander reagieren.

Sind zusätzlich bereits Marken vorhanden, wählt der aktive Spieler genau **eine** mögliche Reaktion.

Pro Aktion kann maximal eine Reaktion entstehen.

---

# 18. Primärmarken

## Feuer — Brennen

**Entstehung:**

- erfolgreicher einzelner Feuerimpuls,
- Eingekochte Glut,
- Reaktionen, die Brennen ausdrücklich erzeugen.

**Effekt:**

```text
Zu Beginn des nächsten eigenen Zuges:
1 Lebensschaden, Schild wird ignoriert.
Danach Brennen entfernen.
```

## Wasser — Durchnässt

**Entstehung:**

- erfolgreicher einzelner Wasserimpuls,
- Überdrucktes Kondensat,
- Reaktionen, die Durchnässt ausdrücklich erzeugen.

**Effekt:**

```text
Die nächste Blockkarte erhält −1 Kampfwert.
Danach Durchnässt entfernen.
```

Nicht ausgelöst bis zur nächsten Endphase:

```text
Durchnässt entfernen.
```

## Erde — High

**Entstehung:**

- erfolgreicher einzelner Erdimpuls,
- Kräuterstaub,
- Reaktionen, die High ausdrücklich erzeugen.

**Effekt:**

```text
Der nächste W6-Bonus auf Angriff oder Block wird zu +0.
Danach High entfernen.
```

Nicht ausgelöst bis zur nächsten Endphase:

```text
High entfernen.
```

## Luft — Verwirbelt

**Entstehung:**

- erfolgreicher einzelner Luftimpuls,
- Wirbelluft,
- Reaktionen, die Verwirbelt ausdrücklich erzeugen.

**Effekt:**

```text
Der nächste Angriff oder die nächste Herausforderung erhält −1 Kampfwert.
Danach Verwirbelt entfernen.
```

Nicht ausgelöst bis zur nächsten Endphase:

```text
Verwirbelt entfernen.
```

## Licht — Verstrahlt

**Entstehung:**

- erfolgreicher einzelner Lichtimpuls,
- Prismalicht,
- Reaktionen, die Verstrahlt ausdrücklich erzeugen.

**Effekt:**

```text
Die nächste Herausforderung gegen eine eigene Formelkomponente
des verstrahlten Spielers erhält +1 Angriffswert.
Danach Verstrahlt entfernen.
```

Nicht ausgelöst bis zur nächsten Endphase:

```text
Verstrahlt entfernen.
```

## Schatten — Verflucht

**Entstehung:**

- erfolgreicher einzelner Schattenimpuls,
- Fluchruß,
- Reaktionen, die Verflucht ausdrücklich erzeugen.

**Effekt:**

```text
Der nächste eigene Heil- oder Schildgewinn wird um 1 reduziert.
Danach Verflucht entfernen.
```

Nicht ausgelöst bis zur nächsten Endphase:

```text
Verflucht entfernen.
```

---

# 19. Reaktionsmatrix

Reaktionen verbrauchen die vorhandene Primärmarke, sofern diese Teil der Reaktion war.

## Gleiche Elemente

| Kombination | Reaktion | Effekt |
|---|---|---|
| Feuer + Feuer | **Überhitzt** | 1 Schaden ignoriert Schild. Danach erhält das Ziel Brennen. |
| Wasser + Wasser | **Überflutet** | Entferne bis zu 2 Schild beim Ziel. Hat es kein Schild, erhält sein nächster Block −1. |
| Erde + Erde | **Versteinert** | Störe eine gegnerische Formelkomponente. Gibt es keine, wird der nächste W6-Bonus des Ziels zu +0. |
| Luft + Luft | **Tornado** | Der nächste Angriff oder die nächste Herausforderung des Ziels erhält −2. |
| Licht + Licht | **Geblendet** | Der nächste Block des Ziels erhält −2. Bis zur nächsten Startphase kann es keinen Reaktions-Glitch spielen. |
| Schatten + Schatten | **Verdorben** | Das Ziel wählt: 1 Handkarte abwerfen oder 1 Lebensschaden erleiden. |

## Gemischte Elemente

| Kombination | Reaktion | Effekt |
|---|---|---|
| Feuer + Wasser | **Dampf** | Das Ziel erhält Nebel: Sein nächster Angriff und sein nächster Block erhalten jeweils −1. Danach Nebel entfernen. |
| Feuer + Erde | **Schmelze** | 1 Schaden ignoriert Schild. Eine gewählte Formelkomponente des Ziels erhält bis zu dessen nächster Startphase −1 Stabilität. |
| Feuer + Luft | **Feuersturm** | 1 Schaden und Brennen. |
| Feuer + Licht | **Sonnenbrand** | 1 Schaden und Verstrahlt. |
| Feuer + Schatten | **Höllenbrand** | 1 Schaden. Das Ziel kann bis zum Ende seines nächsten Zuges nicht geheilt werden. |
| Wasser + Erde | **Schlamm** | Der nächste Angriff oder die nächste Herausforderung des Ziels erhält −2. |
| Wasser + Luft | **Nebelbank** | Bis zur nächsten Startphase des Ziels erhalten Angriffe von und gegen dieses Ziel −1. |
| Wasser + Licht | **Regenbogen** | Der auslösende Spieler entfernt eine eigene Primärmarke und zieht 1 Karte, danach wirft er 1 Karte ab. |
| Wasser + Schatten | **Moder** | Der nächste Heil- oder Schildgewinn des Ziels wird um 2 reduziert. |
| Erde + Luft | **Staubsturm** | Bei der nächsten Formelaktivierung des Ziels wird dessen Katalysator ignoriert. |
| Erde + Licht | **Kristallwuchs** | Der auslösende Spieler erhält 2 Schild. |
| Erde + Schatten | **Giftsporen** | Das Ziel erhält Toxisch: Beim nächsten Boost oder Gegenstand verliert es 1 Leben. Danach Toxisch entfernen. |
| Luft + Licht | **Blitzlicht** | Der nächste Block des Ziels erhält −2. |
| Luft + Schatten | **Flüstersturm** | Das Ziel wirft 1 Handkarte ab und zieht danach 1 Karte. |
| Licht + Schatten | **Dämmerung** | Verschiebe bis zu 1 Schild vom Ziel zum auslösenden Spieler. Hat das Ziel kein Schild, verliert es 1 Leben und der auslösende Spieler heilt 1. |

---

# 20. Zusätzliche Reaktionseffekte

Diese Effekte sind keine Primärmarken und können neben einer Primärmarke bestehen.

| Effekt | Wirkung |
|---|---|
| Nebel | nächster Angriff und nächster Block jeweils −1 |
| Nebelbank | Angriffe von und gegen das Ziel −1 bis zur nächsten Startphase |
| Toxisch | beim nächsten Boost oder Gegenstand 1 Lebensschaden |
| Heilblockade | keine Heilung bis zum angegebenen Zeitpunkt |
| Katalysatorausfall | Katalysator wird bei der nächsten Aktivierung ignoriert |
| Stabilitätsbruch | gewählte Formelkomponente vorübergehend −1 Stabilität |

Mehrere identische Reaktionseffekte stapeln nicht.

---

# 21. Gegenstände

Gegenstände sind einmalige Karten. Danach werden sie abgelegt.

| Gegenstand | Timing | Effekt |
|---|---|---|
| **Nasser Socken** | Aktion | Die nächste von dir gespielte Elementkarte erhält zusätzlich Wasser. Verursacht sie einen erfolgreichen Treffer, entsteht mindestens Durchnässt, sofern keine Reaktion entsteht. |
| **Kaputter Rückspiegel** | Reaktion | Wenn du angegriffen wirst: Angriffswert −1. Bei Vollblock erhält der Angreifer Verstrahlt. |
| **Halbe Dose Energy** | Aktion | Ziehe 2 Karten. Zu Beginn deines nächsten Zuges verlierst du 1 Leben. |
| **Rostiger Nagel** | Aktion | Dein nächster Angriff ignoriert 2 Schild. |
| **Verdächtiger Pilz** | Aktion | Erhalte 2 Schild und High. |
| **Kabelbinder Deluxe** | Aktion | Störe eine gegnerische Formelkomponente mit Stabilität 3 oder weniger. |

---

# 22. Glitches

## 22.1 Glitch-Arten

| Typ | Zeitpunkt |
|---|---|
| Sofort | unmittelbar beim Ziehen |
| Aktion | eigene Aktionsphase |
| Reaktion | beim angegebenen Trigger |

## 22.2 Karten

| Glitch | Typ | Effekt |
|---|---|---|
| **Riss in der Realität** | Aktion | Lege die aktuelle Arena ab und decke zufällig eine andere Arena auf. |
| **Nein, Bruder** | Reaktion | Verhindere einen gerade gespielten Boost oder Gegenstand vollständig. |
| **Kurzschluss** | Aktion | Störe eine gegnerische Formelkomponente bis zu deren nächster Startphase. |
| **Rückkopplung** | Reaktion | Reduziere einen gerade berechneten Angriffswert um 2. |
| **Schlechter Empfang** | Aktion | Der Gegner darf bis zu seiner nächsten Startphase außerhalb seiner Ziehphase keine Karten ziehen. |
| **Systemfehler** | Aktion | Eine Formelkomponente verliert bis zur nächsten Startphase ihres Besitzers ihren gedruckten Effekt. Stabilität und Platz bleiben erhalten. |
| **Illegaler Download** | Reaktion | Wenn der Gegner eine Formel aktiviert: Wirf 1 Handkarte ab und kopiere den Katalysatoreffekt für deine nächste kompatible Aktion. |
| **Selbstschaden.exe** | Sofort | Verliere 2 Leben. |
| **Datenleck** | Sofort | Beide Spieler ziehen 1 Karte. |
| **Absturz** | Sofort | Wirf 1 Handkarte ab oder verliere 1 Leben. |

---

# 23. Improvisieren

**Improvisieren** ist eine Hauptaktion.

```text
Wirf 1 Handkarte ab.
Ziehe danach 2 Karten.
Deine Aktionsphase endet.
```

Zweck:

- schlechte Hände auflösen,
- zu viele Blocks oder Formelkomponenten austauschen,
- Zugriff auf den gemeinsamen Stapel beschleunigen,
- komplette Passivzüge vermeiden.

---

# 24. Formelkomponenten herausfordern

Statt den Gegner direkt anzugreifen, kann ein Spieler eine Technik, Essenz oder einen Katalysator angreifen.

## 24.1 Ablauf

1. Zielkomponente wählen.
2. Eine Angriffskarte spielen.
3. W6 würfeln.
4. Der Besitzer darf eine Blockkarte spielen.
5. Verteidigungswert berechnen.
6. Ergebnis vergleichen.

```text
Herausforderungsangriff
= Angriffskarte
+ W6
+ Affinität
+ Formeleffekte
+ weitere Boni
```

```text
Komponentenverteidigung
= Stabilität
+ optionale Blockkarte
+ W6
+ Affinität
+ weitere Boni
```

## 24.2 Ergebnis

| Differenz | Ergebnis |
|---|---|
| Angriff <= Verteidigung | keine Wirkung |
| Angriff 1–2 höher | Komponente wird gestört |
| Angriff 3 oder mehr höher | Komponente wird zerstört |
| bereits gestörte Komponente und Angriff höher | Komponente wird zerstört |

## 24.3 Gestört

- Karte wird quer gelegt.
- Ihr Effekt und Element werden ignoriert.
- Sie wird in der nächsten Startphase ihres Besitzers wiederhergestellt.
- Sie darf vorher ersetzt werden.

## 24.4 Zerstört

- Karte kommt auf den gemeinsamen Ablagestapel.
- Der Platz wird leer.

## 24.5 Kein Lebensschaden

Eine Herausforderung verursacht keinen Schaden am gegnerischen Leben.

---

# 25. Charakteraufbau

Jeder Charakter besitzt:

- 20 Leben
- zwei Elementaffinitäten
- eine Passive
- eine charaktereigene Großformel
- eine einmalige Großformel-Nutzung pro Partie

Der bisherige +1-Affinitätsbonus auf passende Angriff- und Blockkarten bleibt bestehen.

## 25.1 Knuspergnom

**Elemente:** Erde / Feuer  
**Rolle:** Allrounder und Kartenfilter

**Passive — Alles verwerten**

Einmal pro Zug, wenn du eine Erde- oder Feuerkomponente baust oder eine Erde-/Feuerkarte in einer Formel verwendest:

```text
Du darfst 1 Karte abwerfen und 1 Karte ziehen.
```

**Großformel — Mit Alles und Scharf**

```text
Füge 5 Schaden zu.
Heile 3.
Du darfst danach eine Formelkomponente aus deiner Hand bauen.
```

## 25.2 Schluckspecht

**Elemente:** Wasser / Licht  
**Rolle:** Sustain und Vollblock

**Passive — Noch einen für den Weg**

Einmal pro gegnerischem Zug bei Vollblock:

```text
Heile 1.
```

**Großformel — Lass laufen, Bruder**

```text
Heile 4.
Füge 3 Schaden zu.
Hast du danach weniger Leben als der Gegner, ziehe 1 Karte.
```

## 25.3 Stiernackenkommando

**Elemente:** Schatten / Luft  
**Rolle:** Bruiser und Gegenangriff

**Passive — Jetzt erst recht**

Nach erlittenem Lebensschaden:

```text
Der nächste Angriff oder die nächste Herausforderung erhält +1.
Maximum gespeicherter Bonus: +2.
```

**Großformel — Rückhandbombe**

```text
Der nächste Angriff in diesem Zug wird nach allen Boni verdoppelt.
Danach verlierst du 1 Leben.
```

Die Großformel selbst verbraucht die Hauptaktion nicht; unmittelbar danach darf ausschließlich dieser Angriff gespielt werden.

## 25.4 Kokabell

**Elemente:** Erde / Licht  
**Rolle:** Defensive und Stabilität

**Passive — Standfest**

Einmal pro Zug, wenn du geheilt wirst:

```text
Eine eigene Formelkomponente erhält bis zu deiner nächsten Startphase +1 Stabilität.
```

**Großformel — Golden (S)hou(we)r**

```text
Bist du unter 12 Leben, setze dein Leben auf 12.
Richte danach bis zu 2 eigene Formelkomponenten auf.
```

## 25.5 Pillendoktora

**Elemente:** Luft / Feuer  
**Rolle:** Risiko und Tempo

**Passive — Beipackzettel ignoriert**

Einmal pro Zug, wenn du einen Boost spielst, wähle:

```text
A. Ziehe 1 und verliere 1 Leben.
B. Füge dem Gegner 1 Schaden zu.
C. Heile 1.
```

**Großformel — 3 Tage wach**

```text
Heile 4.
Füge 4 Schaden zu.
Ziehe 2.
Wirf danach 1 Karte ab.
```

## 25.6 Dripministerin

**Elemente:** Wasser / Schatten  
**Rolle:** Kontrolle und Formelstörung

**Passive — Runway-Kontrolle**

Einmal pro Zug, wenn eine gegnerische Formelkomponente gestört oder zerstört wird:

```text
Ziehe 1 und wirf danach 1 Karte ab.
```

**Großformel — Runway ins Schattenreich**

```text
Der Gegner wirft 2 Karten ab.
Er verliert 3 Leben.
Störe 1 gegnerische Formelkomponente.
```

## 25.7 Das Mysterium

**Elemente:** Licht / Schatten  
**Rolle:** Flexibilität und Kopieren

**Passive — Ungeschriebene Farbe**

Einmal pro Zug:

```text
Eine von dir gespielte Elementkarte oder eine verwendete Essenz
zählt für diese Aktion als ein Element deiner Wahl.
```

**Großformel — Echo der ungeschriebenen Mythen**

```text
Kopiere die bereits verwendete oder noch verfügbare Großformel des Gegners.
Führe sie mit dir als Zielbesitzer aus.
Ziehe danach 1 Karte.
```

---

# 26. Arenen

Zu Beginn der Partie liegt genau eine Arena offen.

| Arena | V5-Effekt |
|---|---|
| **Späti der Erleuchtung** | Der erste Boost jedes Spielers pro eigenem Zug erlaubt danach: 1 ziehen, 1 abwerfen. |
| **Kristallkathedrale** | Die erste Heilung jedes Spielers pro eigenem Zug wird um 1 erhöht. Licht-Essenzen besitzen +1 Stabilität. |
| **Vulkan der schlechten Entscheidungen** | Angriffe erhalten +1. Verursacht ein Angriff keinen Lebensschaden, verliert der Angreifer 1 Leben. |
| **Sumpf der passiv-aggressiven Heilung** | Jeder Vollblock gibt 1 Schild. Eine Komponente wird erst bei Differenz 4 oder mehr direkt zerstört. |
| **Club der fliegenden Backpfeifen** | Luft-Angriffe und Luft-Blocks erhalten +1 W6-Bonus, maximal +2. Nach einem Formelersatz darf der Spieler 1 ziehen und 1 abwerfen. |
| **Schattenbasar der toxischen Angebote** | Bei erfolgreicher Herausforderung darf der Angreifer 1 Leben zahlen, um aus „gestört“ sofort „zerstört“ zu machen. |

---

# 27. Timing und Prioritäten

## 27.1 Reihenfolge bei mehreren Effekten

1. Sofort-Glitches
2. Reaktions-Glitches
3. Formelvorbereitung
4. Angriff oder Block
5. Schild und Leben
6. Elementreaktion oder Primärmarke
7. Charakterpassive
8. Arena
9. verzögerte Effekte

## 27.2 Gleichzeitige Effekte

Der aktive Spieler entscheidet die Reihenfolge eigener gleichzeitiger Effekte.

Der nicht aktive Spieler entscheidet anschließend die Reihenfolge seiner Effekte.

## 27.3 Zahlenminimum

- Kampfwerte können nicht unter 0 fallen.
- Heilung und Schildgewinn können nicht unter 0 fallen.
- Angriffskarten behalten mindestens Wert 1, außer ein Effekt verhindert die Aktion vollständig.

---

# 28. Visuelles Formelsystem (verbindlicher Vertrag)

**Kernurteil:** Nicht drei gleichwertige Objekte nebeneinander. Die **Technik** ist die visuelle Hauptform; Essenz und Katalysator **transformieren** diese Form. Spieler sollen in Sekunden lesen können: *„Feuer-Bohrattacke mit Echo“* — nicht drei Karten mental zusammensetzen.

```text
Meshy          → Form & Identität wiederverwendbarer Komponenten
Formula Rig    → permanente, lesbare Spielfelddarstellung
Visual Recipe  → kombinierte Bedeutung (datengetrieben)
Partikel/Shader→ Element, Bewegung, Zustand
Reaction Resolver → spielmechanisches + visuelles Treffergebnis
```

## 28.0 MVP-Scope (vor Vollproduktion)

12×12×12 = 1.728 Grundkombinationen. **36 Meshy-Modelle erst nach dem MVP.**

Erster Durchlauf:

| Rolle | Anzahl |
|---|---:|
| Techniken | 3 |
| Essenzen | 3 |
| Katalysatoren | 3 |
| **Kombinationen** | **27** |

Fragen, die der MVP beantworten muss:

- Sind Kombinationen klar unterscheidbar?
- Lesbar in Karten- und Mobile-Größe?
- Wirken sie wie **eine** Maschine (nicht Schrott-Collage)?
- Effekte reproduzierbar?
- Essenz vs. Katalysator wirklich unterschiedlich?
- Formel in wenigen Sekunden verständlich?

Erst danach Restproduktion.

**Nicht im MVP:** alternativer WebP-Sparmodus / zweite Rendering-Pipeline. Zuerst GLB + Toon + geringe Idle-Partikel + kurze Cast-VFX; erst bei gemessener Last (GPU, Speicher, Ladezeit, Draw Calls, Mobile-FPS) einen Snapshot-Pfad erwägen.

## 28.1 Formelgestell (permanente Apparatur)

Das Gestell zeigt die **resultierende Kombination**, nicht nur drei Einzelkarten.

```text
[Essenzbehälter]
       ↓ Energiefluss
[Technikkern mit kombinierter Darstellung]
       ↓
[Katalysatorring verändert den Kern]
```

| Zone | Rolle |
|---|---|
| Essenzbehälter | Sekundärelement / Material-Energie, fließt in den Kern |
| Technikkern | **Hauptsilhouette** + bereits angewandte Essenz-Transformation |
| Katalysatorring | Timing/Transformation als sichtbare Modifikation am Kern |

Karten-Chips/IDs dürfen als kleine Labels existieren — die **Bedeutung** kommt aus dem zusammengesetzten Kern.

## 28.2 Datenvertrag vor Meshy

Bevor Modelle erzeugt werden, besitzt jede Kategorie einen festen visuellen Vertrag. Ohne Vertrag entstehen 36 schöne Einzelteile, die sich nicht sauber kombinieren lassen.

### Technik

```ts
type TechniqueVisual = {
  id: string;
  delivery: "projectile" | "beam" | "melee" | "area" | "barrier";
  shape: "drill" | "slash" | "sphere" | "cone" | "wall";
  castOrigin: string;
  forwardAxis: "x" | "y" | "z";
  scaleClass: "small" | "medium" | "large";
};
```

Technik = Körper / Ausführungsform / Hauptsilhouette / Cast-Geometrie. **Kein Element.**

### Essenz

```ts
type EssenceVisual = {
  id: string;
  element: "fire" | "water" | "earth" | "air" | "light" | "shadow";
  materialProfile: string;
  particleProfile: string;
  trailProfile: string;
  impactProfile: string;
};
```

Essenz = Energie / Sekundärelement / Material / Trail / Statusbeitrag.

### Katalysator

```ts
type CatalystVisual = {
  id: string;
  timing: "instant" | "delayed" | "repeating" | "continuous";
  transformation:
    | "duplicate"
    | "spread"
    | "chain"
    | "reflect"
    | "overcharge";
  animationProfile: string;
};
```

Katalysator = Verhalten (Timing, Wiederholung, Zielverhalten, Transformation).

### Zielbild der Schichten

```text
Aktionskarte  → Angriffstyp, Wert, Primärelement
Technik       → Ausführungsform, Hauptsilhouette, Cast-Geometrie
Essenz        → Sekundärelement, Material, Trail, Status
Katalysator   → Timing, Wiederholung, Zielverhalten, Transformation
Reaktion      → Treffer-VFX, kombinierter Zustand, Spielfeldwirkung
```

Kurz: **Technik = Körper · Essenz = Energie · Katalysator = Verhalten · Reaktion = Ergebnis.**

## 28.3 Visual Recipe (kein Hardcoding von Kombi-IDs)

Verboten:

```ts
if (technique === "throughshot" && essence === "condensed-ember" && catalyst === "echo") {
  playSpecificAnimation();
}
```

Geboten — Eigenschaften → Rezept → Renderer:

```ts
const recipe = {
  delivery: technique.delivery,
  shape: technique.shape,
  primaryElement: actionCard.element,
  secondaryElement: essence.element,
  material: essence.materialProfile,
  timing: catalyst.timing,
  transformation: catalyst.transformation,
  reaction: resolveReaction(actionCard.element, essence.element),
};
```

Beispiel-Interpretation:

```text
delivery: beam
shape: drill
primaryElement: water
secondaryElement: fire
transformation: duplicate
timing: delayed
reaction: steam
```

→ Wasserbohrstrahl mit Feuerkern, Echo/Doppel, Dampf beim Treffer — ohne 1.728 Einzelfälle.

## 28.4 Minimales GLB-Format

Zu spezifisch (vermeiden als Pflicht für jedes Teil):

```text
component.glb → root, mount, vfx_origin, energy_input, energy_output, optional_moving_parts
```

Gemeinsames Minimum:

```text
component.glb
├── root
├── mount
└── visual
```

Zusätzliche Anker nur über Metadaten (ohne Blender-Re-Export korrigierbar):

```json
{
  "anchors": {
    "energyInput": [0, 0.2, -0.4],
    "energyOutput": [0, 0.1, 0.5],
    "vfxOrigin": [0, 0.3, 0.6]
  }
}
```

Nur echte bewegliche Einzelteile dürfen eigene GLB-Nodes sein. Dasselbe Modell darf in mehreren Kontexten (Rig, Inventar, Cast) wiederverwendet werden; Anker später im Asset-Editor justieren.

## 28.5 Asset-Pipeline & Kartenartwork

Prinzip:

```text
3D-Master-Asset
→ Kartenbild
→ Inventarbild
→ Spielfeldmodell (Formelgestell)
→ Vorschau
```

Das Modell ist die **gemeinsame Identität**. Kartenartwork ist **keine** neutrale Screenshot-Ableitung. Es braucht:

- eigene Kameraperspektive und übertriebene Perspektive
- Hintergrundeffekte / Reaktionspartikel
- klare Silhouette und starke Lichtsetzung
- optional nachträgliche 2D-Überarbeitung

## 28.6 Laufzeit-Renderer (Match)

Empfohlene Kette:

```text
React
└── FormulaRig (permanent auf dem Playmat)
    └── VisualRecipeInterpreter
        ├── TechniqueBody          (Hauptform)
        ├── EssenceEnergyFlow      (60/40-Gewichtung mit Primär aus Aktion)
        ├── CatalystBehaviourRing
        ├── CastVfx (kurz)
        └── ReactionHitOverlay (kurz dominant)
```

WebP-Snapshots (Kampflog, Sammlung) sind **optional nach** Performance-Messung — nicht parallele MVP-Pipeline.

## 28.7 Rolle von Meshy

Meshy ist **kein** Regellogik- und **kein** Kombinationsgenerator zur Laufzeit.

Meshy liefert wiederverwendbare **Komponenten-Master** (Technik-/Essenz-/Katalysator-Körper), nachdem der Datenvertrag (§28.2) steht — zuerst MVP-9, dann Skala.

Zusätzlich optional: Großformel-Artworks, Charaktere, Marketing — nie „volle Waffenkombi“ als 1.728 Einzelgenerierungen.

---


# 29. Beispielzug

## Ausgangslage

Eigene Formel:

```text
Durchschuss
+ Eingekochte Glut
+ Echo
```

Eigene Hand:

```text
Wasser-Angriff 4
Erde-Block 2
Rostiger Nagel
```

## Startphase

- Formelkomponenten aufrichten.
- keine Statusauslösung.

## Ziehphase

- 1 Karte ziehen.

## Formelphase

Formel aktivieren:

```text
Nächster Angriff:
- ignoriert 1 Schild,
- erhält zusätzlich Feuer,
- Echo wiederholt 1 Schaden.
```

Alle drei Komponenten werden erschöpft.

## Aktionsphase

Wasser-Angriff 4 spielen.

```text
Grundelement: Wasser
Essenz: Feuer
→ direkte Reaktionsmöglichkeit Feuer + Wasser = Dampf
```

Angriff berechnen, Block abwickeln.

Bei erfolgreichem Treffer:

```text
Dampf:
Nebel auf das Ziel

Echo:
zu Beginn des nächsten eigenen Zuges 1 Schaden
```

Die vollständige Formel erhält 1 Fetzladung.

## Endphase

- Handlimit prüfen.
- Zug abgeben.

---

# 30. Designziele für Wiederspielwert

Der Wiederspielwert entsteht aus mehreren gleichzeitig wechselnden Ebenen:

1. Beide Spieler ziehen aus demselben Stapel.
2. Die Verteilung von Angriffen, Blocks, Boosts und Formelkomponenten ist jedes Match anders.
3. Eine Formel kann vollständig oder nur teilweise genutzt werden.
4. Die Reihenfolge der gezogenen Technik, Essenz und Katalysator verändert den Aufbau.
5. Jede Handkarte kann durch eine Formel anders funktionieren.
6. Charakteraffinitäten bewerten dieselbe Karte unterschiedlich.
7. Arenen verändern Prioritäten.
8. Formelkomponenten können gezielt gestört oder zerstört werden.
9. Spieler müssen zwischen Bauen und Aktivieren entscheiden.
10. Spieler müssen zwischen Lebensangriff und Formelherausforderung entscheiden.
11. Reaktionen verändern den Wert fremder Elemente.
12. Großformeln entstehen erst aus erfolgreichem Formelspiel.

---

# 31. Was gegenüber V1/V3 bleibt und was sich ändert

## Bleibt

- 1 gegen 1
- gemeinsamer Kartenstapel
- 20 Leben im ersten Playtest
- Handlimit 6
- Angriffskarten
- Blockkarten
- Boostkarten
- W6-Bonus
- Charaktere
- zwei Charakterelemente
- Passive
- Arenen
- Glitches
- Schild
- Elementimpulse
- Primärmarken
- Elementreaktionen
- Formelkomponenten herausfordern
- eine Hauptaktion pro Zug

## Wird ersetzt

| Bisher | V5 |
|---|---|
| vier frei gebundene Elementkarten | drei feste Formelplätze |
| Träger / Antrieb / Aufsatz | Technik / Essenz / Katalysator |
| Fetzgerät-Ladung | Fetzladung |
| feste Ulti | aufgeladene Großformel |
| drei gleichwertige 3D-Teile nebeneinander | **Formelgestell**: Technik = Hauptform, Essenz/Katalysator transformieren |
| Kombi-IDs hardcoden / 1.728 Meshy-Waffen | **Visual Recipe** aus Eigenschaften + MVP zuerst 3+3+3 |
| allgemeine Bindungsphase | Formelphase |

## Visuell verbindlich (§28)

- Datenvertrag (`TechniqueVisual` / `EssenceVisual` / `CatalystVisual`) **vor** Meshy
- Primär 60–70 % / Sekundär 30–40 % / Reaktion kurz dominant
- GLB-Minimum: `root` / `mount` / `visual` + Anker in Metadaten
- Kein WebP-Sparmodus im MVP

---

# 32. Verbindlicher V5-Kern in einem Satz

> **Spieler ziehen Angriff-, Block-, Boost-, Formel-, Gegenstands- und Glitchkarten aus einem gemeinsamen Stapel, kämpfen in jeder Runde direkt und entscheiden in ihrer Formelphase, ob sie eine aus Technik, Essenz und Katalysator bestehende Engine weiterbauen, verändern oder aktivieren, um ihre normalen Karten in immer neue elementare Skills und schließlich eine charaktereigene Großformel zu verwandeln.**
