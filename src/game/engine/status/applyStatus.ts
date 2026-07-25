/**
 * Apply / remove / query V3 statuses on a player (immutable helpers).
 * Location: src/game/engine/status/applyStatus.ts
 */
import type { GameState, PlayerId, StatusId, StatusInstance } from '../../types';
import { STATUS_STACK_LIMIT, clampShield, clampStatusStacks } from '../../types';
import { cloneState } from '../helpers';

export function getStatus(
  state: GameState,
  playerId: PlayerId,
  id: StatusId,
): StatusInstance | undefined {
  return (state.players[playerId].statuses ?? []).find((s) => s.id === id);
}

export function hasStatus(state: GameState, playerId: PlayerId, id: StatusId): boolean {
  return getStatus(state, playerId, id) !== undefined;
}

/**
 * Add or increase a status. High would-be 4th stack → clear High, apply Verpeilt (§6.3).
 * Does not trigger element reactions.
 */
export function applyStatus(
  state: GameState,
  playerId: PlayerId,
  id: StatusId,
  stacks = 1,
): GameState {
  const next = cloneState(state);
  const player = next.players[playerId];
  const list = [...(player.statuses ?? [])];
  const idx = list.findIndex((s) => s.id === id);
  const add = Math.max(1, Math.floor(stacks));

  if (id === 'high') {
    const current = idx >= 0 ? list[idx].stacks : 0;
    if (current + add > STATUS_STACK_LIMIT.high) {
      const withoutHigh = list.filter((s) => s.id !== 'high');
      const verpeiltIdx = withoutHigh.findIndex((s) => s.id === 'verpeilt');
      if (verpeiltIdx >= 0) {
        withoutHigh[verpeiltIdx] = { id: 'verpeilt', stacks: 1 };
      } else {
        withoutHigh.push({ id: 'verpeilt', stacks: 1 });
      }
      player.statuses = withoutHigh;
      return next;
    }
  }

  if (idx >= 0) {
    list[idx] = {
      id,
      stacks: clampStatusStacks(id, list[idx].stacks + add),
    };
  } else {
    list.push({ id, stacks: clampStatusStacks(id, add) });
  }
  player.statuses = list;
  return next;
}

export function removeStatus(
  state: GameState,
  playerId: PlayerId,
  id: StatusId,
): GameState {
  const next = cloneState(state);
  next.players[playerId].statuses = (next.players[playerId].statuses ?? []).filter(
    (s) => s.id !== id,
  );
  return next;
}

export function setShield(state: GameState, playerId: PlayerId, amount: number): GameState {
  const next = cloneState(state);
  next.players[playerId].shield = clampShield(amount);
  return next;
}

export function addShield(state: GameState, playerId: PlayerId, amount: number): GameState {
  if (state.meta.v3BlockShieldThisAction) {
    return state;
  }
  const current = state.players[playerId].shield ?? 0;
  return setShield(state, playerId, current + amount);
}
