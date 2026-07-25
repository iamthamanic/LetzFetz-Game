/**
 * V3 status chips for character docks (German labels).
 * Location: src/features/play/board/StatusChips.tsx
 */
import React from 'react';
import type { StatusId, StatusInstance } from '../../../game/types';

const STATUS_LABEL_DE: Record<StatusId, string> = {
  brennen: 'Brennen',
  durchnaesst: 'Durchnässt',
  high: 'High',
  aufgewirbelt: 'Aufgewirbelt',
  erleuchtet: 'Erleuchtet',
  verflucht: 'Verflucht',
  nebel: 'Nebel',
  dichter_nebel: 'Dichter Nebel',
  verpeilt: 'Verpeilt',
  geblendet: 'Geblendet',
  gift: 'Gift',
  ueberflutet: 'Überflutet',
  fokus: 'Fokus',
  ausgeblendet: 'Ausgeblendet',
};

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
        <li className="rounded bg-sky-900/80 px-1.5 py-0.5 text-[9px] font-semibold text-sky-200">
          Schild ×{shield}
        </li>
      )}
      {statuses.map((s) => (
        <li
          key={s.id}
          className="rounded bg-amber-900/70 px-1.5 py-0.5 text-[9px] font-semibold text-amber-100"
        >
          {STATUS_LABEL_DE[s.id] ?? s.id}
          {s.stacks > 1 ? ` ×${s.stacks}` : ''}
        </li>
      ))}
    </ul>
  );
}
