/**
 * Public exports for Play engine 3D preview (#133).
 * Location: src/features/play/engine3d/index.ts
 *
 * Forge follow-up: shared presentational entry may later live under
 * `src/components/engine3d/` — MVP wires Play only (no Feature→Feature).
 */
export { EnginePreviewCanvas, detectWebGL } from './EnginePreviewCanvas';
export { EnginePreviewPanel } from './EnginePreviewPanel';
export { MVP_DEMO_RECIPE, recipeHasRegistryAsset } from './mvpDemoRecipe';
