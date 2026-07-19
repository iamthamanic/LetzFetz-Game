/**
 * Shared face-down card back — official Letz Fetz brand logo on a dark frame.
 * Location: src/components/cards/CardBackFace.tsx
 */
import React from 'react';
import { LETZ_FETZ_LOGO_SRC } from '../AppBrand';

interface CardBackFaceProps {
  className?: string;
  /** When true, omit outer border (parent already frames the card). */
  flush?: boolean;
}

export function CardBackFace({ className = '', flush = false }: CardBackFaceProps) {
  return (
    <div
      data-testid="card-back"
      className={`relative overflow-hidden bg-[#0c0a09] ${
        flush ? '' : 'rounded-[2px] border border-red-950/70 shadow-xl'
      } ${className}`}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-900 via-[#120e0b] to-black"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-[6%] rounded-sm border border-red-900/35"
        aria-hidden
      />
      <img
        src={LETZ_FETZ_LOGO_SRC}
        alt=""
        className="relative z-[1] h-full w-full object-contain p-[10%]"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
