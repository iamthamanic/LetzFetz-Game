/**
 * V6 Fessel (intensity locks on formula components) — spielkonzept §33.5 / §50.6.
 * Target selection is manual (PICK_V6_FESSEL_TARGET); empty slots are never legal.
 * Location: src/game/engine/v6/fessel.ts
 */
import type { FormulaBoard, FormulaComponentInstance, FormulaSlot, GameState, PlayerId } from '../../types';
import { cloneState } from '../helpers';

const FORMULA_SLOTS: FormulaSlot[] = ['technik', 'essenz', 'katalysator'];

/** Bot / docs: prefer Katalysator (one-shot timing), then Essenz, then Technik. */
export const FESSEL_BOT_SLOT_PRIORITY: FormulaSlot[] = ['katalysator', 'essenz', 'technik'];

export const MAX_FESSEL_INTENSITY = 3;

export function clampFesselIntensity(value: number): number {
  return Math.max(0, Math.min(MAX_FESSEL_INTENSITY, Math.floor(value)));
}

/** Occupied formula slots that may receive Fessel (empty = invalid). */
export function occupiedFesselSlots(board: FormulaBoard): FormulaSlot[] {
  return FORMULA_SLOTS.filter((slot) => board[slot] != null);
}

/** Defense stages reduce Fessel intensity (same bands as numeric primary). */
export function applyV6DefenseToIntensity(
  intensity: number,
  stages: 0 | 1 | 2,
  formulaDefensePenalty: number,
): number {
  const effectiveStages = Math.max(0, stages + formulaDefensePenalty);
  return clampFesselIntensity(Math.max(0, intensity - effectiveStages));
}

function mapBoard(
  board: FormulaBoard,
  map: (comp: FormulaComponentInstance, slot: FormulaSlot) => FormulaComponentInstance | null,
): FormulaBoard {
  const next: FormulaBoard = { technik: null, essenz: null, katalysator: null };
  for (const slot of FORMULA_SLOTS) {
    const comp = board[slot];
    next[slot] = comp ? map(comp, slot) : null;
  }
  return next;
}

function resolveFesselTargetId(
  board: FormulaBoard,
  target: { instanceId: string } | { slot: FormulaSlot },
): string | null {
  if ('instanceId' in target) {
    return target.instanceId;
  }
  return board[target.slot]?.instanceId ?? null;
}

/**
 * Apply Fessel intensity onto a chosen occupied component (max with existing).
 * Caller must supply instanceId or slot — no auto T→E→K fallback.
 */
export function applyFesselToBoard(
  board: FormulaBoard,
  intensity: number,
  target: { instanceId: string } | { slot: FormulaSlot },
): { board: FormulaBoard; appliedTo: FormulaComponentInstance | null; intensity: number } {
  const level = clampFesselIntensity(intensity);
  if (level <= 0) {
    return { board, appliedTo: null, intensity: 0 };
  }

  const targetId = resolveFesselTargetId(board, target);
  if (!targetId) {
    return { board, appliedTo: null, intensity: 0 };
  }

  let appliedTo: FormulaComponentInstance | null = null;
  const next = mapBoard(board, (comp) => {
    if (comp.instanceId !== targetId) return comp;
    const merged = clampFesselIntensity(Math.max(comp.fesselIntensity ?? 0, level));
    appliedTo = {
      ...comp,
      fesselIntensity: merged,
    };
    return appliedTo;
  });
  return { board: next, appliedTo, intensity: appliedTo?.fesselIntensity ?? 0 };
}

export function applyFesselToPlayer(
  state: GameState,
  targetPlayerId: PlayerId,
  intensity: number,
  target: { instanceId: string } | { slot: FormulaSlot },
): GameState {
  const result = applyFesselToBoard(state.players[targetPlayerId].formula, intensity, target);
  if (!result.appliedTo) return state;
  const next = cloneState(state);
  next.players[targetPlayerId].formula = result.board;
  const name = result.appliedTo.defId;
  next.lastEvent = `${next.lastEvent ?? ''} Fessel ${result.intensity} auf ${name}.`.trim();
  return next;
}

/**
 * Startphase §8 step 6–7: apply Fessel effects for this formula cycle, then decay −1,
 * then upright Technik/Essenz when not held exhausted by Fessel 1+.
 */
export function tickFesselAndRestoreOwnerFormulaV6(board: FormulaBoard): {
  board: FormulaBoard;
  notes: string[];
} {
  const notes: string[] = [];
  const afterTick = mapBoard(board, (comp, slot) => {
    const intensity = clampFesselIntensity(comp.fesselIntensity ?? 0);
    if (intensity <= 0) {
      // Clear sticky activation lock when no Fessel remains.
      const cleared = { ...comp, fesselBlocksActivation: false, fesselIntensity: undefined };
      if (slot === 'katalysator') {
        return { ...cleared, exhausted: true, disturbed: false, stabilityBonus: 0 };
      }
      return { ...cleared, exhausted: false, disturbed: false, stabilityBonus: 0 };
    }

    const blocksActivation = intensity >= 2;
    const forceDisturbed = intensity >= 3;
    const skipUpright = intensity >= 1;
    const nextIntensity = intensity - 1;

    notes.push(
      `Fessel ${intensity}${slot === 'technik' ? ' (Technik)' : slot === 'essenz' ? ' (Essenz)' : ' (Katalysator)'}` +
        (blocksActivation ? ' · Aktivierung gesperrt' : '') +
        (forceDisturbed ? ' · gestört' : '') +
        (skipUpright ? ' · bleibt erschöpft' : ''),
    );

    const base: FormulaComponentInstance = {
      ...comp,
      fesselBlocksActivation: blocksActivation,
      fesselIntensity: nextIntensity > 0 ? nextIntensity : undefined,
      disturbed: forceDisturbed,
      stabilityBonus: 0,
    };

    if (slot === 'katalysator') {
      return { ...base, exhausted: true };
    }
    return { ...base, exhausted: skipUpright };
  });

  return { board: afterTick, notes };
}

/** True when component cannot contribute to formula activation this cycle. */
export function formulaComponentUsableForActivation(comp: FormulaComponentInstance): boolean {
  if (comp.exhausted || comp.disturbed) return false;
  if (comp.fesselBlocksActivation) return false;
  return true;
}
