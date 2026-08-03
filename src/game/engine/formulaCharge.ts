/**
 * V5 Fetzladung + Großformel aftermath (§11.6).
 * Location: src/game/engine/formulaCharge.ts
 */
import type { FormulaBoard, FormulaComponentInstance, GameState, PlayerId } from '../types';
import { cloneState } from './helpers';

const SLOTS = ['technik', 'essenz', 'katalysator'] as const;

/** Occupied formula slots (any component, including exhausted/disturbed). */
export function countFilledFormulaSlots(board: FormulaBoard): number {
  return SLOTS.filter((slot) => board[slot] != null).length;
}

/**
 * True when at least two slots are filled and ≥1 component is upright and activatable (#260).
 * Missing role contributes no effect during resolve.
 */
export function isFormulaResolvable(board: FormulaBoard): boolean {
  if (countFilledFormulaSlots(board) < 2) return false;
  return SLOTS.some((slot) => {
    const comp = board[slot];
    return Boolean(
      comp && !comp.exhausted && !comp.disturbed && !comp.fesselBlocksActivation,
    );
  });
}

/** True when all three slots hold upright, non-disturbed components. */
export function isFullFormulaActivatable(board: FormulaBoard): boolean {
  return SLOTS.every((slot) => {
    const comp = board[slot];
    return Boolean(
      comp && !comp.exhausted && !comp.disturbed && !comp.fesselBlocksActivation,
    );
  });
}

/**
 * After Großformel: charge 0, discard Katalysator, exhaust Technik/Essenz.
 * Caller sets ultimateAvailable = false.
 */
export function applyGrossformelAftermath(
  state: GameState,
  playerId: PlayerId,
): GameState {
  const next = cloneState(state);
  const player = next.players[playerId];
  player.fetzCharge = 0;

  const formula = { ...player.formula };
  const kat = formula.katalysator;
  if (kat) {
    next.piles.discard.push({ instanceId: kat.instanceId, defId: kat.defId });
    formula.katalysator = null;
  }

  const exhaust = (
    comp: FormulaComponentInstance | null,
  ): FormulaComponentInstance | null => {
    if (!comp) return null;
    return { ...comp, exhausted: true };
  };
  formula.technik = exhaust(formula.technik);
  formula.essenz = exhaust(formula.essenz);
  player.formula = formula;
  return next;
}
