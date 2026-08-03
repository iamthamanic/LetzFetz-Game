import type { BoundCardInstance, CardInstance, FormulaComponentInstance } from './cards';
import type { Element } from './elements';
import type { FormulaPrepState } from './formulaEffects';
import type {
  MatchMeta,
  MonoBonusMode,
  PendingChoice,
  PlaytestHpCap,
} from './matchMeta';
import type { PlayerId, TurnPhase } from './ruleset';
import type { StatusInstance } from './status';

export interface PlaytestSettings {
  hpCap?: PlaytestHpCap;
  monoBonusMode?: MonoBonusMode;
}

/** V5 Formelboard — at most one component per slot. */
export interface FormulaBoard {
  technik: FormulaComponentInstance | null;
  essenz: FormulaComponentInstance | null;
  katalysator: FormulaComponentInstance | null;
}

export interface PlayerState {
  characterId: string;
  hp: number;
  hand: CardInstance[];
  bound: BoundCardInstance[];
  /** V5 Formelplätze; empty/null slots when unused. */
  formula: FormulaBoard;
  /** V5 pending prep from Formelaktivierung (null when none). */
  formulaPrep: FormulaPrepState | null;
  ultimateAvailable: boolean;
  /** Stiernackenkommando Ulti: next attack damage doubled. */
  doubleNextAttack: boolean;
  notes: string;
  /** V3 status marks / buffs / debuffs (empty under V1-only play). */
  statuses: StatusInstance[];
  /** V3 shield (max 5); unused when v3Combat is off. */
  shield: number;
  /** Shared charge pool: V3 max 6, V5 Fetzladung max 3. */
  fetzCharge: number;
}

export interface SharedPiles {
  deck: CardInstance[];
  discard: CardInstance[];
}

export interface ArenaState {
  arenaId: string;
  /** 0, 1, or 2 for d6-split arenas; null if not applicable. */
  d6Variant: number | null;
}

/** Attack played — defender must block or pass. */
export interface PendingCombat {
  attackerId: PlayerId;
  defenderId: PlayerId;
  attackCardDefId: string;
  attackRoll: number;
  attackValue: number;
  mode: 'player' | 'challenge';
  /** Set when mode === 'challenge' — bound instanceId or V5 formula component instanceId. */
  targetBoundInstanceId?: string;
  /** V5 Formel prep: shield points ignored on damage pipeline. */
  ignoreShield?: number;
  /** V5 Nasser Socken: additional hit impulse element. */
  extraHitImpulse?: Element;
  /** V5 Kaputter Rückspiegel: on Vollblock apply Verstrahlt to attacker. */
  rueckspiegelArmed?: boolean;
}

/** Sofort-Glitch drawn this action — UI shows face-up in center for both players. */
export interface InstantReveal {
  playerId: PlayerId;
  instanceId: string;
  defId: string;
  name: string;
  effectText: string;
  /** What the glitch did (German log line). */
  resolution: string;
}

/** Seat winner, timed equal-LP draw, or null while the match is open. */
export type MatchWinner = PlayerId | 'draw';

export interface GameState {
  players: Record<PlayerId, PlayerState>;
  piles: SharedPiles;
  arena: ArenaState;
  activePlayer: PlayerId;
  phase: TurnPhase;
  turnNumber: number;
  winner: MatchWinner | null;
  /** When set, defender must PLAY_BLOCK or PASS_BLOCK. */
  combat: PendingCombat | null;
  /** Interrupt / optional choice window (arena & glitch). */
  pendingChoice: PendingChoice | null;
  /** Match-level V1 flags (arenas, timed glitch effects). */
  meta: MatchMeta;
  /** Last combat log line for UI. */
  lastEvent: string | null;
  /**
   * Sofort-Glitches resolved during the latest applyAction (cleared at action start).
   * Presentation + chat must surface these — never silent.
   */
  instantReveals: InstantReveal[];
}
