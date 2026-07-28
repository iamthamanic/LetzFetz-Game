/**
 * V3 Fetzgerät part trigger + activate effects (authored 36 roster).
 * Location: src/game/engine/status/fetzgeraetEffects.ts
 *
 * ponytail: compact op language; full card prose stays in effectText.
 */
import type {
  ContentPack,
  Element,
  EnginePartCardDef,
  GameState,
  PlayerId,
  StatusId,
} from '../../types';
import { isV3CombatEnabled, type RulesetConfig } from '../../types';
import { cloneState, clampHp } from '../helpers';
import { opponentOf } from '../createGame';
import { findEnginePartDef } from '../lookup';
import { applyStatus, hasStatus, removeStatus } from './applyStatus';
import { applyDamageThroughShield } from './shield';
import { resolveImpulseReactions } from './reactionChoice';
import { effectiveFetzSlot } from './fetzgeraetSlots';
import {
  canSpendFetzCharge,
  gainFetzCharge,
  getFetzCharge,
  spendFetzCharge,
} from './fetzCharge';

export type FetzPassiveTrigger =
  | 'onAttackHit'
  | 'onAttackAnnounce'
  | 'onAfterOwnBlock'
  | 'onIncomingDamage'
  | 'onStatusOrReactionDamage'
  | 'onOppNegativeStatus'
  | 'onOppHealOrShield'
  | 'onMarkOrStatusRemoved'
  | 'onHighGainOrSpend'
  | 'onShieldFullBlockOrRepair'
  | 'onPartExhaust'
  | 'onFocusOrReroll'
  | 'onPartFlipOffTurnStart'
  | 'onDiscardOrIgnorePassive'
  | 'onGainShieldOrCleanse';

export type FetzOp =
  | { op: 'impulse'; element: Element; target: 'opp' | 'self' | 'attacker' }
  | { op: 'damage'; amount: number; target: 'opp' | 'self'; throughShield?: boolean }
  | { op: 'directDamage'; amount: number; target: 'opp' | 'self' }
  | { op: 'heal'; amount: number }
  | { op: 'shield'; amount: number }
  | { op: 'gainCharge'; amount: number }
  | { op: 'exhaustOppPart' }
  | { op: 'discardOpp' }
  | { op: 'drawDiscard' }
  | { op: 'status'; id: StatusId; target: 'opp' | 'self'; stacks?: number }
  | { op: 'removeStatus'; id: StatusId; target: 'opp' | 'self' }
  | { op: 'uprightOwnOther' }
  | { op: 'attackBonus'; amount: number }
  | { op: 'blockBonus'; amount: number }
  | { op: 'reduceIncoming'; amount: number };

export interface FetzPassiveSpec {
  trigger: FetzPassiveTrigger;
  spendCharge?: number;
  /** Extra charge when elemental condition holds (Antrieb bonus). */
  bonusGainCharge?: number;
  ops: FetzOp[];
  /** Run after spend+ops when condition flag is true. */
  bonusOps?: FetzOp[];
}

export interface FetzActivateSpec {
  cost: number;
  ops: FetzOp[];
}

export interface FetzPartEffectSpec {
  passive?: FetzPassiveSpec;
  activate?: FetzActivateSpec;
}

/** Context for running ops / evaluating bonuses. */
export interface FetzEffectContext {
  ownerId: PlayerId;
  pack: ContentPack;
  ruleset: RulesetConfig;
  /** Bound instance that owns the effect. */
  boundInstanceId: string;
  partDefId: string;
  /** Optional: attacker when defending. */
  attackerId?: PlayerId;
  /** Optional: combat damage about to land on owner. */
  incomingDamage?: number;
  /** Optional: live attack/block value mutation. */
  attackValue?: number;
  blockValue?: number;
  /** Elemental / status bonus condition already evaluated by caller. */
  bonus?: boolean;
  /** When true, last impulse in this run caused a reaction choice or resolve. */
  reactionFired?: boolean;
}

function markTriggerUsed(state: GameState, ownerId: PlayerId, partDefId: string): GameState {
  const next = cloneState(state);
  const used = { ...(next.meta.v3FetzTriggerUsed ?? { p1: [], p2: [] }) };
  const list = [...(used[ownerId] ?? [])];
  if (!list.includes(partDefId)) list.push(partDefId);
  used[ownerId] = list;
  next.meta = { ...next.meta, v3FetzTriggerUsed: used };
  return next;
}

function wasTriggerUsed(state: GameState, ownerId: PlayerId, partDefId: string): boolean {
  return (state.meta.v3FetzTriggerUsed?.[ownerId] ?? []).includes(partDefId);
}

function resolveTarget(
  ctx: FetzEffectContext,
  target: 'opp' | 'self' | 'attacker',
): PlayerId {
  if (target === 'self') return ctx.ownerId;
  if (target === 'attacker') return ctx.attackerId ?? opponentOf(ctx.ownerId);
  return opponentOf(ctx.ownerId);
}

function runOps(
  state: GameState,
  ctx: FetzEffectContext,
  ops: FetzOp[],
): { state: GameState; attackValue?: number; blockValue?: number; incomingDamage?: number; reactionFired: boolean } {
  let next = state;
  let attackValue = ctx.attackValue;
  let blockValue = ctx.blockValue;
  let incomingDamage = ctx.incomingDamage;
  let reactionFired = ctx.reactionFired ?? false;

  for (const op of ops) {
    switch (op.op) {
      case 'gainCharge':
        next = gainFetzCharge(next, ctx.ownerId, op.amount);
        break;
      case 'heal':
        next = cloneState(next);
        next.players[ctx.ownerId].hp = clampHp(
          next.players[ctx.ownerId].hp + op.amount,
          ctx.ruleset,
        );
        break;
      case 'shield': {
        next = cloneState(next);
        const cur = next.players[ctx.ownerId].shield ?? 0;
        next.players[ctx.ownerId].shield = Math.min(5, cur + op.amount);
        break;
      }
      case 'damage': {
        const tid = resolveTarget(ctx, op.target);
        if (op.throughShield === false) {
          next = cloneState(next);
          next.players[tid].hp = clampHp(next.players[tid].hp - op.amount, ctx.ruleset);
        } else {
          next = applyDamageThroughShield(next, tid, op.amount, ctx.ruleset).state;
        }
        break;
      }
      case 'directDamage': {
        const tid = resolveTarget(ctx, op.target);
        next = cloneState(next);
        next.players[tid].hp = clampHp(next.players[tid].hp - op.amount, ctx.ruleset);
        break;
      }
      case 'impulse': {
        const tid = resolveTarget(ctx, op.target);
        const beforeChoice = next.pendingChoice?.type;
        next = resolveImpulseReactions(
          next,
          tid,
          op.element,
          ctx.ruleset,
          ctx.ownerId,
          ctx.pack,
        );
        if (next.pendingChoice?.type === 'pick-reaction' || beforeChoice !== next.pendingChoice?.type) {
          reactionFired = true;
        }
        // Also treat applied reaction auto-resolve as fired if reactionsThisAction bumped
        break;
      }
      case 'status': {
        const tid = resolveTarget(ctx, op.target);
        next = applyStatus(next, tid, op.id, op.stacks ?? 1);
        break;
      }
      case 'removeStatus': {
        const tid = resolveTarget(ctx, op.target);
        if (hasStatus(next, tid, op.id)) {
          next = removeStatus(next, tid, op.id);
        }
        break;
      }
      case 'exhaustOppPart': {
        const opp = opponentOf(ctx.ownerId);
        next = cloneState(next);
        const target = next.players[opp].bound.find(
          (b) => !b.exhausted && effectiveFetzSlot(b),
        );
        if (target) target.exhausted = true;
        break;
      }
      case 'discardOpp': {
        const opp = opponentOf(ctx.ownerId);
        next = cloneState(next);
        const hand = next.players[opp].hand;
        if (hand.length > 0) {
          const [card] = hand.splice(0, 1);
          next.piles.discard.push(card);
        }
        break;
      }
      case 'drawDiscard': {
        // Draw is deferred — simple: no draw engine here; discard one from hand if any
        next = cloneState(next);
        const hand = next.players[ctx.ownerId].hand;
        if (hand.length > 0) {
          const [card] = hand.splice(hand.length - 1, 1);
          next.piles.discard.push(card);
        }
        break;
      }
      case 'uprightOwnOther': {
        next = cloneState(next);
        const other = next.players[ctx.ownerId].bound.find(
          (b) =>
            b.exhausted &&
            b.instanceId !== ctx.boundInstanceId &&
            effectiveFetzSlot(b),
        );
        if (other) other.exhausted = false;
        break;
      }
      case 'attackBonus':
        attackValue = (attackValue ?? 0) + op.amount;
        break;
      case 'blockBonus':
        blockValue = (blockValue ?? 0) + op.amount;
        break;
      case 'reduceIncoming':
        incomingDamage = Math.max(0, (incomingDamage ?? 0) - op.amount);
        break;
      default:
        break;
    }
  }

  return { state: next, attackValue, blockValue, incomingDamage, reactionFired };
}

/** Authored hooks for the 36 V3 parts (id → spec). */
export const FETZ_PART_EFFECTS: Record<string, FetzPartEffectSpec> = {
  // —— Feuer ——
  'v3-part-fire-traeger-01': {
    passive: {
      trigger: 'onAttackHit',
      spendCharge: 1,
      ops: [{ op: 'impulse', element: 'fire', target: 'opp' }],
      bonusOps: [{ op: 'directDamage', amount: 1, target: 'opp' }],
    },
  },
  'v3-part-fire-traeger-02': {
    passive: {
      trigger: 'onAttackAnnounce',
      spendCharge: 1,
      ops: [{ op: 'attackBonus', amount: 1 }],
      bonusOps: [{ op: 'directDamage', amount: 1, target: 'opp' }],
    },
  },
  'v3-part-fire-antrieb-01': {
    passive: {
      trigger: 'onStatusOrReactionDamage',
      ops: [{ op: 'gainCharge', amount: 1 }],
      bonusGainCharge: 0,
    },
  },
  'v3-part-fire-antrieb-02': {
    passive: {
      trigger: 'onAttackHit',
      ops: [{ op: 'gainCharge', amount: 1 }],
      bonusOps: [{ op: 'gainCharge', amount: 1 }],
    },
  },
  'v3-part-fire-aufsatz-01': {
    activate: {
      cost: 3,
      ops: [{ op: 'damage', amount: 2, target: 'opp' }],
    },
  },
  'v3-part-fire-aufsatz-02': {
    activate: {
      cost: 2,
      ops: [
        { op: 'impulse', element: 'fire', target: 'opp' },
        { op: 'directDamage', amount: 1, target: 'opp' },
      ],
    },
  },

  // —— Wasser ——
  'v3-part-water-traeger-01': {
    passive: {
      trigger: 'onIncomingDamage',
      spendCharge: 1,
      ops: [{ op: 'reduceIncoming', amount: 1 }],
      bonusOps: [{ op: 'impulse', element: 'water', target: 'attacker' }],
    },
  },
  'v3-part-water-traeger-02': {
    passive: {
      trigger: 'onAfterOwnBlock',
      spendCharge: 1,
      ops: [{ op: 'shield', amount: 1 }],
      bonusOps: [{ op: 'shield', amount: 1 }],
    },
  },
  'v3-part-water-antrieb-01': {
    passive: {
      trigger: 'onAfterOwnBlock',
      ops: [{ op: 'gainCharge', amount: 1 }],
      bonusOps: [{ op: 'gainCharge', amount: 1 }],
    },
  },
  'v3-part-water-antrieb-02': {
    passive: {
      trigger: 'onMarkOrStatusRemoved',
      ops: [{ op: 'gainCharge', amount: 1 }],
      bonusOps: [{ op: 'drawDiscard' }],
    },
  },
  'v3-part-water-aufsatz-01': {
    activate: {
      cost: 2,
      ops: [
        { op: 'damage', amount: 1, target: 'opp' },
        { op: 'impulse', element: 'water', target: 'opp' },
        { op: 'damage', amount: 1, target: 'opp' },
      ],
    },
  },
  'v3-part-water-aufsatz-02': {
    activate: {
      cost: 3,
      ops: [
        { op: 'exhaustOppPart' },
        { op: 'impulse', element: 'water', target: 'opp' },
        { op: 'discardOpp' },
      ],
    },
  },

  // —— Erde ——
  'v3-part-earth-traeger-01': {
    passive: {
      trigger: 'onAfterOwnBlock',
      spendCharge: 1,
      ops: [{ op: 'blockBonus', amount: 1 }],
      bonusOps: [{ op: 'impulse', element: 'earth', target: 'self' }],
    },
  },
  'v3-part-earth-traeger-02': {
    passive: {
      trigger: 'onFocusOrReroll',
      spendCharge: 1,
      ops: [],
    },
  },
  'v3-part-earth-antrieb-01': {
    passive: {
      trigger: 'onHighGainOrSpend',
      ops: [{ op: 'gainCharge', amount: 1 }],
      bonusOps: [{ op: 'gainCharge', amount: 1 }],
    },
  },
  'v3-part-earth-antrieb-02': {
    passive: {
      trigger: 'onShieldFullBlockOrRepair',
      ops: [{ op: 'gainCharge', amount: 1 }],
    },
  },
  'v3-part-earth-aufsatz-01': {
    activate: {
      cost: 3,
      ops: [
        { op: 'exhaustOppPart' },
        { op: 'damage', amount: 2, target: 'opp' },
        { op: 'impulse', element: 'earth', target: 'opp' },
        { op: 'shield', amount: 1 },
      ],
    },
  },
  'v3-part-earth-aufsatz-02': {
    activate: {
      cost: 2,
      ops: [
        { op: 'impulse', element: 'earth', target: 'opp' },
        { op: 'drawDiscard' },
        { op: 'gainCharge', amount: 1 },
      ],
    },
  },

  // —— Luft ——
  'v3-part-air-traeger-01': {
    passive: {
      trigger: 'onPartExhaust',
      spendCharge: 1,
      ops: [{ op: 'status', id: 'fokus', target: 'self' }],
      bonusOps: [{ op: 'shield', amount: 1 }],
    },
  },
  'v3-part-air-traeger-02': {
    passive: {
      trigger: 'onFocusOrReroll',
      spendCharge: 1,
      ops: [{ op: 'impulse', element: 'air', target: 'opp' }],
      bonusOps: [{ op: 'attackBonus', amount: 1 }],
    },
  },
  'v3-part-air-antrieb-01': {
    passive: {
      trigger: 'onPartFlipOffTurnStart',
      ops: [{ op: 'gainCharge', amount: 1 }],
      bonusOps: [{ op: 'gainCharge', amount: 1 }],
    },
  },
  'v3-part-air-antrieb-02': {
    passive: {
      trigger: 'onFocusOrReroll',
      ops: [{ op: 'gainCharge', amount: 1 }],
      bonusOps: [{ op: 'gainCharge', amount: 1 }],
    },
  },
  'v3-part-air-aufsatz-01': {
    activate: {
      cost: 2,
      ops: [
        { op: 'damage', amount: 1, target: 'opp' },
        { op: 'impulse', element: 'air', target: 'opp' },
        { op: 'damage', amount: 1, target: 'opp' },
      ],
    },
  },
  'v3-part-air-aufsatz-02': {
    activate: {
      cost: 3,
      ops: [
        { op: 'impulse', element: 'air', target: 'opp' },
        { op: 'uprightOwnOther' },
      ],
    },
  },

  // —— Schatten ——
  'v3-part-shadow-traeger-01': {
    passive: {
      trigger: 'onOppNegativeStatus',
      spendCharge: 1,
      ops: [{ op: 'directDamage', amount: 1, target: 'opp' }],
      bonusOps: [{ op: 'heal', amount: 1 }],
    },
  },
  'v3-part-shadow-traeger-02': {
    passive: {
      trigger: 'onOppHealOrShield',
      spendCharge: 1,
      ops: [],
      bonusOps: [{ op: 'impulse', element: 'shadow', target: 'opp' }],
    },
  },
  'v3-part-shadow-antrieb-01': {
    passive: {
      trigger: 'onOppNegativeStatus',
      ops: [{ op: 'gainCharge', amount: 1 }],
      bonusOps: [{ op: 'gainCharge', amount: 1 }],
    },
  },
  'v3-part-shadow-antrieb-02': {
    passive: {
      trigger: 'onDiscardOrIgnorePassive',
      ops: [{ op: 'gainCharge', amount: 1 }],
    },
  },
  'v3-part-shadow-aufsatz-01': {
    activate: {
      cost: 2,
      ops: [
        { op: 'discardOpp' },
        { op: 'heal', amount: 1 },
      ],
    },
  },
  'v3-part-shadow-aufsatz-02': {
    activate: {
      cost: 3,
      ops: [
        { op: 'impulse', element: 'shadow', target: 'opp' },
        { op: 'exhaustOppPart' },
      ],
    },
  },

  // —— Licht ——
  'v3-part-light-traeger-01': {
    passive: {
      trigger: 'onAfterOwnBlock',
      spendCharge: 1,
      ops: [{ op: 'shield', amount: 1 }],
      bonusOps: [{ op: 'impulse', element: 'light', target: 'self' }],
    },
  },
  'v3-part-light-traeger-02': {
    passive: {
      trigger: 'onOppNegativeStatus',
      spendCharge: 1,
      ops: [{ op: 'status', id: 'erleuchtet', target: 'self' }],
      bonusOps: [{ op: 'shield', amount: 1 }],
    },
  },
  'v3-part-light-antrieb-01': {
    passive: {
      trigger: 'onGainShieldOrCleanse',
      ops: [{ op: 'gainCharge', amount: 1 }],
      bonusOps: [{ op: 'gainCharge', amount: 1 }],
    },
  },
  'v3-part-light-antrieb-02': {
    passive: {
      trigger: 'onAfterOwnBlock',
      ops: [{ op: 'gainCharge', amount: 1 }],
      bonusOps: [{ op: 'gainCharge', amount: 1 }],
    },
  },
  'v3-part-light-aufsatz-01': {
    activate: {
      cost: 2,
      ops: [
        { op: 'heal', amount: 1 },
        { op: 'impulse', element: 'light', target: 'self' },
        { op: 'shield', amount: 1 },
      ],
    },
  },
  'v3-part-light-aufsatz-02': {
    activate: {
      cost: 3,
      ops: [
        { op: 'status', id: 'geblendet', target: 'opp' },
        { op: 'impulse', element: 'light', target: 'opp' },
      ],
    },
  },
};

function specFor(part: EnginePartCardDef): FetzPartEffectSpec | undefined {
  return FETZ_PART_EFFECTS[part.id];
}

export interface RunPassiveResult {
  state: GameState;
  attackValue?: number;
  blockValue?: number;
  incomingDamage?: number;
}

/**
 * Run all matching built parts for a passive trigger (once per turn per part).
 * Auto-spends charge when spendCharge is set and pool allows.
 */
export function runFetzPassiveTrigger(
  state: GameState,
  pack: ContentPack,
  ownerId: PlayerId,
  ruleset: RulesetConfig,
  trigger: FetzPassiveTrigger,
  extras: Partial<FetzEffectContext> = {},
): RunPassiveResult {
  if (!isV3CombatEnabled(ruleset)) {
    return { state, attackValue: extras.attackValue, blockValue: extras.blockValue, incomingDamage: extras.incomingDamage };
  }

  let next = state;
  let attackValue = extras.attackValue;
  let blockValue = extras.blockValue;
  let incomingDamage = extras.incomingDamage;

  for (const bound of state.players[ownerId].bound) {
    if (bound.exhausted && trigger !== 'onPartExhaust' && trigger !== 'onPartFlipOffTurnStart') {
      // exhausted parts usually don't fire; allow exhaust-triggered
    }
    const part = findEnginePartDef(pack, bound.defId);
    if (!part) continue;
    const spec = specFor(part)?.passive;
    if (!spec || spec.trigger !== trigger) continue;
    if (wasTriggerUsed(next, ownerId, part.id)) continue;

    const spend = spec.spendCharge ?? 0;
    if (spend > 0 && !canSpendFetzCharge(next, ownerId, spend)) continue;

    if (spend > 0) {
      next = spendFetzCharge(next, ownerId, spend);
    }

    const ctx: FetzEffectContext = {
      ownerId,
      pack,
      ruleset,
      boundInstanceId: bound.instanceId,
      partDefId: part.id,
      attackValue,
      blockValue,
      incomingDamage,
      bonus: extras.bonus,
      attackerId: extras.attackerId,
      reactionFired: extras.reactionFired,
    };

    const ran = runOps(next, ctx, spec.ops);
    next = ran.state;
    attackValue = ran.attackValue;
    blockValue = ran.blockValue;
    incomingDamage = ran.incomingDamage;

    if (extras.bonus || ran.reactionFired) {
      if (spec.bonusOps?.length) {
        const bonus = runOps(next, { ...ctx, reactionFired: ran.reactionFired }, spec.bonusOps);
        next = bonus.state;
        attackValue = bonus.attackValue ?? attackValue;
        blockValue = bonus.blockValue ?? blockValue;
        incomingDamage = bonus.incomingDamage ?? incomingDamage;
      }
      if (spec.bonusGainCharge && spec.bonusGainCharge > 0) {
        next = gainFetzCharge(next, ownerId, spec.bonusGainCharge);
      }
    }

    next = markTriggerUsed(next, ownerId, part.id);
    next.lastEvent = `${part.name}: Fetzgerät-Effekt.`;
  }

  return { state: next, attackValue, blockValue, incomingDamage };
}

/** Activate Aufsatz paying shared charge pool. */
export function activateFetzPart(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  boundInstanceId: string,
  ruleset: RulesetConfig,
): GameState {
  if (!isV3CombatEnabled(ruleset)) {
    throw new Error('V3 charge activate requires v3Combat');
  }

  const bound = state.players[playerId].bound.find((b) => b.instanceId === boundInstanceId);
  if (!bound || bound.exhausted) throw new Error('Cannot activate this bound card');

  const part = findEnginePartDef(pack, bound.defId);
  if (!part) throw new Error('Not an engine part');

  const activate = specFor(part)?.activate;
  const cost = activate?.cost ?? part.activateCost;
  if (cost == null) throw new Error('Part has no activate cost');
  if (!canSpendFetzCharge(state, playerId, cost)) {
    throw new Error('Nicht genug Ladung');
  }

  let next = spendFetzCharge(state, playerId, cost);
  next = cloneState(next);
  const live = next.players[playerId].bound.find((b) => b.instanceId === boundInstanceId);
  if (!live) throw new Error('Bound missing');
  live.exhausted = true;

  if (activate?.ops.length) {
    const ran = runOps(next, {
      ownerId: playerId,
      pack,
      ruleset,
      boundInstanceId,
      partDefId: part.id,
    }, activate.ops);
    next = ran.state;
  }

  next.lastEvent = `${part.name} aktiviert (−${cost} Ladung).`;
  return next;
}

export function partActivateCost(part: EnginePartCardDef): number | null {
  return FETZ_PART_EFFECTS[part.id]?.activate?.cost ?? part.activateCost ?? null;
}

export function hasPoolActivate(part: EnginePartCardDef): boolean {
  return partActivateCost(part) != null;
}

/** Helper for UI / tests. */
export function peekCharge(state: GameState, playerId: PlayerId): number {
  return getFetzCharge(state, playerId);
}
