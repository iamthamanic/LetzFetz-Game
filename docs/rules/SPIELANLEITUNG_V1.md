# Letz Fetz — Spielanleitung V1

> **Status:** Verbindliches Regelwerk für physisches Spiel und aktuelle Rules Engine (`src/game/`), bis V2 freigegeben ist.  
> **Redesign (WIP):** [`SPIELANLEITUNG_V2_WIP.md`](./SPIELANLEITUNG_V2_WIP.md)  
> **Produktname:** Letz Fetz (nicht „Lets Fetz“)

---

## 1. Spielidee

Letz Fetz ist ein taktisches 1-gegen-1-Kartenduell.

Jeder Spieler spielt einen Charakter mit 2 Elementen, einer passiven Fähigkeit und einer einmaligen Ultimativkarte.

**Das Ziel ist:** Reduziere den Gegner von 20 Leben auf 0 Leben.

Jede Elementkarte kann auf drei Arten benutzt werden:

- **Sofort spielen** als Angriff, Block oder Boost.
- **Binden** als dauerhafte Karte in deiner Auslage.
- **Abwerfen** als Kosten für Aktivierungen.

Angriffe und Blocks haben feste Kartenwerte, bekommen aber zusätzlich einen kleinen Würfelbonus. Dadurch bleiben Karten planbar, aber Kämpfe bekommen Spannung.

## 2. Spielmaterial

### Enthalten

- 7 Charakterkarten
- 7 Ultimativkarten
- 6 Arenakarten
- 60 Elementkarten
- 10 Glitchkarten
- 2 W20-Würfel als Lebenszähler
- 1 W6-Würfel für Kampfbonus und manche Arenen

### Lebenspunkte

- Jeder Spieler startet mit **20 Leben**.
- Ein Spieler kann nie mehr als 20 Leben haben.
- Wenn ein Spieler auf 0 Leben oder weniger fällt, verliert er sofort.

## 3. Kartenarten

### 3.1 Charakterkarten

Jede Charakterkarte zeigt:

- Name
- 2 Elemente
- passive Fähigkeit
- passende Ultimativkarte
- Rolle / Spielstil
- Startleben: 20

### 3.2 Ultimativkarten

Jeder Charakter hat eine eigene Ultimativkarte.

Eine Ultimativkarte:

- darf nur **einmal pro Spiel** gespielt werden
- zählt als **Hauptaktion**
- wird nach Benutzung **umgedreht**
- kann **nicht normal geblockt** werden
- ist **kein Angriff**, außer sie sagt ausdrücklich „Angriff“

### 3.3 Elementkarten

Jede Elementkarte zeigt:

- Element
- Zahl
- Typ: Angriff, Block oder Boost
- Soforteffekt
- gebundener Effekt
- Widerstandswert

**Elemente:** Feuer, Wasser, Erde, Luft, Schatten, Licht

### 3.4 Glitchkarten

Glitchkarten sind Stör- und Chaoskarten.

Es gibt zwei Arten:

- **spielbare Glitches**
- **Sofort-Glitches**

Sofort-Glitches werden sofort ausgeführt, wenn sie gezogen werden.

### 3.5 Arenakarten

Eine Arena verändert die Spielregeln für beide Spieler.

Es liegt immer genau **1 Arena** offen in der Mitte.

## 4. Grundbegriffe

| Begriff | Bedeutung |
|---------|-----------|
| **Hand** | Karten auf deiner Hand. |
| **Deck** | Gemeinsamer Nachziehstapel. |
| **Ablagestapel** | Dorthin kommen gespielte, abgeworfene und zerstörte Karten. |
| **Binden** | Lege eine Elementkarte offen vor dich. Diese Karte ist jetzt eine **gebundene Karte**. |
| **Gebundene Karte** | Eine offen vor dir liegende Elementkarte. Sie zählt für Element-Synergien, kann aktiviert werden, kann vom Gegner herausgefordert werden, hat Widerstand in Höhe ihrer Zahl und zählt gegen dein Limit von maximal 4 gebundenen Karten. |
| **Widerstand** | Der Widerstand einer gebundenen Karte entspricht ihrer Zahl. Beispiel: Eine gebundene Feuer 5 Boost hat Widerstand 5. |
| **Erschöpfen** | Drehe eine gebundene Karte quer. Eine erschöpfte Karte zählt weiterhin für Element-Synergien und gegen dein Limit, kann nicht aktiviert werden und wird am Anfang deines nächsten Zuges wieder aufrecht gedreht. |
| **Aktivieren** | Nutze den Effekt einer gebundenen Karte. **Kosten:** Wirf 1 Handkarte ab, erschöpfe die gebundene Karte, führe den gebundenen Effekt aus. Aktivieren zählt als Hauptaktion. |
| **Herausfordern** | Du greifst eine gebundene Karte des Gegners an, statt den Gegner direkt anzugreifen. |

## 5. Spielaufbau

1. Jeder Spieler wählt oder zieht zufällig 1 Charakterkarte.
2. Jeder Spieler nimmt die passende Ultimativkarte und legt sie offen neben seinen Charakter.
3. Jeder Spieler stellt seinen W20 auf **20 Leben**.
4. Mischt alle **70 Hauptkarten** zu einem gemeinsamen Deck.
5. Der Startspieler wird zufällig bestimmt.
6. Der Startspieler zieht **5 Karten**.
7. Der zweite Spieler zieht **6 Karten**.
8. Eine Arena wird zufällig gezogen und offen in die Mitte gelegt.
9. Falls die Arena einen W6-Startwurf verlangt, wird jetzt gewürfelt.
10. Der Startspieler beginnt.

## 6. Zugablauf

Ein Zug besteht immer aus **5 Phasen**.

### Phase 1: Startphase

- Stelle alle deine erschöpften gebundenen Karten wieder aufrecht.
- Führe Effekte aus, die „am Anfang deines Zuges“ sagen.

### Phase 2: Ziehphase

- Ziehe **1 Karte**.
- Wenn du einen **Sofort-Glitch** ziehst:
  - Zeige ihn sofort.
  - Führe ihn aus.
  - Lege ihn auf den Ablagestapel.
  - Ziehe **keine Ersatzkarte**, außer der Glitch sagt es ausdrücklich.

### Phase 3: Bindungsphase

- Du darfst genau **1 Elementkarte** aus deiner Hand binden.
- Du darfst maximal **4 gebundene Karten** haben.
- Wenn du bereits 4 gebundene Karten hast und eine neue binden willst, musst du zuerst 1 eigene gebundene Karte abwerfen.

### Phase 4: Aktionsphase

Du darfst genau **1 Hauptaktion** ausführen. Wähle eine:

- Angriff spielen
- Boost spielen
- Gebundene Karte aktivieren
- Gegnerische gebundene Karte herausfordern
- 1 Karte abwerfen und 2 Karten ziehen
- Ultimativkarte spielen

### Phase 5: Endphase

- Prüfe dein Handlimit. Du darfst maximal **6 Handkarten** behalten.
- Wirf überschüssige Karten ab.
- Effekte „bis Ende des Zuges“ enden.
- Gegner ist dran.

## 7. Würfelbonus im Kampf

Angriffskarten und Blockkarten haben feste Kartenwerte.

Zusätzlich wird beim Spielen einer Angriffskarte oder Blockkarte **1W6** gewürfelt.

### Würfelbonus-Tabelle

| W6-Wurf | Bonus |
|---------|-------|
| 1–2 | +0 |
| 3–4 | +1 |
| 5–6 | +2 |

### Kampfwert-Formel

**Kampfwert = Kartenwert + Würfelbonus + alle weiteren Boni**

Der Würfelbonus gilt nur für:

- Angriffskarten
- Blockkarten

Der Würfelbonus gilt **nicht** für:

- Boostkarten
- gebundene Aktivierungen
- Ultimativkarten
- Glitches
- Heilungseffekte
- Arenaeffekte ohne Angriff/Block

## 8. Hauptaktionen

### 8.1 Angriff spielen

Spiele 1 Angriffskarte aus deiner Hand. Dann:

1. Würfle 1W6.
2. Ermittle den Würfelbonus.
3. Addiere Kartenwert + Würfelbonus + weitere Boni.
4. Der Gegner darf genau 1 Blockkarte spielen.
5. Falls der Gegner blockt, berechnet er seinen Blockwert.
6. **Schaden = Angriffswert − Blockwert.**
7. Wenn das Ergebnis 0 oder niedriger ist, entsteht kein Schaden.

#### Beispiel Angriff

Du spielst **Feuer 4 Angriff**.

- Du würfelst eine **5** → Würfelbonus: **+2**.
- Dein Charakter hat Feuer als Element: **+1**.
- Du hast 2 Feuer gebunden und darfst deinen Angriffswurf wiederholen, entscheidest dich aber dagegen.

**Rechnung (Angriff):**

- Kartenwert 4
- Würfelbonus +2
- eigenes Element +1
- **Gesamt: 7 Angriff**

Der Gegner spielt **Wasser 4 Block**.

- Er würfelt eine **3** → Würfelbonus: **+1**.
- Sein Charakter hat Wasser als Element: **+1**.

**Rechnung (Block):**

- Kartenwert 4
- Würfelbonus +1
- eigenes Element +1
- **Gesamt: 6 Block**

**Schaden: 7 − 6 = 1 Schaden**

### 8.2 Boost spielen

- Spiele 1 Boostkarte aus deiner Hand und führe ihren Boost-Effekt aus.
- Boosts **würfeln nicht**.
- Boosts sind **keine Angriffe**.
- Boost-Schaden kann **nicht** mit Blockkarten geblockt werden.

### 8.3 Gebundene Karte aktivieren

Wähle 1 **nicht erschöpfte** gebundene Karte. Dann:

1. Wirf 1 Handkarte ab.
2. Erschöpfe die gebundene Karte.
3. Führe den gebundenen Effekt ihres Elements aus.

Aktivieren zählt als Hauptaktion.

### 8.4 Herausfordern

Du greifst eine gebundene Karte des Gegners an.

**Ablauf:**

1. Wähle 1 gegnerische gebundene Karte.
2. Spiele 1 Angriffskarte.
3. Würfle 1W6 für deinen Angriff.
4. Berechne deinen Angriffswert.
5. Der Gegner darf 1 Blockkarte spielen.
6. Falls der Gegner blockt, würfelt er 1W6 für seinen Block.
7. Berechne den **Zielwert:** Zielwert = Widerstand der Zielkarte + Blockwert + Widerstandsboni
8. Wenn dein Angriffswert **höher** ist als der Zielwert, wird die gebundene Karte **zerstört**.
9. Bei **Gleichstand** überlebt sie.
10. Herausfordern verursacht **keinen Schaden am Gegner**, außer ein Effekt sagt es ausdrücklich.

#### Beispiel Herausfordern

Der Gegner hat **Wasser 3 Boost** gebunden.

Du spielst **Schatten 4 Angriff**.

- Du würfelst eine **6** → Würfelbonus: **+2**.
- Dein Charakter hat Schatten: **+1**.

**Rechnung Angriff:**

- Kartenwert 4
- Würfelbonus +2
- eigenes Element +1
- **Gesamt: 7 Angriff**

Der Gegner blockt mit **Licht 2 Block**.

- Er würfelt eine **4** → Würfelbonus: **+1**.
- Blockwert: 2 + 1 = **3**

**Zielwert:**

- gebundene Karte Widerstand 3
- Block 3
- **Gesamt: 6 Zielwert**

Dein Angriff 7 ist höher als 6. Die gebundene Wasserkarte wird zerstört.

### 8.5 1 Karte abwerfen und 2 Karten ziehen

- Wirf 1 Handkarte ab und ziehe 2 Karten.
- Diese Aktion zählt als Hauptaktion.
- Diese Aktion hilft, wenn deine Hand schlecht ist.

### 8.6 Ultimativkarte spielen

Spiele deine Ultimativkarte.

Eine Ultimativkarte:

- zählt als Hauptaktion
- wird danach umgedreht
- kann nur einmal pro Spiel benutzt werden
- ist kein Angriff, außer sie sagt ausdrücklich „Angriff“
- kann nicht normal geblockt werden

## 9. Elementregeln

### 9.1 Charakterelement-Bonus

Wenn du eine Karte spielst, deren Element zu deinem Charakter gehört, erhält sie **+1 Stärke**.

Das gilt für:

- Angriffskarten
- Blockkarten
- Boostkarten mit Zahlenwert
- Herausfordern

Es gilt **nicht** für reine Texteffekte ohne Zahlenwert.

### 9.2 Konter-System

Wenn ein Angriff durch eine Blockkarte geblockt wird, prüft ihr das Element der Angriffskarte und das Element der Blockkarte.

**Konter:**

| Angriff kontert |
|-----------------|
| Feuer kontert Erde |
| Wasser kontert Feuer |
| Erde kontert Luft |
| Luft kontert Licht |
| Schatten kontert Wasser |
| Licht kontert Schatten |

Wenn das Angriffselement das Blockelement kontert, bekommt der Angriff **+1**.

Konter gelten nur bei **Angriff gegen Block**.

Konter gelten **nicht** bei:

- Boosts
- Ultimativkarten
- gebundenen Aktivierungen
- Glitches

### 9.3 Konter beim Herausfordern

Wenn du eine gebundene Karte herausforderst, prüfe das Element deiner Angriffskarte gegen das Element der Zielkarte.

Wenn dein Angriffselement das Element der Zielkarte kontert, bekommst du **+1 Angriff**.

Dieser Bonus gilt zusätzlich zu anderen Boni.

## 10. Gebundene Karten

### 10.1 Limit

Jeder Spieler darf maximal **4 gebundene Karten** haben.

### 10.2 Widerstand

Eine gebundene Karte hat Widerstand in Höhe ihrer Zahl.

### 10.3 Aktivierungseffekte nach Element

Der Typ der gebundenen Karte ist egal. **Nur das Element zählt.**

| Element | Aktivieren |
|---------|------------|
| **Feuer** | Füge dem Gegner 2 Schaden zu. |
| **Wasser** | Heile 2 Leben. |
| **Erde** | Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand. |
| **Luft** | Ziehe 2 Karten und wirf danach 1 Karte ab. |
| **Schatten** | Erschöpfe 1 gegnerische gebundene Karte. |
| **Licht** | Ziehe 1 Karte und heile 1 Leben. |

## 11. Element-Synergien

Element-Synergien entstehen durch gebundene Karten.

- Es zählen nur deine **eigenen** gebundenen Karten.
- **Erschöpfte Karten** zählen weiterhin für Element-Synergien.

### Feuer

Feuer steht für Angriffswucht und Würfelkontrolle.

**2 Feuer gebunden:** Einmal pro Zug darfst du deinen Angriffswurf wiederholen. Das neue Ergebnis zählt.

**3 Feuer gebunden:** Wenn dein Angriffswurf eine 5 oder 6 zeigt, füge nach der Schadensabrechnung zusätzlich 1 Schaden zu. Dieser Zusatzschaden passiert nur, wenn der Angriff mindestens 1 Schaden verursacht hat.

### Wasser

Wasser steht für Block, Heilung und defensive Würfelkontrolle.

**2 Wasser gebunden:** Einmal pro gegnerischem Zug darfst du deinen Blockwurf wiederholen. Das neue Ergebnis zählt.

**3 Wasser gebunden:** Wenn dein Blockwurf eine 5 oder 6 zeigt, heile nach der Schadensabrechnung 1 Leben. Diese Heilung passiert auch, wenn du trotzdem Schaden bekommen hast.

### Erde

Erde steht für Schutz und stabile Auslagen.

**2 Erde gebunden:** Deine gebundenen Karten haben +1 Widerstand gegen Herausfordern.

**3 Erde gebunden:** Einmal pro Zug darfst du 1 Schaden verhindern. Dieser Effekt kann Angriffsschaden, Boost-Schaden, Glitch-Schaden oder Ultimativ-Schaden verhindern.

### Luft

Luft steht für Tempo, Kartenfluss und Umbau.

**2 Luft gebunden:** Einmal pro Zug, nachdem du eine Karte bindest, darfst du 1 Karte ziehen und danach 1 Karte abwerfen.

**3 Luft gebunden:** Einmal pro Zug darfst du 1 eigene gebundene Karte auf die Hand nehmen und danach 1 Karte aus deiner Hand binden. Das zählt **nicht** als normale Bindung.

### Schatten

Schatten steht für Discard, Erschöpfen und Sabotage.

**2 Schatten gebunden:** Wenn du einen Boost spielst, darfst du den Gegner 1 Karte abwerfen lassen. Der Gegner wählt die Karte selbst.

**3 Schatten gebunden:** Einmal pro Zug darfst du 1 Handkarte abwerfen, um 1 gegnerische gebundene Karte zu erschöpfen.

### Licht

Licht steht für Stabilität, Ultis und kleine Heilung.

**2 Licht gebunden:** Wenn du deine Ultimativkarte spielst, ziehe danach 1 Karte.

**3 Licht gebunden:** Einmal pro Zug, wenn du eine gebundene Karte aktivierst, heile 1 Leben.

## 12. Arenen

Es gibt **6 Arenen**.

Zu Spielbeginn wird **1 Arena** zufällig gezogen.

### Arena 1: Späti der Erleuchtung

**Rolle:** Boosts, Kartenfilter, flexible Züge.

**Kartentext**

- **Grundeffekt:** Einmal pro Zug, wenn du einen Boost spielst, darfst du 1 Karte ziehen und danach 1 Karte abwerfen.
- **Trigger:** Wenn ein Spieler seinen dritten Boost der Partie spielt, darf er sofort 1 Karte aus seiner Hand binden.
- **Sonderregel:** Boosts, die Schaden machen, verursachen maximal 3 Schaden.

**Klarstellung**

- Der dritte Boost wird **pro Spieler** gezählt, nicht insgesamt.
- Wenn ein Boost verhindert wird, zählt er trotzdem als gespielt, aber sein Effekt wird nicht ausgeführt.

### Arena 2: Kristallkathedrale

**Rolle:** Heilung, Licht, Ultis, Defensive.

**Kartentext**

- **Grundeffekt:** Die erste Heilung jedes Spielers pro Zug heilt +1.
- **Trigger:** Wenn ein Spieler seine Ultimativkarte spielt, zieht er danach 1 Karte.
- **Sonderregel:** Kein Spieler kann durch Heilung über 20 Leben steigen.

**Klarstellung**

- Wenn ein Effekt gleichzeitig Schaden und Heilung macht, wird zuerst Schaden verursacht, dann geheilt.

### Arena 3: Vulkan der schlechten Entscheidungen

**Rolle:** Angriff, Feuer, Druck.

**Kartentext**

- **Grundeffekt:** Der erste Angriffswurf jedes Spielers pro Zug bekommt +1 auf das Würfelergebnis, maximal 6.
- **Trigger:** Wenn ein Spieler in seinem Zug keinen Angriff spielt und keine gegnerische gebundene Karte herausfordert, verliert er am Ende seines Zuges 1 Leben.
- **Sonderregel:** Wenn ein einzelner Angriff nach allen Boni einen Angriffswert von 9 oder höher erreicht, verliert der Angreifer nach der Abrechnung 1 Leben.

**Klarstellung**

- Der +1-Bonus verändert den **Würfelwurf**, nicht direkt den Schaden.
- Beispiel: Wurf 4 wird zu 5. Dadurch wird der Würfelbonus +2 statt +1.

### Arena 4: Sumpf der passiv-aggressiven Heilung

**Rolle:** Block, Wasser, Defensive.

**Kartentext**

- **Grundeffekt:** Der erste Blockwurf jedes Spielers pro gegnerischem Zug bekommt +1 auf das Würfelergebnis, maximal 6.
- **Trigger:** Wenn ein Angriff komplett geblockt wird, darf der blockende Spieler 1 Karte ziehen und danach 1 Karte abwerfen.
- **Sonderregel:** Herausfordern gegen gebundene Karten benötigt +1 Angriff, um erfolgreich zu sein.

**Klarstellung**

- „Benötigt +1 Angriff“ bedeutet: Normalerweise muss der Angriffswert den Zielwert um mindestens 1 übertreffen. In dieser Arena muss der Angriffswert den Zielwert um mindestens **2** übertreffen.

### Arena 5: Club der fliegenden Backpfeifen

**Rolle:** Luft, Bewegung, Umbau.

Zu Spielbeginn **1W6** würfeln.

| W6-Wurf | Variante | Effekt |
|---------|----------|--------|
| 1–2 | Schlechter Bassdrop | Am Ende jedes Zuges muss der aktive Spieler 1 Karte abwerfen, wenn er mehr als 4 Handkarten hat. |
| 3–4 | Seitenwechsel im Nebel | Einmal pro Zug darf der aktive Spieler 1 eigene gebundene Karte auf die Hand nehmen und danach 1 Karte aus der Hand binden. Das zählt nicht als normale Bindung. |
| 5–6 | Alles bewegt sich | Wenn ein Spieler eine gegnerische gebundene Karte herausfordert, wird das Ziel erschöpft, auch wenn es nicht zerstört wird. |

**Klarstellung:** Bei 5–6 wird das Ziel auch erschöpft, wenn es bereits erschöpft ist. Es entsteht kein zusätzlicher Effekt.

### Arena 6: Schattenbasar der toxischen Angebote

**Rolle:** Schatten, Glitches, Discard, Sabotage.

Zu Spielbeginn **1W6** würfeln.

| W6-Wurf | Variante | Effekt |
|---------|----------|--------|
| 1–2 | Schlechter Deal | Wenn ein Spieler eine gegnerische gebundene Karte zerstört, verliert der zerstörende Spieler 1 Leben. |
| 3–4 | Flüsterpreise | Einmal pro Zug darf der aktive Spieler 1 Handkarte abwerfen, um 1 gegnerische gebundene Karte zu erschöpfen. Das zählt nicht als Hauptaktion. |
| 5–6 | Alles hat seinen Preis | Wenn ein Spieler am Anfang seines Zuges keine Handkarten hat, verliert er 2 Leben und zieht danach 2 Karten. |

**Klarstellung:** Bei 5–6 passiert der Effekt **vor** der normalen Ziehphase.

## 13. Charaktere und Ultimativkarten

### 13.1 Knuspergnom

- **Elemente:** Erde / Feuer
- **Rolle:** Allrounder, Druck + Stabilität

**Charakterkartentext — Passiv „Auf Nacken“:** Einmal pro Zug, wenn du Feuer oder Erde bindest, darfst du 1 Karte abwerfen und 1 Karte ziehen.

**Ultimativkarte — Mit Alles und Scharf:** Füge 5 Schaden zu, heile 3 Leben und darfst danach 1 Karte aus deiner Hand binden.

**Klarstellung**

- Die durch die Ulti gebundene Karte zählt **nicht** als normale Bindung deiner Bindungsphase.
- Wenn du bereits 4 gebundene Karten hast, musst du zuerst 1 eigene gebundene Karte abwerfen.

### 13.2 Schluckspecht

- **Elemente:** Wasser / Licht
- **Rolle:** Sustain, Block, Überleben

**Charakterkartentext — Passiv „Spiritus-Tank-Biest“:** Einmal pro gegnerischem Zug, wenn du einen Angriff komplett blockst, heile 1 Leben.

**Ultimativkarte — Lass laufen, Bruder:** Heile 4 Leben und füge 3 Schaden zu. Wenn du danach weniger Leben hast als der Gegner, ziehe 1 Karte.

**Klarstellung:** Die Bedingung „weniger Leben“ wird **nach** der Heilung und **nach** dem Schaden geprüft.

### 13.3 Stiernackenkommando

- **Elemente:** Schatten / Luft
- **Rolle:** Bruiser, Tempo, Gegenschlag

**Charakterkartentext — Passiv „Testo E“:** Wenn du Schaden bekommst, erhält dein nächster Angriff oder dein nächstes Herausfordern +1. Maximal +2.

**Ultimativkarte — Rückhandbombe:** Dein nächster Angriff in diesem Zug macht doppelten Schaden nach allen Boni. Danach verlierst du 1 Leben.

**Klarstellung**

- Die Verdopplung passiert nach Kartenwert, Würfelbonus, Charakterbonus, Synergien, Arena und Konter.
- Danach darf der Gegner normal blocken.

### 13.4 Kokabell

- **Elemente:** Erde / Licht
- **Rolle:** Defensive Engine, Heilung, Auslagenschutz

**Charakterkartentext — Passiv „Glitzersegen“:** Einmal pro Zug, wenn du heilst, bekommt eine deiner gebundenen Karten bis zu deinem nächsten Zug +1 Widerstand.

**Ultimativkarte — Golden (S)hou(we)r Transzendenz:** Setze deine Leben auf 12, falls du unter 12 bist. Danach stelle bis zu 2 erschöpfte gebundene Karten wieder aufrecht.

**Klarstellung:** Wenn du bereits 12 oder mehr Leben hast, verändert die Ulti deine Leben nicht. Der zweite Teil passiert trotzdem.

### 13.5 Pillendoktora

- **Elemente:** Luft / Feuer
- **Rolle:** Risk/Reward, Boosts, Kartenvorteil

**Charakterkartentext — Passiv „Alchemie des Wahnsinns“:** Einmal pro Zug, wenn du einen Boost spielst, wähle eins:

- Ziehe 1 Karte und verliere 1 Leben.
- Füge dem Gegner 1 Schaden zu.
- Heile 1 Leben.

**Ultimativkarte — 3 Tage wach:** Heile 4 Leben, füge 4 Schaden zu und ziehe 2 Karten. Danach wirf 1 Karte ab.

**Klarstellung:** Wenn du durch die 2 gezogenen Karten einen Sofort-Glitch ziehst, wird dieser sofort ausgeführt, **bevor** du die 1 Karte abwirfst.

### 13.6 Dripministerin

- **Elemente:** Wasser / Schatten
- **Rolle:** Control, Discard, Erschöpfen

**Charakterkartentext — Passiv „Nicht nur ne Phase“:** Einmal pro Zug, wenn du eine gegnerische gebundene Karte erschöpfst oder zerstörst, ziehe 1 Karte und wirf danach 1 Karte ab.

**Ultimativkarte — Runway ins Schattenreich:** Gegner wirft 2 Karten ab, verliert 3 Leben und erschöpft 1 gebundene Karte.

**Klarstellung**

- Wenn der Gegner weniger als 2 Handkarten hat, wirft er so viele ab wie möglich. Für jede fehlende Karte verliert er 1 Leben.
- Wenn der Gegner keine gebundene Karte hat, entfällt der Erschöpfen-Teil.

### 13.7 Das Mysterium

- **Elemente:** Frei / Frei
- **Rolle:** Flexibel, Kopieren, Expertencharakter

**Charakterkartentext — Passiv „Form jenseits der Elemente“:** Einmal pro Zug darfst du eine Karte, die du spielst oder bindest, als beliebiges Element behandeln.

**Ultimativkarte — Echo der ungeschriebenen Mythen:** Kopiere die Ultimativfähigkeit des Gegners und führe sie aus. Danach ziehe 1 Karte.

**Klarstellung**

- Die gegnerische Ultimativkarte wird dadurch **nicht** verbraucht.
- Wenn die kopierte Ultimativkarte auf einen bestimmten Charaktertext verweist, wird sie so behandelt, als wäre sie deine Ultimativkarte.

## 14. Hauptdeck: alle Elementkarten

Das Hauptdeck enthält **60 Elementkarten**.

Jedes Element hat **10 Karten:**

- 3 Angriffskarten
- 3 Blockkarten
- 4 Boostkarten

Pro Element gibt es:

| Typ | Werte |
|-----|-------|
| Angriff | 2, 4, 6 |
| Block | 2, 4, 6 |
| Boost | 1, 3, 5, 5 |

### 14.1 Feuerkarten

Feuer steht für Schaden und Angriffsdruck.

#### Feuer 2 Angriff

- **Typ:** Angriff
- **Wert:** 2
- **Sofort:** Angriff 2. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Füge dem Gegner 2 Schaden zu.
- **Widerstand:** 2
#### Feuer 4 Angriff

- **Typ:** Angriff
- **Wert:** 4
- **Sofort:** Angriff 4. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Füge dem Gegner 2 Schaden zu.
- **Widerstand:** 4
#### Feuer 6 Angriff

- **Typ:** Angriff
- **Wert:** 6
- **Sofort:** Angriff 6. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Füge dem Gegner 2 Schaden zu.
- **Widerstand:** 6
#### Feuer 2 Block

- **Typ:** Block
- **Wert:** 2
- **Sofort:** Block 2. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Füge dem Gegner 2 Schaden zu.
- **Widerstand:** 2
#### Feuer 4 Block

- **Typ:** Block
- **Wert:** 4
- **Sofort:** Block 4. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Füge dem Gegner 2 Schaden zu.
- **Widerstand:** 4
#### Feuer 6 Block

- **Typ:** Block
- **Wert:** 6
- **Sofort:** Block 6. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Füge dem Gegner 2 Schaden zu.
- **Widerstand:** 6
#### Feuer 1 Boost

- **Typ:** Boost
- **Wert:** 1
- **Sofort:** Füge dem Gegner 2 Schaden zu.
- **Gebunden:** Aktivieren: Füge dem Gegner 2 Schaden zu.
- **Widerstand:** 1
#### Feuer 3 Boost

- **Typ:** Boost
- **Wert:** 3
- **Sofort:** Füge dem Gegner 2 Schaden zu.
- **Gebunden:** Aktivieren: Füge dem Gegner 2 Schaden zu.
- **Widerstand:** 3
#### Feuer 5 Boost

- **Typ:** Boost
- **Wert:** 5
- **Anzahl:** 2
- **Sofort:** Füge dem Gegner 2 Schaden zu.
- **Gebunden:** Aktivieren: Füge dem Gegner 2 Schaden zu.
- **Widerstand:** 5
### 14.2 Wasserkarten

Wasser steht für Heilung und Verteidigung.

#### Wasser 2 Angriff

- **Typ:** Angriff
- **Wert:** 2
- **Sofort:** Angriff 2. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Heile 2 Leben.
- **Widerstand:** 2
#### Wasser 4 Angriff

- **Typ:** Angriff
- **Wert:** 4
- **Sofort:** Angriff 4. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Heile 2 Leben.
- **Widerstand:** 4
#### Wasser 6 Angriff

- **Typ:** Angriff
- **Wert:** 6
- **Sofort:** Angriff 6. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Heile 2 Leben.
- **Widerstand:** 6
#### Wasser 2 Block

- **Typ:** Block
- **Wert:** 2
- **Sofort:** Block 2. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Heile 2 Leben.
- **Widerstand:** 2
#### Wasser 4 Block

- **Typ:** Block
- **Wert:** 4
- **Sofort:** Block 4. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Heile 2 Leben.
- **Widerstand:** 4
#### Wasser 6 Block

- **Typ:** Block
- **Wert:** 6
- **Sofort:** Block 6. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Heile 2 Leben.
- **Widerstand:** 6
#### Wasser 1 Boost

- **Typ:** Boost
- **Wert:** 1
- **Sofort:** Heile 2 Leben.
- **Gebunden:** Aktivieren: Heile 2 Leben.
- **Widerstand:** 1
#### Wasser 3 Boost

- **Typ:** Boost
- **Wert:** 3
- **Sofort:** Heile 2 Leben.
- **Gebunden:** Aktivieren: Heile 2 Leben.
- **Widerstand:** 3
#### Wasser 5 Boost

- **Typ:** Boost
- **Wert:** 5
- **Anzahl:** 2
- **Sofort:** Heile 2 Leben.
- **Gebunden:** Aktivieren: Heile 2 Leben.
- **Widerstand:** 5
### 14.3 Erdekarten

Erde steht für Widerstand und Schutz.

#### Erde 2 Angriff

- **Typ:** Angriff
- **Wert:** 2
- **Sofort:** Angriff 2. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.
- **Widerstand:** 2
#### Erde 4 Angriff

- **Typ:** Angriff
- **Wert:** 4
- **Sofort:** Angriff 4. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.
- **Widerstand:** 4
#### Erde 6 Angriff

- **Typ:** Angriff
- **Wert:** 6
- **Sofort:** Angriff 6. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.
- **Widerstand:** 6
#### Erde 2 Block

- **Typ:** Block
- **Wert:** 2
- **Sofort:** Block 2. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.
- **Widerstand:** 2
#### Erde 4 Block

- **Typ:** Block
- **Wert:** 4
- **Sofort:** Block 4. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.
- **Widerstand:** 4
#### Erde 6 Block

- **Typ:** Block
- **Wert:** 6
- **Sofort:** Block 6. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.
- **Widerstand:** 6
#### Erde 1 Boost

- **Typ:** Boost
- **Wert:** 1
- **Sofort:** Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.
- **Gebunden:** Aktivieren: Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.
- **Widerstand:** 1
#### Erde 3 Boost

- **Typ:** Boost
- **Wert:** 3
- **Sofort:** Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.
- **Gebunden:** Aktivieren: Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.
- **Widerstand:** 3
#### Erde 5 Boost

- **Typ:** Boost
- **Wert:** 5
- **Anzahl:** 2
- **Sofort:** Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.
- **Gebunden:** Aktivieren: Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.
- **Widerstand:** 5
### 14.4 Luftkarten

Luft steht für Kartenfluss und Bewegung.

#### Luft 2 Angriff

- **Typ:** Angriff
- **Wert:** 2
- **Sofort:** Angriff 2. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Ziehe 2 Karten und wirf danach 1 Karte ab.
- **Widerstand:** 2
#### Luft 4 Angriff

- **Typ:** Angriff
- **Wert:** 4
- **Sofort:** Angriff 4. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Ziehe 2 Karten und wirf danach 1 Karte ab.
- **Widerstand:** 4
#### Luft 6 Angriff

- **Typ:** Angriff
- **Wert:** 6
- **Sofort:** Angriff 6. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Ziehe 2 Karten und wirf danach 1 Karte ab.
- **Widerstand:** 6
#### Luft 2 Block

- **Typ:** Block
- **Wert:** 2
- **Sofort:** Block 2. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Ziehe 2 Karten und wirf danach 1 Karte ab.
- **Widerstand:** 2
#### Luft 4 Block

- **Typ:** Block
- **Wert:** 4
- **Sofort:** Block 4. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Ziehe 2 Karten und wirf danach 1 Karte ab.
- **Widerstand:** 4
#### Luft 6 Block

- **Typ:** Block
- **Wert:** 6
- **Sofort:** Block 6. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Ziehe 2 Karten und wirf danach 1 Karte ab.
- **Widerstand:** 6
#### Luft 1 Boost

- **Typ:** Boost
- **Wert:** 1
- **Sofort:** Ziehe 2 Karten und wirf danach 1 Karte ab.
- **Gebunden:** Aktivieren: Ziehe 2 Karten und wirf danach 1 Karte ab.
- **Widerstand:** 1
#### Luft 3 Boost

- **Typ:** Boost
- **Wert:** 3
- **Sofort:** Ziehe 2 Karten und wirf danach 1 Karte ab.
- **Gebunden:** Aktivieren: Ziehe 2 Karten und wirf danach 1 Karte ab.
- **Widerstand:** 3
#### Luft 5 Boost

- **Typ:** Boost
- **Wert:** 5
- **Anzahl:** 2
- **Sofort:** Ziehe 2 Karten und wirf danach 1 Karte ab.
- **Gebunden:** Aktivieren: Ziehe 2 Karten und wirf danach 1 Karte ab.
- **Widerstand:** 5
### 14.5 Schattenkarten

Schatten steht für Sabotage und Erschöpfen.

#### Schatten 2 Angriff

- **Typ:** Angriff
- **Wert:** 2
- **Sofort:** Angriff 2. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Erschöpfe 1 gegnerische gebundene Karte.
- **Widerstand:** 2
#### Schatten 4 Angriff

- **Typ:** Angriff
- **Wert:** 4
- **Sofort:** Angriff 4. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Erschöpfe 1 gegnerische gebundene Karte.
- **Widerstand:** 4
#### Schatten 6 Angriff

- **Typ:** Angriff
- **Wert:** 6
- **Sofort:** Angriff 6. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Erschöpfe 1 gegnerische gebundene Karte.
- **Widerstand:** 6
#### Schatten 2 Block

- **Typ:** Block
- **Wert:** 2
- **Sofort:** Block 2. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Erschöpfe 1 gegnerische gebundene Karte.
- **Widerstand:** 2
#### Schatten 4 Block

- **Typ:** Block
- **Wert:** 4
- **Sofort:** Block 4. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Erschöpfe 1 gegnerische gebundene Karte.
- **Widerstand:** 4
#### Schatten 6 Block

- **Typ:** Block
- **Wert:** 6
- **Sofort:** Block 6. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Erschöpfe 1 gegnerische gebundene Karte.
- **Widerstand:** 6
#### Schatten 1 Boost

- **Typ:** Boost
- **Wert:** 1
- **Sofort:** Gegner wirft 1 Karte ab. Gegner wählt.
- **Gebunden:** Aktivieren: Erschöpfe 1 gegnerische gebundene Karte.
- **Widerstand:** 1
#### Schatten 3 Boost

- **Typ:** Boost
- **Wert:** 3
- **Sofort:** Gegner wirft 1 Karte ab. Gegner wählt.
- **Gebunden:** Aktivieren: Erschöpfe 1 gegnerische gebundene Karte.
- **Widerstand:** 3
#### Schatten 5 Boost

- **Typ:** Boost
- **Wert:** 5
- **Anzahl:** 2
- **Sofort:** Gegner wirft 1 Karte ab. Gegner wählt.
- **Gebunden:** Aktivieren: Erschöpfe 1 gegnerische gebundene Karte.
- **Widerstand:** 5
### 14.6 Lichtkarten

Licht steht für Stabilität, Heilung und Ultimativ-Synergie.

#### Licht 2 Angriff

- **Typ:** Angriff
- **Wert:** 2
- **Sofort:** Angriff 2. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Ziehe 1 Karte und heile 1 Leben.
- **Widerstand:** 2
#### Licht 4 Angriff

- **Typ:** Angriff
- **Wert:** 4
- **Sofort:** Angriff 4. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Ziehe 1 Karte und heile 1 Leben.
- **Widerstand:** 4
#### Licht 6 Angriff

- **Typ:** Angriff
- **Wert:** 6
- **Sofort:** Angriff 6. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Ziehe 1 Karte und heile 1 Leben.
- **Widerstand:** 6
#### Licht 2 Block

- **Typ:** Block
- **Wert:** 2
- **Sofort:** Block 2. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Ziehe 1 Karte und heile 1 Leben.
- **Widerstand:** 2
#### Licht 4 Block

- **Typ:** Block
- **Wert:** 4
- **Sofort:** Block 4. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Ziehe 1 Karte und heile 1 Leben.
- **Widerstand:** 4
#### Licht 6 Block

- **Typ:** Block
- **Wert:** 6
- **Sofort:** Block 6. Würfle 1W6 für Würfelbonus.
- **Gebunden:** Aktivieren: Ziehe 1 Karte und heile 1 Leben.
- **Widerstand:** 6
#### Licht 1 Boost

- **Typ:** Boost
- **Wert:** 1
- **Sofort:** Ziehe 1 Karte und heile 1 Leben.
- **Gebunden:** Aktivieren: Ziehe 1 Karte und heile 1 Leben.
- **Widerstand:** 1
#### Licht 3 Boost

- **Typ:** Boost
- **Wert:** 3
- **Sofort:** Ziehe 1 Karte und heile 1 Leben.
- **Gebunden:** Aktivieren: Ziehe 1 Karte und heile 1 Leben.
- **Widerstand:** 3
#### Licht 5 Boost

- **Typ:** Boost
- **Wert:** 5
- **Anzahl:** 2
- **Sofort:** Ziehe 1 Karte und heile 1 Leben.
- **Gebunden:** Aktivieren: Ziehe 1 Karte und heile 1 Leben.
- **Widerstand:** 5

## 15. Glitchkarten

Es gibt **10 Glitchkarten**.

### 15.1 Spielbare Glitches

#### 1. Riss in der Realität

- **Typ:** Spielbarer Glitch
- **Timing:** In deinem Zug.
- **Effekt:** Wechsle die Arena. Ziehe eine neue Arena zufällig. Falls sie einen W6-Startwurf nutzt, würfle neu.
- **Klarstellung:** Die alte Arena wird abgelegt. Neue Arenaeffekte gelten sofort.

#### 2. Nein, Bruder

- **Typ:** Spielbarer Glitch
- **Timing:** Wenn der Gegner einen Boost spielt.
- **Effekt:** Der Boost wird verhindert und abgelegt.
- **Klarstellung:** Effekte, die durch „Boost gespielt“ ausgelöst werden, passieren trotzdem, falls sie schon ausgelöst wurden.

#### 3. Kurzschluss

- **Typ:** Spielbarer Glitch
- **Timing:** In deinem Zug.
- **Effekt:** Erschöpfe 1 gegnerische gebundene Karte.
- **Klarstellung:** Eine bereits erschöpfte Karte darf gewählt werden, aber es passiert nichts Zusätzliches.

#### 4. Rückkopplung

- **Typ:** Spielbarer Glitch
- **Timing:** Wenn du Angriffsschaden bekommst.
- **Effekt:** Reduziere diesen Schaden um 2.
- **Klarstellung:** Kann nicht gegen Boost-Schaden, Glitch-Schaden oder Ultimativ-Schaden gespielt werden.

#### 5. Schlechter Empfang

- **Typ:** Spielbarer Glitch
- **Timing:** In deinem Zug.
- **Effekt:** Gegner darf bis zum Ende seines nächsten Zuges keine Karten außerhalb seiner normalen Ziehphase ziehen.
- **Klarstellung:** Sofort-Glitches, die Karten ziehen lassen, funktionieren trotzdem, weil sie keine freiwilligen Zieheffekte sind.

#### 6. Systemfehler

- **Typ:** Spielbarer Glitch
- **Timing:** In deinem Zug.
- **Effekt:** Wähle 1 gebundene Karte. Sie verliert bis zum Beginn deines nächsten Zuges ihren Aktivierungseffekt.
- **Klarstellung:** Sie zählt weiterhin für Element-Synergien und gegen das Limit.

#### 7. Illegaler Download

- **Typ:** Spielbarer Glitch
- **Timing:** In deinem Zug.
- **Effekt:** Kopiere den Aktivierungseffekt einer gegnerischen gebundenen Karte. Du musst dafür 1 Handkarte abwerfen.
- **Klarstellung:** Die gegnerische Karte wird nicht erschöpft. Deine Aktion zählt als Glitch-Spiel, nicht als Aktivierung deiner eigenen gebundenen Karte.

### 15.2 Sofort-Glitches

#### 8. Selbstschaden.exe

- **Typ:** Sofort-Glitch
- **Timing:** Wenn gezogen.
- **Effekt:** Du verlierst 2 Leben.
- **Klarstellung:** Danach wird diese Karte abgelegt.

#### 9. Datenleck

- **Typ:** Sofort-Glitch
- **Timing:** Wenn gezogen.
- **Effekt:** Beide Spieler ziehen 1 Karte.
- **Klarstellung:** Wenn dadurch weitere Sofort-Glitches gezogen werden, werden sie sofort nacheinander ausgeführt.

#### 10. Absturz

- **Typ:** Sofort-Glitch
- **Timing:** Wenn gezogen.
- **Effekt:** Wirf 1 Handkarte ab. Wenn du keine Handkarte hast, verlierst du 1 Leben.
- **Klarstellung:** Der Absturz selbst liegt nicht auf deiner Hand und kann nicht als abzuwerfende Karte gewählt werden.

## 16. Timing-Regeln

### 16.1 Reihenfolge bei mehreren Effekten

Wenn mehrere Effekte gleichzeitig ausgelöst werden:

1. Der **aktive Spieler** handelt eigene Effekte in beliebiger Reihenfolge ab.
2. Danach handelt der **Gegner** eigene Effekte in beliebiger Reihenfolge ab.
3. **Arenaeffekte** werden zuletzt abgehandelt, außer sie verändern den auslösenden Effekt direkt.

### 16.2 „Einmal pro Zug“

Ein Effekt mit „einmal pro Zug“ kann in jedem Spielerzug einmal ausgelöst werden, falls der Text nicht „in deinem Zug“ sagt.

### 16.3 „Einmal pro gegnerischem Zug“

Kann nur während des gegnerischen Zuges ausgelöst werden.

### 16.4 „Bis zu deinem nächsten Zug“

Der Effekt endet am Anfang deines nächsten Zuges, **bevor** du erschöpfte Karten aufrecht stellst.

### 16.5 Würfel verändern

Wenn ein Effekt einen Würfelwurf verändert, verändert er das **sichtbare Würfelergebnis**.

**Beispiel:** Ein Wurf von 4 wird durch Vulkan zu 5. Dadurch zählt er als 5–6 und gibt +2 Würfelbonus.

### 16.6 Würfel wiederholen

Wenn ein Effekt sagt „würfle erneut“, muss das **neue Ergebnis** genommen werden. Das alte Ergebnis zählt nicht mehr.

## 17. Edge Cases

### Beide Spieler fallen gleichzeitig auf 0

Der aktive Spieler verliert.

### Ein Spieler muss ziehen, aber das Deck ist leer

Ablagestapel mischen. Neues Deck bilden. Der ziehende Spieler verliert 1 Leben. Dann zieht er weiter.

### Deck und Ablagestapel sind leer

Der Spieler zieht keine Karte und verliert 1 Leben.

### Ein Spieler muss abwerfen, hat aber keine Handkarten

Er verliert stattdessen 1 Leben.

### Ein Effekt sagt „ziehe 2“, aber im Deck liegt nur 1 Karte

Ziehe die 1 Karte, mische den Ablagestapel neu, verliere 1 Leben wegen Deck-Reset, ziehe dann die zweite Karte.

### Eine Karte wird auf die Hand genommen

Alle temporären Effekte auf dieser Karte enden sofort.

### Eine Karte verliert ihren Aktivierungseffekt

Sie zählt weiterhin als gebundene Karte, für Element-Synergien und gegen das Limit. Sie kann nur nicht aktiviert werden.

### Eine erschöpfte Karte wird erneut erschöpft

Es passiert nichts Zusätzliches.

### Eine erschöpfte Karte wird zerstört

Sie kommt normal auf den Ablagestapel.

### Eine gebundene Karte wird zerstört

Sie kommt auf den Ablagestapel.

### Ein Angriff wird komplett geblockt

Der Gegner bekommt 0 Schaden. Effekte „wenn du angreifst“ lösen trotzdem aus. Effekte „wenn du Schaden verursachst“ lösen nicht aus.

### Ein Angriff verursacht 0 Schaden

Er gilt als komplett geblockt.

### Boost verursacht Schaden

Boost-Schaden ist kein Angriff. Er kann nicht mit Blockkarten geblockt werden.

### Ultimativkarte verursacht Schaden

Ultimativ-Schaden ist kein Angriff, außer die Karte sagt ausdrücklich „Angriff“.

### Heilen bei 20 Leben

Der Spieler bleibt bei 20. Zusätzliche Heilung verfällt.

### Gegner muss 2 Karten abwerfen, hat aber nur 1

Er wirft 1 Karte ab. Wenn eine Karte ausdrücklich fehlende Karten bestraft, wird diese Strafe angewendet. Sonst passiert nichts.

### Das Mysterium behandelt eine Karte als anderes Element

Das gilt nur für diesen Spielvorgang oder diese gebundene Karte. Wenn sie auf die Hand zurückgeht, abgeworfen oder zerstört wird, endet die Änderung.

### Eine Arena wird gewechselt

Alle Effekte der alten Arena enden sofort. Dauerhafte Effekte, die bereits auf Karten liegen, bleiben bestehen, wenn sie nicht ausdrücklich von der Arena abhängig sind.

### Eine neue Arena mit W6 wird gezogen

Sofort 1W6 würfeln. Der Wurf gilt, solange diese Arena liegt.

### Handlimit und Sofort-Glitch

Handlimit wird nur in der Endphase geprüft. Sofort-Glitches können auch während der Endphase ausgelöst werden, falls ein Effekt dort Karten ziehen lässt.

### Angriffswurf und Blockwurf gleichzeitig?

Nein. Zuerst würfelt der Angreifer. Danach entscheidet der Verteidiger, ob er blockt. Wenn er blockt, würfelt er seinen Blockwurf.

### Kann ein Spieler nach dem gegnerischen Angriffswurf entscheiden, ob er blockt?

Ja. Der Angriffswert wird vollständig berechnet, bevor der Verteidiger entscheidet, ob er blockt.

### Kann man mehrere Blockkarten spielen?

Nein. Pro Angriff oder Herausforderung darf genau 1 Blockkarte gespielt werden.

### Kann man Boost-Schaden blocken?

Nein. Boost-Schaden ist kein Angriff.

### Kann man eine Ultimativkarte blocken?

Nein, außer ein Effekt sagt ausdrücklich, dass sie reduziert oder verhindert werden darf.

### Zählt Herausfordern als Angriff?

Ja, für Effekte, die „wenn du angreifst“ sagen. Nein, für Effekte, die „wenn du dem Gegner Schaden zufügst“ sagen, außer die Herausforderung verursacht ausdrücklich Schaden.

### Zählt Herausfordern für Vulkan?

Ja. Im Vulkan verlierst du am Ende deines Zuges kein Leben, wenn du in diesem Zug eine gegnerische gebundene Karte herausgefordert hast.

### Kann eine gebundene Karte mit Widerstand 1 sofort zerstört werden?

Ja, wenn der Angriffswert den Zielwert übertrifft.

### Muss eine gebundene Karte erschöpft sein, um herausgefordert zu werden?

Nein. Aufrechte und erschöpfte gebundene Karten können herausgefordert werden.

### Zählen erschöpfte Karten für 2er- und 3er-Synergien?

Ja.

### Können Glitches als gebundene Karten gespielt werden?

Nein. Nur Elementkarten können gebunden werden.

### Können Ultimativkarten gebunden werden?

Nein.

### Können Arenakarten zerstört werden?

Nein. Arenen können nur durch Effekte gewechselt werden.
## 18. Erste Partie: Geführter Einstieg

Diese Einführung ist für Spieler, die das Spiel zum ersten Mal spielen.

### Ziel der ersten Partie

Die erste Partie soll nicht alle taktischen Feinheiten zeigen. Sie soll diese Dinge erklären:

- Leben
- Angriff
- Block
- Würfelbonus
- Binden
- Aktivieren
- Herausfordern
- Boosts
- Glitches
- Arena
- Ultimativkarten

### Schritt 1: Charaktere wählen

Für die erste Partie nehmt:

- **Spieler A:** Knuspergnom
- **Spieler B:** Schluckspecht

**Warum:**

- Knuspergnom zeigt Angriff, Binden und Allround-Spiel.
- Schluckspecht zeigt Blocken, Heilung und Verteidigung.

### Schritt 2: Arena wählen

Für die erste Partie nehmt fest: **Späti der Erleuchtung**

Keine W6-Arena in der ersten Partie.

### Schritt 3: Startkarten ziehen

- Knuspergnom zieht **5 Karten**.
- Schluckspecht zieht **6 Karten**.

Der zweite Spieler bekommt 1 Karte mehr, weil der Startspieler zuerst binden und angreifen kann.

### Schritt 4: Erste Runde langsam spielen

In der ersten Runde sollte jeder Spieler mindestens 1 Karte binden.

**Erklärung:** „Eine gebundene Karte ist deine Engine. Sie liegt dauerhaft vor dir, zählt für Element-Synergien und kann später aktiviert werden.“

### Schritt 5: Ersten Angriff erklären

Wenn ein Spieler angreift:

1. Angriffskarte spielen.
2. W6 würfeln.
3. Würfelbonus bestimmen.
4. Kartenwert + Würfelbonus + Boni rechnen.
5. Gegner darf blocken.
6. Wenn er blockt, würfelt er auch.
7. Schaden berechnen.

### Schritt 6: Ersten Block erklären

Wenn ein Spieler blockt:

1. Blockkarte spielen.
2. W6 würfeln.
3. Würfelbonus bestimmen.
4. Kartenwert + Würfelbonus + Boni rechnen.
5. Schaden reduzieren.

### Schritt 7: Erstes Binden erklären

Beim Binden sagen: „Diese Karte liegt jetzt dauerhaft vor dir. Ihr Element zählt für Synergien. Ihre Zahl ist ihr Widerstand.“

### Schritt 8: Erstes Aktivieren erklären

Wenn eine gebundene Karte aktiviert wird:

1. 1 Handkarte abwerfen.
2. Gebundene Karte quer drehen.
3. Elementeffekt ausführen.

### Schritt 9: Erstes Herausfordern erklären

Wenn eine gegnerische gebundene Karte nervt:

„Du musst nicht immer Leben angreifen. Du kannst auch die Engine des Gegners angreifen.“

Dann einmal langsam durchrechnen:

1. Zielkarte wählen.
2. Angriff spielen.
3. Angriffswurf.
4. Gegner darf blocken.
5. Zielwert berechnen.
6. Angriff muss höher sein.

### Schritt 10: Erste Ultimativkarte erklären

Ultis sind einmalig.

**Empfehlung für die erste Partie:** Keine Ulti in den ersten zwei eigenen Zügen spielen. Danach frei.

### Schritt 11: Spiel normal fortsetzen

Nach 3–4 Runden kennen beide Spieler: Ziehen, Binden, Angriff, Block, Würfelbonus, Boost, Aktivieren, Herausfordern, Arena, Ulti.

Danach läuft die Partie normal weiter.

## 19. Was muss auf jede Karte?

### 19.1 Elementkarte

Jede Elementkarte braucht sichtbar:

- Name
- Element-Icon
- Zahl groß in der Ecke
- Typ-Icon: Angriff / Block / Boost
- Soforttext
- Gebunden-Text
- Widerstand-Hinweis

**Elementkarten-Template**

```
Name: Feuer 4 Angriff
Element: Feuer
Typ: Angriff
Wert: 4

Sofort:
Angriff 4. Würfle 1W6 für Würfelbonus.

Gebunden:
Aktivieren: Füge dem Gegner 2 Schaden zu.

Widerstand:
4
```

### 19.2 Charakterkarte

Jede Charakterkarte braucht sichtbar:

- Name
- Elemente
- Rolle
- Passiv
- Startleben 20
- Ulti-Name
- Kurzstrategie

**Charakterkarten-Template**

```
Name: Knuspergnom
Elemente: Erde / Feuer
Rolle: Allrounder

Passiv:
Einmal pro Zug, wenn du Feuer oder Erde bindest, darfst du 1 Karte abwerfen und 1 Karte ziehen.

Ulti:
Mit Alles und Scharf

Kurzstrategie:
Baue Feuer/Erde auf, halte Druck und nutze Binden für Kartenvorteil.
```

### 19.3 Ultimativkarte

Jede Ultimativkarte braucht sichtbar:

- Charakterzuordnung
- Name
- Effekt
- Hinweis: „Einmal pro Spiel“
- Hinweis: „Nach Benutzung umdrehen“

**Ultimativkarten-Template**

```
Mit Alles und Scharf
Charakter: Knuspergnom

Effekt:
Füge 5 Schaden zu, heile 3 Leben und darfst danach 1 Karte aus deiner Hand binden.

Einmal pro Spiel. Danach umdrehen.
```

### 19.4 Arenakarte

Jede Arenakarte braucht sichtbar:

- Name
- Rolle
- Grundeffekt
- Trigger
- Sonderregel
- Klarstellung
- bei W6-Arena: 1–2 / 3–4 / 5–6

### 19.5 Glitchkarte

Jede Glitchkarte braucht sichtbar:

- Name
- Typ: Spielbar oder Sofort
- Timing
- Effekt
- Klarstellung

## 20. Kurzregelkarte

Diese Referenzkarte sollte dem Spiel beiliegen.

### Zugablauf

1. Startphase
2. 1 Karte ziehen
3. Bis zu 1 Karte binden
4. 1 Hauptaktion
5. Handlimit 6

### Hauptaktionen

- Angriff
- Boost
- Aktivieren
- Herausfordern
- 1 abwerfen, 2 ziehen
- Ulti

### Kampf (Angriff/Block)

1. Karte spielen.
2. 1W6 würfeln.
3. Würfelbonus bestimmen.
4. Kartenwert + Bonus + Effekte rechnen.

### Würfelbonus

| W6-Wurf | Bonus |
|---------|-------|
| 1–2 | +0 |
| 3–4 | +1 |
| 5–6 | +2 |

### Aktivieren

1 Handkarte abwerfen + gebundene Karte erschöpfen.

### Maximal

4 gebundene Karten.

### Sieg

Gegner auf 0 Leben bringen.

## 21. Designstatus V1

Diese Version nutzt bewusst:

- feste Kartenwerte
- kleinen Würfelbonus
- maximal 4 gebundene Karten
- einfache Aktivierungskosten
- nur Element-Effekte bei gebundenen Karten
- 6 physische Arenen
- 10 Glitches
- 20 Leben
- keine App-Pflicht
- keine alternativen Siegbedingungen

**Die Grundidentität ist:**

Karten geben Planbarkeit. Würfel geben Spannung. Engine gibt Kontrolle.

