import type { GameState, PlayerId, TurnPhase } from '../types';
import { collectInvariantViolations } from '../engine/invariants';
import { cloneState } from '../engine/helpers';

export interface PlaytestPatch {
  phase?: TurnPhase;
  activePlayer?: PlayerId;
  p1Hp?: number;
  p2Hp?: number;
  winner?: PlayerId | null;
  clearCombat?: boolean;
}

export interface PlaytestValidationResult {
  ok: boolean;
  state?: GameState;
  error?: string;
}

/** Apply surgical field patches to a cloned game state. */
export function applyPlaytestPatch(state: GameState, patch: PlaytestPatch): GameState {
  const next = cloneState(state);

  if (patch.phase !== undefined) next.phase = patch.phase;
  if (patch.activePlayer !== undefined) next.activePlayer = patch.activePlayer;
  if (patch.p1Hp !== undefined) next.players.p1.hp = patch.p1Hp;
  if (patch.p2Hp !== undefined) next.players.p2.hp = patch.p2Hp;
  if (patch.winner !== undefined) next.winner = patch.winner;
  if (patch.clearCombat) next.combat = null;

  return next;
}

/** Validate playtest state via engine invariants; returns error message for UI. */
export function validatePlaytestState(state: GameState): PlaytestValidationResult {
  const violations = collectInvariantViolations(state);
  if (violations.length > 0) {
    return {
      ok: false,
      error: violations.map((v) => v.message).join(' · '),
    };
  }
  return { ok: true, state };
}

function validatePatchFields(patch: PlaytestPatch): string | null {
  if (patch.p1Hp !== undefined && !Number.isFinite(patch.p1Hp)) {
    return 'P1 HP muss eine Zahl sein.';
  }
  if (patch.p2Hp !== undefined && !Number.isFinite(patch.p2Hp)) {
    return 'P2 HP muss eine Zahl sein.';
  }
  return null;
}

/** Patch then validate — single entry for UI. */
export function applyAndValidatePlaytestPatch(
  state: GameState,
  patch: PlaytestPatch,
): PlaytestValidationResult {
  const fieldError = validatePatchFields(patch);
  if (fieldError) return { ok: false, error: fieldError };

  const patched = applyPlaytestPatch(state, patch);
  const result = validatePlaytestState(patched);
  if (!result.ok) return result;
  return { ok: true, state: patched };
}

/** Validate a full scenario state before injecting into GameView. */
export function preparePlaytestState(state: GameState): PlaytestValidationResult {
  return validatePlaytestState(state);
}
