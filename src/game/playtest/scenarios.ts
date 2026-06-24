import type { ContentPack, GameState, PlayerId, TurnPhase } from '../types';
import { createGame } from '../engine/createGame';
import { applyAction, getLegalActions } from '../engine/actions';
import { findElementDef } from '../engine/lookup';

export type PlaytestScenarioId =
  | 'fresh-action'
  | 'defender-block'
  | 'challenge-ready'
  | 'ulti-ready'
  | 'low-hp'
  | 'bind-phase';

export interface PlaytestScenario {
  id: PlaytestScenarioId;
  label: string;
  build: (pack: ContentPack) => GameState;
}

const DEFAULT_SEED = 42;
const DEFAULT_P1 = 'knuspergnom';
const DEFAULT_P2 = 'schluckspecht';

function advanceToPhase(
  state: GameState,
  targetPhase: TurnPhase,
  pack: ContentPack,
): GameState {
  let current = state;
  let guard = 0;
  while (current.phase !== targetPhase && !current.winner && guard++ < 24) {
    const playerId: PlayerId = current.combat?.defenderId ?? current.activePlayer;
    const actions = getLegalActions(current, { pack, playerId });
    const preferred =
      actions.find((a) => a.type === 'ADVANCE_PHASE') ??
      actions.find((a) => a.type === 'SKIP_BIND') ??
      actions[0];
    if (!preferred) break;
    current = applyAction(current, preferred, playerId, { pack, playerId });
  }
  return current;
}

function ensureAttackInHand(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
): GameState {
  const hasAttack = state.players[playerId].hand.some((card) => {
    const def = findElementDef(pack, card.defId);
    return def?.cardType === 'attack';
  });
  if (hasAttack) return state;

  const deckIdx = state.piles.deck.findIndex((card) => {
    const def = findElementDef(pack, card.defId);
    return def?.cardType === 'attack';
  });
  if (deckIdx < 0) return state;

  const next = {
    ...state,
    players: {
      ...state.players,
      [playerId]: {
        ...state.players[playerId],
        hand: [...state.players[playerId].hand],
      },
    },
    piles: {
      deck: [...state.piles.deck],
      discard: [...state.piles.discard],
    },
  };
  const [attackCard] = next.piles.deck.splice(deckIdx, 1);
  if (next.players[playerId].hand.length >= 6) {
    const [discarded] = next.players[playerId].hand.splice(0, 1);
    next.piles.discard.push(discarded);
  }
  next.players[playerId].hand.push(attackCard);
  return next;
}

function baseMatch(pack: ContentPack, startingPlayer: PlayerId = 'p1'): GameState {
  return createGame({
    pack,
    p1CharacterId: DEFAULT_P1,
    p2CharacterId: DEFAULT_P2,
    startingPlayer,
    seed: DEFAULT_SEED,
  });
}

function scenarioFreshAction(pack: ContentPack): GameState {
  let state = advanceToPhase(baseMatch(pack, 'p1'), 'action', pack);
  state = ensureAttackInHand(state, pack, 'p1');
  state.activePlayer = 'p1';
  state.winner = null;
  return state;
}

function scenarioDefenderBlock(pack: ContentPack): GameState {
  let state = advanceToPhase(baseMatch(pack, 'p2'), 'action', pack);
  state = ensureAttackInHand(state, pack, 'p2');
  const attack = state.players.p2.hand.find((card) => {
    const def = findElementDef(pack, card.defId);
    return def?.cardType === 'attack';
  });
  if (!attack) return state;

  state = applyAction(
    state,
    { type: 'PLAY_ATTACK', cardInstanceId: attack.instanceId, diceRoll: 4 },
    'p2',
    { pack, playerId: 'p2' },
  );
  return state;
}

function scenarioChallengeReady(pack: ContentPack): GameState {
  let state = baseMatch(pack, 'p1');
  state.phase = 'action';
  state.activePlayer = 'p1';
  state.combat = null;
  state.winner = null;

  const deck = [...state.piles.deck];
  const blockIdx = deck.findIndex((card) => {
    const def = findElementDef(pack, card.defId);
    return def?.cardType === 'block';
  });
  if (blockIdx >= 0) {
    const [blockCard] = deck.splice(blockIdx, 1);
    state = {
      ...state,
      piles: { ...state.piles, deck },
      players: {
        ...state.players,
        p2: {
          ...state.players.p2,
          bound: [{ ...blockCard, exhausted: false, resistanceBonus: 0 }],
        },
      },
    };
  }

  state = ensureAttackInHand(state, pack, 'p1');
  return state;
}

function scenarioUltiReady(pack: ContentPack): GameState {
  let state = advanceToPhase(
    createGame({
      pack,
      p1CharacterId: 'schluckspecht',
      p2CharacterId: 'knuspergnom',
      startingPlayer: 'p1',
      seed: 50,
    }),
    'action',
    pack,
  );
  state.players.p1.ultimateAvailable = true;
  state.activePlayer = 'p1';
  return state;
}

function scenarioLowHp(pack: ContentPack): GameState {
  const state = advanceToPhase(baseMatch(pack, 'p1'), 'action', pack);
  state.players.p1.hp = 5;
  state.players.p2.hp = 5;
  state.winner = null;
  state.combat = null;
  return state;
}

function scenarioBindPhase(pack: ContentPack): GameState {
  const state = advanceToPhase(baseMatch(pack, 'p1'), 'bind', pack);
  state.activePlayer = 'p1';
  state.combat = null;
  state.winner = null;
  return state;
}

export const PLAYTEST_SCENARIOS: PlaytestScenario[] = [
  { id: 'fresh-action', label: 'Aktionsphase P1', build: scenarioFreshAction },
  { id: 'defender-block', label: 'Block ausstehend', build: scenarioDefenderBlock },
  { id: 'challenge-ready', label: 'Challenge möglich', build: scenarioChallengeReady },
  { id: 'ulti-ready', label: 'Ulti verfügbar', build: scenarioUltiReady },
  { id: 'low-hp', label: 'Beide ≤5 HP', build: scenarioLowHp },
  { id: 'bind-phase', label: 'Bindephase', build: scenarioBindPhase },
];

export function buildPlaytestScenario(
  pack: ContentPack,
  id: PlaytestScenarioId,
): GameState {
  const scenario = PLAYTEST_SCENARIOS.find((s) => s.id === id);
  if (!scenario) throw new Error(`Unknown playtest scenario: ${id}`);
  return scenario.build(pack);
}
