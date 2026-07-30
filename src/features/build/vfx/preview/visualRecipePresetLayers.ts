/**
 * Map VisualRecipe / Combinate slots → Effekseer preset layers (MVP-9).
 * Location: src/features/build/vfx/preview/visualRecipePresetLayers.ts
 *
 * Property-driven heuristics from `.qa/design/effekseer-runtime-wiring.md`.
 * Does not require Meshy #286.
 */
import type { VisualRecipe } from '../../../../game/types';
import type { FormulaCatalogCard } from '../../model/combinateFormula';
import type { BuildSlots } from '../../model/buildTypes';
import { BUILD_SLOT_ORDER } from '../../model/buildTypes';
import { findFormulaCard } from '../../model/combinateFormula';
import { resolveEffectPreset } from './effectPresets';

export interface VfxPresetLayer {
  presetId: string;
  role?: 'technik' | 'essenz' | 'katalysator';
}

/** Deterministic MVP-9 card → primary preset (design table). */
export const MVP9_CARD_PRESET_IDS: Readonly<Record<string, string>> = {
  'v5-technik-durchschuss': 'trail',
  'v5-technik-notfallbarriere': 'aura',
  'v5-technik-rueckhandtechnik': 'impact',
  'v5-essenz-eingekochte-glut': 'aura',
  'v5-essenz-ueberdrucktes-kondensat': 'ambient',
  'v5-essenz-kraeuterstaub': 'ambient',
  'v5-katalysator-echo': 'ambient',
  'v5-katalysator-ueberladung': 'impact',
  'v5-katalysator-spiegelung': 'aura',
};

function deliveryToPreset(delivery: VisualRecipe['delivery']): string {
  switch (delivery) {
    case 'beam':
    case 'projectile':
      return 'trail';
    case 'melee':
      return 'impact';
    case 'area':
    case 'barrier':
      return 'aura';
    default:
      return 'aura';
  }
}

function elementToPreset(element: string | undefined): string {
  switch (element) {
    case 'fire':
    case 'shadow':
      return 'aura';
    case 'water':
    case 'earth':
    case 'air':
    case 'light':
      return 'ambient';
    default:
      return 'aura';
  }
}

function transformationToPreset(
  transformation: VisualRecipe['transformation'],
): string | null {
  switch (transformation) {
    case 'overcharge':
      return 'impact';
    case 'reflect':
    case 'duplicate':
      return 'aura';
    case 'spread':
    case 'chain':
      return 'ambient';
    default:
      return null;
  }
}

/** Map a VisualRecipe to ordered Effekseer preset layers (deduped). */
export function mapVisualRecipeToPresetLayers(recipe: VisualRecipe): VfxPresetLayer[] {
  const layers: VfxPresetLayer[] = [
    { presetId: deliveryToPreset(recipe.delivery), role: 'technik' },
  ];
  if (recipe.secondaryElement) {
    layers.push({
      presetId: elementToPreset(recipe.secondaryElement),
      role: 'essenz',
    });
  }
  const catalystPreset = transformationToPreset(recipe.transformation);
  if (catalystPreset) {
    layers.push({ presetId: catalystPreset, role: 'katalysator' });
  }
  return dedupeLayers(layers);
}

function dedupeLayers(layers: VfxPresetLayer[]): VfxPresetLayer[] {
  const seen = new Set<string>();
  const out: VfxPresetLayer[] = [];
  for (const layer of layers) {
    if (!resolveEffectPreset(layer.presetId)) continue;
    const key = `${layer.role ?? ''}:${layer.presetId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(layer);
  }
  return out;
}

/** Look up MVP-9 table; null if unknown card. */
export function mapMvp9CardIdToPreset(cardId: string): string | null {
  const presetId = MVP9_CARD_PRESET_IDS[cardId];
  if (!presetId || !resolveEffectPreset(presetId)) return null;
  return presetId;
}

/**
 * Combinate slots → layers. Prefers MVP-9 table per filled card,
 * falls back to role heuristics. Primary preset = first layer.
 */
export function mapCombinateSlotsToPresetLayers(
  slots: BuildSlots,
  catalog: FormulaCatalogCard[],
): { layers: VfxPresetLayer[]; primaryPresetId: string } {
  const layers: VfxPresetLayer[] = [];
  for (const role of BUILD_SLOT_ORDER) {
    const cardId = slots[role];
    if (!cardId) continue;
    const card = findFormulaCard(catalog, cardId);
    const fromTable = mapMvp9CardIdToPreset(cardId);
    let presetId = fromTable;
    if (!presetId && card) {
      if (role === 'technik') presetId = 'trail';
      else if (role === 'essenz') {
        presetId = elementToPreset(card.element ?? undefined);
      } else {
        presetId = 'ambient';
      }
    }
    if (!presetId || !resolveEffectPreset(presetId)) continue;
    layers.push({ presetId, role });
  }
  const deduped = dedupeLayers(layers);
  return {
    layers: deduped,
    primaryPresetId: deduped[0]?.presetId ?? 'aura',
  };
}

/** All nine MVP card ids have a registered preset. */
export function listMvp9PresetCoverage(): { cardId: string; presetId: string }[] {
  return Object.entries(MVP9_CARD_PRESET_IDS).map(([cardId, presetId]) => ({
    cardId,
    presetId,
  }));
}
