/**
 * Character selection before a solo match vs bot — card carousel picker.
 * Location: src/components/game/GameSetup.tsx
 */
import React, { useState } from 'react';
import { BASE_PACK } from '../../game';
import { Button } from '../ui/button';
import { CharacterCarousel } from './CharacterCarousel';

interface GameSetupProps {
  onStart: (characterId: string) => void;
}

export function GameSetup({ onStart }: GameSetupProps) {
  const [selected, setSelected] = useState(BASE_PACK.characters[0].id);

  return (
    <div className="flex h-full flex-col items-center justify-center overflow-y-auto bg-stone-950 px-4 py-8">
      <div className="w-full max-w-3xl space-y-6">
        <header className="text-center">
          <h2 className="text-2xl font-bold text-stone-100">⚔️ Solo gegen Bot</h2>
          <p className="mt-2 text-sm text-stone-400">
            Wähle deinen Charakter. Der Bot spielt Schluckspecht.
          </p>
        </header>

        <CharacterCarousel
          characters={BASE_PACK.characters}
          selectedId={selected}
          onSelect={setSelected}
        />

        <div className="mx-auto w-full max-w-md">
          <Button variant="success" className="w-full" onClick={() => onStart(selected)}>
            Partie starten
          </Button>
        </div>
      </div>
    </div>
  );
}
