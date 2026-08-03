/**
 * V6 Constructs — place, Startphase Haltbarkeit tick, challenge resolve.
 * Location: src/game/engine/v6/constructs.ts
 *
 * spielkonzept §8 step 5, §41–42. Not equipment / formula / Fetz.
 */
import type { ConstructInstance, GameState, PlayerId } from '../../types';
import { getV6ConstructDef } from '../../../content/v6/cards/playtestConstructCards';
import { formulaChallengeOutcome, type FormulaChallengeOutcome } from '../formulaChallenge';
import { cloneState } from '../helpers';
import { nextInstanceId } from '../deck';

export type ConstructChallengeOutcome = FormulaChallengeOutcome;

export function constructDisplayName(defId: string): string {
  return getV6ConstructDef(defId)?.name ?? defId;
}

/** Discard current construct (if any) to the shared discard pile. */
function discardPlayerConstruct(state: GameState, playerId: PlayerId): GameState {
  const current = state.players[playerId].construct;
  if (!current) return state;
  const next = cloneState(state);
  next.piles.discard.push({ instanceId: current.instanceId, defId: current.defId });
  next.players[playerId].construct = null;
  return next;
}

/**
 * Place a construct; replaces any existing one immediately (old discarded).
 * Haltbarkeit is the recipe primary value (clamped ≥ 1).
 */
export function placeConstruct(
  state: GameState,
  playerId: PlayerId,
  defId: string,
  haltbarkeit: number,
): GameState {
  let next = discardPlayerConstruct(state, playerId);
  next = cloneState(next);
  const instance: ConstructInstance = {
    instanceId: nextInstanceId(),
    defId,
    haltbarkeit: Math.max(1, Math.floor(haltbarkeit)),
    disturbed: false,
  };
  next.players[playerId].construct = instance;
  return next;
}

/**
 * §8 step 5 — owner Startphase: clear disturbed, Haltbarkeit −1; discard at 0.
 */
export function tickV6ConstructAtStart(state: GameState, playerId: PlayerId): GameState {
  const current = state.players[playerId].construct;
  if (!current) return state;

  const next = cloneState(state);
  const name = constructDisplayName(current.defId);
  const after = current.haltbarkeit - 1;

  if (after <= 0) {
    next.piles.discard.push({ instanceId: current.instanceId, defId: current.defId });
    next.players[playerId].construct = null;
    const prefix = next.lastEvent ? `${next.lastEvent} · ` : '';
    next.lastEvent = `${prefix}Konstrukt ${name} zerfällt (Haltbarkeit 0).`;
    return next;
  }

  next.players[playerId].construct = {
    ...current,
    haltbarkeit: after,
    disturbed: false,
  };
  const prefix = next.lastEvent ? `${next.lastEvent} · ` : '';
  next.lastEvent = `${prefix}Konstrukt ${name}: Haltbarkeit −1 (jetzt ${after}).`;
  return next;
}

export function constructChallengeOutcome(
  attackValue: number,
  haltbarkeit: number,
  blockValue: number,
  alreadyDisturbed: boolean,
): ConstructChallengeOutcome {
  return formulaChallengeOutcome(attackValue, haltbarkeit + blockValue, alreadyDisturbed);
}

/** Apply stören / zerstören; no life damage. */
export function applyConstructChallengeOutcome(
  state: GameState,
  defenderId: PlayerId,
  attackValue: number,
  defense: number,
  outcome: ConstructChallengeOutcome,
): GameState {
  const construct = state.players[defenderId].construct;
  if (!construct) return state;

  const next = cloneState(state);
  const name = constructDisplayName(construct.defId);

  if (outcome === 'destroy') {
    next.piles.discard.push({ instanceId: construct.instanceId, defId: construct.defId });
    next.players[defenderId].construct = null;
    next.lastEvent = `Herausforderung — ${name} zerstört (${attackValue} vs ${defense}).`;
    return next;
  }

  if (outcome === 'disturb') {
    next.players[defenderId].construct = { ...construct, disturbed: true };
    next.lastEvent = `Herausforderung — ${name} gestört (${attackValue} vs ${defense}).`;
    return next;
  }

  next.lastEvent = `Herausforderung wirkungslos (${attackValue} vs ${defense}).`;
  return next;
}
