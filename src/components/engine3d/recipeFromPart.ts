/**
 * Build EngineRecipe for library / detail previews from a part id.
 * Location: src/components/engine3d/recipeFromPart.ts
 *
 * Single parts always preview as carrier-only so any slot's GLB is visible
 * without needing a full Träger+Antrieb+Aufsatz set.
 */
import {
  ENGINE_RENDER_VERSION,
  type EngineRecipe,
} from '../../game/types/engineVisual';
import { lookupEnginePartAsset } from '../../services/engineAssets/partRegistry';

/** Carrier-only recipe for one registered part id, or null if unknown. */
export function recipeFromPartId(partId: string): EngineRecipe | null {
  if (!lookupEnginePartAsset(partId)) return null;
  return {
    carrierId: partId,
    cosmeticSeed: 0,
    renderVersion: ENGINE_RENDER_VERSION,
  };
}

/** True when at least one recipe part has a GLB registry entry. */
export function recipeHasRegistryAsset(recipe: EngineRecipe): boolean {
  for (const id of [recipe.carrierId, recipe.driveId, recipe.attachmentId]) {
    if (id && lookupEnginePartAsset(id)) return true;
  }
  return false;
}
