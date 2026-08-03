/**
 * Renders V6 formula activation preview from an engine plan (German copy).
 * Location: src/features/play/board/V6FormulaActivationPreview.tsx
 */
import React from 'react';
import { Panel } from '../../../components/ui/Panel';
import type { V6FormulaPreviewLines } from '../presentation/v6FormulaPlanPreview';

interface V6FormulaActivationPreviewProps {
  lines: V6FormulaPreviewLines;
}

export function V6FormulaActivationPreview({ lines }: V6FormulaActivationPreviewProps) {
  return (
    <Panel
      tone="game"
      dense
      className="border-amber-500/40"
      data-testid="v6-formula-activation-preview"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-semibold text-amber-200">{lines.title}</p>
      <p className="mt-1 text-sm text-stone-100">{lines.primaryLine}</p>
      {lines.defenseLine ? (
        <p className="mt-1 text-sm text-stone-300">{lines.defenseLine}</p>
      ) : null}
      {lines.timingLine ? (
        <p className="mt-1 text-sm text-cyan-200" data-testid="v6-preview-timing">
          {lines.timingLine}
        </p>
      ) : null}
      {lines.catalystLine ? (
        <p className="mt-1 text-sm text-rose-300" data-testid="v6-preview-catalyst">
          {lines.catalystLine}
        </p>
      ) : null}
      {lines.fetzLine ? (
        <p className="mt-1 text-sm text-emerald-300" data-testid="v6-preview-fetz">
          {lines.fetzLine}
        </p>
      ) : null}
      {lines.overformulaLine ? (
        <p className="mt-1 text-sm text-amber-300" data-testid="v6-preview-overformula">
          {lines.overformulaLine}
        </p>
      ) : null}
      {lines.lockLine ? (
        <p className="mt-1 text-sm text-orange-300" data-testid="v6-preview-lock">
          {lines.lockLine}
        </p>
      ) : null}
    </Panel>
  );
}
