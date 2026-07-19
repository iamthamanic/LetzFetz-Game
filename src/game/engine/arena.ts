/**
 * Arena rule hooks — Letz Fetz V1 §12.
 * Location: src/game/engine/arena.ts
 */
import type { GameState, PlayerId, RulesetConfig } from '../types';
import { createEmptyMeta, resetTurnMeta } from '../types';
import { checkWinner } from './createGame';
import { cloneState, clampHp, drawForPlayer } from './helpers';
import { modifyDieRoll } from './dice';
import type { Rng } from './deck';

export function isSpaeti(state: GameState): boolean {
  return state.arena.arenaId === 'arena-spaeti';
}

export function isKristall(state: GameState): boolean {
  return state.arena.arenaId === 'arena-kristall';
}

export function isVulkan(state: GameState): boolean {
  return state.arena.arenaId === 'arena-vulkan';
}

export function isSumpf(state: GameState): boolean {
  return state.arena.arenaId === 'arena-sumpf';
}

export function isClub(state: GameState): boolean {
  return state.arena.arenaId === 'arena-club';
}

export function isBasar(state: GameState): boolean {
  return state.arena.arenaId === 'arena-schattenbasar';
}

export function getChallengeMargin(state: GameState): number {
  return isSumpf(state) ? 2 : 1;
}

export function capBoostDamage(state: GameState, damage: number): number {
  if (!isSpaeti(state)) return damage;
  return Math.min(3, damage);
}

export function applyVulkanAttackRoll(
  state: GameState,
  playerId: PlayerId,
  roll: number,
): { state: GameState; roll: number } {
  if (!isVulkan(state) || state.meta.vulkanAttackBonusUsed[playerId]) {
    return { state, roll };
  }
  const next = cloneState(state);
  next.meta = {
    ...next.meta,
    vulkanAttackBonusUsed: { ...next.meta.vulkanAttackBonusUsed, [playerId]: true },
  };
  return { state: next, roll: modifyDieRoll(roll, 1) };
}

export function applySumpfBlockRoll(
  state: GameState,
  defenderId: PlayerId,
  roll: number,
): { state: GameState; roll: number } {
  if (!isSumpf(state) || state.meta.sumpfBlockBonusUsed[defenderId]) {
    return { state, roll };
  }
  const next = cloneState(state);
  next.meta = {
    ...next.meta,
    sumpfBlockBonusUsed: { ...next.meta.sumpfBlockBonusUsed, [defenderId]: true },
  };
  return { state: next, roll: modifyDieRoll(roll, 1) };
}

export function markAttackOrChallenge(state: GameState): GameState {
  const next = cloneState(state);
  next.meta = { ...next.meta, didAttackOrChallengeThisTurn: true };
  return next;
}

export function applyHealAmount(
  state: GameState,
  playerId: PlayerId,
  amount: number,
  ruleset: RulesetConfig,
): GameState {
  const next = cloneState(state);
  let heal = amount;
  if (isKristall(next) && amount > 0 && !next.meta.kristallHealUsed[playerId]) {
    heal += 1;
    next.meta = {
      ...next.meta,
      kristallHealUsed: { ...next.meta.kristallHealUsed, [playerId]: true },
    };
  }
  next.players[playerId].hp = clampHp(next.players[playerId].hp + heal, ruleset);
  return next;
}

export function onStartPhaseArena(
  state: GameState,
  playerId: PlayerId,
  rng: Rng,
  ruleset: RulesetConfig,
): GameState {
  let next = cloneState(state);
  next.meta = resetTurnMeta(next.meta, playerId);

  next.players[playerId].bound = next.players[playerId].bound.map((b) => ({
    ...b,
    resistanceBonus: 0,
    exhausted: false,
  }));

  if (next.meta.activationLockOwner === playerId) {
    next.meta = {
      ...next.meta,
      activationLockedBoundId: null,
      activationLockOwner: null,
    };
  }

  next.meta = {
    ...next.meta,
    clubSwapAvailable: isClub(next) && next.arena.d6Variant === 1,
    basarExhaustAvailable: isBasar(next) && next.arena.d6Variant === 1,
  };

  if (isBasar(next) && next.arena.d6Variant === 2 && next.players[playerId].hand.length === 0) {
    next.players[playerId].hp = clampHp(next.players[playerId].hp - 2, ruleset);
    next = drawForPlayer(next, playerId, 2, rng, ruleset, { allowExtra: true });
    next.lastEvent = 'Basar: Keine Handkarten — −2 Leben, 2 gezogen.';
    return checkWinner(next);
  }

  next.lastEvent = 'Erschöpfte Karten aufgestellt.';
  return next;
}

export function onEndTurnArena(
  state: GameState,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  let next = cloneState(state);

  if (isVulkan(next) && !next.meta.didAttackOrChallengeThisTurn) {
    next.players[playerId].hp = clampHp(next.players[playerId].hp - 1, ruleset);
    next.lastEvent = 'Vulkan: Kein Angriff/Herausfordern — −1 Leben.';
  }

  if (isClub(next) && next.arena.d6Variant === 0 && next.players[playerId].hand.length > 4) {
    const removed = next.players[playerId].hand.pop();
    if (removed) {
      next.piles.discard.push(removed);
      next.lastEvent = `${next.lastEvent ?? ''} Club: Hand >4 — 1 abgeworfen.`.trim();
    }
  }

  if (next.meta.drawBan?.playerId === playerId && next.meta.drawBan.endsAfterTheirTurn) {
    next.meta = { ...next.meta, drawBan: null };
  }

  return checkWinner(next);
}

export function afterHighAttackValue(
  state: GameState,
  attackerId: PlayerId,
  attackValue: number,
  ruleset: RulesetConfig,
): GameState {
  if (!isVulkan(state) || attackValue < 9) return state;
  const next = cloneState(state);
  next.players[attackerId].hp = clampHp(next.players[attackerId].hp - 1, ruleset);
  next.lastEvent = `${next.lastEvent ?? ''} Vulkan: Angriff ≥9 — Angreifer −1.`.trim();
  return checkWinner(next);
}

export function afterBoundDestroyed(
  state: GameState,
  destroyerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  if (!isBasar(state) || state.arena.d6Variant !== 0) return state;
  const next = cloneState(state);
  next.players[destroyerId].hp = clampHp(next.players[destroyerId].hp - 1, ruleset);
  next.lastEvent = `${next.lastEvent ?? ''} Basar: Zerstörung kostet −1 Leben.`.trim();
  return checkWinner(next);
}

export function switchArena(
  state: GameState,
  packArenas: { id: string; d6Variants?: [string, string, string] }[],
  rng: Rng,
): GameState {
  const next = cloneState(state);
  const others = packArenas.filter((a) => a.id !== next.arena.arenaId);
  const pool = others.length > 0 ? others : packArenas;
  const pick = pool[Math.floor(rng() * pool.length)];
  const d6Variant = pick.d6Variants ? Math.floor((Math.floor(rng() * 6)) / 2) : null;
  next.arena = { arenaId: pick.id, d6Variant };
  next.meta = {
    ...createEmptyMeta(),
    boostsPlayed: { ...next.meta.boostsPlayed },
    drawBan: next.meta.drawBan,
    activationLockedBoundId: next.meta.activationLockedBoundId,
    activationLockOwner: next.meta.activationLockOwner,
    clubSwapAvailable: pick.id === 'arena-club' && d6Variant === 1,
    basarExhaustAvailable: pick.id === 'arena-schattenbasar' && d6Variant === 1,
  };
  next.lastEvent = `Arena gewechselt: ${pick.id}.`;
  return next;
}

export function maybeQueueSumpfFullBlock(
  state: GameState,
  defenderId: PlayerId,
  damage: number,
): GameState {
  if (!isSumpf(state) || damage > 0) return state;
  const next = cloneState(state);
  next.pendingChoice = {
    type: 'optional-draw-discard',
    playerId: defenderId,
    source: 'sumpf-full-block',
  };
  next.lastEvent = `${next.lastEvent ?? ''} Sumpf: Voller Block — optional 1 ziehen / 1 abwerfen.`.trim();
  return next;
}
