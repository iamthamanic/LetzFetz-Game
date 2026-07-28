/**
 * Forge adapter — pack presentation records as ForgeCardData.
 * Location: src/features/forge/data/packToForge.ts
 */
import type { ContentPack } from '../../../game/types';
import { BASE_PACK } from '../../../game/packs/base-pack';
import { V3_PACK } from '../../../game/packs/v3';
import {
  mergePresentationOverlays,
  packToPresentationCards,
} from '../../../components/cards/packPresentation';
import type { ForgeCardData } from '../model/types';

/** Base pack + V3 Fetzgerät parts when the pack has no engineParts of its own. */
function packWithEngineParts(pack: ContentPack): ContentPack {
  if (pack.engineParts && pack.engineParts.length > 0) return pack;
  return {
    ...pack,
    engineParts: V3_PACK.engineParts,
  };
}

export function packToForgeCards(pack: ContentPack = BASE_PACK): ForgeCardData[] {
  return packToPresentationCards(packWithEngineParts(pack));
}

export function mergeForgeOverlays(
  packCards: ForgeCardData[],
  overlays: Partial<ForgeCardData>[],
): ForgeCardData[] {
  return mergePresentationOverlays(packCards, overlays);
}
