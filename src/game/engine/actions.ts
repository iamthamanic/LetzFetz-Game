import { rulesetFromState } from './rulesetFromState';
import type {
  BoundCardInstance,
  ContentPack,
  ElementCardDef,
  FormulaComponentInstance,
  GameAction,
  GameState,
  PendingChoice,
  PlayerId,
  RulesetConfig,
} from '../types';
import {
  DEFAULT_RULESET,
  TURN_PHASES,
  assertExclusiveFormulaRuleset,
  type TurnPhase,
} from '../types';
import { calculateCombatValue, resolveDamage, challengeSucceeded, counterBonus } from './combat';
import { diceBonusFromRoll, rollD6 } from './dice';
import { opponentOf, checkWinner } from './createGame';
import { resolveTimedMatchExpiry } from './timedMatch';
import {
  applyV6AffinityMode,
  characterElementsForCombat,
  formulaAffinityElement,
  markV6AffinitySpent,
  shouldOfferV6Affinity,
  shouldOfferV6AffinityOnBlock,
  type V6AffinityMode,
} from './v6/affinity';
import { planFormulaActivation } from './v6/planFormulaActivation';
import { applyV6FormulaActivate } from './v6/executeFormulaActivation';
import { applyFesselToPlayer, occupiedFesselSlots, tickFesselAndRestoreOwnerFormulaV6 } from './v6/fessel';
import { applyV6DrawbackAfterCombat, v6PayoffCombatBonus } from './v6/elementValueRoles';
import { tickV6EchoAndDelayAtStart } from './v6/echoDelay';
import {
  applyConstructChallengeOutcome,
  constructChallengeOutcome,
  constructDisplayName,
  tickV6ConstructAtStart,
} from './v6/constructs';
import {
  consumablePlayedThisTurn,
  equipItemFromHand,
  equipmentActivatedThisTurn,
  isConsumableItem,
  isEquipmentItem,
  itemEffectSlug,
  markConsumablePlayed,
  markEquipmentActivated,
  playerEquipment,
  V6_MAX_EQUIPMENT_SLOTS,
} from './v6/items';
import {
  applyV6BasarPayDestroy,
  applyV6SumpfFullBlockShield,
  applyV6VulkanFirstDamageBonus,
  shouldOfferV6BasarPayDestroy,
  shouldQueueV6ClubReplaceFilter,
  shouldSkipLegacySumpfW6,
  shouldSkipLegacyVulkanW6,
  v6ClubAirValueBonus,
  v6FormulaChallengeOutcome,
  v6KristallEssenceStabilityBonus,
} from './v6/arenas';
import {
  armV6FalscheFarbe,
  canUseV6FalscheFarbe,
  consumeV6FalscheFarbeIfArmed,
  noteV6FormulaChange,
  resolveV6MackeScry,
  tryV6Dosisaenderung,
  tryV6ErstMalGucken,
  tryV6JetztErstRecht,
  tryV6Nachjustiert,
  tryV6SchwachstelleErkannt,
} from './v6/mackes';
import {
  cloneState,
  discardFromHand,
  drawForPlayer,
  enforceHandLimit,
  ensureMeta,
  clampHp,
} from './helpers';
import { applyElementEffect, applyBoundActivation, finishMainAction, applyInstantGlitch } from './effects';
import { findElementDef, findEnginePartDef, findGlitchDef, findItemDef } from './lookup';
import {
  findFormulaComponentDef,
  formulaSlotForDef,
} from './formulaSlots';
import {
  resolveFormulaActivate,
  takeAttackPrepBonus,
  takeBlockPrepBonus,
  takeBoostPrepBonus,
  emptyFormulaPrep,
  applyV5StartFormulaMeta,
  takeEnemyAttackPenalty,
  armChainSameAction,
  takeChainSameActionBonus,
} from './formulaResolve';
import {
  applyGrossformelAftermath,
  isFormulaResolvable,
  isFullFormulaActivatable,
} from './formulaCharge';

function isFormulaBoardEnabled(ruleset: RulesetConfig): boolean {
  return isV5FormulaEnabled(ruleset) || isV6FormulaEnabled(ruleset);
}

function isItemPlayEnabled(ruleset: RulesetConfig): boolean {
  return isV5FormulaEnabled(ruleset) || isV6FormulaEnabled(ruleset);
}
import {
  destroyFormulaComponent,
  disturbFormulaComponent,
  findFormulaComponent,
  formulaChallengeOutcome,
  formulaComponentElement,
  formulaComponentStability,
  listFormulaComponents,
  restoreOwnerFormulaAtStart,
} from './formulaChallenge';
import { applyDamageThroughShield } from './status/shield';
import { pickReaction, resolveImpulseReactions } from './status/reactionChoice';
import {
  tickBrennenAfterMainAction,
  tickStatusesEndOfTurn,
  tryConsumeFokusReroll,
} from './status/tickStatuses';
import { clearV3ActionHooks } from './status/v3CombatHooks';
import { tryApplyTransform } from './status/transform';
import { applyStatus, getStatus, hasStatus } from './status/applyStatus';
import { clampShield } from '../types';
import {
  activateFetzPart,
  hasPoolActivate,
  partActivateCost,
  runFetzPassiveTrigger,
} from './status/fetzgeraetEffects';
import { canSpendFetzCharge, gainFetzCharge } from './status/fetzCharge';
import type { Element } from '../types';
import { isV3CombatEnabled, isV5FormulaEnabled, isV6FormulaEnabled, maxFetzChargeFor } from '../types';
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
  consumeStiernackenRevengeBonus,
  tryKnuspergnomFormulaFilter,
  trySchluckspechtFullBlockHeal,
  tryStiernackenRevengeBonus,
  tryKokabellStabilityOnHeal,
  tryOpenPillendoktoraBoost,
  resolvePillendoktoraBoost,
  tryDripministerinFilter,
  tryOpenMysteriumElement,
  resolveMysteriumElement,
  peekMysteriumElement,
} from './characterPassives';
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
  isVulkan,
} from './arena';
import { listOwnTurnGlitchActions, applyPlayableGlitch } from './playableGlitches';

export { findElementDef } from './lookup';
export { findFormulaComponentDef, formulaSlotForDef } from './formulaSlots';

export interface PackContext {
  pack: ContentPack;
  playerId: PlayerId;
  ruleset?: RulesetConfig;
  rng?: () => number;
}

function rulesetOf(ctx: PackContext, state?: GameState): RulesetConfig {
  if (ctx.ruleset) {
    assertExclusiveFormulaRuleset(ctx.ruleset);
    return ctx.ruleset;
  }
  if (state) {
    const fromState = rulesetFromState(state);
    if (fromState.v6Formula || fromState.v5Formula || fromState.v3Combat) return fromState;
  }
  return DEFAULT_RULESET;
}

function rngOf(ctx: PackContext): () => number {
  return ctx.rng ?? Math.random;
}

function applyEnergyHangoverAtStart(
  state: GameState,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  const hangover = state.meta.v5EnergyHangover?.[playerId] ?? 0;
  if (hangover <= 0) return state;
  let next = cloneState(state);
  next.players[playerId].hp = clampHp(next.players[playerId].hp - hangover, ruleset);
  next.meta = {
    ...next.meta,
    v5EnergyHangover: { ...(next.meta.v5EnergyHangover ?? { p1: 0, p2: 0 }), [playerId]: 0 },
  };
  next.lastEvent = `Halbe Dose Energy: −${hangover} Leben zu Zugbeginn.`;
  return checkWinner(next);
}

function runStartPhase(
  state: GameState,
  playerId: PlayerId,
  rng: () => number,
  ruleset: RulesetConfig,
): GameState {
  let next = onStartPhaseArena(state, playerId, rng, ruleset);
  if (isV5FormulaEnabled(ruleset)) {
    next = cloneState(next);
    next.players[playerId].formula = restoreOwnerFormulaAtStart(next.players[playerId].formula);
    next = applyV5StartFormulaMeta(next, playerId);
    next = applyEnergyHangoverAtStart(next, playerId, ruleset);
    if (next.winner) return next;
  } else if (isV6FormulaEnabled(ruleset)) {
    next = cloneState(next);
    // §8: Echo (3) → verzögerte Formeln (4) → Konstrukte (5) → Fessel/Aufrichten (6–7)
    next = tickV6EchoAndDelayAtStart(next, playerId, ruleset);
    next = checkWinner(next);
    if (next.winner) return next;
    next = tickV6ConstructAtStart(next, playerId);
    const fesselTick = tickFesselAndRestoreOwnerFormulaV6(next.players[playerId].formula);
    next.players[playerId].formula = fesselTick.board;
    if (fesselTick.notes.length > 0) {
      const prefix = next.lastEvent ? `${next.lastEvent} · ` : '';
      next.lastEvent = `${prefix}Fessel aktualisiert: ${fesselTick.notes.join('; ')}`;
    }
    next = applyEnergyHangoverAtStart(next, playerId, ruleset);
    if (next.winner) return next;
  }
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
  const mysterium = peekMysteriumElement(state, playerId);
  const payoff = v6PayoffCombatBonus(state, playerId, def, ruleset);
  return calculateCombatValue({
    cardValue: def.value,
    diceRoll,
    diceBonus: bonus,
    characterElements: characterElementsForCombat(
      pack,
      state.players[playerId].characterId,
      ruleset,
      state.meta.v6FormulaEnabled,
    ),
    cardElement: mysterium ?? def.element,
    extraBonus: passiveBonus + monoBonus + payoff,
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
  const mysterium = peekMysteriumElement(state, playerId);
  const blockEl = mysterium ?? def.element;
  const payoff = v6PayoffCombatBonus(state, playerId, def, ruleset);
  return calculateCombatValue({
    cardValue: def.value,
    diceRoll,
    diceBonus: bonus,
    characterElements: characterElementsForCombat(
      pack,
      state.players[playerId].characterId,
      ruleset,
      state.meta.v6FormulaEnabled,
    ),
    cardElement: blockEl,
    attackElement,
    blockElement: blockEl,
    extraBonus: passiveBonus + monoBonus + payoff,
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

function computeFormulaChallengeAttackValue(
  pack: ContentPack,
  state: GameState,
  playerId: PlayerId,
  attackDef: ElementCardDef,
  targetComp: FormulaComponentInstance,
  diceRoll: number,
  ruleset: RulesetConfig,
): number {
  const base = computeAttackValueForPlayer(pack, state, playerId, attackDef, diceRoll, ruleset);
  const targetElement = formulaComponentElement(pack, targetComp);
  if (!targetElement) return base;
  return base + counterBonus(attackDef.element, targetElement);
}

function openV6AffinityPending(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  draft: Extract<PendingChoice, { type: 'v6-affinity' }>,
  ruleset: RulesetConfig,
): GameState {
  let next = cloneState(state);
  if (canUseV6FalscheFarbe(next, pack, playerId, draft.cardElement, ruleset)) {
    next = armV6FalscheFarbe(next, playerId);
  }
  next.pendingChoice = draft;
  next.lastEvent = `Würfel ${draft.diceRoll} — Affinität wählen (Wert +1 oder W6 ±1, oder überspringen).`;
  return next;
}

function finalizeV6AffinityAttack(
  state: GameState,
  _pack: ContentPack,
  playerId: PlayerId,
  pending: Extract<PendingChoice, { type: 'v6-affinity' }>,
  mode: V6AffinityMode,
  ruleset: RulesetConfig,
  _rng: () => number,
): GameState {
  const applied = applyV6AffinityMode(pending.diceRoll, pending.baseValue, mode, ruleset);
  let next = cloneState(state);
  next.pendingChoice = null;
  if (applied.spent) {
    next = markV6AffinitySpent(next, playerId);
  }
  next = consumeV6FalscheFarbeIfArmed(next, playerId, applied.spent);
  next = discardFromHand(next, playerId, pending.cardInstanceId);
  next = markAttackOrChallenge(next);
  const defenderId = opponentOf(playerId);
  if (pending.kind === 'challenge') {
    next.combat = {
      attackerId: playerId,
      defenderId,
      attackCardDefId: pending.cardDefId,
      attackRoll: applied.diceRoll,
      attackValue: applied.value,
      mode: 'challenge',
      targetBoundInstanceId: pending.targetBoundInstanceId,
    };
    next.lastEvent = `Herausforderung ${applied.value} (Würfel ${applied.diceRoll})${
      applied.spent ? ' [Affinität]' : ''
    }. Gegner darf blocken.`;
    return next;
  }
  next.combat = {
    attackerId: playerId,
    defenderId,
    attackCardDefId: pending.cardDefId,
    attackRoll: applied.diceRoll,
    attackValue: applied.value,
    mode: 'player',
    ignoreShield: pending.ignoreShield,
    extraHitImpulse: pending.extraHitImpulse,
  };
  next.lastEvent = `Angriff ${applied.value} (Würfel ${applied.diceRoll})${
    applied.spent ? ' [Affinität]' : ''
  }. Gegner darf blocken.`;
  return next;
}

function finalizeV6AffinityBlock(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  pending: Extract<PendingChoice, { type: 'v6-affinity' }>,
  mode: V6AffinityMode,
  ruleset: RulesetConfig,
  rng: () => number,
): GameState {
  if (!state.combat) throw new Error('No pending combat for affinity block');
  const applied = applyV6AffinityMode(pending.diceRoll, pending.baseValue, mode, ruleset);
  let next = cloneState(state);
  next.pendingChoice = null;
  if (applied.spent) {
    next = markV6AffinitySpent(next, playerId);
  }
  next = consumeV6FalscheFarbeIfArmed(next, playerId, applied.spent);
  next = discardFromHand(next, playerId, pending.cardInstanceId);
  if (next.combat?.mode === 'challenge') {
    next = resolveChallengeCombat(next, pack, applied.value, ruleset, rng);
  } else {
    next = resolveCombat(next, applied.value, ruleset, pack, rng, pending.cardDefId);
  }
  if (next.lastEvent) {
    next.lastEvent = `Block ${applied.value} (Würfel ${applied.diceRoll})${
      applied.spent ? ' [Affinität]' : ''
    }. ${next.lastEvent}`;
  }
  return next;
}

function finalizeV6AffinityFormula(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  pending: Extract<PendingChoice, { type: 'v6-affinity' }>,
  mode: V6AffinityMode,
  ruleset: RulesetConfig,
  rng: () => number,
): GameState {
  const applied = applyV6AffinityMode(pending.diceRoll, pending.baseValue, mode, ruleset);
  let next = cloneState(state);
  next.pendingChoice = null;
  if (applied.spent) {
    next = markV6AffinitySpent(next, playerId);
  }
  next = consumeV6FalscheFarbeIfArmed(next, playerId, applied.spent);
  const intensityBase = pending.formulaIntensity ?? null;
  const intensityAdjusted =
    intensityBase == null
      ? null
      : mode === 'value-plus'
        ? intensityBase + 1
        : mode === 'none'
          ? intensityBase
          : Math.max(0, intensityBase + (applied.value - pending.baseValue));

  next = applyV6FormulaActivate(next, pack, playerId, ruleset, rng, {
    asOverformula: pending.formulaAsOverformula,
    defenseRoll: pending.formulaDefenseRoll,
    offerDiscard: pending.formulaOfferDiscard,
    affinityAdjustedPrimary: applied.value,
    affinityAdjustedIntensity: intensityAdjusted,
    overformulaBonusChoice: pending.formulaOverformulaBonusChoice,
  });
  if (applied.spent) {
    next.lastEvent = `${next.lastEvent ?? 'Formel aktiviert.'} [Affinität]`;
  }
  return next;
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

/** Arena Späti/Sumpf/Club: draw 1 then must discard 1 — not skippable. */
function applyMandatoryArenaDrawDiscard(
  state: GameState,
  playerId: PlayerId,
  source: 'spaeti' | 'sumpf-full-block' | 'club-formula-replace',
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
  // Bound-era Späti 3rd-boost build — skip under Formelboard (V5/V6).
  if (
    isSpaeti(state) &&
    state.meta.boostsPlayed[boosterId] === 3 &&
    !isFormulaBoardEnabled(ruleset)
  ) {
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
  next = applyBoostWithFormulaPrep(next, pending.boosterId, boostDef, pack, rng, ruleset);
  const hpGained = Math.max(
    0,
    next.players[pending.boosterId].hp - state.players[pending.boosterId].hp,
  );
  if (hpGained > 0) {
    next = tryKokabellStabilityOnHeal(next, pending.boosterId, hpGained, ruleset);
    next = tryV6Nachjustiert(next, pending.boosterId, hpGained, ruleset);
  }
  next = incrementBoostsPlayed(next, pending.boosterId);
  if (next.pendingChoice?.type === 'must-discard' && next.pendingChoice.source === 'air') {
    next.meta = { ...next.meta, awaitingPostBoostArena: true };
    return finishMainAction(next);
  }
  next = queuePostBoostPending(next, pending.boosterId, pack, rng, ruleset);
  if (!next.pendingChoice) {
    next = tryOpenPillendoktoraBoost(next, pending.boosterId, ruleset);
  }
  if (!next.pendingChoice) {
    next = tryV6Dosisaenderung(next, pending.boosterId, rng, ruleset);
  }
  return finishMainAction(next);
}

/** Apply element boost including V5 Fokuskurbel / Kettenkopplung prep. */
function applyBoostWithFormulaPrep(
  state: GameState,
  playerId: PlayerId,
  def: ElementCardDef,
  pack: ContentPack,
  rng: () => number,
  ruleset: RulesetConfig,
): GameState {
  let next = state;
  const boostPrep = takeBoostPrepBonus(next, playerId);
  next = boostPrep.state;
  const chainBoost = takeChainSameActionBonus(next, playerId, 'boost');
  next = chainBoost.state;
  const amountBonus = boostPrep.valueBonus + chainBoost.bonus;
  const hasNumericBoost =
    def.element === 'fire' ||
    def.element === 'water' ||
    def.element === 'light' ||
    def.element === 'earth';

  next = applyElementEffect(next, playerId, def.element, rng, ruleset, {
    pack,
    amountBonus: hasNumericBoost ? amountBonus : 0,
  });
  if (!hasNumericBoost && boostPrep.filterHandIfNoValue) {
    next = drawForPlayer(next, playerId, 1, rng, ruleset, { allowExtra: true });
    if (next.players[playerId].hand.length > 0) {
      const removed = next.players[playerId].hand.pop();
      if (removed) next.piles.discard.push(removed);
    }
  }
  return armChainSameAction(next, playerId, 'boost');
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
  attackCardDefId?: string,
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

  const pipeline = applyDamageThroughShield(state, defenderId, workingDamage, ruleset, {
    ignoreShield: state.combat?.ignoreShield ?? 0,
  });
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
    if (isV6FormulaEnabled(ruleset)) {
      const shieldBefore = next.players[defenderId].shield;
      next = applyV6SumpfFullBlockShield(next, defenderId, ruleset);
      next = tryV6Nachjustiert(
        next,
        defenderId,
        Math.max(0, next.players[defenderId].shield - shieldBefore),
        ruleset,
      );
    } else {
      next = applyMandatoryArenaDrawDiscard(next, defenderId, 'sumpf-full-block', pack, rng, ruleset);
    }
  }

  if (pipeline.isFullBlock) {
    next = trySchluckspechtFullBlockHeal(next, defenderId, ruleset);
    next = tryV6ErstMalGucken(next, defenderId, ruleset);
  }
  if (pipeline.hpDamage > 0) {
    next = tryStiernackenRevengeBonus(next, defenderId, pipeline.hpDamage, ruleset);
    next = tryV6JetztErstRecht(next, defenderId, pipeline.hpDamage, rng, ruleset);
  }

  const highBefore: Record<PlayerId, number> = {
    p1: getStatus(next, 'p1', 'high')?.stacks ?? 0,
    p2: getStatus(next, 'p2', 'high')?.stacks ?? 0,
  };

  if (isV3CombatEnabled(ruleset) && hitImpulseElement && (pipeline.isHit || workingAttack === workingBlock)) {
    next = resolveImpulseReactions(
      next,
      defenderId,
      hitImpulseElement,
      ruleset,
      attackerId,
      pack,
    );
  }
  // V5 Nasser Socken: additional water (etc.) impulse after primary card impulse.
  const extraImpulse = state.combat?.extraHitImpulse;
  if (
    isV5FormulaEnabled(ruleset) &&
    isV3CombatEnabled(ruleset) &&
    extraImpulse &&
    extraImpulse !== hitImpulseElement &&
    (pipeline.isHit || workingAttack === workingBlock)
  ) {
    next = resolveImpulseReactions(
      next,
      defenderId,
      extraImpulse,
      ruleset,
      attackerId,
      pack,
    );
  }
  if (isV3CombatEnabled(ruleset) && pipeline.isFullBlock && fullBlockImpulseElement && workingAttack !== workingBlock) {
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

  // V5 Formelprep aftermath (Essenz-Marke / Spiegel-Schild / Kettenhieb / …).
  if (isV5FormulaEnabled(ruleset)) {
    const atkPrep = next.players[attackerId].formulaPrep;
    const tieWithImpulse =
      Boolean(atkPrep?.impulseOnTie) && workingAttack === workingBlock;
    if (atkPrep && (pipeline.isHit || tieWithImpulse)) {
      if (pipeline.isHit && atkPrep.mirrorShieldOnHit > 0) {
        next.players[attackerId].shield = clampShield(
          (next.players[attackerId].shield ?? 0) + atkPrep.mirrorShieldOnHit,
        );
      }
      const reactions = next.meta.v3ReactionsThisAction ?? 0;
      if (pipeline.isHit && atkPrep.markIfNoReaction && reactions === 0) {
        next = applyStatus(next, defenderId, atkPrep.markIfNoReaction, 1);
      }
      if (pipeline.hpDamage > 0) {
        if (atkPrep.stripShieldOnHpDamage > 0) {
          next.players[defenderId].shield = clampShield(
            Math.max(0, (next.players[defenderId].shield ?? 0) - atkPrep.stripShieldOnHpDamage),
          );
        }
        if (atkPrep.lifestealOnHp > 0) {
          next.players[attackerId].hp = clampHp(
            next.players[attackerId].hp + atkPrep.lifestealOnHp,
            ruleset,
          );
        }
      }
      if (pipeline.isHit) {
        next = armChainSameAction(next, attackerId, 'attack');
      }
      next.players[attackerId].formulaPrep = null;
    }

    const defPrep = next.players[defenderId].formulaPrep;
    if (defPrep && pipeline.isFullBlock) {
      const thorns = defPrep.thornsOnFullBlock + defPrep.mirrorThornsOnFullBlock;
      if (thorns > 0) {
        next.players[attackerId].hp = clampHp(next.players[attackerId].hp - thorns, ruleset);
      }
      next = armChainSameAction(next, defenderId, 'block');
      next.players[defenderId].formulaPrep = null;
    }

    if (pipeline.isFullBlock && state.combat?.rueckspiegelArmed) {
      next = applyStatus(next, attackerId, 'erleuchtet', 1);
    }
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
  if (isV6FormulaEnabled(ruleset) && isVulkan(next) && pipeline.hpDamage <= 0) {
    // V6 Vulkan: Angriff ohne Lebensschaden → Angreifer −1.
    next.players[attackerId].hp = clampHp(next.players[attackerId].hp - 1, ruleset);
    next.lastEvent = `${next.lastEvent ?? ''} Vulkan: kein Lebensschaden — Angreifer −1.`.trim();
  }
  const hpBeforeTick = next.players[attackerId].hp;
  next = tickBrennenAfterMainAction(next, attackerId, ruleset);
  if (isV3CombatEnabled(ruleset) && next.players[attackerId].hp < hpBeforeTick) {
    for (const pid of ['p1', 'p2'] as PlayerId[]) {
      next = runFetzPassiveTrigger(next, pack, pid, ruleset, 'onStatusOrReactionDamage', {
        bonus: false,
      }).state;
    }
  }
  next = applyV6DrawbackAfterCombat(next, attackerId, attackCardDefId, pack, ruleset);
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
  const isTie = attackValue === blockValue;
  const fireHitOnTie =
    isTie && Boolean(state.players[attackerId].formulaPrep?.impulseOnTie);

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
    damage > 0 || fireHitOnTie ? hitImpulse : null,
    damage <= 0 && !fireHitOnTie ? fullBlockImpulse : null,
    attackCardDefId,
  );
}

function resolveConstructChallengeCombat(
  state: GameState,
  blockValue: number,
): GameState {
  if (!state.combat || state.combat.mode !== 'challenge' || !state.combat.targetBoundInstanceId) {
    return state;
  }
  const { defenderId, attackValue, targetBoundInstanceId } = state.combat;
  const construct = state.players[defenderId].construct;
  if (!construct || construct.instanceId !== targetBoundInstanceId) {
    return state;
  }

  const defense = construct.haltbarkeit + blockValue;
  const outcome = constructChallengeOutcome(
    attackValue,
    construct.haltbarkeit,
    blockValue,
    construct.disturbed,
  );
  let next = applyConstructChallengeOutcome(state, defenderId, attackValue, defense, outcome);
  next.combat = null;
  if (!next.pendingChoice) {
    next.phase = 'end';
  }
  return checkWinner(next);
}

function resolveFormulaChallengeCombat(
  state: GameState,
  pack: ContentPack,
  blockValue: number,
  ruleset: RulesetConfig,
  rng: () => number,
): GameState {
  if (!state.combat || state.combat.mode !== 'challenge' || !state.combat.targetBoundInstanceId) {
    return state;
  }
  let next = cloneState(state);
  const { attackerId, defenderId, attackValue, targetBoundInstanceId } = state.combat;
  const target = findFormulaComponent(next.players[defenderId].formula, targetBoundInstanceId);
  if (!target) throw new Error('Challenge formula target not found');

  const stability =
    formulaComponentStability(pack, target) +
    v6KristallEssenceStabilityBonus(next, pack, target, ruleset);
  const defense = stability + blockValue;
  const outcome = v6FormulaChallengeOutcome(
    next,
    attackValue,
    defense,
    target.disturbed,
    ruleset,
  );
  const def = findFormulaComponentDef(pack, target.defId);
  const targetName = def?.name ?? target.defId;

  if (outcome === 'destroy') {
    const destroyed = destroyFormulaComponent(next.players[defenderId].formula, target.instanceId);
    next.players[defenderId].formula = destroyed.board;
    if (destroyed.removed) {
      next.piles.discard.push({
        instanceId: destroyed.removed.instanceId,
        defId: destroyed.removed.defId,
      });
    }
    next.lastEvent = `Herausforderung — ${targetName} zerstört (${attackValue} vs ${defense}).`;
    next = tryDripministerinFilter(next, attackerId, rng, ruleset);
  } else if (outcome === 'disturb') {
    next.players[defenderId].formula = disturbFormulaComponent(
      next.players[defenderId].formula,
      target.instanceId,
    );
    next.lastEvent = `Herausforderung — ${targetName} gestört (${attackValue} vs ${defense}).`;
    next = tryDripministerinFilter(next, attackerId, rng, ruleset);
    next = tryV6SchwachstelleErkannt(next, attackerId, ruleset);
    if (shouldOfferV6BasarPayDestroy(next, ruleset) && next.players[attackerId].hp > 1) {
      next.pendingChoice = {
        type: 'v6-basar-pay-destroy',
        playerId: attackerId,
        defenderId,
        targetInstanceId: target.instanceId,
        targetName,
      };
      next.lastEvent = `${next.lastEvent} Basar: 1 Leben zahlen zum Zerstören?`.trim();
    }
  } else {
    next.lastEvent = `Herausforderung wirkungslos (${attackValue} vs ${defense}).`;
  }

  next.combat = null;
  if (!next.pendingChoice) {
    next.phase = 'end';
  }
  return checkWinner(next);
}

function resolveChallengeCombat(
  state: GameState,
  pack: ContentPack,
  blockValue: number,
  ruleset: RulesetConfig,
  rng: () => number = Math.random,
): GameState {
  if (!state.combat || state.combat.mode !== 'challenge') return state;

  if (
    isV6FormulaEnabled(ruleset) &&
    state.combat.targetBoundInstanceId &&
    state.players[state.combat.defenderId].construct?.instanceId ===
      state.combat.targetBoundInstanceId
  ) {
    return resolveConstructChallengeCombat(state, blockValue);
  }

  if (isFormulaBoardEnabled(ruleset) && state.combat.targetBoundInstanceId) {
    const formulaTarget = findFormulaComponent(
      state.players[state.combat.defenderId].formula,
      state.combat.targetBoundInstanceId,
    );
    if (formulaTarget) {
      return resolveFormulaChallengeCombat(state, pack, blockValue, ruleset, rng);
    }
  }

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
    case 'pillendoktora-boost':
    case 'mysterium-element':
      return pending.playerId;
    case 'v6-affinity':
      return pending.playerId;
    case 'v6-fessel-target':
      return pending.playerId;
    case 'v6-basar-pay-destroy':
      return pending.playerId;
    case 'v6-macke-scry':
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

/** V5 Formelphase — exactly one of build / replace / activate / schnellmix / skip.
 * V6: up to 2 Formeländerungen (2nd costs hand discard); stay in build until activate/skip/return.
 */
function listFormulaPhaseActions(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameAction[] {
  const actions: GameAction[] = [{ type: 'SKIP_BUILD' }];
  const player = state.players[playerId];
  const formula = player.formula;
  const v6 = isV6FormulaEnabled(ruleset);
  const changes = state.meta.v6FormulaChangesThisTurn?.[playerId] ?? 0;

  if (v6) {
    for (const comp of listFormulaComponents(formula)) {
      actions.push({ type: 'FORMULA_RETURN', formulaInstanceId: comp.instanceId });
    }
  }

  if (!v6 || changes < 2) {
    for (const card of player.hand) {
      const slot = formulaSlotForDef(pack, card.defId);
      if (!slot) continue;
      if (!v6) {
        actions.push({ type: 'FORMULA_SCHNELLMIX', cardInstanceId: card.instanceId });
      }
      const baseType = formula[slot] == null ? ('FORMULA_BUILD' as const) : ('FORMULA_REPLACE' as const);
      if (!v6 || changes === 0) {
        actions.push({ type: baseType, cardInstanceId: card.instanceId });
      } else {
        // 2nd change: must discard a different hand card
        for (const discard of player.hand) {
          if (discard.instanceId === card.instanceId) continue;
          actions.push({
            type: baseType,
            cardInstanceId: card.instanceId,
            discardHandInstanceId: discard.instanceId,
          });
        }
      }
    }
  }

  if (isFormulaResolvable(formula)) {
    actions.push({ type: 'FORMULA_ACTIVATE' });
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
      actions.push(...listBuildActionsForPlayer(state, ctx.pack, eligible, rulesetOf(ctx, state)));
      break;
    case 'pick-reaction':
      for (const opt of pending.options) {
        actions.push({ type: 'PICK_REACTION', reactionId: opt.reactionId });
      }
      break;
    case 'pillendoktora-boost':
      actions.push(
        { type: 'PICK_PILLENDOKTORA', option: 'draw-lose-hp' },
        { type: 'PICK_PILLENDOKTORA', option: 'deal-1' },
        { type: 'PICK_PILLENDOKTORA', option: 'heal-1' },
      );
      break;
    case 'mysterium-element':
      for (const element of ['fire', 'water', 'earth', 'air', 'shadow', 'light'] as const) {
        actions.push({ type: 'PICK_MYSTERIUM_ELEMENT', element });
      }
      break;
    case 'v6-affinity':
      actions.push(
        { type: 'PICK_V6_AFFINITY', mode: 'none' },
        { type: 'PICK_V6_AFFINITY', mode: 'value-plus' },
        { type: 'PICK_V6_AFFINITY', mode: 'dice-plus' },
        { type: 'PICK_V6_AFFINITY', mode: 'dice-minus' },
      );
      break;
    case 'v6-basar-pay-destroy':
      actions.push(
        { type: 'PICK_V6_BASAR_DESTROY', pay: true },
        { type: 'PICK_V6_BASAR_DESTROY', pay: false },
      );
      break;
    case 'v6-fessel-target': {
      const board = state.players[pending.targetPlayerId].formula;
      for (const slot of occupiedFesselSlots(board)) {
        actions.push({ type: 'PICK_V6_FESSEL_TARGET', slot });
      }
      break;
    }
    case 'v6-macke-scry': {
      actions.push({ type: 'PICK_V6_MACKE_SCRY', mode: 'keep' });
      actions.push({ type: 'PICK_V6_MACKE_SCRY', mode: 'bottom' });
      if (pending.revealedInstanceIds.length >= 2) {
        actions.push({ type: 'PICK_V6_MACKE_SCRY', mode: 'swap' });
      }
      break;
    }
  }

  return actions;
}

/** Legal actions for the current phase — expanded in Phase 1. */
export function getLegalActions(state: GameState, ctx: PackContext): GameAction[] {
  if (state.winner) return [];

  const ruleset = rulesetOf(ctx, state);

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
      if (isV5FormulaEnabled(ruleset)) {
        const item = findItemDef(ctx.pack, card.defId);
        if (item?.timing === 'reaction' && !state.combat.rueckspiegelArmed) {
          actions.push({ type: 'PLAY_ITEM', cardInstanceId: card.instanceId });
        }
      }
    }
    if (isV6FormulaEnabled(ruleset)) {
      for (const eq of playerEquipment(state, defenderId)) {
        if (equipmentActivatedThisTurn(state, defenderId, eq.instanceId)) continue;
        const item = findItemDef(ctx.pack, eq.defId);
        if (!item || item.timing !== 'reaction') continue;
        const slug = itemEffectSlug(item.id);
        if (slug === 'kaputter-rueckspiegel') {
          if (state.combat.rueckspiegelArmed) continue;
          actions.push({ type: 'ACTIVATE_EQUIPMENT', equipmentInstanceId: eq.instanceId });
        } else if (slug === 'gezinkter-wuerfel') {
          actions.push({
            type: 'ACTIVATE_EQUIPMENT',
            equipmentInstanceId: eq.instanceId,
            diceMod: 1,
          });
          actions.push({
            type: 'ACTIVATE_EQUIPMENT',
            equipmentInstanceId: eq.instanceId,
            diceMod: -1,
          });
        }
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
    if (isFormulaBoardEnabled(ruleset)) {
      actions.push(...listFormulaPhaseActions(state, ctx.pack, ctx.playerId, ruleset));
    } else {
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
            if (isV3CombatEnabled(rulesetOf(ctx, state)) || canBuildBoost(bound)) {
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
  }

  if (state.phase === 'action') {
    const opponent = opponentOf(ctx.playerId);
    const oppBound = state.players[opponent].bound;
    const v5 = isV5FormulaEnabled(ruleset);
    const v6 = isV6FormulaEnabled(ruleset);
    const formulaLock =
      v6 && state.meta.v6PostFormulaActionLock?.[ctx.playerId] === 'attack_and_challenge';

    for (const card of hand) {
      const def = findElementDef(ctx.pack, card.defId);
      if (def?.cardType === 'attack') {
        if (!formulaLock) {
          actions.push({ type: 'PLAY_ATTACK', cardInstanceId: card.instanceId });
        }
        if (v5 || v6) {
          if (!formulaLock) {
            for (const comp of listFormulaComponents(state.players[opponent].formula)) {
              actions.push({
                type: 'CHALLENGE',
                attackCardInstanceId: card.instanceId,
                targetBoundInstanceId: comp.instanceId,
              });
            }
            const oppConstruct = state.players[opponent].construct;
            if (v6 && oppConstruct) {
              actions.push({
                type: 'CHALLENGE',
                attackCardInstanceId: card.instanceId,
                targetBoundInstanceId: oppConstruct.instanceId,
              });
            }
          }
        } else {
          for (const bound of oppBound) {
            if (!canChallengeBoundTarget(ctx.pack, bound)) continue;
            actions.push({
              type: 'CHALLENGE',
              attackCardInstanceId: card.instanceId,
              targetBoundInstanceId: bound.instanceId,
            });
          }
        }
      }
      if (def?.cardType === 'boost') {
        actions.push({ type: 'PLAY_BOOST', cardInstanceId: card.instanceId });
      }
    }
    if (isItemPlayEnabled(ruleset)) {
      for (const card of hand) {
        const item = findItemDef(ctx.pack, card.defId);
        if (!item) continue;
        if (v6 && isEquipmentItem(item)) {
          const eq = playerEquipment(state, ctx.playerId);
          if (eq.length >= V6_MAX_EQUIPMENT_SLOTS) {
            for (const slot of eq) {
              actions.push({
                type: 'PLAY_ITEM',
                cardInstanceId: card.instanceId,
                replaceEquipmentInstanceId: slot.instanceId,
              });
            }
          } else {
            actions.push({ type: 'PLAY_ITEM', cardInstanceId: card.instanceId });
          }
          continue;
        }
        if (item.timing !== 'action') continue;
        if (v6 && isConsumableItem(item) && consumablePlayedThisTurn(state, ctx.playerId)) {
          continue;
        }
        actions.push({ type: 'PLAY_ITEM', cardInstanceId: card.instanceId });
      }
      if (v6) {
        for (const eq of playerEquipment(state, ctx.playerId)) {
          if (equipmentActivatedThisTurn(state, ctx.playerId, eq.instanceId)) continue;
          const item = findItemDef(ctx.pack, eq.defId);
          if (!item || itemEffectSlug(item.id) !== 'werkzeugkoffer') continue;
          for (const handCard of hand) {
            actions.push({
              type: 'ACTIVATE_EQUIPMENT',
              equipmentInstanceId: eq.instanceId,
              discardHandInstanceId: handCard.instanceId,
            });
          }
        }
      }
    }
    // V6: no character ultimates / Großformel — Überformel is recipe-based later.
    if (!isV6FormulaEnabled(ruleset) && state.players[ctx.playerId].ultimateAvailable) {
      if (
        !isV5FormulaEnabled(ruleset) ||
        state.players[ctx.playerId].fetzCharge >= maxFetzChargeFor(ruleset)
      ) {
        actions.push({ type: 'PLAY_ULTIMATE' });
      }
    }
    for (const card of hand) {
      if (hand.length >= 1) {
        actions.push({ type: 'DISCARD_DRAW', discardInstanceId: card.instanceId });
      }
    }
    const player = state.players[ctx.playerId];
    const lockedId = state.meta.activationLockedBoundId;
    const v3 = isV3CombatEnabled(rulesetOf(ctx, state));
    if (!isV6FormulaEnabled(ruleset)) {
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
    }
    actions.push(...listOwnTurnGlitchActions(state, ctx.playerId, ruleset));
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
  if (isV5FormulaEnabled(ruleset)) {
    throw new Error('BUILD_CARD not used under v5Formula — use FORMULA_* actions');
  }
  if (isV6FormulaEnabled(ruleset)) {
    throw new Error('BUILD_CARD illegal under v6Formula — element cards are hand-only');
  }
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

function applyFormulaBuild(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  cardInstanceId: string,
  ruleset: RulesetConfig,
  discardHandInstanceId?: string,
): GameState {
  const v6 = isV6FormulaEnabled(ruleset);
  const changes = state.meta.v6FormulaChangesThisTurn?.[playerId] ?? 0;
  if (v6 && changes >= 2) {
    throw new Error('Max 2 Formeländerungen this turn');
  }
  if (v6 && changes >= 1) {
    if (!discardHandInstanceId || discardHandInstanceId === cardInstanceId) {
      throw new Error('2nd Formeländerung requires discarding a different hand card');
    }
  } else if (discardHandInstanceId) {
    throw new Error('Free Formeländerung must not discard');
  }

  let next = cloneState(state);
  if (v6 && discardHandInstanceId) {
    next = discardFromHand(next, playerId, discardHandInstanceId);
  }
  const handIdx = next.players[playerId].hand.findIndex((c) => c.instanceId === cardInstanceId);
  if (handIdx === -1) throw new Error('Card not in hand');
  const handCard = next.players[playerId].hand[handIdx];
  const slot = formulaSlotForDef(pack, handCard.defId);
  const def = findFormulaComponentDef(pack, handCard.defId);
  if (!slot || !def) throw new Error('Not a formula component');
  if (next.players[playerId].formula[slot] != null) {
    throw new Error('Formula slot occupied — use FORMULA_REPLACE');
  }

  const [card] = next.players[playerId].hand.splice(handIdx, 1);
  const component: FormulaComponentInstance = {
    ...card,
    slot,
    exhausted: false,
    disturbed: false,
    stabilityBonus: 0,
  };
  next.players[playerId].formula[slot] = component;
  if (!v6) {
    next.phase = 'action';
  }
  next.lastEvent =
    v6 && discardHandInstanceId
      ? `${def.name} in Formelplatz ${slot} gebaut (2. Änderung, 1 abgeworfen).`
      : `${def.name} in Formelplatz ${slot} gebaut.`;
  return next;
}

function applyFormulaReplace(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  cardInstanceId: string,
  ruleset: RulesetConfig,
  discardHandInstanceId?: string,
): GameState {
  const v6 = isV6FormulaEnabled(ruleset);
  const changes = state.meta.v6FormulaChangesThisTurn?.[playerId] ?? 0;
  if (v6 && changes >= 2) {
    throw new Error('Max 2 Formeländerungen this turn');
  }
  if (v6 && changes >= 1) {
    if (!discardHandInstanceId || discardHandInstanceId === cardInstanceId) {
      throw new Error('2nd Formeländerung requires discarding a different hand card');
    }
  } else if (discardHandInstanceId) {
    throw new Error('Free Formeländerung must not discard');
  }

  let next = cloneState(state);
  if (v6 && discardHandInstanceId) {
    next = discardFromHand(next, playerId, discardHandInstanceId);
  }
  const handIdx = next.players[playerId].hand.findIndex((c) => c.instanceId === cardInstanceId);
  if (handIdx === -1) throw new Error('Card not in hand');
  const handCard = next.players[playerId].hand[handIdx];
  const slot = formulaSlotForDef(pack, handCard.defId);
  const def = findFormulaComponentDef(pack, handCard.defId);
  if (!slot || !def) throw new Error('Not a formula component');
  const existing = next.players[playerId].formula[slot];
  if (!existing) throw new Error('Formula slot empty — use FORMULA_BUILD');

  next.piles.discard.push({
    instanceId: existing.instanceId,
    defId: existing.defId,
  });
  const [card] = next.players[playerId].hand.splice(handIdx, 1);
  const component: FormulaComponentInstance = {
    ...card,
    slot,
    exhausted: false,
    disturbed: false,
    stabilityBonus: 0,
  };
  next.players[playerId].formula[slot] = component;
  if (!v6) {
    next.phase = 'action';
  }
  next.lastEvent =
    v6 && discardHandInstanceId
      ? `${def.name} ersetzt Formelplatz ${slot} (2. Änderung, 1 abgeworfen).`
      : `${def.name} ersetzt Formelplatz ${slot}.`;
  return next;
}

function applyFormulaReturn(
  state: GameState,
  playerId: PlayerId,
  formulaInstanceId: string,
  ruleset: RulesetConfig,
): GameState {
  if (!isV6FormulaEnabled(ruleset)) {
    throw new Error('FORMULA_RETURN requires v6Formula');
  }
  const next = cloneState(state);
  const formula = next.players[playerId].formula;
  const slots = ['technik', 'essenz', 'katalysator'] as const;
  let found: FormulaComponentInstance | null = null;
  for (const slot of slots) {
    const comp = formula[slot];
    if (comp?.instanceId === formulaInstanceId) {
      found = comp;
      formula[slot] = null;
      break;
    }
  }
  if (!found) throw new Error('Formula component not found');
  next.players[playerId].hand.push({
    instanceId: found.instanceId,
    defId: found.defId,
  });
  next.phase = 'action';
  next.meta.v6FormulaRueckbauThisTurn = {
    ...(next.meta.v6FormulaRueckbauThisTurn ?? { p1: false, p2: false }),
    [playerId]: true,
  };
  next.lastEvent = 'Rückbau: Komponente auf die Hand — Formelphase beendet, keine Aktivierung.';
  return next;
}

/**
 * V5/V6 activate: V5 uses resolveFormulaActivate; V6 uses plan→execute.
 */
function applyFormulaActivate(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  ruleset: RulesetConfig,
  rng: () => number,
  overformulaBonusChoice?: 'primary' | 'intensity',
): GameState {
  if (!isFormulaResolvable(state.players[playerId].formula)) {
    throw new Error('Formula resolve requires at least two filled slots');
  }
  if (isV6FormulaEnabled(ruleset)) {
    const plan = planFormulaActivation({
      state,
      pack,
      playerId,
      ruleset,
      rng,
      overformulaBonusChoice,
    });
    const el = formulaAffinityElement(pack, state, playerId);
    if (el && shouldOfferV6Affinity(state, pack, playerId, el, ruleset)) {
      const ess = state.players[playerId].formula.essenz;
      return openV6AffinityPending(state, pack, playerId, {
        type: 'v6-affinity',
        playerId,
        kind: 'formula',
        cardInstanceId: ess?.instanceId ?? plan.recipeId,
        cardDefId: ess?.defId ?? plan.recipeId,
        cardElement: el,
        diceRoll: plan.formulaDefense?.naturalRoll ?? 4,
        baseValue: plan.primary.value,
        formulaDefenseRoll: plan.formulaDefense?.naturalRoll,
        formulaAsOverformula: plan.kind === 'overformula',
        formulaIntensity: plan.intensity,
        formulaOverformulaBonusChoice: plan.overformulaBonusChoice ?? undefined,
      }, ruleset);
    }
    return applyV6FormulaActivate(state, pack, playerId, ruleset, rng, {
      asOverformula: plan.kind === 'overformula',
      defenseRoll: plan.formulaDefense?.naturalRoll,
      overformulaBonusChoice: plan.overformulaBonusChoice ?? overformulaBonusChoice,
    });
  }
  const wasFull = isFullFormulaActivatable(state.players[playerId].formula);
  let next = resolveFormulaActivate(state, pack, playerId, ruleset, rng);
  if (wasFull && isV5FormulaEnabled(ruleset)) {
    const cap = maxFetzChargeFor(ruleset);
    next = gainFetzCharge(next, playerId, 1, cap);
    next.lastEvent = `${next.lastEvent ?? 'Formel aktiviert.'} +1 Fetzladung (${next.players[playerId].fetzCharge}/${cap}).`;
  }
  return next;
}

/**
 * Minimal V5 Schnellmix: discard formula card from hand for one-shot.
 * Printed one-shot effects → issue #221.
 */
function applyFormulaSchnellmix(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  cardInstanceId: string,
): GameState {
  const next = cloneState(state);
  const handIdx = next.players[playerId].hand.findIndex((c) => c.instanceId === cardInstanceId);
  if (handIdx === -1) throw new Error('Card not in hand');
  const handCard = next.players[playerId].hand[handIdx];
  const def = findFormulaComponentDef(pack, handCard.defId);
  if (!def) throw new Error('Not a formula component');

  const [card] = next.players[playerId].hand.splice(handIdx, 1);
  next.piles.discard.push(card);
  next.phase = 'action';
  // Stub until #221 resolution slice.
  next.lastEvent = `Schnellmix: ${def.name} abgeworfen (Effekt folgt #221).`;
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
  const ruleset = rulesetOf(ctx, state);
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
            pending.attackCardDefId,
          );
          return next;
        }
        case 'optional-draw-discard':
        case 'must-discard':
        case 'spaeti-extra-build':
        case 'pick-reaction':
        case 'pillendoktora-boost':
        case 'mysterium-element':
        case 'v6-affinity':
        case 'v6-fessel-target':
        case 'v6-basar-pay-destroy':
        case 'v6-macke-scry':
          throw new Error('Arena effect cannot be skipped');
      }
      break;
    }
    case 'PICK_REACTION': {
      if (pending.type !== 'pick-reaction') throw new Error('Wrong pending type');
      return pickReaction(state, action.reactionId as ReactionId, ruleset, pack);
    }
    case 'PICK_PILLENDOKTORA': {
      if (pending.type !== 'pillendoktora-boost') throw new Error('Wrong pending type');
      let next = resolvePillendoktoraBoost(
        state,
        playerId,
        action.option,
        rng,
        ruleset,
      );
      return finishMainAction(checkWinner(next));
    }
    case 'PICK_MYSTERIUM_ELEMENT': {
      if (pending.type !== 'mysterium-element') throw new Error('Wrong pending type');
      return resolveMysteriumElement(state, playerId, action.element);
    }
    case 'PICK_V6_AFFINITY': {
      if (pending.type !== 'v6-affinity') throw new Error('Wrong pending type');
      if (pending.kind === 'block') {
        return finalizeV6AffinityBlock(
          state,
          pack,
          playerId,
          pending,
          action.mode,
          ruleset,
          rng,
        );
      }
      if (pending.kind === 'formula') {
        return finalizeV6AffinityFormula(
          state,
          pack,
          playerId,
          pending,
          action.mode,
          ruleset,
          rng,
        );
      }
      return finalizeV6AffinityAttack(
        state,
        pack,
        playerId,
        pending,
        action.mode,
        ruleset,
        rng,
      );
    }
    case 'PICK_V6_MACKE_SCRY': {
      if (pending.type !== 'v6-macke-scry') throw new Error('Wrong pending type');
      return resolveV6MackeScry(state, playerId, action.mode);
    }
    case 'PICK_V6_FESSEL_TARGET': {
      if (pending.type !== 'v6-fessel-target') throw new Error('Wrong pending type');
      const legal = occupiedFesselSlots(state.players[pending.targetPlayerId].formula);
      if (!legal.includes(action.slot)) {
        throw new Error('Fessel target slot empty or illegal');
      }
      let next = cloneState(state);
      next.pendingChoice = null;
      next = applyFesselToPlayer(next, pending.targetPlayerId, pending.intensity, {
        slot: action.slot,
      });
      return checkWinner(next);
    }
    case 'PICK_V6_BASAR_DESTROY': {
      if (pending.type !== 'v6-basar-pay-destroy') throw new Error('Wrong pending type');
      if (!action.pay) {
        const next = cloneState(state);
        next.pendingChoice = null;
        next.phase = 'end';
        next.lastEvent = `Basar: Störung belassen (${pending.targetName}).`;
        return checkWinner(next);
      }
      if (state.players[pending.playerId].hp <= 1) {
        throw new Error('Basar pay requires more than 1 life');
      }
      return checkWinner(
        applyV6BasarPayDestroy(
          state,
          pending.playerId,
          pending.defenderId,
          pending.targetInstanceId,
          ruleset,
          destroyFormulaComponent,
        ),
      );
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
  state = resolveTimedMatchExpiry(state, Date.now());
  if (state.winner) return state;
  const pack = ctx.pack;
  const ruleset = rulesetOf(ctx, state);
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
      next.lastEvent = isFormulaBoardEnabled(ruleset) ? 'Formelphase gepasst.' : 'Keine Karte gebaut.';
      return next;
    }
    case 'FORMULA_BUILD': {
      if (state.phase !== 'build') throw new Error('Not in build phase');
      if (!isFormulaBoardEnabled(ruleset)) {
        throw new Error('FORMULA_BUILD requires v5Formula or v6Formula');
      }
      next = applyFormulaBuild(
        state,
        pack,
        playerId,
        action.cardInstanceId,
        ruleset,
        action.discardHandInstanceId,
      );
      const builtId = listFormulaComponents(next.players[playerId].formula).find(
        (c) => c.instanceId === action.cardInstanceId,
      )?.instanceId;
      if (builtId) {
        next = tryKnuspergnomFormulaFilter(next, pack, playerId, builtId, rng, ruleset);
      }
      next = noteV6FormulaChange(next, playerId, ruleset);
      return next;
    }
    case 'FORMULA_REPLACE': {
      if (state.phase !== 'build') throw new Error('Not in build phase');
      if (!isFormulaBoardEnabled(ruleset)) {
        throw new Error('FORMULA_REPLACE requires v5Formula or v6Formula');
      }
      next = applyFormulaReplace(
        state,
        pack,
        playerId,
        action.cardInstanceId,
        ruleset,
        action.discardHandInstanceId,
      );
      const builtId = listFormulaComponents(next.players[playerId].formula).find(
        (c) => c.instanceId === action.cardInstanceId,
      )?.instanceId;
      if (builtId) {
        next = tryKnuspergnomFormulaFilter(next, pack, playerId, builtId, rng, ruleset);
      }
      next = noteV6FormulaChange(next, playerId, ruleset);
      if (shouldQueueV6ClubReplaceFilter(next, ruleset) && !next.pendingChoice) {
        next = applyMandatoryArenaDrawDiscard(
          next,
          playerId,
          'club-formula-replace',
          pack,
          rng,
          ruleset,
        );
      }
      return next;
    }
    case 'FORMULA_RETURN': {
      if (state.phase !== 'build') throw new Error('Not in build phase');
      return applyFormulaReturn(state, playerId, action.formulaInstanceId, ruleset);
    }
    case 'FORMULA_ACTIVATE': {
      if (state.phase !== 'build') throw new Error('Not in build phase');
      if (!isFormulaBoardEnabled(ruleset)) {
        throw new Error('FORMULA_ACTIVATE requires v5Formula or v6Formula');
      }
      return applyFormulaActivate(
        state,
        pack,
        playerId,
        ruleset,
        rng,
        action.overformulaBonusChoice,
      );
    }
    case 'FORMULA_SCHNELLMIX': {
      if (state.phase !== 'build') throw new Error('Not in build phase');
      if (!isV5FormulaEnabled(ruleset)) throw new Error('FORMULA_SCHNELLMIX requires v5Formula');
      return applyFormulaSchnellmix(state, pack, playerId, action.cardInstanceId);
    }
    case 'BUILD_CARD': {
      if (state.phase !== 'build') throw new Error('Not in build phase');
      if (isV5FormulaEnabled(ruleset)) {
        throw new Error('BUILD_CARD illegal under v5Formula');
      }
      if (isV6FormulaEnabled(ruleset)) {
        throw new Error('BUILD_CARD illegal under v6Formula — element cards are hand-only');
      }
      return applyBuildCard(state, pack, playerId, action, ruleset, 'action');
    }
    case 'PLAY_ATTACK': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      const handAttack = state.players[playerId].hand.find(
        (c) => c.instanceId === action.cardInstanceId,
      );
      const def = findElementDef(pack, handAttack?.defId ?? '');
      if (!def || def.cardType !== 'attack') throw new Error('Not an attack card');

      if (
        isV5FormulaEnabled(ruleset) &&
        state.players[playerId].characterId === 'mysterium' &&
        peekMysteriumElement(state, playerId) == null
      ) {
        const opened = tryOpenMysteriumElement(
          state,
          playerId,
          action.cardInstanceId,
          'element-card',
          ruleset,
        );
        if (opened.pendingChoice?.type === 'mysterium-element') {
          return opened;
        }
      }

      let diceRoll = action.diceRoll ?? rollD6(rng);
      let working = state;
      if (!shouldSkipLegacyVulkanW6(state, ruleset)) {
        const vulkan = applyVulkanAttackRoll(state, playerId, diceRoll);
        working = vulkan.state;
        diceRoll = vulkan.roll;
      }
      working = {
        ...working,
        meta: {
          ...clearV3ActionHooks(working.meta),
          v3ReactionsThisAction: 0,
          v3BlockShieldThisAction: false,
        },
      };

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

      const revenge = consumeStiernackenRevengeBonus(working, playerId);
      working = revenge.state;
      attackValue += revenge.bonus;

      const attackPrep = takeAttackPrepBonus(working, playerId);
      working = attackPrep.state;
      attackValue += attackPrep.combatBonus;

      const chainBonus = takeChainSameActionBonus(working, playerId, 'attack');
      working = chainBonus.state;
      attackValue += chainBonus.bonus;

      const enemyPenalty = takeEnemyAttackPenalty(working, playerId);
      working = enemyPenalty.state;
      attackValue -= enemyPenalty.penalty;

      const remainingPrep = working.players[playerId].formulaPrep;
      if (remainingPrep && remainingPrep.w6Bonus > 0) {
        const base = diceBonusFromRoll(diceRoll, ruleset);
        const capped = Math.min(
          remainingPrep.w6BonusMax || base + remainingPrep.w6Bonus,
          base + remainingPrep.w6Bonus,
        );
        attackValue += Math.max(0, capped - base);
        remainingPrep.w6Bonus = 0;
        remainingPrep.w6BonusMax = 0;
      }

      const attackCardElement = peekMysteriumElement(working, playerId) ?? def.element;
      attackValue += v6ClubAirValueBonus(working, attackCardElement, ruleset);
      const vulkanV6 = applyV6VulkanFirstDamageBonus(working, playerId, attackValue, ruleset);
      working = vulkanV6.state;
      attackValue = vulkanV6.attackValue;

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

      const cardElement = peekMysteriumElement(working, playerId) ?? def.element;
      if (shouldOfferV6Affinity(working, pack, playerId, cardElement, ruleset)) {
        return openV6AffinityPending(working, pack, playerId, {
          type: 'v6-affinity',
          playerId,
          kind: 'attack',
          cardInstanceId: action.cardInstanceId,
          cardDefId: def.id,
          cardElement,
          diceRoll,
          baseValue: attackValue,
          ignoreShield: attackPrep.ignoreShield > 0 ? attackPrep.ignoreShield : undefined,
          extraHitImpulse: attackPrep.extraHitImpulse ?? undefined,
        }, ruleset);
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
        ignoreShield: attackPrep.ignoreShield > 0 ? attackPrep.ignoreShield : undefined,
        extraHitImpulse: attackPrep.extraHitImpulse ?? undefined,
      };
      next.lastEvent = `Angriff ${attackValue} (Würfel ${diceRoll}). Gegner darf blocken.`;
      return next;
    }
    case 'CHALLENGE': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      const defenderId = opponentOf(playerId);
      const constructTarget =
        isV6FormulaEnabled(ruleset) &&
        state.players[defenderId].construct?.instanceId === action.targetBoundInstanceId
          ? state.players[defenderId].construct
          : null;
      const formulaTarget =
        !constructTarget && isFormulaBoardEnabled(ruleset)
          ? findFormulaComponent(state.players[defenderId].formula, action.targetBoundInstanceId)
          : undefined;
      const boundTarget =
        !constructTarget && !formulaTarget
          ? state.players[defenderId].bound.find((b) => b.instanceId === action.targetBoundInstanceId)
          : undefined;

      if (!constructTarget && !formulaTarget && !boundTarget) {
        throw new Error('Challenge target not found');
      }
      if (boundTarget && !canChallengeBoundTarget(pack, boundTarget)) {
        throw new Error('Challenge target not legal');
      }

      const handCard = state.players[playerId].hand.find(
        (c) => c.instanceId === action.attackCardInstanceId,
      );
      const def = handCard ? findElementDef(pack, handCard.defId) : undefined;
      if (!def || def.cardType !== 'attack') throw new Error('Not an attack card');

      let diceRoll = action.diceRoll ?? rollD6(rng);
      let working = state;
      if (!shouldSkipLegacyVulkanW6(state, ruleset)) {
        const vulkan = applyVulkanAttackRoll(state, playerId, diceRoll);
        working = vulkan.state;
        diceRoll = vulkan.roll;
      }
      let attackValue = constructTarget
        ? computeAttackValueForPlayer(pack, working, playerId, def, diceRoll, ruleset)
        : formulaTarget
          ? computeFormulaChallengeAttackValue(
              pack,
              working,
              playerId,
              def,
              formulaTarget,
              diceRoll,
              ruleset,
            )
          : computeChallengeAttackValue(
              pack,
              working,
              playerId,
              def,
              boundTarget!,
              diceRoll,
              ruleset,
            );

      const revenge = consumeStiernackenRevengeBonus(working, playerId);
      working = revenge.state;
      attackValue += revenge.bonus;

      attackValue += v6ClubAirValueBonus(working, def.element, ruleset);
      const vulkanV6Challenge = applyV6VulkanFirstDamageBonus(
        working,
        playerId,
        attackValue,
        ruleset,
      );
      working = vulkanV6Challenge.state;
      attackValue = vulkanV6Challenge.attackValue;

      if (shouldOfferV6Affinity(working, pack, playerId, def.element, ruleset)) {
        return openV6AffinityPending(working, pack, playerId, {
          type: 'v6-affinity',
          playerId,
          kind: 'challenge',
          cardInstanceId: action.attackCardInstanceId,
          cardDefId: def.id,
          cardElement: def.element,
          diceRoll,
          baseValue: attackValue,
          targetBoundInstanceId: action.targetBoundInstanceId,
        }, ruleset);
      }

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
      const targetHint = constructTarget
        ? ` vs ${constructDisplayName(constructTarget.defId)}`
        : '';
      next.lastEvent = `Herausforderung ${attackValue} (Würfel ${diceRoll})${targetHint}. Gegner darf blocken.`;
      return next;
    }
    case 'PLAY_ULTIMATE': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      if (isV6FormulaEnabled(ruleset)) {
        throw new Error('PLAY_ULTIMATE is not available under v6Formula');
      }
      if (!state.players[playerId].ultimateAvailable) throw new Error('Ultimate already used');
      if (isV5FormulaEnabled(ruleset)) {
        const need = maxFetzChargeFor(ruleset);
        if (state.players[playerId].fetzCharge < need) {
          throw new Error(`Großformel requires ${need} Fetzladung`);
        }
      }

      const character = pack.characters.find((c) => c.id === state.players[playerId].characterId);
      if (!character) throw new Error('Character not found');

      next = applyUltimateEffect(state, pack, playerId, character.ultimateId, rng, ruleset);
      next.players[playerId].ultimateAvailable = false;
      if (isV5FormulaEnabled(ruleset)) {
        next = applyGrossformelAftermath(next, playerId);
        next.lastEvent = `${next.lastEvent ?? 'Großformel.'} Fetzladung 0 — Katalysator abgelegt.`.trim();
      }
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
    case 'PLAY_ITEM': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      if (!isItemPlayEnabled(ruleset)) throw new Error('PLAY_ITEM requires v5Formula or v6Formula');
      const handCard = state.players[playerId].hand.find(
        (c) => c.instanceId === action.cardInstanceId,
      );
      const item = handCard ? findItemDef(pack, handCard.defId) : undefined;
      if (!item) throw new Error('Not an item');

      const v6 = isV6FormulaEnabled(ruleset);

      // V6 Ausrüstung: equip to board slots (main action), including reaction-timed defs.
      if (v6 && isEquipmentItem(item)) {
        next = cloneState(state);
        const hand = next.players[playerId].hand;
        const idx = hand.findIndex((c) => c.instanceId === action.cardInstanceId);
        if (idx === -1) throw new Error('Card not in hand');
        const [card] = hand.splice(idx, 1);
        const equipped = equipItemFromHand(
          playerEquipment(next, playerId),
          card,
          action.replaceEquipmentInstanceId,
        );
        next.players[playerId].equipment = equipped.equipment;
        if (equipped.discarded) {
          next.piles.discard.push(equipped.discarded);
        }
        next.lastEvent = equipped.discarded
          ? `${item.name} ausgerüstet (Slot ersetzt).`
          : `${item.name} ausgerüstet.`;
        return finishMainAction(checkWinner(next));
      }

      if (item.timing !== 'action') throw new Error('Not an action item');

      if (v6 && isConsumableItem(item)) {
        if (consumablePlayedThisTurn(state, playerId)) {
          throw new Error('Max 1 Verbrauch-Gegenstand pro Zug');
        }
      }

      next = discardFromHand(state, playerId, action.cardInstanceId);
      if (v6 && isConsumableItem(item)) {
        next = markConsumablePlayed(next, playerId);
      }
      const opp = opponentOf(playerId);
      const slug = itemEffectSlug(item.id);

      if (slug === 'rostiger-nagel') {
        const prep = next.players[playerId].formulaPrep ?? emptyFormulaPrep();
        prep.attackIgnoreShield += 2;
        next.players[playerId].formulaPrep = prep;
        next.lastEvent = `${item.name}: nächster Angriff ignoriert 2 Schild.`;
      } else if (slug === 'verdaechtiger-pilz') {
        next.players[playerId].shield = clampShield(
          (next.players[playerId].shield ?? 0) + 2,
        );
        next = applyStatus(next, playerId, 'high', 1);
        next.lastEvent = `${item.name}: +2 Schild und High.`;
      } else if (slug === 'halbe-dose-energy') {
        next = drawForPlayer(next, playerId, 2, rng, ruleset, { allowExtra: true });
        next.meta = {
          ...next.meta,
          v5EnergyHangover: {
            ...(next.meta.v5EnergyHangover ?? { p1: 0, p2: 0 }),
            [playerId]: (next.meta.v5EnergyHangover?.[playerId] ?? 0) + 1,
          },
        };
        next.lastEvent = `${item.name}: 2 Karten gezogen (nächster Zug −1 Leben).`;
      } else if (slug === 'nasser-socken') {
        const prep = next.players[playerId].formulaPrep ?? emptyFormulaPrep();
        prep.extraHitImpulse = 'water';
        prep.markIfNoReaction = prep.markIfNoReaction ?? 'durchnaesst';
        next.players[playerId].formulaPrep = prep;
        next.lastEvent = `${item.name}: nächste Elementkarte +Wasser; Treffer → Durchnässt ohne Reaktion.`;
      } else if (slug === 'kabelbinder-deluxe') {
        const targetId = action.targetFormulaInstanceId;
        const target = targetId
          ? findFormulaComponent(next.players[opp].formula, targetId)
          : listFormulaComponents(next.players[opp].formula).find(
              (c) => formulaComponentStability(pack, c) <= 3 && !c.disturbed,
            );
        if (target && formulaComponentStability(pack, target) <= 3) {
          next.players[opp].formula = disturbFormulaComponent(
            next.players[opp].formula,
            target.instanceId,
          );
          next.lastEvent = `${item.name}: Komponente gestört.`;
        } else {
          next.lastEvent = `${item.name}: kein gültiges Ziel (Stabilität ≤3).`;
        }
      } else {
        next.lastEvent = `${item.name} gespielt.`;
      }
      return finishMainAction(checkWinner(next));
    }
    case 'ACTIVATE_EQUIPMENT': {
      if (!isV6FormulaEnabled(ruleset)) {
        throw new Error('ACTIVATE_EQUIPMENT requires v6Formula');
      }
      const eqCard = playerEquipment(state, playerId).find(
        (e) => e.instanceId === action.equipmentInstanceId,
      );
      const item = eqCard ? findItemDef(pack, eqCard.defId) : undefined;
      if (!item || !isEquipmentItem(item)) throw new Error('Not equipped Ausrüstung');
      if (equipmentActivatedThisTurn(state, playerId, action.equipmentInstanceId)) {
        throw new Error('Ausrüstung bereits diesen Zug aktiviert');
      }
      const slug = itemEffectSlug(item.id);

      if (state.combat) {
        if (playerId !== state.combat.defenderId) {
          throw new Error('Only defender can activate reaction equipment');
        }
        if (slug === 'kaputter-rueckspiegel') {
          if (state.combat.rueckspiegelArmed) throw new Error('Reaction item already used');
          next = markEquipmentActivated(cloneState(state), playerId, action.equipmentInstanceId);
          if (!next.combat) throw new Error('Combat lost');
          next.combat = {
            ...next.combat,
            attackValue: Math.max(0, next.combat.attackValue - 1),
            rueckspiegelArmed: true,
          };
          next.lastEvent = `${item.name}: Angriffswert −1.`;
          return next;
        }
        if (slug === 'gezinkter-wuerfel') {
          const mod = action.diceMod;
          if (mod !== 1 && mod !== -1) throw new Error('Gezinkter Würfel needs diceMod ±1');
          next = markEquipmentActivated(cloneState(state), playerId, action.equipmentInstanceId);
          if (!next.combat) throw new Error('Combat lost');
          next.combat = {
            ...next.combat,
            attackValue: Math.max(0, next.combat.attackValue - mod),
          };
          next.lastEvent = `${item.name}: Angriffswert ${mod > 0 ? '−' : '+'}${Math.abs(mod)}.`;
          return next;
        }
        throw new Error('Equipment not usable in combat');
      }

      if (state.phase !== 'action') throw new Error('Not in action phase');
      if (slug !== 'werkzeugkoffer') throw new Error('Only Werkzeugkoffer activates in action');
      if (!action.discardHandInstanceId) throw new Error('Werkzeugkoffer needs discard');
      next = discardFromHand(state, playerId, action.discardHandInstanceId);
      next = markEquipmentActivated(next, playerId, action.equipmentInstanceId);
      next = drawForPlayer(next, playerId, 1, rng, ruleset, { allowExtra: true });
      next.lastEvent = `${item.name}: 1 abgeworfen, 1 gezogen.`;
      return checkWinner(next);
    }
    case 'PLAY_BOOST': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      const handCard = state.players[playerId].hand.find((c) => c.instanceId === action.cardInstanceId);
      const def = handCard ? findElementDef(pack, handCard.defId) : undefined;
      if (!def || def.cardType !== 'boost') throw new Error('Not a boost card');

      next = discardFromHand(state, playerId, action.cardInstanceId);
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

      next = applyBoostWithFormulaPrep(next, playerId, def, pack, rng, ruleset);
      const hpGained = Math.max(0, next.players[playerId].hp - (state.players[playerId].hp));
      if (hpGained > 0) {
        next = tryKokabellStabilityOnHeal(next, playerId, hpGained, ruleset);
        next = tryV6Nachjustiert(next, playerId, hpGained, ruleset);
      }
      next = incrementBoostsPlayed(next, playerId);
      if (next.pendingChoice?.type === 'must-discard' && next.pendingChoice.source === 'air') {
        next.meta = { ...next.meta, awaitingPostBoostArena: true };
        return finishMainAction(next);
      }
      next = queuePostBoostPending(next, playerId, pack, rng, ruleset);
      if (!next.pendingChoice) {
        next = tryOpenPillendoktoraBoost(next, playerId, ruleset);
      }
      if (!next.pendingChoice) {
        next = tryV6Dosisaenderung(next, playerId, rng, ruleset);
      }
      return finishMainAction(next);
    }
    case 'DISCARD_DRAW': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      next = discardFromHand(state, playerId, action.discardInstanceId);
      next = drawForPlayer(next, playerId, 2, rng, ruleset);
      next.lastEvent = 'Improvisieren: 1 Karte abgeworfen, 2 gezogen.';
      return finishMainAction(checkWinner(next));
    }
    case 'ACTIVATE_BOUND': {
      if (state.phase !== 'action') throw new Error('Not in action phase');
      if (isV6FormulaEnabled(ruleset)) {
        throw new Error('ACTIVATE_BOUND illegal under v6Formula — no bound element cards');
      }
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
        meta: {
          ...next.meta,
          v6FetzGainedThisTurn: {
            ...(next.meta.v6FetzGainedThisTurn ?? { p1: false, p2: false }),
            [playerId]: false,
          },
          v6PostFormulaActionLock: {
            ...(next.meta.v6PostFormulaActionLock ?? { p1: 'none', p2: 'none' }),
            [playerId]: 'none',
          },
        },
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
  const ruleset = rulesetOf(ctx, state);
  const rng = rngOf(ctx);

  if (action.type === 'PLAY_ITEM') {
    if (!isV5FormulaEnabled(ruleset)) throw new Error('PLAY_ITEM requires v5Formula');
    const handCard = state.players[playerId].hand.find(
      (c) => c.instanceId === action.cardInstanceId,
    );
    const item = handCard ? findItemDef(pack, handCard.defId) : undefined;
    if (!item || item.timing !== 'reaction') throw new Error('Not a reaction item');
    if (state.combat.rueckspiegelArmed) throw new Error('Reaction item already used');

    let next = discardFromHand(state, playerId, action.cardInstanceId);
    if (!next.combat) throw new Error('Combat lost');
    next.combat = {
      ...next.combat,
      attackValue: Math.max(0, next.combat.attackValue - 1),
      rueckspiegelArmed: true,
    };
    next.lastEvent = `${item.name}: Angriffswert −1.`;
    return next;
  }

  if (action.type === 'ACTIVATE_EQUIPMENT') {
    if (!isV6FormulaEnabled(ruleset)) {
      throw new Error('ACTIVATE_EQUIPMENT requires v6Formula');
    }
    const eqCard = playerEquipment(state, playerId).find(
      (e) => e.instanceId === action.equipmentInstanceId,
    );
    const item = eqCard ? findItemDef(pack, eqCard.defId) : undefined;
    if (!item || !isEquipmentItem(item)) throw new Error('Not equipped Ausrüstung');
    if (equipmentActivatedThisTurn(state, playerId, action.equipmentInstanceId)) {
      throw new Error('Ausrüstung bereits diesen Zug aktiviert');
    }
    const slug = itemEffectSlug(item.id);
    if (slug === 'kaputter-rueckspiegel') {
      if (state.combat.rueckspiegelArmed) throw new Error('Reaction item already used');
      let next = markEquipmentActivated(cloneState(state), playerId, action.equipmentInstanceId);
      if (!next.combat) throw new Error('Combat lost');
      next.combat = {
        ...next.combat,
        attackValue: Math.max(0, next.combat.attackValue - 1),
        rueckspiegelArmed: true,
      };
      next.lastEvent = `${item.name}: Angriffswert −1.`;
      return next;
    }
    if (slug === 'gezinkter-wuerfel') {
      const mod = action.diceMod;
      if (mod !== 1 && mod !== -1) throw new Error('Gezinkter Würfel needs diceMod ±1');
      let next = markEquipmentActivated(cloneState(state), playerId, action.equipmentInstanceId);
      if (!next.combat) throw new Error('Combat lost');
      next.combat = {
        ...next.combat,
        attackValue: Math.max(0, next.combat.attackValue - mod),
      };
      next.lastEvent = `${item.name}: Angriffswert ${mod > 0 ? '−' : '+'}${Math.abs(mod)}.`;
      return next;
    }
    throw new Error('Equipment not usable in combat');
  }

  const attackDef = findElementDef(pack, attackCardDefId);
  if (!attackDef) throw new Error('Attack card missing');

  if (action.type === 'PASS_BLOCK') {
    if (state.combat.mode === 'challenge') {
      return resolveChallengeCombat(state, pack, 0, ruleset, rng);
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
    let working = state;
    if (!shouldSkipLegacySumpfW6(state, ruleset)) {
      const sumpf = applySumpfBlockRoll(state, playerId, diceRoll);
      working = sumpf.state;
      diceRoll = sumpf.roll;
    }

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

    const blockPrep = takeBlockPrepBonus(working, playerId);
    working = blockPrep.state;

    let blockValue =
      computeBlockValueForPlayer(
        pack,
        working,
        playerId,
        def,
        diceRoll,
        attackDef.element,
        ruleset,
      ) + blockPrep.combatBonus;

    const chainBlock = takeChainSameActionBonus(working, playerId, 'block');
    working = chainBlock.state;
    blockValue += chainBlock.bonus;

    const remainingPrep = working.players[playerId].formulaPrep;
    if (remainingPrep && remainingPrep.w6Bonus > 0) {
      const base = diceBonusFromRoll(diceRoll, ruleset);
      const capped = Math.min(
        remainingPrep.w6BonusMax || base + remainingPrep.w6Bonus,
        base + remainingPrep.w6Bonus,
      );
      blockValue += Math.max(0, capped - base);
      remainingPrep.w6Bonus = 0;
      remainingPrep.w6BonusMax = 0;
    }

    const blockElement = peekMysteriumElement(working, playerId) ?? def.element;
    blockValue += v6ClubAirValueBonus(working, blockElement, ruleset);
    if (shouldOfferV6AffinityOnBlock(working, pack, playerId, blockElement, ruleset)) {
      return openV6AffinityPending(working, pack, playerId, {
        type: 'v6-affinity',
        playerId,
        kind: 'block',
        cardInstanceId: action.cardInstanceId,
        cardDefId: def.id,
        cardElement: blockElement,
        diceRoll,
        baseValue: blockValue,
      }, ruleset);
    }

    let next = discardFromHand(working, playerId, action.cardInstanceId);
    if (state.combat.mode === 'challenge') {
      next = resolveChallengeCombat(next, pack, blockValue, ruleset, rng);
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
