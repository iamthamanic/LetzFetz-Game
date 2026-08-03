/**
 * V6 formula defense bands (contract §10 / spielkonzept §24).
 * Location: src/game/engine/v6/formulaDefense.ts
 *
 * 1–2 → 0 stages · 3–4 → 1 · 5–6 → 2 (+ suppressible rider removed)
 */
export function v6DefenseStagesFromRoll(naturalRoll: number): 0 | 1 | 2 {
  const roll = Math.max(1, Math.min(6, Math.floor(naturalRoll)));
  if (roll <= 2) return 0;
  if (roll <= 4) return 1;
  return 2;
}

export function applyV6DefenseToPrimary(
  primaryValue: number,
  stages: 0 | 1 | 2,
  formulaDefensePenalty: number,
): number {
  const effectiveStages = Math.max(0, stages + formulaDefensePenalty);
  return Math.max(0, primaryValue - effectiveStages);
}
