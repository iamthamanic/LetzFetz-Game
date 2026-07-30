/**
 * V5 Formel-Bausteine catalog for Build → Combinate.
 * Location: src/features/build/data/formulaCardCatalog.ts
 */
import { V5_PACK } from '../../../game/packs/v5';
import { formulaSlotForDef } from '../../../game/engine/formulaSlots';
import { resolveCardArtPath } from '../../../services/cardArt/manifest';
import type { FormulaCatalogCard } from '../model/combinateFormula';
import { BUILD_SLOT_LABEL_DE, type BuildSlotRole } from '../model/buildTypes';

let cachedCatalog: FormulaCatalogCard[] | null = null;

function roleLabel(role: BuildSlotRole): string {
  return BUILD_SLOT_LABEL_DE[role];
}

function cardFromDef(
  id: string,
  name: string,
  role: BuildSlotRole,
  stability: number,
  effectText: string,
  element: FormulaCatalogCard['element'],
  activationMode: string | null = null,
): FormulaCatalogCard {
  return {
    id,
    name,
    role,
    imageUrl: resolveCardArtPath(id),
    element,
    stability,
    effectText,
    activationMode,
  };
}

/** All V5 formula Bausteine (12 Technik + 12 Essenz + 12 Katalysator), sorted by role then name. */
export function loadFormulaCardCatalog(): FormulaCatalogCard[] {
  if (cachedCatalog) return cachedCatalog;

  const cards: FormulaCatalogCard[] = [];

  for (const t of V5_PACK.techniques ?? []) {
    const role = formulaSlotForDef(V5_PACK, t.id);
    if (role !== 'technik') continue;
    cards.push(
      cardFromDef(t.id, t.name, 'technik', t.stability, t.effectText, null, t.activationMode),
    );
  }

  for (const e of V5_PACK.essences ?? []) {
    const role = formulaSlotForDef(V5_PACK, e.id);
    if (role !== 'essenz') continue;
    cards.push(
      cardFromDef(e.id, e.name, 'essenz', e.stability, e.effectText, e.element),
    );
  }

  for (const c of V5_PACK.catalysts ?? []) {
    const role = formulaSlotForDef(V5_PACK, c.id);
    if (role !== 'katalysator') continue;
    cards.push(
      cardFromDef(c.id, c.name, 'katalysator', c.stability, c.effectText, null),
    );
  }

  const roleOrder: Record<BuildSlotRole, number> = {
    technik: 0,
    essenz: 1,
    katalysator: 2,
  };

  cachedCatalog = cards.sort((a, b) => {
    const byRole = roleOrder[a.role] - roleOrder[b.role];
    if (byRole !== 0) return byRole;
    return a.name.localeCompare(b.name, 'de');
  });

  return cachedCatalog;
}

/** Reset module cache — tests only. */
export function resetFormulaCardCatalogCache(): void {
  cachedCatalog = null;
}

export function formulaCatalogRoleLabel(card: FormulaCatalogCard): string {
  return roleLabel(card.role);
}
