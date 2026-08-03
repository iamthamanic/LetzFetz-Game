import type {
  CardInstance,
  ContentPack,
  GameState,
  MatchEndMode,
  PlayerId,
  RulesetConfig,
} from '../types';
import {
  DEFAULT_RULESET,
  assertExclusiveFormulaRuleset,
  createEmptyMeta,
  isV6FormulaEnabled,
} from '../types';
import {
  buildMainDeckInstances,
  shuffle,
  type Rng,
  createSeededRng,
  resetInstanceIdCounter,
} from './deck';
import { findGlitchDef } from './lookup';
import { clampTimedMatchMinutes, DEFAULT_TIMED_MATCH_MINUTES } from './timedMatch';

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
  /** When true and ruleset allows, mark artifact auction enabled (engine auction TBD). */
  enableArtifactAuction?: boolean;
  /** Match end mode; omit / standard = play until 0 LP. */
  matchEndMode?: MatchEndMode;
  /** Timed mode duration in minutes (clamped 1–60). Default 30. */
  timedMatchMinutes?: number;
  /** Override clock start (tests); default Date.now(). */
  matchStartedAtMs?: number;
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
  assertExclusiveFormulaRuleset(ruleset);
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

  const ultimateAvailable = !isV6FormulaEnabled(ruleset);

  const emptyPlayer = (characterId: string) => ({
    characterId,
    hp: ruleset.startingHp,
    hand: [] as GameState['players']['p1']['hand'],
    bound: [] as GameState['players']['p1']['bound'],
    formula: {
      technik: null,
      essenz: null,
      katalysator: null,
    } as GameState['players']['p1']['formula'],
    formulaPrep: null,
    ultimateAvailable,
    doubleNextAttack: false,
    notes: '',
    statuses: [] as GameState['players']['p1']['statuses'],
    shield: 0,
    fetzCharge: 0,
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
  if (ruleset.v3Combat === true) {
    state.meta.v3CombatEnabled = true;
  }
  if (ruleset.v5Formula === true) {
    state.meta.v5FormulaEnabled = true;
  }
  if (ruleset.v6Formula === true) {
    state.meta.v6FormulaEnabled = true;
    state.meta.v6AffinityAvailable = { p1: true, p2: true };
  }
  if (
    config.enableArtifactAuction === true &&
    ruleset.v5Formula === true &&
    ruleset.v5ArtifactAuction !== false
  ) {
    state.meta.v5ArtifactAuctionEnabled = true;
  }

  const matchEndMode: MatchEndMode = config.matchEndMode === 'timed' ? 'timed' : 'standard';
  if (matchEndMode === 'timed') {
    const minutes = clampTimedMatchMinutes(
      config.timedMatchMinutes ?? DEFAULT_TIMED_MATCH_MINUTES,
    );
    state.meta.matchEndMode = 'timed';
    state.meta.matchDurationMs = minutes * 60_000;
    state.meta.matchStartedAtMs = config.matchStartedAtMs ?? Date.now();
  } else {
    state.meta.matchEndMode = 'standard';
  }

  const skippedInstants: CardInstance[] = [];

  const openingDrawFor = (keepCount: number): number =>
    ruleset.openingDrawCount ?? keepCount;

  const applyOpeningKeep = (
    drawn: CardInstance[],
    keepCount: number,
  ): { kept: CardInstance[]; returned: CardInstance[] } => {
    if (drawn.length <= keepCount) {
      return { kept: drawn, returned: [] };
    }
    // INTERNAL auto-keep: first N drawn; remainder reshuffled into deck (no scrap).
    return {
      kept: drawn.slice(0, keepCount),
      returned: drawn.slice(keepCount),
    };
  };

  const firstKeep = ruleset.p1StartingHand;
  const secondKeep = ruleset.p2SecondHand;

  const firstDraw = drawOpeningHand(
    config.pack,
    deck,
    discard,
    openingDrawFor(firstKeep),
    rng,
  );
  deck = firstDraw.deck;
  discard = firstDraw.discard;
  skippedInstants.push(...firstDraw.skippedInstants);
  {
    const { kept, returned } = applyOpeningKeep(firstDraw.drawn, firstKeep);
    state.players[startingPlayer].hand = kept;
    if (returned.length > 0) {
      deck = shuffle([...deck, ...returned], rng);
    }
  }
  applyDeckEmptyDamage(state, startingPlayer, firstDraw.deckEmptyHits, ruleset);

  const secondDraw = drawOpeningHand(
    config.pack,
    deck,
    discard,
    openingDrawFor(secondKeep),
    rng,
  );
  deck = secondDraw.deck;
  discard = secondDraw.discard;
  skippedInstants.push(...secondDraw.skippedInstants);
  {
    const { kept, returned } = applyOpeningKeep(secondDraw.drawn, secondKeep);
    state.players[secondPlayer].hand = kept;
    if (returned.length > 0) {
      deck = shuffle([...deck, ...returned], rng);
    }
  }
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
