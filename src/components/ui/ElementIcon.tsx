/**
 * Color-coded icon for Letz Fetz elements (Feuer, Wasser, …) + mystery ??.
 * Location: src/components/ui/ElementIcon.tsx
 */
import React, { useState } from 'react';
import {
  Flame,
  Droplets,
  Mountain,
  Wind,
  Moon,
  Sun,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';
import type { Element } from '../../game';
import type { BrandIconKey } from '../../services/icons/elementIcons';
import { resolveBrandIconPath, resolveElementIconRasterPath } from '../../services/icons/elementIcons';

export const ELEMENT_LABELS_DE: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

export type ElementIconKind = Element | 'mystery';
export type ElementIconVariant = 'lucide' | 'brand' | 'grunge';

type ElementIconSize = 'sm' | 'md' | 'lg';

interface ElementIconProps {
  element: ElementIconKind;
  size?: ElementIconSize;
  animated?: boolean;
  showLabel?: boolean;
  variant?: ElementIconVariant;
  className?: string;
}

const SIZE_CLASSES: Record<ElementIconSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const RING_SIZE: Record<ElementIconSize, string> = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-11 w-11',
};

/** HF raster PNGs — plain img, no ring (grunge variant). */
const RASTER_SIZE: Record<ElementIconSize, string> = {
  sm: 'h-9 w-auto max-w-[2.75rem]',
  md: 'h-11 w-auto max-w-[3.25rem]',
  lg: 'h-14 w-auto max-w-[4rem]',
};

const LABEL_SIZE: Record<ElementIconSize, string> = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
};

const MYSTERY_GLYPH_SIZE: Record<ElementIconSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const ELEMENT_META: Record<
  Element,
  { Icon: LucideIcon; color: string; bg: string; border: string; animClass: string }
> = {
  fire: {
    Icon: Flame,
    color: 'text-red-400',
    bg: 'bg-red-950/60',
    border: 'border-red-500/55',
    animClass: 'element-icon-fire',
  },
  water: {
    Icon: Droplets,
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/60',
    border: 'border-cyan-500/55',
    animClass: 'element-icon-water',
  },
  earth: {
    Icon: Mountain,
    color: 'text-lime-400',
    bg: 'bg-lime-950/60',
    border: 'border-lime-500/55',
    animClass: 'element-icon-earth',
  },
  air: {
    Icon: Wind,
    color: 'text-sky-300',
    bg: 'bg-sky-950/60',
    border: 'border-sky-400/55',
    animClass: 'element-icon-air',
  },
  shadow: {
    Icon: Moon,
    color: 'text-purple-400',
    bg: 'bg-purple-950/60',
    border: 'border-purple-500/55',
    animClass: 'element-icon-shadow',
  },
  light: {
    Icon: Sun,
    color: 'text-amber-300',
    bg: 'bg-amber-950/60',
    border: 'border-amber-400/55',
    animClass: 'element-icon-light',
  },
};

const MYSTERY_META = {
  Icon: HelpCircle,
  color: 'text-purple-300',
  bg: 'bg-purple-950/60',
  border: 'border-purple-500/55',
  animClass: 'element-icon-shadow',
  label: 'Mysterium',
};

function brandIconKey(element: ElementIconKind): BrandIconKey {
  return element;
}

function GrungeElementIcon({
  element,
  size,
  className,
}: {
  element: ElementIconKind;
  size: ElementIconSize;
  className: string;
}) {
  const keyName = brandIconKey(element);
  const meta = element === 'mystery' ? MYSTERY_META : ELEMENT_META[element as Element];
  const rasterSrc = resolveElementIconRasterPath(keyName);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      data-testid={`element-icon-${element}`}
      aria-hidden
    >
      {element === 'mystery' ? (
        <span className={`element-icon-grunge-mystery ${meta.color} ${MYSTERY_GLYPH_SIZE[size]}`}>
          ??
        </span>
      ) : (
        <img
          src={rasterSrc}
          alt=""
          className={`element-icon-grunge-raster ${RASTER_SIZE[size]}`}
          loading="eager"
          decoding="async"
        />
      )}
    </span>
  );
}

/** Legacy HF/placeholder raster icons — not used on cards (use `grunge`). */
function BrandElementImage({
  element,
  size,
  animated,
  className,
}: {
  element: ElementIconKind;
  size: ElementIconSize;
  animated: boolean;
  className: string;
}) {
  const keyName = brandIconKey(element);
  const meta = element === 'mystery' ? MYSTERY_META : ELEMENT_META[element as Element];
  const [src, setSrc] = useState(resolveElementIconRasterPath(keyName));
  const svgFallback = resolveBrandIconPath(keyName);

  return (
    <span
      className={`element-icon-grunge-ring ${meta.border} ${RING_SIZE[size]} ${className} ${animated ? meta.animClass : ''}`}
      data-testid={`element-icon-${keyName}`}
      aria-hidden
    >
      <span className="element-icon-grunge-ring-noise" aria-hidden />
      <img
        src={src}
        alt=""
        className={`element-icon-grunge-raster relative z-[1] ${RASTER_SIZE[size]}`}
        onError={() => {
          if (src !== svgFallback) setSrc(svgFallback);
        }}
      />
    </span>
  );
}

export function ElementIcon({
  element,
  size = 'md',
  animated = true,
  showLabel = false,
  variant = 'lucide',
  className = '',
}: ElementIconProps) {
  if (variant === 'brand') {
    const iconNode = (
      <BrandElementImage element={element} size={size} animated={animated} className={className} />
    );

    if (!showLabel) return iconNode;

    const label =
      element === 'mystery' ? MYSTERY_META.label : ELEMENT_LABELS_DE[element as Element];

    return (
      <span className="inline-flex items-center gap-1.5" title={label}>
        {iconNode}
        <span className={`font-semibold text-brand-beige ${LABEL_SIZE[size]}`}>{label}</span>
      </span>
    );
  }

  if (variant === 'grunge') {
    const iconNode = (
      <GrungeElementIcon element={element} size={size} className={className} />
    );

    if (!showLabel) return iconNode;

    const label =
      element === 'mystery' ? MYSTERY_META.label : ELEMENT_LABELS_DE[element as Element];
    const meta = element === 'mystery' ? MYSTERY_META : ELEMENT_META[element as Element];

    return (
      <span className="inline-flex items-center gap-1.5" title={label}>
        {iconNode}
        <span className={`font-semibold ${meta.color} ${LABEL_SIZE[size]}`}>{label}</span>
      </span>
    );
  }

  const meta = element === 'mystery' ? MYSTERY_META : ELEMENT_META[element];
  const { Icon } = meta;

  const iconNode = (
    <span
      className={`inline-flex items-center justify-center rounded-full border ${meta.bg} ${meta.border} p-1 ${className}`}
      data-testid={`element-icon-${element}`}
      aria-hidden={!showLabel}
    >
      <Icon
        className={`${SIZE_CLASSES[size]} ${meta.color} ${animated ? meta.animClass : ''}`}
        strokeWidth={2.25}
      />
    </span>
  );

  if (!showLabel) {
    return iconNode;
  }

  const label = element === 'mystery' ? MYSTERY_META.label : ELEMENT_LABELS_DE[element];

  return (
    <span className="inline-flex items-center gap-1.5" title={label}>
      {iconNode}
      <span className={`font-semibold ${meta.color} ${LABEL_SIZE[size]}`}>{label}</span>
    </span>
  );
}
