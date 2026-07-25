/**
 * V3 status ticks and §18 conflict helpers.
 * Location: src/game/engine/status/tickStatuses.ts
 */
import type { GameState, PlayerId, RulesetConfig } from '../../types';
import { isV3CombatEnabled } from '../../types';
import { cloneState } from '../helpers';
import { applyDamageThroughShield } from './shield';
import { getStatus, removeStatus, applyStatus } from './applyStatus';

/** After a completed Hauptaktion: Brennen deals 1 and loses 1 stack (§6.1). */
export function tickBrennenAfterMainAction(
  state: GameState,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  if (!isV3CombatEnabled(ruleset)) return state;
  const brennen = getStatus(state, playerId, 'brennen');
  if (!brennen) return state;

  let next = applyDamageThroughShield(state, playerId, 1, ruleset).state;
  if (brennen.stacks <= 1) {
    next = removeStatus(next, playerId, 'brennen');
  } else {
    next = removeStatus(next, playerId, 'brennen');
    next = applyStatus(next, playerId, 'brennen', brennen.stacks - 1);
  }
  next = cloneState(next);
  next.lastEvent = `${next.lastEvent ?? ''} Brennen tick.`.trim();
  return next;
}

/**
 * End-of-turn status order §18 (Gift after Brennen-on-main-action):
 * Gift → (heal/regen hooks later) → status decay hooks.
 */
export function tickStatusesEndOfTurn(
  state: GameState,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  if (!isV3CombatEnabled(ruleset)) return state;
  let next = cloneState(state);
  next.meta = { ...next.meta, v3BlockShieldThisAction: false };

  const gift = getStatus(next, playerId, 'gift');
  if (gift) {
    next = applyDamageThroughShield(next, playerId, gift.stacks, ruleset).state;
    if (gift.stacks <= 1) {
      next = removeStatus(next, playerId, 'gift');
    } else {
      next = removeStatus(next, playerId, 'gift');
      next = applyStatus(next, playerId, 'gift', gift.stacks - 1);
    }
    next = cloneState(next);
    next.lastEvent = `${next.lastEvent ?? ''} Gift tick.`.trim();
  }

  return next;
}

/** Nebel: ignore printed element + secondary on next attack/block (§7.1 / §18). */
export function consumeNebelIfPresent(
  state: GameState,
  playerId: PlayerId,
): { state: GameState; ignoreElementAndSecondary: boolean } {
  if (!getStatus(state, playerId, 'nebel') && !getStatus(state, playerId, 'dichter_nebel')) {
    return { state, ignoreElementAndSecondary: false };
  }
  let next = state;
  if (getStatus(next, playerId, 'dichter_nebel')) {
    next = removeStatus(next, playerId, 'dichter_nebel');
  } else {
    next = removeStatus(next, playerId, 'nebel');
  }
  return { state: next, ignoreElementAndSecondary: true };
}

/** Verpeilt: ignore next secondary effect only (§7.3 / §18). */
export function consumeVerpeiltIfPresent(
  state: GameState,
  playerId: PlayerId,
): { state: GameState; ignoreSecondary: boolean } {
  if (!getStatus(state, playerId, 'verpeilt')) {
    return { state, ignoreSecondary: false };
  }
  return { state: removeStatus(state, playerId, 'verpeilt'), ignoreSecondary: true };
}

/**
 * Geblendet blocks all dice manipulation; Fokus is retained (§18).
 */
export function canManipulateDice(state: GameState, playerId: PlayerId): boolean {
  return !getStatus(state, playerId, 'geblendet');
}

/** Consume Geblendet after a dice roll that was locked. */
export function consumeGeblendetAfterRoll(
  state: GameState,
  playerId: PlayerId,
): GameState {
  if (!getStatus(state, playerId, 'geblendet')) return state;
  return removeStatus(state, playerId, 'geblendet');
}

/** Spend Fokus for a free reroll if Geblendet is not blocking. */
export function tryConsumeFokusReroll(
  state: GameState,
  playerId: PlayerId,
): { state: GameState; granted: boolean } {
  if (!canManipulateDice(state, playerId)) {
    return { state, granted: false };
  }
  if (!getStatus(state, playerId, 'fokus')) {
    return { state, granted: false };
  }
  return { state: removeStatus(state, playerId, 'fokus'), granted: true };
}
