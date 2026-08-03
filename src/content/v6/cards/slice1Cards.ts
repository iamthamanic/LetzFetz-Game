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
    id: 'v6-essenz-luft',
    name: 'Luft',
    element: 'air',
    stability: 2,
    effectText: 'Tempo und Würfel: bereitet Aktionsökonomie vor.',
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

/** Späti + Vulkan only (Slice-1 arenas). Owned copies — no pack import. */
export const V6_SLICE1_ARENAS: ArenaCardDef[] = [
  {
    id: 'arena-spaeti',
    name: 'Späti der Erleuchtung',
    kind: 'arena',
    role: 'Boosts, Kartenfilter, flexible Züge',
    baseEffect:
      'Nach dem ersten Boost eines Spielers in dessen Zug: 1 ziehen, dann 1 abwerfen (max 1×/Zug).',
    trigger: 'Wenn ein Spieler seinen dritten Boost der Partie spielt, muss er sofort 1 Karte bauen.',
    specialRule: 'Boosts, die Schaden machen, verursachen maximal 3 Schaden.',
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
];
