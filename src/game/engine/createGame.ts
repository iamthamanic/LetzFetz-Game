import type { ContentPack, GameState, PlayerId, RulesetConfig } from '../types';
import { DEFAULT_RULESET } from '../types';
import { buildMainDeckInstances, drawCards, type Rng, createSeededRng, resetInstanceIdCounter } from './deck';

export interface CreateGameConfig {
  pack: ContentPack;
  p1CharacterId: string;
  p2CharacterId: string;
  arenaId?: string;
  startingPlayer?: PlayerId;
  ruleset?: RulesetConfig;
  seed?: number;
  rng?: Rng;
}

function rollW6(rng: Rng): number {
  return Math.floor(rng() * 6) + 1;
}

function pickArena(pack: ContentPack, arenaId: string | undefined, rng: Rng) {
  if (arenaId) {
    const found = pack.arenas.find((a) => a.id === arenaId);
    if (!found) throw new Error(`Unknown arena: ${arenaId}`);
    return found;
  }
  const idx = Math.floor(rng() * pack.arenas.length);
  return pack.arenas[idx];
}

function validateCharacter(pack: ContentPack, id: string): void {
  if (!pack.characters.some((c) => c.id === id)) {
    throw new Error(`Unknown character: ${id}`);
  }
}

/** Set up a new match per rulebook §5 (setup only — turn flow in Phase 1). */
export function createGame(config: CreateGameConfig): GameState {
  const ruleset = config.ruleset ?? DEFAULT_RULESET;
  const rng = config.rng ?? createSeededRng(config.seed ?? Date.now());
  validateCharacter(config.pack, config.p1CharacterId);
  validateCharacter(config.pack, config.p2CharacterId);

  resetInstanceIdCounter();
  let deck = buildMainDeckInstances(config.pack, rng);
  let discard: GameState['piles']['discard'] = [];

  const startingPlayer: PlayerId =
    config.startingPlayer ?? (rng() < 0.5 ? 'p1' : 'p2');
  const secondPlayer: PlayerId = startingPlayer === 'p1' ? 'p2' : 'p1';

  const arenaDef = pickArena(config.pack, config.arenaId, rng);
  const d6Variant = arenaDef.d6Variants ? Math.floor((rollW6(rng) - 1) / 2) : null;

  const emptyPlayer = (characterId: string) => ({
    characterId,
    hp: ruleset.startingHp,
    hand: [] as GameState['players']['p1']['hand'],
    bound: [] as GameState['players']['p1']['bound'],
    ultimateAvailable: true,
    doubleNextAttack: false,
    notes: '',
  });

  const state: GameState = {
    players: {
      p1: emptyPlayer(config.p1CharacterId),
      p2: emptyPlayer(config.p2CharacterId),
    },
    piles: { deck, discard },
    arena: { arenaId: arenaDef.id, d6Variant },
    activePlayer: startingPlayer,
    phase: 'start',
    turnNumber: 1,
    winner: null,
    combat: null,
    lastEvent: null,
  };

  const firstDraw = drawCards(deck, discard, ruleset.p1StartingHand, rng);
  deck = firstDraw.deck;
  discard = firstDraw.discard;
  state.players[startingPlayer].hand = firstDraw.drawn;
  applyDeckEmptyDamage(state, startingPlayer, firstDraw.deckEmptyHits, ruleset);

  const secondDraw = drawCards(deck, discard, ruleset.p2SecondHand, rng);
  deck = secondDraw.deck;
  discard = secondDraw.discard;
  state.players[secondPlayer].hand = secondDraw.drawn;
  applyDeckEmptyDamage(state, secondPlayer, secondDraw.deckEmptyHits, ruleset);

  state.piles = { deck, discard };
  return state;
}

function applyDeckEmptyDamage(
  state: GameState,
  playerId: PlayerId,
  hits: number,
  ruleset: RulesetConfig,
): void {
  if (hits > 0) {
    state.players[playerId].hp = Math.max(0, state.players[playerId].hp - hits);
    if (state.players[playerId].hp <= 0) state.winner = playerId === 'p1' ? 'p2' : 'p1';
  }
}

export function opponentOf(playerId: PlayerId): PlayerId {
  return playerId === 'p1' ? 'p2' : 'p1';
}

export function checkWinner(state: GameState): GameState {
  if (state.winner) return state;
  if (state.players.p1.hp <= 0 && state.players.p2.hp <= 0) {
    return { ...state, winner: state.activePlayer === 'p1' ? 'p2' : 'p1' };
  }
  if (state.players.p1.hp <= 0) return { ...state, winner: 'p2' };
  if (state.players.p2.hp <= 0) return { ...state, winner: 'p1' };
  return state;
}
