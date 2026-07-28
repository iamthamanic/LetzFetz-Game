/**
 * MVP demo recipe + helpers for Play engine 3D preview.
 * Location: src/features/play/engine3d/mvpDemoRecipe.ts
 */
import {
  ENGINE_RENDER_VERSION,
  type EngineRecipe,
} from '../../../game/types/engineVisual';
import { lookupEnginePartAsset } from '../../../services/engineAssets/partRegistry';

/** Hardcoded MVP×3 — registry ids until engineParts36 is authored. */
export const MVP_DEMO_RECIPE: EngineRecipe = {
  carrierId: 'v3-part-water-traeger-01',
  driveId: 'v3-part-shadow-antrieb-01',
  attachmentId: 'v3-part-light-aufsatz-01',
  cosmeticSeed: 0,
  renderVersion: ENGINE_RENDER_VERSION,
};

/** True when at least one recipe part has a GLB registry entry. */
export function recipeHasRegistryAsset(recipe: EngineRecipe): boolean {
  for (const id of [recipe.carrierId, recipe.driveId, recipe.attachmentId]) {
    if (id && lookupEnginePartAsset(id)) return true;
  }
  return false;
}
