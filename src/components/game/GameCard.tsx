/**
 * Small element card display for the game board — grunge frame variant.
 * Location: src/components/game/GameCard.tsx
 */
import React from 'react';
import type { ElementCardDef } from '../../game/types';
import { LetzFetzCard } from '../cards/LetzFetzCard';
import { elementDefToForgeProps } from '../cards/cardDisplayModel';

interface GameCardProps {
  def: ElementCardDef;
  selected?: boolean;
  exhausted?: boolean;
  onClick?: () => void;
  faceDown?: boolean;
}

export function GameCard({ def, selected, exhausted, onClick, faceDown }: GameCardProps) {
  if (faceDown) {
    return <LetzFetzCard id="face-down" name="" type="Element" element="Neutral" faceDown size="sm" />;
  }

  const props = elementDefToForgeProps(def);

  return (
    <LetzFetzCard
      {...props}
      size="sm"
      selected={selected}
      exhausted={exhausted}
      onClick={onClick}
    />
  );
}
