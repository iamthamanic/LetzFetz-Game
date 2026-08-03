/**
 * Effect prose with inline Elementmarke chips (icon + label + hover tooltip).
 * Location: src/components/cards/EffectTextWithMarks.tsx
 */
import React from 'react';
import { ElementMarkToken } from './ElementMarkToken';
import {
  parseEffectTextMarks,
  primaryMarkSurfaceLabelDe,
} from './parseEffectTextMarks';
import { primaryMarkTooltipDe } from './primaryMarkEffectCopy';

interface EffectTextWithMarksProps {
  text: string;
  className?: string;
  /** Token size; sm matches compact CardElementMarks chips. */
  markSize?: 'sm' | 'md';
  testId?: string;
}

/**
 * Renders German effect copy; known Primärmarken become icon+label chips
 * with the same Wirkungstooltip as CardElementMarks / ElementMarkToken.
 */
export function EffectTextWithMarks({
  text,
  className = '',
  markSize = 'sm',
  testId = 'effect-text-with-marks',
}: EffectTextWithMarksProps) {
  const segments = parseEffectTextMarks(text);

  return (
    <span className={className} data-testid={testId} aria-label={text || undefined}>
      {segments.map((seg, i) => {
        if (seg.kind === 'text') {
          return <React.Fragment key={`t-${i}`}>{seg.value}</React.Fragment>;
        }
        const label = primaryMarkSurfaceLabelDe(seg.markId);
        const tip = primaryMarkTooltipDe(seg.markId);
        return (
          <span
            key={`m-${i}-${seg.markId}`}
            className="mx-0.5 inline-flex translate-y-[0.1em] items-center gap-0.5 align-middle"
            data-testid={`effect-mark-chip-${seg.markId}`}
            title={tip}
          >
            <ElementMarkToken markId={seg.markId} size={markSize} />
            <span className="text-on-parchment text-[10px] font-semibold leading-none">
              {label}
            </span>
          </span>
        );
      })}
    </span>
  );
}
