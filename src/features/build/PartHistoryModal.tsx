/**
 * Part version history: pick 2D master / 3D model versions and view mode.
 * Location: src/features/build/PartHistoryModal.tsx
 * 3D preview uses Three.js Canvas (GLB); flat imgs stay on 2D masters only.
 */
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import {
  defaultPartAssetPick,
  resolvePartAssets,
  type MeshyCatalogPart,
  type PartAssetPick,
  type PartViewMode,
} from './model/buildTypes';
import { LoosePartsScene } from './three/LoosePartsScene';

interface PartHistoryModalProps {
  part: MeshyCatalogPart | null;
  pick: PartAssetPick;
  open: boolean;
  onClose: () => void;
  onSave: (pick: PartAssetPick) => void;
}

export function PartHistoryModal({
  part,
  pick,
  open,
  onClose,
  onSave,
}: PartHistoryModalProps) {
  const [draft, setDraft] = useState<PartAssetPick>(pick);

  useEffect(() => {
    if (open) setDraft(pick);
  }, [open, pick]);

  if (!part) return null;

  const resolved = resolvePartAssets(part, draft);
  const has3d = part.models.length > 0;
  const showLive3d = resolved.view === '3d' && Boolean(resolved.glbUrl);

  const setView = (view: PartViewMode) => {
    if (view === '3d' && !has3d) return;
    setDraft((prev) => ({ ...prev, view }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${part.name} — Versionen`}
      size="lg"
      testId="build-part-history-modal"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            type="button"
            data-testid="build-part-history-save"
            onClick={() => {
              onSave({
                masterVersion: resolved.masterVersion,
                modelVersion: has3d ? resolved.modelVersion : null,
                view: has3d ? draft.view : '2d',
              });
              onClose();
            }}
          >
            Übernehmen
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-3">
          <section>
            <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              2D Master
            </h3>
            {part.masters.length === 0 ? (
              <p className="text-xs text-stone-500">Keine 2D-Versionen.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {part.masters.map((m) => {
                  const active = resolved.masterVersion === m.version;
                  return (
                    <button
                      key={m.version}
                      type="button"
                      data-testid={`build-history-2d-v${m.version}`}
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          masterVersion: m.version,
                          view: '2d',
                        }))
                      }
                      className={`rounded border px-2 py-1 text-[11px] font-semibold ${
                        active
                          ? 'border-amber-500/70 bg-amber-950/40 text-amber-100'
                          : 'border-stone-700 bg-stone-900 text-stone-300 hover:border-stone-500'
                      }`}
                    >
                      {m.labelDe}
                      {m.approved ? ' ✓' : ''}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              3D Model
            </h3>
            {!has3d ? (
              <p
                className="rounded-lg border border-dashed border-stone-700 bg-stone-900/60 px-3 py-3 text-xs text-stone-400"
                data-testid="build-history-no-3d"
              >
                Noch kein 3D für dieses Teil — nur 2D verfügbar.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {part.models.map((m) => {
                  const active = resolved.modelVersion === m.version && draft.view === '3d';
                  return (
                    <button
                      key={m.version}
                      type="button"
                      data-testid={`build-history-3d-v${m.version}`}
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          modelVersion: m.version,
                          view: '3d',
                        }))
                      }
                      className={`rounded border px-2 py-1 text-[11px] font-semibold ${
                        active
                          ? 'border-violet-500/70 bg-violet-950/40 text-violet-100'
                          : 'border-stone-700 bg-stone-900 text-stone-300 hover:border-stone-500'
                      }`}
                    >
                      {m.labelDe}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              Ansicht
            </h3>
            <div className="flex gap-1.5">
              <button
                type="button"
                data-testid="build-history-view-2d"
                onClick={() => setView('2d')}
                className={`rounded border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
                  resolved.view === '2d'
                    ? 'border-amber-500/70 bg-amber-950/40 text-amber-100'
                    : 'border-stone-700 bg-stone-900 text-stone-400'
                }`}
              >
                2D
              </button>
              <button
                type="button"
                data-testid="build-history-view-3d"
                disabled={!has3d}
                onClick={() => setView('3d')}
                className={`rounded border px-3 py-1.5 text-xs font-bold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-40 ${
                  resolved.view === '3d'
                    ? 'border-violet-500/70 bg-violet-950/40 text-violet-100'
                    : 'border-stone-700 bg-stone-900 text-stone-400'
                }`}
              >
                3D
              </button>
            </div>
            <p className="mt-2 text-[11px] text-stone-500">{resolved.statusLabelDe}</p>
            <button
              type="button"
              className="mt-2 text-[10px] text-stone-500 underline hover:text-stone-300"
              onClick={() => setDraft(defaultPartAssetPick())}
            >
              Auswahl zurücksetzen
            </button>
          </section>
        </div>

        <div className="flex min-h-[220px] flex-col overflow-hidden rounded-xl border border-stone-700 bg-stone-950">
          <div className="flex-none border-b border-stone-800 px-2 py-1 text-[10px] uppercase tracking-wide text-stone-500">
            Vorschau · {resolved.view.toUpperCase()}
          </div>
          <div className="relative min-h-[200px] flex-1">
            {showLive3d && resolved.glbUrl ? (
              <Canvas
                className="h-full min-h-[200px] w-full touch-none"
                camera={{ position: [1.4, 0.9, 1.6], fov: 42 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: false }}
                data-testid="build-history-3d-canvas"
              >
                <color attach="background" args={['#0c0a09']} />
                <ambientLight intensity={0.75} />
                <directionalLight position={[3, 4, 2]} intensity={1.15} />
                <directionalLight position={[-2, 1, -1]} intensity={0.35} />
                <Suspense fallback={null}>
                  <LoosePartsScene parts={[{ id: part.id, url: resolved.glbUrl }]} />
                </Suspense>
                <OrbitControls makeDefault enablePan={false} minDistance={0.8} maxDistance={6} />
              </Canvas>
            ) : (
              <ImageWithFallback
                src={resolved.masterUrl}
                alt={part.name}
                className="h-full min-h-[200px] w-full object-contain p-3"
                data-testid="build-history-2d-preview"
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
