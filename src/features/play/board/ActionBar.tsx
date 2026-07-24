/**
 * Contextual main actions derived from the view model (phase buttons).
 * Location: src/features/play/board/ActionBar.tsx
 */
import React from 'react';
import { Button } from '../../../components/ui/Button';
import type { MainActionView } from './buildGameViewModel';

interface ActionBarProps {
  actions: MainActionView[];
  onAction: (action: MainActionView['action']) => void;
  botThinking?: boolean;
  className?: string;
}

export function ActionBar({ actions, onAction, botThinking, className = '' }: ActionBarProps) {
  if (botThinking) {
    return (
      <div
        data-testid="action-bar"
        className={`inline-flex items-center gap-2.5 rounded-lg border border-stone-700 bg-stone-900/60 px-3 py-1.5 text-sm text-stone-300 ${className}`}
        role="status"
        aria-live="polite"
        aria-label="Gegner denkt"
      >
        <span>Gegner denkt</span>
        <span className="bot-thinking-dots" aria-hidden>
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
      </div>
    );
  }

  if (actions.length === 0) return null;

  return (
    <div data-testid="action-bar" className={`flex flex-wrap items-center gap-2 ${className}`}>
      {actions.map((item) => (
        <Button
          key={item.id}
          variant={item.variant}
          size="sm"
          disabled={!item.enabled}
          onClick={() => onAction(item.action)}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
