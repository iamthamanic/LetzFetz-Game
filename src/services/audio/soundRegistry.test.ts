/**
 * Unit tests for sound registry + manifest sync (no sound card).
 * Location: src/services/audio/soundRegistry.test.ts
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { CLASH_SOUND_URL } from './clashSound';
import {
  assertUniqueSoundIds,
  listSoundRegistry,
  resolveSoundUrl,
} from './soundRegistry';
import type { SoundId } from './types';

const FIRST_WAVE_IDS: readonly SoundId[] = [
  'card.draw',
  'card.play',
  'card.discard',
  'card.reveal',
  'card.destroy',
  'card.shuffle',
  'card.clash',
  'dice.roll',
  'dice.settle',
  'combat.attack',
  'combat.block',
  'combat.damage.light',
  'combat.damage.heavy',
  'combat.critical',
  'ability.ready',
  'ability.activate',
  'ability.corrupt',
  'round.start',
  'round.end',
  'match.victory',
  'match.defeat',
  'ui.click',
  'ui.confirm',
  'ui.cancel',
  'ui.error',
  'ui.invalid',
  'ui.modal.open',
  'ui.modal.close',
  'ambience.arena.default',
  'music.menu.main',
  'music.match.default',
];

interface ManifestSound {
  id: string;
  status: string;
  publicPath: string | null;
}

interface SoundManifest {
  version: number;
  sounds: ManifestSound[];
}

function loadManifest(): SoundManifest {
  const here = dirname(fileURLToPath(import.meta.url));
  const manifestPath = join(
    here,
    '../../../tools/audio-forge/sound-manifest.json',
  );
  const raw: unknown = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (
    typeof raw !== 'object' ||
    raw === null ||
    !('sounds' in raw) ||
    !Array.isArray((raw as { sounds: unknown }).sounds)
  ) {
    throw new Error('Invalid sound-manifest.json shape');
  }
  return raw as SoundManifest;
}

describe('soundRegistry', () => {
  it('lists every first-wave SoundId exactly once', () => {
    const ids = listSoundRegistry().map((e) => e.id);
    assertUniqueSoundIds(ids);
    expect(ids.sort()).toEqual([...FIRST_WAVE_IDS].sort());
  });

  it('resolves card.clash under /audio/ (not legacy /sounds/)', () => {
    expect(resolveSoundUrl('card.clash')).toBe('/audio/sfx/card-clash.mp3');
    expect(CLASH_SOUND_URL).toBe('/audio/sfx/card-clash.mp3');
    expect(CLASH_SOUND_URL.startsWith('/sounds/')).toBe(false);
  });

  it('returns null for planned IDs without files', () => {
    expect(resolveSoundUrl('dice.roll')).toBeNull();
    expect(resolveSoundUrl('ui.click')).toBeNull();
  });

  it('rejects duplicate ids', () => {
    expect(() => assertUniqueSoundIds(['a', 'a'])).toThrow(/Duplicate/);
  });
});

describe('sound-manifest.json', () => {
  it('lists all first-wave IDs with status and unique ids', () => {
    const manifest = loadManifest();
    const ids = manifest.sounds.map((s) => s.id);
    assertUniqueSoundIds(ids);
    expect(ids.sort()).toEqual([...FIRST_WAVE_IDS].sort());
    for (const sound of manifest.sounds) {
      expect(['planned', 'existing', 'approved']).toContain(sound.status);
    }
  });

  it('marks card.clash existing with migrated publicPath', () => {
    const clash = loadManifest().sounds.find((s) => s.id === 'card.clash');
    expect(clash?.status).toBe('existing');
    expect(clash?.publicPath).toBe('sfx/card-clash.mp3');
  });
});
