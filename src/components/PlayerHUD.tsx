import React from 'react';
import { Heart, Plus, Minus } from 'lucide-react';

interface PlayerHUDProps {
  playerName: string;
  hp: number;
  onHpChange: (newHp: number) => void;
  position: 'bottom-left' | 'bottom-right';
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function PlayerHUD({ playerName, hp, onHpChange, position, notes, onNotesChange }: PlayerHUDProps) {
  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const handleIncrement = (amount: number) => {
    onHpChange(Math.max(0, hp + amount));
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-purple-500/50 rounded-xl p-4 shadow-2xl backdrop-blur-sm min-w-[200px]`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white">{playerName}</h3>
        <Heart className="w-5 h-5 text-red-500" />
      </div>
      
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => handleIncrement(-1)}
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <div className="flex-1 text-center">
          <input
            type="number"
            value={hp}
            onChange={(e) => onHpChange(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full bg-gray-800 text-white text-2xl text-center py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
          />
          <div className="text-xs text-gray-400 mt-1">HP</div>
        </div>
        
        <button
          onClick={() => handleIncrement(1)}
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3">
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Player notes..."
          className="w-full bg-gray-800 text-white text-xs px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
          rows={3}
        />
      </div>
    </div>
  );
}
