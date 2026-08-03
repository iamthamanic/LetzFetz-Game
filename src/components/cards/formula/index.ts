/**
 * Shared Formel presentation helpers (Build Combinate + detail modal).
 * Location: src/components/cards/formula/index.ts
 */
export {
  FORMULA_SLOT_ORDER,
  FORMULA_SLOT_LABEL_DE,
  FORMULA_SLOT_THEME,
  type FormulaSlotRole,
} from './formulaSlotMeta';
export type { FormulaDisplayCard } from './formulaDisplayCard';
export {
  FormulaCardDetailModal,
  type FormulaDetailSubject,
  type FormulaCardDetailPrimaryAction,
} from './FormulaCardDetailModal';
export { FormulaTypeBadges, type FormulaTypeBadgesProps } from './FormulaTypeBadges';
