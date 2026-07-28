/**
 * Canonical 36 V3 Fetzgerät part ids (6 elements × 3 slots × 2 variants).
 * Location: src/game/packs/v3/engineParts36.ts
 *
 * Asset registry / GLB generator derive from this list — no parallel hardcode.
 */
import type { Element, FetzgeraetSlot } from '../../types';

export interface V3EnginePartRef {
  id: string;
  name: string;
  slot: FetzgeraetSlot;
  element: Element;
  /** Variant index 1..2 → id suffix 01 / 02. */
  variant: 1 | 2;
}

const ELEMENTS: readonly Element[] = [
  'fire',
  'water',
  'earth',
  'air',
  'shadow',
  'light',
] as const;

const SLOTS: readonly FetzgeraetSlot[] = ['traeger', 'antrieb', 'aufsatz'] as const;

const ELEMENT_LABELS: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

const SLOT_LABELS: Record<FetzgeraetSlot, string> = {
  traeger: 'Träger',
  antrieb: 'Antrieb',
  aufsatz: 'Aufsatz',
};

const VARIANTS = [1, 2] as const;

function buildParts(): readonly V3EnginePartRef[] {
  const parts: V3EnginePartRef[] = [];
  for (const variant of VARIANTS) {
    const suffix = String(variant).padStart(2, '0');
    for (const element of ELEMENTS) {
      for (const slot of SLOTS) {
        parts.push({
          id: `v3-part-${element}-${slot}-${suffix}`,
          name: `${ELEMENT_LABELS[element]}-${SLOT_LABELS[slot]} ${suffix}`,
          slot,
          element,
          variant,
        });
      }
    }
  }
  return parts;
}

/** All 36 authored V3 engine part refs (stable cartesian order). */
export const V3_ENGINE_PARTS_36: readonly V3EnginePartRef[] = buildParts();

/** Quick id → ref lookup. */
export const V3_ENGINE_PARTS_36_BY_ID: ReadonlyMap<string, V3EnginePartRef> = new Map(
  V3_ENGINE_PARTS_36.map((p) => [p.id, p]),
);

export function listV3EnginePartIds(): readonly string[] {
  return V3_ENGINE_PARTS_36.map((p) => p.id);
}
