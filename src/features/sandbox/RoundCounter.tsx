/**
 * Round counter and notes for sandbox arena.
 * Location: src/features/sandbox/RoundCounter.tsx
 */
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, NotebookPen } from 'lucide-react';
import { Panel } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';

interface RoundCounterProps {
  round: number;
  onRoundChange: (round: number) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function RoundCounter({
  round,
  onRoundChange,
  notes,
  onNotesChange,
}: RoundCounterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Panel className="absolute bottom-36 left-1/2 w-48 -translate-x-1/2 space-y-2">
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
          Runde
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="danger"
            size="sm"
            icon={<ChevronDown className="h-4 w-4" />}
            onClick={() => round > 1 && onRoundChange(round - 1)}
            disabled={round <= 1}
            className="rounded-full px-2"
          />

          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-700 bg-stone-950 text-lg font-bold text-stone-100">
            {round}
          </div>

          <Button
            variant="success"
            size="sm"
            icon={<ChevronUp className="h-4 w-4" />}
            onClick={() => onRoundChange(round + 1)}
            className="rounded-full px-2"
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          icon={<NotebookPen className="h-3.5 w-3.5" />}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Notizen ausblenden' : 'Notizen'}
        </Button>
      </div>

      {isExpanded && (
        <div className="border-t border-stone-800 pt-2">
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Rundennotizen…"
            className="w-full resize-none rounded-lg border border-stone-700 bg-stone-900 px-2 py-1.5 text-xs text-stone-100 outline-none transition-colors focus:border-amber-500"
            rows={3}
          />
        </div>
      )}
    </Panel>
  );
}
