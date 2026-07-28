/**
 * Shared Fetzgerät 3D preview (Canvas + Assembler) — Play + Forge import here.
 * Location: src/components/engine3d/index.ts
 * No Feature→Feature. Hook exception: three/** only (ADR D4).
 */
export { EnginePreviewCanvas, detectWebGL } from './EnginePreviewCanvas';
export {
  recipeFromPartId,
  recipeHasRegistryAsset,
} from './recipeFromPart';
export type { AssemblerIssue } from './three/WeaponAssembler';
