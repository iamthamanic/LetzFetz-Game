/**
 * V5 Formelplatz helpers — map card defs to FormulaSlot.
 * Location: src/game/engine/formulaSlots.ts
 */
import type {
  CatalystCardDef,
  ContentPack,
  EssenceCardDef,
  FormulaSlot,
  TechniqueCardDef,
} from '../types';

export type FormulaComponentDef = TechniqueCardDef | EssenceCardDef | CatalystCardDef;

export function findTechniqueDef(
  pack: ContentPack,
  defId: string,
): TechniqueCardDef | undefined {
  return pack.techniques?.find((t) => t.id === defId);
}

export function findEssenceDef(pack: ContentPack, defId: string): EssenceCardDef | undefined {
  return pack.essences?.find((e) => e.id === defId);
}

export function findCatalystDef(
  pack: ContentPack,
  defId: string,
): CatalystCardDef | undefined {
  return pack.catalysts?.find((c) => c.id === defId);
}

/** Resolve a hand/board formula component def, or undefined if not a formula card. */
export function findFormulaComponentDef(
  pack: ContentPack,
  defId: string,
): FormulaComponentDef | undefined {
  return (
    findTechniqueDef(pack, defId) ??
    findEssenceDef(pack, defId) ??
    findCatalystDef(pack, defId)
  );
}

/** Card kind → Formelplatz. */
export function formulaSlotForDef(
  pack: ContentPack,
  defId: string,
): FormulaSlot | undefined {
  const def = findFormulaComponentDef(pack, defId);
  if (!def) return undefined;
  switch (def.kind) {
    case 'technique':
      return 'technik';
    case 'essence':
      return 'essenz';
    case 'catalyst':
      return 'katalysator';
  }
}
