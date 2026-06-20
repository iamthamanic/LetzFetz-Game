/**
 * Character identity strip — portrait crop + LP, ulti, pile counts.
 * Location: src/components/game/CharacterPlate.tsx
 */
import React from 'react';
import type { ContentPack, GameState, PlayerId } from '../../game';
import { resolveCardArtPath } from '../../services/cardArt/manifest';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Badge } from '../ui/Badge';
import { Heart, Layers, Archive } from 'lucide-react';

interface CharacterPlateProps {
  state: GameState;
  pack: ContentPack;
  playerId: PlayerId;
  side: 'human' | 'bot';
  deckCount: number;
  discardCount?: number;
}

function characterName(pack: ContentPack, id: string): string {
  return pack.characters.find((c) => c.id === id)?.name ?? id;
}

export function CharacterPlate({
  state,
  pack,
  playerId,
  side,
  deckCount,
  discardCount = 0,
}: CharacterPlateProps) {
  const player = state.players[playerId];
  const isActive = state.activePlayer === playerId && !state.winner;
  const isHuman = side === 'human';
  const name = characterName(pack, player.characterId);
  const testId = isHuman ? 'human-plate' : 'opponent-plate';

  return (
    <div
      data-testid={testId}
      className={`flex items-center gap-3 rounded-xl border border-stone-700/70 bg-stone-950/70 px-3 py-2 shadow-md ${isHuman ? 'border-emerald-900/40' : 'border-red-900/30'}`}
    >
      <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-stone-600/90 bg-stone-900 shadow-inner ring-1 ring-amber-900/30">
        <ImageWithFallback
          src={resolveCardArtPath(player.characterId)}
          alt={name}
          className="h-full w-full object-cover object-top"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-base font-bold text-stone-100">
            {isHuman ? 'Du' : '🤖'} — {name}
          </span>
          {isActive && <Badge variant={isHuman ? 'success' : 'warning'}>Am Zug</Badge>}
          {isHuman && player.ultimateAvailable && <Badge variant="accent">Ulti bereit</Badge>}
        </div>

        <p className={`mt-1 inline-flex items-center gap-1 text-lg font-black tabular-nums ${isHuman ? 'text-emerald-400' : 'text-red-400'}`}>
          <Heart className="h-4 w-4 shrink-0" />
          {player.hp} LP
        </p>

        <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-stone-400">
          <span className="inline-flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            Hand {player.hand.length}
            {!isHuman && ' (verdeckt)'}
          </span>
          <span>Deck {deckCount}</span>
          {isHuman && (
            <span className="inline-flex items-center gap-1">
              <Archive className="h-3.5 w-3.5" />
              Ablage {discardCount}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
