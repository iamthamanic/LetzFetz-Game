/**
 * Unit tests for card → Elementmarke resolution.
 * Location: src/components/cards/elementMarks.test.ts
 */
import { describe, expect, it } from 'vitest';
import { resolveCardElementMarks } from './elementMarks';

describe('resolveCardElementMarks', () => {
  it('maps character dual elements to marks', () => {
    const info = resolveCardElementMarks({
      id: 'kokabell',
      type: 'Character',
      element: 'Water',
      gameElements: ['water', 'light'],
    });
    expect(info.elements).toEqual(['water', 'light']);
    expect(info.marks.map((m) => m.id)).toEqual(['durchnaesst', 'erleuchtet']);
    expect(info.icons).toHaveLength(2);
  });

  it('maps fire element card to Brennen', () => {
    const info = resolveCardElementMarks({
      id: 'v3-fire-attack-4-1',
      type: 'Element',
      element: 'Fire',
    });
    expect(info.marks[0]?.label).toBe('Brennen');
    expect(info.icons).toEqual(['fire']);
  });

  it('labels light primary mark as Verstrahlt', () => {
    const info = resolveCardElementMarks({
      id: 'v3-light-attack-4-1',
      type: 'Element',
      element: 'Light',
    });
    expect(info.marks[0]?.id).toBe('erleuchtet');
    expect(info.marks[0]?.label).toBe('Verstrahlt');
  });

  it('uses mystery for mysterium', () => {
    const info = resolveCardElementMarks({
      id: 'mysterium',
      type: 'Character',
      element: 'Frei',
      gameElements: ['light', 'shadow'],
    });
    expect(info.useMysteryIcon).toBe(true);
    expect(info.marks).toEqual([]);
    expect(info.icons).toEqual(['mystery']);
  });
});
