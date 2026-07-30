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
import { readVfxRegistryFormulaRecipeSummaries, readVfxRegistryTechniqueSummaries } from '../../../services/storage/vfxRegistryBridge';
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

function combinateRecipesToForgeCards(): ForgeCardData[] {
  return readVfxRegistryFormulaRecipeSummaries().map((entry) => {
    const slotLines = [
      entry.techniqueId ? `Technik: ${entry.techniqueId}` : null,
      entry.essenceId ? `Essenz: ${entry.essenceId}` : null,
      entry.catalystId ? `Katalysator: ${entry.catalystId}` : null,
    ].filter((line): line is string => line != null);

    return {
      id: entry.id,
      name: entry.name,
      type: 'Formula',
      element: 'Neutral',
      stats_json: { resistance: 1 },
      effects: [
        'Rolle: Kombination',
        'Quelle: Combinate',
        `Status: ${entry.status}`,
        ...slotLines,
      ],
      image_asset: entry.heroFrameUrl ?? '',
      fromPack: false,
      created_at: entry.createdAt,
      updated_at: entry.updatedAt,
    };
  });
}

/** Base pack + V5 Formelkomponenten / Gegenstände when the pack has none of its own. */
function packWithFormulaComponents(pack: ContentPack): ContentPack {
  const hasFormula =
    (pack.techniques?.length ?? 0) > 0 ||
    (pack.essences?.length ?? 0) > 0 ||
    (pack.catalysts?.length ?? 0) > 0;
  const hasItems = (pack.items?.length ?? 0) > 0;
  if (hasFormula && hasItems) return pack;
  return {
    ...pack,
    techniques: hasFormula ? pack.techniques : V5_PACK.techniques,
    essences: hasFormula ? pack.essences : V5_PACK.essences,
    catalysts: hasFormula ? pack.catalysts : V5_PACK.catalysts,
    items: hasItems ? pack.items : V5_PACK.items,
  };
}

export function packToForgeCards(pack: ContentPack = BASE_PACK): ForgeCardData[] {
  return [
    ...packToPresentationCards(packWithFormulaComponents(pack)),
    ...studioTechniquesToForgeCards(),
    ...combinateRecipesToForgeCards(),
  ];
}

export function mergeForgeOverlays(
  packCards: ForgeCardData[],
  overlays: Partial<ForgeCardData>[],
): ForgeCardData[] {
  return mergePresentationOverlays(packCards, overlays);
}
