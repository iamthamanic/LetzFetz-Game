/**
 * V3/V5 status / mark / shield model.
 * Location: src/game/types/status.ts
 * V5 display names (Verwirbelt / Verstrahlt) map via PRIMARY_MARK_LABEL_DE;
 * engine ids stay `aufgewirbelt` / `erleuchtet` for save/compat.
 */

/** All status ids used by the combat layer. */
export type StatusId =
  | 'brennen'
  | 'durchnaesst'
  | 'high'
  | 'aufgewirbelt'
  | 'erleuchtet'
  | 'verflucht'
  | 'nebel'
  | 'dichter_nebel'
  | 'nebelbank'
  | 'verpeilt'
  | 'geblendet'
  | 'gift'
  | 'toxisch'
  | 'ueberflutet'
  | 'fokus'
  | 'ausgeblendet'
  | 'heilblockade'
  | 'katalysatorausfall'
  | 'stabilitaetsbruch';

/** Primary element marks (V5 §18 / legacy V3 §6). */
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
  nebelbank: 1,
  verpeilt: 1,
  geblendet: 1,
  gift: 3,
  toxisch: 1,
  ueberflutet: 1,
  fokus: 1,
  ausgeblendet: 1,
  heilblockade: 1,
  katalysatorausfall: 1,
  stabilitaetsbruch: 1,
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

/** V5 German labels for primary marks (spielkonzept §18). */
export const PRIMARY_MARK_LABEL_DE: Record<PrimaryMarkId, string> = {
  brennen: 'Brennen',
  durchnaesst: 'Durchnässt',
  high: 'High',
  aufgewirbelt: 'Verwirbelt',
  erleuchtet: 'Verstrahlt',
  verflucht: 'Verflucht',
};

export function primaryMarkLabelDe(id: PrimaryMarkId): string {
  return PRIMARY_MARK_LABEL_DE[id];
}

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
