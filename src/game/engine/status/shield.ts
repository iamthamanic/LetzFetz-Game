/**
 * V3 shield absorption in the damage pipeline (§5.1 / §5.3).
 * Location: src/game/engine/status/shield.ts
 */
import type { GameState, PlayerId, RulesetConfig } from '../../types';
import { isV3CombatEnabled } from '../../types';
import { clampHp, cloneState } from '../helpers';

export interface DamagePipelineResult {
  state: GameState;
  /** Damage that reached HP after shield. */
  hpDamage: number;
  /** Shield points consumed. */
  shieldAbsorbed: number;
  /**
   * Treffer: post-block damage > 0 (§4.1 / §17).
   * Shield absorption does not cancel Treffer; Schild ≠ Vollblock (§5.3).
   */
  isHit: boolean;
  /** Vollblock: post-block damage is 0. */
  isFullBlock: boolean;
}

/**
 * Apply remaining post-block damage: Shield then HP (when v3Combat).
 */
export function applyDamageThroughShield(
  state: GameState,
  defenderId: PlayerId,
  postBlockDamage: number,
  ruleset: RulesetConfig,
): DamagePipelineResult {
  const next = cloneState(state);
  const isFullBlock = postBlockDamage <= 0;
  const isHit = postBlockDamage > 0;

  if (postBlockDamage <= 0) {
    return {
      state: next,
      hpDamage: 0,
      shieldAbsorbed: 0,
      isHit: false,
      isFullBlock: true,
    };
  }

  if (!isV3CombatEnabled(ruleset)) {
    next.players[defenderId].hp = clampHp(
      next.players[defenderId].hp - postBlockDamage,
      ruleset,
    );
    return {
      state: next,
      hpDamage: postBlockDamage,
      shieldAbsorbed: 0,
      isHit: true,
      isFullBlock: false,
    };
  }

  let remaining = postBlockDamage;
  const shield = next.players[defenderId].shield ?? 0;
  const absorbed = Math.min(shield, remaining);
  next.players[defenderId].shield = shield - absorbed;
  remaining -= absorbed;

  if (remaining > 0) {
    next.players[defenderId].hp = clampHp(next.players[defenderId].hp - remaining, ruleset);
  }

  return {
    state: next,
    hpDamage: remaining,
    shieldAbsorbed: absorbed,
    isHit,
    isFullBlock,
  };
}

export function isCombatHit(postBlockDamage: number): boolean {
  return postBlockDamage > 0;
}

export function isCombatFullBlock(postBlockDamage: number): boolean {
  return postBlockDamage <= 0;
}
