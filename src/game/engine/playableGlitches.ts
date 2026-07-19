/**
 * Playable glitch resolution — Letz Fetz V1 §15.1.
 * Location: src/game/engine/playableGlitches.ts
 */
import type { ContentPack, GameAction, GameState, PlayerId, RulesetConfig } from '../types';
import { opponentOf, checkWinner } from './createGame';
import { cloneState, discardFromHand, drawForPlayer } from './helpers';
import { findGlitchDef, findElementDef } from './lookup';
import { applyElementEffect } from './effects';
import { switchArena } from './arena';
import { finishMainAction } from './effects';
import type { Rng } from './deck';

const OWN_TURN_GLITCHES = new Set([
  'glitch-riss',
  'glitch-kurzschluss',
  'glitch-empfang',
  'glitch-systemfehler',
  'glitch-download',
]);

export function listOwnTurnGlitchActions(state: GameState, playerId: PlayerId): GameAction[] {
  if (state.phase !== 'action' || state.pendingChoice || state.combat) return [];
  const actions: GameAction[] = [];
  for (const card of state.players[playerId].hand) {
    if (!OWN_TURN_GLITCHES.has(card.defId)) continue;
    if (card.defId === 'glitch-kurzschluss' || card.defId === 'glitch-systemfehler') {
      const targets = state.players[opponentOf(playerId)].bound;
      const pool =
        card.defId === 'glitch-systemfehler'
          ? [...state.players.p1.bound, ...state.players.p2.bound]
          : targets;
      if (pool.length === 0) {
        actions.push({ type: 'PLAY_GLITCH', glitchInstanceId: card.instanceId });
      } else {
        for (const t of pool) {
          actions.push({
            type: 'PLAY_GLITCH',
            glitchInstanceId: card.instanceId,
            targetBoundInstanceId: t.instanceId,
          });
        }
      }
    } else if (card.defId === 'glitch-download') {
      const oppBound = state.players[opponentOf(playerId)].bound;
      for (const t of oppBound) {
        for (const h of state.players[playerId].hand) {
          if (h.instanceId === card.instanceId) continue;
          actions.push({
            type: 'PLAY_GLITCH',
            glitchInstanceId: card.instanceId,
            targetBoundInstanceId: t.instanceId,
            discardHandInstanceId: h.instanceId,
          });
        }
      }
    } else {
      actions.push({ type: 'PLAY_GLITCH', glitchInstanceId: card.instanceId });
    }
  }
  return actions;
}

export function applyPlayableGlitch(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  action: Extract<GameAction, { type: 'PLAY_GLITCH' }>,
  rng: Rng,
  ruleset: RulesetConfig,
): GameState {
  const card = state.players[playerId].hand.find((c) => c.instanceId === action.glitchInstanceId);
  if (!card) throw new Error('Glitch not in hand');
  const def = findGlitchDef(pack, card.defId);
  if (!def || def.glitchType !== 'playable') throw new Error('Not a playable glitch');

  // Reaction: Nein, Bruder
  if (def.id === 'glitch-nein') {
    if (state.pendingChoice?.type !== 'boost-interrupt') throw new Error('No boost to cancel');
    if (state.pendingChoice.boosterId === playerId) throw new Error('Cannot cancel own boost');
    let next = discardFromHand(state, playerId, action.glitchInstanceId);
    const booster = state.pendingChoice.boosterId;
    // Boost was already discarded when PLAY_BOOST set boost-interrupt pending.
    next.meta = {
      ...next.meta,
      boostsPlayed: {
        ...next.meta.boostsPlayed,
        [booster]: next.meta.boostsPlayed[booster] + 1,
      },
    };
    next.pendingChoice = null;
    next.phase = 'end';
    next.activePlayer = booster;
    next.lastEvent = 'Nein, Bruder: Boost verhindert.';
    return next;
  }

  // Reaction: Rückkopplung
  if (def.id === 'glitch-rueckkopplung') {
    if (state.pendingChoice?.type !== 'damage-reduce') throw new Error('No damage to reduce');
    if (state.pendingChoice.defenderId !== playerId) throw new Error('Not defender');
    let next = discardFromHand(state, playerId, action.glitchInstanceId);
    const pending = next.pendingChoice;
    if (pending?.type !== 'damage-reduce') throw new Error('Pending lost');
    const reduced = Math.max(0, pending.damage - 2);
    next.pendingChoice = null;
    next.players[playerId].hp = Math.max(0, next.players[playerId].hp - reduced);
    next.combat = null;
    next.phase = 'end';
    next.lastEvent = `Rückkopplung: Schaden ${pending.damage} → ${reduced}.`;
    return checkWinner(next);
  }

  if (state.phase !== 'action' || state.activePlayer !== playerId) {
    throw new Error('Glitch not playable now');
  }
  if (!OWN_TURN_GLITCHES.has(def.id)) throw new Error('Glitch timing invalid');

  let next = discardFromHand(state, playerId, action.glitchInstanceId);

  switch (def.id) {
    case 'glitch-riss':
      next = switchArena(next, pack.arenas, rng);
      break;
    case 'glitch-kurzschluss': {
      const opp = opponentOf(playerId);
      const target =
        next.players[opp].bound.find((b) => b.instanceId === action.targetBoundInstanceId) ??
        next.players[opp].bound[0];
      if (target) target.exhausted = true;
      next.lastEvent = 'Kurzschluss: Gegnerische Karte erschöpft.';
      break;
    }
    case 'glitch-empfang': {
      const opp = opponentOf(playerId);
      next.meta = {
        ...next.meta,
        drawBan: { playerId: opp, endsAfterTheirTurn: true },
      };
      next.lastEvent = 'Schlechter Empfang: Gegner darf nicht extra ziehen.';
      break;
    }
    case 'glitch-systemfehler': {
      const allBound = [...next.players.p1.bound, ...next.players.p2.bound];
      const target =
        allBound.find((b) => b.instanceId === action.targetBoundInstanceId) ?? allBound[0];
      if (target) {
        const owner: PlayerId = next.players.p1.bound.some((b) => b.instanceId === target.instanceId)
          ? 'p1'
          : 'p2';
        next.meta = {
          ...next.meta,
          activationLockedBoundId: target.instanceId,
          activationLockOwner: owner,
        };
        next.lastEvent = 'Systemfehler: Aktivierung gesperrt.';
      }
      break;
    }
    case 'glitch-download': {
      if (!action.discardHandInstanceId || !action.targetBoundInstanceId) {
        throw new Error('Download needs discard + target');
      }
      next = discardFromHand(next, playerId, action.discardHandInstanceId);
      const opp = opponentOf(playerId);
      const target = next.players[opp].bound.find((b) => b.instanceId === action.targetBoundInstanceId);
      if (!target) throw new Error('Download target missing');
      const el = findElementDef(pack, target.defId);
      if (!el) throw new Error('Invalid target');
      next = applyElementEffect(next, playerId, el.element, rng, ruleset, {
        targetBoundId: next.players[playerId].bound[0]?.instanceId,
      });
      next.lastEvent = `Illegaler Download: ${el.element}-Effekt kopiert.`;
      break;
    }
    default:
      next.lastEvent = `${def.name} gespielt.`;
  }

  return finishMainAction(checkWinner(next));
}
