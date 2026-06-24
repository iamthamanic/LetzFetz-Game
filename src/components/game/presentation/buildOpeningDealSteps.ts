/**
 * Builds presentation steps for the opening deal (5 + 6 cards, staggered).
 * Location: src/components/game/presentation/buildOpeningDealSteps.ts
 */
import { opponentOf } from '../../../game/engine/createGame';
import { DEFAULT_RULESET } from '../../../game/types/ruleset';
import type { GameState, PlayerId, RulesetConfig } from '../../../game/types';
import type { PresentationStep } from './types';

export const OPENING_DEAL_CARD_MS = 80;

export function buildOpeningDealSteps(
  state: GameState,
  ruleset: RulesetConfig = DEFAULT_RULESET,
): PresentationStep[] {
  const startingPlayer = state.activePlayer;
  const secondPlayer = opponentOf(startingPlayer);

  const startingHand = state.players[startingPlayer].hand;
  const secondHand = state.players[secondPlayer].hand;

  if (
    startingHand.length !== ruleset.p1StartingHand ||
    secondHand.length !== ruleset.p2SecondHand
  ) {
    return [];
  }

  const steps: PresentationStep[] = [];
  let index = 0;

  for (const card of startingHand) {
    steps.push({
      id: `opening-deal-${index}`,
      kind: 'deal-card',
      durationMs: OPENING_DEAL_CARD_MS,
      payload: { playerId: startingPlayer, cardInstanceId: card.instanceId },
    });
    index += 1;
  }

  for (const card of secondHand) {
    steps.push({
      id: `opening-deal-${index}`,
      kind: 'deal-card',
      durationMs: OPENING_DEAL_CARD_MS,
      payload: { playerId: secondPlayer, cardInstanceId: card.instanceId },
    });
    index += 1;
  }

  return steps;
}

export function isOpeningDealStep(step: PresentationStep): boolean {
  return step.kind === 'deal-card' && step.id.startsWith('opening-deal-');
}

export function fullDealRevealCounts(state: GameState): Record<PlayerId, number> {
  return {
    p1: state.players.p1.hand.length,
    p2: state.players.p2.hand.length,
  };
}
