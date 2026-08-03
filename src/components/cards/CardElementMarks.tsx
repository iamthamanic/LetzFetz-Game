/**
 * Element icons + V3 Elementmarke tokens for card detail (not cover).
 * Location: src/components/cards/CardElementMarks.tsx
 */
import React from 'react';
import { ElementBadge } from '../ui/ElementBadge';
import { ELEMENT_LABELS_DE, type ElementIconKind } from '../ui/ElementIcon';
import type { CardElementMarkInfo } from './elementMarks';
import { ElementMarkToken } from './ElementMarkToken';

interface CardElementMarksProps {
  info: CardElementMarkInfo;
  /** Show element icons + labels. */
  showIcons?: boolean;
  /** Show primary Elementmarke round tokens. */
  showMarks?: boolean;
  /** Compact for dense layouts. */
  compact?: boolean;
  className?: string;
  testId?: string;
}

export function CardElementMarks({
  info,
  showIcons = true,
  showMarks = true,
  compact = false,
  className = '',
  testId = 'card-element-marks',
}: CardElementMarksProps) {
  if ((!showIcons || info.icons.length === 0) && (!showMarks || info.marks.length === 0)) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`} data-testid={testId}>
      {showIcons && (info.icons.length > 0 || info.useMysteryIcon) ? (
        <div className={`flex flex-wrap items-center ${compact ? 'gap-0.5' : 'gap-1.5'}`}>
          {info.useMysteryIcon ? (
            <span className="inline-flex items-center gap-1">
              <ElementBadge element="mystery" compact={compact} />
              {!compact ? <span>Frei / Frei</span> : null}
            </span>
          ) : (
            info.elements.map((el, i) => (
              <span key={el} className="inline-flex items-center gap-1">
                {i > 0 && !compact ? (
                  <span aria-hidden className="opacity-70">
                    /
                  </span>
                ) : null}
                <ElementBadge element={el} compact={compact} />
                {!compact ? (
                  <span className="text-on-parchment">{ELEMENT_LABELS_DE[el]}</span>
                ) : null}
              </span>
            ))
          )}
          {!info.useMysteryIcon &&
            info.elements.length === 0 &&
            info.icons.map((icon) => (
              <ElementBadge
                key={icon}
                element={icon as ElementIconKind}
                compact={compact}
              />
            ))}
        </div>
      ) : null}

      {showMarks && info.marks.length > 0 ? (
        <ul
          className={`flex flex-wrap items-center ${compact ? 'gap-0.5' : 'gap-1.5'}`}
          aria-label="Elementeffekte"
          data-testid={`${testId}-chips`}
        >
          {info.marks.map((m) => (
            <li key={m.id} className="flex list-none items-center gap-1">
              <ElementMarkToken markId={m.id} size={compact ? 'sm' : 'md'} />
              {!compact ? (
                <span className="text-on-parchment text-[10px] font-semibold">{m.label}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
