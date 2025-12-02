import React, { useState } from 'react';
import { Dices, Lock, RotateCcw, Check } from 'lucide-react';

interface DiceRollerProps {
  onRoll: (result: { type: string; value: number; timestamp: string }) => void;
}

interface Die {
  id: string;
  value: number;
  locked: boolean;
  rolling: boolean;
}

export function DiceRoller({ onRoll }: DiceRollerProps) {
  const [diceType, setDiceType] = useState<number>(6);
  const [diceCount, setDiceCount] = useState<number>(1);
  const [dice, setDice] = useState<Die[]>([]);
  const [rolling, setRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);

  const rollDice = () => {
    setRolling(true);
    setHasRolled(true);
    
    // Create new dice or re-roll unlocked ones
    const newDice: Die[] = dice.length === 0
      ? Array.from({ length: diceCount }, (_, i) => ({
          id: `dice-${Date.now()}-${i}`,
          value: 1,
          locked: false,
          rolling: true
        }))
      : dice.map(die => ({
          ...die,
          rolling: !die.locked
        }));
    
    setDice(newDice);

    // Animate the roll
    let iterations = 0;
    const interval = setInterval(() => {
      setDice(prev => prev.map(die => 
        die.rolling
          ? { ...die, value: Math.floor(Math.random() * diceType) + 1 }
          : die
      ));
      iterations++;
      
      if (iterations >= 10) {
        clearInterval(interval);
        
        // Final roll values
        const finalDice = newDice.map(die => {
          if (die.rolling) {
            return {
              ...die,
              value: Math.floor(Math.random() * diceType) + 1,
              rolling: false
            };
          }
          return { ...die, rolling: false };
        });
        
        setDice(finalDice);
        setRolling(false);
      }
    }, 80);
  };

  const toggleLock = (id: string) => {
    setDice(prev => prev.map(die =>
      die.id === id ? { ...die, locked: !die.locked } : die
    ));
  };

  const acceptRoll = () => {
    if (dice.length === 0) return;
    
    // Send result to history
    const result = {
      type: `${diceCount}×W${diceType}`,
      value: dice.reduce((sum, die) => sum + die.value, 0),
      timestamp: new Date().toISOString()
    };
    onRoll(result);
    
    // Reset
    setDice([]);
    setHasRolled(false);
  };

  const reset = () => {
    setDice([]);
    setHasRolled(false);
  };

  const diceColors: { [key: number]: string } = {
    4: 'bg-orange-600',
    6: 'bg-blue-600',
    8: 'bg-cyan-600',
    12: 'bg-green-600',
    20: 'bg-purple-600'
  };

  return (
    <div className="flex items-center gap-4">
      {/* Configuration */}
      {!hasRolled && (
        <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
          {/* Dice Type Selector */}
          <select
            value={diceType}
            onChange={(e) => setDiceType(Number(e.target.value))}
            className="bg-gray-900 text-white px-3 py-1.5 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer"
          >
            <option value={4}>W4</option>
            <option value={6}>W6</option>
            <option value={8}>W8</option>
            <option value={12}>W12</option>
            <option value={20}>W20</option>
          </select>

          {/* Dice Count Selector */}
          <select
            value={diceCount}
            onChange={(e) => setDiceCount(Number(e.target.value))}
            className="bg-gray-900 text-white px-3 py-1.5 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none cursor-pointer"
          >
            <option value={1}>1 Dice</option>
            <option value={2}>2 Dice</option>
            <option value={3}>3 Dice</option>
            <option value={4}>4 Dice</option>
            <option value={5}>5 Dice</option>
          </select>

          {/* Roll Button */}
          <button
            onClick={rollDice}
            disabled={rolling}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
          >
            <Dices className="w-5 h-5" />
            Roll
          </button>
        </div>
      )}

      {/* Active Dice Display */}
      {hasRolled && (
        <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3 border border-gray-700">
          {/* Dice Grid */}
          <div className="flex gap-2">
            {dice.map((die) => (
              <button
                key={die.id}
                onClick={() => toggleLock(die.id)}
                disabled={rolling}
                className={`relative w-16 h-16 rounded-lg flex flex-col items-center justify-center transition-all transform hover:scale-105 ${
                  die.locked
                    ? 'border-4 border-green-500 bg-green-900/30'
                    : `border-2 border-gray-600 ${diceColors[diceType]} ${!rolling ? 'ring-2 ring-green-400/50' : ''}`
                } ${rolling && die.rolling ? 'animate-pulse' : ''} ${rolling ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                title={die.locked ? 'Click to unlock' : 'Click to lock'}
              >
                {/* Lock Icon */}
                {die.locked && (
                  <Lock className="w-3 h-3 text-green-400 absolute top-1 right-1" />
                )}
                
                {/* Unlocked Hint Icon */}
                {!die.locked && !rolling && (
                  <Lock className="w-3 h-3 text-green-400/70 absolute top-1 right-1 lock-pulse" />
                )}
                
                {/* Dice Value */}
                <div className="text-2xl text-white font-bold">
                  {die.value}
                </div>
                
                {/* Dice Type Label */}
                <div className="text-xs text-white/60 absolute bottom-1">
                  W{diceType}
                </div>
              </button>
            ))}
          </div>

          {/* Total Display */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 min-w-[80px] text-center">
            <div className="text-xs text-gray-400">Total</div>
            <div className="text-2xl text-yellow-400 font-bold">
              {dice.reduce((sum, die) => sum + die.value, 0)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Re-Roll Button */}
            <button
              onClick={rollDice}
              disabled={rolling || dice.every(d => d.locked)}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              title="Re-roll unlocked dice"
            >
              <RotateCcw className="w-4 h-4" />
              Re-Roll
            </button>

            {/* Accept Button */}
            <button
              onClick={acceptRoll}
              disabled={rolling}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              title="Accept and save to history"
            >
              <Check className="w-4 h-4" />
              Accept
            </button>

            {/* Reset Button */}
            <button
              onClick={reset}
              disabled={rolling}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-colors"
              title="Reset"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}