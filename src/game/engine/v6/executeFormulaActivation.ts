/**
 * Execute a validated V6 FormulaActivationPlan (lookup only — no composer).
 * Location: src/game/engine/v6/executeFormulaActivation.ts
 */
import type { ContentPack, GameState, PlayerId, RulesetConfig } from '../../types';
import { maxFetzChargeFor } from '../../types';
import { clampShield } from '../../types/status';
import { cloneState, clampHp, drawForPlayer } from '../helpers';
import { gainFetzCharge } from '../status/fetzCharge';
import { opponentOf } from '../createGame';
import { emptyFormulaPrep } from '../formulaResolve';
import type { FormulaActivationPlan } from './formulaActivationPlan';
import {
  planFormulaActivation,
  revalidateFormulaPlan,
  type PlanFormulaActivationInput,
} from './planFormulaActivation';
import { occupiedFesselSlots } from './fessel';
import {
  enqueueV6Delay,
  enqueueV6Echo,
  V6_DELAY_DEFAULT_BONUS,
  V6_ECHO_DEFAULT_AMOUNT,
} from './echoDelay';

function ensureV6Meta(state: GameState): GameState {
  const next = cloneState(state);
  next.meta.v6FetzGainedThisTurn ??= { p1: false, p2: false };
  next.meta.v6PostFormulaActionLock ??= { p1: 'none', p2: 'none' };
  return next;
}

function applyPrimary(
  state: GameState,
  plan: FormulaActivationPlan,
  ruleset: RulesetConfig,
): GameState {
  const next = cloneState(state);
  const actor = plan.actorId;
  const foe = opponentOf(actor);
  const value = plan.primary.value;

  switch (plan.primary.kind) {
    case 'damage': {
      if (plan.primary.target !== 'opponent' || value <= 0) break;
      const def = next.players[foe];
      let remaining = value;
      const shieldUsed = Math.min(def.shield, remaining);
      def.shield -= shieldUsed;
      remaining -= shieldUsed;
      if (remaining > 0) {
        def.hp = clampHp(def.hp - remaining, ruleset);
      }
      break;
    }
    case 'heal': {
      if (plan.primary.target === 'self' && value > 0) {
        next.players[actor].hp = clampHp(next.players[actor].hp + value, ruleset);
      }
      break;
    }
    case 'shield': {
      if (plan.primary.target === 'self' && value > 0) {
        next.players[actor].shield = clampShield(next.players[actor].shield + value);
      }
      break;
    }
    case 'prep_attack': {
      const prep = next.players[actor].formulaPrep ?? emptyFormulaPrep();
      next.players[actor].formulaPrep = {
        ...prep,
        attackCombatBonus: prep.attackCombatBonus + value,
        preparedActionType: 'attack',
      };
      break;
    }
    case 'prep_block': {
      const prep = next.players[actor].formulaPrep ?? emptyFormulaPrep();
      next.players[actor].formulaPrep = {
        ...prep,
        blockCombatBonus: prep.blockCombatBonus + value,
        preparedActionType: 'block',
      };
      break;
    }
    case 'prep_boost': {
      const prep = next.players[actor].formulaPrep ?? emptyFormulaPrep();
      next.players[actor].formulaPrep = {
        ...prep,
        boostValueBonus: prep.boostValueBonus + value,
        preparedActionType: 'boost',
      };
      break;
    }
    case 'fessel': {
      // Applied after plan in executeFormulaActivation (needs foe board).
      break;
    }
    default:
      break;
  }
  return next;
}

function discardCatalyst(state: GameState, playerId: PlayerId, instanceId: string): GameState {
  const next = cloneState(state);
  const formula = { ...next.players[playerId].formula };
  const kat = formula.katalysator;
  if (!kat || kat.instanceId !== instanceId) {
    throw new Error('V6 catalyst instance mismatch on discard');
  }
  next.piles.discard.push({ instanceId: kat.instanceId, defId: kat.defId });
  formula.katalysator = null;
  next.players[playerId].formula = formula;
  return next;
}

function exhaustUsedComponents(state: GameState, playerId: PlayerId): GameState {
  const next = cloneState(state);
  const formula = { ...next.players[playerId].formula };
  const exhaust = <T extends { exhausted: boolean } | null>(c: T): T => {
    if (!c) return c;
    return { ...c, exhausted: true };
  };
  formula.technik = exhaust(formula.technik);
  formula.essenz = exhaust(formula.essenz);
  // catalyst already discarded when consumed
  if (formula.katalysator) {
    formula.katalysator = exhaust(formula.katalysator);
  }
  next.players[playerId].formula = formula;
  return next;
}

export function executeFormulaActivation(
  plan: FormulaActivationPlan,
  input: PlanFormulaActivationInput,
): GameState {
  let validated = revalidateFormulaPlan(plan, input);
  if (input.affinityAdjustedPrimary != null) {
    validated = {
      ...validated,
      primary: { ...validated.primary, value: input.affinityAdjustedPrimary },
      intensity:
        input.affinityAdjustedIntensity !== undefined
          ? input.affinityAdjustedIntensity
          : validated.intensity,
    };
  }
  const { pack, playerId, ruleset, rng } = input;

  let next = ensureV6Meta(input.state);

  const timing = validated.timingMode;
  const deferPrimary = timing === 'delay';

  if (!deferPrimary) {
    next = applyPrimary(next, validated, ruleset);
  }

  let pendingFessel:
    | { chooserId: PlayerId; targetPlayerId: PlayerId; intensity: number }
    | null = null;
  if (
    !deferPrimary &&
    validated.primary.kind === 'fessel' &&
    validated.primary.value > 0
  ) {
    const foe = opponentOf(validated.actorId);
    if (occupiedFesselSlots(next.players[foe].formula).length > 0) {
      pendingFessel = {
        chooserId: validated.actorId,
        targetPlayerId: foe,
        intensity: validated.primary.value,
      };
    }
  }

  if (validated.selfDamage > 0) {
    next.players[playerId].hp = clampHp(
      next.players[playerId].hp - validated.selfDamage,
      ruleset,
    );
  }

  if (validated.stabilityBuffUsed > 0) {
    const formula = { ...next.players[playerId].formula };
    for (const slot of ['technik', 'essenz', 'katalysator'] as const) {
      const c = formula[slot];
      if (c) {
        formula[slot] = {
          ...c,
          stabilityBonus: (c.stabilityBonus ?? 0) + validated.stabilityBuffUsed,
        };
      }
    }
    next.players[playerId].formula = formula;
  }

  if (validated.drawDiscardAfter) {
    next = drawForPlayer(next, playerId, 1, rng, ruleset);
  }
  void pack;

  if (timing === 'echo') {
    const echoAmt = Math.min(
      validated.echoAmount || V6_ECHO_DEFAULT_AMOUNT,
      Math.max(0, validated.primary.value),
    );
    next = enqueueV6Echo(next, playerId, {
      recipeId: validated.recipeId,
      recipeName: validated.name,
      kind: validated.primary.kind,
      value: validated.primary.value,
      target: validated.primary.target,
      offensive: validated.primary.offensive,
      catalystInstanceId: validated.catalystInstanceId,
      echoAmount: echoAmt,
    });
  } else if (timing === 'delay') {
    const bonus = validated.delayBonus || V6_DELAY_DEFAULT_BONUS;
    next = enqueueV6Delay(next, playerId, {
      recipeId: validated.recipeId,
      recipeName: validated.name,
      kind: validated.primary.kind,
      value: Math.max(0, validated.primary.value + bonus),
      target: validated.primary.target,
      offensive: validated.primary.offensive,
      catalystInstanceId: validated.catalystInstanceId,
    });
  }

  if (validated.catalystConsumed && validated.catalystInstanceId) {
    next = discardCatalyst(next, playerId, validated.catalystInstanceId);
  }

  next = exhaustUsedComponents(next, playerId);

  if (validated.spendAllFetz) {
    next.players[playerId].fetzCharge = 0;
  } else if (validated.fetzDelta > 0) {
    const cap = maxFetzChargeFor(ruleset);
    next = gainFetzCharge(next, playerId, validated.fetzDelta, cap);
    next.meta.v6FetzGainedThisTurn = {
      ...(next.meta.v6FetzGainedThisTurn ?? { p1: false, p2: false }),
      [playerId]: true,
    };
  }

  next.meta.v6PostFormulaActionLock = {
    ...(next.meta.v6PostFormulaActionLock ?? { p1: 'none', p2: 'none' }),
    [playerId]: validated.postFormulaActionLock,
  };

  next.phase = 'action';
  if (pendingFessel) {
    next.pendingChoice = {
      type: 'v6-fessel-target',
      playerId: pendingFessel.chooserId,
      targetPlayerId: pendingFessel.targetPlayerId,
      intensity: pendingFessel.intensity,
    };
    next.lastEvent = `${validated.eventSummary} · Fessel ${pendingFessel.intensity} — Ziel wählen.`;
  } else if (timing === 'echo') {
    const q = next.meta.v6EchoQueue?.[playerId] ?? [];
    next.lastEvent = `${validated.eventSummary} · Echo in Warteschlange (${q.length}).`;
  } else if (timing === 'delay') {
    const q = next.meta.v6DelayQueue?.[playerId] ?? [];
    next.lastEvent = `${validated.eventSummary} · Verzögerung in Warteschlange (${q.length}).`;
  } else {
    next.lastEvent =
      validated.primary.kind === 'fessel' && validated.primary.value > 0
        ? `${validated.eventSummary} · Fessel ${validated.primary.value} (kein Ziel)`
        : validated.eventSummary;
  }
  return next;
}

/** Plan + execute in one step for FORMULA_ACTIVATE under v6. */
export function applyV6FormulaActivate(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  ruleset: RulesetConfig,
  rng: () => number,
  opts?: {
    asOverformula?: boolean;
    defenseRoll?: number;
    offerDiscard?: boolean;
    affinityAdjustedPrimary?: number;
    affinityAdjustedIntensity?: number | null;
  },
): GameState {
  const input: PlanFormulaActivationInput = {
    state,
    pack,
    playerId,
    ruleset,
    rng,
    asOverformula: opts?.asOverformula,
    defenseRoll: opts?.defenseRoll,
    offerDiscard: opts?.offerDiscard,
    affinityAdjustedPrimary: opts?.affinityAdjustedPrimary,
    affinityAdjustedIntensity: opts?.affinityAdjustedIntensity,
  };
  const plan = planFormulaActivation(input);
  return executeFormulaActivation(plan, input);
}
