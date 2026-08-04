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
  /** V5/V6 Gegenstand — action-timing (own turn) or reaction-timing (combat defender, V5 hand). */
  | {
      type: 'PLAY_ITEM';
      cardInstanceId: string;
      targetFormulaInstanceId?: string;
      /** V6: when equipment slots full, discard this equipped instance. */
      replaceEquipmentInstanceId?: string;
    }
  /**
   * V6: activate equipped Ausrüstung (Werkzeugkoffer / Rückspiegel / Gezinkter Würfel).
   * Combat: diceMod ±1 for Gezinkter; Rückspiegel ignores diceMod.
   */
  | {
      type: 'ACTIVATE_EQUIPMENT';
      equipmentInstanceId: string;
      discardHandInstanceId?: string;
      diceMod?: 1 | -1;
    }
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
  /** V5/V6 Formelphase: place Technik/Essenz/Katalysator into empty matching slot. */
  | {
      type: 'FORMULA_BUILD';
      cardInstanceId: string;
      /** V6: required for the 2nd Formeländerung this turn. */
      discardHandInstanceId?: string;
    }
  /** V5/V6 Formelphase: discard occupied slot component, place new same-slot-type from hand. */
  | {
      type: 'FORMULA_REPLACE';
      cardInstanceId: string;
      /** V6: required for the 2nd Formeländerung this turn. */
      discardHandInstanceId?: string;
    }
  /** V6 Formelphase: return a formula component to hand — ends Formelphase, no activate. */
  | { type: 'FORMULA_RETURN'; formulaInstanceId: string }
  /** V5/V6 Formelphase: activate upright components. V6 Überformel: optional bonus choice. */
  | { type: 'FORMULA_ACTIVATE'; overformulaBonusChoice?: 'primary' | 'intensity' }
  /** V5 Formelphase: discard formula card from hand for one-shot (stub effect until #221). */
  | { type: 'FORMULA_SCHNELLMIX'; cardInstanceId: string }
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
    }
  | {
      type: 'PICK_PILLENDOKTORA';
      option: 'draw-lose-hp' | 'deal-1' | 'heal-1';
    }
  | {
      type: 'PICK_MYSTERIUM_ELEMENT';
      element: import('./elements').Element;
    }
  | {
      /** V6 Affinity after W6: skip or spend ±1. */
      type: 'PICK_V6_AFFINITY';
      mode: 'none' | 'value-plus' | 'dice-plus' | 'dice-minus';
    }
  | {
      /** V6 Schattenbasar: pay 1 life to destroy disturbed formula component. */
      type: 'PICK_V6_BASAR_DESTROY';
      pay: boolean;
    }
  | {
      /** V6 Fessel: pick occupied opponent formula slot. */
      type: 'PICK_V6_FESSEL_TARGET';
      slot: import('./cards').FormulaSlot;
    }
  | {
      /** V6 Passive-Skill Scry: keep order, put first under, or swap top two. */
      type: 'PICK_V6_PASSIVE_SKILL_SCRY';
      mode: 'keep' | 'bottom' | 'swap';
    };

export interface ActionContext {
  playerId: PlayerId;
}
