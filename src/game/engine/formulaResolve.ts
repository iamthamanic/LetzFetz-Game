/**
 * V5 Formelaktivierung — Technik → Essenz → Katalysator resolve.
 * Location: src/game/engine/formulaResolve.ts
 */
import type {
  ContentPack,
  FormulaPrepState,
  GameState,
  PlayerId,
  RulesetConfig,
} from '../types';
import { clampShield } from '../types';
import { clampHp, cloneState } from './helpers';
import { findFormulaComponentDef } from './formulaSlots';

export function emptyFormulaPrep(): FormulaPrepState {
  return {
    attackCombatBonus: 0,
    attackIgnoreShield: 0,
    blockCombatBonus: 0,
    boostValueBonus: 0,
    mirrorShieldOnHit: 0,
    pendingSelfDamage: 0,
  };
}

export function clearFormulaPrep(state: GameState, playerId: PlayerId): GameState {
  const next = cloneState(state);
  next.players[playerId].formulaPrep = null;
  return next;
}

/**
 * Resolve activate: apply instant effects, set prep, exhaust used components.
 * Order: Technik → Essenz → Katalysator (§15.1).
 */
export function resolveFormulaActivate(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  const next = cloneState(state);
  const formula = next.players[playerId].formula;
  const prep = emptyFormulaPrep();
  const usedNames: string[] = [];
  let used = 0;

  const technik = formula.technik;
  if (technik && !technik.exhausted && !technik.disturbed) {
    const def = findFormulaComponentDef(pack, technik.defId);
    if (def?.kind === 'technique') {
      usedNames.push(def.name);
      used += 1;
      formula.technik = { ...technik, exhausted: true };
      const fx = def.formulaEffect;
      if (fx) {
        switch (fx.kind) {
          case 'instant_shield':
            next.players[playerId].shield = clampShield(
              (next.players[playerId].shield ?? 0) + fx.amount,
            );
            break;
          case 'instant_heal':
            next.players[playerId].hp = clampHp(
              next.players[playerId].hp + fx.amount,
              ruleset,
            );
            break;
          case 'prep_attack':
            prep.attackCombatBonus += fx.combatBonus ?? 0;
            prep.attackIgnoreShield += fx.ignoreShield ?? 0;
            break;
          case 'prep_block':
            prep.blockCombatBonus += fx.combatBonus ?? 0;
            break;
          case 'prep_boost':
            prep.boostValueBonus += fx.valueBonus ?? 0;
            break;
        }
      }
    }
  }

  const essenz = formula.essenz;
  if (essenz && !essenz.exhausted && !essenz.disturbed) {
    const def = findFormulaComponentDef(pack, essenz.defId);
    if (def?.kind === 'essence') {
      usedNames.push(def.name);
      used += 1;
      formula.essenz = { ...essenz, exhausted: true };
      const fx = def.formulaEffect;
      if (fx?.kind === 'mark_if_no_reaction') {
        prep.markIfNoReaction = fx.mark;
      }
    }
  }

  const katalysator = formula.katalysator;
  if (katalysator && !katalysator.exhausted && !katalysator.disturbed) {
    const def = findFormulaComponentDef(pack, katalysator.defId);
    if (def?.kind === 'catalyst') {
      usedNames.push(def.name);
      used += 1;
      formula.katalysator = { ...katalysator, exhausted: true };
      const fx = def.formulaEffect;
      if (fx) {
        switch (fx.kind) {
          case 'primary_bonus':
            prep.attackCombatBonus += fx.amount;
            prep.blockCombatBonus += fx.amount;
            prep.boostValueBonus += fx.amount;
            prep.pendingSelfDamage += fx.selfDamage ?? 0;
            break;
          case 'mirror_shield_on_hit':
            prep.mirrorShieldOnHit += fx.amount;
            break;
        }
      }
    }
  }

  if (used === 0) throw new Error('No activatable formula components');

  if (prep.pendingSelfDamage > 0) {
    next.players[playerId].hp = clampHp(
      next.players[playerId].hp - prep.pendingSelfDamage,
      ruleset,
    );
    prep.pendingSelfDamage = 0;
  }

  const hasPrep =
    prep.attackCombatBonus !== 0 ||
    prep.attackIgnoreShield !== 0 ||
    prep.blockCombatBonus !== 0 ||
    prep.boostValueBonus !== 0 ||
    prep.markIfNoReaction !== undefined ||
    prep.mirrorShieldOnHit !== 0;

  next.players[playerId].formulaPrep = hasPrep ? prep : null;
  next.phase = 'action';
  next.lastEvent = `Formel aktiviert (${usedNames.join(' + ') || `${used} Komponenten`}).`;
  return next;
}

/** Consume attack prep bonuses into combat value; leave other prep fields. */
export function takeAttackPrepBonus(state: GameState, playerId: PlayerId): {
  state: GameState;
  combatBonus: number;
  ignoreShield: number;
} {
  const prep = state.players[playerId].formulaPrep;
  if (!prep) return { state, combatBonus: 0, ignoreShield: 0 };
  const combatBonus = prep.attackCombatBonus;
  const ignoreShield = prep.attackIgnoreShield;
  const next = cloneState(state);
  const p = next.players[playerId].formulaPrep;
  if (p) {
    p.attackCombatBonus = 0;
    p.attackIgnoreShield = 0;
    if (
      p.blockCombatBonus === 0 &&
      p.boostValueBonus === 0 &&
      !p.markIfNoReaction &&
      p.mirrorShieldOnHit === 0
    ) {
      next.players[playerId].formulaPrep = null;
    }
  }
  return { state: next, combatBonus, ignoreShield };
}

export function takeBlockPrepBonus(state: GameState, playerId: PlayerId): {
  state: GameState;
  combatBonus: number;
} {
  const prep = state.players[playerId].formulaPrep;
  if (!prep || prep.blockCombatBonus === 0) return { state, combatBonus: 0 };
  const combatBonus = prep.blockCombatBonus;
  const next = cloneState(state);
  const p = next.players[playerId].formulaPrep;
  if (p) {
    p.blockCombatBonus = 0;
    if (
      p.attackCombatBonus === 0 &&
      p.attackIgnoreShield === 0 &&
      p.boostValueBonus === 0 &&
      !p.markIfNoReaction &&
      p.mirrorShieldOnHit === 0
    ) {
      next.players[playerId].formulaPrep = null;
    }
  }
  return { state: next, combatBonus };
}
