/**
 * Public exports for Play engine 3D preview (#133–#134).
 * Location: src/features/play/engine3d/index.ts
 *
 * Forge follow-up: shared presentational entry may later live under
 * `src/components/engine3d/` — MVP wires Play only (no Feature→Feature).
 */
export { EnginePreviewCanvas, detectWebGL } from './EnginePreviewCanvas';
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
