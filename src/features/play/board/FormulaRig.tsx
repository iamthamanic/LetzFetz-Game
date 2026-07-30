/**
 * V5 Formelgestell — composed core (Essenz → Technik → Katalysator), not three equal cards.
 * Location: src/features/play/board/FormulaRig.tsx
 *
 * Shows property-driven compose stack (§28.1) as V5 default visual path (not Fetz-3D).
 */
import React from 'react';
import type { ContentPack, FormulaBoard, FormulaComponentInstance } from '../../../game';
import {
  buildVisualRecipe,
  describeVisualRecipeDe,
  findFormulaComponentDef,
} from '../../../game';
import {
  composeFormulaGestellLayers,
  type FormulaComposeLayer,
} from './formulaCompose';

const SLOT_LABEL_DE = {
  essenz: 'Essenz',
  technik: 'Technik',
  katalysator: 'Katalysator',
} as const;

interface FormulaRigProps {
  label: string;
  formula: FormulaBoard;
  pack: ContentPack;
  testId: string;
  /** Opponent components that are legal CHALLENGE targets. */
  targetableInstanceIds?: string[];
  selectedTargetId?: string | null;
  onComponentClick?: (instanceId: string) => void;
}

function SlotChip({
  role,
  comp,
  pack,
  emphasis,
  targetable,
  selected,
  onClick,
}: {
  role: keyof typeof SLOT_LABEL_DE;
  comp: FormulaComponentInstance | null;
  pack: ContentPack;
  emphasis: 'core' | 'ring' | 'vessel';
  targetable: boolean;
  selected: boolean;
  onClick?: () => void;
}) {
  const def = comp ? findFormulaComponentDef(pack, comp.defId) : undefined;
  const name = def?.name ?? '—';
  const tone =
    emphasis === 'core'
      ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-100 scale-110 z-10'
      : emphasis === 'vessel'
        ? 'border-sky-500/40 bg-sky-950/30 text-sky-100'
        : 'border-amber-500/40 bg-amber-950/30 text-amber-100';
  const stateNote = comp?.disturbed
    ? 'gestört'
    : comp?.exhausted
      ? 'erschöpft'
      : null;
  const interactive = Boolean(onClick && targetable);

  return (
    <div
      className={`flex min-w-[5.5rem] max-w-[7rem] flex-col items-center gap-0.5 rounded-lg border px-2 py-2 text-center transition ${tone} ${
        selected
          ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-950'
          : targetable
            ? 'cursor-pointer hover:ring-2 hover:ring-amber-500/60'
            : ''
      }`}
      data-formula-slot={role}
      data-targetable={targetable ? 'true' : undefined}
      data-challenge-selected={selected ? 'true' : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      title={targetable ? 'Als Herausforderungsziel wählen' : undefined}
    >
      <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">
        {SLOT_LABEL_DE[role]}
      </span>
      <span className="text-xs font-semibold leading-tight">{comp ? name : 'leer'}</span>
      {stateNote ? (
        <span className="text-[9px] uppercase tracking-wide text-rose-300">{stateNote}</span>
      ) : null}
      {targetable ? (
        <span className="text-[9px] font-medium text-amber-300">Ziel</span>
      ) : null}
    </div>
  );
}

function composeToneClass(layer: FormulaComposeLayer): string {
  if (!layer.active) return 'border-stone-700/50 bg-stone-950/40 text-stone-500';
  if (layer.role === 'core') {
    return 'border-emerald-400/70 bg-emerald-950/50 text-emerald-50 shadow-[0_0_24px_rgba(16,185,129,0.25)] scale-105 z-10';
  }
  if (layer.role === 'vessel') {
    return 'border-sky-400/50 bg-sky-950/40 text-sky-100';
  }
  return 'border-amber-400/50 bg-amber-950/40 text-amber-100';
}

export function FormulaRig({
  label,
  formula,
  pack,
  testId,
  targetableInstanceIds = [],
  selectedTargetId = null,
  onComponentClick,
}: FormulaRigProps) {
  const recipe = buildVisualRecipe({ pack, formula });
  const summary = describeVisualRecipeDe(recipe);
  const layers = composeFormulaGestellLayers(recipe);
  const targetSet = new Set(targetableInstanceIds);

  const chip = (
    role: keyof typeof SLOT_LABEL_DE,
    comp: FormulaComponentInstance | null,
    emphasis: 'core' | 'ring' | 'vessel',
  ) => {
    const id = comp?.instanceId;
    const targetable = Boolean(id && targetSet.has(id));
    return (
      <SlotChip
        role={role}
        comp={comp}
        pack={pack}
        emphasis={emphasis}
        targetable={targetable}
        selected={Boolean(id && selectedTargetId === id)}
        onClick={
          id && onComponentClick && targetable
            ? () => onComponentClick(id)
            : undefined
        }
      />
    );
  };

  return (
    <div className="flex flex-col gap-2" data-testid={testId}>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500">
        {label}
      </span>
      <div
        className="flex flex-col gap-1.5 rounded-xl border border-stone-700/60 bg-gradient-to-b from-stone-900/80 to-stone-950/90 p-2.5"
        data-testid={`${testId}-compose`}
        role="img"
        aria-label={summary}
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-500/90">
          Formelgestell
        </span>
        <div className="flex flex-col items-stretch gap-1">
          {layers.map((layer) => (
            <div
              key={layer.role}
              data-compose-role={layer.role}
              data-compose-active={layer.active ? 'true' : 'false'}
              className={`flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-left transition ${composeToneClass(layer)}`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide">
                {layer.labelDe}
              </span>
              <span className="truncate text-[11px] opacity-90">{layer.hintDe}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        className="flex flex-wrap items-center justify-start gap-2 sm:gap-3"
        role="group"
        aria-label="Formelkomponenten"
      >
        {chip('essenz', formula.essenz, 'vessel')}
        {chip('technik', formula.technik, 'core')}
        {chip('katalysator', formula.katalysator, 'ring')}
      </div>
      <p className="text-[11px] text-stone-400" data-testid={`${testId}-recipe`}>
        {summary}
      </p>
    </div>
  );
}
