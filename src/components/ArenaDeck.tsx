/**
 * Arena sandbox card deck sidebar.
 * Location: src/components/ArenaDeck.tsx
 */
import React from 'react';
import { Menu, X, Search, Loader2 } from 'lucide-react';
import { Card } from './Card';
import { Input } from './ui/Input';
import { EmptyState } from './ui/EmptyState';
import { Button } from './ui/Button';

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
      card.name?.toLowerCase().includes(search) ||
      card.type?.toLowerCase().includes(search) ||
      card.element?.toLowerCase().includes(search) ||
      card.effects?.some((effect: string) => effect.toLowerCase().includes(search)) ||
      card.effects_text?.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <div
        className={`flex flex-col border-r border-stone-800 bg-stone-900 transition-all duration-300 ${
          sidebarOpen ? 'w-56' : 'w-0'
        }`}
      >
        <div className="flex-none space-y-3 border-b border-stone-800 p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-100">Karten-Deck</h2>
            <Button
              variant="ghost"
              size="sm"
              icon={<X className="h-4 w-4" />}
              onClick={onToggleSidebar}
              className="px-2 lg:hidden"
            />
          </div>
          <Input
            placeholder="Karten suchen…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-stone-500">
              <Loader2 className="mb-2 h-5 w-5 animate-spin" />
              <span className="text-xs">Lade Karten…</span>
            </div>
          ) : cards.length === 0 ? (
            <EmptyState
              title="Keine Karten"
              subtitle="Erstelle Karten in der Card Forge, um sie hier zu platzieren."
              icon="🃏"
            />
          ) : filteredCards.length === 0 ? (
            <EmptyState title="Keine Treffer" subtitle={`Für „${searchTerm}“`} />
          ) : (
            filteredCards.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={(e) => onDragStart(e, card)}
                className="cursor-grab active:cursor-grabbing"
              >
                <div className="origin-top scale-[0.55] transition-transform hover:scale-[0.6]">
                  <Card {...card} preview={false} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {!sidebarOpen && (
        <Button
          variant="secondary"
          size="sm"
          icon={<Menu className="h-4 w-4" />}
          onClick={onToggleSidebar}
          className="absolute left-3 top-20 z-40"
        >
          Deck
        </Button>
      )}
    </>
  );
}
