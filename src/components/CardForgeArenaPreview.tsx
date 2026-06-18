import React from 'react';
import { X } from 'lucide-react';
import { Card } from './Card';

interface ArenaCardSectionProps {
  title: string;
  icon: string;
  card: any;
  labelClass: string;
  effectClass: string;
  borderClass: string;
}

function ArenaCardSection({ title, icon, card, labelClass, effectClass, borderClass }: ArenaCardSectionProps) {
  return card ? (
    <div className={`bg-gray-900/50 rounded-lg p-4 border ${borderClass}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <h5 className={`text-lg ${labelClass}`}>
          {title}: {card.name} {card.trigger_dice_value ? `(🎲 ${card.trigger_dice_value})` : ''}
        </h5>
      </div>
      <div className="text-sm text-gray-300 mb-2">Element: {card.element}</div>
      <div className="space-y-2">
        <p className="text-xs text-gray-400">{title} Effects:</p>
        {(card.effects || []).map((effect: string, idx: number) => (
          <div key={idx} className={`text-sm ${effectClass} bg-opacity-20 rounded px-3 py-2`}>• {effect}</div>
        ))}
      </div>
    </div>
  ) : (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
      <p className="text-gray-500">{title} card not found</p>
    </div>
  );
}

interface CardForgeArenaPreviewProps {
  selectedArena: any;
  cards: any[];
  onNameChange: (name: string) => void;
  onSaveName: () => void;
  onClose: () => void;
}

export function CardForgeArenaPreview({
  selectedArena,
  cards,
  onNameChange,
  onSaveName,
  onClose,
}: CardForgeArenaPreviewProps) {
  if (!selectedArena) return null;

  const biomCard = cards.find((c) => c.id === selectedArena.biom_card_id);
  const mutationCard = cards.find((c) => c.id === selectedArena.mutation_card_id);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-white">Arena Preview: {selectedArena.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl text-white mb-4">Combined Arena</h3>
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/30">
              <div className="text-center mb-6">
                <div className="text-3xl mb-2">🏟️</div>
                <input
                  type="text"
                  value={selectedArena.name}
                  onChange={(e) => onNameChange(e.target.value)}
                  onBlur={onSaveName}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                  className="text-2xl text-white bg-purple-900/10 border-2 border-purple-500/40 hover:border-purple-500/60 focus:border-purple-500 focus:bg-purple-900/20 focus:outline-none text-center transition-colors px-4 py-2 rounded-lg"
                  placeholder="Arena Name"
                />
                <p className="text-sm text-gray-400 mt-2">Arena Configuration</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <ArenaCardSection
                  title="Biom"
                  icon="🏔️"
                  card={biomCard}
                  labelClass="text-blue-300"
                  effectClass="text-blue-200 bg-blue-900/20"
                  borderClass="border-blue-500/30"
                />
                <ArenaCardSection
                  title="Mutation"
                  icon="⚡"
                  card={mutationCard}
                  labelClass="text-pink-300"
                  effectClass="text-pink-200 bg-pink-900/20"
                  borderClass="border-pink-500/30"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl text-white mb-4">Individual Cards</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {biomCard && (
                <div>
                  <p className="text-sm text-gray-400 mb-3">🏔️ Biom Card</p>
                  <Card {...biomCard} preview={true} />
                </div>
              )}
              {mutationCard && (
                <div>
                  <p className="text-sm text-gray-400 mb-3">⚡ Mutation Card</p>
                  <Card {...mutationCard} preview={true} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
