/**
 * Compact arena label — replaces the old arena card sidebar.
 * Location: src/components/game/ArenaPlaymatBadge.tsx
 */
import React from 'react';
import type { ArenaCardDef } from '../../game/types';
import type { ArenaState } from '../../game/types/game';
import { getArenaTheme } from './arenaTheme';
import { Badge } from '../ui/Badge';

interface ArenaPlaymatBadgeProps {
  arena: ArenaCardDef;
  arenaState: ArenaState;
}

export function ArenaPlaymatBadge({ arena, arenaState }: ArenaPlaymatBadgeProps) {
  const theme = getArenaTheme(arena.id);

  return (
    <div
      data-testid="arena-playmat-badge"
      className={`absolute right-3 top-3 z-20 flex max-w-[min(100%,14rem)] flex-col items-end gap-1 rounded-lg border bg-stone-950/75 px-3 py-2 shadow-lg backdrop-blur-md ${theme.accent}`}
    >
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/90">
        🏟️ Arena
      </h2>
      <p className="text-right text-sm font-bold text-stone-100">{arena.name}</p>
      {arenaState.d6Variant != null && (
        <Badge variant="info" className="text-[10px]">
          W6: {arenaState.d6Variant}
        </Badge>
      )}
    </div>
  );
}
