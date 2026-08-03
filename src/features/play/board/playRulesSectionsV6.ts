/**
 * Concise V6 play-rules sections for the Spielregeln modal (Slice-1 PLAYABLE-Prep).
 * Location: src/features/play/board/playRulesSectionsV6.ts
 *
 * Source: docs/rules/SPIELANLEITUNG_V6_DRAFT.md + docs/letz-fetz-v6-spielkonzept.md
 */
import type { RulesSection } from './playRulesSections';

function section(id: string, title: string, body: string): RulesSection {
  return { id, title, body: body.trim() };
}

export const V6_PLAY_RULE_SECTIONS: RulesSection[] = [
  section(
    'v6-ueberblick',
    'V6 Überblick (Slice-1)',
    [
      'V6 ersetzt die Funktionsweise der Formeln (Rezepte), nicht das Grundspiel.',
      'Ein Match ist strikt V6 oder strikt V5 — nie gemischt.',
      'Play-Default ist V6 (`v6Formula`). V5 bleibt als Legacy/Regression wählbar.',
      'Diese Ansicht gilt nur für V6-Partien.',
      '30 Leben · max 5 Schild · Handlimit 6 · 3 Formelplätze (Technik · Essenz · Katalysator).',
    ].join('\n'),
  ),
  section(
    'v6-aufbau',
    'Partieaufbau',
    [
      'Beide ziehen 7; Startspieler behält 5, Zweiter behält 6; Rest zurück in den Hauptstapel.',
      'Arena vor der Kartenwahl. Start ohne Schild, Marken, Formel, Fetz, Elementarladung.',
      'Keine Sofort-Glitches im V6-Core-Pack.',
    ].join('\n'),
  ),
  section(
    'v6-formel',
    'Formel & Rezepte',
    [
      'Aktivierung über Authoring-Rezepte (TE / TK / EK / TEK). Fehlende Pflichtkombination = Build-Fehler, kein Runtime-Raten.',
      'Katalysator wird bei Verwendung abgelegt (verbraucht) — außer Echo/Verzögerung: bleibt bis Startphase-Auflösung.',
      'Echo: Primär sofort, dann fest +1 desselben Primärs in der nächsten Startphase. Verzögerung: Primär + fester +2 in der nächsten Startphase.',
      'Konstrukte: max 1 pro Spieler; eigene Zone neben dem Formelgestell. Beschwörung (EK) über „Formel aktivieren“. Haltbarkeit −1 in der Startphase; herausforderbar (stören/zerstören, kein LP-Schaden). Neu ersetzt alt.',
      'Fetzladung +1 nur durch vollständige TEK-Fusion (max 3; max 1 / eigener Zug).',
      'Überformel: bei 3 Fetz + aufrechter TEK — verstärkte aktuelle Fusion (fester Slice-1-Bonus +2 Primär). Fetz → 0. Keine charaktergebundenen Ultis.',
      'Nach offensiver TEK/Überformel: in derselben Aktionsphase kein normaler Angriff und keine Herausforderung.',
      'Keine charaktergebundenen Großformeln / Ultis — nur Überformel aus aktueller TEK.',
    ].join('\n'),
  ),
  section(
    'v6-abwehr',
    'Formelabwehr (V6)',
    [
      'W6 gegen Formelangriff: 1–2 voll · 3–4 −1 Primär · 5–6 −2 Primär und Rider weg.',
      'Aktionsphase: nur Block gegen Aktionsangriffe (kein Block gegen Formelschaden).',
    ].join('\n'),
  ),
  section(
    'v6-charakter',
    'Charakter & Affinität',
    [
      'Zwei Affinitätselemente pro Charakter. 1× pro eigenem Zug/Durchlauf: Wert +1 oder eigenen W6 ±1 auf passende Elementkarte (nach dem Wurf).',
      'Keine V5-Charakterpassiven und keine Ultis in V6.',
      'Feste Macke pro Charakter (Option B): 1×/eigener Zug, Budget §28 — Info/Filter/Flex, kein Fetz, keine Extra-Aktion. Affinität und Macke nicht als doppelter ±1-Stack auf dieselbe Aktion (Falsche Farbe erweitert nur Affinität-Eligibilität).',
    ].join('\n'),
  ),
  section(
    'v6-zug',
    'Zugablauf (Kurz)',
    [
      'Start → 1 ziehen → ≤2 Formeländerungen (1. gratis, 2. kostet Abwurf) → ≤1 Formelaktivierung → ≤1 Hauptaktion → Handlimit.',
      'Rückbau ohne Aktivierung möglich laut Engine/Slice-1 Lifecycle.',
    ].join('\n'),
  ),
  section(
    'v6-element',
    'Elementkarten (Hand-only)',
    [
      'Nur Handaktionen: Angriff, Block, Boost. Nicht auf Formelplätze baubar; kein Bound/Aktivieren.',
      'Wertrollen: 2 Starter · 3 Standard · 4 bedingter Payoff (+1 wenn Gegner Fessel hat) · 6 Rohwert mit Nachteil (−1 Leben nach dem Kampf).',
    ].join('\n'),
  ),
  section(
    'v6-arenen',
    'Arenen (V6)',
    [
      'Sechs Kern-Arenen: Späti · Kristall · Vulkan · Sumpf · Club · Schattenbasar — immer aktiv, symmetrisch.',
      'Vulkan: erster gegnergerichteter Schadenseffekt/Zug +1; ohne Lebensschaden → Angreifer −1.',
      'Sumpf: Vollblock → +1 Schild; Formel-Zerstörung erst ab Differenz 4.',
      'Club: Luft-Karten +1 Arena-Wert; nach Formelersatz 1 ziehen / 1 abwerfen.',
      'Schattenbasar: nach Formel-Störung optional 1 Leben zahlen → zerstören.',
      'Elementreaktionen: max 1 pro Timing.',
      'Riss in der Realität wechselt die Arena zufällig (sofort gültig).',
    ].join('\n'),
  ),
];
