import type {
  ContentPack,
  ElementCardDef,
  EnginePartCardDef,
  GlitchCardDef,
  ItemCardDef,
} from '../types';

export function findElementDef(
  pack: ContentPack,
  defId: string,
): ElementCardDef | undefined {
  return pack.elementCards.find((e) => e.id === defId);
}

export function findEnginePartDef(
  pack: ContentPack,
  defId: string,
): EnginePartCardDef | undefined {
  return pack.engineParts?.find((p) => p.id === defId);
}

export function findGlitchDef(pack: ContentPack, defId: string): GlitchCardDef | undefined {
  return pack.glitches.find((g) => g.id === defId);
}

export function findItemDef(pack: ContentPack, defId: string): ItemCardDef | undefined {
  return pack.items?.find((i) => i.id === defId);
}
