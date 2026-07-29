/**
 * V5 formula challenge: stability defense, disturb/destroy margin, start restore.
 * Location: src/game/engine/formulaChallenge.ts
 */
import type {
  ContentPack,
  Element,
  FormulaBoard,
  FormulaComponentInstance,
  FormulaSlot,
} from '../types';
import { findFormulaComponentDef } from './formulaSlots';

export type FormulaChallengeOutcome = 'none' | 'disturb' | 'destroy';

const FORMULA_SLOTS: FormulaSlot[] = ['technik', 'essenz', 'katalysator'];

/** Occupied formula slots as a flat list. */
export function listFormulaComponents(board: FormulaBoard): FormulaComponentInstance[] {
  const out: FormulaComponentInstance[] = [];
  for (const slot of FORMULA_SLOTS) {
    const comp = board[slot];
    if (comp) out.push(comp);
  }
  return out;
}

export function findFormulaComponent(
  board: FormulaBoard,
  instanceId: string,
): FormulaComponentInstance | undefined {
  return listFormulaComponents(board).find((c) => c.instanceId === instanceId);
}

/** Printed stability + temporary bonus (can be negative). */
export function formulaComponentStability(
  pack: ContentPack,
  comp: FormulaComponentInstance,
): number {
  const def = findFormulaComponentDef(pack, comp.defId);
  return (def?.stability ?? 0) + comp.stabilityBonus;
}

/** Essenz element only — Technik/Katalysator have none (§17.0). */
export function formulaComponentElement(
  pack: ContentPack,
  comp: FormulaComponentInstance,
): Element | undefined {
  const def = findFormulaComponentDef(pack, comp.defId);
  return def?.kind === 'essence' ? def.element : undefined;
}

/**
 * V5 §24.2 margin table.
 * diff = attack − defense; already disturbed + any positive margin → destroy.
 */
export function formulaChallengeOutcome(
  attackValue: number,
  defenseValue: number,
  alreadyDisturbed: boolean,
): FormulaChallengeOutcome {
  const diff = attackValue - defenseValue;
  if (diff <= 0) return 'none';
  if (alreadyDisturbed) return 'destroy';
  if (diff >= 3) return 'destroy';
  return 'disturb';
}

/** Startphase: unexhaust, clear disturbed, clear stabilityBonus. */
export function restoreOwnerFormulaAtStart(board: FormulaBoard): FormulaBoard {
  const mapSlot = (comp: FormulaComponentInstance | null): FormulaComponentInstance | null => {
    if (!comp) return null;
    return {
      ...comp,
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
  };
  return {
    technik: mapSlot(board.technik),
    essenz: mapSlot(board.essenz),
    katalysator: mapSlot(board.katalysator),
  };
}

/** Mark component disturbed in place; returns updated board. */
export function disturbFormulaComponent(
  board: FormulaBoard,
  instanceId: string,
): FormulaBoard {
  const next = { ...board };
  for (const slot of FORMULA_SLOTS) {
    const comp = next[slot];
    if (comp?.instanceId === instanceId) {
      next[slot] = { ...comp, disturbed: true };
      break;
    }
  }
  return next;
}

/**
 * Remove component from board; returns card for discard pile (or null if missing).
 */
export function destroyFormulaComponent(
  board: FormulaBoard,
  instanceId: string,
): { board: FormulaBoard; removed: FormulaComponentInstance | null } {
  const next = { ...board };
  for (const slot of FORMULA_SLOTS) {
    const comp = next[slot];
    if (comp?.instanceId === instanceId) {
      next[slot] = null;
      return { board: next, removed: comp };
    }
  }
  return { board: next, removed: null };
}
