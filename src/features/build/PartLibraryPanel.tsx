/**
 * Left column: Meshy parts library with search, element filter, version history.
 * Location: src/features/build/PartLibraryPanel.tsx
 */
import React, { useState } from 'react';
import {
  BUILD_SLOT_LABEL_DE,
  BUILD_SLOT_ORDER,
  defaultPartAssetPick,
  normalizePartElement,
  partStillThumbUrl,
  resolvePartAssets,
  type BuildSlotRole,
  type MeshyCatalogPart,
  type PartAssetPick,
} from './model/buildTypes';
import { BUILD_PART_DRAG_MIME } from './data/meshyPartCatalog';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ElementIcon, ELEMENT_LABELS_DE } from '../../components/ui/ElementIcon';
import type { Element } from '../../game/types/elements';
import { PartHistoryModal } from './PartHistoryModal';

interface PartLibraryPanelProps {
  parts: MeshyCatalogPart[];
  assetPicks: Record<string, PartAssetPick>;
  onAssetPickChange: (partId: string, pick: PartAssetPick) => void;
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

function partMatchesQuery(part: MeshyCatalogPart, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const element = normalizePartElement(part.element);
  const haystack = [
    part.name,
    part.id,
    BUILD_SLOT_LABEL_DE[part.role],
    part.role,
    part.element ?? '',
    element ? ELEMENT_LABELS_DE[element] : '',
    part.pairLabelDe,
    ...part.masters.map((m) => m.labelDe),
    ...part.models.map((m) => m.labelDe),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

function statusBadgeClass(part: MeshyCatalogPart, statusLabel: string): string {
  if (part.models.length === 0 || statusLabel.startsWith('Nur 2D')) {
    return 'border-stone-600/50 bg-stone-950/85 text-stone-400';
  }
  if (part.pairStatus === 'stale') {
    return 'border-amber-600/50 bg-amber-950/85 text-amber-200';
  }
  if (statusLabel.startsWith('3D')) {
    return 'border-violet-600/50 bg-violet-950/85 text-violet-200';
  }
  return 'border-emerald-700/50 bg-emerald-950/80 text-emerald-200';
}

function PartTile({
  part,
  pick,
  onOpenHistory,
}: {
  part: MeshyCatalogPart;
  pick: PartAssetPick;
  onOpenHistory: () => void;
}) {
  const element = normalizePartElement(part.element);
  const elementLabel = element ? ELEMENT_LABELS_DE[element] : 'Kein Element';
  const assets = resolvePartAssets(part, pick);

  return (
    <div
      className={`relative flex w-full max-w-[7.5rem] flex-col overflow-hidden rounded-md border bg-stone-900/90 ${ROLE_ACCENT[part.role]}`}
      data-testid={`build-library-part-${part.id}`}
    >
      <button
        type="button"
        draggable
        title={`${part.name} · ${elementLabel} · ${assets.statusLabelDe}`}
        onDragStart={(event) => {
          event.dataTransfer.setData(BUILD_PART_DRAG_MIME, part.id);
          event.dataTransfer.setData('text/plain', part.id);
          event.dataTransfer.effectAllowed = 'copyMove';
        }}
        className="group relative flex cursor-grab flex-col text-left active:cursor-grabbing"
      >
        <div className="absolute left-0.5 top-0.5 z-10 rounded bg-stone-950/85 p-0.5 ring-1 ring-stone-700/80">
          {element ? (
            <ElementIcon element={element} size="sm" variant="lucide" />
          ) : (
            <span className="block px-0.5 text-[9px] text-stone-500">?</span>
          )}
        </div>
        <span
          className={`absolute bottom-[1.65rem] left-0.5 right-0.5 z-10 truncate rounded border px-1 py-0.5 text-center text-[7px] font-semibold leading-tight ${statusBadgeClass(part, assets.statusLabelDe)}`}
          data-testid={`build-library-pair-${part.id}`}
        >
          {assets.statusLabelDe}
        </span>
        <div className="aspect-[2/3] bg-stone-950">
          <ImageWithFallback
            src={partStillThumbUrl(part, pick)}
            alt={part.name}
            className="h-full w-full object-contain p-1 pb-5"
          />
        </div>
        <div className="border-t border-stone-800 px-1 py-0.5">
          <p className="truncate text-[9px] font-semibold leading-tight text-stone-100">
            {part.name}
          </p>
          <p className="truncate text-[8px] uppercase tracking-wide text-stone-500">
            {elementLabel}
          </p>
        </div>
      </button>
      <button
        type="button"
        data-testid={`build-library-history-${part.id}`}
        onClick={onOpenHistory}
        className="border-t border-stone-800 bg-stone-950/80 px-1 py-1 text-[9px] font-semibold uppercase tracking-wide text-amber-200/90 hover:bg-stone-900 hover:text-amber-100"
      >
        Versionen
      </button>
    </div>
  );
}

export function PartLibraryPanel({
  parts,
  assetPicks,
  onAssetPickChange,
}: PartLibraryPanelProps) {
  const [query, setQuery] = useState('');
  const [elementFilter, setElementFilter] = useState('');
  const [historyPartId, setHistoryPartId] = useState<string | null>(null);

  const filtered = parts.filter((part) => {
    if (!partMatchesQuery(part, query)) return false;
    if (!elementFilter) return true;
    return normalizePartElement(part.element) === elementFilter;
  });

  const byRole = BUILD_SLOT_ORDER.reduce(
    (acc, role) => {
      acc[role] = filtered.filter((p) => p.role === role);
      return acc;
    },
    {} as Record<BuildSlotRole, MeshyCatalogPart[]>,
  );

  const historyPart = historyPartId
    ? (parts.find((p) => p.id === historyPartId) ?? null)
    : null;

  return (
    <aside
      className="flex h-full w-56 shrink-0 flex-col overflow-hidden border-r border-stone-800 bg-stone-950/95"
      data-testid="build-library"
    >
      <header className="flex-none space-y-1.5 border-b border-stone-800 px-2.5 py-2">
        <h2 className="font-brand text-xs uppercase tracking-wide text-amber-100 sm:text-sm">
          Bauteile
        </h2>
        <Input
          label="Suche"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, Element…"
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
        {parts.length === 0 ? (
          <p
            className="rounded-lg border border-dashed border-stone-700 bg-stone-900/50 px-2 py-4 text-center text-[11px] text-stone-400"
            data-testid="build-library-empty"
          >
            Noch keine Teile mit Master-Bild unter{' '}
            <code className="text-stone-300">assets/meshy/</code>.
          </p>
        ) : filtered.length === 0 ? (
          <p
            className="rounded-lg border border-dashed border-stone-700 bg-stone-900/50 px-2 py-4 text-center text-[11px] text-stone-400"
            data-testid="build-library-no-matches"
          >
            Keine Teile für diese Suche.
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
                      {group.map((part) => (
                        <PartTile
                          key={part.id}
                          part={part}
                          pick={assetPicks[part.id] ?? defaultPartAssetPick()}
                          onOpenHistory={() => setHistoryPartId(part.id)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>

      <PartHistoryModal
        part={historyPart}
        pick={
          historyPart
            ? (assetPicks[historyPart.id] ?? defaultPartAssetPick())
            : defaultPartAssetPick()
        }
        open={historyPart != null}
        onClose={() => setHistoryPartId(null)}
        onSave={(next) => {
          if (historyPart) onAssetPickChange(historyPart.id, next);
        }}
      />
    </aside>
  );
}
