import type { ContentPack, ElementCardDef, GlitchCardDef } from '../types';

export function findElementDef(
  pack: ContentPack,
  defId: string,
): ElementCardDef | undefined {
  return pack.elementCards.find((e) => e.id === defId);
}

export function findGlitchDef(pack: ContentPack, defId: string): GlitchCardDef | undefined {
  return pack.glitches.find((g) => g.id === defId);
}
