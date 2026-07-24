/**
 * Build typed Sandbox display content from BASE_PACK + local Forge overlays.
 * Location: src/features/sandbox/data/loadSandboxContent.ts
 *
 * No network. Overlay ids unknown to the pack are ignored.
 */
import { BASE_PACK } from '../../../game/packs/base-pack';
import type { ContentPack } from '../../../game/types';
import {
  mergePresentationOverlays,
  packToPresentationCards,
} from '../../../components/cards/packPresentation';
import {
  loadCardOverlays,
  type CardOverlayEntry,
} from '../../../services/storage/cardOverlays';
import type { SandboxArena, SandboxCard, SandboxContent } from '../model/sandboxTypes';

export interface LoadSandboxContentOptions {
  pack?: ContentPack;
  /** When omitted, reads validated overlays from localStorage. */
  overlays?: CardOverlayEntry[];
}

function toSandboxCard(card: {
  id: string;
  name: string;
  type: string;
  element: string;
  image_asset: string;
  notes?: string;
  effects: string[];
  fromPack?: boolean;
}): SandboxCard {
  return {
    id: card.id,
    name: card.name,
    kind: card.type,
    element: card.element,
    imageAsset: card.image_asset,
    notes: card.notes ?? '',
    effects: card.effects ?? [],
    fromPack: card.fromPack === true,
  };
}

function arenasFromPack(pack: ContentPack): SandboxArena[] {
  return pack.arenas.map((arena) => ({
    id: arena.id,
    name: arena.name,
    role: arena.role,
    baseEffect: arena.baseEffect,
    trigger: arena.trigger,
    specialRule: arena.specialRule,
    ...(arena.d6Variants ? { d6Variants: arena.d6Variants } : {}),
  }));
}

/**
 * Merge pack cards with overlay presentation fields for known pack ids only.
 */
export function loadSandboxContent(
  options: LoadSandboxContentOptions = {},
): SandboxContent {
  const pack = options.pack ?? BASE_PACK;
  const packCards = packToPresentationCards(pack);
  const knownIds = new Set(packCards.map((c) => c.id));

  const overlays = (options.overlays ?? loadCardOverlays()).filter((entry) =>
    knownIds.has(entry.id),
  );

  const merged = mergePresentationOverlays(packCards, overlays);
  return {
    cards: merged.map(toSandboxCard),
    arenas: arenasFromPack(pack),
  };
}
