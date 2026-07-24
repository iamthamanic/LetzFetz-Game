/**
 * Pack arena info panel for sandbox table.
 * Location: src/features/sandbox/ArenaInfoPanel.tsx
 */
import React from 'react';
import { X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { SandboxArena } from './model/sandboxTypes';

interface ArenaInfoPanelProps {
  arena: SandboxArena;
  variantText: string | null;
  isExpanded: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function ArenaInfoPanel({
  arena,
  variantText,
  isExpanded,
  onToggle,
  onClose,
}: ArenaInfoPanelProps) {
  return (
    <div className="min-w-[360px] rounded-2xl border-2 border-amber-500/40 bg-stone-950/90 p-5 shadow-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h2 className="text-xl text-stone-100">{arena.name}</h2>
          <button
            type="button"
            onClick={onToggle}
            className="text-amber-400 hover:text-amber-300"
            aria-label={isExpanded ? 'Zuklappen' : 'Aufklappen'}
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-stone-400 hover:text-stone-100"
          aria-label="Schließen"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3 text-sm text-stone-300">
          <p>
            <span className="font-semibold text-stone-200">Rolle: </span>
            {arena.role}
          </p>
          <p>
            <span className="font-semibold text-stone-200">Grundeffekt: </span>
            {arena.baseEffect}
          </p>
          <p>
            <span className="font-semibold text-stone-200">Trigger: </span>
            {arena.trigger}
          </p>
          <p>
            <span className="font-semibold text-stone-200">Sonderregel: </span>
            {arena.specialRule}
          </p>
          {variantText && (
            <p className="rounded border border-amber-500/30 bg-amber-950/40 px-3 py-2 text-amber-100">
              <span className="font-semibold">W6-Variante: </span>
              {variantText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
