/**
 * Arena sidebar — LetzFetz card on the right with mutation footer.
 * Location: src/features/play/setup/ArenaCenter.tsx
 */
import React from 'react';
import type { ArenaCardDef } from '../../../game/types';
import type { ArenaState } from '../../../game/types/game';
import { arenaDefToCardProps } from '../../../components/cards/characterCardProps';
import { getArenaTheme } from '../board/arenaTheme';
import { GameCharacterCard } from './GameCharacterCard';

interface ArenaCenterProps {
  arena: ArenaCardDef;
  arenaState: ArenaState;
}

export function ArenaCenter({ arena, arenaState }: ArenaCenterProps) {
  const theme = getArenaTheme(arena.id);
  const mutationNote =
    arenaState.d6Variant != null ? `W6-Variante: ${arenaState.d6Variant}` : undefined;

  return (
    <aside
      data-testid="arena-center"
      className={`flex flex-none flex-col items-center gap-2 border-l border-stone-800/80 bg-stone-950/40 px-3 py-4 backdrop-blur-sm sm:px-4 ${theme.accent}`}
    >
      <h2 className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/90">
        🏟️ Arena
      </h2>
      <GameCharacterCard
        {...arenaDefToCardProps(arena)}
        size="lg"
        footerNote={mutationNote}
      />
    </aside>
  );
}
