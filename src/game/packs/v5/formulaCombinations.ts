/**
 * V5 Formel-Kombinationskatalog (744) — lookup by Technik/Essenz/Katalysator names.
 * Location: src/game/packs/v5/formulaCombinations.ts
 */
import catalogJson from './formulaCombinations.catalog.json';

export type FormulaCombinationType =
  | 'technique_essence'
  | 'technique_catalyst'
  | 'essence_catalyst'
  | 'technique_essence_catalyst'

export interface FormulaCombinationComponentRef {
  id: string;
  name: string;
}

export interface FormulaCombinationEntry {
  id: string;
  type: FormulaCombinationType;
  name: string;
  slug: string;
  technique: FormulaCombinationComponentRef | null;
  essence: FormulaCombinationComponentRef | null;
  catalyst: FormulaCombinationComponentRef | null;
  effect: string;
  componentEffects: {
    technique: string | null;
    essence: string | null;
    catalyst: string | null;
  };
  role: string;
  primaryValue: string;
  status: string;
}

interface FormulaCombinationCatalogFile {
  schemaVersion: string;
  catalogVersion: string;
  combinations: FormulaCombinationEntry[];
}

const catalog = catalogJson as FormulaCombinationCatalogFile;

/** JSON → Pack name aliases (legacy spellings). */
export const FORMULA_COMPONENT_NAME_ALIASES: Readonly<Record<string, string>> = {
  Fintenschritt: 'Fintenschnitt',
  Überschallangriff: 'Überraschungsangriff',
  Schicksalsmanifestation: 'Schicksalmanifestation',
  Überladung: 'Überspannung',
  Doppelecho: 'Echo',
};

export function canonicalizeFormulaComponentName(name: string | null | undefined): string | null {
  if (!name) return null;
  const trimmed = name.trim();
  if (!trimmed) return null;
  return FORMULA_COMPONENT_NAME_ALIASES[trimmed] ?? trimmed;
}

function comboKey(
  technique: string | null,
  essence: string | null,
  catalyst: string | null,
): string {
  return [
    canonicalizeFormulaComponentName(technique) ?? '',
    canonicalizeFormulaComponentName(essence) ?? '',
    canonicalizeFormulaComponentName(catalyst) ?? '',
  ].join('|');
}

const bySlots = new Map<string, FormulaCombinationEntry>();
for (const entry of catalog.combinations) {
  bySlots.set(
    comboKey(
      entry.technique?.name ?? null,
      entry.essence?.name ?? null,
      entry.catalyst?.name ?? null,
    ),
    entry,
  );
}

export function listFormulaCombinations(): readonly FormulaCombinationEntry[] {
  return catalog.combinations;
}

export function getFormulaCombinationCatalogVersion(): string {
  return catalog.catalogVersion;
}

/** Lookup combination for filled Formelplätze (names as shown on cards). */
export function findFormulaCombinationBySlots(input: {
  techniqueName?: string | null;
  essenceName?: string | null;
  catalystName?: string | null;
}): FormulaCombinationEntry | null {
  const key = comboKey(
    input.techniqueName ?? null,
    input.essenceName ?? null,
    input.catalystName ?? null,
  );
  if (key === '||') return null;
  return bySlots.get(key) ?? null;
}
