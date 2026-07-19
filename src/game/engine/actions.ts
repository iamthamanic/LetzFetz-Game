import type {
  BoundCardInstance,
  ContentPack,
  ElementCardDef,
  GameAction,
  GameState,
  PlayerId,
  RulesetConfig,
} from '../types';
import { DEFAULT_RULESET, TURN_PHASES, type TurnPhase } from '../types';
import { calculateCombatValue, resolveDamage, challengeSucceeded, counterBonus } from './combat';
import { diceBonusFromRoll, rollD6 } from './dice';
import { opponentOf, checkWinner } from './createGame';
import {
  cloneState,
  discardFromHand,
  drawForPlayer,
  enforceHandLimit,
  getCharacterElements,
  clampHp,
} from './helpers';
import { applyElementEffect, applyBoundActivation, finishMainAction, applyInstantGlitch } from './effects';
import { findElementDef, findEnginePartDef, findGlitchDef } from './lookup';
import {
  canBuildBoost,
  canBuildEnginePart,
  hasChargeCard,
  isV2Pack,
  phraseSlotCards,
  resolveV2BuildSlot,
} from './phraseBuild';
import { applyUltimateEffect } from './ultimate';

export { findElementDef } from './lookup';

export interface PackContext {
  pack: ContentPack;
  playerId: PlayerId;
  ruleset?: RulesetConfig;
  rng?: () => number;
}

function rulesetOf(ctx: PackContext): RulesetConfig {
  return ctx.ruleset ?? DEFAULT_RULESET;
}

function rngOf(ctx: PackContext): () => number {
  return ctx.rng ?? Math.random;
}

function getChallengeMargin(state: GameState): number {
  return state.arena.arenaId === 'arena-sumpf' ? 2 : 1;
}

function runStartPhase(state: GameState, playerId: PlayerId): GameState {
  const next = cloneState(state);
  next.players[playerId].bound = next.players[playerId].bound.map((b) => ({
    ...b,
    exhausted: false,
  }));
  next.phase = 'draw';
  next.lastEvent = 'Erschöpfte Karten aufgestellt.';
  return next;
}

function runDrawPhase(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  rng: () => number,
  ruleset: RulesetConfig,
): GameState {
  let next = drawForPlayer(state, playerId, 1, rng, ruleset);
  const drawn = next.players[playerId].hand[next.players[playerId].hand.length - 1];
  if (!drawn) {
    next.phase = 'bind';
    return next;
  }

  const glitch = findGlitchDef(pack, drawn.defId);
  if (glitch?.glitchType === 'instant') {
    next.players[playerId].hand.pop();
    next.piles.discard.push(drawn);
    next = applyInstantGlitch(next, pack, playerId, glitch, rng, ruleset);
    if (next.winner) return next;
  }

  next.phase = 'bind';
  next.lastEvent = next.lastEvent ?? '1 Karte gezogen.';
  return next;
}

function computeAttackValueForPlayer(
  pack: ContentPack,
  state: GameState,
  playerId: PlayerId,
  def: ElementCardDef,
  diceRoll: number,
  ruleset: RulesetConfig,
): number {
  const bonus = diceBonusFromRoll(diceRoll, ruleset);
  return calculateCombatValue({
    cardValue: def.value,
    diceRoll,
    diceBonus: bonus,
    characterElements: getCharacterElements(pack, state.players[playerId].characterId),
    cardElement: def.element,
  });
}

function computeBlockValueForPlayer(
  pack: ContentPack,
  state: GameState,
  playerId: PlayerId,
  def: ElementCardDef,
  diceRoll: number,
  attackElement: ElementCardDef['element'],
  ruleset: RulesetConfig,
): number {
  const bonus = diceBonusFromRoll(diceRoll, ruleset);
  return calculateCombatValue({
    cardValue: def.value,
    diceRoll,
    diceBonus: bonus,
    characterElements: getCharacterElements(pack, state.players[playerId].characterId),
    cardElement: def.element,
    attackElement,
    blockElement: def.element,
  });
}

function computeChallengeAttackValue(
  pack: ContentPack,
  state: GameState,
  playerId: PlayerId,
  attackDef: ElementCardDef,
  targetBoundDefId: string,
  diceRoll: number,
  ruleset: RulesetConfig,
): number {
  const base = computeAttackValueForPlayer(pack, state, playerId, attackDef, diceRoll, ruleset);
  const targetDef = findElementDef(pack, targetBoundDefId);
  if (!targetDef) return base;
  const targetElement = targetDef.element;
  return base + counterBonus(attackDef.element, targetElement);
}

function resolveCombat(
  state: GameState,
  blockValue: number,
  ruleset: RulesetConfig,
): GameState {
  if (!state.combat) return state;
  const next = cloneState(state);
  const { attackerId, defenderId, attackValue } = state.combat;
  let damage = resolveDamage(attackValue, blockValue);

  if (state.combat.mode === 'player' && next.players[attackerId].doubleNextAttack) {
    damage *= 2;
    next.players[attackerId].doubleNextAttack = false;
    next.players[attackerId].hp = clampHp(next.players[attackerId].hp - 1, ruleset);
  }

  next.players[defenderId].hp = clampHp(next.players[defenderId].hp - damage, ruleset);
  next.combat = null;
  next.phase = 'end';
  next.lastEvent =
    damage > 0
      ? `${damage} Schaden (${attackValue} vs ${blockValue} Block).`
      : `Komplett geblockt (${attackValue} vs ${blockValue}).`;
  return checkWinner(next);
}

function resolveChallengeCombat(
  state: GameState,
  pack: ContentPack,
  blockValue: number,
  ruleset: RulesetConfig,
): GameState {
  if (!state.combat || state.combat.mode !== 'challenge') return state;
  const next = cloneState(state);
  const { defenderId, attackValue, targetBoundInstanceId } = state.combat;

  const boundIdx = next.players[defenderId].bound.findIndex(
    (b) => b.instanceId === targetBoundInstanceId,
  );
  if (boundIdx === -1) throw new Error('Challenge target not found');

  const bound = next.players[defenderId].bound[boundIdx];
  const boundDef = findElementDef(pack, bound.defId);
  if (!boundDef) throw new Error('Invalid bound card');

  const targetResistance = boundDef.value + bound.resistanceBonus;
  const margin = getChallengeMargin(state);
  const succeeded = challengeSucceeded(attackValue, targetResistance, blockValue, margin);

  if (succeeded) {
    const [removed] = next.players[defenderId].bound.splice(boundIdx, 1);
    next.piles.discard.push(removed);
    next.lastEvent = `Herausforderung erfolgreich — ${boundDef.name} zerstört (${attackValue} vs ${targetResistance + blockValue}).`;
  } else {
    next.lastEvent = `Herausforderung fehlgeschlagen (${attackValue} vs ${targetResistance + blockValue}).`;
  }

  next.combat = null;
  next.phase = 'end';
  return checkWinner(next);
}

/** Legal actions for the current phase — expanded in Phase 1. */
export function getLegalActions(state: GameState, ctx: PackContext): GameAction[] {
  if (state.winner) return [];

  const ruleset = rulesetOf(ctx);

  if (state.combat) {
    const { defenderId } = state.combat;
    if (ctx.playerId !== defenderId) return [];
    const actions: GameAction[] = [{ type: 'PASS_BLOCK' }];
    for (const card of state.players[defenderId].hand) {
      const def = findElementDef(ctx.pack, card.defId);
      if (def?.cardType === 'block') {
        actions.push({ type: 'PLAY_BLOCK', cardInstanceId: card.instanceId });
      }
    }
    return actions;
  }

  if (state.activePlayer !== ctx.playerId) return [];

  const actions: GameAction[] = [];
  const hand = state.players[ctx.playerId].hand;

  if (state.phase === 'start') {
    actions.push({ type: 'ADVANCE_PHASE' });
  }

  if (state.phase === 'draw') {
    actions.push({ type: 'ADVANCE_PHASE' });
  }

  if (state.phase === 'bind') {
    actions.push({ type: 'SKIP_BIND' });
    const bound = state.players[ctx.playerId].bound;

    if (isV2Pack(ctx.pack)) {
      for (const card of hand) {
        const part = findEnginePartDef(ctx.pack, card.defId);
        if (part) {
          if (canBuildEnginePart(bound)) {
            actions.push({ type: 'BIND_CARD', cardInstanceId: card.instanceId });
          } else {
            for (const phraseCard of phraseSlotCards(bound)) {
              actions.push({
                type: 'BIND_CARD',
                cardInstanceId: card.instanceId,
                discardBoundId: phraseCard.instanceId,
              });
            }
          }
          continue;
        }

        const element = findElementDef(ctx.pack, card.defId);
        if (element?.cardType === 'boost') {
          if (canBuildBoost(bound)) {
            actions.push({ type: 'BIND_CARD', cardInstanceId: card.instanceId });
          } else {
            const chargeCard = bound.find((b) => b.phraseSlot === 'charge');
            if (chargeCard) {
              actions.push({
                type: 'BIND_CARD',
                cardInstanceId: card.instanceId,
                discardBoundId: chargeCard.instanceId,
              });
            }
          }
        }
      }
    } else {
      const boundCount = bound.length;
      for (const card of hand) {
        if (findElementDef(ctx.pack, card.defId)) {
          if (boundCount < ruleset.maxBoundCards) {
            actions.push({ type: 'BIND_CARD', cardInstanceId: card.instanceId });
          } else {
            for (const b of bound) {
              actions.push({
                type: 'BIND_CARD',
                cardInstanceId: card.instanceId,
                discardBoundId: b.instanceId,
              });
            }
          }
        }
      }
    }
  }

  if (state.phase === 'action') {
    const opponent = opponentOf(ctx.playerId);
    const oppBound = state.players[opponent].bound;

    for (const card of hand) {
      const def = findElementDef(ctx.pack, card.defId);
      if (def?.cardType === 'attack') {
        actions.push({ type: 'PLAY_ATTACK', cardInstanceId: card.instanceId });
        for (const bound of oppBound) {
          actions.push({
            type: 'CHALLENGE',
            attackCardInstanceId: card.instanceId,
            targetBoundInstanceId: bound.instanceId,
          });
        }
      }
      if (def?.cardType === 'boost') {
        actions.push({ type: 'PLAY_BOOST', cardInstanceId: card.instanceId });
      }
    }
    if (state.players[ctx.playerId].ultimateAvailable) {
      actions.push({ type: 'PLAY_ULTIMATE' });
    }
    for (const card of hand) {
      if (hand.length >= 1) {
        actions.push({ type: 'DISCARD_DRAW', discardInstanceId: card.instanceId });
      }
    }
    const player = state.players[ctx.playerId];
    for (const bound of player.bound) {
      if (!bound.exhausted) {
        for (const handCard of hand) {
          actions.push({
            type: 'ACTIVATE_BOUND',
            boundInstanceId: bound.instanceId,
            discardHandInstanceId: handCard.instanceId,
          });
        }
      }
    }
    actions.push({ type: 'END_TURN' });
  }

  if (state.phase === 'end') {
    actions.push({ type: 'END_TURN' });
  }

  return actions;
}

export function advancePhase(phase: TurnPhase): TurnPhase {
  const idx = TURN_PHASES.indexOf(phase);
  return TURN_PHASES[Math.min(idx + 1, TURN_PHASES.length - 1)];
}

/** Apply a validated action. */
export function applyAction(
  state: GameState,
  action: GameAction,
  playerId: PlayerId,
  ctx: PackContext,
): GameState {
  if (state.winner) return state;
  const pack = ctx.pack;
  const ruleset = rulesetOf(ctx);
  const rng = rngOf(ctx);

  if (state.combat) {
    return applyCombatResponse(state, action, playerId, ctx);
  }

  if (state.activePlayer !== playerId) {
    throw new Error('Not active player');
  }

  let next: GameState;

  switch (action.type) {
    case 'ADVANCE_PHASE': {
      if (state.phase === 'start') return runStartPhase(state, playerId);
      if (state.phase === 'draw') return runDrawPhase(state, pack, playerId, rng, ruleset);
      throw new Error(`ADVANCE_PHASE not valid in phase ${state.phase}`);
    }
    case 'SKIP_BIND': {
      if (state.phase !== 'bind') throw new Error('Not in bind phase');
      next = cloneState(state);
      next.phase = 'action';
      next.lastEvent = 'Keine Karte gebunden.';
      return next;
    }
    case 'BIND_CARD': {
      if (state.phase !== 'bind') throw new Error('Not in bind phase');
      next = cloneState(state);
      const handIdx = next.players[playerId].hand.findIndex(
        (c) => c.instanceId === action.cardInstanceId,
      );
      if (handIdx === -1) throw new Error('Card not in hand');
      const handCard = next.players[playerId].hand[handIdx];
      const defId = handCard.defId;

      if (isV2Pack(pack)) {
        const part = findEnginePartDef(pack, defId);
        const element = findElementDef(pack, defId);

        if (!part && element?.cardType !== 'boost') {
          throw new Error('Cannot build this card in V2');
        }

        if (action.discardBoundId) {
          const discardIdx = next.players[playerId].bound.findIndex(
            (b) => b.instanceId === action.discardBoundId,
          );
          if (discardIdx === -1) throw new Error('Bound card not found');
          const discarded = next.players[playerId].bound[discardIdx];
          if (part) {
            if (!discarded?.phraseSlot || discarded.phraseSlot === 'charge') {
              throw new Error('Must discard a phrase card first');
            }
          } else if (element?.cardType === 'boost') {
            if (discarded?.phraseSlot !== 'charge') {
              throw new Error('Must discard charge card first');
            }
          }
          const [old] = next.players[playerId].bound.splice(discardIdx, 1);
          next.piles.discard.push(old);
        }

        const phraseSlot = resolveV2BuildSlot(
          pack,
          defId,
          next.players[playerId].bound,
        );
        const [card] = next.players[playerId].hand.splice(handIdx, 1);
        const builtName =
          part?.name ?? findElementDef(pack, defId)?.name ?? 'Karte';
        const bound: BoundCardInstance = {
          ...card,
          exhausted: false,
          resistanceBonus: 0,
          phraseSlot,
        };
        next.players[playerId].bound.push(bound);
        next.phase = 'action';
        next.lastEvent = `${builtName} gebaut (${phraseSlot}).`;
        return next;
      }

      const def = findElementDef(pack, defId);
      if (!def) throw new Error('Only element cards can be bound');

      if (next.players[playerId].bound.length >= ruleset.maxBoundCards) {
        if (!action.discardBoundId) throw new Error('Must discard a bound card first');
        const bIdx = next.players[playerId].bound.findIndex(
          (b) => b.instanceId === action.discardBoundId,
        );
        if (bIdx === -1) throw new Error('Bound card not found');
        const [old] = next.players[playerId].bound.splice(bIdx, 1);
        next.piles.discard.push(old);
      }

      const [card] = next.players[playerId].hand.splice(handIdx, 1);
      const bound: BoundCardInstance = {
        ...card,
        exhausted: false,
        resistanceBonus: 0,
      };
      next.players[playerId].bound.push(bound);
      next.phase = 'action';
      next.lastEvent = `${def.name} gebunden.`;
      return next;
    }
    case 'PLAY_ATTACK': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      const def = findElementDef(
        pack,
        state.players[playerId].hand.find((c) => c.instanceId === action.cardInstanceId)?.defId ?? '',
      );
      if (!def || def.cardType !== 'attack') throw new Error('Not an attack card');

      const diceRoll = action.diceRoll ?? rollD6(rng);
      const attackValue = computeAttackValueForPlayer(pack, state, playerId, def, diceRoll, ruleset);

      next = discardFromHand(state, playerId, action.cardInstanceId);
      const defenderId = opponentOf(playerId);
      next.combat = {
        attackerId: playerId,
        defenderId,
        attackCardDefId: def.id,
        attackRoll: diceRoll,
        attackValue,
        mode: 'player',
      };
      next.lastEvent = `Angriff ${attackValue} (Würfel ${diceRoll}). Gegner darf blocken.`;
      return next;
    }
    case 'CHALLENGE': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      const defenderId = opponentOf(playerId);
      const target = state.players[defenderId].bound.find(
        (b) => b.instanceId === action.targetBoundInstanceId,
      );
      if (!target) throw new Error('Challenge target not found');

      const handCard = state.players[playerId].hand.find(
        (c) => c.instanceId === action.attackCardInstanceId,
      );
      const def = handCard ? findElementDef(pack, handCard.defId) : undefined;
      if (!def || def.cardType !== 'attack') throw new Error('Not an attack card');

      const diceRoll = action.diceRoll ?? rollD6(rng);
      const attackValue = computeChallengeAttackValue(
        pack,
        state,
        playerId,
        def,
        target.defId,
        diceRoll,
        ruleset,
      );

      next = discardFromHand(state, playerId, action.attackCardInstanceId);
      next.combat = {
        attackerId: playerId,
        defenderId,
        attackCardDefId: def.id,
        attackRoll: diceRoll,
        attackValue,
        mode: 'challenge',
        targetBoundInstanceId: action.targetBoundInstanceId,
      };
      next.lastEvent = `Herausforderung ${attackValue} (Würfel ${diceRoll}). Gegner darf blocken.`;
      return next;
    }
    case 'PLAY_ULTIMATE': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      if (!state.players[playerId].ultimateAvailable) throw new Error('Ultimate already used');

      const character = pack.characters.find((c) => c.id === state.players[playerId].characterId);
      if (!character) throw new Error('Character not found');

      next = applyUltimateEffect(state, pack, playerId, character.ultimateId, rng, ruleset);
      next.players[playerId].ultimateAvailable = false;
      return finishMainAction(next);
    }
    case 'PLAY_BOOST': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      const def = findElementDef(
        pack,
        state.players[playerId].hand.find((c) => c.instanceId === action.cardInstanceId)?.defId ?? '',
      );
      if (!def || def.cardType !== 'boost') throw new Error('Not a boost card');

      next = discardFromHand(state, playerId, action.cardInstanceId);
      next = applyElementEffect(next, playerId, def.element, rng, ruleset);
      return finishMainAction(next);
    }
    case 'DISCARD_DRAW': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      next = discardFromHand(state, playerId, action.discardInstanceId);
      next = drawForPlayer(next, playerId, 2, rng, ruleset);
      next.lastEvent = '1 Karte abgeworfen, 2 gezogen.';
      return finishMainAction(checkWinner(next));
    }
    case 'ACTIVATE_BOUND': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      const bound = state.players[playerId].bound.find(
        (b) => b.instanceId === action.boundInstanceId,
      );
      if (!bound || bound.exhausted) throw new Error('Cannot activate this bound card');

      const boundDef = findElementDef(pack, bound.defId);
      if (!boundDef) throw new Error('Invalid bound card');

      next = discardFromHand(state, playerId, action.discardHandInstanceId);
      next = applyBoundActivation(
        next,
        playerId,
        action.boundInstanceId,
        boundDef.element,
        rng,
        ruleset,
      );
      return finishMainAction(next);
    }
    case 'END_TURN': {
      if (state.phase === 'action') {
        next = cloneState(state);
        next.phase = 'end';
        next.lastEvent = 'Hauptaktion ausgelassen.';
        return next;
      }
      if (state.phase !== 'end') {
        throw new Error('Cannot end turn in this phase');
      }
      next = enforceHandLimit(state, playerId, ruleset);
      const nextPlayer = opponentOf(playerId);
      next = {
        ...next,
        activePlayer: nextPlayer,
        phase: 'start',
        turnNumber: playerId === 'p2' ? next.turnNumber + 1 : next.turnNumber,
        lastEvent: 'Zug beendet.',
      };
      return checkWinner(next);
    }
    case 'PLAY_BLOCK':
    case 'PASS_BLOCK':
      throw new Error('No pending combat');
    default:
      throw new Error('Unknown action');
  }
}

function applyCombatResponse(
  state: GameState,
  action: GameAction,
  playerId: PlayerId,
  ctx: PackContext,
): GameState {
  if (!state.combat) throw new Error('No pending combat');
  const { defenderId, attackCardDefId } = state.combat;
  if (playerId !== defenderId) throw new Error('Only defender can respond');

  const pack = ctx.pack;
  const ruleset = rulesetOf(ctx);
  const rng = rngOf(ctx);
  const attackDef = findElementDef(pack, attackCardDefId);
  if (!attackDef) throw new Error('Attack card missing');

  if (action.type === 'PASS_BLOCK') {
    if (state.combat.mode === 'challenge') {
      return resolveChallengeCombat(state, pack, 0, ruleset);
    }
    return resolveCombat(state, 0, ruleset);
  }

  if (action.type === 'PLAY_BLOCK') {
    const def = findElementDef(
      pack,
      state.players[playerId].hand.find((c) => c.instanceId === action.cardInstanceId)?.defId ?? '',
    );
    if (!def || def.cardType !== 'block') throw new Error('Not a block card');

    const diceRoll = action.diceRoll ?? rollD6(rng);
    const blockValue = computeBlockValueForPlayer(
      pack,
      state,
      playerId,
      def,
      diceRoll,
      attackDef.element,
      ruleset,
    );

    let next = discardFromHand(state, playerId, action.cardInstanceId);
    if (state.combat.mode === 'challenge') {
      next = resolveChallengeCombat(next, pack, blockValue, ruleset);
    } else {
      next = resolveCombat(next, blockValue, ruleset);
    }
    if (next.lastEvent) {
      next.lastEvent = `Block ${blockValue} (Würfel ${diceRoll}). ${next.lastEvent}`;
    }
    return next;
  }

  throw new Error('Invalid combat action');
}
