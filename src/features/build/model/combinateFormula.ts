/**
 * Combinate formula card model + combination label helpers.
 * Location: src/features/build/model/combinateFormula.ts
 */
import type { Element } from '../../../game/types';
import {
  BUILD_SLOT_LABEL_DE,
  BUILD_SLOT_ORDER,
  type BuildSlotRole,
  type BuildSlots,
} from './buildTypes';

export interface FormulaCatalogCard {
  id: string;
  name: string;
  role: BuildSlotRole;
  imageUrl: string;
  /** Set for Essenz cards; null for Technik/Katalysator. */
  element: Element | null;
  stability: number;
  effectText: string;
}

/** Drag MIME for formula cards in Combinate. */
export const FORMULA_CARD_DRAG_MIME = 'application/x-letz-fetz-formula-card';

export function findFormulaCard(
  catalog: FormulaCatalogCard[],
  cardId: string | null | undefined,
): FormulaCatalogCard | null {
  if (!cardId) return null;
  return catalog.find((c) => c.id === cardId) ?? null;
}

export function countFilledSlots(slots: BuildSlots): number {
  return BUILD_SLOT_ORDER.filter((role) => slots[role] != null).length;
}

/** German combination title when ≥2 slots filled; otherwise null. */
export function buildCombinationLabel(slots: BuildSlots): string | null {
  const filledRoles = BUILD_SLOT_ORDER.filter((role) => slots[role] != null);
  if (filledRoles.length < 2) return null;
  const roleNames = filledRoles.map((role) => BUILD_SLOT_LABEL_DE[role]);
  return `Kombination aus ${roleNames.join(' ')}`;
}
