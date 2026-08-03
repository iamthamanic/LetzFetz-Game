/**
 * Tests for primary-mark detection in effect prose.
 * Location: src/components/cards/parseEffectTextMarks.test.ts
 */
import { describe, it, expect } from 'vitest';
import type { PrimaryMarkId } from '../../game/types';
import {
  effectTextHasMarks,
  parseEffectTextMarks,
  primaryMarkSurfaceLabelDe,
  type EffectTextSegment,
} from './parseEffectTextMarks';

function markIds(segments: EffectTextSegment[]): PrimaryMarkId[] {
  return segments
    .filter((s): s is Extract<EffectTextSegment, { kind: 'mark' }> => s.kind === 'mark')
    .map((s) => s.markId);
}

describe('parseEffectTextMarks', () => {
  it('leaves plain text unchanged', () => {
    expect(parseEffectTextMarks('Angriffswert −1.')).toEqual([
      { kind: 'text', value: 'Angriffswert −1.' },
    ]);
  });

  it('detects Verstrahlt and Durchnässt', () => {
    expect(
      markIds(
        parseEffectTextMarks(
          'Bei Vollblock erhält der Angreifer Verstrahlt. Treffer → Durchnässt.',
        ),
      ),
    ).toEqual(['erleuchtet', 'durchnaesst']);
  });

  it('maps legacy Aufgewirbelt alias to aufgewirbelt', () => {
    const segs = parseEffectTextMarks('entsteht Aufgewirbelt, sofern');
    expect(segs).toContainEqual({
      kind: 'mark',
      markId: 'aufgewirbelt',
      matched: 'Aufgewirbelt',
    });
    expect(primaryMarkSurfaceLabelDe('aufgewirbelt')).toBe('Verwirbelt');
  });

  it('does not match mark names inside longer words', () => {
    expect(effectTextHasMarks('Hochleistung')).toBe(false);
    expect(effectTextHasMarks('Brennen')).toBe(true);
  });

  it('detects all six V5 primary labels', () => {
    const text =
      'Brennen, Durchnässt, High, Verwirbelt, Verstrahlt und Verflucht.';
    expect(markIds(parseEffectTextMarks(text))).toEqual([
      'brennen',
      'durchnaesst',
      'high',
      'aufgewirbelt',
      'erleuchtet',
      'verflucht',
    ]);
  });
});
