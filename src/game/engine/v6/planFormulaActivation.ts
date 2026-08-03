/**
 * planFormulaActivation — single calculator for V6 formula UI + execute.
 * Location: src/game/engine/v6/planFormulaActivation.ts
 */
import type { ContentPack, GameState, PlayerId, RulesetConfig } from '../../types';
import { isV6FormulaEnabled, maxFetzChargeFor } from '../../types';
import { findFormulaComponentDef } from '../formulaSlots';
import { listFormulaComponents } from '../formulaChallenge';
import type { Rng } from '../deck';
import { rollD6 } from '../dice';
import type { FormulaActivationPlan, V6PrimaryKind } from './formulaActivationPlan';
import { applyV6DefenseToPrimary, v6DefenseStagesFromRoll } from './formulaDefense';
import { findV6Recipe } from './recipeLookup';
import { V6_FORMULA_AUTHORING_SLICE1 } from '../../../content/v6/formulaAuthoring.slice1';

export interface PlanFormulaActivationInput {
  state: GameState;
  pack: ContentPack;
  playerId: PlayerId;
  ruleset: RulesetConfig;
  rng: Rng;
  /** Force Überformel when legal (3 Fetz + full TEK). */
  asOverformula?: boolean;
  /** Natural defense roll override for tests. */
  defenseRoll?: number;
  /** Opfergabe: player chose to discard. */
  offerDiscard?: boolean;
}

function catalystTransformMeta(catalystId: string): {
  selfDamage: number;
  drawDiscardAfter: boolean;
  stabilityBuffUsed: number;
  offerDiscardBonus: number;
} {
  const x = V6_FORMULA_AUTHORING_SLICE1.catalystTransforms.find((t) => t.catalystId === catalystId);
  return {
    selfDamage: x?.selfDamage ?? 0,
    drawDiscardAfter: x?.drawDiscardAfter === true,
    stabilityBuffUsed: x?.stabilityBuffUsed ?? 0,
    offerDiscardBonus: x?.offerDiscardBonus ?? 0,
  };
}

function asPrimaryKind(kind: string): V6PrimaryKind {
  switch (kind) {
    case 'damage':
    case 'heal':
    case 'shield':
    case 'prep_attack':
    case 'prep_block':
    case 'prep_boost':
      return kind;
    default:
      throw new Error(`V6_RECIPE_INVALID_PRIMARY_KIND: ${kind}`);
  }
}

export function planFormulaActivation(input: PlanFormulaActivationInput): FormulaActivationPlan {
  const { state, pack, playerId, ruleset, rng } = input;
  if (!isV6FormulaEnabled(ruleset)) {
    throw new Error('planFormulaActivation requires v6Formula');
  }

  const formula = state.players[playerId].formula;
  const tech = formula.technik;
  const ess = formula.essenz;
  const kat = formula.katalysator;

  const filled = listFormulaComponents(formula).filter((c) => !c.exhausted && !c.disturbed);
  if (filled.length < 2) {
    throw new Error('Formula resolve requires at least two filled upright slots');
  }

  const techniqueId = tech && !tech.exhausted && !tech.disturbed ? tech.defId : null;
  const essenceId = ess && !ess.exhausted && !ess.disturbed ? ess.defId : null;
  const catalystId = kat && !kat.exhausted && !kat.disturbed ? kat.defId : null;

  let kind: 'te' | 'tk' | 'ek' | 'tek' | 'overformula';
  if (techniqueId && essenceId && catalystId) {
    kind = 'tek';
  } else if (techniqueId && essenceId && !catalystId) {
    kind = 'te';
  } else if (techniqueId && catalystId && !essenceId) {
    kind = 'tk';
  } else if (essenceId && catalystId && !techniqueId) {
    kind = 'ek';
  } else {
    throw new Error('V6_RECIPE_AMBIGUOUS_SLOTS');
  }

  const charge = state.players[playerId].fetzCharge;
  const wantOver =
    kind === 'tek' &&
    (input.asOverformula === true ||
      (input.asOverformula !== false && charge >= maxFetzChargeFor(ruleset)));
  if (wantOver) {
    if (charge < maxFetzChargeFor(ruleset)) {
      throw new Error('Überformel requires full Fetzladung');
    }
    kind = 'overformula';
  }

  const recipe = findV6Recipe({
    kind,
    techniqueId,
    essenceId,
    catalystId,
  });

  const xform = catalystId ? catalystTransformMeta(catalystId) : {
    selfDamage: 0,
    drawDiscardAfter: false,
    stabilityBuffUsed: 0,
    offerDiscardBonus: 0,
  };

  const offerBonus =
    input.offerDiscard === true && xform.offerDiscardBonus > 0 ? xform.offerDiscardBonus : 0;

  let primaryValue = recipe.primary.value + offerBonus;
  const offensive = recipe.primary.offensive === true;
  const needsDefense = recipe.primary.target === 'opponent';

  let defenseRoll: number | null = null;
  let stages: 0 | 1 | 2 = 0;
  let riderSuppressed = false;
  const defensePenalty = recipe.formulaDefensePenalty ?? 0;

  if (needsDefense) {
    defenseRoll = input.defenseRoll ?? rollD6(rng);
    stages = v6DefenseStagesFromRoll(defenseRoll);
    primaryValue = applyV6DefenseToPrimary(primaryValue, stages, defensePenalty);
    riderSuppressed = stages === 2;
  }

  const rawRider = recipe.rider;
  const rider =
    rawRider == null
      ? null
      : {
          id: rawRider.id,
          summary: rawRider.summary,
          defenseSuppressible: rawRider.defenseSuppressible,
          suppressed: riderSuppressed && rawRider.defenseSuppressible,
        };

  const grantsFetz = recipe.grantsFetz === true;
  const fetzAlreadyThisTurn = state.meta.v6FetzGainedThisTurn?.[playerId] === true;
  const fetzDelta = grantsFetz && !fetzAlreadyThisTurn ? 1 : 0;

  const lock: FormulaActivationPlan['postFormulaActionLock'] =
    kind === 'tek' || kind === 'overformula'
      ? offensive
        ? 'attack_and_challenge'
        : 'none'
      : offensive
        ? 'attack_and_challenge'
        : 'none';

  const techName = techniqueId
    ? findFormulaComponentDef(pack, techniqueId)?.name ?? techniqueId
    : '—';
  const eventSummary = [
    `V6 ${recipe.name}`,
    `(${recipe.kind})`,
    `${recipe.primary.kind} ${primaryValue}`,
    recipe.catalystConsumed ? 'Katalysator verbraucht' : null,
    fetzDelta > 0 ? `+${fetzDelta} Fetz` : null,
    lock === 'attack_and_challenge' ? 'Angriff/Herausfordern gesperrt' : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return {
    recipeId: recipe.recipeId,
    kind: recipe.kind,
    name: recipe.name,
    actorId: playerId,
    primary: {
      kind: asPrimaryKind(recipe.primary.kind),
      value: primaryValue,
      target: recipe.primary.target,
      offensive,
    },
    rider,
    intensity: recipe.intensity,
    catalystConsumed: recipe.catalystConsumed,
    catalystInstanceId: kat?.instanceId ?? null,
    grantsFetz,
    fetzDelta,
    spendAllFetz: recipe.kind === 'overformula',
    postFormulaActionLock: lock,
    formulaDefense:
      defenseRoll == null
        ? null
        : {
            naturalRoll: defenseRoll,
            stages,
            primaryAfterDefense: primaryValue,
            riderSuppressed,
          },
    offerDiscardRequired: false,
    offerDiscardBonus: xform.offerDiscardBonus,
    selfDamage: xform.selfDamage,
    drawDiscardAfter: xform.drawDiscardAfter,
    stabilityBuffUsed: xform.stabilityBuffUsed,
    formulaDefensePenalty: defensePenalty,
    eventSummary: `${eventSummary} [${techName}]`,
  };
}

export function revalidateFormulaPlan(
  plan: FormulaActivationPlan,
  input: PlanFormulaActivationInput,
): FormulaActivationPlan {
  const next = planFormulaActivation({
    ...input,
    asOverformula: plan.kind === 'overformula',
    defenseRoll: plan.formulaDefense?.naturalRoll,
    offerDiscard: plan.offerDiscardBonus > 0 && input.offerDiscard === true,
  });
  if (next.recipeId !== plan.recipeId) {
    throw new Error(`V6_PLAN_STALE: expected ${plan.recipeId}, got ${next.recipeId}`);
  }
  return next;
}
