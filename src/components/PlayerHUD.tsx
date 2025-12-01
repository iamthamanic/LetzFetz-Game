import React from 'react';
import { Heart, Plus, Minus } from 'lucide-react';

interface PlayerHUDProps {
  playerName: string;
  hp: number;
  onHpChange: (newHp: number) => void;
  position: 'bottom-left' | 'bottom-right';
  notes: string;
  onNotesChange: (notes: string) => void;
  customFields: Array<{ name: string; value: number }>;
  onCustomFieldChange: (index: number, value: number) => void;
  onCustomFieldNameChange: (index: number, name: string) => void;
}

export function PlayerHUD({ 
  playerName, 
  hp, 
  onHpChange, 
  position, 
  notes, 
  onNotesChange,
  customFields,
  onCustomFieldChange,
  onCustomFieldNameChange
}: PlayerHUDProps) {
  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const handleIncrement = (amount: number) => {
    onHpChange(Math.max(0, hp + amount));
  };

  const handleCustomFieldIncrement = (index: number, amount: number) => {
    const newValue = Math.max(0, customFields[index].value + amount);
    onCustomFieldChange(index, newValue);
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-purple-500/50 rounded-xl p-3 shadow-2xl backdrop-blur-sm w-[240px]`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white text-sm">{playerName}</h3>
        <Heart className="w-4 h-4 text-red-500" />
      </div>
      
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => handleIncrement(-1)}
          className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        
        <div className="flex-1 text-center">
          <input
            type="number"
            value={hp}
            onChange={(e) => onHpChange(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full bg-gray-800 text-white text-xl text-center py-1.5 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
          />
          <div className="text-[10px] text-gray-400 mt-0.5">HP</div>
        </div>
        
        <button
          onClick={() => handleIncrement(1)}
          className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Custom Fields Row */}
      <div className="grid grid-cols-3 gap-1 mt-2">
        {customFields.map((field, index) => (
          <div key={index} className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-0.5 w-full">
              <button
                onClick={() => handleCustomFieldIncrement(index, -1)}
                className="bg-red-600/70 hover:bg-red-700 text-white p-0.5 rounded transition-colors shrink-0"
              >
                <Minus className="w-2 h-2" />
              </button>
              
              <input
                type="number"
                value={field.value}
                onChange={(e) => onCustomFieldChange(index, Math.max(0, parseInt(e.target.value) || 0))}
                className="flex-1 bg-gray-800 text-white text-center py-0.5 rounded border border-gray-700 focus:border-purple-500 focus:outline-none text-[11px] min-w-0"
              />
              
              <button
                onClick={() => handleCustomFieldIncrement(index, 1)}
                className="bg-green-600/70 hover:bg-green-700 text-white p-0.5 rounded transition-colors shrink-0"
              >
                <Plus className="w-2 h-2" />
              </button>
            </div>
            
            <input
              type="text"
              value={field.name}
              onChange={(e) => onCustomFieldNameChange(index, e.target.value)}
              className="w-full bg-gray-900/50 text-gray-400 text-center py-0.5 rounded border border-gray-700/50 focus:border-purple-500 focus:outline-none text-[8px] truncate"
              placeholder="Stat"
            />
          </div>
        ))}
      </div>

      <div className="mt-2">
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Player notes..."
          className="w-full bg-gray-800 text-white text-[10px] px-2 py-1.5 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
          rows={2}
        />
      </div>
    </div>
  );
}