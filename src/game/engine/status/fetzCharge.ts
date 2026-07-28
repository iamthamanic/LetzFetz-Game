/**
 * Shared Fetzgerät charge pool (V3 §12 — max 6).
 * Location: src/game/engine/status/fetzCharge.ts
 */
import type { GameState, PlayerId } from '../../types';
import { cloneState } from '../helpers';

export const MAX_FETZ_CHARGE = 6;

export function clampFetzCharge(n: number): number {
  return Math.max(0, Math.min(MAX_FETZ_CHARGE, Math.floor(n)));
}

export function getFetzCharge(state: GameState, playerId: PlayerId): number {
  return clampFetzCharge(state.players[playerId].fetzCharge ?? 0);
}

export function gainFetzCharge(
  state: GameState,
  playerId: PlayerId,
  amount: number,
): GameState {
  if (amount <= 0) return state;
  const next = cloneState(state);
  next.players[playerId].fetzCharge = clampFetzCharge(
    getFetzCharge(next, playerId) + amount,
  );
  return next;
}

export function spendFetzCharge(
  state: GameState,
  playerId: PlayerId,
  amount: number,
): GameState {
  if (amount <= 0) return state;
  const have = getFetzCharge(state, playerId);
  if (have < amount) {
    throw new Error('Nicht genug Ladung');
  }
  const next = cloneState(state);
  next.players[playerId].fetzCharge = clampFetzCharge(have - amount);
  return next;
}

export function canSpendFetzCharge(
  state: GameState,
  playerId: PlayerId,
  amount: number,
): boolean {
  return getFetzCharge(state, playerId) >= amount;
}
