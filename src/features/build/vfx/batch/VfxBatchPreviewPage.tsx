/**
 * Minimal full-screen preview for vfx-worker Playwright batch capture.
 * Location: src/features/build/vfx/batch/VfxBatchPreviewPage.tsx
 */
import React from 'react';
import { VfxSharedPreview } from '../preview/VfxSharedPreview';

function readPreviewParams(): { presetId: string; recipeId: string | null } {
  const params = new URLSearchParams(window.location.search);
  const presetId = params.get('presetId')?.trim() || 'aura';
  const recipeId = params.get('recipeId')?.trim() || null;
  return { presetId, recipeId };
}

export function VfxBatchPreviewPage() {
  const { presetId, recipeId } = readPreviewParams();

  return (
    <div
      className="flex h-screen w-screen flex-col overflow-hidden bg-stone-950"
      data-testid="vfx-batch-preview-page"
      data-recipe-id={recipeId ?? undefined}
    >
      <VfxSharedPreview
        active
        presetId={presetId}
        showTimeline={false}
        className="h-full min-h-0 flex-1"
        emptyMessage="Batch-Vorschau — Effekt wird geladen"
      />
    </div>
  );
}
