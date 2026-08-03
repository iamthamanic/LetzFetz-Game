/**
 * V5/V6 Formelgestell on the playmat — Build-Combinate card rack (not abstract compose tiles).
 * Location: src/features/play/board/FormulaRig.tsx
 *
 * Shows three Formelplatz card faces + catalog combo preview + equipment strip.
 * Public board info only (own and opponent).
 */
import React from 'react';
import type { CardInstance, ContentPack, FormulaBoard } from '../../../game';
import {
  FormulaBoardRack,
  findComboForFilledSlots,
  mapEquipmentForDisplay,
  mapFormulaSlotsForDisplay,
  type EquipmentDisplayCard,
  type FormulaSlotRole,
} from '../../../components/cards/formula';
import { DroppableFormulaSlot } from './DndPlaymat';

interface FormulaRigProps {
  label: string;
  formula: FormulaBoard;
  pack: ContentPack;
  testId: string;
  /** Public equipment on this player's board (max 2). */
  equipment?: CardInstance[];
  /** Opponent components that are legal CHALLENGE targets. */
  targetableInstanceIds?: string[];
  selectedTargetId?: string | null;
  onComponentClick?: (instanceId: string) => void;
  /** When true, empty/filled slots accept Formel hand card drops. */
  formulaDropEnabled?: boolean;
  onEquipmentClick?: (item: EquipmentDisplayCard) => void;
  equipmentActivatableIds?: string[];
  equipmentReplaceTargetIds?: string[];
}

export function FormulaRig({
  label,
  formula,
  pack,
  testId,
  equipment = [],
  targetableInstanceIds = [],
  selectedTargetId = null,
  onComponentClick,
  formulaDropEnabled = false,
  onEquipmentClick,
  equipmentActivatableIds = [],
  equipmentReplaceTargetIds = [],
}: FormulaRigProps) {
  const slots = mapFormulaSlotsForDisplay(pack, formula);
  const equipmentCards = mapEquipmentForDisplay(pack, equipment);
  const catalogCombination = findComboForFilledSlots(slots);

  const wrapSlot = formulaDropEnabled
    ? (role: FormulaSlotRole, node: React.ReactNode) => (
        <DroppableFormulaSlot role={role} isTarget>
          {node}
        </DroppableFormulaSlot>
      )
    : undefined;

  return (
    <FormulaBoardRack
      label={label}
      testId={testId}
      slots={slots}
      equipment={equipmentCards}
      catalogCombination={catalogCombination}
      targetableInstanceIds={targetableInstanceIds}
      selectedTargetId={selectedTargetId}
      onComponentClick={onComponentClick}
      wrapSlot={wrapSlot}
      compact
      showEquipment
      onEquipmentClick={onEquipmentClick}
      equipmentActivatableIds={equipmentActivatableIds}
      equipmentReplaceTargetIds={equipmentReplaceTargetIds}
    />
  );
}
