/**
 * Converts rules-engine BASE_PACK into Card Forge library entries.
 * Location: src/services/cardForge/packToForge.ts
 */
import type { ContentPack, Element } from '../../game/types';
import { BASE_PACK } from '../../game/packs/base-pack';
import { resolveCardArtPath } from '../cardArt/manifest';
import type { ForgeCardData, ForgeElement } from './types';

const ELEMENT_LABELS: Record<Element, ForgeElement> = {
  fire: 'Fire',
  water: 'Water',
  earth: 'Earth',
  air: 'Air',
  shadow: 'Shadow',
  light: 'Light',
};

const ELEMENT_DE: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

const CARD_TYPE_DE: Record<string, string> = {
  attack: 'Angriff',
  block: 'Block',
  boost: 'Boost',
};

function toForgeElement(element: Element): ForgeElement {
  return ELEMENT_LABELS[element];
}

function characterElementLabel(elements: [Element, Element]): ForgeElement {
  if (elements[0] === 'light' && elements[1] === 'shadow') return 'Frei';
  return toForgeElement(elements[0]);
}

function characterElementDisplay(elements: [Element, Element]): string {
  if (elements[0] === 'light' && elements[1] === 'shadow') return 'Frei / Frei';
  return `${ELEMENT_DE[elements[0]]} / ${ELEMENT_DE[elements[1]]}`;
}

export function packToForgeCards(pack: ContentPack = BASE_PACK): ForgeCardData[] {
  const cards: ForgeCardData[] = [];

  for (const c of pack.characters) {
    const ult = pack.ultimates.find((u) => u.id === c.ultimateId);
    cards.push({
      id: c.id,
      name: c.name,
      type: 'Character',
      element: characterElementLabel(c.elements),
      elements: [toForgeElement(c.elements[0]), toForgeElement(c.elements[1])],
      elementDisplay: characterElementDisplay(c.elements),
      stats_json: { hp: 20 },
      effects: [
        `Elemente: ${ELEMENT_DE[c.elements[0]]} / ${ELEMENT_DE[c.elements[1]]}`,
        `Rolle: ${c.role}`,
        `Passiv: ${c.passiveText}`,
        `Ulti: ${ult?.name ?? c.ultimateId}`,
        `Strategie: ${c.strategyHint}`,
      ],
      image_asset: resolveCardArtPath(c.id),
      fromPack: true,
    });
  }

  for (const u of pack.ultimates) {
    const char = pack.characters.find((c) => c.id === u.characterId);
    cards.push({
      id: u.id,
      name: u.name,
      type: 'Ultimate',
      element: char ? characterElementLabel(char.elements) : 'Neutral',
      elements: char
        ? ([toForgeElement(char.elements[0]), toForgeElement(char.elements[1])] as [
            ForgeElement,
            ForgeElement,
          ])
        : undefined,
      elementDisplay: char ? characterElementDisplay(char.elements) : undefined,
      stats_json: {},
      effects: [
        `Charakter: ${char?.name ?? u.characterId}`,
        `Effekt: ${u.effectText}`,
        'Einmal pro Spiel. Danach umdrehen.',
        'Zählt als Hauptaktion. Kann nicht geblockt werden.',
      ],
      image_asset: resolveCardArtPath(u.id),
      fromPack: true,
    });
  }

  for (const e of pack.elementCards) {
    cards.push({
      id: e.id,
      name: e.name,
      type: 'Element',
      element: toForgeElement(e.element),
      stats_json: {
        value: e.value,
        cardType: e.cardType,
        resistance: e.value,
      },
      effects: [
        `Element: ${ELEMENT_DE[e.element]}`,
        `Typ: ${CARD_TYPE_DE[e.cardType]}`,
        `Wert: ${e.value}`,
        `Sofort: ${e.instantText}`,
        `Gebaut: ${e.boundText}`,
        `Widerstand: ${e.value}`,
      ],
      image_asset: resolveCardArtPath(e.id),
      fromPack: true,
    });
  }

  for (const a of pack.arenas) {
    const effects = [
      `Rolle: ${a.role}`,
      `Grundeffekt: ${a.baseEffect}`,
      `Trigger: ${a.trigger}`,
      `Sonderregel: ${a.specialRule}`,
    ];
    if (a.d6Variants) {
      effects.push(
        'Varianten 1–2: ' + a.d6Variants[0],
        'Varianten 3–4: ' + a.d6Variants[1],
        'Varianten 5–6: ' + a.d6Variants[2],
      );
    }
    cards.push({
      id: a.id,
      name: a.name,
      type: 'Arena',
      element: 'Neutral',
      stats_json: {},
      effects,
      image_asset: resolveCardArtPath(a.id),
      fromPack: true,
    });
  }

  for (const g of pack.glitches) {
    cards.push({
      id: g.id,
      name: g.name,
      type: 'Glitch',
      element: 'Neutral',
      stats_json: {},
      effects: [
        `Typ: ${g.glitchType === 'instant' ? 'Sofort-Glitch' : 'Spielbarer Glitch'}`,
        `Timing: ${g.timing}`,
        `Effekt: ${g.effectText}`,
      ],
      image_asset: resolveCardArtPath(g.id),
      fromPack: true,
    });
  }

  return cards;
}

export function mergeForgeOverlays(
  packCards: ForgeCardData[],
  overlays: Partial<ForgeCardData>[],
): ForgeCardData[] {
  const overlayById = new Map(overlays.filter((o) => o.id).map((o) => [o.id!, o]));
  return packCards.map((card) => {
    const overlay = overlayById.get(card.id);
    if (!overlay) return card;
    return {
      ...card,
      image_asset: overlay.image_asset || card.image_asset,
      notes: overlay.notes ?? card.notes,
      updated_at: overlay.updated_at ?? card.updated_at,
    };
  });
}
