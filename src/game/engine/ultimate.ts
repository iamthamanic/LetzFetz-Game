import type { BoundCardInstance, ContentPack, GameState, PlayerId, RulesetConfig } from '../types';
import { isV3CombatEnabled } from '../types';
import { opponentOf, checkWinner } from './createGame';
import { cloneState, drawForPlayer, clampHp } from './helpers';
import { applyInstantGlitch } from './effects';
import { findElementDef, findGlitchDef } from './lookup';
import type { Rng } from './deck';
import { applyStatus } from './status/applyStatus';
import { enableDoubleReactionThisAction } from './status/v3CombatHooks';

function findUltimateId(pack: ContentPack, characterId: string): string | undefined {
  return pack.characters.find((c) => c.id === characterId)?.ultimateId;
}

function buildFromHandAfterUlti(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  const next = cloneState(state);
  const cardIdx = next.players[playerId].hand.findIndex((c) => findElementDef(pack, c.defId));
  if (cardIdx === -1) return next;

  if (next.players[playerId].bound.length >= ruleset.maxBoundCards) {
    const [old] = next.players[playerId].bound.splice(0, 1);
    next.piles.discard.push(old);
  }

  const [card] = next.players[playerId].hand.splice(cardIdx, 1);
  const bound: BoundCardInstance = {
    ...card,
    exhausted: false,
    resistanceBonus: 0,
  };
  next.players[playerId].bound.push(bound);
  next.lastEvent = `${next.lastEvent ?? ''} Ulti-Bau durchgeführt.`;
  return next;
}

function drawWithInstantGlitches(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  count: number,
  rng: Rng,
  ruleset: RulesetConfig,
): GameState {
  let next = state;
  for (let i = 0; i < count; i++) {
    next = drawForPlayer(next, playerId, 1, rng, ruleset);
    const drawn = next.players[playerId].hand[next.players[playerId].hand.length - 1];
    if (!drawn) continue;
    const glitch = findGlitchDef(pack, drawn.defId);
    if (glitch?.glitchType === 'instant') {
      next.players[playerId].hand.pop();
      next.piles.discard.push(drawn);
      next = applyInstantGlitch(next, pack, playerId, glitch, rng, ruleset, drawn.instanceId);
      if (next.winner) return next;
    }
  }
  return next;
}

/** Execute ultimate for character; does not mark ultimate used (caller handles). */
export function applyUltimateEffect(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  ultimateId: string,
  rng: Rng,
  ruleset: RulesetConfig,
): GameState {
  let next = cloneState(state);
  const opponent = opponentOf(playerId);
  const ult = pack.ultimates.find((u) => u.id === ultimateId);
  if (!ult) throw new Error(`Unknown ultimate: ${ultimateId}`);

  switch (ultimateId) {
    case 'ulti-knuspergnom': {
      next.players[opponent].hp = clampHp(next.players[opponent].hp - 5, ruleset);
      next.players[playerId].hp = clampHp(next.players[playerId].hp + 3, ruleset);
      next.lastEvent = 'Mit Alles und Scharf: 5 Schaden, 3 Heilung.';
      if (isV3CombatEnabled(ruleset)) {
        next = applyStatus(next, opponent, 'brennen', 2);
        next = enableDoubleReactionThisAction(next);
        next.lastEvent += ' V3: 2 Brennen, Doppelreaktion.';
      }
      next = buildFromHandAfterUlti(next, pack, playerId, ruleset);
      break;
    }
    case 'ulti-schluckspecht': {
      next.players[playerId].hp = clampHp(next.players[playerId].hp + 4, ruleset);
      next.players[opponent].hp = clampHp(next.players[opponent].hp - 3, ruleset);
      if (next.players[playerId].hp < next.players[opponent].hp) {
        next = drawForPlayer(next, playerId, 1, rng, ruleset);
      }
      next.lastEvent = 'Lass laufen, Bruder: 4 Heilung, 3 Schaden.';
      if (isV3CombatEnabled(ruleset)) {
        next = applyStatus(next, opponent, 'durchnaesst', 1);
        next.lastEvent += ' V3: Durchnässt.';
      }
      break;
    }
    case 'ulti-stiernackenkommando': {
      next.players[playerId].doubleNextAttack = true;
      next.lastEvent = 'Rückhandbombe: Nächster Angriff doppelter Schaden.';
      if (isV3CombatEnabled(ruleset)) {
        next = enableDoubleReactionThisAction(next);
        next.lastEvent += ' V3: Doppelreaktion.';
      }
      break;
    }
    case 'ulti-kokabell': {
      if (next.players[playerId].hp < 12) {
        next.players[playerId].hp = 12;
      }
      let refreshed = 0;
      for (const b of next.players[playerId].bound) {
        if (b.exhausted && refreshed < 2) {
          b.exhausted = false;
          refreshed++;
        }
      }
      next.lastEvent = `Golden Shower: ${refreshed} Karte(n) aufgestellt.`;
      break;
    }
    case 'ulti-pillendoktora': {
      next.players[playerId].hp = clampHp(next.players[playerId].hp + 4, ruleset);
      next.players[opponent].hp = clampHp(next.players[opponent].hp - 4, ruleset);
      next = drawWithInstantGlitches(next, pack, playerId, 2, rng, ruleset);
      if (next.players[playerId].hand.length > 0) {
        const removed = next.players[playerId].hand.pop()!;
        next.piles.discard.push(removed);
      }
      next.lastEvent = '3 Tage wach ausgeführt.';
      break;
    }
    case 'ulti-dripministerin': {
      const oppHand = next.players[opponent].hand;
      const toDiscard = Math.min(2, oppHand.length);
      for (let i = 0; i < toDiscard; i++) {
        const removed = oppHand.pop();
        if (removed) next.piles.discard.push(removed);
      }
      const missing = 2 - toDiscard;
      next.players[opponent].hp = clampHp(next.players[opponent].hp - 3 - missing, ruleset);
      const oppBound = next.players[opponent].bound.find((b) => !b.exhausted)
        ?? next.players[opponent].bound[0];
      if (oppBound) oppBound.exhausted = true;
      next.lastEvent = 'Runway ins Schattenreich ausgeführt.';
      break;
    }
    case 'ulti-mysterium': {
      const oppUltId = findUltimateId(pack, next.players[opponent].characterId);
      // Copying Echo against Echo would recurse forever in mirror matches.
      if (oppUltId && oppUltId !== 'ulti-mysterium') {
        next = applyUltimateEffect(next, pack, playerId, oppUltId, rng, ruleset);
        next = drawForPlayer(next, playerId, 1, rng, ruleset);
        next.lastEvent = 'Echo: Gegner-Ulti kopiert.';
      } else if (oppUltId === 'ulti-mysterium') {
        next = drawForPlayer(next, playerId, 1, rng, ruleset);
        next.lastEvent = 'Echo: Spiegel-Duell — 1 Karte gezogen.';
      } else {
        next.lastEvent = 'Echo: Kein Gegner-Ulti gefunden.';
      }
      break;
    }
    default:
      next.lastEvent = `${ult.name} ausgeführt.`;
  }

  return checkWinner(next);
}

export function getUltimateForPlayer(pack: ContentPack, characterId: string) {
  const char = pack.characters.find((c) => c.id === characterId);
  if (!char) return undefined;
  return pack.ultimates.find((u) => u.id === char.ultimateId);
}
