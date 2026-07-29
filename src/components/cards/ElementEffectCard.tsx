/**
 * Portrait card face for a V3 Elementeffekt (library grid / preview).
 * Type badge „Effekt“ top-right with element icon stacked below.
 * Location: src/components/cards/ElementEffectCard.tsx
 */
import React from 'react';
import type { Element, PrimaryMarkId } from '../../game/types';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { CardGrungeOverlay } from '../ui/CardGrungeOverlay';
import { CardNamePlate } from '../ui/CardNamePlate';
import { ElementIcon, ELEMENT_LABELS_DE } from '../ui/ElementIcon';
import { CardDividerBar } from './grungeCardParts';
import {
  PRIMARY_MARK_LABEL_DE,
  resolvePrimaryMarkArtPath,
} from './elementMarkArt';

export type ElementEffectCardSize = 'sm' | 'md' | 'lg' | 'fluid';

interface ElementEffectCardProps {
  markId: PrimaryMarkId;
  element: Element;
  size?: ElementEffectCardSize;
  className?: string;
  'data-testid'?: string;
}

const SIZE_CLASSES: Record<ElementEffectCardSize, string> = {
  lg: 'w-64 h-96',
  md: 'w-36 h-52',
  sm: 'w-24 h-32',
  fluid: 'aspect-[2/3] w-full max-w-[280px]',
};

export function ElementEffectCard({
  markId,
  element,
  size = 'fluid',
  className = '',
  'data-testid': testId,
}: ElementEffectCardProps) {
  const compact = size === 'sm' || size === 'md';
  const name = PRIMARY_MARK_LABEL_DE[markId];
  const filterId = `lfz-noise-effect-${markId}`;

  return (
    <div
      className={`${SIZE_CLASSES[size]} character-card-frame relative flex flex-col overflow-hidden rounded-[2px] text-center shadow-xl ring-1 ring-inset ring-amber-950/25 ${className}`}
      data-testid={testId ?? `element-effect-card-${markId}`}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#090807]">
        <CardGrungeOverlay filterId={filterId} mode="art-panel" />
        <ImageWithFallback
          src={resolvePrimaryMarkArtPath(markId)}
          alt=""
          aria-hidden
          className="relative z-[1] h-full w-full object-center object-cover"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#5a5048]/90 via-transparent to-brand-beige-shadow/15" />

        {/* Badge stack is hit-testable (no pointer-events-none) so DOM picker / a11y can target it. */}
        <div
          className="absolute right-1 top-1 z-[3] flex flex-col items-end gap-0.5"
          data-testid="card-art-type-badge"
        >
          <span
            className={`rounded border border-stone-600/80 bg-black/90 font-black uppercase tracking-wide text-amber-100 shadow-md ${
              compact ? 'px-1 py-0.5 text-[7px] leading-tight' : 'px-1.5 py-0.5 text-[9px] leading-tight'
            }`}
            data-testid="card-type-badge"
          >
            Effekt
          </span>
          <span
            className={`element-badge element-badge-${element} element-badge-shimmer inline-flex items-center rounded border border-stone-600/80 bg-black/90 shadow-md ${
              compact ? 'gap-0.5 px-1 py-0.5' : 'gap-1 px-1.5 py-1'
            }`}
            data-testid="element-badge"
            data-element={element}
            aria-label={ELEMENT_LABELS_DE[element]}
          >
            <ElementIcon
              element={element}
              size="sm"
              airTone={element === 'air' ? 'neutral' : 'sky'}
              className={compact ? '!p-0.5 scale-[0.72]' : '!p-0.5 scale-[0.85]'}
            />
            <span className="element-badge-shimmer__shine" aria-hidden />
          </span>
        </div>
      </div>

      <div
        className={`parchment-bar-footer parchment-bar-beige parchment-bar-noise relative z-10 shrink-0 overflow-visible border-t ${
          compact ? 'px-1.5 pb-1 pt-1' : 'px-2 pb-1.5 pt-1.5'
        }`}
      >
        <div className="parchment-bar-stain" aria-hidden />
        <div className="parchment-bar-drips" aria-hidden />
        <CardDividerBar className={`relative z-[1] ${compact ? 'mb-0.5' : 'mb-1'}`} />
        <CardNamePlate cardId={`effect-${markId}`} name={name} size={size === 'lg' ? 'lg' : 'md'} />
        <p
          className={`text-on-parchment-muted relative z-[1] mx-auto max-w-[95%] text-center leading-snug ${
            size === 'sm' ? 'line-clamp-1 text-[8px]' : 'line-clamp-1 text-[10px] md:text-xs'
          }`}
        >
          {ELEMENT_LABELS_DE[element]}
        </p>
      </div>
    </div>
  );
}
