/**
 * FORMEL + slot-role badges for card detail panels (Material / Play).
 * Reuses portrait badge tokens from cardFrameTokens (Technik / Essenz / Katalysator).
 * Location: src/components/cards/formula/FormulaTypeBadges.tsx
 */
import React from 'react';
import { KIND_LABELS, portraitBadgeClass } from '../cardFrameTokens';

const TYPE_BADGE_CLASS =
  'rounded border border-stone-500/50 bg-stone-950/85 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white shadow';

const ROLE_BADGE_BASE =
  'rounded border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide shadow';

export interface FormulaTypeBadgesProps {
  /** German slot / combo label: Technik | Essenz | Katalysator | Kombination */
  roleLabel: string | null;
  testId?: string;
}

export function FormulaTypeBadges({
  roleLabel,
  testId = 'detail-formel-badges',
}: FormulaTypeBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" data-testid={testId}>
      <span className={TYPE_BADGE_CLASS} data-testid="detail-formel-type-badge">
        {KIND_LABELS.Formula}
      </span>
      {roleLabel ? (
        <span
          className={`${ROLE_BADGE_BASE} ${portraitBadgeClass(roleLabel)}`}
          data-testid="detail-formel-role-badge"
        >
          {roleLabel}
        </span>
      ) : null}
    </div>
  );
}
