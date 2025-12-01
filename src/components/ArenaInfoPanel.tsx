import React from 'react';
import { Flame, Droplet, Leaf, Zap, Mountain, Moon, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';

interface ArenaInfoPanelProps {
  arenaName: string;
  biom: {
    name: string;
    element: string;
    effects: string[];
    trigger_dice_value?: number;
  } | null;
  mutation: {
    name: string;
    element: string;
    effects: string[];
    trigger_dice_value?: number;
  } | null;
  isExpanded: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const elementIcons: Record<string, any> = {
  Fire: Flame,
  Water: Droplet,
  Nature: Leaf,
  Lightning: Zap,
  Earth: Mountain,
  Dark: Moon,
  Neutral: Sparkles,
};

const elementColors: Record<string, string> = {
  Fire: 'text-red-400',
  Water: 'text-blue-400',
  Nature: 'text-green-400',
  Lightning: 'text-yellow-400',
  Earth: 'text-amber-600',
  Dark: 'text-purple-400',
  Neutral: 'text-gray-400',
};

export function ArenaInfoPanel({
  arenaName,
  biom,
  mutation,
  isExpanded,
  onToggle,
  onClose
}: ArenaInfoPanelProps) {
  // Get element icons
  const BiomIcon = biom ? elementIcons[biom.element as keyof typeof elementIcons] || Sparkles : Sparkles;
  const MutationIcon = mutation ? elementIcons[mutation.element as keyof typeof elementIcons] || Sparkles : Sparkles;

  return (
    <div className="bg-gray-900/30 border-2 border-purple-500/30 rounded-2xl p-6 min-w-[400px] shadow-2xl opacity-30">
      {/* Header with Arena Name, Toggle and Close Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl text-white">{arenaName}</h2>
          <button
            onClick={onToggle}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Expanded Content - Only show when isExpanded is true */}
      {isExpanded && (
        <>
          {/* Biom Section */}
          {biom && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                {/* Element Icon */}
                <BiomIcon className={`w-8 h-8 ${elementColors[biom.element] || 'text-gray-400'}`} />
                
                {/* BIOM Badge */}
                <div className="bg-purple-600 px-4 py-1 rounded-lg">
                  <span className="text-white uppercase tracking-wider">BIOM</span>
                </div>

                {/* Dice Value */}
                {biom.trigger_dice_value && (
                  <div className="bg-purple-500 px-3 py-1 rounded-lg flex items-center gap-1">
                    <span className="text-white text-xl">🎲</span>
                    <span className="text-white">{biom.trigger_dice_value}</span>
                  </div>
                )}
              </div>

              {/* Biom Name */}
              <div className="text-xl text-white ml-11 mb-1">
                {biom.name}
              </div>

              {/* Biom Effects */}
              <div className="text-gray-300 ml-11">
                {biom.effects && biom.effects.length > 0 
                  ? biom.effects.join(' • ')
                  : 'No effects'}
              </div>
            </div>
          )}

          {/* Mutation Section */}
          {mutation && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                {/* Element Icon */}
                <MutationIcon className={`w-8 h-8 ${elementColors[mutation.element] || 'text-gray-400'}`} />
                
                {/* MUTATION Badge */}
                <div className="bg-pink-600 px-4 py-1 rounded-lg">
                  <span className="text-white uppercase tracking-wider">MUTATION</span>
                </div>

                {/* Dice Value */}
                {mutation.trigger_dice_value && (
                  <div className="bg-pink-500 px-3 py-1 rounded-lg flex items-center gap-1">
                    <span className="text-white text-xl">🎲</span>
                    <span className="text-white">{mutation.trigger_dice_value}</span>
                  </div>
                )}
              </div>

              {/* Mutation Name */}
              <div className="text-xl text-white ml-11 mb-1">
                {mutation.name}
              </div>

              {/* Mutation Effects */}
              <div className="text-gray-300 ml-11">
                {mutation.effects && mutation.effects.length > 0 
                  ? mutation.effects.join(' • ')
                  : 'No effects'}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}