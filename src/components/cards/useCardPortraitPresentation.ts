/**
 * React entry for portrait card chrome — delegates to buildCardPortraitPresentation.
 * Location: src/components/cards/useCardPortraitPresentation.ts
 */
import { buildCardPortraitPresentation, type CardPortraitInput } from './cardPortraitPresentation';
import type { CardPortraitPresentation } from './cardPortraitPresentation';

export function useCardPortraitPresentation(input: CardPortraitInput): CardPortraitPresentation {
  return buildCardPortraitPresentation(input);
}
