import type { ContentPack, Element, GameState, PlayerId, RulesetConfig } from '../types';
import { DEFAULT_RULESET } from '../types';
import { drawCards, type Rng } from './deck';

export function cloneState(state: GameState): GameState {
  return {
    ...state,
    players: {
      p1: {
        ...state.players.p1,
        hand: [...state.players.p1.hand],
        bound: state.players.p1.bound.map((b) => ({ ...b })),
      },
      p2: {
        ...state.players.p2,
        hand: [...state.players.p2.hand],
        bound: state.players.p2.bound.map((b) => ({ ...b })),
      },
    },
    piles: {
      deck: [...state.piles.deck],
      discard: [...state.piles.discard],
    },
    combat: state.combat ? { ...state.combat } : null,
    playtest: state.playtest ? { ...state.playtest } : undefined,
  };
}

export function getCharacterElements(pack: ContentPack, characterId: string): Element[] {
  const ch = pack.characters.find((c) => c.id === characterId);
  return ch ? [...ch.elements] : [];
}

export function clampHp(hp: number, ruleset: RulesetConfig = DEFAULT_RULESET): number {
  return Math.max(0, Math.min(ruleset.maxHp, hp));
}

export function drawForPlayer(
  state: GameState,
  playerId: PlayerId,
  count: number,
  rng: Rng,
  ruleset: RulesetConfig = DEFAULT_RULESET,
): GameState {
  const next = cloneState(state);
  const result = drawCards(next.piles.deck, next.piles.discard, count, rng);
  next.piles.deck = result.deck;
  next.piles.discard = result.discard;
  next.players[playerId].hand.push(...result.drawn);
  if (result.deckEmptyHits > 0) {
    next.players[playerId].hp = clampHp(
      next.players[playerId].hp - result.deckEmptyHits,
      ruleset,
    );
    next.lastEvent = `${playerId} verliert ${result.deckEmptyHits} Leben (Deck leer).`;
  }
  return next;
}

export function discardFromHand(
  state: GameState,
  playerId: PlayerId,
  instanceId: string,
): GameState {
  const next = cloneState(state);
  const hand = next.players[playerId].hand;
  const idx = hand.findIndex((c) => c.instanceId === instanceId);
  if (idx === -1) throw new Error('Card not in hand');
  const [card] = hand.splice(idx, 1);
  next.piles.discard.push(card);
  return next;
}

export function enforceHandLimit(
  state: GameState,
  playerId: PlayerId,
  ruleset: RulesetConfig = DEFAULT_RULESET,
): GameState {
  let next = cloneState(state);
  while (next.players[playerId].hand.length > ruleset.handLimit) {
    const removed = next.players[playerId].hand.pop();
    if (!removed) break;
    next.piles.discard.push(removed);
  }
  return next;
}

export const PHASE_LABELS: Record<string, string> = {
  start: 'Startphase',
  draw: 'Ziehphase',
  bind: 'Bindungsphase',
  action: 'Aktionsphase',
  end: 'Endphase',
};
