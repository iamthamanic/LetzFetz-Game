/**
 * Presentation step: character hit when life is lost (center VFX + LP countdown).
 * Location: src/features/play/presentation/buildDamageHitStep.ts
 */
import type { GameState, PlayerId } from '../../../game/types';
import type { PresentationStep } from './types';

/** Full beat: appear → red shimmer/hit → LP countdown. */
export const DAMAGE_HIT_MS = 2400;

export interface DamageHitPayload {
  playerId: PlayerId;
  characterId: string;
  fromHp: number;
  toHp: number;
  amount: number;
}

export function buildDamageHitStep(payload: DamageHitPayload): PresentationStep {
  return {
    id: `damage-hit-${payload.playerId}-${payload.fromHp}-${payload.toHp}`,
    kind: 'damage-hit',
    durationMs: DAMAGE_HIT_MS,
    locksInput: true,
    payload: { ...payload } as unknown as Record<string, unknown>,
  };
}

export function buildDamageHitSteps(prev: GameState, next: GameState): PresentationStep[] {
  const steps: PresentationStep[] = [];
  for (const playerId of ['p1', 'p2'] as PlayerId[]) {
    const fromHp = prev.players[playerId].hp;
    const toHp = next.players[playerId].hp;
    if (toHp >= fromHp) continue;
    steps.push(
      buildDamageHitStep({
        playerId,
        characterId: next.players[playerId].characterId,
        fromHp,
        toHp,
        amount: fromHp - toHp,
      }),
    );
  }
  return steps;
}

export function isDamageHitStep(step: PresentationStep): boolean {
  return step.kind === 'damage-hit';
}

export function findHpLosses(
  prev: GameState,
  next: GameState,
): Array<{ playerId: PlayerId; fromHp: number; toHp: number; amount: number }> {
  return (['p1', 'p2'] as PlayerId[])
    .map((playerId) => {
      const fromHp = prev.players[playerId].hp;
      const toHp = next.players[playerId].hp;
      return { playerId, fromHp, toHp, amount: fromHp - toHp };
    })
    .filter((row) => row.amount > 0);
}
