/**
 * V3 Area51 blueprint definitions (§16 seed).
 * Location: src/game/types/blueprint.ts
 */
import type { Element } from './elements';
import type { FetzgeraetSlot } from './cards';

/** Pack-authored blueprint combo → combat hook flags. */
export interface BlueprintDef {
  id: string;
  name: string;
  /** German flavor text. */
  effectText: string;
  /** All listed roles must be built (any element). */
  requiredRoles?: FetzgeraetSlot[];
  /** At least N parts of the same element. */
  sameElementCount?: number;
  /** Required element when sameElementCount is set. */
  element?: Element;
  hooks: {
    dampfBecomesDichterNebel?: boolean;
    preserveFirstConsumedMark?: boolean;
    doubleReaction?: boolean;
  };
}
