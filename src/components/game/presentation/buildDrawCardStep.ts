/**
 * Single draw-phase presentation step (deck → optional center reveal → hand).
 * Location: src/components/game/presentation/buildDrawCardStep.ts
 */
import type { GameState, PlayerId } from '../../../game/types';
import type { PresentationStep } from './types';

/** Center face-up hold for the human draw. */
export const DRAW_CARD_REVEAL_MS = 1800;
/** Flight from center into the hand fan. */
export const DRAW_CARD_FLY_MS = 520;
/** Total human draw presentation (reveal + fly). */
export const DRAW_CARD_MS = DRAW_CARD_REVEAL_MS + DRAW_CARD_FLY_MS;
/** Bot / hidden draw — face-down fly only. */
export const DRAW_CARD_HIDDEN_MS = 280;

export type BuildDrawCardStepOptions = {
  locksInput?: boolean;
  /** When set with faceUp, UI shows the card face in the center first. */
  cardDefId?: string;
  /** Human draws: face-up reveal then fly. Bot: face-down fly. */
  faceUp?: boolean;
};

export function buildDrawCardStep(
  playerId: PlayerId,
  cardInstanceId: string,
  options: BuildDrawCardStepOptions = {},
): PresentationStep {
  const faceUp = Boolean(options.faceUp && options.cardDefId);
  return {
    id: `draw-card-${cardInstanceId}`,
    kind: 'draw-card',
    durationMs: faceUp ? DRAW_CARD_MS : DRAW_CARD_HIDDEN_MS,
    locksInput: options.locksInput ?? true,
    payload: {
      playerId,
      cardInstanceId,
      cardDefId: options.cardDefId,
      faceUp,
    },
  };
}

export function isDrawCardStep(step: PresentationStep): boolean {
  return step.kind === 'draw-card';
}

/** Returns the instance id of a single card added to a player's hand, if any. */
export function findNewlyDrawnCard(
  prev: GameState,
  next: GameState,
  playerId: PlayerId,
): string | null {
  const prevIds = new Set(prev.players[playerId].hand.map((c) => c.instanceId));
  const added = next.players[playerId].hand.filter((c) => !prevIds.has(c.instanceId));
  if (added.length === 0) return null;
  return added[added.length - 1].instanceId;
}
