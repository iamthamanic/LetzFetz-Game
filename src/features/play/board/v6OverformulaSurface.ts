/**
 * Detect when Play UI should offer the V6 Überformel activate path.
 * Location: src/features/play/board/v6OverformulaSurface.ts
 */
import type { GameState, PlayerId, RulesetConfig } from '../../../game/types';
import { isV6FormulaEnabled, maxFetzChargeFor } from '../../../game/types';
import { formulaComponentUsableForActivation } from '../../../game/engine/v6/fessel';

/**
 * True when Fetz is full and upright TEK is seated — engine would plan overformula.
 */
export function canOfferV6Overformula(
  state: GameState,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): boolean {
  if (!isV6FormulaEnabled(ruleset)) return false;
  if (state.players[playerId].fetzCharge < maxFetzChargeFor(ruleset)) return false;
  const formula = state.players[playerId].formula;
  const tech = formula.technik;
  const ess = formula.essenz;
  const kat = formula.katalysator;
  if (!tech || !ess || !kat) return false;
  return (
    formulaComponentUsableForActivation(tech) &&
    formulaComponentUsableForActivation(ess) &&
    formulaComponentUsableForActivation(kat)
  );
}
