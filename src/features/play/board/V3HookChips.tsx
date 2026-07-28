/**
 * HUD chip row for active V3 Ulti / Blueprint / Transform hooks.
 * Location: src/features/play/board/V3HookChips.tsx
 */
import React from 'react';
import type { V3HookChip } from './v3HookSurface';

interface V3HookChipsProps {
  chips: V3HookChip[];
  testId?: string;
}

export function V3HookChips({ chips, testId = 'v3-hook-chips' }: V3HookChipsProps) {
  if (chips.length === 0) return null;

  return (
    <ul
      className="flex min-w-0 flex-wrap items-center gap-1"
      data-testid={testId}
      aria-label="V3-Hooks"
    >
      {chips.map((chip) => (
        <li
          key={chip.id}
          data-testid={`v3-hook-chip-${chip.id}`}
          className="rounded bg-violet-900/80 px-1.5 py-0.5 text-[9px] font-semibold text-violet-100"
        >
          {chip.labelDe}
        </li>
      ))}
    </ul>
  );
}
