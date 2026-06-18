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
      discardHandInstanceId: string;
      targetBoundId?: string;
    }
  | { type: 'BIND_CARD'; cardInstanceId: string; discardBoundId?: string }
  | { type: 'SKIP_BIND' }
  | { type: 'END_TURN' };

export interface ActionContext {
  playerId: PlayerId;
}
