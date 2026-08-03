/**
 * Split effect prose into plain text + primary Elementmarke tokens (V5 DE labels).
 * Location: src/components/cards/parseEffectTextMarks.ts
 */
import type { PrimaryMarkId } from '../../game/types';
import { PRIMARY_MARK_LABEL_DE } from '../../game/types';

export type EffectTextSegment =
  | { kind: 'text'; value: string }
  | { kind: 'mark'; markId: PrimaryMarkId; matched: string };

/** Surface strings → mark id (longest-first match). Includes legacy catalog aliases. */
const MARK_SURFACE_ALIASES: ReadonlyArray<{ surface: string; markId: PrimaryMarkId }> = [
  { surface: 'Durchnässt', markId: 'durchnaesst' },
  { surface: 'Aufgewirbelt', markId: 'aufgewirbelt' },
  { surface: 'Verwirbelt', markId: 'aufgewirbelt' },
  { surface: 'Verstrahlt', markId: 'erleuchtet' },
  { surface: 'Erleuchtet', markId: 'erleuchtet' },
  { surface: 'Verflucht', markId: 'verflucht' },
  { surface: 'Brennen', markId: 'brennen' },
  { surface: 'High', markId: 'high' },
];

function isWordChar(ch: string): boolean {
  return /\p{L}|\p{N}|_/u.test(ch);
}

function isIsolatedMatch(text: string, start: number, length: number): boolean {
  const before = start > 0 ? text[start - 1]! : '';
  const after = start + length < text.length ? text[start + length]! : '';
  if (before && isWordChar(before)) return false;
  if (after && isWordChar(after)) return false;
  return true;
}

/**
 * Find the earliest isolated mark surface in `text` at/after `from`.
 * Prefers longer surfaces when several start at the same index.
 */
function findNextMark(
  text: string,
  from: number,
): { index: number; surface: string; markId: PrimaryMarkId } | null {
  let best: { index: number; surface: string; markId: PrimaryMarkId } | null = null;

  for (const { surface, markId } of MARK_SURFACE_ALIASES) {
    let searchFrom = from;
    while (searchFrom < text.length) {
      const index = text.indexOf(surface, searchFrom);
      if (index === -1) break;
      if (isIsolatedMatch(text, index, surface.length)) {
        if (
          !best ||
          index < best.index ||
          (index === best.index && surface.length > best.surface.length)
        ) {
          best = { index, surface, markId };
        }
        break;
      }
      searchFrom = index + 1;
    }
  }

  return best;
}

/** Canonical V5 display label for a primary mark. */
export function primaryMarkSurfaceLabelDe(markId: PrimaryMarkId): string {
  return PRIMARY_MARK_LABEL_DE[markId];
}

/** Parse effect description into text / mark segments (empty → one empty text segment). */
export function parseEffectTextMarks(text: string): EffectTextSegment[] {
  if (!text) return [{ kind: 'text', value: '' }];

  const segments: EffectTextSegment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const hit = findNextMark(text, cursor);
    if (!hit) {
      segments.push({ kind: 'text', value: text.slice(cursor) });
      break;
    }
    if (hit.index > cursor) {
      segments.push({ kind: 'text', value: text.slice(cursor, hit.index) });
    }
    segments.push({ kind: 'mark', markId: hit.markId, matched: hit.surface });
    cursor = hit.index + hit.surface.length;
  }

  return segments.length > 0 ? segments : [{ kind: 'text', value: text }];
}

/** True when prose mentions at least one known primary mark. */
export function effectTextHasMarks(text: string): boolean {
  return parseEffectTextMarks(text).some((s) => s.kind === 'mark');
}
