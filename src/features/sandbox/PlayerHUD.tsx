/**
 * Player status HUD for sandbox arena.
 * Location: src/features/sandbox/PlayerHUD.tsx
 */
import React from 'react';
import { Heart, Plus, Minus } from 'lucide-react';
import { Panel } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { SandboxCustomField } from './model/sandboxTypes';

interface PlayerHUDProps {
  playerName: string;
  hp: number;
  onHpChange: (newHp: number) => void;
  position: 'bottom-left' | 'bottom-right';
  notes: string;
  onNotesChange: (notes: string) => void;
  customFields: SandboxCustomField[];
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
  onCustomFieldNameChange,
}: PlayerHUDProps) {
  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <Panel className={`absolute ${positionClasses[position]} w-[260px] space-y-3`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-stone-100">{playerName}</span>
        <Heart className="h-4 w-4 text-red-500" />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="danger"
          size="sm"
          icon={<Minus className="h-3.5 w-3.5" />}
          onClick={() => onHpChange(Math.max(0, hp - 1))}
          className="px-2"
        />
        <Input
          type="number"
          min={0}
          value={hp}
          onChange={(e) => onHpChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
          className="flex-1 text-center"
        />
        <Button
          variant="success"
          size="sm"
          icon={<Plus className="h-3.5 w-3.5" />}
          onClick={() => onHpChange(hp + 1)}
          className="px-2"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {customFields.map((field, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-1">
              <Button
                variant="danger"
                size="sm"
                icon={<Minus className="h-3 w-3" />}
                onClick={() => onCustomFieldChange(index, Math.max(0, field.value - 1))}
                className="px-1 py-1"
              />
              <input
                type="number"
                value={field.value}
                min={0}
                onChange={(e) =>
                  onCustomFieldChange(index, Math.max(0, parseInt(e.target.value, 10) || 0))
                }
                className="w-full rounded border border-stone-700 bg-stone-900 py-0.5 text-center text-xs text-stone-100 outline-none focus:border-amber-500"
              />
              <Button
                variant="success"
                size="sm"
                icon={<Plus className="h-3 w-3" />}
                onClick={() => onCustomFieldChange(index, field.value + 1)}
                className="px-1 py-1"
              />
            </div>
            <input
              type="text"
              value={field.name}
              onChange={(e) => onCustomFieldNameChange(index, e.target.value)}
              placeholder="Stat"
              className="w-full rounded border border-stone-800 bg-stone-900/50 py-0.5 text-center text-[9px] text-stone-400 outline-none focus:border-amber-500"
            />
          </div>
        ))}
      </div>

      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Notizen…"
        className="w-full resize-none rounded-lg border border-stone-700 bg-stone-900 px-2 py-1.5 text-xs text-stone-100 outline-none transition-colors focus:border-amber-500"
        rows={2}
      />
    </Panel>
  );
}
