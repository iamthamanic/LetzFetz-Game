/**
 * Visual Spec→2D→3D pipeline stepper for Development.
 * Location: src/features/build/development/PipelineStepper.tsx
 */
import React from 'react';
import { Check, Circle, Loader } from 'lucide-react';

export type PipelineStepId =
  | 'spec'
  | 'concept'
  | 'context'
  | 'isolated'
  | 'multiview'
  | 'model'
  | 'published';

export type StepPhase = 'done' | 'current' | 'upcoming' | 'blocked';

export interface PipelineStepView {
  id: PipelineStepId;
  labelDe: string;
  phase: StepPhase;
  detailDe: string;
  versionLabel: string | null;
}

const STEP_DEFS: Array<{ id: PipelineStepId; labelDe: string }> = [
  { id: 'spec', labelDe: 'Spec' },
  { id: 'concept', labelDe: 'Concept' },
  { id: 'context', labelDe: 'Kontext' },
  { id: 'isolated', labelDe: 'Isoliert' },
  { id: 'multiview', labelDe: 'Multiview' },
  { id: 'model', labelDe: '3D' },
  { id: 'published', labelDe: 'Publish' },
];

function awaitingDetail(stage: string): string {
  return `Review · ${stage}`;
}

/** Map asset-state pipelineStatus + versions → stepper model. */
export function buildPipelineSteps(input: {
  pipelineStatus: string;
  specVersion?: number | null;
  conceptSheetVersion?: number | null;
  approvedConceptVariant?: string | null;
  contextVersion?: number | null;
  isolatedVersion?: number | null;
  multiviewVersion?: number | null;
  modelVersion?: number | null;
}): PipelineStepView[] {
  const status = input.pipelineStatus;
  const order: PipelineStepId[] = [
    'spec',
    'concept',
    'context',
    'isolated',
    'multiview',
    'model',
    'published',
  ];

  let current: PipelineStepId = 'spec';
  if (status === 'draft' || status === 'spec-approved') current = 'spec';
  else if (status.startsWith('concept') || status.startsWith('silhouette')) current = 'concept';
  else if (status.startsWith('context')) current = 'context';
  else if (status.startsWith('isolated')) current = 'isolated';
  else if (status.startsWith('multiview')) current = 'multiview';
  else if (status.startsWith('model')) current = 'model';
  else if (status === 'published') current = 'published';

  const currentIdx = order.indexOf(current);

  const detailFor = (id: PipelineStepId, phase: StepPhase): string => {
    if (phase === 'upcoming') return 'Wartend';
    switch (id) {
      case 'spec':
        if (status === 'draft') return 'Draft — Spec approve';
        if (status === 'spec-approved') return 'Approved — Concept Sheet erzeugen';
        return 'Approved';
      case 'concept':
        if (status.includes('awaiting')) return awaitingDetail('A–D wählen');
        if (status === 'concept-approved') {
          return input.approvedConceptVariant
            ? `Variante ${input.approvedConceptVariant} · Kontext erzeugen`
            : 'Approved · Kontext erzeugen';
        }
        return input.approvedConceptVariant
          ? `Variante ${input.approvedConceptVariant}`
          : 'Concept';
      case 'context':
        if (status.includes('awaiting')) return awaitingDetail('approve');
        if (status === 'context-approved') return 'Approved · Isolate';
        return 'Kontext';
      case 'isolated':
        if (status.includes('awaiting')) return awaitingDetail('approve');
        if (status === 'isolated-approved') return 'Approved · Multiview';
        return 'Isoliert';
      case 'multiview':
        if (status.includes('awaiting')) return awaitingDetail('approve');
        if (status === 'multiview-approved') return 'Approved · 3D erzeugen';
        return 'Multiview';
      case 'model':
        if (status.includes('awaiting')) return awaitingDetail('approve / reject');
        if (status === 'model-approved') return 'Approved · Publish';
        return '3D-Modell';
      case 'published':
        return status === 'published' ? 'Im Pilot-Registry' : 'Noch nicht published';
      default:
        return '';
    }
  };

  const versionFor = (id: PipelineStepId): string | null => {
    switch (id) {
      case 'spec':
        return input.specVersion != null ? `v${input.specVersion}` : null;
      case 'concept':
        return input.conceptSheetVersion != null
          ? `v${input.conceptSheetVersion}${
              input.approvedConceptVariant ? ` · ${input.approvedConceptVariant}` : ''
            }`
          : null;
      case 'context':
        return input.contextVersion != null ? `v${input.contextVersion}` : null;
      case 'isolated':
        return input.isolatedVersion != null ? `v${input.isolatedVersion}` : null;
      case 'multiview':
        return input.multiviewVersion != null ? `v${input.multiviewVersion}` : null;
      case 'model':
      case 'published':
        return input.modelVersion != null ? `v${input.modelVersion}` : null;
      default:
        return null;
    }
  };

  return STEP_DEFS.map((def, idx) => {
    let phase: StepPhase;
    if (status === 'published') {
      phase = 'done';
    } else if (idx < currentIdx) {
      phase = 'done';
    } else if (idx === currentIdx) {
      phase = 'current';
    } else {
      phase = 'upcoming';
    }
    return {
      id: def.id,
      labelDe: def.labelDe,
      phase,
      detailDe: detailFor(def.id, phase),
      versionLabel: versionFor(def.id),
    };
  });
}

interface PipelineStepperProps {
  steps: PipelineStepView[];
  pipelineStatus: string;
  compact?: boolean;
  onSelectStep?: (id: PipelineStepId) => void;
  selectedStepId?: PipelineStepId | null;
}

export function PipelineStepper({
  steps,
  pipelineStatus,
  compact = false,
  onSelectStep,
  selectedStepId,
}: PipelineStepperProps) {
  if (compact) {
    const current = steps.find((s) => s.phase === 'current') ?? steps[0];
    const doneCount = steps.filter((s) => s.phase === 'done').length;
    return (
      <div
        className="flex items-center gap-1.5 text-[9px]"
        data-testid="build-dev-pipeline-compact"
        title={pipelineStatus}
      >
        <span className="font-semibold text-amber-200/90">{current?.labelDe ?? '—'}</span>
        <span className="text-stone-600">
          {doneCount}/{steps.length}
        </span>
      </div>
    );
  }

  return (
    <section
      className="flex-none border-b border-stone-800 bg-stone-950/80 px-3 py-2.5"
      data-testid="build-dev-pipeline"
      aria-label="Pipeline"
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
          Pipeline
        </h3>
        <p className="font-mono text-[10px] text-stone-500" data-testid="build-dev-pipeline-status">
          {pipelineStatus}
        </p>
      </div>
      <ol className="flex gap-1 overflow-x-auto pb-0.5">
        {steps.map((step, idx) => {
          const selected = selectedStepId === step.id;
          const tone =
            step.phase === 'done'
              ? 'border-emerald-700/50 bg-emerald-950/50 text-emerald-100'
              : step.phase === 'current'
                ? 'border-amber-500/60 bg-amber-950/60 text-amber-50 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                : 'border-stone-800 bg-stone-900/60 text-stone-500';
          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-stretch gap-1">
              <button
                type="button"
                disabled={!onSelectStep}
                onClick={() => onSelectStep?.(step.id)}
                data-testid={`build-dev-pipeline-step-${step.id}`}
                className={`flex min-w-[5.5rem] flex-1 flex-col rounded-lg border px-2 py-1.5 text-left transition-colors ${tone} ${
                  selected ? 'ring-2 ring-amber-400/70' : ''
                } ${onSelectStep ? 'cursor-pointer hover:brightness-110' : 'cursor-default'}`}
              >
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide">
                  {step.phase === 'done' ? (
                    <Check className="h-3 w-3 shrink-0" aria-hidden />
                  ) : step.phase === 'current' ? (
                    <Loader className="h-3 w-3 shrink-0 animate-spin" aria-hidden />
                  ) : (
                    <Circle className="h-3 w-3 shrink-0 opacity-50" aria-hidden />
                  )}
                  {step.labelDe}
                </span>
                {step.versionLabel ? (
                  <span className="mt-0.5 font-mono text-[9px] opacity-80">{step.versionLabel}</span>
                ) : null}
                <span className="mt-0.5 line-clamp-2 text-[9px] leading-snug opacity-90">
                  {step.detailDe}
                </span>
              </button>
              {idx < steps.length - 1 ? (
                <span
                  className="flex w-2 flex-none items-center justify-center text-stone-700"
                  aria-hidden
                >
                  ›
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
