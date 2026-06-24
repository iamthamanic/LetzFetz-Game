/**
 * Portrait character card — setup carousel + match intro (delegates to LetzFetzCard).
 * Location: src/components/game/CharacterSelectCard.tsx
 */
import React from 'react';
import type { CharacterCardDef } from '../../game';
import { resolveCardArtPath } from '../../services/cardArt/manifest';
import { LetzFetzCard } from '../cards/LetzFetzCard';

interface CharacterSelectCardProps {
  character: CharacterCardDef;
  selected?: boolean;
  isCenter?: boolean;
  onClick?: () => void;
  interactive?: boolean;
  imageSrc?: string;
  className?: string;
}

export function CharacterSelectCard({
  character,
  selected = false,
  isCenter = false,
  onClick,
  interactive,
  imageSrc: imageOverride,
  className = '',
}: CharacterSelectCardProps) {
  const imageSrc = imageOverride || resolveCardArtPath(character.id);
  const isInteractive = interactive ?? Boolean(onClick);
  const highlighted = selected || isCenter;

  return (
    <LetzFetzCard
      id={character.id}
      name={character.name}
      type="Character"
      element="Neutral"
      role={character.role}
      effects={[character.passiveText]}
      image_asset={imageSrc}
      gameElements={character.elements}
      size="fluid"
      layout="portrait"
      selected={highlighted}
      onClick={onClick}
      interactive={isInteractive}
      animateIllustration={highlighted}
      data-testid={`character-select-card-${character.id}`}
      className={`max-w-[240px] transition-all duration-300 sm:max-w-[260px] md:max-w-[280px] ${highlighted ? 'character-card-frame-highlighted ring-amber-700/30' : ''} ${isInteractive ? 'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/80' : ''} ${className}`}
    />
  );
}
