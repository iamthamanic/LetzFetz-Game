/**
 * V5/V6 Formelgestell on the playmat — Build-Combinate card rack (not abstract compose tiles).
 * Location: src/features/play/board/FormulaRig.tsx
 *
 * Shows three Formelplatz card faces + catalog combo preview + equipment strip.
 * Public board info only (own and opponent). V6: Echo/Delay queue chips + catalyst badge.
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
import { EchoDelayQueueChips } from './EchoDelayQueueChips';
import type { V6EchoDelayChip, V6EchoDelayKind } from './v6EchoDelaySurface';

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
  /** V6 pending Echo / Verzögerung queue chips. */
  echoDelayChips?: V6EchoDelayChip[];
  /** V6: seated catalyst waiting for Echo/Delay Startphase resolve. */
  pendingCatalystTiming?: V6EchoDelayKind | null;
  /** V6: Konstrukt zone — rendered right of Ausrüstung. */
  constructAside?: React.ReactNode;
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
  echoDelayChips = [],
  pendingCatalystTiming = null,
  constructAside = null,
}: FormulaRigProps) {
  const slots = mapFormulaSlotsForDisplay(pack, formula);
  if (pendingCatalystTiming && slots.katalysator) {
    slots.katalysator = {
      ...slots.katalysator,
      pendingTiming: pendingCatalystTiming,
    };
  }
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
    <div className="flex flex-col gap-1.5">
      <EchoDelayQueueChips chips={echoDelayChips} testId={`${testId}-echo-delay`} />
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
        trailingAside={constructAside}
      />
    </div>
  );
}
