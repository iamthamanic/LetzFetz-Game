/**
 * Right column: cosmetic result card — same chrome empty or filled (reference default).
 * Location: src/features/build/BuildResultCard.tsx
 */
import React from 'react';
import { Input } from '../../components/ui/Input';
import {
  BUILD_SLOT_LABEL_DE,
  BUILD_SLOT_ORDER,
  defaultPartAssetPick,
  partStillThumbUrl,
  type BuildSlotRole,
  type BuildSlots,
  type MeshyCatalogPart,
  type PartAssetPick,
} from './model/buildTypes';
import { findCatalogPart } from './data/meshyPartCatalog';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

interface BuildResultCardProps {
  name: string;
  onNameChange: (name: string) => void;
  slots: BuildSlots;
  catalog: MeshyCatalogPart[];
  assetPicks: Record<string, PartAssetPick>;
}

const FAKE_STATS = [
  { label: 'Schlag', value: '—' },
  { label: 'Tempo', value: '—' },
  { label: 'Halt', value: '—' },
] as const;

const ROLE_CHIP: Record<BuildSlotRole, string> = {
  technik: 'border-emerald-600/50 bg-emerald-950/40 text-emerald-200',
  essenz: 'border-sky-600/50 bg-sky-950/40 text-sky-200',
  katalysator: 'border-amber-600/50 bg-amber-950/40 text-amber-200',
};

export function BuildResultCard({
  name,
  onNameChange,
  slots,
  catalog,
  assetPicks,
}: BuildResultCardProps) {
  const hero =
    findCatalogPart(catalog, slots.katalysator) ??
    findCatalogPart(catalog, slots.essenz) ??
    findCatalogPart(catalog, slots.technik);
  const heroSrc = hero
    ? partStillThumbUrl(hero, assetPicks[hero.id] ?? defaultPartAssetPick())
    : null;

  return (
    <aside
      className="flex h-full w-56 shrink-0 flex-col overflow-hidden border-l border-stone-800 bg-stone-950/95"
      data-testid="build-result"
    >
      <header className="flex-none border-b border-stone-800 px-2.5 py-2">
        <h2 className="font-brand text-xs uppercase tracking-wide text-amber-100 sm:text-sm">
          Ergebnis
        </h2>
        <p className="mt-0.5 text-[10px] text-stone-500">Nur Optik — keine echten Werte</p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 sm:p-2.5">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-amber-700/35 bg-gradient-to-b from-stone-800 to-stone-950 shadow-lg">
          {/* Hero art — always reserved (default chrome like filled state) */}
          <div className="relative min-h-0 flex-[1.35] bg-stone-900">
            {hero && heroSrc ? (
              <ImageWithFallback
                src={heroSrc}
                alt={name}
                className="h-full w-full object-contain p-3"
              />
            ) : (
              <div
                className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center"
                data-testid="build-result-hero-empty"
              >
                <div className="h-24 w-24 rounded-lg border border-dashed border-stone-700 bg-stone-950/60" />
                <p className="text-[11px] text-stone-500">Kombinierte Engine</p>
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/85 to-transparent px-2.5 pb-2 pt-10">
              <p className="font-brand text-sm uppercase leading-none tracking-wide text-brand-cream sm:text-base">
                {name.trim() || 'Unbenannt'}
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-widest text-amber-500/80">
                Formel · Entwurf
              </p>
            </div>
          </div>

          <div className="flex-none space-y-2 border-t border-stone-800 p-2 sm:p-2.5">
            <Input
              label="Name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              maxLength={48}
              data-testid="build-result-name"
              placeholder="Meine Formel"
              className="[&_input]:py-1.5 [&_span]:text-[9px]"
            />

            <div className="flex flex-wrap gap-1" data-testid="build-result-slots">
              {BUILD_SLOT_ORDER.map((role) => {
                const part = findCatalogPart(catalog, slots[role]);
                return (
                  <span
                    key={role}
                    className={`max-w-full truncate rounded border px-1.5 py-0.5 text-[9px] font-semibold ${ROLE_CHIP[role]}`}
                    title={
                      part
                        ? `${BUILD_SLOT_LABEL_DE[role]}: ${part.name}`
                        : BUILD_SLOT_LABEL_DE[role]
                    }
                  >
                    {part?.name ?? BUILD_SLOT_LABEL_DE[role]}
                  </span>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-1" aria-hidden>
              {FAKE_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-md border border-stone-800 bg-stone-900/80 px-1 py-1.5 text-center"
                >
                  <p className="text-[8px] uppercase tracking-wider text-stone-500">{stat.label}</p>
                  <p className="text-xs font-semibold text-stone-400">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
