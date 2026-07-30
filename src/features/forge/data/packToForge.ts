/**
 * Forge adapter — pack presentation records as ForgeCardData.
 * Location: src/features/forge/data/packToForge.ts
 */
import type { ContentPack } from '../../../game/types';
import { BASE_PACK } from '../../../game/packs/base-pack';
import { V5_PACK } from '../../../game/packs/v5';
import {
  mergePresentationOverlays,
  packToPresentationCards,
} from '../../../components/cards/packPresentation';
import { readVfxRegistryTechniqueSummaries } from '../../../services/storage/vfxRegistryBridge';
import type { ForgeCardData } from '../model/types';

function studioTechniquesToForgeCards(): ForgeCardData[] {
  return readVfxRegistryTechniqueSummaries().map((entry) => ({
    id: entry.id,
    name: entry.name,
    type: 'Formula',
    element: 'Neutral',
    stats_json: { resistance: 1 },
    effects: [
      'Rolle: Technik',
      'Quelle: VFX Studio',
      `Status: ${entry.status}`,
      entry.modelId ? `Modell: ${entry.modelId}` : 'Modell: —',
    ],
    image_asset: '',
    fromPack: false,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt,
  }));
}

/** Base pack + V5 Formelkomponenten when the pack has no formula defs of its own. */
function packWithFormulaComponents(pack: ContentPack): ContentPack {
  const hasFormula =
    (pack.techniques?.length ?? 0) > 0 ||
    (pack.essences?.length ?? 0) > 0 ||
    (pack.catalysts?.length ?? 0) > 0;
  if (hasFormula) return pack;
  return {
    ...pack,
    techniques: V5_PACK.techniques,
    essences: V5_PACK.essences,
    catalysts: V5_PACK.catalysts,
  };
}

export function packToForgeCards(pack: ContentPack = BASE_PACK): ForgeCardData[] {
  return [
    ...packToPresentationCards(packWithFormulaComponents(pack)),
    ...studioTechniquesToForgeCards(),
  ];
}

export function mergeForgeOverlays(
  packCards: ForgeCardData[],
  overlays: Partial<ForgeCardData>[],
): ForgeCardData[] {
  return mergePresentationOverlays(packCards, overlays);
}
