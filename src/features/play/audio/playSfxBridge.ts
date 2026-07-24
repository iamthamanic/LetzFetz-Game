/**
 * Play presentation / match-flow → typed SoundId mapping.
 * Location: src/features/play/audio/playSfxBridge.ts
 *
 * Callers use audioManager only; no hardcoded /audio paths. No hover SFX.
 */
import { audioManager } from '../../../services/audio/audioManager';
import type { SoundId } from '../../../services/audio/types';
import type { PresentationStep } from '../presentation/types';

const DEFAULT_COOLDOWN_MS = 140;
const INVALID_COOLDOWN_MS = 320;
const MATCH_END_COOLDOWN_MS = 2000;

/** Map presentation step kind → sound at step start (impact/fly-in). */
export function soundIdForPresentationStart(kind: string): SoundId | null {
  switch (kind) {
    case 'deal-card':
    case 'draw-card':
      return 'card.draw';
    case 'build-snap':
      return 'card.play';
    case 'activate-discard':
      return 'card.discard';
    case 'attack-card-fly':
      return 'combat.attack';
    case 'instant-glitch-reveal':
      return 'card.reveal';
    case 'combat-resolve':
      return 'dice.roll';
    case 'damage-hit':
      return 'combat.damage.light';
    default:
      return null;
  }
}

export function playPresentationStepStart(step: PresentationStep): void {
  const id = soundIdForPresentationStart(step.kind);
  if (!id) return;
  audioManager.playWithCooldown(id, DEFAULT_COOLDOWN_MS);
}

export function playDiceRoll(): void {
  audioManager.playWithCooldown('dice.roll', DEFAULT_COOLDOWN_MS);
}

export function playDiceSettle(): void {
  audioManager.playWithCooldown('dice.settle', DEFAULT_COOLDOWN_MS);
}

export function playInvalidAction(): void {
  audioManager.playWithCooldown('ui.invalid', INVALID_COOLDOWN_MS);
}

export function playRoundStart(): void {
  audioManager.playWithCooldown('round.start', 600);
}

export function playMatchOutcome(humanWon: boolean): void {
  audioManager.playWithCooldown(
    humanWon ? 'match.victory' : 'match.defeat',
    MATCH_END_COOLDOWN_MS,
  );
}

export function playCombatAttack(): void {
  audioManager.playWithCooldown('combat.attack', DEFAULT_COOLDOWN_MS);
}

export function playCombatBlock(withDamage: boolean): void {
  if (withDamage) {
    audioManager.playWithCooldown('combat.block', 80);
    window.setTimeout(() => {
      audioManager.playWithCooldown('combat.damage.light', 80);
    }, 60);
    return;
  }
  audioManager.playWithCooldown('combat.block', DEFAULT_COOLDOWN_MS);
}
