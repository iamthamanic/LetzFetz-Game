/**
 * German UI copy for V3 Elementimpuls keyword (cards + combat stage).
 * Location: src/components/cards/impulseKeywordCopy.ts
 */
import type { Element, ElementImpulseKeyword, ImpulseTrigger } from '../../game/types';
import { ELEMENT_LABELS_DE } from '../ui/ElementIcon';

/** Canonical keyword label shown on cards and in combat feedback. */
export const ELEMENTIMPULS_KEYWORD = 'Elementimpuls';

const TRIGGER_LABEL_DE: Record<ImpulseTrigger, string> = {
  onHit: 'bei Treffer',
  onFullBlock: 'bei Vollblock',
};

/** Short chip text: „Elementimpuls · Feuer“. */
export function formatImpulseKeywordChip(kw: ElementImpulseKeyword): string {
  return `${ELEMENTIMPULS_KEYWORD} · ${ELEMENT_LABELS_DE[kw.element]}`;
}

/** Trigger-only phrase for tooltips / subtitles. */
export function formatImpulseTriggerLabel(trigger: ImpulseTrigger): string {
  return TRIGGER_LABEL_DE[trigger];
}

/** Full tooltip line: „Elementimpuls (Feuer) bei Treffer“. */
export function formatImpulseTooltipLine(kw: ElementImpulseKeyword): string {
  return `${ELEMENTIMPULS_KEYWORD} (${ELEMENT_LABELS_DE[kw.element]}) ${TRIGGER_LABEL_DE[kw.trigger]}`;
}

/**
 * Combat feedback when an impulse is created.
 * e.g. „Elementimpuls Feuer (bei Treffer)“ / „Elementimpuls Wasser (bei Vollblock)“
 */
export function formatCombatImpulseFeedback(
  element: Element,
  trigger: ImpulseTrigger,
): string {
  return `${ELEMENTIMPULS_KEYWORD} ${ELEMENT_LABELS_DE[element]} (${TRIGGER_LABEL_DE[trigger]})`;
}

/** Stage hint under an attack card that carries onHit impulse. */
export function formatCombatStageImpulseHint(kw: ElementImpulseKeyword): string {
  if (kw.trigger === 'onHit') {
    return `Treffer → ${ELEMENTIMPULS_KEYWORD} (${ELEMENT_LABELS_DE[kw.element]})`;
  }
  return `Vollblock → ${ELEMENTIMPULS_KEYWORD} (${ELEMENT_LABELS_DE[kw.element]})`;
}

/** Which impulse (if any) fires for a resolved combat outcome. */
export function resolveCombatImpulseFeedback(input: {
  damage: number;
  attackImpulse?: ElementImpulseKeyword | null;
  blockImpulse?: ElementImpulseKeyword | null;
}): string | null {
  if (input.damage > 0 && input.attackImpulse?.trigger === 'onHit') {
    return formatCombatImpulseFeedback(input.attackImpulse.element, 'onHit');
  }
  if (input.damage <= 0 && input.blockImpulse?.trigger === 'onFullBlock') {
    return formatCombatImpulseFeedback(input.blockImpulse.element, 'onFullBlock');
  }
  return null;
}
