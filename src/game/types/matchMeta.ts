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
  /** Playtest / match: enable V3 combat layer (impulses, reactions, shield). */
  v3CombatEnabled?: boolean;
  /** Match: enable V5 Formelboard (Technik/Essenz/Katalysator). */
  v5FormulaEnabled?: boolean;
  /** V3: reactions resolved in the current main action (max 1 by default). */
  v3ReactionsThisAction?: number;
  /** V3 Finsternis: block new shield until current action ends. */
  v3BlockShieldThisAction?: boolean;
  /** V3: turnNumber when full resonance was already used. */
  v3FullResonanceUsedRound?: number;
  /** V3 two-part resonance once flags (per match / until cleared). */
  v3ResonanceFireBurnTickUsed?: boolean;
  v3ResonanceWaterChargeUsed?: boolean;
  v3ResonanceEarthHighUsed?: boolean;
  v3ResonanceAirUprightUsed?: boolean;
  v3ResonanceLightCleanseUsed?: boolean;
  v3ResonanceShadowCurseUsed?: boolean;
  /** V3: players who already transformed this match. */
  v3TransformedPlayers?: PlayerId[];
  /** V3 ulti/blueprint: reaction cap this action (default 1). */
  v3ReactionLimitThisAction?: number;
  /** V3 blueprint: Dampf applies dichter_nebel instead of nebel. */
  v3DampfBecomesDichterNebel?: boolean;
  /** V3 ulti: preserve first consumed mark this action. */
  v3PreserveFirstConsumedMark?: boolean;
  /** V3: preserve-first-mark already consumed this action. */
  v3FirstMarkPreservedThisAction?: boolean;
  /** V3: part defIds that already fired a once-per-turn trigger this turn. */
  v3FetzTriggerUsed?: Record<PlayerId, string[]>;
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
      /** For V3 Treffer-Impulse after Rückkopplung window. */
      attackCardDefId?: string;
      /** For V3 Vollblock-Impulse if damage later reduced to 0. */
      blockCardDefId?: string;
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
    v3FetzTriggerUsed: {
      p1: activePlayer === 'p1' ? [] : (meta.v3FetzTriggerUsed?.p1 ?? []),
      p2: activePlayer === 'p2' ? [] : (meta.v3FetzTriggerUsed?.p2 ?? []),
    },
  };
}
