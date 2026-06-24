/**
 * Contextual main actions derived from the view model (phase buttons).
 * Location: src/components/game/ActionBar.tsx
 */
import React from 'react';
import { Button } from '../ui/Button';
import type { MainActionView } from './buildGameViewModel';

interface ActionBarProps {
  actions: MainActionView[];
  onAction: (action: MainActionView['action']) => void;
  botThinking?: boolean;
}

export function ActionBar({ actions, onAction, botThinking }: ActionBarProps) {
  if (botThinking) {
    return (
      <div className="rounded-lg border border-stone-700 bg-stone-900/60 px-4 py-2 text-sm text-stone-400">
        Gegner denkt…
      </div>
    );
  }

  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((item) => (
        <Button
          key={item.id}
          variant={item.variant}
          disabled={!item.enabled}
          onClick={() => onAction(item.action)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
