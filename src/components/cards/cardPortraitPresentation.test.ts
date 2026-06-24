/**
 * Tests for portrait card presentation (subtitle + header icons).
 * Location: src/components/cards/cardPortraitPresentation.test.ts
 */
import { describe, expect, it } from 'vitest';
import { buildCardPortraitPresentation } from './cardPortraitPresentation';

describe('cardPortraitPresentation', () => {
  it('builds character subtitle from role and dual header icons', () => {
    const model = buildCardPortraitPresentation({
      id: 'knuspergnom',
      type: 'Character',
      element: 'Neutral',
      gameElements: ['earth', 'fire'],
      role: 'Tank',
      size: 'fluid',
    });

    expect(model.headerIcons).toEqual(['earth', 'fire']);
    expect(model.subtitle).toBe('Tank');
    expect(model.namePlateSize).toBe('lg');
  });

  it('uses mystery icon for mysterium', () => {
    const model = buildCardPortraitPresentation({
      id: 'mysterium',
      type: 'Character',
      element: 'Neutral',
      gameElements: ['shadow', 'light'],
      role: '???',
    });

    expect(model.useMysteryIcon).toBe(true);
    expect(model.headerIcons).toEqual(['mystery']);
  });

  it('builds element subtitle in German', () => {
    const model = buildCardPortraitPresentation({
      id: 'fire-attack-4',
      type: 'Element',
      element: 'Fire',
      stats_json: { value: 4, cardType: 'attack' },
      size: 'md',
    });

    expect(model.headerIcons).toEqual(['fire']);
    expect(model.subtitle).toBe('Angriff · Wert 4');
    expect(model.namePlateSize).toBe('md');
  });

  it('uses first effect line for ultimate subtitle', () => {
    const model = buildCardPortraitPresentation({
      id: 'ulti-knuspergnom',
      type: 'Ultimate',
      element: 'Neutral',
      effects: ['Effekt: Alles fliegt durch die Gegend.'],
    });

    expect(model.subtitle).toBe('Alles fliegt durch die Gegend.');
  });
});
