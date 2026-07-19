/**
 * V2 phrase passive, challenge resistance, and activate helpers.
 * Location: src/game/engine/phraseBonuses.ts
 */
import type {
  ActivateArchetype,
  BoundCardInstance,
  ContentPack,
  Element,
  GameState,
  PassiveArchetype,
  PlayerId,
  RulesetConfig,
} from '../types';
import { opponentOf, checkWinner } from './createGame';
import { cloneState, clampHp } from './helpers';
import { findElementDef, findEnginePartDef } from './lookup';
import { isV2Pack, phraseSlotCards } from './phraseBuild';

/** Phrase parts only — charge is not challengeable (V2 H2). */
export function isChallengeablePhraseTarget(bound: BoundCardInstance): boolean {
  return Boolean(bound.phraseSlot && bound.phraseSlot !== 'charge');
}

export function canChallengeBoundTarget(pack: ContentPack, bound: BoundCardInstance): boolean {
  if (bound.phraseSlot === 'charge') return false;
  if (isV2Pack(pack)) return Boolean(findEnginePartDef(pack, bound.defId));
  return Boolean(findElementDef(pack, bound.defId));
}

/** Sum +1 per built phrase part with matching passive on owner (KISS). */
export function countPassiveBonus(
  pack: ContentPack,
  bound: BoundCardInstance[],
  passive: PassiveArchetype,
): number {
  let count = 0;
  for (const card of phraseSlotCards(bound)) {
    const part = findEnginePartDef(pack, card.defId);
    if (part?.passiveArchetype === passive) count += 1;
  }
  return count;
}

// p_draw: deferred — needs per-turn "after build" tracking (SPIELANLEITUNG_V2 D31); see issue #46.

export function challengeTargetResistance(
  pack: ContentPack,
  bound: BoundCardInstance,
): number {
  const part = findEnginePartDef(pack, bound.defId);
  if (part) return part.resistance + bound.resistanceBonus;
  const element = findElementDef(pack, bound.defId);
  if (!element) throw new Error('Invalid bound card');
  return element.value + bound.resistanceBonus;
}

export function challengeTargetElement(
  pack: ContentPack,
  bound: BoundCardInstance,
): Element | undefined {
  return (
    findEnginePartDef(pack, bound.defId)?.element ?? findElementDef(pack, bound.defId)?.element
  );
}

export function boundDisplayName(pack: ContentPack, bound: BoundCardInstance): string {
  return (
    findEnginePartDef(pack, bound.defId)?.name ??
    findElementDef(pack, bound.defId)?.name ??
    'Karte'
  );
}

/** A1 activate effect for engine parts; caller pays discard + sets exhausted. */
export function applyActivateArchetype(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  boundInstanceId: string,
  activate: ActivateArchetype,
  ruleset: RulesetConfig,
): GameState {
  let next = cloneState(state);
  const bound = next.players[playerId].bound.find((b) => b.instanceId === boundInstanceId);
  if (!bound || bound.exhausted) throw new Error('Bound card not activatable');

  bound.exhausted = true;
  const opponent = opponentOf(playerId);

  switch (activate) {
    case 'a_dmg':
      next.players[opponent].hp = clampHp(next.players[opponent].hp - 2, ruleset);
      next.lastEvent = 'Aktivierung: 2 Schaden.';
      break;
    case 'a_heal':
      next.players[playerId].hp = clampHp(next.players[playerId].hp + 2, ruleset);
      next.lastEvent = 'Aktivierung: 2 Leben geheilt.';
      break;
    case 'a_exhaust': {
      const target =
        next.players[opponent].bound.find(
          (b) => b.phraseSlot && b.phraseSlot !== 'charge' && !b.exhausted,
        ) ??
        next.players[opponent].bound.find((b) => b.phraseSlot && b.phraseSlot !== 'charge');
      if (target) {
        target.exhausted = true;
        next.lastEvent = `Aktivierung: ${boundDisplayName(pack, target)} erschöpft.`;
      } else {
        next.lastEvent = 'Aktivierung: Kein gegnerisches Phrase-Teil.';
      }
      break;
    }
  }

  return checkWinner(next);
}
