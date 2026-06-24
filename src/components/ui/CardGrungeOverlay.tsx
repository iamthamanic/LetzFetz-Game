/**
 * Shared grunge noise, vignette, and corner rivets for TCG card frames.
 * Location: src/components/ui/CardGrungeOverlay.tsx
 */
import React from 'react';

type CardGrungeOverlayMode = 'full' | 'art-panel';

interface CardGrungeOverlayProps {
  /** Unique id for SVG noise filter (required when multiple cards on screen). */
  filterId?: string;
  /** `art-panel` = dark illustration only (no white wash on parchment). */
  mode?: CardGrungeOverlayMode;
}

export function CardGrungeOverlay({ filterId, mode = 'full' }: CardGrungeOverlayProps) {
  const artPanel = mode === 'art-panel';

  return (
    <>
      {filterId && (
        <svg
          className={`pointer-events-none absolute inset-0 z-[45] h-full w-full ${
            artPanel ? 'opacity-[0.38] mix-blend-multiply' : 'opacity-[0.44] mix-blend-overlay'
          }`}
          aria-hidden
        >
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="5" stitchTiles="stitch" />
            <feColorMatrix
              type="matrix"
              values={
                artPanel
                  ? '0 0 0 0 0.15 0 0 0 0 0.12 0 0 0 0 0.1 0 0 0 1 0'
                  : '0 0 0 0 0.88 0 0 0 0 0.8 0 0 0 0 0.68 0 0 0 1 0'
              }
            />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${filterId})`} />
        </svg>
      )}

      {filterId && !artPanel && (
        <svg
          className="pointer-events-none absolute inset-0 z-[44] h-full w-full opacity-[0.22] mix-blend-multiply"
          aria-hidden
        >
          <filter id={`${filterId}-fine`}>
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${filterId}-fine)`} />
        </svg>
      )}

      {!artPanel && (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-[42] opacity-[0.22] mix-blend-overlay"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 2px)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-[42] opacity-[0.45] [background-image:radial-gradient(rgba(255,255,255,0.14)_0.5px,transparent_0.5px)] [background-size:2px_2px]"
          />
        </>
      )}

      <div className="pointer-events-none absolute inset-0 z-[43] shadow-[inset_0_0_22px_rgba(0,0,0,0.58),inset_0_0_48px_rgba(0,0,0,0.38)]" />

      {!artPanel && (
        <>
          <div className="pointer-events-none absolute left-2 top-5 z-[44] h-14 w-px rotate-[22deg] bg-gradient-to-b from-transparent via-brand-beige/45 to-transparent" />
          <div className="pointer-events-none absolute right-2 top-8 z-[44] h-10 w-px -rotate-[18deg] bg-gradient-to-b from-transparent via-brand-blood/55 to-transparent" />
          <div className="pointer-events-none absolute bottom-16 left-3 z-[44] h-8 w-px rotate-[12deg] bg-gradient-to-b from-brand-blood/35 to-transparent" />
          <div className="pointer-events-none absolute bottom-20 right-5 z-[44] h-6 w-px -rotate-[8deg] bg-gradient-to-b from-brand-outline/30 to-transparent" />

          <div className="pointer-events-none absolute left-0 top-0 z-[46] h-4 w-4 border-l-2 border-t-2 border-brand-beige/55" />
          <div className="pointer-events-none absolute right-0 top-0 z-[46] h-4 w-4 border-r-2 border-t-2 border-brand-beige/55" />
          <div className="pointer-events-none absolute bottom-0 left-0 z-[46] h-4 w-4 border-b-2 border-l-2 border-brand-blood/55" />
          <div className="pointer-events-none absolute bottom-0 right-0 z-[46] h-4 w-4 border-b-2 border-r-2 border-brand-blood/55" />
        </>
      )}
    </>
  );
}
