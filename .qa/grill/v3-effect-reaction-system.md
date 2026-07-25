# Grill-Log: V3 Effekt-/Reaktionssystem

<!-- /grill-me on 2026-07-25 — offene Fragen im Session beantwortet -->

## Branch: Regelquellen & Wahrheit

### Knoten: Was ist „Wahrheit“ während der Migration?
- **Entscheidung**: V1 bleibt Engine-Wahrheit. V3 WIP ist Design. Freigabe erst nach Slice-1 Playtests + AGENTS-Update.
- **Abgelehnte Alternativen**: Sofort V3 als Wahrheit; V2 verwerfen.
- **Constraint**: AGENTS.md Regelquellen-Tabelle.
- **Annahmen**: Team speichert die Editor-Datei (Disk = 0 Bytes).
- **Downstream**: Kein PR darf `DEFAULT_RULESET` stillschweigend auf V3 stellen.
- **Status**: FESTGELEGT

### Knoten: V3 vs V2 Bau (Träger/Antrieb/Aufsatz vs freie Reihe)
- **Entscheidung**: V2 D8/E2 bleibt. V3 §12 Rollen = `preferredRole` / Archetyp-Labels auf Engine-Teilen (wie preferredTag), optional für Resonanz-Zählung — **keine** festen drei Slots.
- **Abgelehnte Alternativen**: V2 revidieren; V3 Hard-Slots erzwingen.
- **Constraint**: V2 Grill D8/D9 geschlossen; Widerspruch würde Phrase-Engine + P100 Pack invalidieren.
- **Annahmen**: Resonanz (§13) zählt Elemente in der Phrase-Reihe, nicht Slot-Rollen.
- **Downstream**: V3-Dokument §12 muss umgeschrieben werden (WIP-Eintrag).
- **Status**: FESTGELEGT

## Branch: Kampfpipeline

### Knoten: Wo hängt der Impuls in der bestehenden Engine?
- **Entscheidung**: Nach Treffer/Vollblock-Feststellung (V3 §17 Schritte 11–18), eingehängt in `resolveCombat` / Effektpfad — analog zu Instant-Effekten, aber als eigene Pipeline.
- **Abgelehnte Alternativen**: Impuls vor Block; Impuls als reiner UI-VFX.
- **Constraint**: Authoritative Engine; `pendingChoice` existiert bereits.
- **Annahmen**: „Elementattribut ≠ Impuls“ (§3.2) — Pack-Texte brauchen explizites Keyword.
- **Downstream**: Card-Schema: `onHit: { impulse: 'fire' }` statt freier String-only.
- **Status**: FESTGELEGT

### Knoten: Mehrere mögliche Reaktionen
- **Entscheidung**: `pendingChoice.type = 'pick-reaction'` — aktiver Spieler wählt; Bot heuristisch.
- **Abgelehnte Alternativen**: Zufall; immer „stärkster Schaden“.
- **Constraint**: V3 §3.3 / §18.
- **Status**: FESTGELEGT

### Knoten: Schild vs V1 Leben-only
- **Entscheidung**: `PlayerState.shield` nur wenn V3-Flag aktiv; Schadenpipeline: Block → Schild → LP.
- **Abgelehnte Alternativen**: Schild in V1-Partien mitschleppen.
- **Status**: FESTGELEGT

## Branch: Scope / Phasen

### Knoten: Was ist Slice 1?
- **Entscheidung**: Statusmarken (6 primäre) + Nebel/Verpeilt/Gift/Geblendet/Fokus/Überflutet/Ausgeblendet minimal nötig für Mono+Dampf; Elementimpuls; 6 Mono-Reaktionen + Dampf als erste Mischreaktion; Timing; Unit-Tests. **Kein** Blueprint, keine Transformation, keine volle Resonanz-Tabelle.
- **Abgelehnte Alternativen**: Alle 21 sofort; nur Doku.
- **Constraint**: KISS / Roadmap Stufe A.
- **Status**: FESTGELEGT

### Knoten: YAGNI — nur Doku?
- **Entscheidung**: Verworfen für Kernmatrix; akzeptiert für Area51/Transformation bis Slice 3+.
- **Status**: FESTGELEGT

## Branch: Content & UX

### Knoten: Pack-Migration
- **Entscheidung**: Neue Felder optional; alte V1-Karten ohne Impuls bleiben „nur Schaden/Block“. Impuls-Karten schrittweise im Forge/Base-Pack kennzeichnen.
- **Status**: OFFEN (Schema-Detail vor Pack-PR)
- **Annahmen**: Ohne Keyword kein Impuls — verhindert Automatismus (§19).

### Knoten: UI-Status-Lesbarkeit
- **Entscheidung**: Chips am CharacterDock; Reaktion-Modal mit DE Namen (Dampf, Hotbox, …).
- **Status**: FESTGELEGT für Zielbild; Implement nach Engine-Slice

## Aufgelöste Abhängigkeiten

- V2 Bau (E2) → V3 Resonanz: zählt Elemente in Phrase, nicht Slot-Rollen
- V1 Combat → V3 Impulse: Hook nach Hit, Flag-gated
- pendingChoice → Reaktionwahl: neuer Choice-Typ
- Roadmap A → V3: nach/neben A-4 als eigenes Ticket, nicht C

## Risiken / Unbekannte

1. **Disk 0 Bytes** — Inhalt nur im Editor; speichern Pflicht
2. **Cognitive load** physisch — 21 Reaktionen brauchen Cheat-Sheet
3. **Bot** — Heuristik für Reaktionwahl sonst exploitable
4. **Nebel ∩ Verpeilt ∩ Impuls** — Unit-Matrix Pflicht vor UI

## Terminierung

Baum bis Blätter durchlaufen für Architektur/Scope/Wahrheit. Content-Schema-Details und physische Marker bleiben Folge-Branches. User-Auftrag „beantworte offene Fragen“ für Design-Entscheidungen erledigt.
