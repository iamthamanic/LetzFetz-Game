# Letz Fetz – Effekt-, Status- und Elementreaktionssystem

> **Regelstatus:** Kanonischer V3-Volltext-Dump. Status/Cutover/Konflikte: [`rules/SPIELANLEITUNG_V3_WIP.md`](./rules/SPIELANLEITUNG_V3_WIP.md).  
> **Engine-Default bleibt V1**, bis Cutover. Zielmodell = dieses Dokument 1:1 (nicht soft-layered auf V2 Phrase).

## 1. Systemziel

Letz Fetz verwendet ein einheitliches Effekt- und Reaktionssystem.

Jede Karte oder Fähigkeit kann:

1. einen direkten Effekt ausführen,
2. einen Zustand anwenden,
3. einen Elementimpuls erzeugen,
4. eine Elementreaktion auslösen,
5. auf eine ausgelöste Reaktion reagieren.

Die vollständige Kette lautet:

```text
Karte oder Fähigkeit wird verwendet
→ Kosten bezahlen
→ Angriff, Block oder Aktivierung auflösen
→ direkten Effekt ausführen
→ Elementimpuls ausführen
→ vorhandene Elementmarken prüfen
→ gegebenenfalls eine Reaktion auslösen
→ Reaktionseffekt ausführen
→ Nachtrigger prüfen
```

Eine Aktion kann grundsätzlich höchstens eine Elementreaktion auslösen.

Ultis und Area51-Blueprints dürfen diese Begrenzung ausdrücklich verändern.

---

# 2. Die vier Effektebenen

## 2.1 Direkte Effekte

Direkte Effekte werden sofort ausgeführt und bleiben nicht bestehen.

Beispiele:

* Schaden verursachen
* heilen
* Schild erhalten
* Karten ziehen
* Karten abwerfen
* Ladung erhalten
* Ladung ausgeben
* Würfel neu würfeln
* Würfelergebnisse verändern
* Engine-Teil erschöpfen
* Engine-Teil reparieren
* Status entfernen
* Elementmarke übertragen

## 2.2 Zustände

Zustände bleiben auf einem Charakter oder Fetzgerät-Teil liegen.

Beispiele:

* Brennen
* Gift
* Nebel
* Geblendet
* Verflucht
* High
* Verpeilt
* Erleuchtet

## 2.3 Elementmarken

Elementmarken zeigen an, dass ein Charakter elementar vorbereitet wurde.

Jedes Element besitzt eine primäre Marke:

| Element  | Primäre Marke |
| -------- | ------------- |
| Feuer    | Brennen       |
| Wasser   | Durchnässt    |
| Erde     | High          |
| Luft     | Aufgewirbelt  |
| Licht    | Erleuchtet    |
| Schatten | Verflucht     |

Eine primäre Marke kann gleichzeitig eine eigene Wirkung besitzen.

## 2.4 Elementreaktionen

Eine Elementreaktion entsteht, wenn ein Elementimpuls auf eine bereits vorhandene Elementmarke trifft.

Beispiel:

```text
Das Ziel ist Durchnässt.
Ein Feuerimpuls trifft das Ziel.
→ Feuer + Wasser
→ Dampf
→ Durchnässt wird entfernt.
→ Brennen wird nicht angewendet.
→ Das Ziel erhält Nebel.
```

---

# 3. Elementattribute und Elementimpulse

## 3.1 Elementattribute

Angriffe, Blocks, Charakterfähigkeiten und Fetzgerät-Teile können ein Elementattribut besitzen.

Beispiel:

```text
Frittierfett-Fackel
Angriff 4
Element: Feuer
```

Das Elementattribut allein löst noch keine Reaktion aus.

Es wird benötigt für:

* Charakteraffinitäten
* Engine-Resonanz
* Elementkonter
* Kartensynergien
* Blueprint-Voraussetzungen
* Effekte, die sich auf Elemente beziehen

## 3.2 Elementimpuls

Nur der Schlüsselbegriff `Elementimpuls` kann eine Elementmarke oder Reaktion erzeugen.

Beispiel:

```text
Treffer:
Erzeuge einen Feuerimpuls auf dem Ziel.
```

Ein Feuerangriff ohne Feuerimpuls verursacht normalen Schaden, aber kein Brennen und keine Reaktion.

## 3.3 Abwicklung eines Elementimpulses

### Keine Elementmarke vorhanden

Der Elementimpuls erzeugt die primäre Marke seines Elements.

```text
Feuerimpuls
→ Ziel erhält 1 Brennen.
```

### Passende Elementmarke vorhanden

Es wird die entsprechende Reaktion ausgelöst.

```text
Feuerimpuls auf Durchnässt
→ Dampf
→ Nebel
```

### Mehrere Marken vorhanden

Der aktive Spieler wählt genau eine mögliche Reaktion.

```text
Ziel ist Durchnässt und High.
Ein Feuerimpuls trifft.

Mögliche Reaktionen:
- Feuer + Wasser = Dampf
- Feuer + Erde = Hotbox

Der aktive Spieler wählt eine Reaktion.
```

Nicht gewählte Marken bleiben bestehen.

### Reaktionen sind verpflichtend

Wenn eine passende Elementmarke vorhanden ist, muss eine Reaktion gewählt werden. Der neue Elementimpuls darf nicht stattdessen einfach seine normale Marke anwenden.

---

# 4. Quellen von Effekten und Zuständen

## 4.1 Angriffskarten

Angriffe erzeugen Effekte normalerweise bei einem Treffer.

Ein Angriff trifft, wenn nach allen Blocks und Modifikationen mindestens ein Schaden übrig bleibt.

```text
Frittierfett-Fackel
Feuer · Angriff 3

Treffer:
Erzeuge einen Feuerimpuls.
```

Ein vollständig geblockter Angriff erzeugt keinen Treffereffekt.

## 4.2 Blockkarten

Blocks können Effekte bei Teilblock oder Vollblock auslösen.

### Teilblock

Der Block reduziert den Schaden, aber mindestens ein Schaden bleibt übrig.

### Vollblock

Der endgültige Schaden beträgt null.

```text
Nasse Matratze
Wasser · Block 4

Vollblock:
Erzeuge einen Wasserimpuls auf dem Angreifer.
```

## 4.3 Fetzgerät-Teile

Teile können Effekte besitzen als:

* passive Fähigkeit,
* Aktivierung durch Ladung,
* Treffertrigger,
* Blocktrigger,
* Bau-Trigger,
* Zerstörungs-Trigger,
* Reaktionstrigger.

```text
Illegale Nebeldüse
Aufsatz · Wasser

Aktivieren – 2 Ladungen:
Erzeuge einen Wasserimpuls.
```

## 4.4 Charakterfähigkeiten

Charaktere können:

* bestimmte Zustände leichter erzeugen,
* bestimmte Reaktionen verstärken,
* Status entfernen oder übertragen,
* durch Status Ladung erhalten,
* eine eigene Elementidentität besitzen.

## 4.5 Ultis

Ultis dürfen:

* mehrere Status gleichzeitig anwenden,
* Status detonieren,
* Reaktionen ohne vorherige Marke erzeugen,
* zwei Reaktionen in einer Aktion erlauben,
* Reaktionsregeln vorübergehend verändern.

## 4.6 Transformationen

Transformationen können:

* beim Transformieren einen Impuls erzeugen,
* die primäre Elementmarke eines Charakters verbessern,
* Reaktionsboni freischalten,
* das maximale Statuslimit verändern,
* Ultis elementar modifizieren.

## 4.7 Area51-Blueprints

Blueprints dürfen die normalen Regeln gezielt brechen.

Beispiele:

* eine Reaktion erzeugt ein alternatives Ergebnis,
* eine Reaktion verbraucht ihre Marken nicht,
* zwei Reaktionen dürfen gleichzeitig entstehen,
* eine Reaktion wird auf beide Charaktere übertragen,
* ein Status erhält eine zusätzliche Wirkung.

---

# 5. Verbindliche direkte Effekte

## 5.1 Schaden

```text
Verursache X Schaden.
```

Schaden wird in dieser Reihenfolge reduziert:

1. Blockwert
2. Schild
3. Schadensverhinderung
4. Leben

Direkter Reaktionsschaden kann nur geblockt werden, wenn die Karte dies ausdrücklich erlaubt.

## 5.2 Heilung

```text
Heile X Leben.
```

Heilung kann das maximale Leben nicht überschreiten.

## 5.3 Schild

Schild verhindert späteren Schaden.

```text
Erhalte X Schild.
```

Regeln:

* Ein Schild verhindert einen Schaden.
* Schild wird vor Leben entfernt.
* Maximal fünf Schild gleichzeitig.
* Schild ist kein Block.
* Schild löst keine Vollblockeffekte aus.

## 5.4 Karten ziehen

```text
Ziehe X Karten.
```

## 5.5 Karten abwerfen

```text
Wirf X Karten ab.
```

Bei erzwungenem Abwerfen wählt grundsätzlich der Besitzer der Hand die Karten, sofern der Effekt nichts anderes sagt.

## 5.6 Karten filtern

```text
Ziehe X Karten.
Wirf anschließend X Karten ab.
```

Dies gilt als Kartenfilterung und nicht als zusätzlicher Kartengewinn.

## 5.7 Ladung erhalten

```text
Erhalte X Ladung.
```

Ladung wird auf das angegebene Fetzgerät-Teil oder den gemeinsamen Ladungsbereich gelegt.

## 5.8 Ladung ausgeben

```text
Gib X Ladung aus.
```

Kosten müssen vollständig bezahlt werden, bevor der Effekt beginnt.

## 5.9 Würfel neu würfeln

```text
Würfle einen Würfel neu.
```

Das neue Ergebnis muss normalerweise akzeptiert werden.

## 5.10 Würfel verändern

```text
Erhöhe oder verringere einen Würfel um 1.
```

Ein Würfelergebnis darf die gültigen Grenzen nicht verlassen.

## 5.11 Erschöpfen

```text
Erschöpfe ein Fetzgerät-Teil.
```

Ein erschöpftes Teil:

* kann nicht aktiviert werden,
* erzeugt keine aktiven Trigger,
* behält seine Elemente und Tags,
* richtet sich normalerweise zu Beginn des nächsten eigenen Zuges auf.

## 5.12 Aufrichten

```text
Richte ein erschöpftes Teil auf.
```

## 5.13 Beschädigen

```text
Verursache X Schaden an einem Fetzgerät-Teil.
```

Teileschaden wird von dessen Widerstand abgezogen.

## 5.14 Reparieren

```text
Repariere X Widerstand.
```

Ein zerstörtes Teil kann nur repariert werden, wenn der Effekt ausdrücklich zerstörte Teile reparieren darf.

## 5.15 Status entfernen

```text
Entferne einen negativen Status.
```

Elementmarken zählen nur dann als negative Status, wenn sie in der Statusübersicht so gekennzeichnet sind.

## 5.16 Status übertragen

```text
Verschiebe einen Statusstapel von einem Charakter auf den anderen.
```

Dadurch wird kein neuer Elementimpuls erzeugt.

## 5.17 Status verstärken

```text
Erhöhe einen vorhandenen Status um einen Stapel.
```

Dadurch entsteht keine Elementreaktion.

## 5.18 Status detonieren

```text
Entferne einen Status vollständig.
Erzeuge abhängig von seinen Stapeln einen Effekt.
```

Detonieren ist keine normale Statusentfernung und kann nicht durch Schutz vor Reinigung verhindert werden.

---

# 6. Elementmarken und ihre Grundwirkungen

## 6.1 Feuer – Brennen

Brennen ist stapelbar.

Maximum: drei Stapel.

Wirkung:

> Nachdem der betroffene Charakter eine Hauptaktion vollständig ausgeführt hat, erleidet er einen Schaden und entfernt einen Brennen-Stapel.

Hauptaktionen sind:

* Angriff spielen,
* Block als aktive Aktion spielen,
* Fetzgerät bauen,
* Fetzgerät aktivieren,
* charaktereigene Hauptfähigkeit verwenden.

Reaktionen und passive Trigger zählen nicht als Hauptaktion.

Brennen ist:

* negative Elementmarke,
* Debuff,
* Reaktionsvorbereitung.

## 6.2 Wasser – Durchnässt

Durchnässt ist nicht stapelbar.

Wirkung:

> Keine eigenständige Wirkung. Durchnässt bereitet Wasserreaktionen vor.

Durchnässt ist:

* neutrale Elementmarke,
* Reaktionsvorbereitung.

## 6.3 Erde – High

High ist stapelbar.

Maximum: drei Stapel.

Positive Wirkung:

> Vor einem eigenen Würfelwurf darf einmal pro Würfelwurf ein High-Stapel ausgegeben werden, um einen eigenen Würfel neu zu würfeln.

Das neue Ergebnis muss akzeptiert werden.

Überdosierung:

> Würde ein Charakter einen vierten High-Stapel erhalten, werden alle High-Stapel entfernt. Der Charakter erhält Verpeilt.

High ist:

* gemischter Buff,
* Erde-Marke,
* Reaktionsvorbereitung,
* bewusst riskante Ressource.

## 6.4 Luft – Aufgewirbelt

Aufgewirbelt ist nicht stapelbar.

Wirkung:

> Keine eigenständige Wirkung. Aufgewirbelt bereitet Luftreaktionen vor.

Bestimmte Luftkarten und Engines dürfen Aufgewirbelt zusätzlich als Ressource verbrauchen.

## 6.5 Licht – Erleuchtet

Erleuchtet ist nicht stapelbar.

Wirkung:

> Zu Beginn des eigenen Zuges darf Erleuchtet entfernt werden, um entweder einen negativen Status zu entfernen oder einen Schild zu erhalten.

Erleuchtet ist:

* positiver Status,
* Lichtmarke,
* Reaktionsvorbereitung.

## 6.6 Schatten – Verflucht

Verflucht ist stapelbar.

Maximum: drei Stapel.

Wirkung:

> Beim nächsten Würfelwurf des betroffenen Charakters wird ein Fluch-Stapel entfernt. Der Gegner darf nach dem Wurf einen Würfel um 1 erhöhen oder verringern.

Pro Würfelwurf kann nur ein normaler Fluch-Stapel ausgelöst werden.

Verflucht ist:

* negativer Status,
* Schattenmarke,
* Reaktionsvorbereitung.

---

# 7. Allgemeine Buffs und Debuffs

## 7.1 Nebel

Nebel ist nicht stapelbar.

Wirkung:

> Beim nächsten Angriff oder Block des betroffenen Charakters wird das gedruckte Element der Karte ignoriert. Der sekundäre Karteneffekt wird ebenfalls ignoriert. Danach wird Nebel entfernt.

Der Grundwert bleibt bestehen.

Beispiel:

```text
Feuer-Angriff 4

Treffer:
Erzeuge einen Feuerimpuls.
```

Unter Nebel:

* Angriffswert bleibt 4,
* Angriff zählt nicht als Feuer,
* Feuerimpuls wird nicht ausgelöst,
* Nebel wird entfernt.

## 7.2 Dichter Nebel

Dichter Nebel wird nur durch Ultis oder Area51-Blueprints erzeugt.

Wirkung:

> Wie Nebel. Zusätzlich dürfen bei dieser Aktion keine Würfel neu gewürfelt oder verändert werden.

## 7.3 Verpeilt

Verpeilt ist nicht stapelbar.

Wirkung:

> Der nächste sekundäre Effekt einer eigenen Karte, Charakterfähigkeit oder Engine-Aktivierung wird ignoriert. Danach wird Verpeilt entfernt.

Nicht ignoriert werden:

* Grundschaden,
* Grundblock,
* bezahlte Kosten,
* grundlegender Bau eines Teils.

## 7.4 Geblendet

Geblendet ist nicht stapelbar.

Wirkung:

> Beim nächsten Würfelwurf des betroffenen Charakters dürfen dessen Würfel nicht neu gewürfelt oder verändert werden. Danach wird Geblendet entfernt.

## 7.5 Gift

Gift ist stapelbar.

Maximum: drei Stapel.

Wirkung:

> Am Ende des eigenen Zuges erleidet der betroffene Charakter Schaden in Höhe seiner Giftstapel. Anschließend wird ein Giftstapel entfernt.

Beispiel:

```text
3 Gift
→ 3 Schaden
→ danach verbleiben 2 Gift
```

Gift besitzt kein eigenes Element. Es wird vor allem durch:

* Wasser-Schatten-Reaktionen,
* Chemie-Teile,
* Pilz-Teile,
* Charakterfähigkeiten,
* Blueprints

erzeugt.

## 7.6 Überflutet

Überflutet ist nicht stapelbar.

Wirkung:

> Die nächste eigene Engine-Aktivierung kostet eine zusätzliche Ladung. Danach wird Überflutet entfernt.

Kann die zusätzliche Ladung nicht bezahlt werden, darf das Teil nicht aktiviert werden.

## 7.7 Fokus

Fokus ist ein positiver, nicht stapelbarer Status.

Wirkung:

> Beim nächsten eigenen Würfelwurf darf nach dem Wurf ein Würfel kostenlos neu gewürfelt werden. Danach wird Fokus entfernt.

## 7.8 Ausgeblendet

Ausgeblendet ist nicht stapelbar.

Wirkung:

> Der nächste ausgelöste Charakterpassiv-Effekt wird ignoriert. Danach wird Ausgeblendet entfernt.

Die permanente Grundregel des Charakters bleibt bestehen. Nur der nächste ausgelöste Effekt fällt aus.

---

# 8. Vollständige Elementreaktionsmatrix

Bei sechs Elementen existieren 21 ungeordnete Zweierkombinationen:

* sechs Reaktionen gleicher Elemente,
* 15 Reaktionen unterschiedlicher Elemente.

---

## 8.1 Feuer + Feuer – Inferno

Voraussetzung:

* Ziel besitzt mindestens einen Brennen-Stapel.
* Ziel erhält einen Feuerimpuls.

Wirkung:

1. Entferne alle Brennen-Stapel.
2. Verursache Schaden in Höhe der entfernten Stapel plus eins.

Beispiel:

```text
Ziel besitzt 3 Brennen.
Feuerimpuls trifft.
→ 3 Brennen entfernen
→ 4 direkter Schaden
```

Der Feuerimpuls erzeugt anschließend kein neues Brennen.

Rolle:

* Feuerfinisher,
* Statusdetonation,
* Mono-Feuer-Payoff.

---

## 8.2 Wasser + Wasser – Überflutung

Voraussetzung:

* Ziel ist Durchnässt.
* Ziel erhält einen Wasserimpuls.

Wirkung:

1. Entferne Durchnässt.
2. Das Ziel erhält Überflutet.

Überflutet:

> Die nächste Engine-Aktivierung kostet eine zusätzliche Ladung.

Rolle:

* Engine-Kontrolle,
* Mono-Wasser-Strategie.

---

## 8.3 Erde + Erde – Deep High

Voraussetzung:

* Ziel besitzt mindestens einen High-Stapel.
* Ziel erhält einen Erdeimpuls.

Wirkung:

1. Das vorhandene High wird nicht entfernt.
2. Das Ziel erhält einen zusätzlichen High-Stapel.
3. Der Besitzer zieht eine Karte.
4. Der Besitzer wirft anschließend eine Karte ab.

Wird dadurch ein vierter High-Stapel erzeugt:

1. Alle High-Stapel werden entfernt.
2. Das Ziel erhält Verpeilt.

Rolle:

* Kartenfilterung,
* kontrolliertes Risiko,
* Mono-Erde-Engine.

---

## 8.4 Luft + Luft – Rückenwind

Voraussetzung:

* Ziel ist Aufgewirbelt.
* Ziel erhält einen Luftimpuls.

Wirkung:

1. Entferne Aufgewirbelt.
2. Das Ziel erhält Fokus.
3. Der Besitzer darf ein eigenes erschöpftes Fetzgerät-Teil aufrichten.

Rolle:

* Tempo,
* Wiederverwendung,
* Würfelkontrolle.

---

## 8.5 Licht + Licht – Erleuchtung

Voraussetzung:

* Ziel ist Erleuchtet.
* Ziel erhält einen Lichtimpuls.

Wirkung:

1. Entferne Erleuchtet.
2. Entferne einen negativen Status vom Ziel.
3. Das Ziel erhält einen Schild.

Wenn kein negativer Status vorhanden ist:

> Das Ziel erhält stattdessen zwei Schild.

Rolle:

* Reinigung,
* Schutz,
* Mono-Licht-Stabilität.

---

## 8.6 Schatten + Schatten – Tiefer Fluch

Voraussetzung:

* Ziel ist Verflucht.
* Ziel erhält einen Schattenimpuls.

Wirkung:

1. Der vorhandene Fluch wird nicht entfernt.
2. Das Ziel erhält zwei zusätzliche Fluch-Stapel, maximal drei.

Rolle:

* Würfelkontrolle,
* langfristige Störung,
* Mono-Schatten-Payoff.

---

## 8.7 Feuer + Wasser – Dampf

Mögliche Auslöser:

```text
Feuerimpuls auf Durchnässt
oder
Wasserimpuls auf Brennen
```

Wirkung:

1. Entferne die vorhandene Wasser- oder Feuer-Marke.
2. Der neue Impuls erzeugt keine eigene Marke.
3. Das Ziel erhält Nebel.

Nebel:

> Der nächste Angriff oder Block verliert sein Element und seinen sekundären Effekt.

Rolle:

* Kombinationsunterbrechung,
* taktische Kontrolle,
* Neutralisierung von Feuer und Wasser.

---

## 8.8 Feuer + Erde – Hotbox

Mögliche Auslöser:

```text
Feuerimpuls auf High
oder
Erdeimpuls auf Brennen
```

Wirkung:

1. Entferne eine vorhandene beteiligte Elementmarke.
2. Das Ziel erhält zwei High.
3. Das Ziel erhält Nebel.

Wenn dadurch ein vierter High-Stapel entstehen würde:

1. Alle High-Stapel werden entfernt.
2. Das Ziel erhält Verpeilt.
3. Nebel bleibt bestehen.

Rolle:

* chaotische Kontrolle,
* High-Überdosierung,
* Weed-Identität von Erde.

---

## 8.9 Feuer + Luft – Feuersturm

Mögliche Auslöser:

```text
Feuerimpuls auf Aufgewirbelt
oder
Luftimpuls auf Brennen
```

Wirkung:

1. Entferne die vorhandene beteiligte Marke.
2. Verursache zwei direkten Schaden.
3. Das Ziel erhält einen Brennen-Stapel.

Der neue Brennen-Stapel löst keine weitere Reaktion aus.

Rolle:

* offensiver Elementburst,
* Feuerverbreitung,
* aggressive Misch-Engine.

---

## 8.10 Feuer + Licht – Sonnenbrand

Mögliche Auslöser:

```text
Feuerimpuls auf Erleuchtet
oder
Lichtimpuls auf Brennen
```

Wirkung:

1. Entferne die vorhandene beteiligte Marke.
2. Verursache einen direkten Schaden.
3. Entferne bis zu zwei Schild vom Ziel.
4. Das Ziel erhält Geblendet.

Rolle:

* Anti-Schild,
* Anti-Licht,
* Würfelkontrolle.

---

## 8.11 Feuer + Schatten – Hexenbrand

Mögliche Auslöser:

```text
Feuerimpuls auf Verflucht
oder
Schattenimpuls auf Brennen
```

Wirkung:

1. Entferne eine vorhandene beteiligte Marke.
2. Das Ziel erhält einen Brennen-Stapel.
3. Das Ziel erhält einen Fluch-Stapel.

Die neu angewendeten Status lösen keine weitere Reaktion aus.

Rolle:

* Druck über mehrere Züge,
* Schaden plus Würfelstörung.

---

## 8.12 Wasser + Erde – Kräutersud

Mögliche Auslöser:

```text
Wasserimpuls auf High
oder
Erdeimpuls auf Durchnässt
```

Wirkung:

1. Entferne die vorhandene beteiligte Marke.
2. Heile das Ziel um ein Leben.
3. Entferne einen negativen Status vom Ziel.
4. Das Ziel erhält einen High-Stapel.

Rolle:

* Heilung mit Nebenwirkung,
* Erde-Wasser-Support,
* kontrollierter Aufbau von High.

Alternative Kartenbezeichnung im absurderen Letz-Fetz-Stil:

```text
Bongwasser
```

Der offizielle Reaktionsname kann trotzdem Kräutersud bleiben.

---

## 8.13 Wasser + Luft – Wirbel

Mögliche Auslöser:

```text
Wasserimpuls auf Aufgewirbelt
oder
Luftimpuls auf Durchnässt
```

Wirkung:

1. Entferne die vorhandene beteiligte Marke.
2. Erschöpfe ein Fetzgerät-Teil des Ziels.

Besitzt das Ziel kein aufgerichtetes Fetzgerät-Teil:

> Das Ziel wirft stattdessen eine Karte ab.

Rolle:

* Engine-Kontrolle,
* Tempobremse.

---

## 8.14 Wasser + Licht – Prisma

Mögliche Auslöser:

```text
Wasserimpuls auf Erleuchtet
oder
Lichtimpuls auf Durchnässt
```

Wirkung:

1. Entferne die vorhandene beteiligte Marke.
2. Entferne einen negativen Status vom Ziel.
3. Das Ziel erhält zwei Schild.

Wenn kein negativer Status vorhanden ist:

> Das Ziel erhält drei Schild statt zwei.

Rolle:

* starke defensive Reaktion,
* Support,
* Statusreinigung.

---

## 8.15 Wasser + Schatten – Giftbrühe

Mögliche Auslöser:

```text
Wasserimpuls auf Verflucht
oder
Schattenimpuls auf Durchnässt
```

Wirkung:

1. Entferne die vorhandene beteiligte Marke.
2. Das Ziel erhält einen Gift-Stapel.
3. Das Ziel wirft eine Karte ab, wenn es bereits vergiftet war.

Rolle:

* langfristiger Schaden,
* Ressourcenverschleiß.

---

## 8.16 Erde + Luft – Pollenflug

Mögliche Auslöser:

```text
Erdeimpuls auf Aufgewirbelt
oder
Luftimpuls auf High
```

Wirkung:

1. Entferne die vorhandene beteiligte Marke.
2. Beide Charaktere erhalten einen High-Stapel.
3. Das Ziel erhält Geblendet.

Wird bei einem Charakter dadurch ein vierter High-Stapel erzeugt:

> Dieser Charakter wird Verpeilt.

Rolle:

* chaotische globale Reaktion,
* High-Verteilung,
* Würfelkontrolle.

---

## 8.17 Erde + Licht – Growlight

Mögliche Auslöser:

```text
Erdeimpuls auf Erleuchtet
oder
Lichtimpuls auf High
```

Wirkung:

1. Entferne die vorhandene beteiligte Marke.
2. Das Ziel heilt ein Leben.
3. Das Ziel erhält einen Schild.
4. Das Ziel erhält einen High-Stapel.

Rolle:

* Erde-Support,
* kontrollierter Aufbau,
* defensive Weed-Engine.

---

## 8.18 Erde + Schatten – Paranoia

Mögliche Auslöser:

```text
Erdeimpuls auf Verflucht
oder
Schattenimpuls auf High
```

Wirkung:

1. Entferne die beteiligte vorhandene Marke.
2. Entferne alle High-Stapel vom Ziel.
3. Das Ziel erhält Fluch-Stapel in Höhe der entfernten High-Stapel plus eins.
4. Maximal drei Fluch-Stapel.

Beispiel:

```text
Ziel besitzt 2 High.
Schattenimpuls trifft.
→ 2 High entfernen
→ 3 Verflucht
```

Rolle:

* Konter gegen Erde,
* Umwandlung eines Buffs in einen Debuff,
* starke Schattenkontrolle.

---

## 8.19 Luft + Licht – Blendwerk

Mögliche Auslöser:

```text
Luftimpuls auf Erleuchtet
oder
Lichtimpuls auf Aufgewirbelt
```

Wirkung:

1. Entferne die vorhandene beteiligte Marke.
2. Das Ziel erhält Geblendet.
3. Der Auslöser erhält Fokus.

Rolle:

* Würfelkontrolle,
* Tempo,
* offensiver Licht-Luft-Stil.

---

## 8.20 Luft + Schatten – Flüstersturm

Mögliche Auslöser:

```text
Luftimpuls auf Verflucht
oder
Schattenimpuls auf Aufgewirbelt
```

Wirkung:

1. Entferne die vorhandene beteiligte Marke.
2. Das Ziel wirft eine Karte ab.
3. Das Ziel erhält einen Fluch-Stapel.

Rolle:

* Handkontrolle,
* psychologischer Druck,
* Schatten-Luft-Störung.

---

## 8.21 Licht + Schatten – Finsternis

Mögliche Auslöser:

```text
Lichtimpuls auf Verflucht
oder
Schattenimpuls auf Erleuchtet
```

Wirkung:

1. Entferne die vorhandene beteiligte Marke.
2. Das Ziel erhält Ausgeblendet.
3. Schild kann bis zum Ende der aktuellen Aktion nicht erzeugt werden.

Ausgeblendet:

> Der nächste Charakterpassiv-Trigger wird ignoriert.

Rolle:

* Charakterkontrolle,
* Anti-Support,
* Neutralisierung gegensätzlicher Elemente.

---

# 9. Übersicht aller Reaktionen

| Kombination         | Reaktion     | Hauptwirkung                  |
| ------------------- | ------------ | ----------------------------- |
| Feuer + Feuer       | Inferno      | Brennen detonieren            |
| Wasser + Wasser     | Überflutung  | Engine-Aktivierung verteuern  |
| Erde + Erde         | Deep High    | High und Kartenfilterung      |
| Luft + Luft         | Rückenwind   | Fokus und Teil aufrichten     |
| Licht + Licht       | Erleuchtung  | Reinigung und Schild          |
| Schatten + Schatten | Tiefer Fluch | Fluch stark erhöhen           |
| Feuer + Wasser      | Dampf        | Nebel                         |
| Feuer + Erde        | Hotbox       | High und Nebel                |
| Feuer + Luft        | Feuersturm   | Direktschaden und Brennen     |
| Feuer + Licht       | Sonnenbrand  | Schild entfernen und blenden  |
| Feuer + Schatten    | Hexenbrand   | Brennen und Fluch             |
| Wasser + Erde       | Kräutersud   | Heilung, Reinigung und High   |
| Wasser + Luft       | Wirbel       | Engine-Teil erschöpfen        |
| Wasser + Licht      | Prisma       | Reinigung und Schild          |
| Wasser + Schatten   | Giftbrühe    | Gift und Kartenverlust        |
| Erde + Luft         | Pollenflug   | High für beide und Geblendet  |
| Erde + Licht        | Growlight    | Heilung, Schild und High      |
| Erde + Schatten     | Paranoia     | High in Flüche umwandeln      |
| Luft + Licht        | Blendwerk    | Geblendet und Fokus           |
| Luft + Schatten     | Flüstersturm | Abwerfen und Fluch            |
| Licht + Schatten    | Finsternis   | Charakterpassive unterbrechen |

---

# 10. Angriffssystem

Angriffskarten können drei Formen besitzen.

## 10.1 Normaler Angriff

```text
Angriff 4
```

Nur Schaden.

## 10.2 Statusangriff

```text
Angriff 3

Treffer:
Das Ziel erhält einen Gift-Stapel.
```

Der Status entsteht unabhängig von Elementreaktionen.

## 10.3 Elementangriff

```text
Feuer · Angriff 3

Treffer:
Erzeuge einen Feuerimpuls.
```

Der Impuls erzeugt Brennen oder eine Reaktion.

## 10.4 Reaktionsangriff

```text
Feuer · Angriff 3

Treffer:
Erzeuge einen Feuerimpuls.

Reaktion:
Falls dadurch Dampf ausgelöst wird,
erhält das Ziel stattdessen Dichten Nebel.
```

Reaktionsangriffe verändern gezielt eine bestimmte Reaktion.

---

# 11. Blocksystem

## 11.1 Normaler Block

```text
Block 4
```

Nur Schadensverhinderung.

## 11.2 Vollblock-Effekt

```text
Wasser · Block 4

Vollblock:
Erzeuge einen Wasserimpuls auf dem Angreifer.
```

## 11.3 Teilblock-Effekt

```text
Schatten · Block 3

Teilblock:
Der Angreifer erhält einen Fluch-Stapel.
```

## 11.4 Reaktionsblock

```text
Licht · Block 4

Vollblock:
Erzeuge einen Lichtimpuls.

Reaktion:
Falls Prisma entsteht,
erhalte einen zusätzlichen Schild.
```

---

# 12. Fetzgerät-System

Das Fetzgerät besitzt:

1. Träger,
2. Antrieb,
3. Aufsatz.

## 12.1 Träger

Verbindet das Fetzgerät mit einer Kampfaktion.

Beispiel:

```text
Frittierfett-Ramme
Träger · Feuer

Wenn dein Angriff trifft:
Du darfst eine Ladung ausgeben,
um einen Feuerimpuls zu erzeugen.
```

## 12.2 Antrieb

Erzeugt Ladung durch bestimmte Ereignisse.

```text
Bongturbine
Antrieb · Erde

Einmal pro Zug:
Wenn du High ausgibst oder erhältst,
erhalte eine Ladung.
```

## 12.3 Aufsatz

Verbraucht Ladung für einen größeren Effekt.

```text
Illegale Nebelkanone
Aufsatz · Wasser

Aktivieren – 3 Ladungen:
Erzeuge einen Wasserimpuls.
Falls Dampf entsteht,
erzeuge Dichten Nebel statt Nebel.
```

---

# 13. Elementresonanz des Fetzgeräts

## Ein Teil eines Elements

Kein Resonanzbonus.

## Zwei Teile desselben Elements

Kleine Resonanz.

Beispiele:

| Element  | Zwei-Teile-Resonanz                                                              |
| -------- | -------------------------------------------------------------------------------- |
| Feuer    | Erster Brennen-Stapel pro Runde verursacht sofort einen Schaden                  |
| Wasser   | Erste Wasserreaktion pro Runde erzeugt eine Ladung                               |
| Erde     | Erstes ausgegebenes High pro Zug erzeugt eine Ladung                             |
| Luft     | Erstes erschöpftes eigenes Teil pro Runde darf sofort wieder aufgerichtet werden |
| Licht    | Erste Reinigung pro Runde erzeugt einen Schild                                   |
| Schatten | Erster angewendeter Fluch pro Runde darf auf zwei Stapel erhöht werden           |

## Drei Teile desselben Elements

Volle Resonanz.

Beispiele:

| Element  | Volle Resonanz                                            |
| -------- | --------------------------------------------------------- |
| Feuer    | Inferno verursacht einen zusätzlichen Schaden             |
| Wasser   | Überflutet erhöht die Kosten um zwei Ladungen statt einer |
| Erde     | Deep High zieht zwei Karten und wirft nur eine ab         |
| Luft     | Rückenwind richtet bis zu zwei Teile auf                  |
| Licht    | Erleuchtung entfernt bis zu zwei negative Status          |
| Schatten | Tiefer Fluch kann das Maximum einmalig auf vier erhöhen   |

Volle Resonanzen dürfen höchstens einmal pro Runde ausgelöst werden.

---

# 14. Ultis

Eine Ulti bleibt charaktergebunden.

Die Engine kann die Ulti modifizieren, aber nicht vollständig ersetzen.

## Mögliche Ulti-Effekte

### Status verteilen

```text
Füge 2 Brennen und 1 Verflucht zu.
```

### Status detonieren

```text
Entferne alle negativen Status vom Gegner.
Verursache für jeden entfernten Status einen Schaden.
```

### Reaktionen auslösen

```text
Wähle eine Elementmarke auf dem Gegner.
Löse mit einem Element deiner Engine eine Reaktion aus.
```

### Reaktionslimit verändern

```text
Diese Aktion kann zwei Elementreaktionen auslösen.
```

### Marken schützen

```text
Die erste verwendete Elementmarke wird durch diese Ulti nicht entfernt.
```

### Reaktionen kopieren

```text
Wenn eine Reaktion ausgelöst wird,
wiederhole ihren direkten Effekt einmal.
```

---

# 15. Transformationen

Die Transformation stellt die Verbindung zwischen Charakter und Fetzgerät dar.

Mögliche Voraussetzung:

* drei Fetzgerät-Teile gebaut,
* mindestens eine passende Teileverbindung,
* Fetzleiste vollständig,
* mindestens eine Reaktion ausgelöst.

Nach der Transformation:

* Charakterpassive wird verbessert,
* Ulti erhält einen Engine-Modifikator,
* eine bestimmte Reaktion wird verstärkt,
* ein Statuslimit kann verändert werden.

Beispiel Erde-Transformation:

```text
Einmal pro Zug:
Wenn du High ausgibst,
erhalte eine Ladung.

Du wirst erst beim fünften High statt beim vierten High Verpeilt.
```

---

# 16. Area51-Blueprints

Area51-Blueprints sind seltene Spezialkombinationen bestimmter:

* Teiltypen,
* Schrott-Tags,
* Elemente,
* Anschlussarten.

Sie erzeugen keine gewöhnlichen Zahlenboni, sondern verändern Regeln.

## Mögliche Blueprint-Effekte

### Reaktionsmutation

```text
Wenn Dampf ausgelöst wird,
entsteht Dichter Nebel statt Nebel.
```

### Markenerhalt

```text
Wenn Hotbox ausgelöst wird,
wird die vorhandene High-Marke nicht entfernt.
```

### Doppelreaktion

```text
Einmal pro Runde darf eine Aktion
zwei verschiedene Reaktionen auslösen.
```

### Reaktionsweiterleitung

```text
Wenn Pollenflug ausgelöst wird,
erhält auch jedes Fetzgerät-Teil einen Sporenmarker.
```

### Detonation

```text
Wenn Paranoia drei Flüche erzeugt,
verursache zusätzlich zwei Schaden.
```

### Globale Reaktion

```text
Wenn Hotbox ausgelöst wird,
erhalten beide Charaktere Nebel und High.
```

Blueprints dürfen das normale Reaktionslimit nur ausdrücklich und begrenzt durchbrechen.

---

# 17. Timing-Reihenfolge

Eine Kampfaktion wird in dieser Reihenfolge abgewickelt:

1. Karte oder Fähigkeit ankündigen
2. Ziel bestimmen
3. Kosten bezahlen
4. Vor-Kampf-Effekte ausführen
5. Würfel werfen
6. Würfel verändern
7. Block spielen
8. Blockwert berechnen
9. Schaden berechnen
10. Schild verwenden
11. Treffer oder Vollblock feststellen
12. direkten Treffer- oder Blockeffekt ausführen
13. Elementimpuls erzeugen
14. Elementmarken prüfen
15. genau eine Reaktion auswählen
16. verwendete Marke entfernen
17. Reaktion ausführen
18. neue Status anwenden
19. Charaktertrigger prüfen
20. Engine-Trigger prüfen
21. Blueprint-Trigger prüfen
22. Besiegten Charakter prüfen

---

# 18. Konfliktregeln

## Geblendet und Fokus

Geblendet verhindert sämtliche Würfelmanipulation.

Fokus wird nicht verbraucht und bleibt für den nächsten zulässigen Würfelwurf erhalten.

## Nebel und Elementimpuls

Nebel entfernt das Element der nächsten Angriffs- oder Blockkarte.

Ein darauf gedruckter Elementimpuls wird daher ebenfalls ignoriert.

## Verpeilt und Grundeffekte

Verpeilt verhindert nur den sekundären Effekt.

Beispiel:

```text
Angriff 4
Treffer: Erzeuge Feuerimpuls.
```

Unter Verpeilt:

* vier Angriff bleiben,
* Feuerimpuls fällt aus,
* Verpeilt wird entfernt.

## Mehrere Status am Zugende

Zugende-Effekte werden in dieser Reihenfolge ausgeführt:

1. Brennen
2. Gift
3. Heilung und Regeneration
4. Kartenabwurf
5. Statusabbau

## Mehrere mögliche Reaktionen

Der aktive Spieler wählt eine.

## Durch Reaktionen erzeugte Marken

Status und Marken, die als Reaktionsergebnis entstehen, lösen keine weitere Reaktion aus.

---

# 19. Balancegrenzen

## Statusgrenzen

* maximal drei Brennen,
* maximal drei High,
* maximal drei Gift,
* maximal drei Flüche,
* maximal fünf Schild,
* alle anderen Status maximal einmal.

## Reaktionsgrenze

Eine Aktion erzeugt maximal eine Reaktion.

## Triggergrenze

Ein identischer passiver Trigger darf standardmäßig nur einmal pro Aktion ausgelöst werden.

## Kein Kreislauf

Ladungsausgabe darf nicht unmittelbar unbegrenzt neue Ladung erzeugen.

## Kein kompletter Zugverlust

Normale Karten dürfen nicht:

* einen vollständigen Zug überspringen,
* sämtliche Engine-Teile dauerhaft deaktivieren,
* alle Handkarten entfernen,
* Transformation dauerhaft verhindern.

Solche Effekte dürfen auch bei Ultis nur eingeschränkt auftreten.

## Kein automatischer Elementimpuls

Nicht jede Karte eines Elements erzeugt automatisch eine Elementmarke.

Dadurch bleiben Status und Reaktionen besondere Entscheidungen.

---

# 20. Gesamtsystem

```text
Charakter
├── Passive
├── Signaturfähigkeit
├── Ulti
├── Transformation
└── Elementaffinitäten

Kampf
├── Angriffe
├── Blocks
├── Würfel
├── direkter Schaden
└── Treffer- und Vollblocktrigger

Fetzgerät
├── Träger
├── Antrieb
├── Aufsatz
├── Ladung
├── Teileverbindungen
└── Elementresonanz

Statussystem
├── Buffs
├── Debuffs
├── Elementmarken
├── stapelbare Zustände
└── einmalige Zustände

Elementreaktionen
├── sechs gleiche Elementkombinationen
├── 15 gemischte Elementkombinationen
├── maximal eine Reaktion pro Aktion
└── verpflichtende Reaktion bei vorhandener Marke

Area51-Blueprints
├── Spezialkombinationen
├── alternative Reaktionsergebnisse
├── Markenerhalt
├── Doppelreaktionen
└── Regelveränderungen
```

Der Kern des Systems lautet:

> Karten und Teile erzeugen Effekte. Bestimmte Effekte erzeugen Elementimpulse. Elementimpulse erzeugen Marken oder reagieren mit bereits vorhandenen Marken. Charaktere, Fetzgeräte, Ultis und Area51-Blueprints verändern, wie diese Reaktionen aufgebaut und genutzt werden.
