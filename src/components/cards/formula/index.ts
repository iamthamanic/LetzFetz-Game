/**
 * Shared Formelgestell presentation (Build Combinate visuals + Play board rack).
 * Location: src/components/cards/formula/index.ts
 */
export {
  FORMULA_SLOT_ORDER,
  FORMULA_SLOT_LABEL_DE,
  FORMULA_SLOT_THEME,
  type FormulaSlotRole,
} from './formulaSlotMeta';
export type { EquipmentDisplayCard, FormulaDisplayCard } from './formulaDisplayCard';
export { FormulaBoardRack } from './FormulaBoardRack';
export {
  FormulaCardDetailModal,
  type FormulaDetailSubject,
} from './FormulaCardDetailModal';
export { FormulaTypeBadges } from './FormulaTypeBadges';
export { FormulaSlotFace } from './FormulaSlotFace';
export { FormulaComboPreview } from './FormulaComboPreview';
export {
  FormulaComboArt,
  FormulaComboArtPlaceholder,
} from './FormulaComboArt';
export { FormulaSlotConnectionOverlay } from './FormulaSlotConnectionOverlay';
export { EquipmentSlotStrip } from './EquipmentSlotStrip';
export {
  findComboForFilledSlots,
  mapEquipmentForDisplay,
  mapFormulaSlotsForDisplay,
  formulaDefToDisplayCard,
} from './mapFormulaBoardDisplay';
