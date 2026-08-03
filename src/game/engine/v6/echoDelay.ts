/**
 * V6 Echo / Delay queues — spielkonzept §8 steps 3–4.
 * Location: src/game/engine/v6/echoDelay.ts
 *
 * Echo: primary now; replay echoAmount at next own Startphase; catalyst discard then.
 * Delay: primary deferred (+ bonus) to next own Startphase; catalyst discard then.
 * Resolve grants no Fetz. Order: Echo → Delay (before Fessel tick).
 */
import type { GameState, PlayerId, RulesetConfig } from '../../types';
import type { V6DelayQueueEntry, V6EchoQueueEntry, V6QueuedPrimary } from '../../types/v6EchoDelay';
import { clampShield } from '../../types/status';
import { cloneState, clampHp } from '../helpers';
import { opponentOf } from '../createGame';
import { emptyFormulaPrep } from '../formulaResolve';

export const V6_ECHO_DEFAULT_AMOUNT = 1;
export const V6_DELAY_DEFAULT_BONUS = 2;

export type V6RecipeTimingMode = 'immediate' | 'echo' | 'delay';

function emptyQueues(): { p1: never[]; p2: never[] } {
  return { p1: [], p2: [] };
}

function applyQueuedPrimary(
  state: GameState,
  actorId: PlayerId,
  primary: Pick<V6QueuedPrimary, 'kind' | 'value' | 'target'>,
  ruleset: RulesetConfig,
): GameState {
  const next = cloneState(state);
  const foe = opponentOf(actorId);
  const value = Math.max(0, primary.value);

  switch (primary.kind) {
    case 'damage': {
      if (primary.target !== 'opponent' || value <= 0) break;
      const def = next.players[foe];
      let remaining = value;
      const shieldUsed = Math.min(def.shield, remaining);
      def.shield -= shieldUsed;
      remaining -= shieldUsed;
      if (remaining > 0) {
        def.hp = clampHp(def.hp - remaining, ruleset);
      }
      break;
    }
    case 'heal': {
      if (primary.target === 'self' && value > 0) {
        next.players[actorId].hp = clampHp(next.players[actorId].hp + value, ruleset);
      }
      break;
    }
    case 'shield': {
      if (primary.target === 'self' && value > 0) {
        next.players[actorId].shield = clampShield(next.players[actorId].shield + value);
      }
      break;
    }
    case 'prep_attack': {
      const prep = next.players[actorId].formulaPrep ?? emptyFormulaPrep();
      next.players[actorId].formulaPrep = {
        ...prep,
        attackCombatBonus: prep.attackCombatBonus + value,
        preparedActionType: 'attack',
      };
      break;
    }
    case 'prep_block': {
      const prep = next.players[actorId].formulaPrep ?? emptyFormulaPrep();
      next.players[actorId].formulaPrep = {
        ...prep,
        blockCombatBonus: prep.blockCombatBonus + value,
        preparedActionType: 'block',
      };
      break;
    }
    case 'prep_boost': {
      const prep = next.players[actorId].formulaPrep ?? emptyFormulaPrep();
      next.players[actorId].formulaPrep = {
        ...prep,
        boostValueBonus: prep.boostValueBonus + value,
        preparedActionType: 'boost',
      };
      break;
    }
    case 'fessel':
      // Fessel needs a target pick — not supported as deferred primary in this slice.
      break;
    default:
      break;
  }
  return next;
}

/** Discard catalyst if the queued instance is still on the owner's board. */
function discardQueuedCatalyst(
  state: GameState,
  playerId: PlayerId,
  catalystInstanceId: string | null,
): GameState {
  if (!catalystInstanceId) return state;
  const kat = state.players[playerId].formula.katalysator;
  if (!kat || kat.instanceId !== catalystInstanceId) return state;
  const next = cloneState(state);
  next.piles.discard.push({ instanceId: kat.instanceId, defId: kat.defId });
  next.players[playerId].formula = {
    ...next.players[playerId].formula,
    katalysator: null,
  };
  return next;
}

export function enqueueV6Echo(
  state: GameState,
  playerId: PlayerId,
  entry: V6EchoQueueEntry,
): GameState {
  const next = cloneState(state);
  const prev = next.meta.v6EchoQueue ?? emptyQueues();
  next.meta.v6EchoQueue = {
    p1: [...(prev.p1 ?? [])],
    p2: [...(prev.p2 ?? [])],
    [playerId]: [...(prev[playerId] ?? []), entry],
  };
  return next;
}

export function enqueueV6Delay(
  state: GameState,
  playerId: PlayerId,
  entry: V6DelayQueueEntry,
): GameState {
  const next = cloneState(state);
  const prev = next.meta.v6DelayQueue ?? emptyQueues();
  next.meta.v6DelayQueue = {
    p1: [...(prev.p1 ?? [])],
    p2: [...(prev.p2 ?? [])],
    [playerId]: [...(prev[playerId] ?? []), entry],
  };
  return next;
}

/** §8 step 3 — resolve all pending Echo entries for the active player. */
function resolveV6EchoQueue(
  state: GameState,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  const queue = state.meta.v6EchoQueue?.[playerId] ?? [];
  if (queue.length === 0) return state;

  let next = cloneState(state);
  const notes: string[] = [];

  for (const entry of queue) {
    const amount = Math.max(0, Math.min(entry.echoAmount, entry.value));
    if (amount > 0) {
      next = applyQueuedPrimary(
        next,
        playerId,
        { kind: entry.kind, value: amount, target: entry.target },
        ruleset,
      );
    }
    next = discardQueuedCatalyst(next, playerId, entry.catalystInstanceId);
    notes.push(`Echo ${entry.recipeName}: ${entry.kind} ${amount}`);
  }

  next.meta.v6EchoQueue = {
    ...(next.meta.v6EchoQueue ?? emptyQueues()),
    [playerId]: [],
  };
  if (notes.length > 0) {
    next.lastEvent = `Echo: ${notes.join('; ')}`;
  }
  return next;
}

/** §8 step 4 — resolve all pending delayed formulas for the active player. */
function resolveV6DelayQueue(
  state: GameState,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  const queue = state.meta.v6DelayQueue?.[playerId] ?? [];
  if (queue.length === 0) return state;

  let next = cloneState(state);
  const notes: string[] = [];

  for (const entry of queue) {
    next = applyQueuedPrimary(
      next,
      playerId,
      { kind: entry.kind, value: entry.value, target: entry.target },
      ruleset,
    );
    next = discardQueuedCatalyst(next, playerId, entry.catalystInstanceId);
    notes.push(`Verzögerung ${entry.recipeName}: ${entry.kind} ${entry.value}`);
  }

  next.meta.v6DelayQueue = {
    ...(next.meta.v6DelayQueue ?? emptyQueues()),
    [playerId]: [],
  };
  if (notes.length > 0) {
    const prefix = next.lastEvent?.startsWith('Echo:') ? `${next.lastEvent} · ` : '';
    next.lastEvent = `${prefix}Verzögerung: ${notes.join('; ')}`;
  }
  return next;
}

/** Startphase: Echo then Delay (spielkonzept §8). No Fetz on resolve. */
export function tickV6EchoAndDelayAtStart(
  state: GameState,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  let next = resolveV6EchoQueue(state, playerId, ruleset);
  next = resolveV6DelayQueue(next, playerId, ruleset);
  return next;
}
