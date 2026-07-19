/**
 * Tests for grunge card display model parsing.
 * Location: src/components/cards/cardDisplayModel.test.ts
 */
import { describe, expect, it } from 'vitest';
import { buildCardDisplayModel, elementDefToForgeProps } from './cardDisplayModel';

describe('cardDisplayModel', () => {
  it('maps element card effects to EN labels with DE text', () => {
    const model = buildCardDisplayModel({
      type: 'Element',
      element: 'Fire',
      stats_json: { value: 4, cardType: 'attack', resistance: 4 },
      effects: [
        'Element: Feuer',
        'Typ: Angriff',
        'Wert: 4',
        'Sofort: Angriff 4. Würfle 1W6 für Würfelbonus.',
        'Gebaut: Aktivieren: Füge dem Gegner 2 Schaden zu.',
        'Widerstand: 4',
      ],
    });

    expect(model.statCells).toEqual([
      { label: 'TYPE', value: 'ATTACK' },
      { label: 'VALUE', value: '4' },
      { label: 'RESIST', value: '4' },
    ]);
    expect(model.textBlocks).toEqual([
      { label: 'INSTANT', text: 'Angriff 4. Würfle 1W6 für Würfelbonus.' },
      { label: 'BOUND', text: 'Aktivieren: Füge dem Gegner 2 Schaden zu.' },
    ]);
  });

  it('maps character passive to PASSIVE block', () => {
    const model = buildCardDisplayModel({
      type: 'Character',
      element: 'Earth',
      elementDisplay: 'Erde / Feuer',
      stats_json: { hp: 20 },
      effects: [
        'Elemente: Erde / Feuer',
        'Rolle: Allrounder',
        'Passiv: Einmal pro Zug darfst du ziehen.',
        'Ulti: Mit Alles und Scharf',
      ],
    });

    expect(model.textBlocks.some((b) => b.label === 'PASSIVE')).toBe(true);
    expect(model.statCells).toEqual([{ label: 'HP', value: '20' }]);
  });

  it('builds game element card props with art path', () => {
    const props = elementDefToForgeProps({
      id: 'fire-attack-4',
      name: 'Feuer 4 Angriff',
      kind: 'element',
      element: 'fire',
      cardType: 'attack',
      value: 4,
      instantText: 'Angriff 4.',
      boundText: 'Aktivieren: Schaden.',
    });

    expect(props.image_asset).toBe('/cards/element/fire-attack.png');
    expect(props.type).toBe('Element');
  });
});
