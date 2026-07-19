/**
 * Filtered match view for the bot player — never includes opponent hand contents.
 * Location: src/game/engine/botView.ts
 */
import type { ContentPack, GameAction, GameState, PlayerId } from '../types';
import { findElementDef, findGlitchDef } from './lookup';
import { opponentOf } from './createGame';

export type BotCardView = {
  instanceId: string;
  name: string;
  defId: string;
  kind: string;
  detail?: string;
};

export type BotBoundView = BotCardView & {
  exhausted: boolean;
  resistance: number;
};

/** What the LLM opponent is allowed to see. */
export type BotPublicView = {
  youAre: PlayerId;
  opponentId: PlayerId;
  turnNumber: number;
  phase: string;
  activePlayer: PlayerId;
  arenaId: string;
  arenaName: string;
  lastEvent: string | null;
  yourHp: number;
  opponentHp: number;
  yourUltimateAvailable: boolean;
  opponentUltimateAvailable: boolean;
  yourHand: BotCardView[];
  yourBound: BotBoundView[];
  /** Opponent hand size only — never card identities. */
  opponentHandCount: number;
  opponentBound: BotBoundView[];
  deckCount: number;
  discardCount: number;
  combat: GameState['combat'];
  pendingChoice: GameState['pendingChoice'];
  instantReveals: GameState['instantReveals'];
};

function labelCard(pack: ContentPack, defId: string): { name: string; kind: string; detail?: string } {
  const el = findElementDef(pack, defId);
  if (el) {
    return {
      name: el.name,
      kind: el.cardType,
      detail: `${el.element} ${el.cardType} ${el.value}`,
    };
  }
  const g = findGlitchDef(pack, defId);
  if (g) {
    return { name: g.name, kind: `glitch-${g.glitchType}`, detail: g.effectText };
  }
  return { name: defId, kind: 'unknown' };
}

function mapHand(pack: ContentPack, state: GameState, playerId: PlayerId): BotCardView[] {
  return state.players[playerId].hand.map((c) => {
    const meta = labelCard(pack, c.defId);
    return { instanceId: c.instanceId, defId: c.defId, ...meta };
  });
}

function mapBound(pack: ContentPack, state: GameState, playerId: PlayerId): BotBoundView[] {
  return state.players[playerId].bound.map((b) => {
    const meta = labelCard(pack, b.defId);
    const el = findElementDef(pack, b.defId);
    return {
      instanceId: b.instanceId,
      defId: b.defId,
      ...meta,
      exhausted: b.exhausted,
      resistance: (el?.value ?? 0) + b.resistanceBonus,
    };
  });
}

/** Build a FOW-safe view for `botId` (default p2). */
export function buildBotPublicView(
  state: GameState,
  pack: ContentPack,
  botId: PlayerId = 'p2',
): BotPublicView {
  const opp = opponentOf(botId);
  const arena = pack.arenas.find((a) => a.id === state.arena.arenaId);
  return {
    youAre: botId,
    opponentId: opp,
    turnNumber: state.turnNumber,
    phase: state.phase,
    activePlayer: state.activePlayer,
    arenaId: state.arena.arenaId,
    arenaName: arena?.name ?? state.arena.arenaId,
    lastEvent: state.lastEvent,
    yourHp: state.players[botId].hp,
    opponentHp: state.players[opp].hp,
    yourUltimateAvailable: state.players[botId].ultimateAvailable,
    opponentUltimateAvailable: state.players[opp].ultimateAvailable,
    yourHand: mapHand(pack, state, botId),
    yourBound: mapBound(pack, state, botId),
    opponentHandCount: state.players[opp].hand.length,
    opponentBound: mapBound(pack, state, opp),
    deckCount: state.piles.deck.length,
    discardCount: state.piles.discard.length,
    combat: state.combat,
    pendingChoice: state.pendingChoice,
    instantReveals: state.instantReveals ?? [],
  };
}

/** True if the bot must act now (own turn, defending, or own pending). */
export function botNeedsToAct(state: GameState, botId: PlayerId = 'p2'): boolean {
  if (state.winner) return false;
  if (state.combat?.defenderId === botId) return true;
  if (state.pendingChoice) {
    const p = state.pendingChoice;
    if (p.type === 'damage-reduce' && p.defenderId === botId) return true;
    if (p.type === 'boost-interrupt' && p.boosterId !== botId) return true;
    if (
      (p.type === 'must-discard' ||
        p.type === 'optional-draw-discard' ||
        p.type === 'spaeti-extra-build') &&
      p.playerId === botId
    ) {
      return true;
    }
  }
  return state.activePlayer === botId && !state.combat;
}

/** Attach a fresh dice roll when the chosen action needs one. */
export function withBotDiceRoll(
  action: GameAction,
  roll: () => number,
): GameAction {
  if (action.type === 'PLAY_ATTACK' || action.type === 'CHALLENGE' || action.type === 'PLAY_BLOCK') {
    return { ...action, diceRoll: roll() };
  }
  return action;
}
