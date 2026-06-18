import type { ContentPack, Element, GameState, GlitchCardDef, PlayerId, RulesetConfig } from '../types';
import { DEFAULT_RULESET } from '../types';
import { opponentOf, checkWinner } from './createGame';
import {
  cloneState,
  drawForPlayer,
  clampHp,
} from './helpers';
import type { Rng } from './deck';
import { findGlitchDef } from './lookup';

export function applyInstantGlitch(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  glitch: GlitchCardDef,
  rng: Rng,
  ruleset: RulesetConfig = DEFAULT_RULESET,
): GameState {
  let next = cloneState(state);
  switch (glitch.id) {
    case 'glitch-selbstschaden':
      next.players[playerId].hp = clampHp(next.players[playerId].hp - 2, ruleset);
      next.lastEvent = 'Selbstschaden.exe: −2 Leben.';
      break;
    case 'glitch-datenleck': {
      const other = opponentOf(playerId);
      next = drawForPlayer(next, playerId, 1, rng, ruleset);
      next = drawForPlayer(next, other, 1, rng, ruleset);
      next.lastEvent = 'Datenleck: Beide ziehen 1 Karte.';
      break;
    }
    case 'glitch-absturz':
      if (next.players[playerId].hand.length > 0) {
        const removed = next.players[playerId].hand.pop()!;
        next.piles.discard.push(removed);
        next.lastEvent = 'Absturz: 1 Karte abgeworfen.';
      } else {
        next.players[playerId].hp = clampHp(next.players[playerId].hp - 1, ruleset);
        next.lastEvent = 'Absturz: Keine Handkarte → −1 Leben.';
      }
      break;
    default:
      next.lastEvent = `${glitch.name} ausgeführt.`;
  }
  return checkWinner(next);
}

/** Apply element instant/boost effect (no dice). Returns updated state. */
export function applyElementEffect(
  state: GameState,
  playerId: PlayerId,
  element: Element,
  rng: Rng,
  ruleset: RulesetConfig = DEFAULT_RULESET,
  options?: { targetBoundId?: string },
): GameState {
  let next = cloneState(state);
  const opponent = opponentOf(playerId);

  switch (element) {
    case 'fire': {
      next.players[opponent].hp = clampHp(next.players[opponent].hp - 2, ruleset);
      next.lastEvent = 'Feuer: 2 Schaden.';
      break;
    }
    case 'water': {
      next.players[playerId].hp = clampHp(next.players[playerId].hp + 2, ruleset);
      next.lastEvent = 'Wasser: 2 Leben geheilt.';
      break;
    }
    case 'earth': {
      const targetId = options?.targetBoundId ?? next.players[playerId].bound[0]?.instanceId;
      const bound = next.players[playerId].bound.find((b) => b.instanceId === targetId);
      if (bound) {
        bound.resistanceBonus += 2;
        next.lastEvent = 'Erde: +2 Widerstand auf gebundene Karte.';
      } else {
        next.lastEvent = 'Erde: Keine gebundene Karte — kein Effekt.';
      }
      break;
    }
    case 'air': {
      next = drawForPlayer(next, playerId, 2, rng, ruleset);
      if (next.players[playerId].hand.length > 0) {
        const removed = next.players[playerId].hand.pop()!;
        next.piles.discard.push(removed);
      }
      next.lastEvent = 'Luft: 2 Karten gezogen, 1 abgeworfen.';
      break;
    }
    case 'shadow': {
      if (next.players[opponent].hand.length > 0) {
        const removed = next.players[opponent].hand.pop()!;
        next.piles.discard.push(removed);
        next.lastEvent = 'Schatten: Gegner wirft 1 Karte ab.';
      } else {
        next.lastEvent = 'Schatten: Gegner hat keine Handkarten.';
      }
      break;
    }
    case 'light': {
      next = drawForPlayer(next, playerId, 1, rng, ruleset);
      next.players[playerId].hp = clampHp(next.players[playerId].hp + 1, ruleset);
      next.lastEvent = 'Licht: 1 Karte gezogen, 1 Leben geheilt.';
      break;
    }
  }

  return checkWinner(next);
}

/** Bound activation: exhaust + element effect (cost already paid). */
export function applyBoundActivation(
  state: GameState,
  playerId: PlayerId,
  boundInstanceId: string,
  element: Element,
  rng: Rng,
  ruleset: RulesetConfig = DEFAULT_RULESET,
): GameState {
  let next = cloneState(state);
  const bound = next.players[playerId].bound.find((b) => b.instanceId === boundInstanceId);
  if (!bound || bound.exhausted) throw new Error('Bound card not activatable');

  bound.exhausted = true;

  if (element === 'shadow') {
    const opponent = opponentOf(playerId);
    const oppBound = next.players[opponent].bound.find((b) => !b.exhausted)
      ?? next.players[opponent].bound[0];
    if (oppBound) {
      oppBound.exhausted = true;
      next.lastEvent = 'Schatten-Aktivierung: Gegnerische Karte erschöpft.';
    } else {
      next.lastEvent = 'Schatten-Aktivierung: Keine gegnerische gebundene Karte.';
    }
    return checkWinner(next);
  }

  return applyElementEffect(next, playerId, element, rng, ruleset, {
    targetBoundId: boundInstanceId,
  });
}

export function finishMainAction(state: GameState, message?: string): GameState {
  const next = cloneState(state);
  next.phase = 'end';
  if (message) next.lastEvent = message;
  return next;
}
