/**
 * V6 arena combat / start hooks (#350).
 * Location: src/game/engine/v6/arenas.ts
 *
 * Under v6Formula: no V1 d6Variants; V6-adapted Späti/Kristall/Vulkan/Sumpf/Club/Basar.
 */
import type {
  ContentPack,
  Element,
  FormulaComponentInstance,
  GameState,
  PlayerId,
  RulesetConfig,
} from '../../types';
import { isV6FormulaEnabled } from '../../types';
import { isBasar, isClub, isKristall, isSumpf, isVulkan } from '../arena';
import { formulaChallengeOutcome, type FormulaChallengeOutcome } from '../formulaChallenge';
import { findEssenceDef } from '../formulaSlots';
import { cloneState, clampHp } from '../helpers';
import { addShield } from '../status/applyStatus';

function isV6ArenaRules(state: GameState, ruleset: RulesetConfig): boolean {
  return isV6FormulaEnabled(ruleset) || state.meta.v6FormulaEnabled === true;
}

/** Skip V1 W6-variant Vulkan bonus under V6 — use first-damage +1 instead. */
export function shouldSkipLegacyVulkanW6(
  state: GameState,
  ruleset: RulesetConfig,
): boolean {
  return isV6ArenaRules(state, ruleset) && isVulkan(state);
}

/** Skip V1 Sumpf W6 block bonus under V6. */
export function shouldSkipLegacySumpfW6(
  state: GameState,
  ruleset: RulesetConfig,
): boolean {
  return isV6ArenaRules(state, ruleset) && isSumpf(state);
}

/**
 * First opponent-directed attack damage effect this turn: +1 attack value.
 * Marks vulkanAttackBonusUsed for the attacker.
 */
export function applyV6VulkanFirstDamageBonus(
  state: GameState,
  attackerId: PlayerId,
  attackValue: number,
  ruleset: RulesetConfig,
): { state: GameState; attackValue: number } {
  if (!isV6ArenaRules(state, ruleset) || !isVulkan(state)) {
    return { state, attackValue };
  }
  if (state.meta.vulkanAttackBonusUsed[attackerId]) {
    return { state, attackValue };
  }
  const next = cloneState(state);
  next.meta = {
    ...next.meta,
    vulkanAttackBonusUsed: { ...next.meta.vulkanAttackBonusUsed, [attackerId]: true },
  };
  return { state: next, attackValue: attackValue + 1 };
}

/** Club: +1 combat value on air attack/block (Arena W6-bonus proxy). */
export function v6ClubAirValueBonus(
  state: GameState,
  cardElement: Element,
  ruleset: RulesetConfig,
): number {
  if (!isV6ArenaRules(state, ruleset) || !isClub(state)) return 0;
  return cardElement === 'air' ? 1 : 0;
}

/** Kristall: Licht-Essenz +1 printed stability. */
export function v6KristallEssenceStabilityBonus(
  state: GameState,
  pack: ContentPack,
  comp: FormulaComponentInstance,
  ruleset: RulesetConfig,
): number {
  if (!isV6ArenaRules(state, ruleset) || !isKristall(state)) return 0;
  const def = findEssenceDef(pack, comp.defId);
  return def?.element === 'light' ? 1 : 0;
}

/** Sumpf V6: destroy only at diff ≥ 4 (else disturb). */
export function v6FormulaChallengeOutcome(
  state: GameState,
  attackValue: number,
  defenseValue: number,
  alreadyDisturbed: boolean,
  ruleset: RulesetConfig,
): FormulaChallengeOutcome {
  if (!isV6ArenaRules(state, ruleset) || !isSumpf(state)) {
    return formulaChallengeOutcome(attackValue, defenseValue, alreadyDisturbed);
  }
  const diff = attackValue - defenseValue;
  if (diff <= 0) return 'none';
  if (alreadyDisturbed) return 'destroy';
  if (diff >= 4) return 'destroy';
  return 'disturb';
}

/** Sumpf V6: Vollblock → +1 Schild (instead of V1 draw/discard). */
export function applyV6SumpfFullBlockShield(
  state: GameState,
  defenderId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  if (!isV6ArenaRules(state, ruleset) || !isSumpf(state)) return state;
  let next = addShield(state, defenderId, 1);
  next.lastEvent = `${next.lastEvent ?? ''} Sumpf: Vollblock — +1 Schild.`.trim();
  return next;
}

/** Whether Club should filter after FORMULA_REPLACE. */
export function shouldQueueV6ClubReplaceFilter(
  state: GameState,
  ruleset: RulesetConfig,
): boolean {
  return isV6ArenaRules(state, ruleset) && isClub(state);
}

/** Basar: after disturb, attacker may pay 1 life to destroy. */
export function shouldOfferV6BasarPayDestroy(
  state: GameState,
  ruleset: RulesetConfig,
): boolean {
  return isV6ArenaRules(state, ruleset) && isBasar(state);
}

export function applyV6BasarPayDestroy(
  state: GameState,
  attackerId: PlayerId,
  defenderId: PlayerId,
  targetInstanceId: string,
  ruleset: RulesetConfig,
  destroy: (
    board: GameState['players']['p1']['formula'],
    instanceId: string,
  ) => {
    board: GameState['players']['p1']['formula'];
    removed: FormulaComponentInstance | null;
  },
): GameState {
  const next = cloneState(state);
  next.players[attackerId].hp = clampHp(next.players[attackerId].hp - 1, ruleset);
  const destroyed = destroy(next.players[defenderId].formula, targetInstanceId);
  next.players[defenderId].formula = destroyed.board;
  if (destroyed.removed) {
    next.piles.discard.push({
      instanceId: destroyed.removed.instanceId,
      defId: destroyed.removed.defId,
    });
  }
  next.pendingChoice = null;
  next.phase = 'end';
  next.lastEvent = `Basar: 1 Leben gezahlt — Komponente zerstört.`;
  return next;
}
