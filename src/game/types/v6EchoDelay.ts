/**
 * V6 Echo / Delay queue entry shapes (match meta).
 * Location: src/game/types/v6EchoDelay.ts
 */
export type V6QueuedPrimaryKind =
  | 'damage'
  | 'heal'
  | 'shield'
  | 'prep_attack'
  | 'prep_block'
  | 'prep_boost'
  | 'fessel';

export interface V6QueuedPrimary {
  recipeId: string;
  recipeName: string;
  kind: V6QueuedPrimaryKind;
  value: number;
  target: 'opponent' | 'self';
  offensive: boolean;
  catalystInstanceId: string | null;
}

export interface V6EchoQueueEntry extends V6QueuedPrimary {
  echoAmount: number;
}

export type V6DelayQueueEntry = V6QueuedPrimary;
