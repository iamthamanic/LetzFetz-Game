import type { CardInstance, ContentPack, GameState, PlayerId, RulesetConfig } from '../types';
import { DEFAULT_RULESET, createEmptyMeta } from '../types';
import {
  buildMainDeckInstances,
  shuffle,
  type Rng,
  createSeededRng,
  resetInstanceIdCounter,
} from './deck';
import { findGlitchDef } from './lookup';

export interface CreateGameConfig {
  pack: ContentPack;
  p1CharacterId: string;
  p2CharacterId: string;
  arenaId?: string;
  /** When set with an arena that has d6Variants, skips the W6 variant roll. */
  d6Variant?: number | null;
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

function isInstantGlitch(pack: ContentPack, defId: string): boolean {
  return findGlitchDef(pack, defId)?.glitchType === 'instant';
}

/**
 * Opening deal must not include Sofort-Glitches ("Wenn gezogen").
 * Skip them aside, draw replacements, then reshuffle skips into the deck.
 */
function drawOpeningHand(
  pack: ContentPack,
  deck: CardInstance[],
  discard: CardInstance[],
  count: number,
  rng: Rng,
): {
  deck: CardInstance[];
  discard: CardInstance[];
  drawn: CardInstance[];
  skippedInstants: CardInstance[];
  deckEmptyHits: number;
} {
  let currentDeck = [...deck];
  let currentDiscard = [...discard];
  const drawn: CardInstance[] = [];
  const skippedInstants: CardInstance[] = [];
  let deckEmptyHits = 0;
  let safety = 0;
  const maxAttempts = count + currentDeck.length + currentDiscard.length + 8;

  while (drawn.length < count && safety < maxAttempts) {
    safety += 1;
    if (currentDeck.length === 0) {
      if (currentDiscard.length === 0) break;
      currentDeck = shuffle(currentDiscard, rng);
      currentDiscard = [];
      deckEmptyHits += 1;
    }
    const card = currentDeck.shift();
    if (!card) break;
    if (isInstantGlitch(pack, card.defId)) {
      skippedInstants.push(card);
      continue;
    }
    drawn.push(card);
  }

  return {
    deck: currentDeck,
    discard: currentDiscard,
    drawn,
    skippedInstants,
    deckEmptyHits,
  };
}

/** Set up a new match per rulebook §5. */
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
  const d6Variant = arenaDef.d6Variants
    ? config.d6Variant !== undefined
      ? config.d6Variant
      : Math.floor((rollW6(rng) - 1) / 2)
    : null;

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
    pendingChoice: null,
    meta: createEmptyMeta(),
    lastEvent: null,
    instantReveals: [],
  };

  if (arenaDef.id === 'arena-club' && d6Variant === 1) {
    state.meta.clubSwapAvailable = true;
  }
  if (arenaDef.id === 'arena-schattenbasar' && d6Variant === 1) {
    state.meta.basarExhaustAvailable = true;
  }

  const skippedInstants: CardInstance[] = [];

  const firstDraw = drawOpeningHand(
    config.pack,
    deck,
    discard,
    ruleset.p1StartingHand,
    rng,
  );
  deck = firstDraw.deck;
  discard = firstDraw.discard;
  skippedInstants.push(...firstDraw.skippedInstants);
  state.players[startingPlayer].hand = firstDraw.drawn;
  applyDeckEmptyDamage(state, startingPlayer, firstDraw.deckEmptyHits, ruleset);

  const secondDraw = drawOpeningHand(
    config.pack,
    deck,
    discard,
    ruleset.p2SecondHand,
    rng,
  );
  deck = secondDraw.deck;
  discard = secondDraw.discard;
  skippedInstants.push(...secondDraw.skippedInstants);
  state.players[secondPlayer].hand = secondDraw.drawn;
  applyDeckEmptyDamage(state, secondPlayer, secondDraw.deckEmptyHits, ruleset);

  // Sofort-Glitches stay in the shared deck for later draws — never opening-dealt.
  if (skippedInstants.length > 0) {
    deck = shuffle([...deck, ...skippedInstants], rng);
  }

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
