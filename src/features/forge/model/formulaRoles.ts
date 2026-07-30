/**
 * Formula role labels and helpers for Material Formeln tab.
 * Location: src/features/forge/model/formulaRoles.ts
 */
import type { ForgeCardData } from './types';

export const FORMULA_ROLE_LABELS = ['Technik', 'Essenz', 'Katalysator'] as const;

export type FormulaRoleLabel = (typeof FORMULA_ROLE_LABELS)[number];

export type FormulaRoleFilter = 'All' | FormulaRoleLabel | 'Kombination';

export const FORMULA_ROLE_FILTERS: Array<{ id: FormulaRoleFilter; label: string }> = [
  { id: 'All', label: 'Alle Rollen' },
  { id: 'Technik', label: 'Technik' },
  { id: 'Essenz', label: 'Essenz' },
  { id: 'Katalysator', label: 'Katalysator' },
  { id: 'Kombination', label: 'Kombination' },
];

/** Extract German role badge from forge card effects (`Rolle: Technik`, …). */
export function formulaRoleFromCard(card: ForgeCardData): FormulaRoleLabel | null {
  const line = card.effects?.find((e) => e.startsWith('Rolle:'));
  if (!line) return null;
  const role = line.replace(/^Rolle:\s*/, '').trim();
  if (role === 'Technik' || role === 'Essenz' || role === 'Katalysator') {
    return role;
  }
  return null;
}

export function isKombinationForgeCard(card: ForgeCardData): boolean {
  if (card.type !== 'Formula') return false;
  const line = card.effects?.find((e) => e.startsWith('Rolle:'));
  return line?.includes('Kombination') ?? false;
}

export function cardMatchesFormulaRoleFilter(
  card: ForgeCardData,
  filter: FormulaRoleFilter,
): boolean {
  if (filter === 'All') return true;
  if (filter === 'Kombination') return isKombinationForgeCard(card);
  return formulaRoleFromCard(card) === filter;
}
