/**
 * Maps Card Forge character rows to game CharacterCardDef for previews.
 * Location: src/features/forge/model/characterFromForgeCard.ts
 */
import type { CardElement } from '../../../components/cards/cardTypes';
import type { CharacterCardDef, Element } from '../../../game/types';
import { BASE_PACK } from '../../../game/packs/base-pack';
import type { ForgeCardData } from './types';

const CARD_ELEMENT_TO_GAME: Partial<Record<CardElement, Element>> = {
  Fire: 'fire',
  Water: 'water',
  Earth: 'earth',
  Air: 'air',
  Light: 'light',
  Shadow: 'shadow',
};

function cardElementsToGame(elements?: [CardElement, CardElement]): [Element, Element] {
  if (elements?.length === 2) {
    return [
      CARD_ELEMENT_TO_GAME[elements[0]] ?? 'earth',
      CARD_ELEMENT_TO_GAME[elements[1]] ?? 'fire',
    ];
  }
  return ['earth', 'fire'];
}

function effectField(effects: string[] | undefined, prefix: string): string {
  const line = effects?.find((e) => e.startsWith(prefix));
  return line ? line.slice(prefix.length).trim() : '';
}

/** Map Card Forge character row → game CharacterCardDef for CharacterSelectCard preview. */
export function forgeCharacterDefFromCard(
  card: Pick<ForgeCardData, 'id' | 'name' | 'type' | 'elements' | 'effects'>,
): CharacterCardDef | null {
  if (card.type !== 'Character') return null;

  const fromPack = BASE_PACK.characters.find((c) => c.id === card.id);
  if (fromPack) {
    return { ...fromPack, name: card.name || fromPack.name };
  }

  return {
    id: card.id,
    name: card.name || 'Unbenannt',
    kind: 'character',
    elements: cardElementsToGame(card.elements),
    role: effectField(card.effects, 'Rolle: ') || '—',
    passiveText: effectField(card.effects, 'Passiv: ') || card.effects?.[0] || '',
    ultimateId: '',
    strategyHint: effectField(card.effects, 'Strategie: '),
  };
}
