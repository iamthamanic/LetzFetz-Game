import type { PlayerId } from './ruleset';
import type { Element } from './elements';
import type { PrimaryMarkId } from './status';

/** How the match ends: LP to 0 (default) or wall-clock timer. */
export type MatchEndMode = 'standard' | 'timed';

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
  /**
   * Match: enable V6 Formel ruleset identity (INTERNAL).
   * Mutually exclusive with `v5FormulaEnabled`.
   */
  v6FormulaEnabled?: boolean;
  /** V6: Fetzladung already gained this own turn (max 1 from TEK). */
  v6FetzGainedThisTurn?: Record<PlayerId, boolean>;
  /** V6 Post-Formula-Action-Policy after last formula activate. */
  v6PostFormulaActionLock?: Record<PlayerId, 'none' | 'attack_and_challenge'>;
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
  /** V5 character passives already used this turn (keys like `schluckspecht-fullblock`). */
  v5PassiveUsed?: Record<PlayerId, string[]>;
  /** V5 Stiernackenkommando stored attack/challenge bonus (0–2). */
  v5RevengeBonus?: Record<PlayerId, number>;
  /** V5 Echo/Doppelecho: primary bonus applied at owner's next start. */
  v5EchoPrimary?: Record<PlayerId, number>;
  /** V5 Sperrkreis: next attack by this player gets combat penalty. */
  v5NextAttackPenalty?: Record<PlayerId, number>;
  /** V5 Doppelecho: katalysator instanceIds that stay exhausted after restore. */
  v5KeepExhaustedFormula?: Record<PlayerId, string[]>;
  /** V5 Verzögerung: prep attack bonus deferred to next start. */
  v5DelayedPrimary?: Record<PlayerId, number>;
  /** V5 Kettenkopplung: next matching action type gets this combat/value bonus. */
  v5ChainSameAction?: Record<
    PlayerId,
    { action: 'attack' | 'block' | 'boost'; bonus: number } | null
  >;
  /** V5 Mysterium: chosen element override for affinity this turn. */
  v5MysteriumElement?: Record<PlayerId, Element | null>;
  /** V5 Halbe Dose Energy: HP to lose at start of that player's next turn. */
  v5EnergyHangover?: Record<PlayerId, number>;
  /** Match end: standard (0 LP) or timed wall-clock. Default / omit = standard. */
  matchEndMode?: MatchEndMode;
  /** Timed mode: wall-clock duration in ms (from matchStartedAtMs). */
  matchDurationMs?: number;
  /** Timed mode: epoch ms when the match clock started (createGame / footer dock). */
  matchStartedAtMs?: number;
  /** Timed mode: settled soft-pause duration in ms (excluded from countdown). */
  matchPausedTotalMs?: number;
  /** Timed mode: epoch ms when the current soft-pause began (open segment). */
  matchPauseStartedAtMs?: number;
  /** Match: enable V5 artifact auction (mirrors ruleset; set at createGame). */
  v5ArtifactAuctionEnabled?: boolean;
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
      source: 'spaeti' | 'sumpf-full-block' | 'air' | 'dripministerin';
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
    }
  | {
      /** V5 Pillendoktora: choose boost aftermath once per turn. */
      type: 'pillendoktora-boost';
      playerId: PlayerId;
    }
  | {
      /** V5 Mysterium: choose element for played card / essence once per turn. */
      type: 'mysterium-element';
      playerId: PlayerId;
      subjectInstanceId: string;
      subjectKind: 'element-card' | 'essence';
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
    v5PassiveUsed: {
      p1: activePlayer === 'p1' ? [] : (meta.v5PassiveUsed?.p1 ?? []),
      p2: activePlayer === 'p2' ? [] : (meta.v5PassiveUsed?.p2 ?? []),
    },
    v5MysteriumElement: {
      p1: activePlayer === 'p1' ? null : (meta.v5MysteriumElement?.p1 ?? null),
      p2: activePlayer === 'p2' ? null : (meta.v5MysteriumElement?.p2 ?? null),
    },
  };
}
