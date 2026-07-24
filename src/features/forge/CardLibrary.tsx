/**
 * Card library — inventory grid of all pack/forge cards with category filters.
 * Hover shows front + parchment back side-by-side (Character Info style).
 * Location: src/features/forge/CardLibrary.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Loader2 } from 'lucide-react';
import { CARD_CATEGORIES, type ForgeCardKind } from '../../services/cardForge/categories';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { LetzFetzCard } from '../../components/cards/LetzFetzCard';
import { forgeCharacterDefFromCard } from '../../components/cards/characterCardProps';
import { CardLibraryDetailBack } from './CardLibraryDetailBack';
import { CharacterDetailPanel } from '../../components/game/CharacterDetailPanel';
import { getUltimateForCharacter } from '../../game/packs/characterSetup';
import type { ForgeCardData } from '../../services/cardForge/types';

export type CardLibraryFilter = ForgeCardKind | 'All';

interface CardLibraryProps {
  cards: ForgeCardData[];
  filteredCards: ForgeCardData[];
  loading: boolean;
  searchTerm: string;
  activeFilter: CardLibraryFilter;
  onSearchChange: (term: string) => void;
  onFilterChange: (filter: CardLibraryFilter) => void;
  onSelectCard: (card: ForgeCardData) => void;
  onCreateNew: () => void;
}

const FILTERS: Array<{ id: CardLibraryFilter; label: string }> = [
  { id: 'All', label: 'Alle' },
  ...CARD_CATEGORIES.map((c) => ({ id: c.id as CardLibraryFilter, label: c.label })),
];

function LibraryCardFace({
  card,
  size,
  className = '',
}: {
  card: ForgeCardData;
  size: 'md' | 'lg' | 'fluid';
  className?: string;
}) {
  const characterDef =
    card.type === 'Character'
      ? forgeCharacterDefFromCard({
          id: card.id,
          name: card.name,
          type: card.type,
          elements: card.elements,
          effects: card.effects,
        })
      : null;

  return (
    <LetzFetzCard
      id={card.id}
      name={card.name || 'Unbenannt'}
      type={card.type}
      element={card.element}
      elementDisplay={card.elementDisplay}
      stats_json={card.stats_json}
      effects={card.effects}
      image_asset={card.image_asset}
      gameElements={characterDef?.elements}
      role={characterDef?.role}
      size={size}
      layout="portrait"
      hideHeader
      interactive={false}
      className={className}
    />
  );
}

const PREVIEW_PANEL_FRAME =
  'character-card-frame relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[2px] text-left shadow-xl ring-1 ring-inset ring-amber-950/25 character-card-frame-highlighted ring-amber-700/30';

function CardLibraryHoverPreview({
  card,
  onKeepOpen,
  onRequestClose,
}: {
  card: ForgeCardData;
  onKeepOpen: () => void;
  onRequestClose: () => void;
}) {
  const characterDef =
    card.type === 'Character'
      ? forgeCharacterDefFromCard({
          id: card.id,
          name: card.name,
          type: card.type,
          elements: card.elements,
          effects: card.effects,
        })
      : null;
  const ultimate = characterDef ? getUltimateForCharacter(characterDef) : undefined;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onRequestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onRequestClose]);

  const panelH = 'h-96';
  const frontW = 'w-64';
  const backW = characterDef ? 'w-64' : 'w-72';

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[300] flex items-center justify-center bg-black/55 p-3 sm:p-5"
      data-testid="card-library-hover-preview-root"
    >
      <div
        role="tooltip"
        data-testid="card-library-hover-preview"
        className="pointer-events-auto w-fit max-w-[min(96vw,48rem)] rounded-xl border border-stone-500/60 bg-stone-950/98 p-2 shadow-2xl backdrop-blur-md sm:p-2.5"
        onMouseEnter={onKeepOpen}
        onMouseLeave={onRequestClose}
      >
        <div className="flex flex-row items-stretch justify-center gap-2 sm:gap-2.5">
          <div
            className={`flex ${panelH} ${frontW} shrink-0 flex-col`}
            data-testid="card-library-hover-front"
          >
            <LibraryCardFace card={card} size="lg" className="!h-full !w-full !max-w-none" />
          </div>

          <div className={`flex ${panelH} ${backW} min-w-0 shrink-0 flex-col`}>
            <CardLibraryDetailBack
              card={card}
              omitUltimate={Boolean(characterDef)}
              fillHeight
            />
          </div>

          {characterDef ? (
            <div
              className={`flex ${panelH} ${frontW} shrink-0 flex-col`}
              data-testid="card-library-hover-ulti"
            >
              <CharacterDetailPanel
                character={characterDef}
                tab="ulti"
                ultimate={ultimate}
                className={PREVIEW_PANEL_FRAME}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function CardLibrary({
  cards,
  filteredCards,
  loading,
  searchTerm,
  activeFilter,
  onSearchChange,
  onFilterChange,
  onSelectCard,
  onCreateNew,
}: CardLibraryProps) {
  const [hoveredCard, setHoveredCard] = useState<ForgeCardData | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const showPreview = (card: ForgeCardData) => {
    clearHideTimer();
    setHoveredCard(card);
  };

  const scheduleHidePreview = () => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => setHoveredCard(null), 120);
  };

  const hidePreviewNow = () => {
    clearHideTimer();
    setHoveredCard(null);
  };

  useEffect(() => () => clearHideTimer(), []);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-stone-950" data-testid="card-library">
      <header className="flex-none space-y-2.5 border-b border-stone-800 bg-stone-900/90 px-3 py-3 sm:px-4 sm:py-3.5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="space-y-0.5">
            <h2 className="font-brand-on-dark text-base uppercase leading-none tracking-wide sm:text-lg">
              Karten-Bibliothek
            </h2>
            <p className="text-xs text-stone-500">
              Base Pack V1 · {filteredCards.length} von {cards.length} Karten
            </p>
          </div>
          <Button
            variant="accent"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={onCreateNew}
            className="font-brand uppercase leading-none tracking-wide"
          >
            Neue Karte
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Kartenfilter">
          {FILTERS.map((filter) => {
            const count =
              filter.id === 'All'
                ? cards.length
                : cards.filter((c) => c.type === filter.id).length;
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onFilterChange(filter.id)}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-left transition-colors ${
                  isActive
                    ? 'bg-purple-900/40 text-purple-100 ring-1 ring-purple-700'
                    : 'bg-stone-900 text-stone-400 ring-1 ring-stone-800 hover:bg-stone-800 hover:text-stone-200'
                }`}
              >
                <span className="font-brand text-[11px] uppercase leading-none tracking-wide sm:text-xs">
                  {filter.label}
                </span>
                <Badge variant={isActive ? 'accent' : 'default'}>{count}</Badge>
              </button>
            );
          })}
        </div>

        <Input
          placeholder="Karten suchen…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
          aria-label="Karten suchen"
        />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2 sm:px-3 sm:py-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-stone-500">
            <Loader2 className="mb-2 h-6 w-6 animate-spin" />
            <span className="text-sm">Karten werden geladen…</span>
          </div>
        ) : filteredCards.length === 0 ? (
          <EmptyState
            title={searchTerm ? 'Keine Treffer' : 'Kategorie leer'}
            subtitle={searchTerm ? 'Andere Suchbegriffe ausprobieren' : undefined}
          />
        ) : (
          <ul className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {filteredCards.map((card) => (
              <li key={card.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => onSelectCard(card)}
                  onMouseEnter={() => showPreview(card)}
                  onMouseLeave={scheduleHidePreview}
                  onFocus={() => showPreview(card)}
                  onBlur={scheduleHidePreview}
                  className="group w-full rounded-md transition-transform hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                  aria-label={`${card.name || 'Unbenannt'} öffnen`}
                  data-testid={`card-library-item-${card.id}`}
                >
                  <LibraryCardFace card={card} size="fluid" className="!max-w-none" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {hoveredCard ? (
        <CardLibraryHoverPreview
          card={hoveredCard}
          onKeepOpen={clearHideTimer}
          onRequestClose={hidePreviewNow}
        />
      ) : null}
    </div>
  );
}
