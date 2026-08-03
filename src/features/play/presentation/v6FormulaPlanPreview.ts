/**
 * Maps engine FormulaActivationPlan → German preview lines (no second calculator).
 * Location: src/features/play/presentation/v6FormulaPlanPreview.ts
 */
import type { FormulaActivationPlan } from '../../../game/engine/v6';

export interface V6FormulaPreviewLines {
  title: string;
  primaryLine: string;
  catalystLine: string | null;
  timingLine: string | null;
  fetzLine: string | null;
  /** Überformel bonus line (+2 Primär locked default). */
  overformulaLine: string | null;
  lockLine: string | null;
  defenseLine: string | null;
  eventSummary: string;
}

export function formatV6FormulaPlanPreview(plan: FormulaActivationPlan): V6FormulaPreviewLines {
  const primaryKindDe: Record<string, string> = {
    damage: 'Schaden',
    heal: 'Heilung',
    shield: 'Schild',
    prep_attack: 'Angriffsvorbereitung',
    prep_block: 'Blockvorbereitung',
    prep_boost: 'Boostvorbereitung',
    fessel: 'Fessel',
    summon_construct: 'Konstrukt beschwören',
  };
  const targetDe = plan.primary.target === 'opponent' ? 'Gegner' : 'Du';
  const intensityNote =
    plan.intensity != null && plan.intensity > 0
      ? ` · Intensität ${plan.intensity}`
      : '';
  const timing = plan.timingMode ?? 'immediate';
  const timingLine =
    timing === 'echo'
      ? `Echo: +${plan.echoAmount} in der nächsten Startphase (fester Betrag)`
      : timing === 'delay'
        ? `Verzögerung: Primär +${plan.delayBonus} in der nächsten Startphase (fester Bonus)`
        : null;
  const catalystLine =
    timing === 'echo' || timing === 'delay'
      ? 'Katalysator bleibt bis zur Auflösung (nächste Startphase).'
      : plan.catalystConsumed
        ? 'Dieser Katalysator wird verbraucht (Ablage).'
        : null;
  const overformulaLine =
    plan.kind === 'overformula'
      ? plan.overformulaPrimaryBonus != null && plan.overformulaPrimaryBonus > 0
        ? `Überformel-Bonus: +${plan.overformulaPrimaryBonus} Primär`
        : plan.overformulaIntensityBonus != null && plan.overformulaIntensityBonus > 0
          ? `Überformel-Bonus: +${plan.overformulaIntensityBonus} Intensität`
          : 'Überformel: verstärkte Fusion'
      : null;
  return {
    title: plan.name,
    primaryLine: `${primaryKindDe[plan.primary.kind] ?? plan.primary.kind} ${plan.primary.value} → ${targetDe}${intensityNote}`,
    catalystLine,
    timingLine,
    fetzLine:
      plan.fetzDelta > 0
        ? `+${plan.fetzDelta} Fetzladung`
        : plan.spendAllFetz
          ? 'Überformel: Fetzladung wird auf 0 gesetzt'
          : null,
    overformulaLine,
    lockLine:
      plan.postFormulaActionLock === 'attack_and_challenge'
        ? 'Danach: Angriff und Herausfordern gesperrt'
        : null,
    defenseLine: plan.formulaDefense
      ? `Formelabwehr W6=${plan.formulaDefense.naturalRoll} → Stufe ${plan.formulaDefense.stages}${
          plan.formulaDefense.intensityAfterDefense != null
            ? ` · Intensität ${plan.formulaDefense.intensityAfterDefense}`
            : ''
        }`
      : null,
    eventSummary: plan.eventSummary,
  };
}

/** Hard-gate: preview fields must be derived from the plan (no invented numbers). */
export function assertPreviewMatchesPlan(
  plan: FormulaActivationPlan,
  preview: V6FormulaPreviewLines,
): void {
  if (!preview.primaryLine.includes(String(plan.primary.value))) {
    throw new Error('V6_PREVIEW_MISMATCH: primary value');
  }
  const timing = plan.timingMode ?? 'immediate';
  if (timing === 'echo' || timing === 'delay') {
    if (!preview.catalystLine?.includes('bleibt')) {
      throw new Error('V6_PREVIEW_MISMATCH: deferred catalyst');
    }
    if (!preview.timingLine) {
      throw new Error('V6_PREVIEW_MISMATCH: timing line');
    }
  } else if (plan.catalystConsumed && !preview.catalystLine) {
    throw new Error('V6_PREVIEW_MISMATCH: catalyst consumption');
  }
  if (plan.fetzDelta > 0 && !preview.fetzLine?.includes(String(plan.fetzDelta))) {
    throw new Error('V6_PREVIEW_MISMATCH: fetz');
  }
  if (plan.kind === 'overformula') {
    if (!preview.overformulaLine) {
      throw new Error('V6_PREVIEW_MISMATCH: overformula line');
    }
    if (
      plan.overformulaPrimaryBonus != null &&
      plan.overformulaPrimaryBonus > 0 &&
      !preview.overformulaLine.includes(String(plan.overformulaPrimaryBonus))
    ) {
      throw new Error('V6_PREVIEW_MISMATCH: overformula primary bonus');
    }
    if (plan.spendAllFetz && !preview.fetzLine?.includes('0')) {
      throw new Error('V6_PREVIEW_MISMATCH: overformula fetz spend');
    }
  }
  if (
    plan.postFormulaActionLock === 'attack_and_challenge' &&
    !preview.lockLine
  ) {
    throw new Error('V6_PREVIEW_MISMATCH: action lock');
  }
  if (preview.eventSummary !== plan.eventSummary) {
    throw new Error('V6_PREVIEW_MISMATCH: event summary');
  }
}
