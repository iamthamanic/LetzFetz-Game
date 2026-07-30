/**
 * Asset Pipeline graph state, worker calls, and registry save.
 * Location: src/features/build/vfx/useAssetPipelineGraph.ts
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  addEdge,
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
  defaultMeshyNodeData,
  defaultNormalizeNodeData,
  defaultPromptNodeData,
  defaultSaveTechniqueNodeData,
  defaultSocketNodeData,
  type VfxMeshyNodeData,
  type VfxNormalizeNodeData,
  type VfxPipelineNodeType,
  type VfxPromptNodeData,
  type VfxSaveTechniqueNodeData,
  type VfxSocketNodeData,
} from './nodes/vfxNodeTypes';
import {
  VfxWorkerError,
  createMeshyTextTo3d,
  pollMeshyTaskUntilDone,
} from './workerClient';
import { buildModelAsset, formatModelAssetStatusDe } from './normalize/buildModelAsset';
import { fallbackBoundsForGlb, loadGlbBounds } from './normalize/loadGlbBounds';
import type { ModelAsset } from './types/wireTypes';

let nodeCounter = 0;

function nextNodeId(prefix: string): string {
  nodeCounter += 1;
  return `${prefix}-${nodeCounter}`;
}

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

function getPromptFromGraph(nodes: Node[], edges: Edge[], meshyNodeId: string): string {
  const promptNode = findUpstreamNode(
    nodes,
    edges,
    meshyNodeId,
    VFX_PIPELINE_NODE_TYPES.vfxPrompt,
  );
  if (!promptNode) return '';
  return (promptNode.data as VfxPromptNodeData).prompt.trim();
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
      const data = source.data as VfxMeshyNodeData | VfxNormalizeNodeData | VfxSocketNodeData;
      if ('modelAsset' in data && data.modelAsset?.glbUrl) {
        return data.modelAsset.glbUrl;
      }
      if ('glbUrl' in data && data.glbUrl) return data.glbUrl;
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
            statusMessage:
              'Normalisiertes Modell bereit.',
          },
          [
            VFX_PIPELINE_NODE_TYPES.vfxSocket,
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
      const prompt = getPromptFromGraph(currentNodes, currentEdges, meshyNodeId);

      if (!prompt) {
        patchNodeData(meshyNodeId, {
          status: 'FAILED',
          statusMessage: 'Kein Prompt verbunden — bitte Prompt-Node verknüpfen.',
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
                  ? 'Stub — Standard-Socket gesetzt.'
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
      const promptNode = findUpstreamNode(
        currentNodes,
        currentEdges,
        saveNodeId,
        VFX_PIPELINE_NODE_TYPES.vfxPrompt,
      );
      const promptText = promptNode
        ? (promptNode.data as VfxPromptNodeData).prompt.trim()
        : '';

      const name = saveData.techniqueName.trim() || promptText || 'Neue Technik';
      if (!glbUrl) {
        patchNodeData(saveNodeId, {
          status: 'FAILED',
          statusMessage: 'Kein GLB — zuerst Meshy ausführen.',
        });
        return;
      }

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
        effectId: null,
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
        return node;
      }),
    [requestMeshyGenerate, saveTechniqueFromNode],
  );

  useEffect(() => {
    setNodes((current) => bindNodeActions(current));
  }, [bindNodeActions, setNodes]);

  const addPipelineNode = useCallback(
    (type: VfxPipelineNodeType) => {
      if (!enabled) return;
      const id = nextNodeId(type);
      const yOffset = nodesRef.current.length * 40;

      let data: Record<string, unknown>;
      switch (type) {
        case VFX_PIPELINE_NODE_TYPES.vfxPrompt:
          data = defaultPromptNodeData();
          break;
        case VFX_PIPELINE_NODE_TYPES.vfxMeshy:
          data = defaultMeshyNodeData();
          break;
        case VFX_PIPELINE_NODE_TYPES.vfxNormalize:
          data = defaultNormalizeNodeData();
          break;
        case VFX_PIPELINE_NODE_TYPES.vfxSocket:
          data = defaultSocketNodeData();
          break;
        case VFX_PIPELINE_NODE_TYPES.vfxSaveTechnique:
          data = defaultSaveTechniqueNodeData();
          break;
        default:
          data = { status: 'DRAFT' };
      }

      const newNode: Node = {
        id,
        type,
        position: { x: 80 + (nodesRef.current.length % 3) * 220, y: 60 + yOffset },
        data,
      };

      setNodes((current) => bindNodeActions([...current, newNode]));
    },
    [bindNodeActions, enabled, setNodes],
  );

  const updateSelectedPrompt = useCallback(
    (prompt: string) => {
      if (!selectedNodeId) return;
      patchNodeData(selectedNodeId, {
        prompt,
        status: prompt.trim() ? 'DRAFT' : 'DRAFT',
      });
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

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((current) => {
        const next = addEdge(connection, current);
        const targetNode = nodesRef.current.find((n) => n.id === connection.target);
        if (
          targetNode?.type === VFX_PIPELINE_NODE_TYPES.vfxNormalize &&
          connection.source
        ) {
          const sourceNode = nodesRef.current.find((n) => n.id === connection.source);
          const sourceData = sourceNode?.data as VfxMeshyNodeData | VfxNormalizeNodeData | undefined;
          const upstreamGlb =
            sourceData && 'modelAsset' in sourceData && sourceData.modelAsset?.glbUrl
              ? sourceData.modelAsset.glbUrl
              : sourceData && 'glbUrl' in sourceData
                ? sourceData.glbUrl
                : null;
          if (upstreamGlb) {
            void runNormalizeNode(connection.target);
          }
        }
        return next;
      });
    },
    [runNormalizeNode, setEdges],
  );

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId) ?? null
    : null;

  const refreshSavedTechniques = useCallback(() => {
    setSavedTechniques(listTechniqueAssets());
  }, []);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectedNodeId,
    setSelectedNodeId,
    selectedNode,
    addPipelineNode,
    updateSelectedPrompt,
    updateSelectedTechniqueName,
    savedTechniques,
    refreshSavedTechniques,
    creditConfirm,
    confirmCreditAndGenerate,
    cancelCreditConfirm,
  };
}
