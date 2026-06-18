/**
 * Card Forge authoring model — UI layer over V1 pack definitions.
 * Location: src/services/cardForge/types.ts
 */
import type { ForgeCardKind } from './categories';

export type ForgeElement =
  | 'Fire'
  | 'Water'
  | 'Earth'
  | 'Air'
  | 'Light'
  | 'Shadow'
  | 'Neutral'
  | 'Frei';

export interface ForgeCardData {
  id: string;
  name: string;
  type: ForgeCardKind;
  /** Primary element — card styling (gradient/border). */
  element: ForgeElement;
  /** Both elements for characters (rulebook §3.1). */
  elements?: [ForgeElement, ForgeElement];
  /** German display label, e.g. "Erde / Feuer". */
  elementDisplay?: string;
  stats_json: {
    hp?: number;
    value?: number;
    cardType?: 'attack' | 'block' | 'boost';
    resistance?: number;
  };
  effects: string[];
  image_asset: string;
  notes?: string;
  /** True for pack cards from base-pack.ts (stable ids). */
  fromPack?: boolean;
  created_at?: string;
  updated_at?: string;
}
