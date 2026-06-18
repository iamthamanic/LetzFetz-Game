/**
 * Card Forge sidebar — V1 rulebook categories and card list.
 * Location: src/components/CardForgeSidebar.tsx
 */
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { CARD_CATEGORIES } from '../services/cardForge/categories';
import type { ForgeCardData } from '../services/cardForge/types';

interface CardForgeSidebarProps {
  cards: ForgeCardData[];
  filteredCards: ForgeCardData[];
  loading: boolean;
  searchTerm: string;
  activeTab: string;
  selectedCard: ForgeCardData | null;
  onSearchChange: (term: string) => void;
  onActiveTabChange: (tab: string) => void;
  onSelectCard: (card: ForgeCardData) => void;
  onCreateNew: () => void;
}

const TYPE_ICONS: Record<string, string> = {
  Character: '⚔️',
  Ultimate: '💫',
  Element: '🃏',
  Arena: '🏟️',
  Glitch: '🌀',
};

export function CardForgeSidebar({
  cards,
  filteredCards,
  loading,
  searchTerm,
  activeTab,
  selectedCard,
  onSearchChange,
  onActiveTabChange,
  onSelectCard,
  onCreateNew,
}: CardForgeSidebarProps) {
  return (
    <div className="w-96 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-white font-semibold mb-1">Letz Fetz — Base Pack V1</h2>
        <p className="text-xs text-gray-400 mb-4">90 Karten laut Spielanleitung</p>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Karten suchen…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
          />
        </div>

        <button
          onClick={onCreateNew}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors mb-4"
        >
          <Plus className="w-4 h-4" />
          Neue Karte (Custom)
        </button>

        <div className="space-y-1">
          {CARD_CATEGORIES.map((category) => {
            const typeCards = cards.filter((c) => c.type === category.id);
            return (
              <button
                key={category.id}
                onClick={() => onActiveTabChange(category.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  activeTab === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                }`}
              >
                <span className="text-sm flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.label}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === category.id ? 'bg-purple-700' : 'bg-gray-700'
                  }`}
                >
                  {typeCards.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="text-gray-500 text-center py-8">Karten werden geladen…</div>
        ) : filteredCards.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            {searchTerm ? 'Keine Karten gefunden' : 'Keine Karten in dieser Kategorie'}
          </div>
        ) : (
          filteredCards.map((card) => (
            <button
              key={card.id}
              onClick={() => onSelectCard(card)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedCard?.id === card.id
                  ? 'bg-purple-900/30 border-purple-500'
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
              }`}
            >
              <div className="flex gap-3 items-center">
                {card.image_asset ? (
                  <img
                    src={card.image_asset}
                    alt={card.name}
                    className="w-16 h-16 object-cover rounded border-2 border-gray-600 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-700 rounded border-2 border-gray-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl opacity-50">{TYPE_ICONS[card.type] ?? '🃏'}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-white truncate">{card.name}</div>
                  <div className="text-sm text-gray-400 mt-1 flex items-center justify-between gap-2">
                    <span>{card.elementDisplay ?? card.element}</span>
                    {card.stats_json?.cardType && (
                      <span className="text-xs bg-gray-700 px-2 py-0.5 rounded capitalize">
                        {card.stats_json.cardType}
                      </span>
                    )}
                    {card.stats_json?.value != null && card.type === 'Element' && (
                      <span className="text-xs text-purple-300">{card.stats_json.value}</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
