/**
 * MVP demo recipe + helpers for Play engine 3D preview.
 * Location: src/features/play/engine3d/mvpDemoRecipe.ts
 */
import {
  ENGINE_RENDER_VERSION,
  type EngineRecipe,
} from '../../../game/types/engineVisual';
import { recipeHasRegistryAsset as sharedRecipeHasRegistryAsset } from '../../../components/engine3d';

/** Demo recipe using three ids from `V3_ENGINE_PARTS_36`. */
export const MVP_DEMO_RECIPE: EngineRecipe = {
  carrierId: 'v3-part-water-traeger-01',
  driveId: 'v3-part-shadow-antrieb-01',
  attachmentId: 'v3-part-light-aufsatz-01',
  cosmeticSeed: 0,
  renderVersion: ENGINE_RENDER_VERSION,
};

/** True when at least one recipe part has a GLB registry entry. */
export function recipeHasRegistryAsset(recipe: EngineRecipe): boolean {
  return sharedRecipeHasRegistryAsset(recipe);
}
