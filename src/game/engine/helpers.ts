/**
 * Shared draw/discard helpers with V1 draw-ban awareness.
 * Location: src/game/engine/helpers.ts
 */
import type { ContentPack, Element, GameState, PlayerId, RulesetConfig } from '../types';
import { DEFAULT_RULESET, createEmptyMeta } from '../types';
import { drawCards, type Rng } from './deck';

export function ensureMeta(state: GameState): GameState {
  if (state.meta && state.pendingChoice !== undefined && state.instantReveals) return state;
  return {
    ...state,
    meta: state.meta ?? createEmptyMeta(),
    pendingChoice: state.pendingChoice ?? null,
    instantReveals: state.instantReveals ?? [],
  };
}

export function cloneState(state: GameState): GameState {
  const src = ensureMeta(state);
  const meta = src.meta;
  return {
    ...src,
    players: {
      p1: {
        ...src.players.p1,
        hand: [...src.players.p1.hand],
        bound: src.players.p1.bound.map((b) => ({ ...b })),
      },
      p2: {
        ...src.players.p2,
        hand: [...src.players.p2.hand],
        bound: src.players.p2.bound.map((b) => ({ ...b })),
      },
    },
    piles: {
      deck: [...src.piles.deck],
      discard: [...src.piles.discard],
    },
    combat: src.combat ? { ...src.combat } : null,
    pendingChoice: src.pendingChoice ? { ...src.pendingChoice } : null,
    instantReveals: src.instantReveals.map((r) => ({ ...r })),
    meta: {
      ...meta,
      boostsPlayed: { ...meta.boostsPlayed },
      spaetiFilterUsed: { ...meta.spaetiFilterUsed },
      kristallHealUsed: { ...(meta.kristallHealUsed ?? { p1: false, p2: false }) },
      vulkanAttackBonusUsed: { ...meta.vulkanAttackBonusUsed },
      sumpfBlockBonusUsed: { ...meta.sumpfBlockBonusUsed },
      drawBan: meta.drawBan ? { ...meta.drawBan } : null,
      awaitingPostBoostArena: meta.awaitingPostBoostArena ?? false,
    },
    arena: { ...src.arena },
  };
}

export function getCharacterElements(pack: ContentPack, characterId: string): Element[] {
  const ch = pack.characters.find((c) => c.id === characterId);
  return ch ? [...ch.elements] : [];
}

export function clampHp(hp: number, ruleset: RulesetConfig = DEFAULT_RULESET): number {
  return Math.max(0, Math.min(ruleset.maxHp, hp));
}

export interface DrawOptions {
  /** Bypass Schlechter Empfang (draw phase / forced draws). */
  allowExtra?: boolean;
}

export function drawForPlayer(
  state: GameState,
  playerId: PlayerId,
  count: number,
  rng: Rng,
  ruleset: RulesetConfig = DEFAULT_RULESET,
  options: DrawOptions = {},
): GameState {
  const next = cloneState(state);

  const banned =
    next.meta.drawBan?.playerId === playerId &&
    !options.allowExtra &&
    next.phase !== 'draw';
  if (banned) {
    next.lastEvent = 'Schlechter Empfang: Kein Ziehen außerhalb der Ziehphase.';
    return next;
  }

  const result = drawCards(next.piles.deck, next.piles.discard, count, rng);
  next.piles.deck = result.deck;
  next.piles.discard = result.discard;
  next.players[playerId].hand.push(...result.drawn);
  if (result.deckEmptyHits > 0) {
    next.players[playerId].hp = Math.max(
      0,
      Math.min(ruleset.maxHp, next.players[playerId].hp - result.deckEmptyHits),
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

export function handHasGlitch(state: GameState, playerId: PlayerId, glitchId: string): boolean {
  return state.players[playerId].hand.some((c) => c.defId === glitchId);
}

export const PHASE_LABELS: Record<string, string> = {
  start: 'Startphase',
  draw: 'Ziehphase',
  build: 'Bau-Phase',
  action: 'Aktionsphase',
  end: 'Endphase',
};
