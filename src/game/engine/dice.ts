import type { RulesetConfig } from '../types';

/** W6 result → combat bonus per rulebook §7. */
export function diceBonusFromRoll(roll: number, ruleset: RulesetConfig): number {
  const clamped = Math.max(1, Math.min(6, Math.floor(roll)));
  const entry = ruleset.diceBonusTable.find((r) => clamped >= r.min && clamped <= r.max);
  return entry?.bonus ?? 0;
}

/** Apply arena/modifier that shifts visible die result (e.g. Vulkan +1, cap 6). */
export function modifyDieRoll(roll: number, delta: number, max = 6): number {
  return Math.min(max, Math.max(1, roll + delta));
}

export function rollD6(rng: () => number = Math.random): number {
  return Math.floor(rng() * 6) + 1;
}
