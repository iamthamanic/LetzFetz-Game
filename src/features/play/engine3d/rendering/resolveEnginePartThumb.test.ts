/**
 * Tests for board engine-part thumb resolver (#166).
 * Location: src/features/play/engine3d/rendering/resolveEnginePartThumb.test.ts
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { ENGINE_RENDER_VERSION } from '../../../../game/types/engineVisual';
import { createRenderKey } from '../../../../game/engine/engineRecipe';
import { recipeFromPartId } from '../../../../components/engine3d/recipeFromPart';
import {
  invalidateEngineSnapshot,
  setEngineSnapshot,
} from './engine-snapshot-cache';
import { ENGINE_SNAPSHOT_PLACEHOLDER_DATA_URL } from './requestEngineSnapshot';
import {
  isEngineSnapshotPlaceholder,
  lookupEngineSnapshotThumb,
  resolveBoardCardArtPath,
  resolveEnginePartThumb,
} from './resolveEnginePartThumb';

const PILOT = 'v3-part-water-traeger-01';
const REAL_SNAP = 'data:image/png;base64,realSnapshotThumbPayload';

describe('resolveEnginePartThumb', () => {
  beforeEach(() => {
    invalidateEngineSnapshot();
  });

  it('detects placeholder stub URL', () => {
    expect(isEngineSnapshotPlaceholder(ENGINE_SNAPSHOT_PLACEHOLDER_DATA_URL)).toBe(true);
    expect(isEngineSnapshotPlaceholder(REAL_SNAP)).toBe(false);
  });

  it('falls back to shipped engine PNG on cache miss', () => {
    expect(resolveEnginePartThumb(PILOT)).toBe(`/cards/engine/${PILOT}.png`);
  });

  it('prefers cached real snapshot over static fallback', () => {
    const recipe = recipeFromPartId(PILOT);
    expect(recipe).not.toBeNull();
    setEngineSnapshot(createRenderKey(recipe!), REAL_SNAP);
    expect(resolveEnginePartThumb(PILOT)).toBe(REAL_SNAP);
    expect(lookupEngineSnapshotThumb(PILOT)).toBe(REAL_SNAP);
  });

  it('skips placeholder cache entries and falls back to shipped PNG', () => {
    const recipe = recipeFromPartId(PILOT)!;
    setEngineSnapshot(createRenderKey(recipe), ENGINE_SNAPSHOT_PLACEHOLDER_DATA_URL);
    expect(lookupEngineSnapshotThumb(PILOT)).toBeNull();
    expect(resolveEnginePartThumb(PILOT)).toBe(`/cards/engine/${PILOT}.png`);
  });

  it('resolveBoardCardArtPath leaves non-engine cards on cardArt', () => {
    expect(resolveBoardCardArtPath('fire-attack')).toContain('fire');
  });

  it('honors optional full recipe key before solo part recipe', () => {
    const full = {
      carrierId: PILOT,
      driveId: 'v3-part-shadow-antrieb-01',
      attachmentId: 'v3-part-light-aufsatz-01',
      cosmeticSeed: 0,
      renderVersion: ENGINE_RENDER_VERSION,
    };
    setEngineSnapshot(createRenderKey(full), REAL_SNAP);
    expect(resolveEnginePartThumb(PILOT, full)).toBe(REAL_SNAP);
  });
});
