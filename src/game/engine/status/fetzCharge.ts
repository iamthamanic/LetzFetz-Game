/**
 * Shared Fetzgerät / V5 Fetzladung charge pool.
 * Location: src/game/engine/status/fetzCharge.ts
 */
import type { GameState, PlayerId } from '../../types';
import { cloneState } from '../helpers';

/** V3 Fetzgerät pool maximum. */
export const MAX_FETZ_CHARGE = 6;

export function clampFetzCharge(n: number, maxCharge = MAX_FETZ_CHARGE): number {
  return Math.max(0, Math.min(maxCharge, Math.floor(n)));
}

export function getFetzCharge(
  state: GameState,
  playerId: PlayerId,
  maxCharge = MAX_FETZ_CHARGE,
): number {
  return clampFetzCharge(state.players[playerId].fetzCharge ?? 0, maxCharge);
}

export function gainFetzCharge(
  state: GameState,
  playerId: PlayerId,
  amount: number,
  maxCharge = MAX_FETZ_CHARGE,
): GameState {
  if (amount <= 0) return state;
  const next = cloneState(state);
  next.players[playerId].fetzCharge = clampFetzCharge(
    getFetzCharge(next, playerId, maxCharge) + amount,
    maxCharge,
  );
  return next;
}

export function spendFetzCharge(
  state: GameState,
  playerId: PlayerId,
  amount: number,
  maxCharge = MAX_FETZ_CHARGE,
): GameState {
  if (amount <= 0) return state;
  const have = getFetzCharge(state, playerId, maxCharge);
  if (have < amount) {
    throw new Error('Nicht genug Ladung');
  }
  const next = cloneState(state);
  next.players[playerId].fetzCharge = clampFetzCharge(have - amount, maxCharge);
  return next;
}

export function canSpendFetzCharge(
  state: GameState,
  playerId: PlayerId,
  amount: number,
  maxCharge = MAX_FETZ_CHARGE,
): boolean {
  return getFetzCharge(state, playerId, maxCharge) >= amount;
}
