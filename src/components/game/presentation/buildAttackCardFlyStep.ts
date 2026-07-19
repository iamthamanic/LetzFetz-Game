/**
 * Presentation step for a played attack/challenge card flying from hand to combat.
 * Location: src/components/game/presentation/buildAttackCardFlyStep.ts
 */
import type { GameState, PlayerId } from '../../../game/types';
import type { PresentationStep } from './types';

export const ATTACK_CARD_FLY_MS = 480;

export interface AttackCardFlyPayload {
  playerId: PlayerId;
  cardInstanceId: string;
  cardDefId: string;
  mode: 'direct' | 'challenge';
  targetSlotIndex?: number;
}

export function buildAttackCardFlyStep(
  playerId: PlayerId,
  cardInstanceId: string,
  cardDefId: string,
  mode: 'direct' | 'challenge',
  targetSlotIndex?: number,
): PresentationStep {
  return {
    id: `attack-card-fly-${cardInstanceId}`,
    kind: 'attack-card-fly',
    durationMs: ATTACK_CARD_FLY_MS,
    locksInput: true,
    payload: {
      playerId,
      cardInstanceId,
      cardDefId,
      mode,
      targetSlotIndex,
    } satisfies AttackCardFlyPayload as Record<string, unknown>,
  };
}

export function isAttackCardFlyStep(step: PresentationStep): boolean {
  return step.kind === 'attack-card-fly';
}

/** Card removed from attacker hand when combat opens (for fly VFX). */
export function findRemovedAttackCard(
  prev: GameState,
  next: GameState,
): { instanceId: string; defId: string; attackerId: PlayerId } | null {
  if (!next.combat) return null;
  const attackerId = next.combat.attackerId;
  const nextIds = new Set(next.players[attackerId].hand.map((c) => c.instanceId));
  const removed = prev.players[attackerId].hand.filter((c) => !nextIds.has(c.instanceId));
  const match =
    removed.find((c) => c.defId === next.combat!.attackCardDefId) ?? removed[0];
  if (!match) return null;
  return { instanceId: match.instanceId, defId: match.defId, attackerId };
}
