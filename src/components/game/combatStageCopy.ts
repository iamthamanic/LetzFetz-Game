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
    return 'Wähle eine Block-Karte oder lass den Angriff durch.';
  }
  if (botThinking) return '🤖 Gegner blockt…';
  return 'Warte auf Gegenwehr…';
}

export function combatValueLabel(combat: PendingCombat): string {
  return combat.mode === 'challenge' ? 'Herausforderungswert' : 'Angriffswert';
}
