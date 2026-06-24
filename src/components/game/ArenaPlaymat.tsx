/**
 * Full-bleed arena playmat background (top-down art or card-art fallback).
 * Location: src/components/game/ArenaPlaymat.tsx
 */
import React, { useMemo, useState } from 'react';
import { getArenaTheme } from './arenaTheme';
import {
  resolvePlaymatBackground,
  type PlaymatBackgroundSource,
} from './playmat/playmatAssets';

interface ArenaPlaymatProps {
  arenaId: string;
}

export function ArenaPlaymat({ arenaId }: ArenaPlaymatProps) {
  const theme = getArenaTheme(arenaId);
  const background = useMemo(() => resolvePlaymatBackground(arenaId), [arenaId]);
  const [source, setSource] = useState<PlaymatBackgroundSource>(
    background.hasShippedTopdown ? 'topdown' : 'fallback',
  );

  const src = source === 'topdown' ? background.topdown : background.fallback;

  return (
    <div
      data-testid="arena-playmat"
      data-arena-id={arenaId}
      data-playmat-source={source}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        onError={() => {
          if (source === 'topdown') {
            setSource('fallback');
          }
        }}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-80`} />
      <div className={`absolute inset-0 ${theme.tint}`} />
      <div className="absolute inset-0 bg-stone-950/25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,0.45)_100%)]" />
    </div>
  );
}
