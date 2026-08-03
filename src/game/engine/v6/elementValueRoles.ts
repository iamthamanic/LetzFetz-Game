/**
 * V6 §36 element value-role combat hooks (payoff / drawback).
 * Location: src/game/engine/v6/elementValueRoles.ts
 */
import type {
  ContentPack,
  ElementCardDef,
  GameState,
  PlayerId,
  RulesetConfig,
} from '../../types';
import { isV6FormulaEnabled } from '../../types';
import { opponentOf } from '../createGame';
import { clampHp, cloneState } from '../helpers';
import { findElementDef } from '../lookup';
import { listFormulaComponents } from '../formulaChallenge';

function opponentHasFessel(state: GameState, opponentId: PlayerId): boolean {
  return listFormulaComponents(state.players[opponentId].formula).some(
    (c) => (c.fesselIntensity ?? 0) > 0,
  );
}

/** Payoff (value 4): +1 combat when the opponent has any Fessel intensity. */
export function v6PayoffCombatBonus(
  state: GameState,
  playerId: PlayerId,
  def: ElementCardDef,
  ruleset: RulesetConfig,
): number {
  if (!isV6FormulaEnabled(ruleset) || def.valueRole !== 'payoff') return 0;
  return opponentHasFessel(state, opponentOf(playerId)) ? 1 : 0;
}

/** Drawback (value 6): after combat resolves, attacker loses 1 HP. */
export function applyV6DrawbackAfterCombat(
  state: GameState,
  attackerId: PlayerId,
  attackCardDefId: string | undefined,
  pack: ContentPack,
  ruleset: RulesetConfig,
): GameState {
  if (!isV6FormulaEnabled(ruleset) || !attackCardDefId) return state;
  const def = findElementDef(pack, attackCardDefId);
  if (def?.valueRole !== 'drawback') return state;
  const next = cloneState(state);
  next.players[attackerId].hp = clampHp(next.players[attackerId].hp - 1, ruleset);
  const prefix = next.lastEvent ? `${next.lastEvent} ` : '';
  next.lastEvent = `${prefix}Nachteil (Rohwert 6): −1 Leben.`.trim();
  return next;
}
