# UI / UX Styleguide — Letz Fetz

Verbindliche Referenz für alle UI-Arbeiten in diesem Projekt.
**Ziel:** Jede neue Ansicht sieht aus wie Letz Fetz — nicht wie generisches Tailwind.

Siehe auch: [AGENTS.md](../../AGENTS.md) (Architektur & Prioritäten).

---

## 1. Design-Philosophie

| Kontext | Ton | Beispiel |
|---------|-----|----------|
| **Spiel** (`components/game/`) | Verspielt, energiegeladen | Emojis, Gradients, Würfel-Animationen |
| **Editor** (Card Forge, Einstellungen) | Nüchtern, werkzeugartig | Klare Labels, weniger Deko |
| **Sandbox Arena** | Mittel — visueller Tisch | Bestehendes Verhalten beibehalten |

**UI-Sprache:** Deutsch. **Code:** Englisch.

---

## 2. Design Tokens

Nutze diese Tailwind-Klassen. Keine neuen Farben ohne Grund.

### Hintergründe

| Token | Klassen | Verwendung |
|-------|---------|------------|
| `bg-app` | `bg-gray-950` | Seitenhintergrund |
| `bg-surface` | `bg-gray-900` | Panels, Sidebars |
| `bg-surface-raised` | `bg-gray-800` | Inputs, Karten-Container |
| `bg-surface-inset` | `bg-gray-900/50` | Dezente Flächen |

### Markenfarben

| Token | Klassen | Verwendung |
|-------|---------|------------|
| `brand-header` | `bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900` | App-Header |
| `brand-panel` | `bg-gradient-to-br from-gray-900 to-gray-950` | Modals, HUDs |
| `brand-accent` | `purple-500`, `purple-600`, `purple-900` | Fokus, Auswahl, Borders |
| `brand-accent-soft` | `purple-900/30`, `border-purple-500/50` | Hervorhebungen |
| `brand-text-muted` | `text-purple-300`, `text-purple-400` | Sekundärtext |
| **brand-cream** | `#f2e8dc`, `text-brand-cream` | Logo-Pergament, alle `font-brand` Texte |
| **brand-cream-muted** | `#d9c9b8`, `text-brand-cream-muted` | Sekundär unter Brand-Namen |
| **brand-ink / parchment** | `#1f1812`, `#2a2218`, **`#5a0705`** | Brand auf **beige**: `.font-brand-on-parchment`; auf **dunkel**: `.font-brand-on-dark` → cream |

### Semantische Farben

| Bedeutung | Klassen |
|-----------|---------|
| Positiv / Heilen | `green-600`, `hover:bg-green-700` |
| Negativ / Schaden | `red-600`, `hover:bg-red-700` |
| Warnung / Notizen | `amber-600`, `amber-600/80` |
| Info / Tipp | `bg-purple-900/30 border border-purple-700 text-purple-200` |

### Element-Farben (Spielkarten)

Akzent-Streifen und Badges in `src/components/cards/cardFrameTokens.ts` (`ELEMENT_ACCENTS`).
Grunge-Frame: `LetzFetzCard.tsx` — Default **`layout="portrait"`** (wie Charakterauswahl): große Illustration, Header nur Element-Icons, Footer Name (`font-brand-on-parchment`) + Subtitle. Volle Regeln → Card Forge Editor / `CardEffectsModal`. API: `buildCardPortraitPresentation` / `useCardPortraitPresentation`. Legacy: `layout="tcg"`.

### Typografie

| Rolle | Klassen |
|-------|---------|
| **Brand display** | `font-brand uppercase tracking-wide` — Cream auto; siehe [DESIGN.md](../DESIGN.md) §2–4 |
| **Brand muted** | `text-brand-cream-muted` — Rollentext unter Brand-Namen |
| Seitentitel | `text-2xl text-white` |
| Untertitel | `text-sm text-purple-300` |
| Panel-Titel | `text-lg text-white` |
| Body | `text-sm text-white` / `text-gray-400` |
| Klein / Meta | `text-xs text-gray-400` / `text-[10px]` |
| Label | `text-sm text-gray-400` oder `text-white mb-2` |

Keine custom Font-Family für Body — **Brand:** `font-brand` (Bad Suabia Swing), siehe DESIGN.md.

### Abstände & Formen

| Token | Wert |
|-------|------|
| Panel-Padding | `p-3` bis `p-6` |
| Gap in Listen | `gap-2` / `gap-4` |
| Border-Radius Standard | `rounded-lg` |
| Border-Radius Modal | `rounded-2xl` |
| Border Standard | `border border-gray-700` |
| Border Fokus | `focus:border-purple-500 focus:outline-none` |
| Border Akzent | `border-2 border-purple-500/50` |
| Schatten Panel | `shadow-2xl` |
| Transition | `transition-all` / `transition-colors` |

---

## 3. UI Primitives (`src/components/ui/`)

**Regel:** Neue UI nutzt Primitives. Keine rohen `<button>` mit neuen Klassen-Kombinationen.

Jede Primitive-Datei beginnt mit einem Kurzkommentar: Zweck und Ort im Projekt.

### Button

```tsx
// Varianten: primary | secondary | ghost | danger | success
<Button variant="primary">Speichern</Button>
<Button variant="secondary" icon={<Hammer />}>Bearbeiten</Button>
```

| Variante | Verwendung | Stil (Referenz) |
|----------|------------|-----------------|
| `primary` | Hauptaktion | `bg-white text-purple-900` (Header-nav aktiv) oder `bg-purple-600 text-white` |
| `secondary` | Nebenaktion | `bg-purple-800/50 text-white hover:bg-purple-800` |
| `ghost` | Tertiär | `text-purple-400 hover:text-purple-300` |
| `danger` | Löschen, Schaden | `bg-red-600 hover:bg-red-700 text-white` |
| `success` | Bestätigen, Heilen | `bg-green-600 hover:bg-green-700 text-white` |

Gemeinsam: `px-4 py-2 rounded-lg transition-all flex items-center gap-2`

### Input / Textarea / Select

```tsx
<Input label="Kartenname" value={name} onChange={…} />
<Textarea label="Notizen" rows={3} … />
<Select label="Element" options={…} … />
```

Gemeinsame Input-Klassen:
`w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none`

Labels: `block text-white mb-2` oder `text-sm text-gray-400`

### Modal

- Overlay: `fixed inset-0 bg-black/70 backdrop-blur-sm z-50`
- Container: `bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border-2 border-purple-500/50 shadow-2xl`
- Header: `bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-b border-white/10 p-6`
- Schließen: Ghost-Button oder X oben rechts
- `createPortal` für Modals (wie bestehende Modals)

### Panel

Schwebende HUDs / Sidebars:

`bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-purple-500/50 rounded-xl p-3 shadow-2xl backdrop-blur-sm`

### IconButton

Kleine +/- oder Icon-only:
`p-1.5 rounded-lg` + danger/success Varianten (siehe `PlayerHUD`)

---

## 4. Layout-Muster

### App-Shell

```
┌─────────────────────────────────────────────┐
│ Header (brand-header) — Nav, Logo, Letz Fetz │
├─────────────────────────────────────────────┤
│                                             │
│  Main Content (bg-gray-950, volle Höhe)     │
│                                             │
└─────────────────────────────────────────────┘
```

Main-Höhe: `h-[calc(100vh-88px)]`

### Sidebar + Content (Card Forge)

- Sidebar: `bg-gray-900 border-r border-gray-800`, breite ~320px
- Suche: Input mit Icon links (`pl-10`)
- Aktive Liste-Items: `bg-purple-900/30 border-purple-500`

### Modals

- Max-Breite: `max-w-6xl` (groß) / `max-w-lg` (klein)
- Max-Höhe: `max-h-[90vh] overflow-hidden flex flex-col`
- Body scrollt, Header/Footer fix

---

## 5. Spiel-UI (`components/game/`)

Verspielter Ton. Orientierung am physischen Kartentisch.

### Lebensanzeige (HP)

- W20-Metapher: große Zahl zentriert
- Minus/Plus als `IconButton` (danger/success)
- Max 20 — visuell kappen, nicht über 20 erlauben
- Label: „Leben“ (nicht „HP“ in Spiel-UI — deutsch)

### Phasen-Anzeige

Zeige aktuelle Zugphase klar:

`Startphase → Ziehen → Bau-Phase → Aktion → Ende`

- Aktive Phase: `border-purple-500 bg-purple-900/30`
- Erledigte Phase: `opacity-50`
- Kommende: `opacity-30`

### Hand

- Karten horizontal, leicht überlappend
- Nur eigene Hand sichtbar (Gegner: Rückseite oder Anzahl)
- Handlimit 6: Warnung bei 5+, rot bei Überschreitung in Endphase

### Gebaute Karten

- Max 4 Slots, sichtbar vor Spieler
- Erschöpft: Karte gedreht / `opacity-60 rotate-90`
- Widerstand = Zahl auf Karte

### Deck / Ablage

- Stapel-Visualisierung mit Kartenanzahl
- Klick: keine Karteninhalt-Reveal bei gegnerischem Deck

### Kampf-Overlay

- Modal mit Angriffswert vs Blockwert
- W6-Wurf animiert (nutze `DiceRoller`-Logik oder vereinfachte Variante)
- Ergebnis: „X Schaden“ / „Geblockt“ — deutsch

### Bot / Gegner

- Gegnerhand: nur Kartenrücken + Anzahl
- Bot-Züge: kurze Statusmeldung („Gegner spielt Feuer 4 Angriff…“)

---

## 6. Editor-UI (Card Forge & Verwaltung)

Nüchterner Ton. Fokus auf Effizienz.

- Keine Emojis in Form-Labels (ok in Vorschau)
- Tabs für Kartentypen beibehalten
- Speichern-Button: `primary`, disabled während `saving`
- Löschen: `danger` + `confirm()` Dialog
- Fehler: `alert()` vorerst ok; später Toast (Sonner ist installiert)
- Loading: `text-gray-400` Text „Laden…“

### Formular-Muster

```
Label (text-white mb-2)
Input (surface-raised)
Hilfetext (text-xs text-gray-400 mt-1) — optional
```

---

## 7. Icons

- Bibliothek: **lucide-react** only
- Größen: `w-4 h-4` (inline), `w-5 h-5` (Nav), `w-8 h-8` (Hero)
- Keine Emoji-Icons in Editor-Buttons; im Spiel ok (z. B. ⚔️ im Header)

---

## 8. Zustände (Pflicht)

Jede Daten-abhängige View braucht:

| Zustand | Muster |
|---------|--------|
| Loading | Zentrierter Text oder Skeleton in `text-gray-400` |
| Empty | Icon + kurzer deutscher Satz + CTA-Button |
| Error | Rote Border oder `text-red-400` + Retry-Button |
| Disabled | `opacity-50 cursor-not-allowed` |

---

## 9. Accessibility (Minimum)

- Buttons: lesbarer Text oder `title`/`aria-label`
- Fokus: `focus:border-purple-500` auf Inputs
- Kontrast: weißer Text auf `gray-800+`
- Modals: Escape schließt (wenn implementiert)
- Keine reine Farbe für kritische Info (auch Text/Icon)

---

## 10. Do / Don't

### Do

- Primitives aus `components/ui/` importieren
- Bestehende Tailwind-Tokens aus diesem Guide nutzen
- Deutsch für sichtbare Strings
- Komponenten < 250 Zeilen — bei Bedarf splitten
- Kommentar oben in jeder neuen Komponente (Zweck + Ort)

### Don't

- Neue Farbpaletten erfinden
- DaisyUI / shadcn neu einführen (Radix-Reste nicht reaktivieren)
- Inline-Styles außer für dynamische Position (Drag & Drop)
- Englische UI-Labels in neuen Screens
- Game-Logik in React-Komponenten

---

## 11. Migration bestehender Screens

Bestehende Komponenten (`App.tsx`, `CardForge`, `Arena`, …) werden **schrittweise** auf Primitives migriert (Phase 1b).
Neue Screens (ab `components/game/`) **sofort** styleguide-konform bauen.

Priorität Migration:

1. `components/ui/*` Primitives anlegen — ✅
2. `App.tsx` Header-Nav — ✅ (`features/shell` (`AppNav`, `AppBrand`); siehe [DESIGN.md](../DESIGN.md))
3. Neue Game-UI — ✅ (`components/game/`)
4. Card Forge (inkrementell) — ⏳
