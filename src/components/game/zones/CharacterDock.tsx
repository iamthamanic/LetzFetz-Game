/**
 * Character dock on playmat — idle video loop with LP/name overlay.
 * Location: src/components/game/zones/CharacterDock.tsx
 */
import React from 'react';
import type { CSSProperties } from 'react';
import type { ContentPack, GameState, PlayerId } from '../../../game';
import { CardIllustrationLoop } from '../../ui/CardIllustrationLoop';
import { Badge } from '../../ui/Badge';
import { Heart, Layers } from 'lucide-react';

interface CharacterDockProps {
  state: GameState;
  pack: ContentPack;
  playerId: PlayerId;
  side: 'human' | 'bot';
  style?: CSSProperties;
  handVisibleCount?: number;
}

function characterName(pack: ContentPack, id: string): string {
  return pack.characters.find((c) => c.id === id)?.name ?? id;
}

export function CharacterDock({
  state,
  pack,
  playerId,
  side,
  style,
  handVisibleCount,
}: CharacterDockProps) {
  const player = state.players[playerId];
  const handCount = handVisibleCount ?? player.hand.length;
  const isHuman = side === 'human';
  const isActive = state.activePlayer === playerId && !state.winner;
  const name = characterName(pack, player.characterId);
  const testId = isHuman ? 'human-plate' : 'opponent-plate';
  const borderTone = isHuman ? 'border-emerald-500/50' : 'border-red-500/40';
  const hpTone = isHuman ? 'text-emerald-400' : 'text-red-400';

  return (
    <div
      data-testid={testId}
      data-character-dock={side}
      className={`pointer-events-none z-20 flex min-h-0 flex-col overflow-hidden rounded-xl border-2 bg-stone-950/80 shadow-xl backdrop-blur-sm ${borderTone}`}
      style={style}
      aria-label={`${isHuman ? 'Du' : 'Gegner'} — ${name}`}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <CardIllustrationLoop
          cardId={player.characterId}
          variant="idle"
          className="h-full w-full object-cover object-top"
          testId={`character-dock-idle-${player.characterId}`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 space-y-0.5 p-2">
          <div className="flex flex-wrap items-center gap-1">
            <span className="truncate text-xs font-bold text-stone-50">
              {isHuman ? 'Du' : '🤖'} — {name}
            </span>
            {isActive && (
              <Badge variant={isHuman ? 'success' : 'warning'} className="text-[9px]">
                Am Zug
              </Badge>
            )}
            {isHuman && player.ultimateAvailable && (
              <Badge variant="accent" className="text-[9px]">
                Ulti
              </Badge>
            )}
          </div>
          <p className={`inline-flex items-center gap-1 text-sm font-black tabular-nums ${hpTone}`}>
            <Heart className="h-3.5 w-3.5 shrink-0" />
            {player.hp} LP
          </p>
          <p className="flex items-center gap-1 text-[10px] text-stone-300">
            <Layers className="h-3 w-3 shrink-0" />
            Hand {handCount}
            {!isHuman && ' (verdeckt)'}
          </p>
        </div>
      </div>
    </div>
  );
}
