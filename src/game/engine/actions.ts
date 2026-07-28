import type {
  BoundCardInstance,
  ContentPack,
  ElementCardDef,
  GameAction,
  GameState,
  PendingChoice,
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
  ensureMeta,
  getCharacterElements,
  clampHp,
} from './helpers';
import { applyElementEffect, applyBoundActivation, finishMainAction, applyInstantGlitch } from './effects';
import { findElementDef, findEnginePartDef, findGlitchDef } from './lookup';
import { applyDamageThroughShield } from './status/shield';
import { pickReaction, resolveImpulseReactions } from './status/reactionChoice';
import {
  tickBrennenAfterMainAction,
  tickStatusesEndOfTurn,
  tryConsumeFokusReroll,
} from './status/tickStatuses';
import { clearV3ActionHooks } from './status/v3CombatHooks';
import { tryApplyTransform } from './status/transform';
import { getStatus, hasStatus } from './status/applyStatus';
import {
  activateFetzPart,
  hasPoolActivate,
  partActivateCost,
  runFetzPassiveTrigger,
} from './status/fetzgeraetEffects';
import { canSpendFetzCharge, gainFetzCharge } from './status/fetzCharge';
import type { Element } from '../types';
import { isV3CombatEnabled } from '../types';
import type { ReactionId } from './status/reactions';
import {
  canBuildBoost,
  canBuildEnginePart,
  hasChargeCard,
  isV2Pack,
  phraseSlotCards,
  resolveV2BuildSlot,
} from './phraseBuild';
import { resolveBuildSlots } from './status/fetzgeraetSlots';
import {
  applyActivateArchetype,
  boundDisplayName,
  canChallengeBoundTarget,
  challengeTargetElement,
  challengeTargetResistance,
  countPassiveBonus,
  monoAttackBonus,
  monoBlockBonus,
} from './phraseBonuses';
import { applyUltimateEffect } from './ultimate';
import {
  getChallengeMargin,
  applyVulkanAttackRoll,
  applySumpfBlockRoll,
  markAttackOrChallenge,
  onStartPhaseArena,
  onEndTurnArena,
  afterHighAttackValue,
  afterBoundDestroyed,
  isSpaeti,
  isKristall,
  isClub,
  isSumpf,
} from './arena';
import { listOwnTurnGlitchActions, applyPlayableGlitch } from './playableGlitches';

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

function runStartPhase(
  state: GameState,
  playerId: PlayerId,
  rng: () => number,
  ruleset: RulesetConfig,
): GameState {
  const next = onStartPhaseArena(state, playerId, rng, ruleset);
  next.phase = 'draw';
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
    next.phase = 'build';
    return next;
  }

  const glitch = findGlitchDef(pack, drawn.defId);
  if (glitch?.glitchType === 'instant') {
    next.players[playerId].hand.pop();
    next.piles.discard.push(drawn);
    next = applyInstantGlitch(next, pack, playerId, glitch, rng, ruleset, drawn.instanceId);
    if (next.winner) return next;
  }

  next.phase = 'build';
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
  const bound = state.players[playerId].bound;
  const passiveBonus = isV2Pack(pack) ? countPassiveBonus(pack, bound, 'p_atk') : 0;
  const monoBonus = isV2Pack(pack) ? monoAttackBonus(state, pack, bound) : 0;
  return calculateCombatValue({
    cardValue: def.value,
    diceRoll,
    diceBonus: bonus,
    characterElements: getCharacterElements(pack, state.players[playerId].characterId),
    cardElement: def.element,
    extraBonus: passiveBonus + monoBonus,
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
  const bound = state.players[playerId].bound;
  const passiveBonus = isV2Pack(pack) ? countPassiveBonus(pack, bound, 'p_block') : 0;
  const monoBonus = isV2Pack(pack) ? monoBlockBonus(state, pack, bound) : 0;
  return calculateCombatValue({
    cardValue: def.value,
    diceRoll,
    diceBonus: bonus,
    characterElements: getCharacterElements(pack, state.players[playerId].characterId),
    cardElement: def.element,
    attackElement,
    blockElement: def.element,
    extraBonus: passiveBonus + monoBonus,
  });
}

function computeChallengeAttackValue(
  pack: ContentPack,
  state: GameState,
  playerId: PlayerId,
  attackDef: ElementCardDef,
  targetBound: BoundCardInstance,
  diceRoll: number,
  ruleset: RulesetConfig,
): number {
  const base = computeAttackValueForPlayer(pack, state, playerId, attackDef, diceRoll, ruleset);
  const targetElement = challengeTargetElement(pack, targetBound);
  if (!targetElement) return base;
  return base + counterBonus(attackDef.element, targetElement);
}

function defenderHasRueckkopplung(state: GameState): boolean {
  const defenderId = state.combat?.defenderId;
  if (!defenderId) return false;
  return state.players[defenderId].hand.some((c) => c.defId === 'glitch-rueckkopplung');
}

function opponentHasNeinBruder(state: GameState, boosterId: PlayerId): boolean {
  const opp = opponentOf(boosterId);
  return state.players[opp].hand.some((c) => c.defId === 'glitch-nein');
}

/** Arena Späti/Sumpf: draw 1 then must discard 1 — not skippable. */
function applyMandatoryArenaDrawDiscard(
  state: GameState,
  playerId: PlayerId,
  source: 'spaeti' | 'sumpf-full-block',
  pack: ContentPack,
  rng: () => number,
  ruleset: RulesetConfig,
): GameState {
  let next = drawForPlayer(state, playerId, 1, rng, ruleset, { allowExtra: true });
  const drawn = next.players[playerId].hand[next.players[playerId].hand.length - 1];
  if (drawn) {
    const glitch = findGlitchDef(pack, drawn.defId);
    if (glitch?.glitchType === 'instant') {
      next.players[playerId].hand.pop();
      next.piles.discard.push(drawn);
      next = applyInstantGlitch(next, pack, playerId, glitch, rng, ruleset, drawn.instanceId);
      if (next.winner) return next;
    }
  }
  if (source === 'spaeti') {
    next.meta = {
      ...next.meta,
      spaetiFilterUsed: { ...next.meta.spaetiFilterUsed, [playerId]: true },
    };
  }
  const revealNote =
    next.instantReveals.length > 0
      ? ` Sofort-Glitch: ${next.instantReveals.map((r) => r.resolution).join(' ')}`
      : '';
  if (next.players[playerId].hand.length === 0) {
    next.pendingChoice = null;
    next.lastEvent = `Arena: gezogen.${revealNote} — nichts abzuwerfen.`.trim();
    return checkWinner(next);
  }
  next.pendingChoice = { type: 'must-discard', playerId, source };
  next.lastEvent = `Arena: 1 gezogen.${revealNote} — jetzt 1 Karte abwerfen.`.trim();
  return checkWinner(next);
}

function queuePostBoostPending(
  state: GameState,
  boosterId: PlayerId,
  pack: ContentPack,
  rng: () => number,
  ruleset: RulesetConfig,
): GameState {
  if (isSpaeti(state) && !state.meta.spaetiFilterUsed[boosterId]) {
    return applyMandatoryArenaDrawDiscard(state, boosterId, 'spaeti', pack, rng, ruleset);
  }
  if (isSpaeti(state) && state.meta.boostsPlayed[boosterId] === 3) {
    const next = cloneState(state);
    next.pendingChoice = { type: 'spaeti-extra-build', playerId: boosterId };
    next.lastEvent = `${next.lastEvent ?? ''} Extra-Bau (3. Boost).`.trim();
    return next;
  }
  return state;
}

function incrementBoostsPlayed(state: GameState, boosterId: PlayerId): GameState {
  const next = cloneState(state);
  next.meta = {
    ...next.meta,
    boostsPlayed: {
      ...next.meta.boostsPlayed,
      [boosterId]: next.meta.boostsPlayed[boosterId] + 1,
    },
  };
  return next;
}

function resolveBoostAfterInterrupt(
  state: GameState,
  pack: ContentPack,
  pending: Extract<PendingChoice, { type: 'boost-interrupt' }>,
  rng: () => number,
  ruleset: RulesetConfig,
): GameState {
  const boostDef = findElementDef(pack, pending.boostDefId);
  if (!boostDef) throw new Error('Boost card definition missing');
  let next = cloneState(state);
  next.pendingChoice = null;
  next = applyElementEffect(next, pending.boosterId, boostDef.element, rng, ruleset, { pack });
  next = incrementBoostsPlayed(next, pending.boosterId);
  if (next.pendingChoice?.type === 'must-discard' && next.pendingChoice.source === 'air') {
    next.meta = { ...next.meta, awaitingPostBoostArena: true };
    return finishMainAction(next);
  }
  next = queuePostBoostPending(next, pending.boosterId, pack, rng, ruleset);
  return finishMainAction(next);
}

function applyPlayerAttackDamage(
  state: GameState,
  attackerId: PlayerId,
  defenderId: PlayerId,
  damage: number,
  attackValue: number,
  blockValue: number,
  ruleset: RulesetConfig,
  pack: ContentPack,
  rng: () => number,
  hitImpulseElement?: Element | null,
  fullBlockImpulseElement?: Element | null,
): GameState {
  let workingDamage = damage;
  let workingAttack = attackValue;
  let workingBlock = blockValue;

  if (isV3CombatEnabled(ruleset) && workingDamage > 0) {
    const reduced = runFetzPassiveTrigger(state, pack, defenderId, ruleset, 'onIncomingDamage', {
      attackerId,
      incomingDamage: workingDamage,
    });
    state = reduced.state;
    workingDamage = reduced.incomingDamage ?? workingDamage;
  }

  const pipeline = applyDamageThroughShield(state, defenderId, workingDamage, ruleset);
  let next = pipeline.state;
  next.combat = null;
  next.phase = 'end';

  const absorbedNote =
    pipeline.shieldAbsorbed > 0 ? ` Schild ${pipeline.shieldAbsorbed}.` : '';
  const combatSummary =
    workingDamage > 0
      ? `${pipeline.hpDamage} Schaden (${workingAttack} vs ${workingBlock} Block).${absorbedNote}`
      : `Komplett geblockt — Vollblock (${workingAttack} vs ${workingBlock}).${absorbedNote}`;
  next.lastEvent = combatSummary;

  if (isSumpf(next) && pipeline.isFullBlock) {
    next = applyMandatoryArenaDrawDiscard(next, defenderId, 'sumpf-full-block', pack, rng, ruleset);
  }

  const highBefore: Record<PlayerId, number> = {
    p1: getStatus(next, 'p1', 'high')?.stacks ?? 0,
    p2: getStatus(next, 'p2', 'high')?.stacks ?? 0,
  };

  if (isV3CombatEnabled(ruleset) && pipeline.isHit && hitImpulseElement) {
    next = resolveImpulseReactions(
      next,
      defenderId,
      hitImpulseElement,
      ruleset,
      attackerId,
      pack,
    );
  }
  if (isV3CombatEnabled(ruleset) && pipeline.isFullBlock && fullBlockImpulseElement) {
    next = resolveImpulseReactions(
      next,
      attackerId,
      fullBlockImpulseElement,
      ruleset,
      defenderId,
      pack,
    );
  }

  // Keep Vollblock visible when impulse/reaction overwrote lastEvent.
  if (
    pipeline.isFullBlock &&
    next.lastEvent &&
    next.lastEvent !== combatSummary &&
    !next.lastEvent.includes('Komplett geblockt') &&
    !next.lastEvent.includes('Vollblock')
  ) {
    next.lastEvent = `${combatSummary} ${next.lastEvent}`;
  }

  if (isV3CombatEnabled(ruleset)) {
    for (const pid of ['p1', 'p2'] as PlayerId[]) {
      const after = getStatus(next, pid, 'high')?.stacks ?? 0;
      if (after !== highBefore[pid]) {
        next = runFetzPassiveTrigger(next, pack, pid, ruleset, 'onHighGainOrSpend', {
          bonus: after > highBefore[pid],
        }).state;
      }
    }
  }

  if (isV3CombatEnabled(ruleset) && pipeline.isHit) {
    const hadBurn = hasStatus(state, defenderId, 'brennen');
    const hitFx = runFetzPassiveTrigger(next, pack, attackerId, ruleset, 'onAttackHit', {
      bonus: hadBurn,
    });
    next = hitFx.state;
  }

  if (isV3CombatEnabled(ruleset) && blockValue > 0) {
    const blockFx = runFetzPassiveTrigger(next, pack, defenderId, ruleset, 'onAfterOwnBlock', {
      bonus: pipeline.isFullBlock,
      blockValue: workingBlock,
    });
    next = blockFx.state;
    if (pipeline.isFullBlock) {
      const shieldFx = runFetzPassiveTrigger(
        next,
        pack,
        defenderId,
        ruleset,
        'onShieldFullBlockOrRepair',
        { bonus: true },
      );
      next = shieldFx.state;
    }
  }

  next = afterHighAttackValue(next, attackerId, workingAttack, ruleset);
  const hpBeforeTick = next.players[attackerId].hp;
  next = tickBrennenAfterMainAction(next, attackerId, ruleset);
  if (isV3CombatEnabled(ruleset) && next.players[attackerId].hp < hpBeforeTick) {
    for (const pid of ['p1', 'p2'] as PlayerId[]) {
      next = runFetzPassiveTrigger(next, pack, pid, ruleset, 'onStatusOrReactionDamage', {
        bonus: false,
      }).state;
    }
  }
  return checkWinner(next);
}

function impulseFromCard(
  pack: ContentPack,
  defId: string | undefined,
  trigger: 'onHit' | 'onFullBlock',
): Element | null {
  if (!defId) return null;
  const def = findElementDef(pack, defId);
  const kw = def?.elementImpulse;
  if (!kw || kw.trigger !== trigger) return null;
  return kw.element;
}

function resolveCombat(
  state: GameState,
  blockValue: number,
  ruleset: RulesetConfig,
  pack: ContentPack,
  rng: () => number,
  blockCardDefId?: string | null,
): GameState {
  if (!state.combat) return state;
  const { attackerId, defenderId, attackValue, attackCardDefId } = state.combat;
  let damage = resolveDamage(attackValue, blockValue);
  let doubleAttackApplied = false;

  if (state.combat.mode === 'player') {
    const working = cloneState(state);
    if (working.players[attackerId].doubleNextAttack) {
      damage *= 2;
      doubleAttackApplied = true;
      working.players[attackerId].doubleNextAttack = false;
      working.players[attackerId].hp = clampHp(working.players[attackerId].hp - 1, ruleset);
      state = working;
    }
  }

  const hitImpulse = impulseFromCard(pack, attackCardDefId, 'onHit');
  const fullBlockImpulse = impulseFromCard(pack, blockCardDefId ?? undefined, 'onFullBlock');

  if (damage > 0 && defenderHasRueckkopplung(state)) {
    const next = cloneState(state);
    next.pendingChoice = {
      type: 'damage-reduce',
      defenderId,
      attackerId,
      damage,
      attackValue,
      blockValue,
      mode: 'player',
      doubleAttackApplied,
      attackCardDefId,
      blockCardDefId: blockCardDefId ?? undefined,
    };
    next.combat = null;
    next.lastEvent = `Schaden ${damage} — Rückkopplung möglich.`;
    return next;
  }

  return applyPlayerAttackDamage(
    state,
    attackerId,
    defenderId,
    damage,
    attackValue,
    blockValue,
    ruleset,
    pack,
    rng,
    damage > 0 ? hitImpulse : null,
    damage <= 0 ? fullBlockImpulse : null,
  );
}

function resolveChallengeCombat(
  state: GameState,
  pack: ContentPack,
  blockValue: number,
  ruleset: RulesetConfig,
): GameState {
  if (!state.combat || state.combat.mode !== 'challenge') return state;
  const next = cloneState(state);
  const { attackerId, defenderId, attackValue, targetBoundInstanceId } = state.combat;

  const boundIdx = next.players[defenderId].bound.findIndex(
    (b) => b.instanceId === targetBoundInstanceId,
  );
  if (boundIdx === -1) throw new Error('Challenge target not found');

  const bound = next.players[defenderId].bound[boundIdx];
  const targetResistance = challengeTargetResistance(pack, bound);
  const margin = getChallengeMargin(state);
  const succeeded = challengeSucceeded(attackValue, targetResistance, blockValue, margin);
  const targetName = boundDisplayName(pack, bound);

  if (succeeded) {
    const [removed] = next.players[defenderId].bound.splice(boundIdx, 1);
    next.piles.discard.push(removed);
    next.lastEvent = `Herausforderung erfolgreich — ${targetName} zerstört (${attackValue} vs ${targetResistance + blockValue}).`;
    let afterDestroy = afterBoundDestroyed(next, attackerId, ruleset);
    afterDestroy.combat = null;
    afterDestroy.phase = 'end';
    return checkWinner(afterDestroy);
  }

  if (isClub(next) && next.arena.d6Variant === 2) {
    next.players[defenderId].bound[boundIdx].exhausted = true;
  }
  next.lastEvent = `Herausforderung fehlgeschlagen (${attackValue} vs ${targetResistance + blockValue}).`;
  next.combat = null;
  next.phase = 'end';
  return checkWinner(next);
}

function pendingChoicePlayer(pending: PendingChoice): PlayerId {
  switch (pending.type) {
    case 'boost-interrupt':
      return opponentOf(pending.boosterId);
    case 'damage-reduce':
      return pending.defenderId;
    case 'optional-draw-discard':
    case 'must-discard':
    case 'spaeti-extra-build':
      return pending.playerId;
    case 'pick-reaction':
      return pending.chooserId;
  }
}

function listBuildActionsForPlayer(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameAction[] {
  const actions: GameAction[] = [];
  const hand = state.players[playerId].hand;
  const boundCount = state.players[playerId].bound.length;
  for (const card of hand) {
    if (!findElementDef(pack, card.defId)) continue;
    if (boundCount < ruleset.maxBoundCards) {
      actions.push({ type: 'BUILD_CARD', cardInstanceId: card.instanceId });
    } else {
      for (const b of state.players[playerId].bound) {
        actions.push({
          type: 'BUILD_CARD',
          cardInstanceId: card.instanceId,
          discardBoundId: b.instanceId,
        });
      }
    }
  }
  return actions;
}

function listClubSwapActions(state: GameState, pack: ContentPack, playerId: PlayerId): GameAction[] {
  const actions: GameAction[] = [];
  const hand = state.players[playerId].hand;
  const bound = state.players[playerId].bound;
  for (const ret of bound) {
    for (const card of hand) {
      if (!findElementDef(pack, card.defId)) continue;
      actions.push({
        type: 'CLUB_SWAP',
        returnBoundInstanceId: ret.instanceId,
        buildHandInstanceId: card.instanceId,
      });
    }
  }
  return actions;
}

function listBasarExhaustActions(state: GameState, playerId: PlayerId): GameAction[] {
  const actions: GameAction[] = [];
  const opp = opponentOf(playerId);
  const oppBound = state.players[opp].bound;
  if (oppBound.length === 0) return actions;
  for (const handCard of state.players[playerId].hand) {
    for (const target of oppBound) {
      actions.push({
        type: 'BASAR_EXHAUST',
        discardHandInstanceId: handCard.instanceId,
        targetBoundInstanceId: target.instanceId,
      });
    }
  }
  return actions;
}

function getPendingLegalActions(state: GameState, ctx: PackContext): GameAction[] {
  const pending = state.pendingChoice;
  if (!pending) return [];
  const eligible = pendingChoicePlayer(pending);
  if (ctx.playerId !== eligible) return [];

  const actions: GameAction[] = [];
  // Arena draw/discard and Späti extra-build are mandatory — no PASS.
  if (pending.type === 'boost-interrupt' || pending.type === 'damage-reduce') {
    actions.push({ type: 'PASS_PENDING' });
  }

  switch (pending.type) {
    case 'boost-interrupt':
      for (const card of state.players[eligible].hand) {
        if (card.defId === 'glitch-nein') {
          actions.push({ type: 'PLAY_GLITCH', glitchInstanceId: card.instanceId });
        }
      }
      break;
    case 'damage-reduce':
      for (const card of state.players[eligible].hand) {
        if (card.defId === 'glitch-rueckkopplung') {
          actions.push({ type: 'PLAY_GLITCH', glitchInstanceId: card.instanceId });
        }
      }
      break;
    case 'optional-draw-discard':
      // Legacy pending type — draw is mandatory (no skip).
      actions.push({ type: 'TAKE_OPTIONAL_DRAW' });
      break;
    case 'must-discard':
      for (const card of state.players[eligible].hand) {
        actions.push({ type: 'RESOLVE_DRAW_DISCARD', discardInstanceId: card.instanceId });
      }
      break;
    case 'spaeti-extra-build':
      actions.push(...listBuildActionsForPlayer(state, ctx.pack, eligible, rulesetOf(ctx)));
      break;
    case 'pick-reaction':
      for (const opt of pending.options) {
        actions.push({ type: 'PICK_REACTION', reactionId: opt.reactionId });
      }
      break;
  }

  return actions;
}

/** Legal actions for the current phase — expanded in Phase 1. */
export function getLegalActions(state: GameState, ctx: PackContext): GameAction[] {
  if (state.winner) return [];

  const ruleset = rulesetOf(ctx);

  if (state.pendingChoice) {
    return getPendingLegalActions(state, ctx);
  }

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

  if (state.phase === 'build') {
    actions.push({ type: 'SKIP_BUILD' });
    const bound = state.players[ctx.playerId].bound;

    if (isV2Pack(ctx.pack)) {
      for (const card of hand) {
        const part = findEnginePartDef(ctx.pack, card.defId);
        if (part) {
          if (canBuildEnginePart(bound)) {
            actions.push({ type: 'BUILD_CARD', cardInstanceId: card.instanceId });
          } else {
            for (const phraseCard of phraseSlotCards(bound)) {
              actions.push({
                type: 'BUILD_CARD',
                cardInstanceId: card.instanceId,
                discardBoundId: phraseCard.instanceId,
              });
            }
          }
          continue;
        }

        const element = findElementDef(ctx.pack, card.defId);
        if (element?.cardType === 'boost') {
          if (isV3CombatEnabled(rulesetOf(ctx)) || canBuildBoost(bound)) {
            actions.push({ type: 'BUILD_CARD', cardInstanceId: card.instanceId });
          } else {
            const chargeCard = bound.find((b) => b.phraseSlot === 'charge');
            if (chargeCard) {
              actions.push({
                type: 'BUILD_CARD',
                cardInstanceId: card.instanceId,
                discardBoundId: chargeCard.instanceId,
              });
            }
          }
        }
      }
    } else {
      actions.push(...listBuildActionsForPlayer(state, ctx.pack, ctx.playerId, ruleset));
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
          if (!canChallengeBoundTarget(ctx.pack, bound)) continue;
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
    const lockedId = state.meta.activationLockedBoundId;
    const v3 = isV3CombatEnabled(rulesetOf(ctx));
    for (const bound of player.bound) {
      if (bound.exhausted || bound.instanceId === lockedId) continue;
      const enginePart = findEnginePartDef(ctx.pack, bound.defId);
      if (v3 && enginePart && hasPoolActivate(enginePart)) {
        const cost = partActivateCost(enginePart);
        if (cost != null && canSpendFetzCharge(state, ctx.playerId, cost)) {
          actions.push({ type: 'ACTIVATE_BOUND', boundInstanceId: bound.instanceId });
        }
        continue;
      }
      for (const handCard of hand) {
        actions.push({
          type: 'ACTIVATE_BOUND',
          boundInstanceId: bound.instanceId,
          discardHandInstanceId: handCard.instanceId,
        });
      }
    }
    actions.push(...listOwnTurnGlitchActions(state, ctx.playerId));
    if (state.meta.clubSwapAvailable) {
      actions.push(...listClubSwapActions(state, ctx.pack, ctx.playerId));
    }
    if (state.meta.basarExhaustAvailable) {
      actions.push(...listBasarExhaustActions(state, ctx.playerId));
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

function applyBuildCard(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  action: Extract<GameAction, { type: 'BUILD_CARD' }>,
  ruleset: RulesetConfig,
  phaseAfter: TurnPhase,
): GameState {
  let next = cloneState(state);
  const handIdx = next.players[playerId].hand.findIndex((c) => c.instanceId === action.cardInstanceId);
  if (handIdx === -1) throw new Error('Card not in hand');
  const handCard = next.players[playerId].hand[handIdx];
  const defId = handCard.defId;

  if (isV2Pack(pack)) {
    const part = findEnginePartDef(pack, defId);
    const element = findElementDef(pack, defId);

    if (!part && element?.cardType !== 'boost') {
      throw new Error('Cannot build this card in V2');
    }

    // V3 shared pool: Ladung-Karten füllen den Pool statt Charge-Slot.
    if (element?.cardType === 'boost' && isV3CombatEnabled(ruleset)) {
      const [card] = next.players[playerId].hand.splice(handIdx, 1);
      next.piles.discard.push(card);
      next = gainFetzCharge(next, playerId, element.value);
      next.phase = phaseAfter;
      next.lastEvent = `${element.name}: +${element.value} Ladung (Pool ${next.players[playerId].fetzCharge}).`;
      return next;
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

    const slots = resolveBuildSlots(pack, defId, next.players[playerId].bound, ruleset);
    const [card] = next.players[playerId].hand.splice(handIdx, 1);
    const builtName = part?.name ?? findElementDef(pack, defId)?.name ?? 'Karte';
    const bound: BoundCardInstance = {
      ...card,
      exhausted: false,
      resistanceBonus: 0,
      phraseSlot: slots.phraseSlot,
      fetzSlot: slots.fetzSlot,
    };
    next.players[playerId].bound.push(bound);
    next.phase = phaseAfter;
    const slotLabel = slots.fetzSlot ?? slots.phraseSlot;
    next.lastEvent = `${builtName} gebaut (${slotLabel}).`;
    next = tryApplyTransform(next, pack, playerId, ruleset);
    return next;
  }

  const def = findElementDef(pack, defId);
  if (!def) throw new Error('Only element cards can be built');

  if (next.players[playerId].bound.length >= ruleset.maxBoundCards) {
    if (!action.discardBoundId) throw new Error('Must discard a built card first');
    const bIdx = next.players[playerId].bound.findIndex((b) => b.instanceId === action.discardBoundId);
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
  next.phase = phaseAfter;
  next.lastEvent = `${def.name} gebaut.`;
  return next;
}

function applyPendingChoiceAction(
  state: GameState,
  action: GameAction,
  playerId: PlayerId,
  ctx: PackContext,
): GameState {
  const pending = state.pendingChoice;
  if (!pending) throw new Error('No pending choice');
  if (playerId !== pendingChoicePlayer(pending)) {
    throw new Error('Not eligible for pending choice');
  }

  const pack = ctx.pack;
  const ruleset = rulesetOf(ctx);
  const rng = rngOf(ctx);

  switch (action.type) {
    case 'PASS_PENDING': {
      switch (pending.type) {
        case 'boost-interrupt':
          return resolveBoostAfterInterrupt(state, pack, pending, rng, ruleset);
        case 'damage-reduce': {
          let next = cloneState(state);
          next.pendingChoice = null;
          const hitImpulse = impulseFromCard(pack, pending.attackCardDefId, 'onHit');
          const fullBlockImpulse = impulseFromCard(pack, pending.blockCardDefId, 'onFullBlock');
          next = applyPlayerAttackDamage(
            next,
            pending.attackerId,
            pending.defenderId,
            pending.damage,
            pending.attackValue,
            pending.blockValue,
            ruleset,
            pack,
            rng,
            pending.damage > 0 ? hitImpulse : null,
            pending.damage <= 0 ? fullBlockImpulse : null,
          );
          return next;
        }
        case 'optional-draw-discard':
        case 'must-discard':
        case 'spaeti-extra-build':
        case 'pick-reaction':
          throw new Error('Arena effect cannot be skipped');
      }
      break;
    }
    case 'PICK_REACTION': {
      if (pending.type !== 'pick-reaction') throw new Error('Wrong pending type');
      return pickReaction(state, action.reactionId as ReactionId, ruleset, pack);
    }
    case 'TAKE_OPTIONAL_DRAW': {
      if (pending.type !== 'optional-draw-discard') throw new Error('Wrong pending type');
      let next = drawForPlayer(state, pending.playerId, 1, rng, ruleset, {
        allowExtra: true,
      });
      const drawn = next.players[pending.playerId].hand[next.players[pending.playerId].hand.length - 1];
      if (drawn) {
        const glitch = findGlitchDef(pack, drawn.defId);
        if (glitch?.glitchType === 'instant') {
          next.players[pending.playerId].hand.pop();
          next.piles.discard.push(drawn);
          next = applyInstantGlitch(next, pack, pending.playerId, glitch, rng, ruleset, drawn.instanceId);
          if (next.winner) return next;
        }
      }
      if (pending.source === 'spaeti') {
        next.meta = {
          ...next.meta,
          spaetiFilterUsed: { ...next.meta.spaetiFilterUsed, [pending.playerId]: true },
        };
      }
      next.pendingChoice = {
        type: 'must-discard',
        playerId: pending.playerId,
        source: pending.source,
      };
      next.lastEvent = 'Arena: 1 gezogen — jetzt 1 Karte abwerfen.';
      return checkWinner(next);
    }
    case 'RESOLVE_DRAW_DISCARD': {
      if (pending.type !== 'must-discard' && pending.type !== 'optional-draw-discard') {
        throw new Error('Wrong pending type');
      }
      // Legacy one-shot path: optional-draw-discard + discard id still works
      let next = state;
      if (pending.type === 'optional-draw-discard') {
        next = drawForPlayer(state, pending.playerId, 1, rng, ruleset, { allowExtra: true });
        const drawn = next.players[pending.playerId].hand[next.players[pending.playerId].hand.length - 1];
        if (drawn) {
          const glitch = findGlitchDef(pack, drawn.defId);
          if (glitch?.glitchType === 'instant') {
            next.players[pending.playerId].hand.pop();
            next.piles.discard.push(drawn);
            next = applyInstantGlitch(next, pack, pending.playerId, glitch, rng, ruleset, drawn.instanceId);
            if (next.winner) return next;
          }
        }
        if (pending.source === 'spaeti') {
          next.meta = {
            ...next.meta,
            spaetiFilterUsed: { ...next.meta.spaetiFilterUsed, [pending.playerId]: true },
          };
        }
      } else {
        next = cloneState(state);
      }
      const hand = next.players[pending.playerId].hand;
      const discardId = hand.some((c) => c.instanceId === action.discardInstanceId)
        ? action.discardInstanceId
        : hand[hand.length - 1]?.instanceId;
      if (discardId) {
        next = discardFromHand(next, pending.playerId, discardId);
      }
      const airFollowUp =
        pending.type === 'must-discard' &&
        pending.source === 'air' &&
        next.meta.awaitingPostBoostArena;
      next.pendingChoice = null;
      if (airFollowUp) {
        next.meta = { ...next.meta, awaitingPostBoostArena: false };
        next = queuePostBoostPending(next, pending.playerId, pack, rng, ruleset);
        next.lastEvent = 'Luft: 1 abgeworfen.';
        return finishMainAction(checkWinner(next));
      }
      if (
        pending.type === 'must-discard' &&
        pending.source === 'spaeti' &&
        isSpaeti(next) &&
        next.meta.boostsPlayed[pending.playerId] === 3
      ) {
        next.pendingChoice = { type: 'spaeti-extra-build', playerId: pending.playerId };
        next.lastEvent = '1 gezogen, 1 abgeworfen — Extra-Bau (3. Boost).';
        return checkWinner(next);
      }
      next.phase = 'end';
      next.lastEvent =
        pending.type === 'must-discard' && pending.source === 'air'
          ? 'Luft: 1 abgeworfen.'
          : '1 gezogen, 1 abgeworfen.';
      return checkWinner(next);
    }
    case 'PLAY_GLITCH':
      return applyPlayableGlitch(state, pack, playerId, action, rng, ruleset);
    case 'BUILD_CARD': {
      if (pending.type !== 'spaeti-extra-build') throw new Error('BUILD not pending here');
      let next = applyBuildCard(state, pack, playerId, action, ruleset, 'end');
      next.pendingChoice = null;
      return next;
    }
    default:
      throw new Error('Invalid action during pending choice');
  }

  throw new Error('Unhandled pending action');
}

/** Apply a validated action. */
export function applyAction(
  state: GameState,
  action: GameAction,
  playerId: PlayerId,
  ctx: PackContext,
): GameState {
  state = ensureMeta(state);
  // Fresh reveal list for this action — UI/chat must show any Sofort-Glitches.
  state = { ...state, instantReveals: [] };
  if (state.winner) return state;
  const pack = ctx.pack;
  const ruleset = rulesetOf(ctx);
  const rng = rngOf(ctx);

  if (state.pendingChoice) {
    return applyPendingChoiceAction(state, action, playerId, ctx);
  }

  if (state.combat) {
    return applyCombatResponse(state, action, playerId, ctx);
  }

  if (state.activePlayer !== playerId) {
    throw new Error('Not active player');
  }

  let next: GameState;

  switch (action.type) {
    case 'ADVANCE_PHASE': {
      if (state.phase === 'start') return runStartPhase(state, playerId, rng, ruleset);
      if (state.phase === 'draw') return runDrawPhase(state, pack, playerId, rng, ruleset);
      throw new Error(`ADVANCE_PHASE not valid in phase ${state.phase}`);
    }
    case 'SKIP_BUILD': {
      if (state.phase !== 'build') throw new Error('Not in build phase');
      next = cloneState(state);
      next.phase = 'action';
      next.lastEvent = 'Keine Karte gebaut.';
      return next;
    }
    case 'BUILD_CARD': {
      if (state.phase !== 'build') throw new Error('Not in build phase');
      return applyBuildCard(state, pack, playerId, action, ruleset, 'action');
    }
    case 'PLAY_ATTACK': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      const def = findElementDef(
        pack,
        state.players[playerId].hand.find((c) => c.instanceId === action.cardInstanceId)?.defId ?? '',
      );
      if (!def || def.cardType !== 'attack') throw new Error('Not an attack card');

      let diceRoll = action.diceRoll ?? rollD6(rng);
      const vulkan = applyVulkanAttackRoll(state, playerId, diceRoll);
      let working = vulkan.state;
      working = {
        ...working,
        meta: {
          ...clearV3ActionHooks(working.meta),
          v3ReactionsThisAction: 0,
          v3BlockShieldThisAction: false,
        },
      };
      diceRoll = vulkan.roll;

      if (isV3CombatEnabled(ruleset) && action.diceRoll == null) {
        const fokus = tryConsumeFokusReroll(working, playerId);
        if (fokus.granted) {
          working = fokus.state;
          diceRoll = rollD6(rng);
          working = runFetzPassiveTrigger(
            working,
            pack,
            playerId,
            ruleset,
            'onFocusOrReroll',
            {},
          ).state;
        }
      }

      let attackValue = computeAttackValueForPlayer(pack, working, playerId, def, diceRoll, ruleset);

      if (isV3CombatEnabled(ruleset)) {
        const announce = runFetzPassiveTrigger(
          working,
          pack,
          playerId,
          ruleset,
          'onAttackAnnounce',
          { attackValue },
        );
        working = announce.state;
        attackValue = announce.attackValue ?? attackValue;
      }

      next = discardFromHand(working, playerId, action.cardInstanceId);
      next = markAttackOrChallenge(next);
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
      if (!canChallengeBoundTarget(pack, target)) throw new Error('Challenge target not legal');

      const handCard = state.players[playerId].hand.find(
        (c) => c.instanceId === action.attackCardInstanceId,
      );
      const def = handCard ? findElementDef(pack, handCard.defId) : undefined;
      if (!def || def.cardType !== 'attack') throw new Error('Not an attack card');

      let diceRoll = action.diceRoll ?? rollD6(rng);
      const vulkan = applyVulkanAttackRoll(state, playerId, diceRoll);
      let working = vulkan.state;
      diceRoll = vulkan.roll;
      const attackValue = computeChallengeAttackValue(
        pack,
        working,
        playerId,
        def,
        target,
        diceRoll,
        ruleset,
      );

      next = discardFromHand(working, playerId, action.attackCardInstanceId);
      next = markAttackOrChallenge(next);
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
      if (isKristall(next)) {
        next = drawForPlayer(next, playerId, 1, rng, ruleset, { allowExtra: true });
        const drawn = next.players[playerId].hand[next.players[playerId].hand.length - 1];
        if (drawn) {
          const glitch = findGlitchDef(pack, drawn.defId);
          if (glitch?.glitchType === 'instant') {
            next.players[playerId].hand.pop();
            next.piles.discard.push(drawn);
            next = applyInstantGlitch(next, pack, playerId, glitch, rng, ruleset, drawn.instanceId);
          }
        }
      }
      return finishMainAction(next);
    }
    case 'PLAY_BOOST': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      const handCard = state.players[playerId].hand.find((c) => c.instanceId === action.cardInstanceId);
      const def = handCard ? findElementDef(pack, handCard.defId) : undefined;
      if (!def || def.cardType !== 'boost') throw new Error('Not a boost card');

      next = discardFromHand(state, playerId, action.cardInstanceId);
      const opp = opponentOf(playerId);
      if (opponentHasNeinBruder(next, playerId)) {
        next.pendingChoice = {
          type: 'boost-interrupt',
          boosterId: playerId,
          boostInstanceId: handCard!.instanceId,
          boostDefId: def.id,
        };
        next.lastEvent = `${def.name} gespielt — Nein, Bruder?`;
        return next;
      }

      next = applyElementEffect(next, playerId, def.element, rng, ruleset, { pack });
      next = incrementBoostsPlayed(next, playerId);
      if (next.pendingChoice?.type === 'must-discard' && next.pendingChoice.source === 'air') {
        next.meta = { ...next.meta, awaitingPostBoostArena: true };
        return finishMainAction(next);
      }
      next = queuePostBoostPending(next, playerId, pack, rng, ruleset);
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
      const bound = state.players[playerId].bound.find((b) => b.instanceId === action.boundInstanceId);
      if (!bound || bound.exhausted) throw new Error('Cannot activate this bound card');
      if (state.meta.activationLockedBoundId === bound.instanceId) {
        throw new Error('Bound activation locked');
      }

      const enginePart = findEnginePartDef(pack, bound.defId);
      const boundDef = findElementDef(pack, bound.defId);
      if (!enginePart && !boundDef) throw new Error('Invalid bound card');

      if (isV3CombatEnabled(ruleset) && enginePart && hasPoolActivate(enginePart)) {
        next = activateFetzPart(state, pack, playerId, action.boundInstanceId, ruleset);
        const exhaustFx = runFetzPassiveTrigger(next, pack, playerId, ruleset, 'onPartExhaust', {
          bonus: enginePart.element === 'air',
        });
        next = exhaustFx.state;
        return finishMainAction(checkWinner(next));
      }

      if (!action.discardHandInstanceId) {
        throw new Error('Hand discard required to activate');
      }
      next = discardFromHand(state, playerId, action.discardHandInstanceId);
      if (enginePart) {
        next = applyActivateArchetype(
          next,
          pack,
          playerId,
          action.boundInstanceId,
          enginePart.activateArchetype,
          ruleset,
        );
      } else {
        next = applyBoundActivation(
          next,
          playerId,
          action.boundInstanceId,
          boundDef!.element,
          rng,
          ruleset,
          pack,
        );
      }
      return finishMainAction(next);
    }
    case 'PLAY_GLITCH':
      return applyPlayableGlitch(state, pack, playerId, action, rng, ruleset);
    case 'CLUB_SWAP': {
      if (state.phase !== 'action' || !state.meta.clubSwapAvailable) {
        throw new Error('Club swap not available');
      }
      next = cloneState(state);
      const retIdx = next.players[playerId].bound.findIndex(
        (b) => b.instanceId === action.returnBoundInstanceId,
      );
      if (retIdx === -1) throw new Error('Bound card to return not found');
      const [returned] = next.players[playerId].bound.splice(retIdx, 1);
      next.players[playerId].hand.push(returned);

      const bindIdx = next.players[playerId].hand.findIndex(
        (c) => c.instanceId === action.buildHandInstanceId,
      );
      if (bindIdx === -1) throw new Error('Bind card not in hand');
      const bindDef = findElementDef(pack, next.players[playerId].hand[bindIdx].defId);
      if (!bindDef) throw new Error('Only element cards can be built');

      if (next.players[playerId].bound.length >= ruleset.maxBoundCards) {
        if (!action.discardBoundId) throw new Error('Must discard a bound card');
        const dIdx = next.players[playerId].bound.findIndex(
          (b) => b.instanceId === action.discardBoundId,
        );
        if (dIdx === -1) throw new Error('Discard bound not found');
        const [old] = next.players[playerId].bound.splice(dIdx, 1);
        next.piles.discard.push(old);
      }

      const [bindCard] = next.players[playerId].hand.splice(bindIdx, 1);
      next.players[playerId].bound.push({
        ...bindCard,
        exhausted: false,
        resistanceBonus: 0,
      });
      next.meta = { ...next.meta, clubSwapAvailable: false };
      next.lastEvent = 'Club: Karte getauscht.';
      return next;
    }
    case 'BASAR_EXHAUST': {
      if (state.phase !== 'action' || !state.meta.basarExhaustAvailable) {
        throw new Error('Basar exhaust not available');
      }
      const opp = opponentOf(playerId);
      const target = state.players[opp].bound.find(
        (b) => b.instanceId === action.targetBoundInstanceId,
      );
      if (!target) throw new Error('Target bound not found');
      next = discardFromHand(state, playerId, action.discardHandInstanceId);
      const tIdx = next.players[opp].bound.findIndex(
        (b) => b.instanceId === action.targetBoundInstanceId,
      );
      if (tIdx === -1) throw new Error('Target bound not found');
      next.players[opp].bound[tIdx].exhausted = true;
      next.meta = { ...next.meta, basarExhaustAvailable: false };
      next.lastEvent = 'Basar: Gegnerische Karte erschöpft.';
      return next;
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
      next = onEndTurnArena(state, playerId, ruleset);
      next = tickStatusesEndOfTurn(next, playerId, ruleset);
      next = enforceHandLimit(next, playerId, ruleset);
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
    case 'PASS_PENDING':
    case 'RESOLVE_DRAW_DISCARD':
      throw new Error('No pending combat or choice');
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
    return resolveCombat(state, 0, ruleset, pack, rng, null);
  }

  if (action.type === 'PLAY_BLOCK') {
    const def = findElementDef(
      pack,
      state.players[playerId].hand.find((c) => c.instanceId === action.cardInstanceId)?.defId ?? '',
    );
    if (!def || def.cardType !== 'block') throw new Error('Not a block card');

    let diceRoll = action.diceRoll ?? rollD6(rng);
    const sumpf = applySumpfBlockRoll(state, playerId, diceRoll);
    let working = sumpf.state;
    diceRoll = sumpf.roll;

    if (isV3CombatEnabled(ruleset) && action.diceRoll == null) {
      const fokus = tryConsumeFokusReroll(working, playerId);
      if (fokus.granted) {
        working = fokus.state;
        diceRoll = rollD6(rng);
        working = runFetzPassiveTrigger(
          working,
          pack,
          playerId,
          ruleset,
          'onFocusOrReroll',
          {},
        ).state;
      }
    }

    const blockValue = computeBlockValueForPlayer(
      pack,
      working,
      playerId,
      def,
      diceRoll,
      attackDef.element,
      ruleset,
    );

    let next = discardFromHand(working, playerId, action.cardInstanceId);
    if (state.combat.mode === 'challenge') {
      next = resolveChallengeCombat(next, pack, blockValue, ruleset);
    } else {
      next = resolveCombat(next, blockValue, ruleset, pack, rng, def.id);
    }
    if (next.lastEvent) {
      next.lastEvent = `Block ${blockValue} (Würfel ${diceRoll}). ${next.lastEvent}`;
    }
    return next;
  }

  throw new Error('Invalid combat action');
}
