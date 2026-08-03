/**
 * V6 Construct (Konstrukt) board instance — spielkonzept §41–42.
 * Location: src/game/types/v6Construct.ts
 *
 * Not equipment, not a formula component. Max 1 per player.
 */

/** Active construct on a player's board (or null when empty). */
export interface ConstructInstance {
  instanceId: string;
  defId: string;
  /** Current durability; Startphase −1; challenge defense. */
  haltbarkeit: number;
  /** Parallel to formula disturbed — already disturbed → destroy on any positive margin. */
  disturbed: boolean;
}
