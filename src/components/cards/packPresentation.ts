/**
 * Neutral pack → card presentation records (shared by Forge and Play).
 * Location: src/components/cards/packPresentation.ts
 */
import type { ContentPack, Element } from '../../game/types';
import { BASE_PACK } from '../../game/packs/base-pack';
import { resolveCardArtPath } from '../../services/cardArt/manifest';
import type { CardElement, CardKind } from './cardTypes';

export interface CardPresentationData {
  id: string;
  name: string;
  type: CardKind;
  element: CardElement;
  elements?: [CardElement, CardElement];
  elementDisplay?: string;
  stats_json: {
    hp?: number;
    value?: number;
    cardType?: 'attack' | 'block' | 'boost';
    resistance?: number;
  };
  effects: string[];
  image_asset: string;
  /**
   * Formel-Kombination: ordered component art paths (Technik → Essenz → Katalysator).
   * Used when there is no single hero PNG (V6 product: no per-combo artwork).
   */
  component_images?: string[];
  notes?: string;
  fromPack?: boolean;
  created_at?: string;
  updated_at?: string;
}

const ELEMENT_LABELS: Record<Element, CardElement> = {
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

function toCardElement(element: Element): CardElement {
  return ELEMENT_LABELS[element];
}

function characterElementLabel(elements: [Element, Element]): CardElement {
  if (elements[0] === 'light' && elements[1] === 'shadow') return 'Frei';
  return toCardElement(elements[0]);
}

function characterElementDisplay(elements: [Element, Element]): string {
  if (elements[0] === 'light' && elements[1] === 'shadow') return 'Frei / Frei';
  return `${ELEMENT_DE[elements[0]]} / ${ELEMENT_DE[elements[1]]}`;
}

export function packToPresentationCards(
  pack: ContentPack = BASE_PACK,
): CardPresentationData[] {
  const cards: CardPresentationData[] = [];

  for (const c of pack.characters) {
    const ult = pack.ultimates.find((u) => u.id === c.ultimateId);
    cards.push({
      id: c.id,
      name: c.name,
      type: 'Character',
      element: characterElementLabel(c.elements),
      elements: [toCardElement(c.elements[0]), toCardElement(c.elements[1])],
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
        ? ([toCardElement(char.elements[0]), toCardElement(char.elements[1])] as [
            CardElement,
            CardElement,
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
      element: toCardElement(e.element),
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
        ...(e.boundText
          ? [`Gebaut: ${e.boundText}`, `Widerstand: ${e.value}`]
          : ['Handaktion (V6) — nicht baubar']),
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

  const FORMULA_ROLE_DE = {
    technique: 'Technik',
    essence: 'Essenz',
    catalyst: 'Katalysator',
  } as const;

  const ACTIVATION_MODE_DE: Record<string, string> = {
    prep_attack: 'Angriff vorbereiten',
    prep_block: 'Block vorbereiten',
    prep_boost: 'Boost vorbereiten',
    instant: 'Sofort',
  };

  for (const t of pack.techniques ?? []) {
    cards.push({
      id: t.id,
      name: t.name,
      type: 'Formula',
      element: 'Neutral',
      stats_json: { resistance: t.stability },
      effects: [
        `Rolle: ${FORMULA_ROLE_DE.technique}`,
        `Stabilität: ${t.stability}`,
        `Modus: ${ACTIVATION_MODE_DE[t.activationMode] ?? t.activationMode}`,
        `Effekt: ${t.effectText}`,
      ],
      image_asset: resolveCardArtPath(t.id),
      fromPack: true,
    });
  }

  for (const e of pack.essences ?? []) {
    cards.push({
      id: e.id,
      name: e.name,
      type: 'Formula',
      element: toCardElement(e.element),
      stats_json: { resistance: e.stability },
      effects: [
        `Rolle: ${FORMULA_ROLE_DE.essence}`,
        `Element: ${ELEMENT_DE[e.element]}`,
        `Stabilität: ${e.stability}`,
        `Effekt: ${e.effectText}`,
      ],
      image_asset: resolveCardArtPath(e.id),
      fromPack: true,
    });
  }

  for (const c of pack.catalysts ?? []) {
    cards.push({
      id: c.id,
      name: c.name,
      type: 'Formula',
      element: 'Neutral',
      stats_json: { resistance: c.stability },
      effects: [
        `Rolle: ${FORMULA_ROLE_DE.catalyst}`,
        `Stabilität: ${c.stability}`,
        `Effekt: ${c.effectText}`,
      ],
      image_asset: resolveCardArtPath(c.id),
      fromPack: true,
    });
  }

  const ITEM_TIMING_DE = {
    action: 'Aktion',
    reaction: 'Reaktion',
  } as const;

  for (const item of pack.items ?? []) {
    cards.push({
      id: item.id,
      name: item.name,
      type: 'Item',
      element: 'Neutral',
      stats_json: {},
      effects: [
        `Timing: ${ITEM_TIMING_DE[item.timing] ?? item.timing}`,
        `Effekt: ${item.effectText}`,
      ],
      image_asset: resolveCardArtPath(item.id),
      fromPack: true,
    });
  }

  return cards;
}

export function mergePresentationOverlays<T extends CardPresentationData>(
  packCards: T[],
  overlays: Partial<T>[],
): T[] {
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
