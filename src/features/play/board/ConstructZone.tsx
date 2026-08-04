/**
 * V6 Konstrukt zone on the playmat — empty or occupied face (max 1).
 * Location: src/features/play/board/ConstructZone.tsx
 *
 * Public board info. Sits right of Ausrüstung in the Formelgestell row.
 * Challenge Ziel button when legal. Haltbarkeit always shown.
 */
import React from 'react';
import { Ghost } from 'lucide-react';
import type { ConstructInstance } from '../../../game';
import { constructDisplayName } from '../../../game/engine/v6';

interface ConstructZoneProps {
  label: string;
  construct: ConstructInstance | null;
  testId: string;
  /** Legal CHALLENGE target — show Ziel control. */
  targetable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export function ConstructZone({
  label,
  construct,
  testId,
  targetable = false,
  selected = false,
  onSelect,
}: ConstructZoneProps) {
  const name = construct ? constructDisplayName(construct.defId) : null;
  const filled = Boolean(construct);
  const disturbed = Boolean(construct?.disturbed);

  return (
    <div className="flex w-[5.5rem] shrink-0 flex-col gap-1 sm:w-28" data-testid={testId}>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500">
        {label}
      </span>
      <div
        data-testid={`${testId}-slot`}
        data-construct-filled={filled ? 'true' : 'false'}
        data-construct-disturbed={disturbed ? 'true' : undefined}
        data-targetable={targetable ? 'true' : undefined}
        data-challenge-selected={selected ? 'true' : undefined}
        className={`relative flex min-h-[6.5rem] flex-col overflow-hidden rounded-lg border-2 sm:min-h-[7.5rem] ${
          filled
            ? 'border-violet-600/70 bg-violet-950/40'
            : 'border-dashed border-stone-700/80 bg-stone-950/40'
        } ${selected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-950' : ''} ${
          targetable && !selected ? 'hover:ring-2 hover:ring-amber-500/60' : ''
        }`}
      >
        <div
          className={`flex flex-none items-center justify-between gap-1 border-b px-1.5 py-1 ${
            filled ? 'border-violet-800/60 bg-violet-950/70' : 'border-stone-800/80 bg-stone-950/50'
          }`}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider text-violet-300/90 sm:text-[10px]">
            Konstrukt
          </span>
          {disturbed ? (
            <span
              className="text-[8px] uppercase tracking-wide text-rose-300 sm:text-[9px]"
              data-testid={`${testId}-disturbed`}
            >
              gestört
            </span>
          ) : null}
          {targetable && onSelect ? (
            <button
              type="button"
              className="rounded border border-amber-500/50 bg-amber-950/70 px-1 py-0.5 text-[8px] font-semibold text-amber-200 hover:bg-amber-900/80 sm:text-[9px]"
              data-testid={`${testId}-challenge`}
              aria-label={`${name ?? 'Konstrukt'} als Herausforderungsziel wählen`}
              onClick={(event) => {
                event.stopPropagation();
                onSelect();
              }}
            >
              Ziel
            </button>
          ) : null}
        </div>

        {filled && construct ? (
          <div
            className={`flex min-h-0 flex-1 flex-col items-center justify-center gap-1 p-1.5 ${
              disturbed ? 'opacity-60 grayscale-[0.35]' : ''
            }`}
          >
            <Ghost
              className="h-7 w-7 text-violet-300/80 sm:h-8 sm:w-8"
              aria-hidden
              strokeWidth={1.5}
            />
            <span
              className="max-w-full truncate text-center text-[10px] font-semibold text-stone-100 sm:text-[11px]"
              data-testid={`${testId}-name`}
              title={name ?? undefined}
            >
              {name}
            </span>
            <span
              className="rounded border border-violet-500/40 bg-violet-950/80 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-violet-100 sm:text-[11px]"
              data-testid={`${testId}-haltbarkeit`}
              title="Haltbarkeit"
            >
              Haltbarkeit {construct.haltbarkeit}
            </span>
          </div>
        ) : (
          <div
            className="flex flex-1 flex-col items-center justify-center gap-1 p-2 text-center"
            data-testid={`${testId}-empty`}
          >
            <span className="text-[9px] text-stone-600">leer</span>
            <span className="text-[8px] uppercase tracking-wide text-stone-700">max 1</span>
          </div>
        )}
      </div>
    </div>
  );
}
