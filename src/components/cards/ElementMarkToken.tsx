/**
 * Square Element effect thumbnail — image + optional stack count.
 * Location: src/components/cards/ElementMarkToken.tsx
 */
import React from 'react';
import type { PrimaryMarkId } from '../../game/types';
import {
  PRIMARY_MARK_LABEL_DE,
  resolvePrimaryMarkArtPath,
} from './elementMarkArt';

interface ElementMarkTokenProps {
  markId: PrimaryMarkId;
  stacks?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  testId?: string;
}

const SIZE_PX: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-12 w-12',
};

export function ElementMarkToken({
  markId,
  stacks = 1,
  size = 'md',
  className = '',
  testId,
}: ElementMarkTokenProps) {
  const label = PRIMARY_MARK_LABEL_DE[markId];
  const src = resolvePrimaryMarkArtPath(markId);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${SIZE_PX[size]} ${className}`}
      title={stacks > 1 ? `${label} ×${stacks}` : label}
      data-testid={testId ?? `element-mark-token-${markId}`}
    >
      <img
        src={src}
        alt={label}
        className="h-full w-full rounded-md border border-stone-600/80 object-cover shadow-md ring-1 ring-black/40"
        loading="lazy"
      />
      {stacks > 1 ? (
        <span className="absolute -bottom-0.5 -right-0.5 rounded bg-black/90 px-0.5 text-[8px] font-bold leading-none text-amber-100">
          ×{stacks}
        </span>
      ) : null}
    </span>
  );
}
