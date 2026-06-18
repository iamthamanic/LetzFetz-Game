/**
 * Card Forge sidebar — V1 rulebook categories and card list.
 * Location: src/components/CardForgeSidebar.tsx
 */
import React from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { CARD_CATEGORIES } from '../services/cardForge/categories';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { EmptyState } from './ui/EmptyState';
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
    <div className="flex w-80 flex-col border-r border-stone-800 bg-stone-900">
      <div className="flex-none space-y-3 p-4 border-b border-stone-800">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-stone-100">Base Pack V1</h2>
          <p className="text-xs text-stone-500">{cards.length} Karten geladen</p>
        </div>

        <Input
          placeholder="Karten suchen…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />

        <Button variant="accent" size="sm" icon={<Plus className="w-4 h-4" />} onClick={onCreateNew} className="w-full">
          Neue Karte
        </Button>

        <div className="space-y-1">
          {CARD_CATEGORIES.map((category) => {
            const typeCards = cards.filter((c) => c.type === category.id);
            const isActive = activeTab === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onActiveTabChange(category.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? 'bg-purple-900/40 text-purple-100 ring-1 ring-purple-700'
                    : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="opacity-80">{category.icon}</span>
                  {category.label}
                </span>
                <Badge variant={isActive ? 'accent' : 'default'}>{typeCards.length}</Badge>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-stone-500">
            <Loader2 className="mb-2 h-5 w-5 animate-spin" />
            <span className="text-xs">Karten werden geladen…</span>
          </div>
        ) : filteredCards.length === 0 ? (
          <EmptyState
            title={searchTerm ? 'Keine Treffer' : 'Kategorie leer'}
            subtitle={searchTerm ? 'Andere Suchbegriffe ausprobieren' : undefined}
          />
        ) : (
          filteredCards.map((card) => {
            const selected = selectedCard?.id === card.id;
            return (
              <button
                key={card.id}
                onClick={() => onSelectCard(card)}
                className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition-colors ${
                  selected
                    ? 'border-purple-600 bg-purple-900/20'
                    : 'border-stone-800 bg-stone-800/50 hover:bg-stone-800'
                }`}
              >
                {card.image_asset ? (
                  <img
                    src={card.image_asset}
                    alt={card.name}
                    className="h-14 w-14 flex-none rounded-md border border-stone-700 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 flex-none items-center justify-center rounded-md border border-stone-700 bg-stone-800">
                    <span className="text-xl opacity-60">{TYPE_ICONS[card.type] ?? '🃏'}</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-stone-100">{card.name || 'Unbenannt'}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    {card.elementDisplay && (
                      <Badge variant="default">{card.elementDisplay}</Badge>
                    )}
                    {card.stats_json?.cardType && (
                      <Badge variant="accent">{card.stats_json.cardType}</Badge>
                    )}
                    {card.stats_json?.value != null && card.type === 'Element' && (
                      <Badge variant="info">Wert {card.stats_json.value}</Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
