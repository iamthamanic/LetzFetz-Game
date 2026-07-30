/**
 * VFX Studio shell — modes, node library, React Flow canvas, inspector.
 * Location: src/features/build/vfx/VfxStudioView.tsx
 */
import React, { useEffect, useState } from 'react';
import { Boxes, Layers, Workflow } from 'lucide-react';
import { ReactFlowProvider } from '@xyflow/react';
import { Tabs, type TabItem } from '../../../components/ui/Tabs';
import { VfxCreditConfirmModal } from './VfxCreditConfirmModal';
import { VfxFlowCanvas } from './VfxFlowCanvas';
import { VfxInspectorPanel } from './VfxInspectorPanel';
import { VfxNodeLibrary, type VfxStudioMode } from './VfxNodeLibrary';
import { useAssetPipelineGraph } from './useAssetPipelineGraph';
import { VfxSharedPreview } from './preview';
import { VfxBatchPanel } from './VfxBatchPanel';

export type { VfxStudioMode };

const MODE_KEY = 'letz-fetz:vfx-studio-mode';

const MODE_TABS: TabItem[] = [
  {
    id: 'assets',
    label: 'Assets',
    icon: <Boxes className="h-4 w-4 shrink-0" />,
    tone: 'sandbox',
  },
  {
    id: 'formeln',
    label: 'Formeln',
    icon: <Workflow className="h-4 w-4 shrink-0" />,
    tone: 'sandbox',
  },
  {
    id: 'batch',
    label: 'Batch',
    icon: <Layers className="h-4 w-4 shrink-0" />,
    tone: 'sandbox',
  },
];

const MODE_SUBTITLE: Record<VfxStudioMode, string> = {
  assets: 'Meshy → Normalisieren → Sockets → Effekseer-Presets → Speichern',
  formeln: 'Technik + Essenz + Katalysator → Live-Vorschau → Hero-Frame',
  batch: 'Headless-Render mit gleicher Preview-Szene',
};

function readInitialMode(): VfxStudioMode {
  try {
    const value = sessionStorage.getItem(MODE_KEY);
    if (value === 'assets' || value === 'formeln' || value === 'batch') return value;
  } catch {
    /* ignore */
  }
  return 'assets';
}

export function VfxStudioView() {
  const [mode, setMode] = useState<VfxStudioMode>(() => readInitialMode());
  const pipeline = useAssetPipelineGraph(mode === 'assets');

  useEffect(() => {
    try {
      sessionStorage.setItem(MODE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden"
      data-testid="vfx-studio"
    >
      <header className="flex flex-none flex-col gap-2 border-b border-stone-800 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-brand text-sm uppercase tracking-wide text-amber-100 sm:text-base">
            Letz Fetz VFX Studio
          </h1>
          <p className="text-[10px] text-stone-500">{MODE_SUBTITLE[mode]}</p>
        </div>

        <Tabs
          items={MODE_TABS}
          active={mode}
          onChange={(id) => setMode(id as VfxStudioMode)}
          ariaLabel="VFX-Studio-Modus"
        />
      </header>

      <ReactFlowProvider>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <VfxNodeLibrary
            mode={mode}
            onAddNode={pipeline.addPipelineNode}
            savedTechniques={pipeline.savedTechniques}
          />
          <main className="flex min-h-0 min-w-0 flex-1 flex-col p-2 sm:p-3">
            {mode === 'assets' ? (
              <VfxFlowCanvas
                nodes={pipeline.nodes}
                edges={pipeline.edges}
                onNodesChange={pipeline.onNodesChange}
                onEdgesChange={pipeline.onEdgesChange}
                onConnect={pipeline.onConnect}
                onSelectNode={pipeline.setSelectedNodeId}
              />
            ) : mode === 'formeln' ? (
              <VfxSharedPreview
                active
                presetId="aura"
                className="min-h-0 flex-1"
                emptyMessage="Formel-Pipeline — Effekt auswählen"
              />
            ) : mode === 'batch' ? (
              <VfxBatchPanel />
            ) : null}
          </main>
          <VfxInspectorPanel
            selectedNode={pipeline.selectedNode}
            onPromptChange={pipeline.updateSelectedPrompt}
            onTechniqueNameChange={pipeline.updateSelectedTechniqueName}
          />
        </div>
      </ReactFlowProvider>

      <VfxCreditConfirmModal
        open={pipeline.creditConfirm.open}
        credits={pipeline.creditConfirm.credits}
        onConfirm={pipeline.confirmCreditAndGenerate}
        onCancel={pipeline.cancelCreditConfirm}
      />
    </div>
  );
}
