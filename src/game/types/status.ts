/**
 * V3 status / mark / shield model (SPIELANLEITUNG_V3_WIP + dump §6–§7 §19).
 * Location: src/game/types/status.ts
 */

/** All status ids used by the V3 combat layer. */
export type StatusId =
  | 'brennen'
  | 'durchnaesst'
  | 'high'
  | 'aufgewirbelt'
  | 'erleuchtet'
  | 'verflucht'
  | 'nebel'
  | 'dichter_nebel'
  | 'verpeilt'
  | 'geblendet'
  | 'gift'
  | 'ueberflutet'
  | 'fokus'
  | 'ausgeblendet';

/** Primary element marks (V3 §2.3 / §6). */
export type PrimaryMarkId =
  | 'brennen'
  | 'durchnaesst'
  | 'high'
  | 'aufgewirbelt'
  | 'erleuchtet'
  | 'verflucht';

export interface StatusInstance {
  id: StatusId;
  stacks: number;
}

/** Max stacks per status; 1 = non-stackable. Shield is separate (max 5). */
export const STATUS_STACK_LIMIT: Record<StatusId, number> = {
  brennen: 3,
  durchnaesst: 1,
  high: 3,
  aufgewirbelt: 1,
  erleuchtet: 1,
  verflucht: 3,
  nebel: 1,
  dichter_nebel: 1,
  verpeilt: 1,
  geblendet: 1,
  gift: 3,
  ueberflutet: 1,
  fokus: 1,
  ausgeblendet: 1,
};

export const MAX_SHIELD = 5;

export const PRIMARY_MARK_IDS: readonly PrimaryMarkId[] = [
  'brennen',
  'durchnaesst',
  'high',
  'aufgewirbelt',
  'erleuchtet',
  'verflucht',
] as const;

export function isStatusId(value: unknown): value is StatusId {
  return typeof value === 'string' && value in STATUS_STACK_LIMIT;
}

/** Clamp stacks to the status limit (never below 1 for an existing instance). */
export function clampStatusStacks(id: StatusId, stacks: number): number {
  const max = STATUS_STACK_LIMIT[id];
  return Math.max(1, Math.min(max, Math.floor(stacks)));
}

export function clampShield(shield: number): number {
  return Math.max(0, Math.min(MAX_SHIELD, Math.floor(shield)));
}
