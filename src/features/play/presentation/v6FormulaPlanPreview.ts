/**
 * Maps engine FormulaActivationPlan → German preview lines (no second calculator).
 * Location: src/features/play/presentation/v6FormulaPlanPreview.ts
 */
import type { FormulaActivationPlan } from '../../../game/engine/v6';

export interface V6FormulaPreviewLines {
  title: string;
  primaryLine: string;
  catalystLine: string | null;
  fetzLine: string | null;
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
  };
  const targetDe = plan.primary.target === 'opponent' ? 'Gegner' : 'Du';
  const intensityNote =
    plan.intensity != null && plan.intensity > 0
      ? ` · Intensität ${plan.intensity}`
      : '';
  return {
    title: plan.name,
    primaryLine: `${primaryKindDe[plan.primary.kind] ?? plan.primary.kind} ${plan.primary.value} → ${targetDe}${intensityNote}`,
    catalystLine: plan.catalystConsumed
      ? 'Dieser Katalysator wird verbraucht (Ablage).'
      : null,
    fetzLine:
      plan.fetzDelta > 0
        ? `+${plan.fetzDelta} Fetzladung`
        : plan.spendAllFetz
          ? 'Überformel: Fetzladung wird auf 0 gesetzt'
          : null,
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
  if (plan.catalystConsumed && !preview.catalystLine) {
    throw new Error('V6_PREVIEW_MISMATCH: catalyst consumption');
  }
  if (plan.fetzDelta > 0 && !preview.fetzLine?.includes(String(plan.fetzDelta))) {
    throw new Error('V6_PREVIEW_MISMATCH: fetz');
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
