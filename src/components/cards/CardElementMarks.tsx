/**
 * Element icons + V3 Elementmarke tokens for card detail (not cover).
 * Location: src/components/cards/CardElementMarks.tsx
 */
import React from 'react';
import { ElementIcon, ELEMENT_LABELS_DE } from '../ui/ElementIcon';
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

  const iconSize = 'sm' as const;

  return (
    <div className={`flex flex-col gap-1 ${className}`} data-testid={testId}>
      {showIcons && (info.icons.length > 0 || info.useMysteryIcon) ? (
        <div className={`flex flex-wrap items-center ${compact ? 'gap-0.5' : 'gap-1.5'}`}>
          {info.useMysteryIcon ? (
            <span className="inline-flex items-center gap-1">
              <ElementIcon element="mystery" size={iconSize} variant="grunge" />
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
                <ElementIcon element={el} size={iconSize} variant="grunge" />
                {!compact ? (
                  <span className="text-on-parchment">{ELEMENT_LABELS_DE[el]}</span>
                ) : null}
              </span>
            ))
          )}
          {!info.useMysteryIcon &&
            info.elements.length === 0 &&
            info.icons.map((icon) => (
              <ElementIcon key={icon} element={icon} size={iconSize} variant="grunge" />
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
