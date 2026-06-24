/**
 * Full-bleed arena playmat background (top-down art or card-art fallback).
 * Location: src/components/game/ArenaPlaymat.tsx
 */
import React, { useMemo, useState } from 'react';
import { getPlaymatLayoutForArena } from './playmat';
import { getArenaTheme } from './arenaTheme';

interface ArenaPlaymatProps {
  arenaId: string;
}

export function ArenaPlaymat({ arenaId }: ArenaPlaymatProps) {
  const layout = useMemo(() => getPlaymatLayoutForArena(arenaId), [arenaId]);
  const theme = getArenaTheme(arenaId);
  const [bgFailed, setBgFailed] = useState(false);

  const src = bgFailed
    ? layout.assets.fallback
    : layout.assets.topdown ?? layout.assets.fallback;

  return (
    <div
      data-testid="arena-playmat"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        onError={() => setBgFailed(true)}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-80`} />
      <div className={`absolute inset-0 ${theme.tint}`} />
      <div className="absolute inset-0 bg-stone-950/25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(9,9,11,0.45)_100%)]" />
    </div>
  );
}
