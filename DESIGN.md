# DESIGN.md — Letz Fetz (Brand & Shell)

Verbindliche Kurzreferenz für **Brand-Identität**, **Farben**, **Typo** und **wo im Code anpassen**.  
Vollständige Primitives & Migration: [`docs/UI_STYLEGUIDE.md`](docs/UI_STYLEGUIDE.md).

**Produkt:** Letz Fetz — taktisches 1v1-Kartenduell (Playtest-Plattform).  
**UI:** Deutsch (Spieltexte) · Nav-Labels **Play / Edit / Sandbox** (Display-English). **Code:** Englisch.

---

## 1. Brand identity

| Asset | Pfad | Verwendung |
|-------|------|------------|
| **Logo (PNG)** | `public/brand/letz-fetz-logo.png` | Header, jede Stelle die „offizielles Logo“ braucht |
| **Logo export** | `features/shell/AppBrand.tsx` + `components/brand/letzFetzLogo.ts` | Einzige Source-of-Truth für Logo-URL |
| **Display-Font** | `public/fonts/BadSuabiaSwing-Regular.woff2` + `.otf` | `--font-brand` / Klasse `font-brand` |
| **Fallback-Font** | `public/fonts/FRAZZLE_.ttf` | Nur wenn Bad Suabia nicht lädt |

**Logo-Regel:** Volles Logo-Bild (Totenkopf + LETZ FETZ + Glitch) — **nicht** nur Text im Header, außer als Notfall-Fallback.

**Lizenz Font:** Bad Suabia Swing — Zigo Attila / Bumbayo Font Fabrik (CC-BY-SA / Free commercial — Credits bei Produkt-Release prüfen).

---

## 2. Brand colors (Logo-Pergament)

Definiert in `src/index.css` `@theme` — **immer diese Tokens**, keine ad-hoc Hex in Komponenten.

### Logo-Analyse (PNG-Referenz)

| Rolle im Logo | Hex | Token |
|---------------|-----|-------|
| Schmutziges Pergament / Buchstaben | `#D9D1C1` | `brand-beige` |
| Pergament Schatten | `#B8A99A` | `brand-beige-shadow` |
| Pergament tief / Übergang | `#A89888` | `brand-beige-deep` |
| Leichtes Highlight (max) | `#E2D9CC` | `brand-beige-light` |
| Blut / Splatter | `#701010` | `brand-blood` |
| Blut tief (Totenkopf-Sonne) | `#5A0C0C` | `brand-blood-deep` |
| Outline / Schatten | `#0A0806` | `brand-outline` |
| Glitch Magenta/Cyan/Lime/Purple | `#FF00FF` … | `glitch-*` (niedrige Opacity) |

**Wichtig:** `brand-cream` (`#F2E8DC`) = **Nav/Headlines auf dunklem UI** — nicht dasselbe wie Logo-Pergament auf Karten.

| Token | Hex | Tailwind | Verwendung |
|-------|-----|----------|------------|
| **brand-cream** | `#f2e8dc` | `text-brand-cream` | `font-brand` auf dunklem Hintergrund (Nav, Setup-Titel) |
| **brand-cream-muted** | `#d9c9b8` | `text-brand-cream-muted` | Sekundäre Brand-Zeile auf dunkel |
| **brand-outline** | `#0a0806` | — | Kartenrahmen, Logo-Stroke |
| **brand-ink** | `#1f1812` | `bg-brand-ink` | Body auf hell (selten) |
| **brand-parchment** | `#2a2218` | `bg-brand-parchment` | Legacy dunkle Balken (Editor-Selten) |
| **brand-beige** | `#d9d1c1` | `bg-brand-beige` | Logo-Pergament — `CharacterSelectCard` Balken + Name-Fill |
| **brand-beige-shadow** | `#b8a99a` | `bg-brand-beige-shadow` | Pergament-Schatten |
| **brand-beige-deep** | `#a89888` | `bg-brand-beige-deep` | Footer unten, Art-Übergang |
| **brand-beige-light** | `#e2d9cc` | `bg-brand-beige-light` | Subtiles Highlight (nie fast-weiß) |
| **brand-blood** | `#701010` | `text-brand-blood` | Splatter, Glow, Divider |
| **brand-blood-deep** | `#5a0c0c` | — | tiefe Flecken |
| **brand-parchment-type** | `#5a0705` | — | `font-brand` auf beige Pergament (Ulti-Labels, …) |
| **glitch-magenta/cyan/lime/purple** | neon | — | Nur Rand-Glitch, ~12–22 % Opacity |

**CharacterSelectCard Typo:** `LetzFetzDisplay` (`--font-logo`) via `.character-card-name-logo` — Logo-Glyphen-Font, nicht Bad Suabia.

**Text auf Pergament (beige Balken):** Fließtext nutzt neutrale Brauntöne; **Bad Suabia (`font-brand`)** auf beige immer **`brand-parchment-type` `#5a0705`** — Logo-Blutbraun, nicht `brand-cream` und nicht schwarzes `brand-ink`.

**Text auf dunklem UI (stone/gray):** Bad Suabia immer **`brand-cream` `#f2e8dc`** via `.font-brand-on-dark` — **nie** `#5a0705` auf dunklem Grund (Kontrast zu gering).

| Klasse | Token | Verwendung |
|--------|-------|------------|
| `.font-brand-on-dark` | Bad Suabia + **`#f2e8dc`** | Brand-Titel auf stone/gray (Sidebar, Nav, …) |
| `.text-on-parchment` | `brand-ink` `#1f1812` | Fließtext-Titel ohne Brand-Font |
| `.text-on-parchment-muted` | `brand-parchment` `#2a2218` | Sekundärtext (Rolle, Effekt) — Normal-Schrift |
| `.font-brand-on-parchment` | Bad Suabia + **`#5a0705`** | Brand-Titel auf beige (Ulti-Name, …) |
| `.font-brand-on-parchment-muted` | Bad Suabia + **`#5a0705`** | kleine Brand-Labels auf beige (z. B. „Ultimativ“) |
| `.character-card-name-logo` | `brand-beige` + Stroke | Legacy Logo-Letter-Fill (nicht für Charakternamen) |
| **Charakternamen** | Bad Suabia + **`#5a0705`** via `CardNamePlateWrittenText` | Alle Kartenflächen (Portrait) |
| `.btn-brand-shimmer` | **`#5a0705`** + Shimmer-Loop | Primär-CTA „Partie starten“ (GameSetup) |
| **Karten-Portrait** | `layout="portrait"` (Default) | Header: Element-Icons · Footer: Name + Subtitle · Details in Editor/Modal |
| **Portrait-API** | `buildCardPortraitPresentation` / `useCardPortraitPresentation` | Subtitle + Icons — Single Source of Truth |

**Karten-Portrait (lg/md/sm/fluid):** Illustration ~55–60 % Höhe; kein TYPE/VALUE-Balken auf der Fläche; Name immer `.font-brand-on-parchment`; Subtitle `.character-card-role-on-beige` (z. B. „Angriff · Wert 4“, Rolle, Kurz-Effekt). Legacy `layout="tcg"` nur für dichte Regeltext-Ansicht.

**Mysterium:** `character.id === 'mysterium'` → ein **??** Brand-Icon (`mystery`), keine Element-Icons.

**Brand UI Icons:** Karten nutzen **Lucide** in Grunge-Ringen (`ElementIcon variant="grunge"`). HF-Raster-Icons optional via `scripts/icons/generate-element-icons.sh` (`variant="brand"` — nicht auf Karten).

**Global Play grunge:** `GrungeAppShell` in `GameView`; `Panel tone="game"` für Spiel-Panels.

**CSS:** `.brand-logo-text` für Logo-Style live text; `.font-brand` auf dunklem UI = cream.

**Nicht Brand-Cream:** Fließtext, Log, Karten-Effekttext, Formular-Labels, Editor-Body — weiter `text-stone-300` / `text-stone-400`.

---

## 3. Brand typography

| Klasse | Font | Farbe | Größe |
|--------|------|-------|-------|
| `font-brand` | Bad Suabia Swing | brand-cream (auto) | ≥ `text-xs` Display only |
| + `uppercase` | — | — | Standard für Brand-Labels |
| + `tracking-wide` / `leading-none` | — | — | Nav, Buttons, Headlines |

**Anti-pattern:** `font-brand` auf Log-Zeilen, Kartenbeschreibungen, Inputs, `<p>` Body unter 14px.

---

## 4. Implementierungs-Checkliste (aktueller Stand)

Wenn du Brand anfasst, diese Dateien prüfen:

### App shell

| Datei | Was |
|-------|-----|
| `src/features/shell/AppBrand.tsx` | Logo `<img>` |
| `src/features/shell/AppNav.tsx` | Labels: Play, Edit, Sandbox |
| `src/components/ui/Tabs.tsx` | Tab-Label: `font-brand` |
| `src/index.css` | tokens, `.brand-logo-text`, `.grunge-app-shell`, parchment/grunge |
| `src/components/ui/BrandLogoText.tsx` | Logo-style live headings |
| `src/components/ui/GrungeAppShell.tsx` | Play/Setup/Match grain |
| `src/services/icons/elementIcons.ts` | 7 brand icons incl. `mystery` |

### Spiel — Setup & Intro

| Datei | Was |
|-------|-----|
| `src/components/game/GameSetup.tsx` | Charakterauswahl, Modus-Titel, Partie starten |
| `src/components/ui/CardGrungeOverlay.tsx` | Grain — `mode="art-panel"` auf Illustration (alle Karten) |
| `src/components/ui/CharacterCardGlitch.tsx` | Logo-Glitch-Balken am Kartenrand |
| `src/components/game/CharacterSelectCard.tsx` | Delegates to LetzFetzCard + idle loop when centered |
| `src/components/ui/CardIllustrationLoop.tsx` | MP4 loop + PNG fallback (`play` / `idle`) |
| `src/services/cardArt/prompts/characterIdleVideos.ts` | Idle prompts; start frame = `/cards/character/{id}.png` |
| `scripts/generate-character-idle-video.ts` | Higgsfield **CLI** Seedance 2.0 image-to-video (not MCP) |
| `src/components/game/CharacterCarousel.tsx` | Dots/Nav — **noch** amber (Spiel-Akzent, kein Brand-Font) |
| `src/components/game/MatchIntro.tsx` | Headlines — **noch** `font-black` / stone (optional: `font-brand` + cream) |

### Card Forge (Editor)

| Datei | Was |
|-------|-----|
| `src/components/Card.tsx` | Forge-Vorschau — alle Typen → `LetzFetzCard` portrait |
| `src/components/cards/LetzFetzCard.tsx` | Grunge-Frame; Default `layout="portrait"` |
| `src/components/cards/cardPortraitPresentation.ts` | Subtitle + Header-Icons (Pure Functions) |
| `src/components/cards/useCardPortraitPresentation.ts` | React-Wrapper für Portrait-Chrome |
| `src/components/cards/grungeCardParts.tsx` | Shared `CardDividerBar`, `CardFrameCorners` |
| `src/components/cards/characterCardProps.ts` | `forgeCharacterDefFromCard()` |
| `src/features/forge/CardLibrary.tsx` | Karten-Bibliothek: Filter-Chips + 4er-Raster |
| `src/features/forge/ForgeView.tsx` | Shell — Body bleibt nüchtern |

### Noch **ohne** Brand-Font (bewusst / später)

| Bereich | Grund |
|---------|--------|
| `GameView` Log, PhaseBar | Lesbarkeit, klein |
| MatchIntro Arena-Titel | noch Standard-Display |
| Card-Liste Namen in Sidebar | `.font-brand-on-dark` (Cream auf stone) |

---

## 5. Design philosophy

| Kontext | Ton |
|---------|-----|
| **Spiel** (`components/game/`) | Verspielt — Glow, Emojis, Arena-Theming |
| **Editor** (Card Forge) | Nüchtern — stone surfaces; **nur** Nav-artige Labels in Brand-Font/Cream |
| **App shell** | Logo links, Nav rechts; Brand-Cream auf Display-Labels |

**Anti-patterns:** Full-width Purple-Pink-Gradient-Bars; generisches SaaS ohne Logo-Palette; `font-brand` auf ganzen Absätzen.

---

## 6. App shell navigation

**Implementierung:** `App.tsx` → `features/shell` (`AppBrand` + `AppNav`) → `components/ui/Tabs`.

### Layout

- **Header:** `bg-stone-950/95 backdrop-blur-md border-b border-stone-800`
- **Brand (links):** Logo-PNG via `AppBrand`
- **Nav (rechts):** Play · Edit · Sandbox (`font-brand` auf Label)
- **Notizen:** Ghost-Button, `aria-label="Notizen öffnen"`

### Tab tones (`Tabs.tsx`)

| View | `tone` | Active |
|------|--------|--------|
| Play | `play` | Emerald/purple glow ring |
| Edit | `editor` | `stone-800` |
| Sandbox | `sandbox` | Amber ring |

### Test-IDs

`app-header`, `app-brand`, `app-nav`, `nav-tab-play`, `nav-tab-forge`, `nav-tab-arena`

### Config

`NAV_ITEMS` in `features/shell/AppNav.tsx` — neue Views nur über Config-Array.

---

## 7. Neue UI — Brand-Regeln

1. Logo braucht? → `LETZ_FETZ_LOGO_SRC` (`components/brand/letzFetzLogo.ts`) / `AppBrand` Pattern, nicht neues PNG-Pfad-Chaos.
2. Kurzes Display-Label (≤ 3 Wörter)? → `font-brand uppercase tracking-wide` (Cream automatisch).
3. Beschreibung / Hilfetext? → **kein** `font-brand`, `text-stone-400`.
4. Neue Farbe? → erst Token in `index.css` `@theme`, dann Tailwind-Klasse.
5. E2E: Nav-Buttons `Play`, `Edit`, `Sandbox` (`e2e/helpers/gameSetup.ts`).

---

## 8. Game surfaces (Kurz)

- **Duell-Board:** Tableau, Arena rechts — `.qa/design/duel-board-tableau.md`
- **MatchIntro:** VS → Letz Fetz → Arena — `.qa/design/match-intro-letz-fetz-crash.md`
- **Charakterkarten:** Pergament `#2a2218` / `#1f1812`, Name `font-brand`, Rolle `text-brand-cream-muted`

---

## 9. Legacy / nicht aktiv

| Item | Status |
|------|--------|
| `LetzFetzDisplay.woff2` | Experiment; nicht in `--font-brand` |
| `assets/font-authoring/` | Higgsfield-Pipeline, optional |
| Frazzle | Fallback in font stack |

---

## 10. References

| Doc | Inhalt |
|-----|--------|
| [UI_STYLEGUIDE.md](docs/UI_STYLEGUIDE.md) | Primitives, Element-Farben, Migration |
| [.qa/acceptance/logo-brand-card-colors.md](../.qa/acceptance/logo-brand-card-colors.md) | Logo + Karten-Palette |
| [.qa/design/letz-fetz-display-font.md](../.qa/design/letz-fetz-display-font.md) | AI-Font Experiment (archiviert) |
| [AGENTS.md](../AGENTS.md) | Architektur |
