/**
 * Paths + German labels for V3 primary Elementmarken token art.
 * Location: src/components/cards/elementMarkArt.ts
 */
import type { Element, PrimaryMarkId, StatusId } from '../../game/types';
import { PRIMARY_MARK_BY_ELEMENT } from '../../game/engine/status/elementImpulse';

/** Display label — light primary mark is Verstrahlt (was Erleuchtet). */
export const PRIMARY_MARK_LABEL_DE: Record<PrimaryMarkId, string> = {
  brennen: 'Brennen',
  durchnaesst: 'Durchnässt',
  high: 'High',
  aufgewirbelt: 'Aufgewirbelt',
  erleuchtet: 'Verstrahlt',
  verflucht: 'Verflucht',
};

export const PRIMARY_MARK_IDS: readonly PrimaryMarkId[] = [
  'brennen',
  'durchnaesst',
  'high',
  'aufgewirbelt',
  'erleuchtet',
  'verflucht',
] as const;

/** All six Elementeffekte with their source element (library / tutorial). */
export const PRIMARY_MARK_ENTRIES: readonly {
  element: Element;
  markId: PrimaryMarkId;
}[] = (Object.entries(PRIMARY_MARK_BY_ELEMENT) as [Element, PrimaryMarkId][]).map(
  ([element, markId]) => ({ element, markId }),
);

/** Square effect PNGs under public/icons/marks/ (ollama x/z-image-turbo). */
export function resolvePrimaryMarkArtPath(markId: PrimaryMarkId): string {
  return `/icons/marks/${markId}.png?v=32`;
}

export function isPrimaryMarkId(id: StatusId): id is PrimaryMarkId {
  return (PRIMARY_MARK_IDS as readonly string[]).includes(id);
}
