/**
 * Part detail: stages, spec edit, concept A–D, free/paid actions.
 * Location: src/features/build/development/PartDetailPanel.tsx
 */
import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';
import { bridgeGetPart, bridgePost, type PartDetail } from './assetBridgeClient';
import { CreditConfirmModal } from './CreditConfirmModal';
import {
  PipelineStepper,
  buildPipelineSteps,
  type PipelineStepId,
} from './PipelineStepper';

interface PartDetailPanelProps {
  partId: string;
  onBack: () => void;
  onChanged: () => void;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function dnaString(spec: Record<string, unknown>, key: string): string {
  const dna = spec.designDna;
  if (dna === null || typeof dna !== 'object') return '';
  const v = (dna as Record<string, unknown>)[key];
  return typeof v === 'string' ? v : '';
}

export function PartDetailPanel({ partId, onBack, onChanged }: PartDetailPanelProps) {
  const [detail, setDetail] = useState<PartDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [conceptPick, setConceptPick] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [creditKind, setCreditKind] = useState<string | null>(null);
  const [focusStep, setFocusStep] = useState<PipelineStepId | null>(null);

  const [name, setName] = useState('');
  const [gameplay, setGameplay] = useState('');
  const [dominant, setDominant] = useState('');
  const [comedy, setComedy] = useState('');

  const reload = async () => {
    const r = await bridgeGetPart(partId);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setDetail(r.data);
    setError(null);
    setName(asString(r.data.spec.name));
    setGameplay(asString(r.data.spec.gameplayFunction));
    setDominant(dnaString(r.data.spec, 'dominantScrapObject'));
    setComedy(dnaString(r.data.spec, 'comedyHook'));
    setConceptPick(
      (r.data.state?.approvedConceptVariant as 'A' | 'B' | 'C' | 'D' | null) ?? null,
    );
  };

  useEffect(() => {
    void reload();
  }, [partId]);

  const status = detail?.state?.pipelineStatus ?? 'draft';
  const pipelineSteps = buildPipelineSteps({
    pipelineStatus: status,
    specVersion: detail?.state?.specVersion,
    conceptSheetVersion: detail?.state?.conceptSheetVersion,
    approvedConceptVariant: detail?.state?.approvedConceptVariant,
    contextVersion: detail?.state?.contextVersion,
    isolatedVersion: detail?.state?.isolatedVersion,
    multiviewVersion: detail?.state?.multiviewVersion,
    modelVersion: detail?.state?.modelVersion,
  });
  const conceptSheet =
    detail?.galleries.conceptSheet.find((g) => g.label.includes('current')) ??
    detail?.galleries.conceptSheet[0] ??
    null;

  const run = async (action: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    setBanner(null);
    const r = await bridgePost(action, { id: partId, ...payload });
    setBusy(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setError(null);
    await reload();
    onChanged();
  };

  const saveSpec = async () => {
    const identityChange = window.confirm(
      'Spec speichern? Bei Identitätsänderung wird die Pipeline auf Draft zurückgesetzt und Downstream ungültig.',
    );
    if (!identityChange) return;
    const dna = {
      ...(typeof detail?.spec.designDna === 'object' && detail.spec.designDna !== null
        ? (detail.spec.designDna as Record<string, unknown>)
        : {}),
      dominantScrapObject: dominant,
      comedyHook: comedy,
    };
    await run('patch-spec', {
      identityChange: true,
      patch: {
        name,
        gameplayFunction: gameplay,
        designDna: dna,
        specStatus: 'draft',
      },
    });
    setBanner('Spec gespeichert (Draft / Downstream invalidiert).');
  };

  if (!detail && !error) {
    return <p className="p-4 text-sm text-stone-500">Lade Teil…</p>;
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden" data-testid="build-dev-detail">
      <header className="flex flex-none items-center gap-2 border-b border-stone-800 px-3 py-2">
        <Button variant="ghost" size="sm" type="button" onClick={onBack}>
          ← Liste
        </Button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-brand text-sm uppercase tracking-wide text-amber-100">
            {asString(detail?.spec.name, partId)}
          </h2>
          <p className="truncate text-[10px] text-stone-500">
            {partId} · {status}
            {detail?.state?.combinateVisible ? ' · Combinate sichtbar' : ''}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          disabled={busy}
          onClick={() =>
            void run('set-combinate-visible', {
              visible: !detail?.state?.combinateVisible,
            })
          }
          data-testid="build-dev-combinate-toggle"
        >
          {detail?.state?.combinateVisible ? 'Aus Combinate' : 'Zu Combinate freigeben'}
        </Button>
      </header>

      <PipelineStepper
        steps={pipelineSteps}
        pipelineStatus={status}
        selectedStepId={focusStep}
        onSelectStep={setFocusStep}
      />

      {(error || banner) && (
        <div className="flex-none space-y-1 border-b border-stone-800 px-3 py-2">
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {banner ? <p className="text-sm text-emerald-300">{banner}</p> : null}
        </div>
      )}

      <div className="grid min-h-0 flex-1 gap-3 overflow-auto p-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Spec</h3>
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label="Gameplay"
            value={gameplay}
            onChange={(e) => setGameplay(e.target.value)}
          />
          <Input
            label="Dominanter Schrott"
            value={dominant}
            onChange={(e) => setDominant(e.target.value)}
          />
          <Input
            label="Comedy-Hook"
            value={comedy}
            onChange={(e) => setComedy(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" disabled={busy} onClick={() => void saveSpec()}>
              Spec speichern
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={busy || status !== 'draft'}
              onClick={() => void run('approve-spec')}
              data-testid="build-dev-approve-spec"
            >
              Spec approve
            </Button>
          </div>

          <h3 className="pt-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Pipeline-Aktionen
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="accent"
              disabled={busy}
              onClick={() => setCreditKind('concept-sheet')}
            >
              Concept Sheet erzeugen
            </Button>
            <Button
              type="button"
              size="sm"
              variant="accent"
              disabled={busy}
              onClick={() => setCreditKind('context')}
            >
              Kontext erzeugen
            </Button>
            <Button
              type="button"
              size="sm"
              variant="accent"
              disabled={busy}
              onClick={() => setCreditKind('isolated')}
            >
              Isolate
            </Button>
            <Button
              type="button"
              size="sm"
              variant="accent"
              disabled={busy}
              onClick={() => setCreditKind('multiview')}
            >
              Multiview
            </Button>
            <Button
              type="button"
              size="sm"
              variant="accent"
              disabled={busy}
              onClick={() => setCreditKind('model')}
            >
              3D erzeugen
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={busy}
              onClick={() => void run('approve-stage', { nextStatus: 'context-approved' })}
            >
              Kontext approve
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={busy}
              onClick={() => void run('approve-stage', { nextStatus: 'isolated-approved' })}
            >
              Isoliert approve
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={busy}
              onClick={() => void run('approve-stage', { nextStatus: 'multiview-approved' })}
            >
              Multiview approve
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={busy}
              onClick={() => void run('approve-stage', { nextStatus: 'model-approved' })}
            >
              3D approve
            </Button>
            <Button
              type="button"
              size="sm"
              variant="success"
              disabled={busy}
              onClick={() => void run('publish')}
              data-testid="build-dev-publish"
            >
              Publish
            </Button>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Concept Sheet · A–D
          </h3>
          {conceptSheet ? (
            <div className="relative overflow-hidden rounded-xl border border-stone-700 bg-stone-950">
              <ImageWithFallback
                src={conceptSheet.url}
                alt="Concept Sheet"
                className="w-full object-contain"
              />
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                {(['A', 'B', 'C', 'D'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    data-testid={`build-dev-concept-${v}`}
                    onClick={() => setConceptPick(v)}
                    className={`border border-transparent text-left ${
                      conceptPick === v
                        ? 'bg-amber-400/15 ring-2 ring-inset ring-amber-400/80'
                        : 'hover:bg-white/5'
                    }`}
                    aria-label={`Variante ${v}`}
                  >
                    <span className="m-1 inline-block rounded bg-stone-950/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-100">
                      {v}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-stone-700 p-4 text-xs text-stone-500">
              Noch kein Concept Sheet — zuerst erzeugen (Credits).
            </p>
          )}
          <Button
            type="button"
            disabled={busy || !conceptPick || !status.includes('concept-sheet')}
            onClick={() =>
              void run('approve-concept', { variant: conceptPick }).then(() =>
                setBanner(`Concept ${conceptPick} approved.`),
              )
            }
            data-testid="build-dev-approve-concept"
          >
            Concept {conceptPick ?? '—'} übernehmen
          </Button>

          <h3 className="pt-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Galerie
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              ...(detail?.galleries.isolated ?? []),
              ...(detail?.galleries.multiview ?? []),
            ]
              .slice(0, 6)
              .map((g) => (
                <div
                  key={g.url}
                  className="overflow-hidden rounded border border-stone-800 bg-stone-950"
                >
                  <ImageWithFallback src={g.url} alt={g.label} className="aspect-square object-contain" />
                  <p className="truncate px-1 py-0.5 text-[9px] text-stone-500">{g.label}</p>
                </div>
              ))}
          </div>
        </section>
      </div>

      {creditKind ? (
        <CreditConfirmModal
          open
          partId={partId}
          generateKind={creditKind}
          titleDe={creditKind}
          onClose={() => setCreditKind(null)}
          onResult={(message, skillCommand) => {
            setBanner(
              skillCommand ? `${message}\n${skillCommand}` : message,
            );
          }}
        />
      ) : null}
    </div>
  );
}
