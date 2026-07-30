import type { GameAction, GameState, PlayerId, RulesetConfig } from '../types';
import type { ContentPack } from '../types';
import { DEFAULT_RULESET, MAX_SHIELD, STATUS_STACK_LIMIT, isStatusId } from '../types';
import type { Rng } from './deck';
import { opponentOf } from './createGame';
import { isV2Pack } from './phraseBuild';

function actingPlayerForStep(state: GameState): PlayerId {
  if (state.combat) return state.combat.defenderId;
  if (state.pendingChoice) {
    switch (state.pendingChoice.type) {
      case 'boost-interrupt':
        return opponentOf(state.pendingChoice.boosterId);
      case 'damage-reduce':
        return state.pendingChoice.defenderId;
      case 'optional-draw-discard':
      case 'must-discard':
      case 'spaeti-extra-build':
      case 'pillendoktora-boost':
      case 'mysterium-element':
        return state.pendingChoice.playerId;
      case 'pick-reaction':
        return state.pendingChoice.chooserId;
    }
  }
  return state.activePlayer;
}

export interface InvariantViolation {
  code: string;
  message: string;
}

const PLAYER_IDS: PlayerId[] = ['p1', 'p2'];

/** Total card instances across deck, discard, hands, and bound slots. */
export function countCardsInPlay(state: GameState): number {
  const { deck, discard } = state.piles;
  const { p1, p2 } = state.players;
  return (
    deck.length +
    discard.length +
    p1.hand.length +
    p2.hand.length +
    p1.bound.length +
    p2.bound.length
  );
}

function allCardInstances(state: GameState) {
  const { deck, discard } = state.piles;
  const { p1, p2 } = state.players;
  return [...deck, ...discard, ...p1.hand, ...p2.hand, ...p1.bound, ...p2.bound];
}

/** Collect rule-engine invariant violations for a game state. */
export function collectInvariantViolations(
  state: GameState,
  options: { ruleset?: RulesetConfig; expectedCardCount?: number; pack?: ContentPack } = {},
): InvariantViolation[] {
  const ruleset = options.ruleset ?? DEFAULT_RULESET;
  const violations: InvariantViolation[] = [];

  for (const playerId of PLAYER_IDS) {
    const player = state.players[playerId];
    if (player.hp < 0) {
      violations.push({
        code: 'HP_NEGATIVE',
        message: `${playerId} hp < 0 (${player.hp})`,
      });
    }
    if (player.hp > ruleset.maxHp) {
      violations.push({
        code: 'HP_ABOVE_MAX',
        message: `${playerId} hp > ${ruleset.maxHp} (${player.hp})`,
      });
    }
    if (player.bound.length > ruleset.maxBoundCards) {
      violations.push({
        code: 'BOUND_OVERFLOW',
        message: `${playerId} has ${player.bound.length} bound cards (max ${ruleset.maxBoundCards})`,
      });
    }

    const shield = player.shield ?? 0;
    if (shield < 0 || shield > MAX_SHIELD) {
      violations.push({
        code: 'SHIELD_OUT_OF_RANGE',
        message: `${playerId} shield ${shield} outside 0..${MAX_SHIELD}`,
      });
    }

    const seenStatus = new Set<string>();
    for (const status of player.statuses ?? []) {
      if (!isStatusId(status.id)) {
        violations.push({
          code: 'STATUS_UNKNOWN',
          message: `${playerId} has unknown status id`,
        });
        continue;
      }
      if (seenStatus.has(status.id)) {
        violations.push({
          code: 'STATUS_DUPLICATE',
          message: `${playerId} has duplicate status ${status.id}`,
        });
      }
      seenStatus.add(status.id);
      const max = STATUS_STACK_LIMIT[status.id];
      if (status.stacks < 1 || status.stacks > max) {
        violations.push({
          code: 'STATUS_STACKS_OUT_OF_RANGE',
          message: `${playerId} ${status.id} stacks ${status.stacks} outside 1..${max}`,
        });
      }
    }

    if (options.pack && isV2Pack(options.pack)) {
      const slotCounts = { core: 0, mode: 0, tool: 0, charge: 0 };
      for (const bound of player.bound) {
        if (!bound.phraseSlot) continue;
        slotCounts[bound.phraseSlot] += 1;
        if (slotCounts[bound.phraseSlot] > 1) {
          violations.push({
            code: 'PHRASE_SLOT_DUPLICATE',
            message: `${playerId} has duplicate phrase slot ${bound.phraseSlot}`,
          });
        }
      }
      const phraseCount = slotCounts.core + slotCounts.mode + slotCounts.tool;
      if (phraseCount > 3) {
        violations.push({
          code: 'PHRASE_OVERFLOW',
          message: `${playerId} has ${phraseCount} phrase cards (max 3)`,
        });
      }
    }
  }

  // Hand limit is enforced at end of a player's turn (END_TURN from end phase).
  if (state.phase === 'start' && state.lastEvent === 'Zug beendet.') {
    const justEnded = opponentOf(state.activePlayer);
    const handSize = state.players[justEnded].hand.length;
    if (handSize > ruleset.handLimit) {
      violations.push({
        code: 'HAND_OVERFLOW',
        message: `${justEnded} hand > ${ruleset.handLimit} after ending turn (${handSize})`,
      });
    }
  }

  // Setup: neither player may exceed hand limit before the first turn completes.
  if (state.phase === 'start' && state.turnNumber === 1 && state.lastEvent === null) {
    for (const playerId of PLAYER_IDS) {
      if (state.players[playerId].hand.length > ruleset.handLimit) {
        violations.push({
          code: 'HAND_OVERFLOW_SETUP',
          message: `${playerId} hand > ${ruleset.handLimit} at setup (${state.players[playerId].hand.length})`,
        });
      }
    }
  }

  if (options.expectedCardCount !== undefined) {
    const count = countCardsInPlay(state);
    if (count !== options.expectedCardCount) {
      violations.push({
        code: 'CARD_CONSERVATION',
        message: `expected ${options.expectedCardCount} cards in play, found ${count}`,
      });
    }
  }

  const seen = new Set<string>();
  for (const card of allCardInstances(state)) {
    if (seen.has(card.instanceId)) {
      violations.push({
        code: 'DUPLICATE_INSTANCE',
        message: `duplicate instanceId ${card.instanceId}`,
      });
      break;
    }
    seen.add(card.instanceId);
  }

  if (state.piles.deck.length === 0 && state.piles.discard.length > 0) {
    // Deck empty with discard waiting — valid idle state between draws.
  }

  return violations;
}

export function assertInvariants(
  state: GameState,
  options: { ruleset?: RulesetConfig; expectedCardCount?: number; pack?: ContentPack } = {},
): void {
  const violations = collectInvariantViolations(state, options);
  if (violations.length > 0) {
    throw new Error(violations.map((v) => `${v.code}: ${v.message}`).join('; '));
  }
}

/** Attach deterministic dice rolls for combat actions in simulations. */
export function enrichActionWithDice(action: GameAction, rng: Rng): GameAction {
  const roll = () => Math.floor(rng() * 6) + 1;
  switch (action.type) {
    case 'PLAY_ATTACK':
    case 'PLAY_BLOCK':
    case 'CHALLENGE':
      return { ...action, diceRoll: roll() };
    default:
      return action;
  }
}

export interface SimulationResult {
  steps: number;
  winner: PlayerId | null;
  finalState: GameState;
}

export interface SimulationConfig {
  maxSteps?: number;
  ruleset?: RulesetConfig;
  expectedCardCount: number;
  pack?: ContentPack;
  pickAction: (actions: GameAction[], rng: Rng) => GameAction;
  applyStep: (
    state: GameState,
    action: GameAction,
    playerId: PlayerId,
  ) => GameState;
  getLegalActions: (state: GameState, playerId: PlayerId) => GameAction[];
  rng: Rng;
}

/** Run a random legal-action simulation and check invariants after every step. */
export function runSimulation(
  initialState: GameState,
  config: SimulationConfig,
): SimulationResult {
  const ruleset = config.ruleset ?? DEFAULT_RULESET;
  const maxSteps = config.maxSteps ?? 400;
  let state = initialState;
  let steps = 0;

  assertInvariants(state, {
    ruleset,
    expectedCardCount: config.expectedCardCount,
    pack: config.pack,
  });

  while (!state.winner && steps < maxSteps) {
    const playerId: PlayerId = actingPlayerForStep(state);
    const legal = config.getLegalActions(state, playerId);
    if (legal.length === 0) break;

    const picked = config.pickAction(legal, config.rng);
    const action = enrichActionWithDice(picked, config.rng);
    state = config.applyStep(state, action, playerId);
    steps += 1;

    assertInvariants(state, {
      ruleset,
      expectedCardCount: config.expectedCardCount,
    });
  }

  return { steps, winner: state.winner, finalState: state };
}
