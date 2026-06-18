/**
 * Character selection before a solo match vs bot.
 * Location: src/components/game/GameSetup.tsx
 */
import React, { useState } from 'react';
import { BASE_PACK } from '../../game';
import { Button } from '../ui/Button';
import { Panel } from '../ui/Panel';

interface GameSetupProps {
  onStart: (characterId: string) => void;
}

export function GameSetup({ onStart }: GameSetupProps) {
  const [selected, setSelected] = useState(BASE_PACK.characters[0].id);

  return (
    <div className="flex items-center justify-center h-full p-8">
      <Panel className="max-w-lg w-full">
        <h2 className="text-xl text-white mb-1">⚔️ Solo gegen Bot</h2>
        <p className="text-sm text-purple-300 mb-6">Wähle deinen Charakter. Der Bot spielt Schluckspecht.</p>

        <label className="block text-white mb-2">Dein Charakter</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none mb-4"
        >
          {BASE_PACK.characters.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.name} — {ch.role}
            </option>
          ))}
        </select>

        <Button variant="success" className="w-full" onClick={() => onStart(selected)}>
          Partie starten
        </Button>
      </Panel>
    </div>
  );
}
