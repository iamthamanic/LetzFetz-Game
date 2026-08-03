/**
 * Merge Formula play deck opt-ins into a ContentPack (V5 overlay, no JSON commit).
 * Location: src/game/packs/mergeFormulaPlayOverlay.ts
 *
 * Base V5 pack already includes shipped Bausteine. Overlay adds studio-only ids
 * as minimal playable stubs so createGame can build deck instances.
 */
import type {
  CatalystCardDef,
  ContentPack,
  EssenceCardDef,
  TechniqueCardDef,
} from '../types';
import type { DeckOptInEntry, FormulaBausteinRole } from './formulaPlayOverlayTypes';

function packHasBaustein(pack: ContentPack, cardId: string, role: FormulaBausteinRole): boolean {
  switch (role) {
    case 'technik':
      return (pack.techniques ?? []).some((t) => t.id === cardId);
    case 'essenz':
      return (pack.essences ?? []).some((e) => e.id === cardId);
    case 'katalysator':
      return (pack.catalysts ?? []).some((c) => c.id === cardId);
    default: {
      const _exhaustive: never = role;
      return false;
    }
  }
}

function stubTechnique(entry: DeckOptInEntry): TechniqueCardDef {
  return {
    kind: 'technique',
    id: entry.cardId,
    name: entry.name,
    stability: 2,
    activationMode: 'prep_attack',
    effectText:
      'Studio-Baustein — Effekt wird in einer späteren Engine-Version angebunden.',
  };
}

function stubEssence(entry: DeckOptInEntry): EssenceCardDef {
  return {
    kind: 'essence',
    id: entry.cardId,
    name: entry.name,
    element: 'shadow',
    stability: 2,
    effectText:
      'Studio-Baustein — Effekt wird in einer späteren Engine-Version angebunden.',
  };
}

function stubCatalyst(entry: DeckOptInEntry): CatalystCardDef {
  return {
    kind: 'catalyst',
    id: entry.cardId,
    name: entry.name,
    stability: 2,
    effectText:
      'Studio-Baustein — Effekt wird in einer späteren Engine-Version angebunden.',
  };
}

function stubForRole(entry: DeckOptInEntry): TechniqueCardDef | EssenceCardDef | CatalystCardDef {
  switch (entry.role) {
    case 'technik':
      return stubTechnique(entry);
    case 'essenz':
      return stubEssence(entry);
    case 'katalysator':
      return stubCatalyst(entry);
    default: {
      const _exhaustive: never = entry.role;
      throw new Error(`Unhandled role: ${String(_exhaustive)}`);
    }
  }
}

/**
 * Return a copy of `basePack` with overlay-only Bausteine appended.
 * Entries whose ids already exist in the base pack are skipped (version pin only).
 */
export function mergeFormulaPlayOverlay(
  basePack: ContentPack,
  deckOptIns: DeckOptInEntry[],
): ContentPack {
  const techniques = [...(basePack.techniques ?? [])];
  const essences = [...(basePack.essences ?? [])];
  const catalysts = [...(basePack.catalysts ?? [])];

  for (const entry of deckOptIns) {
    if (packHasBaustein(basePack, entry.cardId, entry.role)) continue;
    const stub = stubForRole(entry);
    switch (entry.role) {
      case 'technik':
        if (!techniques.some((t) => t.id === entry.cardId)) {
          techniques.push(stub as TechniqueCardDef);
        }
        break;
      case 'essenz':
        if (!essences.some((e) => e.id === entry.cardId)) {
          essences.push(stub as EssenceCardDef);
        }
        break;
      case 'katalysator':
        if (!catalysts.some((c) => c.id === entry.cardId)) {
          catalysts.push(stub as CatalystCardDef);
        }
        break;
      default: {
        const _exhaustive: never = entry.role;
        void _exhaustive;
      }
    }
  }

  return {
    ...basePack,
    techniques,
    essences,
    catalysts,
  };
}

/** Count extra main-deck defs introduced by overlay (studio-only ids). */
export function countOverlayDeckExtras(
  basePack: ContentPack,
  deckOptIns: DeckOptInEntry[],
): number {
  let count = 0;
  for (const entry of deckOptIns) {
    if (!packHasBaustein(basePack, entry.cardId, entry.role)) count += 1;
  }
  return count;
}
