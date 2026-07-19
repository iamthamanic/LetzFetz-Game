/**
 * Pure initiative rules — higher W6 starts; tie must re-roll.
 * Location: src/game/engine/initiative.ts
 */
import type { PlayerId } from '../types';

export type InitiativeResult =
  | { outcome: 'p1' | 'p2'; humanRoll: number; botRoll: number }
  | { outcome: 'tie'; humanRoll: number; botRoll: number };

export function resolveInitiative(humanRoll: number, botRoll: number): InitiativeResult {
  const h = clampW6(humanRoll);
  const b = clampW6(botRoll);
  if (h > b) return { outcome: 'p1', humanRoll: h, botRoll: b };
  if (b > h) return { outcome: 'p2', humanRoll: h, botRoll: b };
  return { outcome: 'tie', humanRoll: h, botRoll: b };
}

export function startingPlayerFromInitiative(result: InitiativeResult): PlayerId | null {
  if (result.outcome === 'tie') return null;
  return result.outcome;
}

function clampW6(n: number): number {
  return Math.max(1, Math.min(6, Math.round(n)));
}
