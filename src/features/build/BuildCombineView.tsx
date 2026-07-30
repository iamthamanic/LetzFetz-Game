/**
 * Build → Combinate: Meshy library, slots, live preview, result card.
 * Location: src/features/build/BuildCombineView.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { PartLibraryPanel } from './PartLibraryPanel';
import { BuildSlotsPanel } from './BuildSlotsPanel';
import { BuildPreviewPane } from './BuildPreviewPane';
import { BuildResultCard } from './BuildResultCard';
import { findCatalogPart, loadMeshyPartCatalog } from './data/meshyPartCatalog';
import { loadCombinateVisibleEngineParts } from './data/enginePartsCombinateCatalog';
import {
  BUILD_SLOT_ORDER,
  resolvePartAssets,
  type BuildSession,
  type BuildSlotRole,
  type MeshyCatalogPart,
  type PartAssetPick,
} from './model/buildTypes';
import { loadBuildSession, saveBuildSession } from './storage/buildSessionStorage';

interface BuildCombineViewProps {
  /** True while Build → Combinate is visible (controls 3D canvas mount). */
  active: boolean;
}

function assignPartToSession(
  session: BuildSession,
  catalog: MeshyCatalogPart[],
  partId: string,
): BuildSession {
  const part = findCatalogPart(catalog, partId);
  if (!part) return session;
  return {
    ...session,
    slots: {
      ...session.slots,
      [part.role]: partId,
    },
    lastDroppedPartId: partId,
  };
}

function clearSlot(session: BuildSession, role: BuildSlotRole): BuildSession {
  return {
    ...session,
    slots: {
      ...session.slots,
      [role]: null,
    },
  };
}

export function BuildCombineView({ active }: BuildCombineViewProps) {
  const catalogRef = useRef(
    (() => {
      const meshy = loadMeshyPartCatalog();
      const engine = loadCombinateVisibleEngineParts();
      const byId = new Map<string, MeshyCatalogPart>();
      for (const p of meshy) byId.set(p.id, p);
      for (const p of engine) byId.set(p.id, p);
      return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, 'de'));
    })(),
  );
  const catalog = catalogRef.current;
  const [session, setSession] = useState<BuildSession>(() => loadBuildSession().session);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveBuildSession(session);
    }, 200);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [session]);

  const setAssetPick = (partId: string, pick: PartAssetPick) => {
    setSession((prev) => ({
      ...prev,
      assetPicks: { ...prev.assetPicks, [partId]: pick },
    }));
  };

  const glbParts = BUILD_SLOT_ORDER.map((role) => {
    const part = findCatalogPart(catalog, session.slots[role]);
    if (!part) return null;
    const assets = resolvePartAssets(part, session.assetPicks[part.id]);
    if (assets.view !== '3d' || !assets.glbUrl) return null;
    return { ...part, glbUrl: assets.glbUrl, masterUrl: assets.masterUrl };
  }).filter((p): p is MeshyCatalogPart => p != null);

  const lastDropped = findCatalogPart(catalog, session.lastDroppedPartId);
  const anySlotted =
    findCatalogPart(catalog, session.slots.technik) ??
    findCatalogPart(catalog, session.slots.essenz) ??
    findCatalogPart(catalog, session.slots.katalysator);
  const focusPart = lastDropped ?? anySlotted;
  const focusAssets = focusPart
    ? resolvePartAssets(focusPart, session.assetPicks[focusPart.id])
    : null;

  return (
    <div
      className="flex h-full min-h-0 flex-row overflow-hidden"
      data-testid="build-combine"
    >
      <PartLibraryPanel
        parts={catalog}
        assetPicks={session.assetPicks}
        onAssetPickChange={setAssetPick}
      />

      <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden p-2 sm:gap-2.5 sm:p-3">
        <header className="flex-none">
          <h1 className="font-brand text-base uppercase tracking-wide text-amber-100 sm:text-lg">
            Combinate
          </h1>
          <p className="text-[10px] text-stone-500 sm:text-[11px]">
            Live-Vorschau oben · drei Bauteil-Slots darunter
          </p>
        </header>

        <div className="flex min-h-0 flex-col" style={{ flex: '0.75 1 0%' }}>
          <BuildPreviewPane
            active={active}
            glbParts={glbParts}
            fallbackMasterUrl={focusAssets?.masterUrl ?? null}
            fallbackLabel={focusPart?.name ?? 'Vorschau'}
            pairLabelDe={focusAssets?.statusLabelDe ?? focusPart?.pairLabelDe ?? null}
            pairStatus={
              focusPart?.models.length === 0
                ? '2d-only'
                : (focusPart?.pairStatus ?? null)
            }
          />
        </div>

        <div className="flex min-h-0 flex-col" style={{ flex: '1.35 1 0%' }}>
          <BuildSlotsPanel
            slots={session.slots}
            catalog={catalog}
            assetPicks={session.assetPicks}
            onAssign={(partId) =>
              setSession((prev) => assignPartToSession(prev, catalog, partId))
            }
            onClear={(role) => setSession((prev) => clearSlot(prev, role))}
          />
        </div>
      </section>

      <BuildResultCard
        name={session.name}
        onNameChange={(name) => setSession((prev) => ({ ...prev, name }))}
        slots={session.slots}
        catalog={catalog}
        assetPicks={session.assetPicks}
      />
    </div>
  );
}
