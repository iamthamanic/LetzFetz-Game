/**
 * V5 Formelgestell — composed core (Essenz → Technik → Katalysator), not three equal cards.
 * Location: src/features/play/board/FormulaRig.tsx
 */
import React from 'react';
import type { ContentPack, FormulaBoard, FormulaComponentInstance } from '../../../game';
import {
  buildVisualRecipe,
  describeVisualRecipeDe,
  findFormulaComponentDef,
} from '../../../game';

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
}

function SlotChip({
  role,
  comp,
  pack,
  emphasis,
}: {
  role: keyof typeof SLOT_LABEL_DE;
  comp: FormulaComponentInstance | null;
  pack: ContentPack;
  emphasis: 'core' | 'ring' | 'vessel';
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

  return (
    <div
      className={`flex min-w-[5.5rem] max-w-[7rem] flex-col items-center gap-0.5 rounded-lg border px-2 py-2 text-center ${tone}`}
      data-formula-slot={role}
    >
      <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">
        {SLOT_LABEL_DE[role]}
      </span>
      <span className="text-xs font-semibold leading-tight">{comp ? name : 'leer'}</span>
      {stateNote ? (
        <span className="text-[9px] uppercase tracking-wide text-rose-300">{stateNote}</span>
      ) : null}
    </div>
  );
}

export function FormulaRig({ label, formula, pack, testId }: FormulaRigProps) {
  const recipe = buildVisualRecipe({ pack, formula });
  const summary = describeVisualRecipeDe(recipe);

  return (
    <div className="flex flex-col gap-2" data-testid={testId}>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500">
        {label}
      </span>
      <div
        className="flex flex-wrap items-center justify-start gap-2 sm:gap-3"
        role="group"
        aria-label={summary}
      >
        <SlotChip role="essenz" comp={formula.essenz} pack={pack} emphasis="vessel" />
        <SlotChip role="technik" comp={formula.technik} pack={pack} emphasis="core" />
        <SlotChip role="katalysator" comp={formula.katalysator} pack={pack} emphasis="ring" />
      </div>
      <p className="text-[11px] text-stone-400" data-testid={`${testId}-recipe`}>
        {summary}
      </p>
    </div>
  );
}
