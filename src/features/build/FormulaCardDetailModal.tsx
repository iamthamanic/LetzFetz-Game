/**
 * Combinate formula card detail modal — Material-style 3-panel preview.
 * Location: src/features/build/FormulaCardDetailModal.tsx
 *
 * Thin Build adapter around shared FormulaCardDetailModal (FormulaCatalogCard shape).
 */
import React from 'react';
import {
  FormulaCardDetailModal as SharedFormulaCardDetailModal,
} from '../../components/cards/formula';
import type { FormulaCatalogCard } from './model/combinateFormula';

interface FormulaCardDetailModalProps {
  card: FormulaCatalogCard;
  onClose: () => void;
}

export function FormulaCardDetailModal({ card, onClose }: FormulaCardDetailModalProps) {
  return (
    <SharedFormulaCardDetailModal
      subject={{ kind: 'formula', card }}
      onClose={onClose}
    />
  );
}
