/**
 * Logo-style live text — grain overlay, stroke, optional glitch (not raster images).
 * Location: src/components/ui/BrandLogoText.tsx
 */
import React, { useId } from 'react';

type BrandLogoTextTag = 'h1' | 'h2' | 'h3' | 'span' | 'p';

interface BrandLogoTextProps {
  as?: BrandLogoTextTag;
  children: React.ReactNode;
  className?: string;
  /** Subtle edge glitch bars like logo */
  glitch?: boolean;
  /** dark = cream on stone UI; parchment = beige logo letters on card bars */
  surface?: 'dark' | 'parchment';
}

export function BrandLogoText({
  as: Tag = 'span',
  children,
  className = '',
  glitch = false,
  surface = 'dark',
}: BrandLogoTextProps) {
  const filterId = `brand-text-noise-${useId().replace(/:/g, '')}`;
  const surfaceClass =
    surface === 'parchment'
      ? 'character-card-name-logo font-brand uppercase relative inline-block'
      : 'brand-logo-text relative inline-block font-brand uppercase';

  return (
    <Tag className={`${surfaceClass} ${className}`}>
      <span className="brand-logo-text-inner relative z-[2]">{children}</span>
      {(surface === 'dark' || surface === 'parchment') && (
        <svg
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-[0.28] mix-blend-multiply"
          aria-hidden
        >
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${filterId})`} />
        </svg>
      )}
      {glitch && (
        <>
          <span className="brand-logo-glitch brand-logo-glitch--left" aria-hidden />
          <span className="brand-logo-glitch brand-logo-glitch--right" aria-hidden />
        </>
      )}
    </Tag>
  );
}
