/** Playable elements in Letz Fetz V1. */
export type Element = 'fire' | 'water' | 'earth' | 'air' | 'shadow' | 'light';

/** Counter ring: attacker counters defender → +1 attack bonus in block scenarios. */
export const COUNTERS: Record<Element, Element> = {
  fire: 'earth',
  water: 'fire',
  earth: 'air',
  air: 'light',
  shadow: 'water',
  light: 'shadow',
};

export function countersElement(attacker: Element, defender: Element): boolean {
  return COUNTERS[attacker] === defender;
}
