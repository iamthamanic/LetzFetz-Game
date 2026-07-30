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
  /** Technik activation mode key; null for Essenz/Katalysator. */
  activationMode: string | null;
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

/** All currently filled Formelplatz roles (0–3). */
export function getFilledSlotRoles(slots: BuildSlots): BuildSlotRole[] {
  return BUILD_SLOT_ORDER.filter((role) => slots[role] != null);
}

/** Filled Formelplatz roles when ≥2 slots are occupied; otherwise null. */
export function getFilledCombinationRoles(slots: BuildSlots): BuildSlotRole[] | null {
  const filledRoles = getFilledSlotRoles(slots);
  return filledRoles.length >= 2 ? filledRoles : null;
}

/** German combination title when ≥2 slots filled; otherwise null. */
export function buildCombinationLabel(slots: BuildSlots): string | null {
  const filledRoles = getFilledCombinationRoles(slots);
  if (!filledRoles) return null;
  const roleNames = filledRoles.map((role) => BUILD_SLOT_LABEL_DE[role]);
  return `Kombination aus ${roleNames.join(' + ')}`;
}

export const DEFAULT_COMBINATION_NAME = 'Meine Formel';
export const COMBINATION_NAME_MAX = 48;

/** True when the current name is still the default or a previous auto-suggestion. */
export function shouldReplaceCombinationName(
  currentName: string,
  lastSuggested: string | null,
): boolean {
  const trimmed = currentName.trim();
  if (!trimmed || trimmed === DEFAULT_COMBINATION_NAME) return true;
  return lastSuggested != null && trimmed === lastSuggested;
}
