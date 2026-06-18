import React from 'react';
import { X, Search } from 'lucide-react';

interface ArenaSelectionModalProps {
  isOpen: boolean;
  arenas: any[];
  cards: any[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelect: (arena: any) => void;
  onClose: () => void;
}

export function ArenaSelectionModal({
  isOpen,
  arenas,
  cards,
  searchTerm,
  onSearchChange,
  onSelect,
  onClose,
}: ArenaSelectionModalProps) {
  if (!isOpen) return null;

  const filteredArenas = arenas.filter((arena) => {
    const search = searchTerm.toLowerCase();
    const biomCard = cards.find((c) => c.id === arena.biom_card_id);
    const mutationCard = cards.find((c) => c.id === arena.mutation_card_id);
    return (
      arena.name.toLowerCase().includes(search) ||
      (biomCard && biomCard.name.toLowerCase().includes(search)) ||
      (mutationCard && mutationCard.name.toLowerCase().includes(search)) ||
      (biomCard && biomCard.effects && biomCard.effects.some((effect: string) => effect.toLowerCase().includes(search))) ||
      (mutationCard && mutationCard.effects && mutationCard.effects.some((effect: string) => effect.toLowerCase().includes(search)))
    );
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/30 rounded-xl border border-gray-800/30 w-full max-w-2xl shadow-2xl">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-white">Select Arena</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search arenas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {arenas.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No arenas available. Create arenas in the Edit view under Arena Library.
            </div>
          ) : filteredArenas.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No arenas found matching &quot;{searchTerm}&quot;
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredArenas.map((arena) => {
                const biomCard = cards.find((c) => c.id === arena.biom_card_id);
                const mutationCard = cards.find((c) => c.id === arena.mutation_card_id);
                return (
                  <button
                    key={arena.id}
                    onClick={() => onSelect(arena)}
                    className="text-left p-4 rounded-lg border bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-purple-500 transition-colors"
                  >
                    <h3 className="text-white text-lg mb-3">{arena.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🏔️</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-semibold text-purple-400 bg-purple-900/50 px-2 py-1 rounded">BIOM</span>
                            {biomCard?.trigger_dice_value && (
                              <span className="text-xs text-white bg-purple-600 px-2 py-1 rounded flex items-center gap-1">
                                🎲 {biomCard.trigger_dice_value}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-purple-300">
                            {biomCard?.name || 'Unknown Biom'}
                          </div>
                          {biomCard && (
                            <div className="text-xs text-gray-400 mt-1">
                              {biomCard.effects?.join(', ') || biomCard.effects_text || 'No effects'}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">⚡</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-semibold text-pink-400 bg-pink-900/50 px-2 py-1 rounded">MUTATION</span>
                            {mutationCard?.trigger_dice_value && (
                              <span className="text-xs text-white bg-pink-600 px-2 py-1 rounded flex items-center gap-1">
                                🎲 {mutationCard.trigger_dice_value}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-pink-300">
                            {mutationCard?.name || 'Unknown Mutation'}
                          </div>
                          {mutationCard && (
                            <div className="text-xs text-gray-400 mt-1">
                              {mutationCard.effects?.join(', ') || mutationCard.effects_text || 'No effects'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
