/**
 * Resolve hand/draw card defs in priority order for BoardCard presentation.
 * Location: src/features/play/board/resolveHandCardDefs.ts
 *
 * Order: element → item → formula → glitch (never treat items/formula as glitch).
 */
import {
  findElementDef,
  findFormulaComponentDef,
  findGlitchDef,
  findItemDef,
  type ContentPack,
  type ElementCardDef,
  type FormulaComponentDef,
  type GlitchCardDef,
  type ItemCardDef,
} from '../../../game';

interface ResolvedHandCardDefs {
  elementDef: ElementCardDef | null;
  itemDef: ItemCardDef | null;
  formulaDef: FormulaComponentDef | null;
  glitchDef: GlitchCardDef | null;
  displayName: string | null;
}

export function resolveHandCardDefs(pack: ContentPack, defId: string): ResolvedHandCardDefs {
  const elementDef = findElementDef(pack, defId) ?? null;
  if (elementDef) {
    return {
      elementDef,
      itemDef: null,
      formulaDef: null,
      glitchDef: null,
      displayName: elementDef.name,
    };
  }

  const itemDef = findItemDef(pack, defId) ?? null;
  if (itemDef) {
    return {
      elementDef: null,
      itemDef,
      formulaDef: null,
      glitchDef: null,
      displayName: itemDef.name,
    };
  }

  const formulaDef = findFormulaComponentDef(pack, defId) ?? null;
  if (formulaDef) {
    return {
      elementDef: null,
      itemDef: null,
      formulaDef,
      glitchDef: null,
      displayName: formulaDef.name,
    };
  }

  const glitchDef = findGlitchDef(pack, defId) ?? null;
  return {
    elementDef: null,
    itemDef: null,
    formulaDef: null,
    glitchDef,
    displayName: glitchDef?.name ?? null,
  };
}

const FORMULA_ROLE_DE: Record<FormulaComponentDef['kind'], string> = {
  technique: 'Technik',
  essence: 'Essenz',
  catalyst: 'Katalysator',
};

export function formulaRoleDe(def: FormulaComponentDef): string {
  return FORMULA_ROLE_DE[def.kind];
}
