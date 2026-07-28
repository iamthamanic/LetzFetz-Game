/**
 * Play-owned engine 3D entry (panel, MVP demo, snapshot cache).
 * Location: src/features/play/engine3d/index.ts
 *
 * Presentational Canvas/Assembler: `src/components/engine3d/` (shared with Forge).
 */
export { EnginePreviewPanel } from './EnginePreviewPanel';
export { MVP_DEMO_RECIPE, recipeHasRegistryAsset } from './mvpDemoRecipe';
export {
  getEngineSnapshot,
  setEngineSnapshot,
  invalidateEngineSnapshot,
  engineSnapshotCacheSize,
} from './rendering/engine-snapshot-cache';
export type { EngineSnapshotEntry } from './rendering/engine-snapshot-cache';
export {
  requestEngineSnapshot,
  ENGINE_SNAPSHOT_PLACEHOLDER_DATA_URL,
} from './rendering/requestEngineSnapshot';
export type {
  EngineSnapshotResult,
  EngineSnapshotSource,
  RequestEngineSnapshotOptions,
} from './rendering/requestEngineSnapshot';
export {
  isEngineSnapshotPlaceholder,
  lookupEngineSnapshotThumb,
  resolveBoardCardArtPath,
  resolveEnginePartThumb,
} from './rendering/resolveEnginePartThumb';
