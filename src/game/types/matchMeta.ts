import type { PlayerId } from './ruleset';
import type { Element } from './elements';
import type { PrimaryMarkId } from './status';

/** Playtest LP caps (D35 / O11). Cap = start; heals clamp here. */
export type PlaytestHpCap = 20 | 25 | 30;

/** Playtest mono bonus modes (D32 / D35). Engine applies after V2 release. */
export type MonoBonusMode = 'mb1' | 'mb2' | 'mb3' | 'mb4';

/** Per-match counters / arena variant flags (V1). */
export interface MatchMeta {
  boostsPlayed: Record<PlayerId, number>;
  /** Späti: mandatory draw/discard already used this turn by player. */
  spaetiFilterUsed: Record<PlayerId, boolean>;
  /** Kristall: first heal bonus used this turn. */
  kristallHealUsed: Record<PlayerId, boolean>;
  /** Vulkan: first attack roll bonus used this turn. */
  vulkanAttackBonusUsed: Record<PlayerId, boolean>;
  /** Sumpf: first block roll bonus used while defending this turn. */
  sumpfBlockBonusUsed: Record<PlayerId, boolean>;
  /** True if active player attacked or challenged this turn (Vulkan trigger). */
  didAttackOrChallengeThisTurn: boolean;
  /** Schlechter Empfang: player cannot draw outside draw phase until their turn ends. */
  drawBan: { playerId: PlayerId; endsAfterTheirTurn: boolean } | null;
  /** Systemfehler: bound card cannot be activated until that player's next start. */
  activationLockedBoundId: string | null;
  activationLockOwner: PlayerId | null;
  /** Club 3–4: free build-swap available this turn. */
  clubSwapAvailable: boolean;
  /** Basar 3–4: free exhaust (discard 1) available this turn. */
  basarExhaustAvailable: boolean;
  /** After Luft draws, finish boost arena follow-up (Späti) once discard is chosen. */
  awaitingPostBoostArena: boolean;
  /** Playtest: override max/start HP for clamps + invariants (O11). */
  playtestHpCap?: PlaytestHpCap;
  /** Playtest: mono phrase bonus mode (O11); unused by V1 combat. */
  monoBonusMode?: MonoBonusMode;
  /** V3: reactions resolved in the current main action (max 1 by default). */
  v3ReactionsThisAction?: number;
  /** V3 Finsternis: block new shield until current action ends. */
  v3BlockShieldThisAction?: boolean;
  /** V3: turnNumber when full resonance was already used. */
  v3FullResonanceUsedRound?: number;
}

export type PendingChoice =
  | {
      type: 'boost-interrupt';
      boosterId: PlayerId;
      boostInstanceId: string;
      boostDefId: string;
    }
  | {
      type: 'damage-reduce';
      defenderId: PlayerId;
      attackerId: PlayerId;
      damage: number;
      attackValue: number;
      blockValue: number;
      mode: 'player' | 'challenge';
      targetBoundInstanceId?: string;
      doubleAttackApplied?: boolean;
    }
  | {
      type: 'optional-draw-discard';
      playerId: PlayerId;
      source: 'spaeti' | 'sumpf-full-block';
    }
  | {
      /** After draw(s) — must discard 1 (player chooses). */
      type: 'must-discard';
      playerId: PlayerId;
      source: 'spaeti' | 'sumpf-full-block' | 'air';
    }
  | {
      type: 'spaeti-extra-build';
      playerId: PlayerId;
    }
  | {
      /** V3: active player picks one reaction when multiple marks match. */
      type: 'pick-reaction';
      chooserId: PlayerId;
      targetId: PlayerId;
      impulseElement: Element;
      options: Array<{
        reactionId: string;
        markId: PrimaryMarkId;
        labelDe: string;
      }>;
    };

export function createEmptyMeta(): MatchMeta {
  return {
    boostsPlayed: { p1: 0, p2: 0 },
    spaetiFilterUsed: { p1: false, p2: false },
    kristallHealUsed: { p1: false, p2: false },
    vulkanAttackBonusUsed: { p1: false, p2: false },
    sumpfBlockBonusUsed: { p1: false, p2: false },
    didAttackOrChallengeThisTurn: false,
    drawBan: null,
    activationLockedBoundId: null,
    activationLockOwner: null,
    clubSwapAvailable: false,
    basarExhaustAvailable: false,
    awaitingPostBoostArena: false,
    playtestHpCap: undefined,
    monoBonusMode: undefined,
  };
}

export function resetTurnMeta(meta: MatchMeta, activePlayer: PlayerId): MatchMeta {
  return {
    ...meta,
    spaetiFilterUsed: { ...meta.spaetiFilterUsed, [activePlayer]: false },
    kristallHealUsed: { ...meta.kristallHealUsed, [activePlayer]: false },
    vulkanAttackBonusUsed: { ...meta.vulkanAttackBonusUsed, [activePlayer]: false },
    sumpfBlockBonusUsed: { p1: false, p2: false },
    didAttackOrChallengeThisTurn: false,
    clubSwapAvailable: meta.clubSwapAvailable,
    basarExhaustAvailable: meta.basarExhaustAvailable,
  };
}
