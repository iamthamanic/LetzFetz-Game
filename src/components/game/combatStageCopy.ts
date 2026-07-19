/**
 * German UI copy for the playmat combat stage.
 * Location: src/components/game/combatStageCopy.ts
 */
import type { PendingCombat } from '../../game/types';

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
): string {
  if (isHumanDefender) {
    return 'Spiele eine Block-Karte oder passe — gewürfelt wird erst danach.';
  }
  if (botThinking) return 'Gegner entscheidet über Block…';
  return 'Warte auf die Verteidigungsentscheidung…';
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
