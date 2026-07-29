/**
 * Combat status chips for character docks (German labels + Wirkungstooltips).
 * Location: src/features/play/board/StatusChips.tsx
 */
import React from 'react';
import type { StatusInstance } from '../../../game/types';
import { shieldEffectCopyDe, statusEffectCopyDe, statusLabelDe } from './statusEffectCopy';

interface StatusChipsProps {
  statuses: StatusInstance[];
  shield?: number;
  testId?: string;
}

export function StatusChips({ statuses, shield = 0, testId }: StatusChipsProps) {
  if (statuses.length === 0 && shield <= 0) return null;

  return (
    <ul
      className="mt-1 flex flex-wrap gap-1"
      data-testid={testId ?? 'status-chips'}
      aria-label="Status"
    >
      {shield > 0 && (
        <li
          className="rounded bg-sky-900/80 px-1.5 py-0.5 text-[9px] font-semibold text-sky-200"
          title={shieldEffectCopyDe()}
          tabIndex={0}
          aria-label={`Schild ×${shield}. ${shieldEffectCopyDe()}`}
        >
          Schild ×{shield}
        </li>
      )}
      {statuses.map((s) => {
        const label = statusLabelDe(s.id);
        const effect = statusEffectCopyDe(s.id);
        const stack = s.stacks > 1 ? ` ×${s.stacks}` : '';
        return (
          <li
            key={s.id}
            className="rounded bg-amber-900/70 px-1.5 py-0.5 text-[9px] font-semibold text-amber-100"
            title={effect}
            tabIndex={0}
            aria-label={`${label}${stack}. ${effect}`}
          >
            {label}
            {stack}
          </li>
        );
      })}
    </ul>
  );
}
