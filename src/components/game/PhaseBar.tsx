/**
 * Phase indicator bar for the active turn.
 * Location: src/components/game/PhaseBar.tsx
 */
import React from 'react';
import type { TurnPhase } from '../../game/types';
import { PHASE_LABELS } from '../../game/engine/helpers';

const PHASES: TurnPhase[] = ['start', 'draw', 'bind', 'action', 'end'];

interface PhaseBarProps {
  current: TurnPhase;
}

export function PhaseBar({ current }: PhaseBarProps) {
  const currentIdx = PHASES.indexOf(current);
  return (
    <div className="flex gap-1 flex-wrap justify-center">
      {PHASES.map((phase, idx) => (
        <div
          key={phase}
          className={`px-3 py-1 rounded-full text-xs transition-all ${
            idx === currentIdx
              ? 'bg-purple-900/50 border border-purple-500 text-white'
              : idx < currentIdx
                ? 'opacity-50 text-gray-400 border border-gray-700'
                : 'opacity-30 text-gray-500 border border-gray-800'
          }`}
        >
          {PHASE_LABELS[phase]}
        </div>
      ))}
    </div>
  );
}
