/**
 * Sandbox dice roller.
 * Location: src/components/DiceRoller.tsx
 */
import React, { useState } from 'react';
import { Dices, Lock, RotateCcw, Check, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Select } from './ui/Select';

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

  const typeOptions = [
    { value: '4', label: 'W4' },
    { value: '6', label: 'W6' },
    { value: '8', label: 'W8' },
    { value: '12', label: 'W12' },
    { value: '20', label: 'W20' },
  ];

  const countOptions = [
    { value: '1', label: '1 Würfel' },
    { value: '2', label: '2 Würfel' },
    { value: '3', label: '3 Würfel' },
    { value: '4', label: '4 Würfel' },
    { value: '5', label: '5 Würfel' },
  ];

  const rollDice = () => {
    setRolling(true);
    setHasRolled(true);

    const newDice: Die[] =
      dice.length === 0
        ? Array.from({ length: diceCount }, (_, i) => ({
            id: `dice-${Date.now()}-${i}`,
            value: 1,
            locked: false,
            rolling: true,
          }))
        : dice.map((die) => ({ ...die, rolling: !die.locked }));

    setDice(newDice);

    let iterations = 0;
    const interval = setInterval(() => {
      setDice((prev) =>
        prev.map((die) =
          die.rolling ? { ...die, value: Math.floor(Math.random() * diceType) + 1 } : die
        )
      );
      iterations++;

      if (iterations >= 10) {
        clearInterval(interval);
        const finalDice = newDice.map((die) =
          die.rolling
            ? { ...die, value: Math.floor(Math.random() * diceType) + 1, rolling: false }
            : { ...die, rolling: false }
        );
        setDice(finalDice);
        setRolling(false);
      }
    }, 80);
  };

  const toggleLock = (id: string) => {
    setDice((prev) => prev.map((die) => (die.id === id ? { ...die, locked: !die.locked } : die)));
  };

  const acceptRoll = () => {
    if (dice.length === 0) return;
    onRoll({
      type: `${diceCount}×W${diceType}`,
      value: dice.reduce((sum, die) => sum + die.value, 0),
      timestamp: new Date().toISOString(),
    });
    setDice([]);
    setHasRolled(false);
  };

  const reset = () => {
    setDice([]);
    setHasRolled(false);
  };

  return (
    <div className="flex items-center gap-3">
      {!hasRolled ? (
        <div className="flex items-center gap-2 rounded-lg border border-stone-800 bg-stone-950 px-3 py-2">
          <Select
            options={typeOptions}
            value={String(diceType)}
            onChange={(e) => setDiceType(Number(e.target.value))}
            className="w-24"
          />
          <Select
            options={countOptions}
            value={String(diceCount)}
            onChange={(e) => setDiceCount(Number(e.target.value))}
            className="w-28"
          />
          <Button variant="accent" size="sm" icon={<Dices className="h-4 w-4" />} onClick={rollDice} disabled={rolling}>
            Würfeln
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-stone-800 bg-stone-950 px-3 py-2">
          <div className="flex gap-2">
            {dice.map((die) => (
              <button
                key={die.id}
                onClick={() => toggleLock(die.id)}
                disabled={rolling}
                className={`relative flex h-12 w-12 flex-col items-center justify-center rounded-lg border transition-all ${
                  die.locked
                    ? 'border-emerald-500 bg-emerald-900/30'
                    : 'border-stone-600 bg-stone-800'
                }`}
                title={die.locked ? 'Entsperren' : 'Sperren'}
              >
                {die.locked && <Lock className="absolute right-1 top-1 h-3 w-3 text-emerald-400" />}
                <span className="text-lg font-bold text-stone-100">{die.value}</span>
                <span className="text-[9px] text-stone-500">W{diceType}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center rounded border border-stone-800 bg-stone-900 px-3 py-1">
            <span className="text-[9px] text-stone-500">Summe</span>
            <span className="text-lg font-bold text-amber-300">{dice.reduce((sum, die) => sum + die.value, 0)}</span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw className="h-4 w-4" />}
            onClick={rollDice}
            disabled={rolling || dice.every((d) => d.locked)}
            title="Ungesperrte Würfel neu würfeln"
          >
            Neu
          </Button>
          <Button variant="success" size="sm" icon={<Check className="h-4 w-4" />} onClick={acceptRoll} disabled={rolling}>
            OK
          </Button>
          <Button variant="danger" size="sm" icon={<X className="h-4 w-4" />} onClick={reset} disabled={rolling}>
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}
