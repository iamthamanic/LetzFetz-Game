/**
 * Slice-1 V6 card definitions (techniques / essences / catalysts / arenas).
 * Location: src/content/v6/cards/slice1Cards.ts
 *
 * Playtest values — engine execute lands in a later Slice-1 issue.
 * Arenas are owned copies (no V5 pack import from content).
 */
import type {
  ArenaCardDef,
  CatalystCardDef,
  EssenceCardDef,
  TechniqueCardDef,
} from '../../../game/types';

export const V6_SLICE1_TECHNIQUES: TechniqueCardDef[] = [
  {
    kind: 'technique',
    id: 'v6-technik-impulsgeschoss',
    name: 'Impulsgeschoss',
    stability: 3,
    activationMode: 'instant',
    effectText: 'Zuverlässiger Formelschaden. Mit Essenz und Katalysator zur Fusion.',
  },
  {
    kind: 'technique',
    id: 'v6-technik-adrenalinschrei',
    name: 'Adrenalinschrei',
    stability: 3,
    activationMode: 'prep_attack',
    effectText: 'Bereitet die nächste Aktionskarte vor (Angriff/Boost).',
  },
  {
    kind: 'technique',
    id: 'v6-technik-magiepanzer',
    name: 'Magiepanzer',
    stability: 4,
    activationMode: 'instant',
    effectText: 'Schild und defensive Formelvorbereitung.',
  },
];

export const V6_SLICE1_ESSENCES: EssenceCardDef[] = [
  {
    kind: 'essence',
    id: 'v6-essenz-feuer',
    name: 'Feuer',
    element: 'fire',
    stability: 2,
    effectText: 'Druck: verstärkt offensive Formeln; Rider oft gegnergerichtet.',
  },
  {
    kind: 'essence',
    id: 'v6-essenz-wasser',
    name: 'Wasser',
    element: 'water',
    stability: 3,
    effectText: 'Heilung und Reinigung über Formelprimärwert oder Rider.',
  },
  {
    kind: 'essence',
    id: 'v6-essenz-erde',
    name: 'Erde',
    element: 'earth',
    stability: 4,
    effectText: 'Stabilität: härtet Formeln; Rider stärkt Halt und Widerstand.',
  },
  {
    kind: 'essence',
    id: 'v6-essenz-luft',
    name: 'Luft',
    element: 'air',
    stability: 2,
    effectText: 'Tempo und Würfel: bereitet Aktionsökonomie vor.',
  },
  {
    kind: 'essence',
    id: 'v6-essenz-licht',
    name: 'Licht',
    element: 'light',
    stability: 3,
    effectText: 'Schild und Reinigung: schützt und klärt Marken über Rider.',
  },
  {
    kind: 'essence',
    id: 'v6-essenz-schatten',
    name: 'Schatten',
    element: 'shadow',
    stability: 2,
    effectText: 'Fluch und Erschöpfung: schwächt gegnerische Formelkomponenten.',
  },
];

export const V6_SLICE1_CATALYSTS: CatalystCardDef[] = [
  {
    kind: 'catalyst',
    id: 'v6-katalysator-ueberladung',
    name: 'Überladung',
    stability: 2,
    effectText:
      'Erhöht den Primärwert um 2. Nach Auflösung verlierst du 1 Leben. Wird verbraucht (Ablage).',
  },
  {
    kind: 'catalyst',
    id: 'v6-katalysator-verdichtung',
    name: 'Verdichtung',
    stability: 4,
    effectText:
      'Erhöht den Primärwert um 1. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Wird verbraucht.',
  },
  {
    kind: 'catalyst',
    id: 'v6-katalysator-sofortzuender',
    name: 'Sofortzünder',
    stability: 2,
    effectText:
      'Primärwert −1. Nach Auflösung: 1 ziehen, dann 1 abwerfen. Wird verbraucht.',
  },
  {
    kind: 'catalyst',
    id: 'v6-katalysator-opfergabe',
    name: 'Opfergabe',
    stability: 3,
    effectText:
      'Optional 1 Handkarte abwerfen: Primärwert +2. Wird verbraucht (Ablage).',
  },
];

/**
 * V6 core arenas (#350) — owned copies, no V5/Base import, no V1 d6Variants.
 * Art: public/cards/arena/{id}.png
 */
export const V6_SLICE1_ARENAS: ArenaCardDef[] = [
  {
    id: 'arena-spaeti',
    name: 'Späti der Erleuchtung',
    kind: 'arena',
    role: 'Boosts, Kartenfilter',
    baseEffect:
      'Nach dem ersten Boost eines Spielers in dessen Zug: 1 ziehen, dann 1 abwerfen (max 1×/Zug).',
    trigger: 'Erster Boost des eigenen Zuges.',
    specialRule:
      'Boosts, die Schaden machen, verursachen maximal 3 Schaden. Unter Formelboard kein Bound-Extra-Bau.',
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
    role: 'Angriff, Feuer, Druck',
    baseEffect:
      'Der erste aktiv deklarierte gegnergerichtete Schadenseffekt pro Zug erhält +1. Ohne Lebensschaden: −1 Leben danach.',
    trigger:
      'Wenn ein Spieler in seinem Zug keinen Angriff spielt und keine gegnerische gebaute Karte herausfordert, verliert er am Ende seines Zuges 1 Leben.',
    specialRule:
      'Wenn ein einzelner Angriff nach allen Boni einen Angriffswert von 9 oder höher erreicht, verliert der Angreifer nach der Abrechnung 1 Leben.',
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
    baseEffect:
      'Luft-Angriffe und Luft-Blocks erhalten +1 Arena-Wert (W6-Bonus-Proxy). Bewusstes ±1 auf den W6 zusätzlich über Affinität, wenn Luft Affinität ist.',
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
