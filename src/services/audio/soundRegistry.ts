/**
 * Runtime sound registry — maps typed SoundIds to public URLs.
 * Location: src/services/audio/soundRegistry.ts
 *
 * Mirrors approved/existing entries from tools/audio-forge/sound-manifest.json.
 * UI must never hardcode /audio/ paths; resolve via resolveSoundUrl(id).
 */
import type { AudioCategory, SoundId } from './types';

export type SoundRuntimeStatus = 'existing' | 'planned' | 'procedural';

export interface SoundRegistryEntry {
  id: SoundId;
  category: AudioCategory;
  status: SoundRuntimeStatus;
  /** Absolute public URL when a file exists; null for planned/procedural. */
  publicUrl: string | null;
  baseVolume: number;
}

/** Vite public root for audio assets (manifest publicRoot + relative path). */
export const AUDIO_PUBLIC_ROOT = '/audio';

/**
 * First-wave registry. Keep in sync with tools/audio-forge/sound-manifest.json.
 * Only `existing` rows expose a publicUrl for file playback.
 */
const REGISTRY: readonly SoundRegistryEntry[] = [
  { id: 'card.draw', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'card.play', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'card.discard', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'card.reveal', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'card.destroy', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'card.shuffle', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  {
    id: 'card.clash',
    category: 'sfx',
    status: 'existing',
    publicUrl: `${AUDIO_PUBLIC_ROOT}/sfx/card-clash.mp3`,
    baseVolume: 0.85,
  },
  { id: 'dice.roll', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'dice.settle', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'combat.attack', category: 'sfx', status: 'procedural', publicUrl: null, baseVolume: 1 },
  { id: 'combat.block', category: 'sfx', status: 'procedural', publicUrl: null, baseVolume: 1 },
  {
    id: 'combat.damage.light',
    category: 'sfx',
    status: 'procedural',
    publicUrl: null,
    baseVolume: 1,
  },
  { id: 'combat.damage.heavy', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'combat.critical', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'ability.ready', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'ability.activate', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'ability.corrupt', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'round.start', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'round.end', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'match.victory', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'match.defeat', category: 'sfx', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'ui.click', category: 'ui', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'ui.confirm', category: 'ui', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'ui.cancel', category: 'ui', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'ui.error', category: 'ui', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'ui.invalid', category: 'ui', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'ui.modal.open', category: 'ui', status: 'planned', publicUrl: null, baseVolume: 1 },
  { id: 'ui.modal.close', category: 'ui', status: 'planned', publicUrl: null, baseVolume: 1 },
  {
    id: 'ambience.arena.default',
    category: 'ambience',
    status: 'planned',
    publicUrl: null,
    baseVolume: 1,
  },
  { id: 'music.menu.main', category: 'music', status: 'planned', publicUrl: null, baseVolume: 1 },
  {
    id: 'music.match.default',
    category: 'music',
    status: 'planned',
    publicUrl: null,
    baseVolume: 1,
  },
];

const BY_ID = new Map<SoundId, SoundRegistryEntry>(
  REGISTRY.map((entry) => [entry.id, entry]),
);

export function listSoundRegistry(): readonly SoundRegistryEntry[] {
  return REGISTRY;
}

export function getSoundEntry(id: SoundId): SoundRegistryEntry | undefined {
  return BY_ID.get(id);
}

/** Public URL for file-backed IDs; null when planned/procedural/missing. */
export function resolveSoundUrl(id: SoundId): string | null {
  return BY_ID.get(id)?.publicUrl ?? null;
}

/** Reject duplicate IDs — used by tests / future forge verify. */
export function assertUniqueSoundIds(ids: readonly string[]): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      throw new Error(`Duplicate sound id: ${id}`);
    }
    seen.add(id);
  }
}
