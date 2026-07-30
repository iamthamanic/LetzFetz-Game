/**
 * Left column: V5 Formel-Bausteine library grouped by role.
 * Location: src/features/build/FormulaLibraryPanel.tsx
 */
import React, { useState } from 'react';
import {
  BUILD_SLOT_LABEL_DE,
  BUILD_SLOT_ORDER,
  type BuildSlotRole,
} from './model/buildTypes';
import {
  FORMULA_CARD_DRAG_MIME,
  type FormulaCatalogCard,
} from './model/combinateFormula';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ElementIcon, ELEMENT_LABELS_DE } from '../../components/ui/ElementIcon';
import type { Element } from '../../game/types/elements';

interface FormulaLibraryPanelProps {
  cards: FormulaCatalogCard[];
}

const ROLE_ACCENT: Record<BuildSlotRole, string> = {
  technik: 'border-emerald-600/50 text-emerald-300',
  essenz: 'border-sky-600/50 text-sky-300',
  katalysator: 'border-amber-500/50 text-amber-300',
};

const ELEMENT_ORDER: Element[] = ['fire', 'water', 'earth', 'air', 'shadow', 'light'];

const ELEMENT_FILTER_OPTIONS = [
  { value: '', label: 'Alle Elemente' },
  ...ELEMENT_ORDER.map((el) => ({ value: el, label: ELEMENT_LABELS_DE[el] })),
];

function cardMatchesQuery(card: FormulaCatalogCard, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const elementLabel = card.element ? ELEMENT_LABELS_DE[card.element] : '';
  const haystack = [
    card.name,
    card.id,
    BUILD_SLOT_LABEL_DE[card.role],
    elementLabel,
    card.effectText,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

function FormulaCardTile({ card }: { card: FormulaCatalogCard }) {
  const elementLabel = card.element ? ELEMENT_LABELS_DE[card.element] : 'Neutral';

  return (
    <div
      className={`relative flex w-full max-w-[7.5rem] flex-col overflow-hidden rounded-md border bg-stone-900/90 ${ROLE_ACCENT[card.role]}`}
      data-testid={`build-library-formula-${card.id}`}
    >
      <button
        type="button"
        draggable
        title={`${card.name} · ${elementLabel} · Stabilität ${card.stability}`}
        onDragStart={(event) => {
          event.dataTransfer.setData(FORMULA_CARD_DRAG_MIME, card.id);
          event.dataTransfer.setData('text/plain', card.id);
          event.dataTransfer.effectAllowed = 'copyMove';
        }}
        className="group relative flex cursor-grab flex-col text-left active:cursor-grabbing"
      >
        <div className="absolute left-0.5 top-0.5 z-10 rounded bg-stone-950/85 p-0.5 ring-1 ring-stone-700/80">
          {card.element ? (
            <ElementIcon element={card.element} size="sm" variant="lucide" />
          ) : (
            <span className="block px-0.5 text-[9px] font-semibold text-stone-400">T/K</span>
          )}
        </div>
        <div className="aspect-[2/3] bg-stone-950">
          <ImageWithFallback
            src={card.imageUrl}
            alt={card.name}
            className="h-full w-full object-contain p-1 pb-5"
          />
        </div>
        <div className="border-t border-stone-800 px-1 py-0.5">
          <p className="truncate text-[9px] font-semibold leading-tight text-stone-100">
            {card.name}
          </p>
          <p className="truncate text-[8px] uppercase tracking-wide text-stone-500">
            {elementLabel}
          </p>
        </div>
      </button>
    </div>
  );
}

export function FormulaLibraryPanel({ cards }: FormulaLibraryPanelProps) {
  const [query, setQuery] = useState('');
  const [elementFilter, setElementFilter] = useState('');

  const filtered = cards.filter((card) => {
    if (!cardMatchesQuery(card, query)) return false;
    if (!elementFilter) return true;
    if (card.role !== 'essenz') return elementFilter === '';
    return card.element === elementFilter;
  });

  const byRole = BUILD_SLOT_ORDER.reduce(
    (acc, role) => {
      acc[role] = filtered.filter((c) => c.role === role);
      return acc;
    },
    {} as Record<BuildSlotRole, FormulaCatalogCard[]>,
  );

  return (
    <aside
      className="flex h-full w-56 shrink-0 flex-col overflow-hidden border-r border-stone-800 bg-stone-950/95"
      data-testid="build-library"
    >
      <header className="flex-none space-y-1.5 border-b border-stone-800 px-2.5 py-2">
        <h2 className="font-brand text-xs uppercase tracking-wide text-amber-100 sm:text-sm">
          Formel-Bausteine
        </h2>
        <p className="text-[9px] text-stone-500">V5 Material · 36 Karten</p>
        <Input
          label="Suche"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, Effekt…"
          data-testid="build-library-search"
          className="[&_input]:py-1.5 [&_input]:text-xs [&_span]:mb-0.5 [&_span]:text-[9px]"
        />
        <Select
          label="Element"
          value={elementFilter}
          onChange={(event) => setElementFilter(event.target.value)}
          options={ELEMENT_FILTER_OPTIONS}
          data-testid="build-library-element-filter"
          className="[&_select]:py-1.5 [&_select]:text-xs [&_span]:mb-0.5 [&_span]:text-[9px]"
        />
      </header>

      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-2 py-2">
        {cards.length === 0 ? (
          <p
            className="rounded-lg border border-dashed border-stone-700 bg-stone-900/50 px-2 py-4 text-center text-[11px] text-stone-400"
            data-testid="build-library-empty"
          >
            Keine Formel-Bausteine im V5-Pack gefunden.
          </p>
        ) : filtered.length === 0 ? (
          <p
            className="rounded-lg border border-dashed border-stone-700 bg-stone-900/50 px-2 py-4 text-center text-[11px] text-stone-400"
            data-testid="build-library-no-matches"
          >
            Keine Karten für diese Suche.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {BUILD_SLOT_ORDER.map((role) => {
              const group = byRole[role];
              return (
                <section key={role} aria-label={BUILD_SLOT_LABEL_DE[role]} className="min-w-0">
                  <h3
                    className={`mb-1.5 text-[9px] font-bold uppercase tracking-widest ${ROLE_ACCENT[role].split(' ').pop()}`}
                  >
                    {BUILD_SLOT_LABEL_DE[role]}
                    <span className="ml-1 font-normal text-stone-600">({group.length})</span>
                  </h3>
                  {group.length === 0 ? (
                    <p className="text-[10px] text-stone-600">—</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {group.map((card) => (
                        <FormulaCardTile key={card.id} card={card} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
