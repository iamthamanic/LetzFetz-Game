/**
 * Resolve card elements → ElementIcons + V3 primary Elementmarken for UI.
 * Location: src/components/cards/elementMarks.ts
 */
import type { Element, PrimaryMarkId } from '../../game/types';
import { PRIMARY_MARK_BY_ELEMENT } from '../../game/engine/status/elementImpulse';
import type { BrandIconKey } from '../../services/icons/elementIcons';
import {
  characterUsesMysteryIcon,
  elementToBrandIconKey,
} from '../../services/icons/elementIcons';
import type { CardElement, CardKind } from './cardTypes';
import { PRIMARY_MARK_LABEL_DE } from './elementMarkArt';

export { PRIMARY_MARK_LABEL_DE } from './elementMarkArt';

const CARD_ELEMENT_TO_GAME: Partial<Record<CardElement, Element>> = {
  Fire: 'fire',
  Water: 'water',
  Earth: 'earth',
  Air: 'air',
  Light: 'light',
  Shadow: 'shadow',
};

export function cardElementToGameElement(el: CardElement): Element | null {
  return CARD_ELEMENT_TO_GAME[el] ?? null;
}

export interface CardElementMarkInfo {
  /** Icons for the art overlay / detail row. */
  icons: BrandIconKey[];
  useMysteryIcon: boolean;
  /** Game elements (0–2). */
  elements: Element[];
  /** Matching primary Elementmarken (same order as elements). */
  marks: { id: PrimaryMarkId; label: string; element: Element }[];
}

export function resolveCardElementMarks(input: {
  id: string;
  type: CardKind;
  element: CardElement;
  gameElements?: [Element, Element];
}): CardElementMarkInfo {
  const useMysteryIcon =
    input.type === 'Character' && characterUsesMysteryIcon(input.id);

  if (useMysteryIcon) {
    return { icons: ['mystery'], useMysteryIcon: true, elements: [], marks: [] };
  }

  if (input.type === 'Character' && input.gameElements?.length === 2) {
    const elements = [...input.gameElements] as Element[];
    return {
      icons: elements.map(elementToBrandIconKey),
      useMysteryIcon: false,
      elements,
      marks: elements.map((element) => {
        const id = PRIMARY_MARK_BY_ELEMENT[element];
        return { id, label: PRIMARY_MARK_LABEL_DE[id], element };
      }),
    };
  }

  if (input.type === 'Element' || input.type === 'Formula') {
    const gameEl = cardElementToGameElement(input.element);
    if (!gameEl) {
      return { icons: [], useMysteryIcon: false, elements: [], marks: [] };
    }
    const id = PRIMARY_MARK_BY_ELEMENT[gameEl];
    return {
      icons: [elementToBrandIconKey(gameEl)],
      useMysteryIcon: false,
      elements: [gameEl],
      marks: [{ id, label: PRIMARY_MARK_LABEL_DE[id], element: gameEl }],
    };
  }

  return { icons: [], useMysteryIcon: false, elements: [], marks: [] };
}
