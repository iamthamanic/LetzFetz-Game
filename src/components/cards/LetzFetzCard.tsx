/**
 * Deterministic grunge TCG card frame — illustration + labeled rule text.
 * Location: src/components/cards/LetzFetzCard.tsx
 */
import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { ForgeCardKind } from '../../services/cardForge/categories';
import type { ForgeElement } from '../../services/cardForge/types';
import { buildCardDisplayModel } from './cardDisplayModel';
import { ELEMENT_ACCENTS, KIND_LABELS } from './cardFrameTokens';

export type LetzFetzCardSize = 'sm' | 'lg';

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
  className?: string;
}

const SIZE_CLASSES: Record<LetzFetzCardSize, string> = {
  lg: 'w-64 h-96',
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
        className={`${SIZE_CLASSES[size]} relative rounded-sm border-2 border-stone-700 bg-gradient-to-br from-stone-900 via-stone-950 to-black shadow-lg ${className}`}
      >
        <GrungeOverlay />
        <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-60">🂠</div>
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        data-card-id={id}
        className={`${SIZE_CLASSES.sm} relative overflow-hidden rounded-sm border-2 border-stone-700 bg-[#12100e] text-left shadow-lg transition-all ${selected ? 'ring-2 ring-amber-400 scale-105' : ''} ${exhausted ? 'opacity-50 rotate-90' : ''} ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
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

  const rootTag = onClick ? 'button' : 'div';
  const rootProps = onClick
    ? { type: 'button' as const, onClick, disabled: !onClick }
    : {};

  return React.createElement(
    rootTag,
    {
      ...rootProps,
      'data-card-id': id,
      draggable,
      className: [
        SIZE_CLASSES.lg,
        'relative overflow-hidden rounded-sm border-2 border-stone-800 bg-[#0f0d0b] shadow-2xl',
        interactive ? 'cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform' : '',
        selected ? 'ring-2 ring-amber-400' : '',
        exhausted ? 'opacity-60 rotate-2' : '',
        className,
      ]
        .filter(Boolean)
        .join(' '),
    },
    <>
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accent.stripe} z-20`} />
      <GrungeOverlay />

      {/* Top torn banner */}
      <div
        className="relative z-10 border-b border-amber-900/40 bg-[#2a2218] px-3 pb-2 pt-2"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 92%, 0 100%)',
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-500/90">
            {KIND_LABELS[type]}
          </span>
          {display.elementLabel && (
            <span
              className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${accent.badge}`}
            >
              {display.elementLabel}
            </span>
          )}
        </div>
        <h3 className="mt-1 truncate font-serif text-sm font-bold uppercase tracking-wide text-amber-50">
          {name || 'Unnamed Card'}
        </h3>
      </div>

      {/* Illustration */}
      <div className="relative h-[58%] w-full overflow-hidden bg-[#090807]">
        {image_asset ? (
          <ImageWithFallback
            src={image_asset}
            alt={name}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-b ${accent.glow}`}>
            <span className="text-5xl opacity-30">{typeIcon(type)}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f0d0b] via-transparent to-[#0f0d0b]/30" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      {/* Stat strip */}
      {display.statCells.length > 0 && (
        <div className="relative z-10 flex border-y border-stone-800 bg-[#15110d]">
          {display.statCells.map((cell) => (
            <div key={cell.label} className="flex-1 border-r border-stone-800/80 px-2 py-1.5 last:border-r-0">
              <div className="text-[8px] font-bold uppercase tracking-widest text-stone-500">{cell.label}</div>
              <div className="text-sm font-black text-amber-50">{cell.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Parchment rule text */}
      <div
        className={`relative z-10 overflow-y-auto bg-[#1f1812] px-2.5 py-2 ${display.statCells.length > 0 ? 'max-h-[26%]' : 'max-h-[34%]'}`}
        onClick={(e) => {
          if (onEffectsClick) {
            e.stopPropagation();
            onEffectsClick();
          }
        }}
        role={onEffectsClick ? 'button' : undefined}
        title={onEffectsClick ? 'Click to view full effects' : undefined}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 3px)',
          }}
        />
        <div className="relative space-y-1.5">
          {display.textBlocks.length > 0 ? (
            display.textBlocks.map((block, index) => (
              <div key={`${block.label}-${index}`}>
                <div className="text-[8px] font-bold uppercase tracking-widest text-amber-600/90">
                  {block.label}
                </div>
                <p className="line-clamp-2 text-[10px] leading-snug text-amber-100/90">{block.text}</p>
              </div>
            ))
          ) : (
            <p className="text-[10px] italic text-stone-500">No effects described.</p>
          )}
          {display.footerBullets.slice(0, 2).map((line, index) => (
            <p key={`footer-${index}`} className="line-clamp-1 text-[9px] text-stone-400">
              {line}
            </p>
          ))}
        </div>
      </div>
    </>,
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
    </>
  );
}
