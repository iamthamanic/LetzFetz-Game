import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface RoundCounterProps {
  round: number;
  onRoundChange: (round: number) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function RoundCounter({ round, onRoundChange, notes, onNotesChange }: RoundCounterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const incrementRound = () => {
    onRoundChange(round + 1);
  };

  const decrementRound = () => {
    if (round > 1) {
      onRoundChange(round - 1);
    }
  };

  return (
    <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-purple-500/50 rounded-xl shadow-2xl p-2 min-w-[140px]">
        {/* Round Counter Display */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-purple-300 text-[10px] uppercase tracking-wider">Round</div>
          
          {/* Round Number with Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={decrementRound}
              disabled={round <= 1}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-full w-7 h-7 flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95"
              title="Previous round"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <div className="bg-black/40 rounded-full w-12 h-12 flex items-center justify-center border-2 border-purple-400/50 shadow-inner">
              <span className="text-white text-lg">{round}</span>
            </div>
            
            <button
              onClick={incrementRound}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full w-7 h-7 flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95"
              title="Next round"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          {/* Notes Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-300 hover:text-white transition-colors text-[10px] flex items-center gap-1"
          >
            📝 {isExpanded ? 'Hide Notes' : 'Show Notes'}
          </button>
        </div>

        {/* Expandable Notes Section */}
        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-purple-500/30">
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Round notes..."
              className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-2 py-1.5 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[60px] resize-none text-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
}