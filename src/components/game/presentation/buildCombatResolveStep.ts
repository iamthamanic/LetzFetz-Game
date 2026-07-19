/**
 * Presentation step: fullscreen combat resolve (stack → clash → remainder).
 * Location: src/components/game/presentation/buildCombatResolveStep.ts
 */
import { diceBonusFromRoll } from '../../../game/engine/dice';
import { findElementDef } from '../../../game/engine/lookup';
import type { ContentPack, GameState, PlayerId } from '../../../game/types';
import { DEFAULT_RULESET } from '../../../game/types/ruleset';
import type { PresentationStep } from './types';

/** Full auto show: attack stack + block stack + clash + remainder (+ optional destroy). */
export const COMBAT_RESOLVE_MS = 4200;

export type CombatResolveOutcome =
  | 'damage'
  | 'blocked'
  | 'challenge-destroy'
  | 'challenge-fail';

export interface CombatResolveSnapshot {
  mode: 'player' | 'challenge';
  attackerId: PlayerId;
  defenderId: PlayerId;
  attackCardDefId: string;
  attackRoll: number;
  /** Non-dice contribution so base + bonus === total. */
  attackBase: number;
  attackBonus: number;
  attackValue: number;
  blockCardDefId: string | null;
  blockRoll: number | null;
  blockBase: number;
  blockBonus: number;
  blockValue: number;
  damage: number;
  outcome: CombatResolveOutcome;
  destroyedCardDefId: string | null;
  destroyedCardName: string | null;
  /** HP not applied yet (Rückkopplung choice). */
  damageDeferred: boolean;
}

function parseBlockFromEvent(lastEvent: string | null): {
  blockValue: number | null;
  blockRoll: number | null;
} {
  if (!lastEvent) return { blockValue: null, blockRoll: null };
  const m = lastEvent.match(/Block\s+(\d+)\s+\(Würfel\s+(\d+)\)/);
  if (!m) return { blockValue: null, blockRoll: null };
  return { blockValue: Number(m[1]), blockRoll: Number(m[2]) };
}

function parseDamageFromEvent(lastEvent: string | null): number | null {
  if (!lastEvent) return null;
  if (lastEvent.includes('Komplett geblockt')) return 0;
  const m = lastEvent.match(/(\d+)\s+Schaden/);
  if (m) return Number(m[1]);
  const rueck = lastEvent.match(/Schaden\s+(\d+)/);
  if (rueck) return Number(rueck[1]);
  return null;
}

function findPlayedBlockDefId(
  prev: GameState,
  next: GameState,
  defenderId: PlayerId,
  pack: ContentPack,
): string | null {
  const nextIds = new Set(next.players[defenderId].hand.map((c) => c.instanceId));
  const removed = prev.players[defenderId].hand.filter((c) => !nextIds.has(c.instanceId));
  for (const card of removed) {
    const def = findElementDef(pack, card.defId);
    if (def?.cardType === 'block') return card.defId;
  }
  return null;
}

function findDestroyedBoundDefId(
  prev: GameState,
  next: GameState,
  defenderId: PlayerId,
  targetInstanceId: string | undefined,
): string | null {
  if (!targetInstanceId) return null;
  const stillThere = next.players[defenderId].bound.some((b) => b.instanceId === targetInstanceId);
  if (stillThere) return null;
  const prevBound = prev.players[defenderId].bound.find((b) => b.instanceId === targetInstanceId);
  return prevBound?.defId ?? null;
}

export function buildCombatResolveSnapshot(
  prev: GameState,
  next: GameState,
  pack: ContentPack,
): CombatResolveSnapshot | null {
  if (!prev.combat) return null;
  if (next.combat) return null;

  const combat = prev.combat;
  const attackBonus = diceBonusFromRoll(combat.attackRoll, DEFAULT_RULESET);
  const attackBase = Math.max(0, combat.attackValue - attackBonus);

  const parsed = parseBlockFromEvent(next.lastEvent);
  const blockCardDefId = findPlayedBlockDefId(prev, next, combat.defenderId, pack);
  const blockRoll = parsed.blockRoll;
  const blockBonus = blockRoll != null ? diceBonusFromRoll(blockRoll, DEFAULT_RULESET) : 0;

  let blockValue = parsed.blockValue;
  if (blockValue == null) {
    if (next.pendingChoice?.type === 'damage-reduce') {
      blockValue = next.pendingChoice.blockValue;
    } else {
      blockValue = 0;
    }
  }
  const blockBase = Math.max(0, blockValue - blockBonus);

  const destroyedCardDefId = findDestroyedBoundDefId(
    prev,
    next,
    combat.defenderId,
    combat.targetBoundInstanceId,
  );
  const destroyedDef = destroyedCardDefId ? findElementDef(pack, destroyedCardDefId) : null;

  let damage = parseDamageFromEvent(next.lastEvent);
  let damageDeferred = false;
  if (next.pendingChoice?.type === 'damage-reduce') {
    damage = next.pendingChoice.damage;
    damageDeferred = true;
  }
  if (damage == null) {
    const hpLoss = prev.players[combat.defenderId].hp - next.players[combat.defenderId].hp;
    damage = Math.max(0, hpLoss);
  }

  let outcome: CombatResolveOutcome;
  if (combat.mode === 'challenge') {
    if (destroyedCardDefId) outcome = 'challenge-destroy';
    else outcome = 'challenge-fail';
  } else if (damage > 0) {
    outcome = 'damage';
  } else {
    outcome = 'blocked';
  }

  return {
    mode: combat.mode,
    attackerId: combat.attackerId,
    defenderId: combat.defenderId,
    attackCardDefId: combat.attackCardDefId,
    attackRoll: combat.attackRoll,
    attackBase,
    attackBonus,
    attackValue: combat.attackValue,
    blockCardDefId,
    blockRoll,
    blockBase,
    blockBonus,
    blockValue,
    damage,
    outcome,
    destroyedCardDefId,
    destroyedCardName: destroyedDef?.name ?? null,
    damageDeferred,
  };
}

export function buildCombatResolveStep(snapshot: CombatResolveSnapshot): PresentationStep {
  return {
    id: `combat-resolve-${snapshot.attackerId}-${snapshot.attackCardDefId}-${snapshot.attackValue}-${snapshot.blockValue}`,
    kind: 'combat-resolve',
    durationMs: COMBAT_RESOLVE_MS,
    locksInput: true,
    payload: { ...snapshot } as unknown as Record<string, unknown>,
  };
}

export function isCombatResolveStep(step: PresentationStep): boolean {
  return step.kind === 'combat-resolve';
}
