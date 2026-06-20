/**
 * Legacy wrapper — delegates to BoardCard for compact in-match display.
 * Location: src/components/game/GameCard.tsx
 */
import React from 'react';
import type { ElementCardDef } from '../../game/types';
import { BoardCard } from './BoardCard';

interface GameCardProps {
  def: ElementCardDef;
  selected?: boolean;
  exhausted?: boolean;
  onClick?: () => void;
  faceDown?: boolean;
}

export function GameCard({ def, selected, exhausted, onClick, faceDown }: GameCardProps) {
  return (
    <BoardCard
      def={def}
      size="bound"
      selected={selected}
      exhausted={exhausted}
      playable={Boolean(onClick)}
      onClick={onClick}
      faceDown={faceDown}
    />
  );
}
