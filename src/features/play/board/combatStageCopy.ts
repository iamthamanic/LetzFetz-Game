/**
 * German UI copy for the playmat combat stage.
 * Location: src/features/play/board/combatStageCopy.ts
 */
import type { ElementCardDef, PendingCombat } from '../../../game/types';
import { formatCombatStageImpulseHint } from '../../../components/cards/impulseKeywordCopy';

/** Dump §10 attack kinds we can distinguish from card defs today. */
export type CombatAttackKind = 'normal' | 'element' | 'status' | 'reaction';

export function classifyCombatAttackKind(
  attackDef?: ElementCardDef | null,
): CombatAttackKind | null {
  if (!attackDef) return null;
  if (attackDef.elementImpulse) return 'element';
  const text = `${attackDef.instantText} ${attackDef.boundText ?? ''}`.toLowerCase();
  if (text.includes('reaktion')) return 'reaction';
  if (
    text.includes('status') ||
    text.includes('marke') ||
    text.includes('brennen') ||
    text.includes('gift')
  ) {
    return 'status';
  }
  if (attackDef.cardType === 'attack') return 'normal';
  return null;
}

const ATTACK_KIND_LABEL_DE: Record<CombatAttackKind, string> = {
  normal: 'Normalangriff',
  element: 'Elementangriff',
  status: 'Statusangriff',
  reaction: 'Reaktionsangriff',
};

/** Visible §10 type line; null when kind cannot be distinguished. */
export function buildCombatStageAttackTypeLine(
  attackDef?: ElementCardDef | null,
): string | null {
  const kind = classifyCombatAttackKind(attackDef);
  if (!kind) return null;
  return `Angriffsart: ${ATTACK_KIND_LABEL_DE[kind]}`;
}

export function buildCombatStageTitle(
  combat: PendingCombat,
  isHumanDefender: boolean,
): string {
  if (isHumanDefender) {
    return combat.mode === 'challenge' ? '🛡️ Herausforderung blocken' : '🛡️ Angriff blocken';
  }
  return combat.mode === 'challenge' ? '⚔️ Herausforderung' : '⚔️ Angriff';
}

export function buildCombatStageSubtitle(
  isHumanDefender: boolean,
  botThinking: boolean,
  attackDef?: ElementCardDef | null,
): string {
  const impulseHint =
    attackDef?.elementImpulse?.trigger === 'onHit'
      ? formatCombatStageImpulseHint(attackDef.elementImpulse)
      : null;

  if (isHumanDefender) {
    const base = 'Spiele eine Block-Karte oder passe — gewürfelt wird erst danach.';
    return impulseHint ? `${base} ${impulseHint}.` : base;
  }
  if (botThinking) {
    return impulseHint
      ? `Gegner entscheidet über Block… ${impulseHint}.`
      : 'Gegner entscheidet über Block…';
  }
  return impulseHint
    ? `Warte auf die Verteidigungsentscheidung… ${impulseHint}.`
    : 'Warte auf die Verteidigungsentscheidung…';
}

export function combatValueLabel(combat: PendingCombat): string {
  return combat.mode === 'challenge' ? 'Herausforderungswert' : 'Angriffswert';
}

export function defenderValueLabel(combat: PendingCombat): string {
  return combat.mode === 'challenge' ? 'Block vs. Ziel' : 'Blockwert';
}

export function defenderPendingValue(isHumanDefender: boolean, botThinking: boolean): string {
  if (isHumanDefender) return '?';
  if (botThinking) return '…';
  return '—';
}

/** Visible impulse line under the attack card on the combat stage. */
export function buildCombatStageImpulseLine(
  attackDef?: ElementCardDef | null,
): string | null {
  if (!attackDef?.elementImpulse) return null;
  return formatCombatStageImpulseHint(attackDef.elementImpulse);
}
