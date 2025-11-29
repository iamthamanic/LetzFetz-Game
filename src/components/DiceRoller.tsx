import React, { useState } from 'react';
import { Dices } from 'lucide-react';

interface DiceRollerProps {
  onRoll: (result: { type: string; value: number; timestamp: string }) => void;
}

export function DiceRoller({ onRoll }: DiceRollerProps) {
  const [lastRoll, setLastRoll] = useState<{ type: string; value: number } | null>(null);
  const [rolling, setRolling] = useState(false);

  const rollDice = (sides: number) => {
    setRolling(true);
    
    // Animate the roll
    let iterations = 0;
    const interval = setInterval(() => {
      const tempValue = Math.floor(Math.random() * sides) + 1;
      setLastRoll({ type: `W${sides}`, value: tempValue });
      iterations++;
      
      if (iterations >= 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * sides) + 1;
        const result = {
          type: `W${sides}`,
          value: finalValue,
          timestamp: new Date().toISOString()
        };
        setLastRoll(result);
        onRoll(result);
        setRolling(false);
      }
    }, 100);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Dice Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => rollDice(4)}
          disabled={rolling}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
        >
          Roll W4
        </button>
        <button
          onClick={() => rollDice(6)}
          disabled={rolling}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
        >
          Roll W6
        </button>
        <button
          onClick={() => rollDice(8)}
          disabled={rolling}
          className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
        >
          Roll W8
        </button>
        <button
          onClick={() => rollDice(12)}
          disabled={rolling}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
        >
          Roll W12
        </button>
        <button
          onClick={() => rollDice(20)}
          disabled={rolling}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
        >
          Roll W20
        </button>
      </div>

      {/* Last Roll Display */}
      {lastRoll && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex items-center gap-3">
          <Dices className={`w-5 h-5 text-yellow-400 ${rolling ? 'animate-spin' : ''}`} />
          <div>
            <div className="text-xs text-gray-400">{lastRoll.type}</div>
            <div className="text-xl text-white">{lastRoll.value}</div>
          </div>
        </div>
      )}
    </div>
  );
}
