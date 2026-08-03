/**
 * Concise V6 play-rules sections for the Spielregeln modal (Slice-1 PLAYABLE-Prep).
 * Location: src/features/play/board/playRulesSectionsV6.ts
 *
 * Source: docs/letz-fetz-v6-spielkonzept.md — not a full SPIELANLEITUNG_V6_DRAFT yet.
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
      'Play-Default bleibt V5, bis der PLAYABLE-Cutover kommt. Diese Ansicht gilt nur für V6-Partien.',
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
      'Katalysator wird bei Verwendung abgelegt (verbraucht).',
      'Fetzladung +1 nur durch vollständige TEK-Fusion (max 3; max 1 / eigener Zug).',
      'Nach offensiver TEK: in derselben Aktionsphase kein normaler Angriff und keine Herausforderung.',
      'Keine charaktergebundenen Großformeln / Ultis — Überformel folgt später aus aktueller TEK.',
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
      'Mikro-Passive / Macken-Pool: noch nicht spielbar (Konzept §28).',
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
];
