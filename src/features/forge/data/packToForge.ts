/**
 * Forge adapter — pack presentation records as ForgeCardData.
 * Location: src/features/forge/data/packToForge.ts
 */
import type { ContentPack } from '../../../game/types';
import { BASE_PACK } from '../../../game/packs/base-pack';
import {
  mergePresentationOverlays,
  packToPresentationCards,
} from '../../../components/cards/packPresentation';
import type { ForgeCardData } from '../model/types';

export function packToForgeCards(pack: ContentPack = BASE_PACK): ForgeCardData[] {
  return packToPresentationCards(pack);
}

export function mergeForgeOverlays(
  packCards: ForgeCardData[],
  overlays: Partial<ForgeCardData>[],
): ForgeCardData[] {
  return mergePresentationOverlays(packCards, overlays);
}
