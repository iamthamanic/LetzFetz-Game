/**
 * Renders V6 formula activation preview from an engine plan (German copy).
 * Location: src/features/play/board/V6FormulaActivationPreview.tsx
 */
import React from 'react';
import type { V6FormulaPreviewLines } from '../presentation/v6FormulaPlanPreview';

interface V6FormulaActivationPreviewProps {
  lines: V6FormulaPreviewLines;
}

export function V6FormulaActivationPreview({ lines }: V6FormulaActivationPreviewProps) {
  return (
    <div
      data-testid="v6-formula-activation-preview"
      className="rounded-lg border border-amber-500/40 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100"
      role="status"
      aria-live="polite"
    >
      <p className="font-semibold text-amber-200">{lines.title}</p>
      <p className="mt-1">{lines.primaryLine}</p>
      {lines.defenseLine ? <p className="mt-1 text-zinc-300">{lines.defenseLine}</p> : null}
      {lines.catalystLine ? (
        <p className="mt-1 text-rose-300" data-testid="v6-preview-catalyst">
          {lines.catalystLine}
        </p>
      ) : null}
      {lines.fetzLine ? (
        <p className="mt-1 text-emerald-300" data-testid="v6-preview-fetz">
          {lines.fetzLine}
        </p>
      ) : null}
      {lines.lockLine ? (
        <p className="mt-1 text-orange-300" data-testid="v6-preview-lock">
          {lines.lockLine}
        </p>
      ) : null}
    </div>
  );
}
