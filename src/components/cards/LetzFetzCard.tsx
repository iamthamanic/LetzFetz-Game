/**
 * Grunge card frame — portrait layout (default) or legacy tcg density.
 * Location: src/components/cards/LetzFetzCard.tsx
 */
import React from 'react';
import type { Element } from '../../game/types';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { CardGrungeOverlay } from '../ui/CardGrungeOverlay';
import { CardIllustrationLoop } from '../ui/CardIllustrationLoop';
import { CardNamePlate } from '../ui/CardNamePlate';
import { CharacterCardGlitch } from '../ui/CharacterCardGlitch';
import { ElementIcon } from '../ui/ElementIcon';
import type { ForgeCardKind } from '../../services/cardForge/categories';
import type { ForgeElement } from '../../services/cardForge/types';
import { forgeElementToBrandIconKey } from '../../services/icons/elementIcons';
import { resolveCardBackPath } from '../../services/cardArt/manifest';
import { buildCardDisplayModel } from './cardDisplayModel';
import { buildCardPortraitPresentation } from './cardPortraitPresentation';
import {
  CHARACTER_ELEMENT_STRIPE_FROM,
  CHARACTER_ELEMENT_STRIPE_TO,
  ELEMENT_ACCENTS,
  KIND_LABELS,
} from './cardFrameTokens';
import { CardDividerBar, CardFrameCorners } from './grungeCardParts';

export type LetzFetzCardSize = 'sm' | 'md' | 'lg' | 'fluid';
export type LetzFetzCardLayout = 'portrait' | 'tcg';

export interface LetzFetzCardProps {
  id: string;
  name: string;
  type: ForgeCardKind;
  element: ForgeElement;
  elementDisplay?: string;
  gameElements?: [Element, Element];
  role?: string;
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
  layout?: LetzFetzCardLayout;
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
  imageFit?: 'cover' | 'contain';
  /** Character idle loop when MP4 exists (setup center + forge preview). */
  animateIllustration?: boolean;
  'data-testid'?: string;
}

const SIZE_CLASSES: Record<LetzFetzCardSize, string> = {
  lg: 'w-64 h-96',
  md: 'w-36 h-52',
  sm: 'w-24 h-32',
  fluid: 'aspect-[2/3] w-full max-w-[280px]',
};

function noiseFilterId(id: string): string {
  return `lfz-noise-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
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

export function LetzFetzCard({
  id,
  name,
  type,
  element,
  elementDisplay,
  gameElements,
  role,
  stats_json,
  effects,
  effects_text,
  image_asset,
  size = 'lg',
  layout = 'portrait',
  interactive = false,
  selected = false,
  exhausted = false,
  faceDown = false,
  draggable = false,
  onClick,
  disabled = false,
  footerNote,
  className = '',
  imageFit = 'cover',
  animateIllustration = false,
  'data-testid': dataTestId,
}: LetzFetzCardProps) {
  const accent = ELEMENT_ACCENTS[element] ?? ELEMENT_ACCENTS.Neutral;
  const filterId = noiseFilterId(id);
  const brandIcon = forgeElementToBrandIconKey(element);
  const compact = size === 'md' || size === 'sm';
  const portrait = layout === 'portrait';
  const display = buildCardDisplayModel({
    type,
    element,
    elementDisplay,
    effects,
    effects_text,
    stats_json,
  });
  const presentation = portrait
    ? buildCardPortraitPresentation({
        id,
        type,
        element,
        elementDisplay,
        gameElements,
        role,
        effects,
        effects_text,
        stats_json,
        size,
      })
    : null;

  if (faceDown) {
    return (
      <div
        data-card-id={id}
        data-testid={dataTestId ?? 'card-back'}
        className={`${SIZE_CLASSES[size]} character-card-frame relative overflow-hidden rounded-[2px] shadow-xl ${className}`}
        aria-label="Verdeckte Karte"
      >
        <CharacterCardGlitch />
        <CardFrameCorners />
        <img
          src={resolveCardBackPath()}
          alt=""
          aria-hidden
          className="absolute inset-0 z-[1] h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <CardGrungeOverlay filterId={filterId} mode="art-panel" />
      </div>
    );
  }

  const usesButton = onClick !== undefined || disabled;
  const isDisabled = disabled || !onClick;
  const stripeWidth = size === 'sm' ? 'w-1' : compact ? 'w-1' : 'w-1.5';

  const frameClass = [
    SIZE_CLASSES[size],
    'character-card-frame relative flex flex-col overflow-hidden rounded-[2px] text-center shadow-xl ring-1 ring-inset ring-amber-950/25',
    selected ? 'character-card-frame-highlighted ring-amber-700/30 ring-2 ring-amber-400' : '',
    interactive ? 'cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform' : '',
    usesButton && !isDisabled && !interactive ? 'cursor-pointer hover:scale-[1.02] transition-transform' : '',
    usesButton && isDisabled ? 'cursor-not-allowed' : '',
    size === 'sm' && usesButton && !isDisabled ? 'hover:scale-105' : '',
    size === 'sm' && selected ? 'scale-105' : '',
    exhausted ? (size === 'sm' ? 'opacity-50 rotate-90' : 'opacity-60 rotate-2') : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const stripe =
    portrait &&
    type === 'Character' &&
    gameElements &&
    !presentation?.useMysteryIcon ? (
      <div
        className={`pointer-events-none absolute bottom-0 left-0 top-0 z-20 ${stripeWidth} bg-gradient-to-b ${CHARACTER_ELEMENT_STRIPE_FROM[gameElements[0]]} via-stone-800/90 ${CHARACTER_ELEMENT_STRIPE_TO[gameElements[1]]}`}
        aria-hidden
      />
    ) : (
      <div
        className={`pointer-events-none absolute bottom-0 left-0 top-0 z-20 ${stripeWidth} ${accent.stripe}`}
        aria-hidden
      />
    );

  const portraitHeader =
    portrait && size !== 'sm' && presentation ? (
      <div
        className={`parchment-bar-header parchment-bar-beige parchment-bar-noise relative z-10 shrink-0 border-b ${compact ? 'px-1.5 pb-1 pt-1' : 'px-2 pb-2 pt-2'}`}
      >
        <div className="parchment-bar-stain" aria-hidden />
        <div className="relative z-[1] flex justify-center gap-1.5">
          {presentation.useMysteryIcon ? (
            <ElementIcon element="mystery" size="sm" variant="grunge" />
          ) : (
            presentation.headerIcons.map((icon) => (
              <ElementIcon key={icon} element={icon} size="sm" variant="grunge" />
            ))
          )}
        </div>
        <CardDividerBar className={`relative z-[1] ${compact ? 'mt-1' : 'mt-2'}`} />
      </div>
    ) : null;

  const tcgHeader = !portrait ? (
    <div
      className={`parchment-bar-header parchment-bar-beige parchment-bar-noise relative z-10 shrink-0 border-b ${compact ? 'px-1.5 pb-1 pt-1' : 'px-2.5 pb-1.5 pt-1.5'}`}
    >
      <div className="parchment-bar-stain" aria-hidden />
      <div className="relative z-[1] flex items-center justify-between gap-1">
        <span
          className={`grunge-card-kind-label uppercase tracking-[0.14em] ${compact ? 'text-[7px]' : 'text-[8px]'}`}
        >
          {KIND_LABELS[type]}
        </span>
        <ElementIcon element={brandIcon} size="sm" variant="grunge" />
      </div>
      <CardDividerBar className={`relative z-[1] ${compact ? 'mt-1' : 'mt-1.5'}`} />
    </div>
  ) : null;

  const fit = portrait && presentation ? presentation.imageFit : imageFit;
  const imageClass = `relative z-[1] h-full w-full object-center ${fit === 'contain' ? 'object-contain p-1' : 'object-cover'} ${size === 'sm' ? 'opacity-90' : ''}`;
  const useCharacterIdle = animateIllustration && type === 'Character';

  const artPanel = (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-[#090807]">
      <CardGrungeOverlay filterId={filterId} mode="art-panel" />
      {useCharacterIdle ? (
        <CardIllustrationLoop
          cardId={id}
          variant="idle"
          posterSrc={image_asset}
          className={imageClass}
          testId={`character-idle-${id}`}
        />
      ) : image_asset ? (
        <ImageWithFallback
          src={image_asset}
          alt=""
          aria-hidden
          className={imageClass}
          loading="lazy"
        />
      ) : (
        <div
          className={`relative z-[1] flex h-full w-full items-center justify-center bg-gradient-to-b ${accent.glow}`}
        >
          <span className={`opacity-30 ${compact ? 'text-3xl' : 'text-5xl'}`}>{typeIcon(type)}</span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#5a5048]/90 via-transparent to-brand-beige-shadow/15" />
      {exhausted && size !== 'sm' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/55">
          <span
            className={`rotate-[-12deg] rounded border border-stone-600 bg-stone-900/90 font-bold uppercase tracking-wider text-stone-400 ${compact ? 'px-1 text-[8px]' : 'px-1.5 py-0.5 text-[9px]'}`}
          >
            Erschöpft
          </span>
        </div>
      )}
    </div>
  );

  const portraitFooter = portrait && presentation ? (
    <div
      className={`parchment-bar-footer parchment-bar-beige parchment-bar-noise relative z-10 shrink-0 overflow-visible border-t ${compact ? 'px-1.5 pb-1 pt-1' : 'px-2 pb-1.5 pt-1.5'}`}
    >
      <div className="parchment-bar-stain" aria-hidden />
      <div className="parchment-bar-drips" aria-hidden />
      <CardDividerBar className={`relative z-[1] ${compact ? 'mb-0.5' : 'mb-1'}`} />
      <CardNamePlate
        cardId={id}
        name={name || KIND_LABELS[type]}
        size={presentation.namePlateSize}
      />
      {presentation.subtitle && (
        <p
          className={`character-card-role-on-beige relative z-[1] mx-auto max-w-[95%] text-center leading-snug ${size === 'sm' ? 'line-clamp-1 text-[8px]' : 'line-clamp-2 text-[10px] md:text-xs'}`}
        >
          {presentation.subtitle}
        </p>
      )}
      {footerNote && (
        <p
          className={`relative z-[1] mt-1 border-t border-brand-blood/25 pt-1 font-semibold text-brand-blood/80 ${compact ? 'text-[7px]' : 'text-[8px]'}`}
        >
          {footerNote}
        </p>
      )}
    </div>
  ) : null;

  const tcgStatBar =
    !portrait && display.statCells.length > 0 ? (
      <div
        className={`parchment-bar-stats parchment-bar-beige parchment-bar-noise relative z-10 flex shrink-0 border-y border-brand-blood/20 ${compact ? 'py-0.5' : 'py-1'}`}
      >
        <div className="parchment-bar-stain" aria-hidden />
        {display.statCells.map((cell) => (
          <div
            key={cell.label}
            className={`relative z-[1] flex-1 border-r border-brand-blood/15 last:border-r-0 ${compact ? 'px-1' : 'px-2'}`}
          >
            <div
              className={`grunge-card-stat-label uppercase tracking-widest ${compact ? 'text-[6px]' : 'text-[7px]'}`}
            >
              {cell.label}
            </div>
            <div className={`grunge-card-stat-value ${compact ? 'text-[11px]' : 'text-sm'}`}>{cell.value}</div>
          </div>
        ))}
      </div>
    ) : null;

  const tcgFooter = !portrait ? (
    <div
      className={`parchment-bar-footer parchment-bar-beige parchment-bar-noise relative z-10 shrink-0 overflow-hidden border-t ${compact ? 'px-1.5 pb-1 pt-1 max-h-[38%]' : 'px-2.5 pb-2 pt-1.5 max-h-[34%]'}`}
    >
      <div className="parchment-bar-stain" aria-hidden />
      <div className="parchment-bar-drips" aria-hidden />
      <CardDividerBar className={`relative z-[1] ${compact ? 'mb-1' : 'mb-1.5'}`} />
      <CardNamePlate cardId={id} name={name || 'Unnamed Card'} size={compact ? 'md' : 'lg'} />
      <div className={`relative z-[1] mt-1 space-y-0.5 ${display.textBlocks.length === 0 ? 'hidden' : ''}`}>
        {display.textBlocks.slice(0, 2).map((block, index) => (
          <div key={`${block.label}-${index}`}>
            <div
              className={`grunge-card-rule-label uppercase tracking-widest ${compact ? 'text-[6px]' : 'text-[7px]'}`}
            >
              {block.label}
            </div>
            <p
              className={`grunge-card-rule-text line-clamp-2 leading-snug ${compact ? 'text-[8px]' : 'text-[9px]'}`}
            >
              {block.text}
            </p>
          </div>
        ))}
      </div>
      {footerNote && (
        <p
          className={`relative z-[1] mt-1 border-t border-brand-blood/25 pt-1 font-semibold text-brand-blood/80 ${compact ? 'text-[7px]' : 'text-[8px]'}`}
        >
          {footerNote}
        </p>
      )}
    </div>
  ) : null;

  const cardBody = (
    <>
      {stripe}
      <CharacterCardGlitch />
      <CardFrameCorners />
      {portraitHeader ?? tcgHeader}
      {artPanel}
      {portrait ? null : tcgStatBar}
      {portraitFooter ?? tcgFooter}
    </>
  );

  const ariaLabel = name || KIND_LABELS[type];

  if (!usesButton) {
    return (
      <div
        data-card-id={id}
        data-testid={dataTestId}
        draggable={draggable}
        className={frameClass}
        aria-label={ariaLabel}
      >
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
      aria-label={ariaLabel}
      data-card-id={id}
      data-testid={dataTestId}
      draggable={draggable}
      className={frameClass}
    >
      {cardBody}
    </button>
  );
}
