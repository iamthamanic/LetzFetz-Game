/**
 * V5 arena card defs — Konzept §26 (not V1 Bound-centric copy).
 * Location: src/game/packs/v5/arenas.ts
 */
import type { ArenaCardDef } from '../../types';

export const V5_ARENAS: ArenaCardDef[] = [
  {
    id: 'arena-spaeti',
    name: 'Späti der Erleuchtung',
    kind: 'arena',
    role: 'Boosts, Kartenfilter',
    baseEffect:
      'Der erste Boost jedes Spielers pro eigenem Zug erlaubt danach: 1 ziehen, 1 abwerfen.',
    trigger: 'Nach dem ersten Boost des Zuges.',
    specialRule: 'Unter v5Formula nie BUILD_CARD — Extra-Bau nur FORMULA_BUILD/REPLACE.',
  },
  {
    id: 'arena-kristall',
    name: 'Kristallkathedrale',
    kind: 'arena',
    role: 'Heilung, Licht',
    baseEffect: 'Die erste Heilung jedes Spielers pro eigenem Zug wird um 1 erhöht.',
    trigger: 'Erste Heilung des Zuges.',
    specialRule: 'Licht-Essenzen besitzen +1 Stabilität.',
  },
  {
    id: 'arena-vulkan',
    name: 'Vulkan der schlechten Entscheidungen',
    kind: 'arena',
    role: 'Angriff, Druck',
    baseEffect: 'Angriffe erhalten +1 Angriffswert.',
    trigger: 'Nach Aktions- oder Formelangriff ohne Lebensschaden.',
    specialRule: 'Verursacht ein Angriff keinen Lebensschaden, verliert der Angreifer 1 Leben.',
  },
  {
    id: 'arena-sumpf',
    name: 'Sumpf der passiv-aggressiven Heilung',
    kind: 'arena',
    role: 'Block, Defensive',
    baseEffect: 'Jeder Vollblock gibt 1 Schild.',
    trigger: 'Vollblock im Aktionskampf.',
    specialRule: 'Eine Formelkomponente wird erst bei Differenz 4 oder mehr direkt zerstört.',
  },
  {
    id: 'arena-club',
    name: 'Club der fliegenden Backpfeifen',
    kind: 'arena',
    role: 'Luft, Umbau',
    baseEffect: 'Luft-Angriffe und Luft-Blocks erhalten +1 W6-Bonus, maximal +2 gesamt aus Arena.',
    trigger: 'Nach einem Formelersatz.',
    specialRule: 'Nach FORMULA_REPLACE: 1 ziehen und 1 abwerfen.',
  },
  {
    id: 'arena-schattenbasar',
    name: 'Schattenbasar der toxischen Angebote',
    kind: 'arena',
    role: 'Herausfordern, Sabotage',
    baseEffect:
      'Bei erfolgreicher Herausforderung (gestört) darf der Angreifer 1 Leben zahlen, um sofort zu zerstören.',
    trigger: 'Nach Formel-Herausforderung mit Ergebnis gestört.',
    specialRule: 'Zahlung optional; sonst bleibt gestört.',
  },
];
