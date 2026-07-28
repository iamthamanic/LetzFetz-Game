/**
 * German UI copy for the playmat combat stage.
 * Location: src/features/play/board/combatStageCopy.ts
 */
import type { ElementCardDef, PendingCombat } from '../../../game/types';
import { formatCombatStageImpulseHint } from '../../../components/cards/impulseKeywordCopy';

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
