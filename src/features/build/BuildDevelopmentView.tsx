/**
 * Build → Development: engine-parts list + detail authoring.
 * Location: src/features/build/BuildDevelopmentView.tsx
 */
import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { NewPartWizardModal } from './development/NewPartWizardModal';
import { PartDetailPanel } from './development/PartDetailPanel';
import {
  bridgeListParts,
  bridgePing,
  type PartListItem,
} from './development/assetBridgeClient';
import {
  PipelineStepper,
  buildPipelineSteps,
} from './development/PipelineStepper';

const SELECTED_KEY = 'letz-fetz:build-dev-selected';

export function BuildDevelopmentView() {
  const [bridgeOk, setBridgeOk] = useState<boolean | null>(null);
  const [parts, setParts] = useState<PartListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(SELECTED_KEY);
    } catch {
      return null;
    }
  });
  const [wizardOpen, setWizardOpen] = useState(false);

  const refresh = async () => {
    const ping = await bridgePing();
    setBridgeOk(ping);
    if (!ping) {
      setError('Dev-Asset-Bridge offline — bitte `npm run dev` nutzen.');
      return;
    }
    const list = await bridgeListParts();
    if (!list.ok) {
      setError(list.error);
      return;
    }
    setError(null);
    setParts(list.data);
  };

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    try {
      if (selectedId) sessionStorage.setItem(SELECTED_KEY, selectedId);
      else sessionStorage.removeItem(SELECTED_KEY);
    } catch {
      /* ignore */
    }
  }, [selectedId]);

  if (selectedId) {
    return (
      <PartDetailPanel
        partId={selectedId}
        onBack={() => setSelectedId(null)}
        onChanged={() => void refresh()}
      />
    );
  }

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden"
      data-testid="build-development"
    >
      <header className="flex flex-none items-center justify-between gap-2 border-b border-stone-800 px-3 py-2">
        <div>
          <h1 className="font-brand text-sm uppercase tracking-wide text-amber-100 sm:text-base">
            Development
          </h1>
          <p className="text-[10px] text-stone-500">
            Spec → Concept → Kontext → Isoliert → Multiview → 3D → Publish · Bridge{' '}
            {bridgeOk === false ? 'offline' : 'bereit'}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setWizardOpen(true)}
          data-testid="build-dev-new"
        >
          New
        </Button>
      </header>

      <div className="flex-none border-b border-stone-800/80 px-3 py-2">
        <PipelineStepper
          steps={buildPipelineSteps({ pipelineStatus: 'draft' }).map((s, i) => ({
            ...s,
            phase: i === 0 ? 'current' : 'upcoming',
            detailDe:
              i === 0
                ? 'Flow für jedes Teil'
                : s.id === 'concept'
                  ? 'Sheet A–D'
                  : s.id === 'published'
                    ? 'Pilot + optional Combinate'
                    : s.labelDe,
          }))}
          pipelineStatus="Skill-Flow"
        />
      </div>

      {error ? (
        <p className="flex-none border-b border-stone-800 px-3 py-2 text-sm text-rose-300">
          {error}
        </p>
      ) : null}

      <div className="min-h-0 flex-1 overflow-auto p-3">
        {parts.length === 0 ? (
          <div
            className="flex h-full flex-col items-center justify-center gap-2 text-center"
            data-testid="build-dev-empty"
          >
            <p className="text-sm text-stone-500">Noch keine engine-parts.</p>
            <Button type="button" size="sm" onClick={() => setWizardOpen(true)}>
              + New
            </Button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {parts.map((part) => (
              <li key={part.id}>
                <button
                  type="button"
                  data-testid={`build-dev-part-${part.id}`}
                  onClick={() => setSelectedId(part.id)}
                  className="flex w-full flex-col overflow-hidden rounded-lg border border-stone-700 bg-stone-900/90 text-left hover:border-amber-500/50"
                >
                  <div className="aspect-[3/4] bg-stone-950">
                    {part.thumbUrl ? (
                      <ImageWithFallback
                        src={part.thumbUrl}
                        alt={part.name}
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-stone-600">
                        kein Bild
                      </div>
                    )}
                  </div>
                  <div className="border-t border-stone-800 px-2 py-1.5">
                    <p className="truncate text-xs font-semibold text-stone-100">{part.name}</p>
                    <PipelineStepper
                      compact
                      pipelineStatus={part.pipelineStatus}
                      steps={buildPipelineSteps({ pipelineStatus: part.pipelineStatus })}
                    />
                    {part.combinateVisible ? (
                      <p className="text-[9px] text-emerald-400">Combinate</p>
                    ) : null}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <NewPartWizardModal
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onCreated={(id) => {
          void refresh().then(() => setSelectedId(id));
        }}
      />
    </div>
  );
}
