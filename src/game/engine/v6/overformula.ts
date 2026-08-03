/**
 * V6 Überformel bonus choice (#385).
 * Location: src/game/engine/v6/overformula.ts
 *
 * Player picks +2 Primär XOR +1 Intensität. Omitted choice → primary fallback.
 */
export type V6OverformulaBonusChoice = 'primary' | 'intensity';

export const V6_OVERFORMULA_DEFAULT_PRIMARY_BONUS = 2;

/** Intensity bump when player chooses intensity (or prep/fessel fallback path). */
export const V6_OVERFORMULA_DEFAULT_INTENSITY_BONUS = 1;

/** Fallback when UI/bot omits an explicit choice. */
export const V6_OVERFORMULA_FALLBACK_CHOICE: V6OverformulaBonusChoice = 'primary';

export function resolveOverformulaBonusChoice(
  choice: V6OverformulaBonusChoice | null | undefined,
): V6OverformulaBonusChoice {
  return choice === 'intensity' || choice === 'primary'
    ? choice
    : V6_OVERFORMULA_FALLBACK_CHOICE;
}

/**
 * Bot heuristic: numeric life-effect primaries prefer +2 Primär;
 * prep / fessel prefer +1 Intensität.
 */
export function pickBotOverformulaBonusChoice(primaryKind: string): V6OverformulaBonusChoice {
  if (
    primaryKind === 'prep_attack' ||
    primaryKind === 'prep_block' ||
    primaryKind === 'prep_boost' ||
    primaryKind === 'fessel'
  ) {
    return 'intensity';
  }
  return 'primary';
}
