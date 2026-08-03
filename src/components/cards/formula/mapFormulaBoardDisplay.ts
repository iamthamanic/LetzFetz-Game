/**
 * Map engine FormulaBoard + pack → rack display models.
 * Location: src/components/cards/formula/mapFormulaBoardDisplay.ts
 */
import type {
  ContentPack,
  FormulaBoard,
  FormulaComponentInstance,
  CardInstance,
} from '../../../game/types';
import {
  findFormulaComponentDef,
  type FormulaComponentDef,
} from '../../../game/engine/formulaSlots';
import { findItemDef } from '../../../game/engine/lookup';
import { findFormulaCombinationBySlots } from '../../../game/packs/v5/formulaCombinations';
import { resolveCardArtPath } from '../../../services/cardArt/manifest';
import type {
  EquipmentDisplayCard,
  FormulaDisplayCard,
  FormulaSlotOccupant,
} from './formulaDisplayCard';
import {
  FORMULA_SLOT_ORDER,
  type FormulaSlotRole,
} from './formulaSlotMeta';

const KIND_TO_ROLE: Record<FormulaComponentDef['kind'], FormulaSlotRole> = {
  technique: 'technik',
  essence: 'essenz',
  catalyst: 'katalysator',
};

/** Map a Formelkomponente pack def → shared display card (hand preview / rack). */
export function formulaDefToDisplayCard(def: FormulaComponentDef): FormulaDisplayCard {
  const role = KIND_TO_ROLE[def.kind];
  return {
    id: def.id,
    name: def.name,
    role,
    imageUrl: resolveCardArtPath(def.id),
    element: def.kind === 'essence' ? def.element : null,
    stability: def.stability,
    effectText: def.effectText,
    activationMode: def.kind === 'technique' ? def.activationMode : null,
  };
}

function occupantFromInstance(
  pack: ContentPack,
  role: FormulaSlotRole,
  comp: FormulaComponentInstance | null,
): FormulaSlotOccupant | null {
  if (!comp) return null;
  const def = findFormulaComponentDef(pack, comp.defId);
  if (!def) return null;

  return {
    instanceId: comp.instanceId,
    card: { ...formulaDefToDisplayCard(def), role },
    exhausted: Boolean(comp.exhausted),
    disturbed: Boolean(comp.disturbed),
    elementalCharge: Boolean(comp.elementalCharge),
    fesselIntensity:
      typeof comp.fesselIntensity === 'number' && comp.fesselIntensity > 0
        ? comp.fesselIntensity
        : undefined,
  };
}

/** Build slot occupants for the rack from engine formula board. */
export function mapFormulaSlotsForDisplay(
  pack: ContentPack,
  formula: FormulaBoard,
): Record<FormulaSlotRole, FormulaSlotOccupant | null> {
  return {
    technik: occupantFromInstance(pack, 'technik', formula.technik),
    essenz: occupantFromInstance(pack, 'essenz', formula.essenz),
    katalysator: occupantFromInstance(pack, 'katalysator', formula.katalysator),
  };
}

/** Equipment cards face-up on the public board. */
export function mapEquipmentForDisplay(
  pack: ContentPack,
  equipment: CardInstance[] | null | undefined,
): EquipmentDisplayCard[] {
  return (equipment ?? []).map((eq) => {
    const item = findItemDef(pack, eq.defId);
    return {
      id: eq.defId,
      instanceId: eq.instanceId,
      name: item?.name ?? eq.defId,
      imageUrl: resolveCardArtPath(eq.defId),
      effectText: item?.effectText ?? '',
    };
  });
}

/**
 * Catalog combination for all currently filled slots (default Play preview).
 * Activate may later choose a subset — preview still shows full board fill.
 */
export function findComboForFilledSlots(
  slots: Record<FormulaSlotRole, FormulaSlotOccupant | null>,
) {
  const filled = FORMULA_SLOT_ORDER.filter((role) => slots[role] != null).length;
  if (filled < 2) return null;
  return findFormulaCombinationBySlots({
    techniqueName: slots.technik?.card.name ?? null,
    essenceName: slots.essenz?.card.name ?? null,
    catalystName: slots.katalysator?.card.name ?? null,
  });
}
