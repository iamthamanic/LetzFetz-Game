/**
 * HUD chip row for pending V6 Echo / Verzögerung queue entries.
 * Location: src/features/play/board/EchoDelayQueueChips.tsx
 */
import React from 'react';
import type { V6EchoDelayChip } from './v6EchoDelaySurface';

interface EchoDelayQueueChipsProps {
  chips: V6EchoDelayChip[];
  testId?: string;
}

export function EchoDelayQueueChips({
  chips,
  testId = 'v6-echo-delay-chips',
}: EchoDelayQueueChipsProps) {
  if (chips.length === 0) return null;

  return (
    <ul
      className="flex min-w-0 flex-wrap items-center gap-1"
      data-testid={testId}
      aria-label="Echo und Verzögerung"
    >
      {chips.map((chip) => (
        <li
          key={chip.id}
          data-testid={`v6-echo-delay-chip-${chip.kind}`}
          title={chip.titleDe}
          className={
            chip.kind === 'echo'
              ? 'rounded border border-cyan-700/70 bg-cyan-950/80 px-1.5 py-0.5 text-[9px] font-semibold text-cyan-100'
              : 'rounded border border-orange-700/70 bg-orange-950/80 px-1.5 py-0.5 text-[9px] font-semibold text-orange-100'
          }
        >
          {chip.labelDe}
        </li>
      ))}
    </ul>
  );
}
