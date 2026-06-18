import React from 'react';
import { Menu, X, Search } from 'lucide-react';
import { Card } from './Card';

interface PlacedCard {
  cardData: any;
  position: { x: number; y: number };
  zIndex: number;
  id: string;
}

interface ArenaDeckProps {
  cards: any[];
  placedCards: PlacedCard[];
  loading: boolean;
  sidebarOpen: boolean;
  searchTerm: string;
  onToggleSidebar: () => void;
  onSearchChange: (term: string) => void;
  onDragStart: (e: React.DragEvent, card: any) => void;
}

export function ArenaDeck({
  cards,
  placedCards,
  loading,
  sidebarOpen,
  searchTerm,
  onToggleSidebar,
  onSearchChange,
  onDragStart,
}: ArenaDeckProps) {
  const filteredCards = cards.filter((card) => {
    const search = searchTerm.toLowerCase();
    return (
      card.name.toLowerCase().includes(search) ||
      card.type.toLowerCase().includes(search) ||
      card.element.toLowerCase().includes(search) ||
      (card.effects && card.effects.some((effect: string) => effect.toLowerCase().includes(search))) ||
      (card.effects_text && card.effects_text.toLowerCase().includes(search))
    );
  });

  return (
    <>
      <div
        className={`bg-gray-900 border-r border-gray-800 transition-all duration-300 ${
          sidebarOpen ? 'w-48' : 'w-0'
        } flex flex-col overflow-hidden`}
      >
        <div className="p-3 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg text-white">Card Deck</h2>
            <button
              onClick={onToggleSidebar}
              className="text-gray-400 hover:text-white transition-colors lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-2 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {loading ? (
            <div className="text-gray-500 text-center py-8 text-xs">Loading cards...</div>
          ) : cards.length === 0 ? (
            <div className="text-gray-500 text-center py-8 text-xs">
              No cards available. Create cards in Card Forge first!
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="text-gray-500 text-center py-8 text-xs">
              No cards found matching &quot;{searchTerm}&quot;
            </div>
          ) : (
            filteredCards.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={(e) => onDragStart(e, card)}
                className="cursor-grab active:cursor-grabbing transform hover:scale-105 transition-transform h-48 overflow-hidden"
              >
                <div className="scale-50 origin-top">
                  <Card {...card} preview={false} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {!sidebarOpen && (
        <button
          onClick={onToggleSidebar}
          className="absolute top-16 left-2 z-40 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
