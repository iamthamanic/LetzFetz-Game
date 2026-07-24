/**
 * Character / Ultimate / Arena / Glitch card in the game view.
 * Location: src/features/play/setup/GameCharacterCard.tsx
 */
import React from 'react';
import { LetzFetzCard } from '../../../components/cards/LetzFetzCard';
import type { LetzFetzCardProps } from '../../../components/cards/LetzFetzCard';

export function GameCharacterCard(
  props: Partial<LetzFetzCardProps> & { size?: 'sm' | 'lg'; footerNote?: string },
) {
  const { size = 'lg', footerNote, ...cardProps } = props;
  return (
    <LetzFetzCard
      id={cardProps.id ?? ''}
      name={cardProps.name ?? ''}
      type={cardProps.type ?? 'Character'}
      element={cardProps.element ?? 'Neutral'}
      elementDisplay={cardProps.elementDisplay}
      stats_json={cardProps.stats_json}
      effects={cardProps.effects}
      effects_text={cardProps.effects_text}
      image_asset={cardProps.image_asset}
      size={size}
      interactive={false}
      footerNote={footerNote ?? cardProps.footerNote}
    />
  );
}
