import type { BoundCardInstance, CardInstance } from './cards';
import type { MatchMeta, PendingChoice } from './matchMeta';
import type { PlayerId, TurnPhase } from './ruleset';

export interface PlayerState {
  characterId: string;
  hp: number;
  hand: CardInstance[];
  bound: BoundCardInstance[];
  ultimateAvailable: boolean;
  /** Stiernackenkommando Ulti: next attack damage doubled. */
  doubleNextAttack: boolean;
  notes: string;
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
  /** Set when mode === 'challenge'. */
  targetBoundInstanceId?: string;
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

export interface GameState {
  players: Record<PlayerId, PlayerState>;
  piles: SharedPiles;
  arena: ArenaState;
  activePlayer: PlayerId;
  phase: TurnPhase;
  turnNumber: number;
  winner: PlayerId | null;
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
