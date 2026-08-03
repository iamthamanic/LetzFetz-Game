/**
 * Neutral Formel-/Gegenstand display models for rack + detail modal.
 * Location: src/components/cards/formula/formulaDisplayCard.ts
 */
import type { Element } from '../../../game/types/elements';
import type { FormulaSlotRole } from './formulaSlotMeta';

/** Shared Formel-Baustein presentation (Build catalog + Play board). */
export interface FormulaDisplayCard {
  id: string;
  name: string;
  role: FormulaSlotRole;
  imageUrl: string;
  /** Set for Essenz cards; null for Technik/Katalysator. */
  element: Element | null;
  stability: number;
  effectText: string;
  /** Technik activation mode key; null for Essenz/Katalysator. */
  activationMode: string | null;
}

/** Board equipment (Gegenstand) presentation. */
export interface EquipmentDisplayCard {
  id: string;
  instanceId: string;
  name: string;
  imageUrl: string;
  effectText: string;
}

export interface FormulaSlotOccupant {
  instanceId: string;
  card: FormulaDisplayCard;
  exhausted: boolean;
  disturbed: boolean;
  /** V5 Elementarladung on Essenz (public board). */
  elementalCharge?: boolean;
}
