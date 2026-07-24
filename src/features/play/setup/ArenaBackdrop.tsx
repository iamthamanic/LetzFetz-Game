/**
 * Ambient duel backdrop — blurred arena art + themed gradient overlay.
 * Location: src/features/play/setup/ArenaBackdrop.tsx
 */
import React from 'react';
import { resolveCardArtPath } from '../../../services/cardArt/manifest';
import { getArenaTheme } from '../board/arenaTheme';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';

interface ArenaBackdropProps {
  arenaId: string;
}

export function ArenaBackdrop({ arenaId }: ArenaBackdropProps) {
  const art = resolveCardArtPath(arenaId);
  const theme = getArenaTheme(arenaId);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
      data-testid="arena-backdrop"
    >
      {art ? (
        <ImageWithFallback
          src={art}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-[0.22] blur-2xl saturate-125"
          loading="lazy"
        />
      ) : null}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
      <div className={`absolute inset-0 ${theme.tint}`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,0.55)_100%)]" />
    </div>
  );
}
