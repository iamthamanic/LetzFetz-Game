/**
 * Character portrait with Charakter / Info / Ulti tabs (setup + match intro).
 * Location: src/components/game/CharacterPreviewWithDetails.tsx
 */
import React, { useState } from 'react';
import type { CharacterCardDef } from '../../game';
import { getUltimateForCharacter } from '../../game/packs/characterSetup';
import { Tabs } from '../ui/Tabs';
import { CharacterSelectCard } from './CharacterSelectCard';
import { CharacterDetailPanel, type CharacterDetailTab } from './CharacterDetailPanel';

type DetailTab = 'character' | CharacterDetailTab;

const DETAIL_TABS = [
  { id: 'character', label: 'Charakter', tone: 'play' as const },
  { id: 'info', label: 'Info', tone: 'play' as const },
  { id: 'ulti', label: 'Ulti', tone: 'play' as const },
];

interface CharacterPreviewWithDetailsProps {
  character: CharacterCardDef;
  selected?: boolean;
  interactive?: boolean;
  /** Extra class on the outer column (e.g. crash animation). */
  className?: string;
  /** Class on the portrait card when Charakter tab is active. */
  cardClassName?: string;
}

export function CharacterPreviewWithDetails({
  character,
  selected = false,
  interactive = false,
  className = '',
  cardClassName = '',
}: CharacterPreviewWithDetailsProps) {
  const [detailTab, setDetailTab] = useState<DetailTab>('character');

  return (
    <div
      className={`flex flex-col items-center gap-2 ${className}`}
      data-testid={`character-preview-${character.id}`}
    >
      <Tabs
        items={DETAIL_TABS}
        active={detailTab}
        onChange={(id) => setDetailTab(id as DetailTab)}
        ariaLabel={`${character.name} — Details`}
      />
      {detailTab !== 'character' ? (
        <CharacterDetailPanel
          character={character}
          tab={detailTab}
          ultimate={getUltimateForCharacter(character)}
        />
      ) : (
        <CharacterSelectCard
          character={character}
          isCenter
          interactive={interactive}
          selected={selected}
          className={cardClassName}
        />
      )}
    </div>
  );
}
