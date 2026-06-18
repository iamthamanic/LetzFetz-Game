/**
 * Local persistence for pack card images/notes in Card Forge.
 * Location: src/services/cardForge/localOverlays.ts
 */
import type { ForgeCardData } from './types';

const STORAGE_KEY = 'letzfetz-forge-overlays';

interface CardOverlay {
  image_asset?: string;
  notes?: string;
  updated_at?: string;
}

export function loadLocalOverlays(): Partial<ForgeCardData>[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, CardOverlay>;
    return Object.entries(parsed).map(([id, data]) => ({ id, ...data }));
  } catch {
    return [];
  }
}

export function saveLocalOverlay(
  id: string,
  overlay: Pick<CardOverlay, 'image_asset' | 'notes'>,
): void {
  const all: Record<string, CardOverlay> = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  all[id] = {
    ...all[id],
    ...overlay,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
