import type { PlayerId } from './ruleset';

/** Player intents — engine validates before applying. */
export type GameAction =
  | { type: 'ADVANCE_PHASE' }
  | { type: 'PLAY_ATTACK'; cardInstanceId: string; diceRoll?: number }
  | {
      type: 'CHALLENGE';
      attackCardInstanceId: string;
      targetBoundInstanceId: string;
      diceRoll?: number;
    }
  | { type: 'PLAY_BLOCK'; cardInstanceId: string; diceRoll?: number }
  | { type: 'PASS_BLOCK' }
  | { type: 'PLAY_BOOST'; cardInstanceId: string }
  | { type: 'PLAY_ULTIMATE' }
  | { type: 'DISCARD_DRAW'; discardInstanceId: string }
  | {
      type: 'ACTIVATE_BOUND';
      boundInstanceId: string;
      /** V1/V2 / legacy: discard a hand card to pay activation. Optional under V3 pool activate. */
      discardHandInstanceId?: string;
      targetBoundId?: string;
    }
  | { type: 'BUILD_CARD'; cardInstanceId: string; discardBoundId?: string }
  | { type: 'SKIP_BUILD' }
  | { type: 'END_TURN' }
  /** Playable glitch (own turn main action, or reaction when pendingChoice allows). */
  | {
      type: 'PLAY_GLITCH';
      glitchInstanceId: string;
      /** Kurzschluss / Systemfehler / Illegaler Download / Basar exhaust target. */
      targetBoundInstanceId?: string;
      /** Illegaler Download cost. */
      discardHandInstanceId?: string;
    }
  | { type: 'PASS_PENDING' }
  /** @deprecated Prefer auto must-discard; kept for legacy pending / TAKE_OPTIONAL_DRAW. */
  | { type: 'TAKE_OPTIONAL_DRAW' }
  | { type: 'RESOLVE_DRAW_DISCARD'; discardInstanceId: string }
  /** Club 3–4: take bound to hand then build another (not normal build). */
  | {
      type: 'CLUB_SWAP';
      returnBoundInstanceId: string;
      buildHandInstanceId: string;
      discardBoundId?: string;
    }
  /** Basar 3–4: discard 1 to exhaust opponent bound (not main action). */
  | {
      type: 'BASAR_EXHAUST';
      discardHandInstanceId: string;
      targetBoundInstanceId: string;
    }
  | {
      type: 'PICK_REACTION';
      reactionId: string;
    };

export interface ActionContext {
  playerId: PlayerId;
}
