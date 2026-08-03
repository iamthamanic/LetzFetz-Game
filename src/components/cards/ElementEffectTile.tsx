/**
 * Element effect art tile — square preview + label (tutorial / teaching UI).
 * Location: src/components/cards/ElementEffectTile.tsx
 */
import React from 'react';
import type { Element, PrimaryMarkId } from '../../game/types';
import { ElementBadge } from '../ui/ElementBadge';
import { ELEMENT_LABELS_DE } from '../ui/ElementIcon';
import {
  PRIMARY_MARK_LABEL_DE,
  resolvePrimaryMarkArtPath,
} from './elementMarkArt';

interface ElementEffectTileProps {
  markId: PrimaryMarkId;
  element: Element;
  testId?: string;
}

export function ElementEffectTile({
  markId,
  element,
  testId,
}: ElementEffectTileProps) {
  const label = PRIMARY_MARK_LABEL_DE[markId];
  const src = resolvePrimaryMarkArtPath(markId);

  return (
    <figure
      className="flex flex-col overflow-hidden rounded-lg border border-stone-700/70 bg-stone-900/80"
      data-testid={testId ?? `tutorial-mark-${markId}`}
    >
      <div className="relative aspect-square w-full bg-black">
        <img
          src={src}
          alt={label}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <figcaption className="flex items-center gap-1.5 border-t border-stone-700/60 px-2 py-1.5">
        <ElementBadge element={element} compact />
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold text-stone-100">{label}</p>
          <p className="truncate text-[9px] text-stone-500">{ELEMENT_LABELS_DE[element]}</p>
        </div>
      </figcaption>
    </figure>
  );
}
