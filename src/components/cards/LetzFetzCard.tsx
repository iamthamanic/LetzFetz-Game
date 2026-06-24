/**
 * Deterministic grunge TCG card frame — illustration + labeled rule text.
 * Location: src/components/cards/LetzFetzCard.tsx
 */
import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { resolveCardBackPath } from '../../services/cardArt/manifest';
import type { ForgeCardKind } from '../../services/cardForge/categories';
import type { ForgeElement } from '../../services/cardForge/types';
import { buildCardDisplayModel } from './cardDisplayModel';
import { ELEMENT_ACCENTS, KIND_LABELS } from './cardFrameTokens';

export type LetzFetzCardSize = 'sm' | 'md' | 'lg';

export interface LetzFetzCardProps {
  id: string;
  name: string;
  type: ForgeCardKind;
  element: ForgeElement;
  elementDisplay?: string;
  stats_json?: {
    hp?: number;
    value?: number;
    cardType?: string;
    resistance?: number;
  };
  effects?: string[];
  effects_text?: string;
  image_asset?: string;
  size?: LetzFetzCardSize;
  interactive?: boolean;
  selected?: boolean;
  exhausted?: boolean;
  faceDown?: boolean;
  draggable?: boolean;
  onClick?: () => void;
  onEffectsClick?: () => void;
  disabled?: boolean;
  footerNote?: string;
  className?: string;
}

const SIZE_CLASSES: Record<LetzFetzCardSize, string> = {
  lg: 'w-64 h-96',
  md: 'w-36 h-52',
  sm: 'w-24 h-32',
};

export function LetzFetzCard({
  id,
  name,
  type,
  element,
  elementDisplay,
  stats_json,
  effects,
  effects_text,
  image_asset,
  size = 'lg',
  interactive = false,
  selected = false,
  exhausted = false,
  faceDown = false,
  draggable = false,
  onClick,
  onEffectsClick,
  disabled = false,
  footerNote,
  className = '',
}: LetzFetzCardProps) {
  const accent = ELEMENT_ACCENTS[element] ?? ELEMENT_ACCENTS.Neutral;
  const display = buildCardDisplayModel({
    type,
    element,
    elementDisplay,
    effects,
    effects_text,
    stats_json,
  });

  if (faceDown) {
    return (
      <div
        data-card-id={id}
        data-testid="card-back"
        className={`${SIZE_CLASSES[size]} relative overflow-hidden rounded-sm border-2 border-stone-700 bg-stone-950 shadow-lg ${className}`}
        aria-label="Verdeckte Karte"
      >
        <GrungeOverlay />
        <img
          src={resolveCardBackPath()}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  if (size === 'sm') {
    const smDisabled = disabled || !onClick;
    return (
      <button
        type="button"
        onClick={smDisabled ? undefined : onClick}
        disabled={smDisabled}
        aria-disabled={smDisabled}
        aria-label={name || KIND_LABELS[type]}
        data-card-id={id}
        className={`${SIZE_CLASSES.sm} relative overflow-hidden rounded-sm border-2 border-stone-700 bg-[#12100e] text-left shadow-lg transition-all ${selected ? 'ring-2 ring-amber-400 scale-105' : ''} ${exhausted ? 'opacity-50 rotate-90' : ''} ${!smDisabled ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'} ${className}`}
      >
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent.stripe}`} />
        <GrungeOverlay />
        {image_asset ? (
          <ImageWithFallback
            src={image_asset}
            alt={name}
            className="absolute inset-x-0 top-0 h-[55%] w-full object-cover opacity-90"
            loading="lazy"
          />
        ) : (
          <div className={`absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b ${accent.glow}`} />
        )}
        <div className="absolute inset-x-0 top-[52%] h-px bg-amber-900/50" />
        <div className="absolute inset-x-0 bottom-0 top-[54%] bg-[#1c1712]/95 p-1">
          <p className="truncate text-[8px] font-bold uppercase tracking-wide text-amber-100/90">{name}</p>
          {stats_json?.value != null && (
            <p className="text-lg font-black leading-none text-white">{stats_json.value}</p>
          )}
          <p className="text-[7px] uppercase text-stone-400">{display.statCells[0]?.value ?? type.slice(0, 3)}</p>
        </div>
      </button>
    );
  }

  const compact = size === 'md';
  const usesButton = onClick !== undefined || disabled;
  const isDisabled = disabled || !onClick;

  const frameClass = [
    SIZE_CLASSES[size],
    'relative overflow-hidden rounded-sm border-2 border-stone-700/90 bg-[#0f0d0b] shadow-2xl',
    'ring-1 ring-inset ring-amber-950/30',
    interactive ? 'cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform' : '',
    usesButton && !isDisabled && !interactive ? 'cursor-pointer hover:scale-[1.02] transition-transform' : '',
    usesButton && isDisabled ? 'cursor-not-allowed' : '',
    selected ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-stone-950' : '',
    exhausted ? 'opacity-60 rotate-2' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const cardBody = (
    <>
      <div className={`absolute left-0 top-0 bottom-0 ${compact ? 'w-1' : 'w-1.5'} ${accent.stripe} z-20`} />
      <GrungeOverlay />

      <div
        className={`relative z-10 border-b border-amber-900/50 bg-[#2a2218] ${compact ? 'px-2 pb-1 pt-1' : 'px-3 pb-2 pt-2'}`}
        style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 92%, 0 100%)' }}
      >
        <div className="flex items-start justify-between gap-1">
          <span className={`font-bold uppercase tracking-[0.18em] text-amber-500/90 ${compact ? 'text-[8px]' : 'text-[9px]'}`}>
            {KIND_LABELS[type]}
          </span>
          {display.elementLabel && (
            <span className={`rounded border font-semibold uppercase tracking-wide ${accent.badge} ${compact ? 'px-1 text-[7px]' : 'px-1.5 py-0.5 text-[9px]'}`}>
              {display.elementLabel}
            </span>
          )}
        </div>
        <h3 className={`mt-0.5 truncate font-serif font-bold uppercase tracking-wide text-amber-50 ${compact ? 'text-[11px]' : 'text-sm'}`}>
          {name || 'Unnamed Card'}
        </h3>
      </div>

      <div className={`relative w-full overflow-hidden bg-[#090807] ${compact ? 'h-[48%]' : 'h-[58%]'}`}>
        {image_asset ? (
          <ImageWithFallback src={image_asset} alt={name} className="h-full w-full object-cover object-center" loading="lazy" />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-b ${accent.glow}`}>
            <span className={`opacity-30 ${compact ? 'text-3xl' : 'text-5xl'}`}>{typeIcon(type)}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f0d0b] via-transparent to-[#0f0d0b]/30" />
        {exhausted && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/55">
            <span className={`rotate-[-12deg] rounded border border-stone-600 bg-stone-900/90 font-bold uppercase tracking-wider text-stone-400 ${compact ? 'px-1 text-[8px]' : 'px-1.5 py-0.5 text-[9px]'}`}>
              Erschöpft
            </span>
          </div>
        )}
      </div>

      {display.statCells.length > 0 && (
        <div className="relative z-10 flex border-y border-stone-800 bg-[#15110d]">
          {display.statCells.map((cell) => (
            <div key={cell.label} className={`flex-1 border-r border-stone-800/80 last:border-r-0 ${compact ? 'px-1 py-0.5' : 'px-2 py-1.5'}`}>
              <div className={`font-bold uppercase tracking-widest text-stone-500 ${compact ? 'text-[7px]' : 'text-[8px]'}`}>{cell.label}</div>
              <div className={`font-black text-amber-50 ${compact ? 'text-[11px]' : 'text-sm'}`}>{cell.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className={`relative z-10 overflow-hidden bg-[#1f1812] ${compact ? 'px-1.5 py-1 max-h-[24%]' : 'px-2.5 py-2 max-h-[26%]'}`}>
        <div className="relative space-y-0.5">
          {display.textBlocks.slice(0, compact ? 2 : 2).map((block, index) => (
            <div key={`${block.label}-${index}`}>
              <div className={`font-bold uppercase tracking-widest text-amber-600/90 ${compact ? 'text-[7px]' : 'text-[8px]'}`}>{block.label}</div>
              <p className={`leading-snug text-amber-100/90 line-clamp-2 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>{block.text}</p>
            </div>
          ))}
        </div>
        {footerNote && (
          <p className={`mt-1 border-t border-amber-900/40 pt-1 font-semibold text-amber-400/90 ${compact ? 'text-[8px]' : 'text-[10px]'}`}>
            {footerNote}
          </p>
        )}
      </div>
    </>
  );

  if (!usesButton) {
    return (
      <div data-card-id={id} draggable={draggable} className={frameClass} aria-label={name || KIND_LABELS[type]}>
        {cardBody}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-label={name || KIND_LABELS[type]}
      data-card-id={id}
      draggable={draggable}
      className={frameClass}
    >
      {cardBody}
    </button>
  );
}

function typeIcon(type: ForgeCardKind): string {
  const icons: Record<ForgeCardKind, string> = {
    Character: '⚔️',
    Ultimate: '💫',
    Element: '🃏',
    Arena: '🏟️',
    Glitch: '🌀',
  };
  return icons[type];
}

function GrungeOverlay() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-30 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 4px)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-30 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.08)_0.5px,transparent_0.5px)] [background-size:3px_3px]" />
      <div className="pointer-events-none absolute inset-0 z-40 shadow-[inset_0_0_12px_rgba(0,0,0,0.45)]" />
      <div className="pointer-events-none absolute left-0 top-0 z-40 h-2 w-2 border-l border-t border-amber-700/40" />
      <div className="pointer-events-none absolute right-0 top-0 z-40 h-2 w-2 border-r border-t border-amber-700/40" />
      <div className="pointer-events-none absolute bottom-0 left-0 z-40 h-2 w-2 border-b border-l border-amber-900/50" />
      <div className="pointer-events-none absolute bottom-0 right-0 z-40 h-2 w-2 border-b border-r border-amber-900/50" />
    </>
  );
}
