import type {
  GameState,
  MonoBonusMode,
  PlayerId,
  PlaytestHpCap,
  StatusInstance,
  TurnPhase,
} from '../types';
import { collectInvariantViolations } from '../engine/invariants';
import { rulesetFromState } from '../engine/rulesetFromState';
import { cloneState } from '../engine/helpers';

export interface PlaytestPatch {
  phase?: TurnPhase;
  activePlayer?: PlayerId;
  p1Hp?: number;
  p2Hp?: number;
  winner?: PlayerId | null;
  clearCombat?: boolean;
  /** O11: set both HP + heal/damage cap. */
  playtestHpCap?: PlaytestHpCap;
  /** O11: mono bonus mode (stored; V2 combat later). */
  monoBonusMode?: MonoBonusMode;
  /** Enable V3 combat layer for this match. */
  v3CombatEnabled?: boolean;
  /** Replace P1 statuses (V3 chips / reaction demos). */
  p1Statuses?: StatusInstance[];
  /** Replace P2 statuses. */
  p2Statuses?: StatusInstance[];
  /** Open a pick-reaction pending choice (UI demo). */
  demoPickReaction?: boolean;
  /** Seed Ulti + V3 blueprint/ulti combat hooks for HUD demo (#149). */
  demoV3Hooks?: boolean;
  /** Seed lastEvent for combat feedback toasts (#150). */
  demoCombatFeedback?: 'vollblock' | 'auto-reaction' | 'both';
}

export interface PlaytestValidationResult {
  ok: boolean;
  state?: GameState;
  error?: string;
}

/** Apply surgical field patches to a cloned game state. */
export function applyPlaytestPatch(state: GameState, patch: PlaytestPatch): GameState {
  const next = cloneState(state);

  if (patch.phase !== undefined) next.phase = patch.phase;
  if (patch.activePlayer !== undefined) next.activePlayer = patch.activePlayer;
  if (patch.playtestHpCap !== undefined) {
    next.meta = { ...next.meta, playtestHpCap: patch.playtestHpCap };
  }
  if (patch.monoBonusMode !== undefined) {
    next.meta = { ...next.meta, monoBonusMode: patch.monoBonusMode };
  }
  if (patch.v3CombatEnabled !== undefined) {
    next.meta = { ...next.meta, v3CombatEnabled: patch.v3CombatEnabled };
  }
  if (patch.p1Statuses !== undefined) {
    next.players.p1.statuses = patch.p1Statuses.map((s) => ({ ...s }));
  }
  if (patch.p2Statuses !== undefined) {
    next.players.p2.statuses = patch.p2Statuses.map((s) => ({ ...s }));
  }
  if (patch.demoPickReaction) {
    next.pendingChoice = {
      type: 'pick-reaction',
      chooserId: 'p1',
      targetId: 'p2',
      impulseElement: 'fire',
      options: [
        { reactionId: 'inferno', markId: 'brennen', labelDe: 'Inferno' },
        { reactionId: 'dampf', markId: 'durchnaesst', labelDe: 'Dampf' },
      ],
    };
  }
  if (patch.demoV3Hooks) {
    next.meta = {
      ...next.meta,
      v3CombatEnabled: true,
      v3ReactionLimitThisAction: 2,
      v3DampfBecomesDichterNebel: true,
      v3PreserveFirstConsumedMark: true,
      v3TransformedPlayers: ['p1'],
    };
    next.players.p1.ultimateAvailable = true;
  }
  if (patch.demoCombatFeedback === 'vollblock') {
    next.combat = null;
    next.lastEvent = 'Komplett geblockt — Vollblock (6 vs 8).';
  } else if (patch.demoCombatFeedback === 'auto-reaction') {
    next.combat = null;
    next.lastEvent = 'Auto-Reaktion: Inferno.';
  } else if (patch.demoCombatFeedback === 'both') {
    next.combat = null;
    next.lastEvent =
      'Komplett geblockt — Vollblock (6 vs 8). Auto-Reaktion: Dampf.';
  }
  if (patch.p1Hp !== undefined) next.players.p1.hp = patch.p1Hp;
  if (patch.p2Hp !== undefined) next.players.p2.hp = patch.p2Hp;
  if (patch.winner !== undefined) next.winner = patch.winner;
  if (patch.clearCombat) next.combat = null;

  return next;
}

/** Validate playtest state via engine invariants; returns error message for UI. */
export function validatePlaytestState(state: GameState): PlaytestValidationResult {
  const violations = collectInvariantViolations(state, {
    ruleset: rulesetFromState(state),
  });
  if (violations.length > 0) {
    return {
      ok: false,
      error: violations.map((v) => v.message).join(' · '),
    };
  }
  return { ok: true, state };
}

function validatePatchFields(patch: PlaytestPatch): string | null {
  if (patch.p1Hp !== undefined && !Number.isFinite(patch.p1Hp)) {
    return 'P1 HP muss eine Zahl sein.';
  }
  if (patch.p2Hp !== undefined && !Number.isFinite(patch.p2Hp)) {
    return 'P2 HP muss eine Zahl sein.';
  }
  return null;
}

/** Patch then validate — single entry for UI. */
export function applyAndValidatePlaytestPatch(
  state: GameState,
  patch: PlaytestPatch,
): PlaytestValidationResult {
  const fieldError = validatePatchFields(patch);
  if (fieldError) return { ok: false, error: fieldError };

  const patched = applyPlaytestPatch(state, patch);
  const result = validatePlaytestState(patched);
  if (!result.ok) return result;
  return { ok: true, state: patched };
}

/** Validate a full scenario state before injecting into GameView. */
export function preparePlaytestState(state: GameState): PlaytestValidationResult {
  return validatePlaytestState(state);
}
