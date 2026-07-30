/**
 * Combinate save helpers — build FormulaRecipe + canvas hero-frame capture.
 * Location: src/features/build/model/combinateSave.ts
 */
import type { RenderOutput } from '../vfx/types/renderOutput';
import type { FormulaRecipe } from '../vfx/types/assets';
import type { BuildSlots } from './buildTypes';
import { countFilledSlots } from './combinateFormula';

/** Baseline pack version for V5 Formel-Bausteine pinned into recipes. */
export const V5_FORMULA_COMPONENT_VERSION = 1 as const;

export function createCombinationId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `kombi-${crypto.randomUUID()}`;
  }
  return `kombi-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Capture the WebGL canvas as a PNG data URL RenderOutput (V1 local-only). */
export function captureCanvasHeroFrame(canvas: HTMLCanvasElement | null): RenderOutput | null {
  if (!canvas || canvas.width < 1 || canvas.height < 1) return null;
  try {
    const url = canvas.toDataURL('image/png');
    if (!url.startsWith('data:image/png')) return null;
    return {
      kind: 'renderOutput',
      id: `render-${Date.now()}`,
      url,
      format: 'png',
      width: canvas.width,
      height: canvas.height,
      capturedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export interface BuildFormulaRecipeInput {
  slots: BuildSlots;
  name: string;
  heroFrame: RenderOutput | null;
  existingId?: string;
  existingCreatedAt?: string;
}

/** Build a FormulaRecipe when ≥2 slots are filled; otherwise null. */
export function buildFormulaRecipeFromSlots(input: BuildFormulaRecipeInput): FormulaRecipe | null {
  const { slots, name, heroFrame, existingId, existingCreatedAt } = input;
  if (countFilledSlots(slots) < 2) return null;

  const now = new Date().toISOString();
  const trimmedName = name.trim() || 'Unbenannt';

  return {
    kind: 'formulaRecipe',
    id: existingId ?? createCombinationId(),
    name: trimmedName,
    status: 'READY',
    version: 1,
    techniqueId: slots.technik,
    essenceId: slots.essenz,
    catalystId: slots.katalysator,
    techniqueVersion: slots.technik ? V5_FORMULA_COMPONENT_VERSION : null,
    essenceVersion: slots.essenz ? V5_FORMULA_COMPONENT_VERSION : null,
    catalystVersion: slots.katalysator ? V5_FORMULA_COMPONENT_VERSION : null,
    heroFrame,
    createdAt: existingCreatedAt ?? now,
    updatedAt: now,
  };
}
