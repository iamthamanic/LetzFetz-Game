/**
 * Ausrüstungszone beside Formelgestell — fuchsia chrome (not Formelplatz colors).
 * Location: src/components/cards/formula/EquipmentSlotStrip.tsx
 */
import React from 'react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { EQUIPMENT_SLOT_THEME } from './formulaSlotMeta';
import type { EquipmentDisplayCard } from './formulaDisplayCard';

const MAX_EQUIPMENT = 2;

interface EquipmentSlotStripProps {
  items: EquipmentDisplayCard[];
  testIdPrefix: string;
  /** Extra stable test id (e.g. human-equipment-zone). */
  zoneTestId?: string;
  onOpenDetail?: (item: EquipmentDisplayCard) => void;
  /** Play: activate (Werkzeugkoffer) or replace target while equipping. */
  onEquipmentClick?: (item: EquipmentDisplayCard) => void;
  activatableIds?: string[];
  replaceTargetIds?: string[];
  compact?: boolean;
}

export function EquipmentSlotStrip({
  items,
  testIdPrefix,
  zoneTestId,
  onOpenDetail,
  onEquipmentClick,
  activatableIds = [],
  replaceTargetIds = [],
  compact = false,
}: EquipmentSlotStripProps) {
  const theme = EQUIPMENT_SLOT_THEME;
  const slots: Array<EquipmentDisplayCard | null> = [
    items[0] ?? null,
    items[1] ?? null,
  ];
  const activatable = new Set(activatableIds);
  const replaceTargets = new Set(replaceTargetIds);

  return (
    <div
      className="flex min-w-0 flex-col gap-1"
      data-testid={zoneTestId ?? `${testIdPrefix}-equipment`}
      role="group"
      aria-label="Ausrüstung"
    >
      <span className={`text-[9px] font-bold uppercase tracking-wider sm:text-[10px] ${theme.label}`}>
        Ausrüstung
      </span>
      <div className={`grid min-h-0 flex-1 grid-cols-1 gap-1.5 ${compact ? '' : 'sm:gap-2'}`}>
        {slots.map((item, index) => {
          const filled = Boolean(item);
          const canActivate = item != null && activatable.has(item.instanceId);
          const canReplace = item != null && replaceTargets.has(item.instanceId);
          const interactive = canActivate || canReplace;
          return (
            <div
              key={item?.instanceId ?? `empty-${index}`}
              data-testid={`${testIdPrefix}-equipment-slot-${index}`}
              data-activatable={canActivate ? 'true' : undefined}
              data-replace-target={canReplace ? 'true' : undefined}
              className={`relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border-2 ${
                filled ? theme.filled : `${theme.empty} border-dashed`
              } ${
                interactive
                  ? 'ring-2 ring-fuchsia-400/80 ring-offset-1 ring-offset-stone-950'
                  : ''
              }`}
            >
              <div
                className={`flex flex-none items-center rounded-t-[6px] border-b px-1.5 py-1 ${
                  filled ? theme.header : 'border-stone-800/80 bg-stone-950/50'
                }`}
              >
                <span className={`text-[8px] font-bold uppercase tracking-wider ${theme.label}`}>
                  Slot {index + 1}
                </span>
              </div>
              {item ? (
                <button
                  type="button"
                  className="flex min-h-0 flex-1 flex-col overflow-hidden text-left"
                  aria-label={
                    canActivate
                      ? `${item.name} aktivieren`
                      : canReplace
                        ? `${item.name} ersetzen`
                        : `${item.name} Details öffnen`
                  }
                  data-testid={`${testIdPrefix}-equipment-card-${index}`}
                  onClick={() => {
                    if (interactive && onEquipmentClick) {
                      onEquipmentClick(item);
                      return;
                    }
                    onOpenDetail?.(item);
                  }}
                >
                  <div className={`min-h-0 flex-1 bg-stone-950/60 ${compact ? 'p-1' : 'p-1.5'}`}>
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.name}
                      className="pointer-events-none h-full w-full object-contain drop-shadow-md"
                    />
                  </div>
                  <div className="flex-none border-t border-stone-800/80 bg-stone-950/80 px-1 py-1 text-center">
                    <span className="block truncate text-[9px] font-semibold text-fuchsia-100 sm:text-[10px]">
                      {item.name}
                    </span>
                    {canActivate ? (
                      <span className="mt-0.5 block text-[8px] font-bold uppercase tracking-wide text-fuchsia-300">
                        Nutzen
                      </span>
                    ) : null}
                    {canReplace ? (
                      <span className="mt-0.5 block text-[8px] font-bold uppercase tracking-wide text-amber-300">
                        Ersetzen
                      </span>
                    ) : null}
                  </div>
                </button>
              ) : (
                <div
                  className={`flex flex-1 flex-col items-center justify-center bg-stone-950/30 px-1 text-center ${
                    compact ? 'min-h-[3.5rem]' : 'min-h-[4.5rem]'
                  }`}
                >
                  <span className="text-[8px] text-stone-500">leer</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="text-[8px] text-stone-500">max. {MAX_EQUIPMENT}</span>
    </div>
  );
}
