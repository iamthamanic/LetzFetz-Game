/**
 * V3 reaction ids and unordered element-pair lookup (§8–§9).
 * Location: src/game/engine/status/reactions.ts
 */
import type { Element, PrimaryMarkId } from '../../types';
import { PRIMARY_MARK_BY_ELEMENT } from './elementImpulse';

export type ReactionId =
  | 'inferno'
  | 'ueberflutung'
  | 'deep_high'
  | 'rueckenwind'
  | 'erleuchtung'
  | 'tiefer_fluch'
  | 'dampf'
  | 'hotbox'
  | 'feuersturm'
  | 'sonnenbrand'
  | 'hexenbrand'
  | 'kraeutersud'
  | 'wirbel'
  | 'prisma'
  | 'giftbruehe'
  | 'pollenflug'
  | 'growlight'
  | 'paranoia'
  | 'blendwerk'
  | 'fluestersturm'
  | 'finsternis';

const MARK_TO_ELEMENT: Record<PrimaryMarkId, Element> = {
  brennen: 'fire',
  durchnaesst: 'water',
  high: 'earth',
  aufgewirbelt: 'air',
  erleuchtet: 'light',
  verflucht: 'shadow',
};

/** Canonical key for unordered element pair. */
export function elementPairKey(a: Element, b: Element): string {
  return a <= b ? `${a}+${b}` : `${b}+${a}`;
}

const PAIR_TO_REACTION: Record<string, ReactionId> = {
  'fire+fire': 'inferno',
  'water+water': 'ueberflutung',
  'earth+earth': 'deep_high',
  'air+air': 'rueckenwind',
  'light+light': 'erleuchtung',
  'shadow+shadow': 'tiefer_fluch',
  'fire+water': 'dampf',
  'earth+fire': 'hotbox',
  'air+fire': 'feuersturm',
  'fire+light': 'sonnenbrand',
  'fire+shadow': 'hexenbrand',
  'earth+water': 'kraeutersud',
  'air+water': 'wirbel',
  'light+water': 'prisma',
  'shadow+water': 'giftbruehe',
  'air+earth': 'pollenflug',
  'earth+light': 'growlight',
  'earth+shadow': 'paranoia',
  'air+light': 'blendwerk',
  'air+shadow': 'fluestersturm',
  'light+shadow': 'finsternis',
};

export function reactionIdFor(
  impulseElement: Element,
  markId: PrimaryMarkId,
): ReactionId {
  const markElement = MARK_TO_ELEMENT[markId];
  const key = elementPairKey(impulseElement, markElement);
  const id = PAIR_TO_REACTION[key];
  if (!id) {
    throw new Error(`No reaction for ${key}`);
  }
  return id;
}

export function markElement(markId: PrimaryMarkId): Element {
  return MARK_TO_ELEMENT[markId];
}

export function impulsePrimaryMark(impulseElement: Element): PrimaryMarkId {
  return PRIMARY_MARK_BY_ELEMENT[impulseElement];
}

/** German display names for UI / logs. */
export const REACTION_LABEL_DE: Record<ReactionId, string> = {
  inferno: 'Inferno',
  ueberflutung: 'Überflutung',
  deep_high: 'Deep High',
  rueckenwind: 'Rückenwind',
  erleuchtung: 'Erleuchtung',
  tiefer_fluch: 'Tiefer Fluch',
  dampf: 'Dampf',
  hotbox: 'Hotbox',
  feuersturm: 'Feuersturm',
  sonnenbrand: 'Sonnenbrand',
  hexenbrand: 'Hexenbrand',
  kraeutersud: 'Kräutersud',
  wirbel: 'Wirbel',
  prisma: 'Prisma',
  giftbruehe: 'Giftbrühe',
  pollenflug: 'Pollenflug',
  growlight: 'Growlight',
  paranoia: 'Paranoia',
  blendwerk: 'Blendwerk',
  fluestersturm: 'Flüstersturm',
  finsternis: 'Finsternis',
};
