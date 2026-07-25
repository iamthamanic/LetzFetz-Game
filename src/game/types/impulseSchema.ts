/**
 * Pack schema for V3 element impulse keywords (Treffer / Vollblock).
 * Location: src/game/types/impulseSchema.ts
 */
import type { Element } from './elements';

/** When a card effect may emit an element impulse. */
export type ImpulseTrigger = 'onHit' | 'onFullBlock';

export const IMPULSE_TRIGGERS: readonly ImpulseTrigger[] = ['onHit', 'onFullBlock'] as const;

const ELEMENTS: readonly Element[] = [
  'fire',
  'water',
  'earth',
  'air',
  'shadow',
  'light',
] as const;

/** Typed keyword on a card: which impulse fires on which combat outcome. */
export interface ElementImpulseKeyword {
  element: Element;
  trigger: ImpulseTrigger;
}

export function isImpulseTrigger(value: unknown): value is ImpulseTrigger {
  return typeof value === 'string' && (IMPULSE_TRIGGERS as readonly string[]).includes(value);
}

export function isElement(value: unknown): value is Element {
  return typeof value === 'string' && (ELEMENTS as readonly string[]).includes(value);
}

/**
 * Narrow unknown pack JSON into an ElementImpulseKeyword.
 * Returns null when absent; throws on malformed present values.
 */
export function parseElementImpulseKeyword(raw: unknown): ElementImpulseKeyword | null {
  if (raw === undefined || raw === null) return null;
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('elementImpulse must be an object');
  }
  const record = raw as Record<string, unknown>;
  if (!isElement(record.element)) {
    throw new Error('elementImpulse.element must be a valid Element');
  }
  if (!isImpulseTrigger(record.trigger)) {
    throw new Error('elementImpulse.trigger must be onHit or onFullBlock');
  }
  return { element: record.element, trigger: record.trigger };
}

/** Validate optional impulse field on a card-shaped record. */
export function validateCardElementImpulse(
  card: Record<string, unknown>,
): ElementImpulseKeyword | null {
  return parseElementImpulseKeyword(card.elementImpulse);
}
