/**
 * Formelgestell rack: combo preview + connection lines + 3 card slots + equipment.
 * Shared presentational shell for Play (and Build-compatible visuals).
 * Location: src/components/cards/formula/FormulaBoardRack.tsx
 */
import React, { useRef, useState } from 'react';
import type { FormulaCombinationEntry } from '../../../game/packs/v5/formulaCombinations';
import { FormulaComboPreview } from './FormulaComboPreview';
import { FormulaSlotConnectionOverlay } from './FormulaSlotConnectionOverlay';
import { FormulaSlotFace } from './FormulaSlotFace';
import { EquipmentSlotStrip } from './EquipmentSlotStrip';
import {
  FormulaCardDetailModal,
  type FormulaDetailSubject,
} from './FormulaCardDetailModal';
import {
  FORMULA_SLOT_ORDER,
  type FormulaSlotRole,
} from './formulaSlotMeta';
import type {
  EquipmentDisplayCard,
  FormulaDisplayCard,
  FormulaSlotOccupant,
} from './formulaDisplayCard';

export interface FormulaBoardRackProps {
  label: string;
  testId: string;
  slots: Record<FormulaSlotRole, FormulaSlotOccupant | null>;
  equipment: EquipmentDisplayCard[];
  catalogCombination: FormulaCombinationEntry | null;
  /** Opponent components that are legal CHALLENGE targets. */
  targetableInstanceIds?: string[];
  selectedTargetId?: string | null;
  onComponentClick?: (instanceId: string) => void;
  /** Optional Play DnD / chrome wrapper around each Formelplatz face. */
  wrapSlot?: (role: FormulaSlotRole, node: React.ReactNode) => React.ReactNode;
  compact?: boolean;
  showEquipment?: boolean;
  onEquipmentClick?: (item: EquipmentDisplayCard) => void;
  equipmentActivatableIds?: string[];
  equipmentReplaceTargetIds?: string[];
  /** V6: Konstrukt zone rendered immediately right of Ausrüstung. */
  trailingAside?: React.ReactNode;
}

export function FormulaBoardRack({
  label,
  testId,
  slots,
  equipment,
  catalogCombination,
  targetableInstanceIds = [],
  selectedTargetId = null,
  onComponentClick,
  wrapSlot,
  compact = true,
  showEquipment = true,
  onEquipmentClick,
  equipmentActivatableIds = [],
  equipmentReplaceTargetIds = [],
  trailingAside = null,
}: FormulaBoardRackProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const previewTargetRef = useRef<HTMLDivElement>(null);
  const slotAnchorRefs = useRef<Partial<Record<FormulaSlotRole, HTMLElement | null>>>({});
  const [detail, setDetail] = useState<FormulaDetailSubject | null>(null);

  const targetSet = new Set(targetableInstanceIds);
  const filledRoles = FORMULA_SLOT_ORDER.filter((role) => slots[role] != null);
  const previewCards = FORMULA_SLOT_ORDER.map((role) => slots[role]?.card).filter(
    (card): card is FormulaDisplayCard => card != null,
  );

  return (
    <div className="flex flex-col gap-1.5" data-testid={testId}>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500">
        {label}
      </span>

      <div
        ref={stageRef}
        className="relative flex min-h-0 flex-col gap-7 overflow-visible sm:gap-9"
        data-testid={`${testId}-stage`}
      >
        <FormulaSlotConnectionOverlay
          filledRoles={filledRoles}
          containerRef={stageRef}
          previewTargetRef={previewTargetRef}
          slotAnchorRefs={slotAnchorRefs}
          testId={`${testId}-connections`}
        />

        <div className="relative z-[1]">
          <FormulaComboPreview
            previewRoles={filledRoles}
            previewCards={previewCards}
            catalogCombination={catalogCombination}
            connectionTargetRef={previewTargetRef}
            testId={`${testId}-preview`}
            compact={compact}
          />
        </div>

        <div
          className={`relative z-[1] flex min-h-0 gap-2 sm:gap-3 ${
            showEquipment || trailingAside ? 'flex-row items-stretch' : ''
          }`}
        >
          <div
            className={`grid min-h-0 min-w-0 flex-1 grid-cols-3 gap-1.5 sm:gap-2.5 ${
              compact ? 'min-h-[7.5rem]' : 'min-h-[10rem]'
            }`}
            role="group"
            aria-label="Formelkomponenten"
          >
            {FORMULA_SLOT_ORDER.map((role) => {
              const occupant = slots[role];
              const id = occupant?.instanceId;
              const targetable = Boolean(id && targetSet.has(id));
              const face = (
                <FormulaSlotFace
                  role={role}
                  occupant={occupant}
                  testIdPrefix={testId}
                  compact={compact}
                  targetable={targetable}
                  selected={Boolean(id && selectedTargetId === id)}
                  onPortRef={(el) => {
                    slotAnchorRefs.current[role] = el;
                  }}
                  onSelect={
                    id && onComponentClick && targetable
                      ? () => onComponentClick(id)
                      : undefined
                  }
                  onOpenDetail={
                    occupant
                      ? () => setDetail({ kind: 'formula', card: occupant.card })
                      : undefined
                  }
                />
              );
              const wrapped = wrapSlot ? wrapSlot(role, face) : face;
              return <React.Fragment key={role}>{wrapped}</React.Fragment>;
            })}
          </div>

          {showEquipment ? (
            <div className={`flex-none ${compact ? 'w-[4.75rem] sm:w-[5.5rem]' : 'w-28'}`}>
              <EquipmentSlotStrip
                items={equipment}
                testIdPrefix={testId}
                zoneTestId={
                  testId === 'human-formula-rig' ? 'human-equipment-zone' : undefined
                }
                compact={compact}
                onOpenDetail={(item) => setDetail({ kind: 'equipment', card: item })}
                onEquipmentClick={onEquipmentClick}
                activatableIds={equipmentActivatableIds}
                replaceTargetIds={equipmentReplaceTargetIds}
              />
            </div>
          ) : null}

          {trailingAside ? (
            <div className="flex flex-none items-stretch self-stretch">{trailingAside}</div>
          ) : null}
        </div>
      </div>

      {detail ? (
        <FormulaCardDetailModal subject={detail} onClose={() => setDetail(null)} />
      ) : null}
    </div>
  );
}
