/**
 * Tests for portrait card presentation (subtitle + effect + element badge).
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
    expect(model.showHeader).toBe(true);
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

  it('hides element header and shows element badge instead of type badge', () => {
    const model = buildCardPortraitPresentation({
      id: 'fire-attack-4',
      type: 'Element',
      element: 'Fire',
      stats_json: { value: 4, cardType: 'attack' },
      effects: [
        'Sofort: Angriff 4. Würfle 1W6 für Bonus.',
        'Gebaut: Aktivieren: Füge dem Gegner 2 Schaden zu.',
      ],
      size: 'md',
    });

    expect(model.showHeader).toBe(false);
    expect(model.headerIcons).toEqual([]);
    expect(model.subtitle).toBeNull();
    expect(model.typeBadge).toBeNull();
    expect(model.elementBadge).toBe('Feuer');
    expect(model.effectLine).toContain('Angriff 4');
    expect(model.namePlateSize).toBe('md');
  });

  it('prefers bound effect text when effectFocus is bound', () => {
    const model = buildCardPortraitPresentation({
      id: 'water-boost-3',
      type: 'Element',
      element: 'Water',
      stats_json: { value: 3, cardType: 'boost' },
      effects: [
        'Sofort: Heile 2 Leben.',
        'Gebaut: Aktivieren: Ziehe 1 Karte.',
      ],
      effectFocus: 'bound',
      size: 'md',
    });

    expect(model.elementBadge).toBe('Wasser');
    expect(model.typeBadge).toBeNull();
    expect(model.effectLine).toContain('Ziehe 1 Karte');
  });

  it('shows element badge for block cards without type overlay', () => {
    const model = buildCardPortraitPresentation({
      id: 'fire-block-6',
      type: 'Element',
      element: 'Fire',
      stats_json: { value: 6, cardType: 'block' },
      effects: ['Sofort: Block 6. Würfle 1W6 für Bonus.'],
      size: 'sm',
    });

    expect(model.showHeader).toBe(false);
    expect(model.typeBadge).toBeNull();
    expect(model.elementBadge).toBe('Feuer');
    expect(model.subtitle).toBeNull();
  });

  it('uses first effect line for ultimate subtitle', () => {
    const model = buildCardPortraitPresentation({
      id: 'ulti-knuspergnom',
      type: 'Ultimate',
      element: 'Neutral',
      effects: ['Effekt: Alles fliegt durch die Gegend.'],
    });

    expect(model.subtitle).toBe('Alles fliegt durch die Gegend.');
    expect(model.showHeader).toBe(true);
  });

  it('shows Glitch badge without header icons', () => {
    const model = buildCardPortraitPresentation({
      id: 'glitch-illegal',
      type: 'Glitch',
      element: 'Neutral',
      effects: ['Effekt: Ziehe 2 Karten.'],
    });

    expect(model.showHeader).toBe(false);
    expect(model.headerIcons).toEqual([]);
    expect(model.elementBadge).toBe('Glitch');
  });

  it('shows Formel + role badges for formula cards', () => {
    const model = buildCardPortraitPresentation({
      id: 'v5-technik-durchschuss',
      type: 'Formula',
      element: 'Neutral',
      effects: ['Rolle: Technik', 'Effekt: Der nächste Angriff ignoriert 1 Schild.'],
    });

    expect(model.showHeader).toBe(false);
    expect(model.typeBadge).toBe('Formel');
    expect(model.elementBadge).toBe('Technik');
    expect(model.effectLine).toContain('Schild');
  });
});
