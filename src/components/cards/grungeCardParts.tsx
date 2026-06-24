/**
 * Shared grunge card chrome — dividers and corner rivets.
 * Location: src/components/cards/grungeCardParts.tsx
 */
import React from 'react';

export function CardDividerBar({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      <div className="card-divider-grunge w-full" />
      <div className="card-divider-grunge-line w-full" />
    </div>
  );
}

export function CardFrameCorners() {
  return (
    <>
      <div className="pointer-events-none absolute left-0 top-0 z-[46] h-3 w-3 border-l-2 border-t-2 border-brand-beige/50" />
      <div className="pointer-events-none absolute right-0 top-0 z-[46] h-3 w-3 border-r-2 border-t-2 border-brand-beige/50" />
      <div className="pointer-events-none absolute bottom-0 left-0 z-[46] h-3 w-3 border-b-2 border-l-2 border-brand-blood/55" />
      <div className="pointer-events-none absolute bottom-0 right-0 z-[46] h-3 w-3 border-b-2 border-r-2 border-brand-blood/55" />
    </>
  );
}
