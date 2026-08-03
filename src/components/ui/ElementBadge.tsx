/**
 * Card chrome element badge — Lucide icon in dark chip with shimmer sweep.
 * Mystery/Mysterium uses a flowing rainbow fill instead of the white shine.
 * Shared by Material ElementEffectCard, LetzFetzCard, character detail.
 * Location: src/components/ui/ElementBadge.tsx
 */
import React from 'react';
import type { Element } from '../../game';
import { ElementIcon, ELEMENT_LABELS_DE, type ElementIconKind } from './ElementIcon';

interface ElementBadgeProps {
  element: ElementIconKind;
  /** Tight padding for sm/md card faces. */
  compact?: boolean;
  className?: string;
  'data-testid'?: string;
}

const MYSTERY_LABEL = 'Mysterium';

function labelFor(element: ElementIconKind): string {
  if (element === 'mystery') return MYSTERY_LABEL;
  return ELEMENT_LABELS_DE[element as Element];
}

export function ElementBadge({
  element,
  compact = false,
  className = '',
  'data-testid': testId = 'element-badge',
}: ElementBadgeProps) {
  const isMystery = element === 'mystery';

  return (
    <span
      className={`element-badge element-badge-${element} ${
        isMystery ? '' : 'element-badge-shimmer'
      } inline-flex items-center rounded shadow-md ${
        isMystery
          ? 'border border-white/35'
          : 'border border-stone-600/80 bg-black/90'
      } ${compact ? 'gap-0.5 px-1 py-0.5' : 'gap-1 px-1.5 py-1'} ${className}`}
      data-testid={testId}
      data-element={element}
      aria-label={labelFor(element)}
    >
      <ElementIcon
        element={element}
        size="sm"
        animated={false}
        className={`${compact ? '!p-0.5 scale-[0.72]' : '!p-0.5 scale-[0.85]'}${
          isMystery ? ' !border-white/40 !bg-black/30 [&_svg]:!text-white' : ''
        }`}
      />
      {!isMystery ? <span className="element-badge-shimmer__shine" aria-hidden /> : null}
    </span>
  );
}
