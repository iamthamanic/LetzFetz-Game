/**
 * Client for local Vite /api/dev/assets bridge.
 * Location: src/features/build/development/assetBridgeClient.ts
 */
export type PartListItem = {
  id: string;
  name: string;
  slot: string | null;
  element: string | null;
  pipelineStatus: string;
  specStatus: string;
  combinateVisible: boolean;
  thumbUrl: string | null;
};

export type GalleryItem = { label: string; url: string };

export type PartDetail = {
  id: string;
  spec: Record<string, unknown>;
  state: {
    assetId: string;
    pipelineStatus: string;
    specVersion: number;
    approvedConceptVariant: string | null;
    conceptSheetVersion: number | null;
    contextVersion: number | null;
    isolatedVersion: number | null;
    multiviewVersion: number | null;
    modelVersion: number | null;
    combinateVisible?: boolean;
  } | null;
  galleries: {
    conceptSheet: GalleryItem[];
    context: GalleryItem[];
    isolated: GalleryItem[];
    multiview: GalleryItem[];
    model: GalleryItem[];
  };
  review: unknown;
};

export type BridgeResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(text || `HTTP ${res.status}`);
  }
}

function errorMessage(body: unknown, fallback: string): string {
  if (
    body !== null &&
    typeof body === 'object' &&
    'error' in body &&
    typeof (body as { error: unknown }).error === 'string'
  ) {
    return (body as { error: string }).error;
  }
  return fallback;
}

export async function bridgePing(): Promise<boolean> {
  try {
    const res = await fetch('/api/dev/assets?action=ping');
    return res.ok;
  } catch {
    return false;
  }
}

export async function bridgeListParts(): Promise<BridgeResult<PartListItem[]>> {
  try {
    const res = await fetch('/api/dev/assets?action=list');
    const body = await parseJson(res);
    if (!res.ok) return { ok: false, error: errorMessage(body, 'Liste fehlgeschlagen') };
    const parts =
      body !== null &&
      typeof body === 'object' &&
      'parts' in body &&
      Array.isArray((body as { parts: unknown }).parts)
        ? ((body as { parts: PartListItem[] }).parts)
        : [];
    return { ok: true, data: parts };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Bridge offline' };
  }
}

export async function bridgeGetPart(id: string): Promise<BridgeResult<PartDetail>> {
  try {
    const res = await fetch(`/api/dev/assets?action=get&id=${encodeURIComponent(id)}`);
    const body = await parseJson(res);
    if (!res.ok) return { ok: false, error: errorMessage(body, 'Laden fehlgeschlagen') };
    return { ok: true, data: body as PartDetail };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Bridge offline' };
  }
}

export async function bridgePost(
  action: string,
  payload: Record<string, unknown>,
): Promise<BridgeResult<Record<string, unknown>>> {
  try {
    const res = await fetch('/api/dev/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload }),
    });
    const body = await parseJson(res);
    if (!res.ok) {
      return { ok: false, error: errorMessage(body, `Aktion ${action} fehlgeschlagen`) };
    }
    return { ok: true, data: body as Record<string, unknown> };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Bridge offline' };
  }
}

export const SLOT_OPTIONS = [
  { value: 'carrier', label: 'Technik' },
  { value: 'drive', label: 'Essenz' },
  { value: 'attachment', label: 'Katalysator' },
] as const;

export const ELEMENT_OPTIONS = [
  { value: 'fire', label: 'Feuer' },
  { value: 'water', label: 'Wasser' },
  { value: 'earth', label: 'Erde' },
  { value: 'air', label: 'Luft' },
  { value: 'shadow', label: 'Schatten' },
  { value: 'light', label: 'Licht' },
] as const;

export function slugifyPartId(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/** Stage strip for Development detail — prefer PipelineStepper + buildPipelineSteps. */
export const PIPELINE_STAGES: Array<{ id: string; labelDe: string; match: RegExp }> = [
  { id: 'spec', labelDe: 'Spec', match: /^(draft|spec-approved)$/ },
  { id: 'concept', labelDe: 'Concept', match: /^concept/ },
  { id: 'context', labelDe: 'Kontext', match: /^context/ },
  { id: 'isolated', labelDe: 'Isoliert', match: /^isolated/ },
  { id: 'multiview', labelDe: 'Multiview', match: /^multiview/ },
  { id: 'model', labelDe: '3D', match: /^(model|published)/ },
];

export function stageIndexForStatus(status: string): number {
  const idx = PIPELINE_STAGES.findIndex((s) => s.match.test(status));
  return idx >= 0 ? idx : 0;
}
