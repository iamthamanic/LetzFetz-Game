/**
 * Builds presentation steps for the opening deal — human + opponent in parallel beats.
 * Location: src/features/play/presentation/buildOpeningDealSteps.ts
 */
import { DEFAULT_RULESET } from '../../../game/types/ruleset';
import type { GameState, PlayerId, RulesetConfig } from '../../../game/types';
import type { PresentationStep } from './types';

/** Per parallel deal beat (one card each side when available). */
export const OPENING_DEAL_CARD_MS = 300;

export type OpeningDealBeat = {
  playerId: PlayerId;
  cardInstanceId: string;
};

export function buildOpeningDealSteps(
  state: GameState,
  _ruleset: RulesetConfig = DEFAULT_RULESET,
): PresentationStep[] {
  // Only animate the true opening deal at match start.
  if (state.turnNumber !== 1 || state.phase !== 'start') return [];

  // Always deal both seats in parallel (p1 = human, p2 = bot in solo).
  const humanHand = state.players.p1.hand;
  const botHand = state.players.p2.hand;

  if (humanHand.length === 0 && botHand.length === 0) return [];

  const steps: PresentationStep[] = [];
  const beats = Math.max(humanHand.length, botHand.length);

  for (let i = 0; i < beats; i += 1) {
    const deals: OpeningDealBeat[] = [];
    if (i < humanHand.length) {
      deals.push({ playerId: 'p1', cardInstanceId: humanHand[i].instanceId });
    }
    if (i < botHand.length) {
      deals.push({ playerId: 'p2', cardInstanceId: botHand[i].instanceId });
    }
    steps.push({
      id: `opening-deal-${i}`,
      kind: 'deal-card',
      durationMs: OPENING_DEAL_CARD_MS,
      locksInput: true,
      payload: { deals },
    });
  }

  return steps;
}

export function isOpeningDealStep(step: PresentationStep): boolean {
  return step.kind === 'deal-card' && step.id.startsWith('opening-deal-');
}

/** Normalize deal payload (parallel `deals` or legacy single card). */
export function openingDealBeats(step: PresentationStep): OpeningDealBeat[] {
  const deals = step.payload?.deals as OpeningDealBeat[] | undefined;
  if (Array.isArray(deals) && deals.length > 0) return deals;

  const playerId = step.payload?.playerId as PlayerId | undefined;
  const cardInstanceId = step.payload?.cardInstanceId as string | undefined;
  if (playerId && cardInstanceId) return [{ playerId, cardInstanceId }];
  return [];
}

export function fullDealRevealCounts(state: GameState): Record<PlayerId, number> {
  return {
    p1: state.players.p1.hand.length,
    p2: state.players.p2.hand.length,
  };
}
