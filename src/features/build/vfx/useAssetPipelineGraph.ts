/**
 * Asset Pipeline graph state, worker calls, and registry save.
 * Location: src/features/build/vfx/useAssetPipelineGraph.ts
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type Connection,
  type Edge,
  type Node,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { saveTechniqueAsset, listTechniqueAssets } from './registry';
import type { TechniqueAsset } from './types/assets';
import {
  VFX_PIPELINE_NODE_TYPES,
  type VfxMeshyNodeData,
  type VfxNormalizeNodeData,
  type VfxPipelineNodeType,
  type VfxSaveTechniqueNodeData,
  type VfxSocketNodeData,
  type VfxEffekseerPresetNodeData,
} from './nodes/vfxNodeTypes';
import {
  resolveEffectPreset,
} from './preview/effectPresets';
import {
  VfxWorkerError,
  createMeshyTextTo3d,
  pollMeshyTaskUntilDone,
} from './workerClient';
import { buildModelAsset, formatModelAssetStatusDe } from './normalize/buildModelAsset';
import { fallbackBoundsForGlb, loadGlbBounds } from './normalize/loadGlbBounds';
import type { ModelAsset } from './types/wireTypes';
import {
  createDefaultSocketMap,
  roundVec3,
  updateSocketInMap,
  type VfxTechniqueSocketMap,
} from './sockets/socketMapHelpers';
import type { VfxTechniqueSocketName } from './sockets/vfxSocketRoles';
import type { Vec3 } from './types/wireTypes';
import {
  DEFAULT_PIPELINE_NODE_IDS,
  PIPELINE_GRID,
  applyPipelineGridLayout,
  computePipelineGridMetrics,
  createDefaultAssetPipeline,
  type PipelineGridMetrics,
} from './createDefaultAssetPipeline';

function slugifyName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function findUpstreamNode(
  nodes: Node[],
  edges: Edge[],
  startId: string,
  type: VfxPipelineNodeType,
): Node | undefined {
  const visited = new Set<string>();
  const queue = [startId];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);
    const incoming = edges.filter((e) => e.target === current);
    for (const edge of incoming) {
      const source = nodes.find((n) => n.id === edge.source);
      if (!source) continue;
      if (source.type === type) return source;
      queue.push(source.id);
    }
  }
  return undefined;
}

function getPromptFromMeshyNode(nodes: Node[], meshyNodeId: string): string {
  const meshy = nodes.find((n) => n.id === meshyNodeId);
  if (!meshy || meshy.type !== VFX_PIPELINE_NODE_TYPES.vfxMeshy) return '';
  return ((meshy.data as VfxMeshyNodeData).prompt ?? '').trim();
}

function getGlbFromUpstream(
  nodes: Node[],
  edges: Edge[],
  nodeId: string,
): string | null {
  const modelAsset = getModelAssetFromUpstream(nodes, edges, nodeId);
  if (modelAsset?.glbUrl) return modelAsset.glbUrl;

  const visited = new Set<string>();
  const queue = [nodeId];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);
    const incoming = edges.filter((e) => e.target === current);
    for (const edge of incoming) {
      const source = nodes.find((n) => n.id === edge.source);
      if (!source) continue;
      const data = source.data as Record<string, unknown>;
      const modelAsset = data.modelAsset as { glbUrl?: string | null } | null | undefined;
      if (modelAsset?.glbUrl) return modelAsset.glbUrl;
      const glbUrl = data.glbUrl;
      if (typeof glbUrl === 'string' && glbUrl) return glbUrl;
      queue.push(source.id);
    }
  }
  return null;
}

function getModelAssetFromUpstream(
  nodes: Node[],
  edges: Edge[],
  nodeId: string,
): ModelAsset | null {
  const visited = new Set<string>();
  const queue = [nodeId];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);
    const incoming = edges.filter((e) => e.target === current);
    for (const edge of incoming) {
      const source = nodes.find((n) => n.id === edge.source);
      if (!source) continue;
      if (source.type === VFX_PIPELINE_NODE_TYPES.vfxNormalize) {
        const data = source.data as VfxNormalizeNodeData;
        if (data.modelAsset) return data.modelAsset;
      }
      queue.push(source.id);
    }
  }
  return null;
}

function getSocketDataFromUpstream(
  nodes: Node[],
  edges: Edge[],
  nodeId: string,
): VfxSocketNodeData | null {
  const socketNode = findUpstreamNode(
    nodes,
    edges,
    nodeId,
    VFX_PIPELINE_NODE_TYPES.vfxSocket,
  );
  if (!socketNode) return null;
  return socketNode.data as VfxSocketNodeData;
}

function getPresetIdFromUpstream(
  nodes: Node[],
  edges: Edge[],
  nodeId: string,
): string | null {
  const presetNode = findUpstreamNode(
    nodes,
    edges,
    nodeId,
    VFX_PIPELINE_NODE_TYPES.vfxEffekseerPreset,
  );
  if (!presetNode) return null;
  const data = presetNode.data as VfxEffekseerPresetNodeData;
  const presetId = data.presetId;
  if (!presetId || !resolveEffectPreset(presetId)) return null;
  return presetId;
}

function formatSocketStatusMessage(hasModel: boolean): string {
  return hasModel
    ? 'Modell verbunden — Sockets platzieren.'
    : 'Kein Modell — Sockets als Entwurf bearbeitbar.';
}

function patchDownstreamFromSource(
  sourceNodeId: string,
  patchNodeData: (nodeId: string, patch: Record<string, unknown>) => void,
  nodes: Node[],
  edges: Edge[],
  patch: Record<string, unknown>,
  targetTypes: VfxPipelineNodeType[],
) {
  const downstream = edges.filter((e) => e.source === sourceNodeId);
  for (const edge of downstream) {
    const target = nodes.find((n) => n.id === edge.target);
    if (!target || !target.type) continue;
    if (targetTypes.includes(target.type as VfxPipelineNodeType)) {
      patchNodeData(edge.target, patch);
    }
  }
}

export interface CreditConfirmState {
  open: boolean;
  credits: number;
  meshyNodeId: string | null;
}

export function useAssetPipelineGraph(enabled: boolean) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [savedTechniques, setSavedTechniques] = useState<TechniqueAsset[]>(() =>
    listTechniqueAssets(),
  );
  const [creditConfirm, setCreditConfirm] = useState<CreditConfirmState>({
    open: false,
    credits: 5,
    meshyNodeId: null,
  });

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  nodesRef.current = nodes;
  edgesRef.current = edges;

  const patchNodeData = useCallback(
    (nodeId: string, patch: Record<string, unknown>) => {
      setNodes((current) =>
        current.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...patch } } : node,
        ),
      );
    },
    [setNodes],
  );

  const runNormalizeNode = useCallback(
    async (normalizeNodeId: string) => {
      const currentNodes = nodesRef.current;
      const currentEdges = edgesRef.current;
      const glbUrl = getGlbFromUpstream(currentNodes, currentEdges, normalizeNodeId);

      if (!glbUrl) {
        patchNodeData(normalizeNodeId, {
          status: 'FAILED',
          statusMessage: 'Kein GLB verbunden — zuerst Meshy ausführen.',
          glbUrl: null,
          modelAsset: null,
        });
        return;
      }

      patchNodeData(normalizeNodeId, {
        status: 'GENERATING',
        statusMessage: 'Bounds werden berechnet…',
        glbUrl,
        modelAsset: null,
      });

      try {
        const measured = await loadGlbBounds(glbUrl);
        const bounds = measured ?? fallbackBoundsForGlb(glbUrl);
        const modelAsset = buildModelAsset({ glbUrl, bounds });
        const statusMessage = formatModelAssetStatusDe(modelAsset);

        patchNodeData(normalizeNodeId, {
          status: 'READY',
          glbUrl,
          modelAsset,
          statusMessage,
        });

        patchDownstreamFromSource(
          normalizeNodeId,
          patchNodeData,
          currentNodes,
          currentEdges,
          {
            glbUrl,
            modelAsset,
            status: 'READY',
            statusMessage: formatSocketStatusMessage(true),
          },
          [
            VFX_PIPELINE_NODE_TYPES.vfxSocket,
            VFX_PIPELINE_NODE_TYPES.vfxEffekseerPreset,
            VFX_PIPELINE_NODE_TYPES.vfxSaveTechnique,
          ],
        );
      } catch {
        patchNodeData(normalizeNodeId, {
          status: 'FAILED',
          statusMessage: 'Normalisierung fehlgeschlagen.',
          modelAsset: null,
        });
      }
    },
    [patchNodeData],
  );

  const runMeshyGenerate = useCallback(
    async (meshyNodeId: string) => {
      const currentNodes = nodesRef.current;
      const currentEdges = edgesRef.current;
      const prompt = getPromptFromMeshyNode(currentNodes, meshyNodeId);

      if (!prompt) {
        patchNodeData(meshyNodeId, {
          status: 'FAILED',
          statusMessage: 'Bitte einen Prompt in der Meshy-Node eingeben.',
        });
        return;
      }

      patchNodeData(meshyNodeId, {
        status: 'QUEUED',
        statusMessage: 'Meshy-Auftrag wird gestartet…',
        taskId: null,
        glbUrl: null,
      });

      try {
        const created = await createMeshyTextTo3d(prompt);
        patchNodeData(meshyNodeId, {
          status: 'GENERATING',
          taskId: created.taskId,
          statusMessage: created.mock
            ? 'Demo-Modus (VFX_WORKER_MOCK=1)…'
            : 'Meshy generiert Modell…',
        });

        const result = await pollMeshyTaskUntilDone(created.taskId);

        if (result.status !== 'succeeded' || !result.glbUrl) {
          patchNodeData(meshyNodeId, {
            status: 'FAILED',
            statusMessage: result.error ?? 'Meshy-Generierung fehlgeschlagen.',
          });
          return;
        }

        patchNodeData(meshyNodeId, {
          status: 'READY',
          glbUrl: result.glbUrl,
          statusMessage: result.mock ? 'Demo-GLB bereit.' : 'GLB bereit.',
        });

        const downstream = currentEdges.filter((e) => e.source === meshyNodeId);
        for (const edge of downstream) {
          const target = currentNodes.find((n) => n.id === edge.target);
          if (!target) continue;
          if (target.type === VFX_PIPELINE_NODE_TYPES.vfxNormalize) {
            void runNormalizeNode(edge.target);
            continue;
          }
          if (
            target.type === VFX_PIPELINE_NODE_TYPES.vfxSocket ||
            target.type === VFX_PIPELINE_NODE_TYPES.vfxSaveTechnique
          ) {
            patchNodeData(edge.target, {
              glbUrl: result.glbUrl,
              status: 'READY',
              statusMessage:
                target.type === VFX_PIPELINE_NODE_TYPES.vfxSocket
                  ? formatSocketStatusMessage(true)
                  : 'Bereit zum Speichern.',
            });
          }
        }
      } catch (err) {
        const message =
          err instanceof VfxWorkerError
            ? err.message
            : 'Unbekannter Fehler bei Meshy-Anfrage.';
        patchNodeData(meshyNodeId, {
          status: 'FAILED',
          statusMessage: message,
        });
      }
    },
    [patchNodeData, runNormalizeNode],
  );

  const requestMeshyGenerate = useCallback(
    (meshyNodeId: string) => {
      setCreditConfirm({ open: true, credits: 5, meshyNodeId });
    },
    [],
  );

  const confirmCreditAndGenerate = useCallback(() => {
    const meshyNodeId = creditConfirm.meshyNodeId;
    setCreditConfirm({ open: false, credits: 5, meshyNodeId: null });
    if (meshyNodeId) {
      void runMeshyGenerate(meshyNodeId);
    }
  }, [creditConfirm.meshyNodeId, runMeshyGenerate]);

  const cancelCreditConfirm = useCallback(() => {
    setCreditConfirm({ open: false, credits: 5, meshyNodeId: null });
  }, []);

  const saveTechniqueFromNode = useCallback(
    (saveNodeId: string) => {
      const currentNodes = nodesRef.current;
      const currentEdges = edgesRef.current;
      const saveNode = currentNodes.find((n) => n.id === saveNodeId);
      if (!saveNode) return;

      const saveData = saveNode.data as VfxSaveTechniqueNodeData;
      const glbUrl = saveData.glbUrl ?? getGlbFromUpstream(currentNodes, currentEdges, saveNodeId);
      const meshyNode = findUpstreamNode(
        currentNodes,
        currentEdges,
        saveNodeId,
        VFX_PIPELINE_NODE_TYPES.vfxMeshy,
      );
      const promptText = meshyNode
        ? ((meshyNode.data as VfxMeshyNodeData).prompt ?? '').trim()
        : '';

      const name = saveData.techniqueName.trim() || promptText || 'Neue Technik';
      if (!glbUrl) {
        patchNodeData(saveNodeId, {
          status: 'FAILED',
          statusMessage: 'Kein GLB — zuerst Meshy ausführen.',
        });
        return;
      }

      const upstreamSocket = getSocketDataFromUpstream(currentNodes, currentEdges, saveNodeId);
      const sockets: VfxTechniqueSocketMap =
        upstreamSocket?.sockets ?? createDefaultSocketMap();
      const effectId = getPresetIdFromUpstream(currentNodes, currentEdges, saveNodeId);

      const slug = slugifyName(name) || 'technik';
      const id = `vfx-technik-${slug}-${Date.now()}`;
      const now = new Date().toISOString();
      const asset: TechniqueAsset = {
        kind: 'technique',
        role: 'technik',
        badges: ['Formel', 'Technik'],
        id,
        name,
        status: 'READY',
        version: 1,
        createdAt: now,
        updatedAt: now,
        imageId: null,
        modelId: glbUrl,
        effectId,
        sockets,
      };

      try {
        const saved = saveTechniqueAsset(asset);
        patchNodeData(saveNodeId, {
          status: 'READY',
          savedAssetId: saved.id,
          glbUrl,
          techniqueName: name,
          statusMessage: `Technik „${saved.name}" gespeichert.`,
        });
        setSavedTechniques(listTechniqueAssets());
      } catch {
        patchNodeData(saveNodeId, {
          status: 'FAILED',
          statusMessage: 'Speichern fehlgeschlagen.',
        });
      }
    },
    [patchNodeData],
  );

  const bindNodeActions = useCallback(
    (nodeList: Node[]): Node[] =>
      nodeList.map((node) => {
        if (node.type === VFX_PIPELINE_NODE_TYPES.vfxMeshy) {
          return {
            ...node,
            data: {
              ...node.data,
              onGenerate: () => requestMeshyGenerate(node.id),
              onPromptChange: (prompt: string) => {
                patchNodeData(node.id, { prompt });
              },
            },
          };
        }
        if (node.type === VFX_PIPELINE_NODE_TYPES.vfxSaveTechnique) {
          return {
            ...node,
            data: {
              ...node.data,
              onSave: () => saveTechniqueFromNode(node.id),
            },
          };
        }
        if (node.type === VFX_PIPELINE_NODE_TYPES.vfxEffekseerPreset) {
          return {
            ...node,
            data: {
              ...node.data,
              onPresetChange: (presetId: string) => {
                const preset = resolveEffectPreset(presetId);
                patchNodeData(node.id, {
                  presetId: preset ? preset.id : null,
                  status: preset ? 'READY' : 'FAILED',
                  statusMessage: preset
                    ? `${preset.labelDe}-Preset gewählt`
                    : 'Unbekanntes Preset',
                });
              },
            },
          };
        }
        return node;
      }),
    [patchNodeData, requestMeshyGenerate, saveTechniqueFromNode],
  );

  useEffect(() => {
    setNodes((current) => bindNodeActions(current));
  }, [bindNodeActions, setNodes]);

  /** Seed fixed Meshy → Normalize → Socket → Save graph once when Assets mode is active. */
  useEffect(() => {
    if (!enabled) return;
    if (nodesRef.current.length > 0) return;
    const seeded = createDefaultAssetPipeline();
    setNodes(bindNodeActions(seeded.nodes));
    setEdges(seeded.edges);
    setSelectedNodeId(DEFAULT_PIPELINE_NODE_IDS.meshy);
  }, [bindNodeActions, enabled, setEdges, setNodes]);

  const [pipelineViewport, setPipelineViewport] = useState(PIPELINE_GRID.viewport);
  const [pipelineViewportReady, setPipelineViewportReady] = useState(false);
  const lastCanvasSizeRef = useRef({ width: 0, height: 0 });
  /** After the first fit layout, never overwrite user-dragged node positions. */
  const positionsLockedRef = useRef(false);

  const reflowPipelineLayout = useCallback(
    (canvasWidth: number, canvasHeight: number) => {
      if (!enabled || canvasWidth <= 0 || canvasHeight <= 0) return;
      const width = Math.round(canvasWidth);
      const height = Math.round(canvasHeight);
      if (
        width === lastCanvasSizeRef.current.width &&
        height === lastCanvasSizeRef.current.height &&
        nodesRef.current.length > 0
      ) {
        return;
      }
      lastCanvasSizeRef.current = { width, height };
      const metrics: PipelineGridMetrics = computePipelineGridMetrics(width, height);

      if (nodesRef.current.length === 0) {
        const seeded = createDefaultAssetPipeline(metrics);
        setNodes(bindNodeActions(seeded.nodes));
        setEdges(seeded.edges);
        setSelectedNodeId(DEFAULT_PIPELINE_NODE_IDS.meshy);
        setPipelineViewport(metrics.viewport);
        setPipelineViewportReady(true);
        positionsLockedRef.current = true;
        return;
      }

      /** First real canvas measure: snap to the default grid once. */
      if (!positionsLockedRef.current) {
        setNodes((current) => bindNodeActions(applyPipelineGridLayout(current, metrics)));
        setPipelineViewport(metrics.viewport);
        setPipelineViewportReady(true);
        positionsLockedRef.current = true;
      }
      /** Later resizes: keep dragged positions as-is. */
    },
    [bindNodeActions, enabled, setEdges, setNodes],
  );

  const updateSelectedPrompt = useCallback(
    (prompt: string) => {
      if (!selectedNodeId) return;
      const node = nodesRef.current.find((n) => n.id === selectedNodeId);
      if (!node || node.type !== VFX_PIPELINE_NODE_TYPES.vfxMeshy) return;
      patchNodeData(selectedNodeId, { prompt });
    },
    [patchNodeData, selectedNodeId],
  );

  const updateSelectedTechniqueName = useCallback(
    (techniqueName: string) => {
      if (!selectedNodeId) return;
      patchNodeData(selectedNodeId, { techniqueName });
    },
    [patchNodeData, selectedNodeId],
  );

  const updateSelectedActiveSocket = useCallback(
    (activeSocket: VfxTechniqueSocketName) => {
      if (!selectedNodeId) return;
      patchNodeData(selectedNodeId, { activeSocket });
    },
    [patchNodeData, selectedNodeId],
  );

  const updateSelectedSocketAxis = useCallback(
    (name: VfxTechniqueSocketName, axis: keyof Vec3, value: number) => {
      if (!selectedNodeId) return;
      const node = nodesRef.current.find((n) => n.id === selectedNodeId);
      if (!node || node.type !== VFX_PIPELINE_NODE_TYPES.vfxSocket) return;
      const data = node.data as VfxSocketNodeData;
      const current = data.sockets[name];
      const nextPosition = roundVec3({ ...current, [axis]: value });
      patchNodeData(selectedNodeId, {
        sockets: updateSocketInMap(data.sockets, name, nextPosition),
      });
    },
    [patchNodeData, selectedNodeId],
  );

  const updateSelectedSocketPosition = useCallback(
    (name: VfxTechniqueSocketName, position: Vec3) => {
      if (!selectedNodeId) return;
      const node = nodesRef.current.find((n) => n.id === selectedNodeId);
      if (!node || node.type !== VFX_PIPELINE_NODE_TYPES.vfxSocket) return;
      const data = node.data as VfxSocketNodeData;
      patchNodeData(selectedNodeId, {
        sockets: updateSocketInMap(data.sockets, name, roundVec3(position)),
      });
    },
    [patchNodeData, selectedNodeId],
  );

  const onConnect = useCallback((_connection: Connection) => {
    /* Fixed pipeline — edges are pre-wired; ignore new connections. */
  }, []);

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId) ?? null
    : null;

  const selectedPresetId = (() => {
    const presetNode = nodes.find(
      (n) => n.type === VFX_PIPELINE_NODE_TYPES.vfxEffekseerPreset,
    );
    if (!presetNode) return 'aura';
    const data = presetNode.data as VfxEffekseerPresetNodeData;
    return data.presetId && resolveEffectPreset(data.presetId) ? data.presetId : 'aura';
  })();

  const refreshSavedTechniques = useCallback(() => {
    setSavedTechniques(listTechniqueAssets());
  }, []);

  return {
    nodes,
    edges,
    pipelineViewport,
    pipelineViewportReady,
    onNodesChange,
    onEdgesChange,
    onConnect,
    reflowPipelineLayout,
    selectedNodeId,
    selectedPresetId,
    setSelectedNodeId,
    selectedNode,
    updateSelectedPrompt,
    updateSelectedTechniqueName,
    updateSelectedActiveSocket,
    updateSelectedSocketAxis,
    updateSelectedSocketPosition,
    savedTechniques,
    refreshSavedTechniques,
    creditConfirm,
    confirmCreditAndGenerate,
    cancelCreditConfirm,
  };
}
