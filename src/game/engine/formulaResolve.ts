/**
 * V5 Formelaktivierung — Technik → Essenz → Katalysator resolve.
 * Location: src/game/engine/formulaResolve.ts
 */
import type {
  ContentPack,
  Element,
  FormulaPrepState,
  GameState,
  PlayerId,
  PrimaryMarkId,
  RulesetConfig,
} from '../types';
import { PRIMARY_MARK_IDS, clampShield } from '../types';
import { clampHp, cloneState, drawForPlayer } from './helpers';
import { opponentOf } from './createGame';
import { isFormulaResolvable } from './formulaCharge';
import { findFormulaComponentDef } from './formulaSlots';
import { listFormulaComponents } from './formulaChallenge';
import { removeStatus, getStatus } from './status/applyStatus';
import type { Rng } from './deck';

export function emptyFormulaPrep(): FormulaPrepState {
  return {
    attackCombatBonus: 0,
    attackIgnoreShield: 0,
    blockCombatBonus: 0,
    boostValueBonus: 0,
    mirrorShieldOnHit: 0,
    pendingSelfDamage: 0,
    stripShieldOnHpDamage: 0,
    impulseOnTie: false,
    thornsOnFullBlock: 0,
    reactionDamageBonus: 0,
    lifestealOnHp: 0,
    w6Bonus: 0,
    w6BonusMax: 0,
    boostFilterHandIfNoValue: false,
    mirrorThornsOnFullBlock: 0,
    chainSameActionBonus: 0,
  };
}

export function clearFormulaPrep(state: GameState, playerId: PlayerId): GameState {
  const next = cloneState(state);
  next.players[playerId].formulaPrep = null;
  return next;
}

function prepHasValue(prep: FormulaPrepState): boolean {
  return (
    prep.attackCombatBonus !== 0 ||
    prep.attackIgnoreShield !== 0 ||
    prep.blockCombatBonus !== 0 ||
    prep.boostValueBonus !== 0 ||
    prep.markIfNoReaction !== undefined ||
    prep.mirrorShieldOnHit !== 0 ||
    prep.stripShieldOnHpDamage !== 0 ||
    prep.impulseOnTie ||
    prep.thornsOnFullBlock !== 0 ||
    prep.reactionDamageBonus !== 0 ||
    prep.lifestealOnHp !== 0 ||
    prep.w6Bonus !== 0 ||
    prep.boostFilterHandIfNoValue ||
    prep.mirrorThornsOnFullBlock !== 0 ||
    prep.chainSameActionBonus !== 0 ||
    prep.preparedActionType != null ||
    prep.extraHitImpulse != null
  );
}

function firstOwnPrimaryMark(state: GameState, playerId: PlayerId): PrimaryMarkId | null {
  for (const id of PRIMARY_MARK_IDS) {
    if (getStatus(state, playerId, id)) return id;
  }
  return null;
}

function buffUsedStability(
  state: GameState,
  playerId: PlayerId,
  amount: number,
  usedSlots: Array<'technik' | 'essenz' | 'katalysator'>,
): void {
  const formula = state.players[playerId].formula;
  for (const slot of usedSlots) {
    const comp = formula[slot];
    if (comp) {
      formula[slot] = { ...comp, stabilityBonus: comp.stabilityBonus + amount };
    }
  }
}

function isFormulaCardDefId(pack: ContentPack, defId: string): boolean {
  return Boolean(
    pack.techniques?.some((c) => c.id === defId) ||
      pack.essences?.some((c) => c.id === defId) ||
      pack.catalysts?.some((c) => c.id === defId),
  );
}

function adjustEnemyStability(
  state: GameState,
  ownerId: PlayerId,
  amount: number,
): void {
  const opp = opponentOf(ownerId);
  const comps = listFormulaComponents(state.players[opp].formula);
  const first = comps[0];
  if (!first) return;
  const c = state.players[opp].formula[first.slot];
  if (c) {
    state.players[opp].formula[first.slot] = {
      ...c,
      stabilityBonus: c.stabilityBonus + amount,
    };
  }
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
  rng: Rng = () => 0.5,
): GameState {
  const formulaBoard = state.players[playerId].formula;
  if (!isFormulaResolvable(formulaBoard)) {
    throw new Error('Formula resolve requires at least two filled slots');
  }

  let next = cloneState(state);
  const formula = next.players[playerId].formula;
  const prep = emptyFormulaPrep();
  const usedNames: string[] = [];
  const usedSlots: Array<'technik' | 'essenz' | 'katalysator'> = [];
  let used = 0;
  let delayedPrimary = false;
  let safetyValve = false;
  let offerBonus = 0;
  let invertMax = 0;
  let mode: 'attack' | 'block' | 'boost' | 'instant' | null = null;
  let instantShieldApplied = 0;
  let instantHealApplied = 0;

  const technik = formula.technik;
  if (technik && !technik.exhausted && !technik.disturbed) {
    const def = findFormulaComponentDef(pack, technik.defId);
    if (def?.kind === 'technique') {
      usedNames.push(def.name);
      used += 1;
      usedSlots.push('technik');
      formula.technik = { ...technik, exhausted: true };
      const fx = def.formulaEffect;
      if (fx) {
        switch (fx.kind) {
          case 'instant_shield':
            mode = 'instant';
            instantShieldApplied += fx.amount;
            next.players[playerId].shield = clampShield(
              (next.players[playerId].shield ?? 0) + fx.amount,
            );
            break;
          case 'instant_heal':
            mode = 'instant';
            instantHealApplied += fx.amount;
            next.players[playerId].hp = clampHp(
              next.players[playerId].hp + fx.amount,
              ruleset,
            );
            break;
          case 'instant_clear_own_mark': {
            mode = 'instant';
            const mark = firstOwnPrimaryMark(next, playerId);
            if (mark) next = removeStatus(next, playerId, mark);
            break;
          }
          case 'instant_enemy_stability':
            mode = 'instant';
            adjustEnemyStability(next, playerId, fx.amount);
            break;
          case 'instant_retrieve_formula': {
            mode = 'instant';
            const discard = next.piles.discard;
            const idx = discard.findIndex((c) => isFormulaCardDefId(pack, c.defId));
            if (idx >= 0) {
              const [card] = discard.splice(idx, 1);
              if (card) next.players[playerId].hand.push(card);
              if (next.players[playerId].hand.length > 0) {
                const removed = next.players[playerId].hand.pop();
                if (removed) next.piles.discard.push(removed);
              }
            }
            break;
          }
          case 'enemy_next_attack_penalty': {
            mode = 'instant';
            const opp = opponentOf(playerId);
            const prev = next.meta.v5NextAttackPenalty ?? { p1: 0, p2: 0 };
            next.meta.v5NextAttackPenalty = {
              p1: prev.p1 ?? 0,
              p2: prev.p2 ?? 0,
              [opp]: (prev[opp] ?? 0) + fx.amount,
            };
            break;
          }
          case 'prep_attack':
            mode = 'attack';
            prep.attackCombatBonus += fx.combatBonus ?? 0;
            prep.attackIgnoreShield += fx.ignoreShield ?? 0;
            prep.stripShieldOnHpDamage += fx.stripShieldOnHpDamage ?? 0;
            if (fx.impulseOnTie) prep.impulseOnTie = true;
            break;
          case 'prep_block':
            mode = 'block';
            prep.blockCombatBonus += fx.combatBonus ?? 0;
            prep.thornsOnFullBlock += fx.thornsOnFullBlock ?? 0;
            break;
          case 'prep_boost':
            mode = 'boost';
            prep.boostValueBonus += fx.valueBonus ?? 0;
            if (fx.filterHandIfNoValue) prep.boostFilterHandIfNoValue = true;
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
      usedSlots.push('essenz');
      formula.essenz = { ...essenz, exhausted: true };
      const fx = def.formulaEffect;
      if (fx) {
        switch (fx.kind) {
          case 'mark_if_no_reaction':
            prep.markIfNoReaction = fx.mark;
            break;
          case 'reaction_bonus_then_stability':
            prep.reactionDamageBonus += fx.reactionDamageBonus;
            buffUsedStability(next, playerId, fx.stabilityDelta, usedSlots);
            break;
          case 'amplify_heal_or_shield':
            if (instantShieldApplied > 0) {
              next.players[playerId].shield = clampShield(
                (next.players[playerId].shield ?? 0) + fx.amount,
              );
            } else if (instantHealApplied > 0) {
              next.players[playerId].hp = clampHp(
                next.players[playerId].hp + fx.amount,
                ruleset,
              );
            } else {
              prep.attackCombatBonus += fx.amount;
              prep.blockCombatBonus += fx.amount;
              prep.boostValueBonus += fx.amount;
            }
            break;
          case 'stability_buff_used':
            buffUsedStability(next, playerId, fx.amount, usedSlots);
            break;
          case 'w6_bonus':
            prep.w6Bonus += fx.amount;
            prep.w6BonusMax = Math.max(prep.w6BonusMax, fx.max);
            break;
          case 'clear_mark_or_shield': {
            const mark = firstOwnPrimaryMark(next, playerId);
            if (mark) {
              next = removeStatus(next, playerId, mark);
            } else {
              next.players[playerId].shield = clampShield(
                (next.players[playerId].shield ?? 0) + 1,
              );
            }
            break;
          }
          case 'lifesteal_on_hp':
            prep.lifestealOnHp += fx.amount;
            break;
        }
      }
    }
  }

  const katalysator = formula.katalysator;
  if (katalysator && !katalysator.exhausted && !katalysator.disturbed) {
    const def = findFormulaComponentDef(pack, katalysator.defId);
    if (def?.kind === 'catalyst') {
      usedNames.push(def.name);
      used += 1;
      usedSlots.push('katalysator');
      formula.katalysator = { ...katalysator, exhausted: true };
      const fx = def.formulaEffect;
      if (fx) {
        switch (fx.kind) {
          case 'primary_bonus':
            prep.attackCombatBonus += fx.amount;
            prep.blockCombatBonus += fx.amount;
            prep.boostValueBonus += fx.amount;
            prep.pendingSelfDamage += fx.selfDamage ?? 0;
            if (fx.stabilityBuffUsed) {
              buffUsedStability(next, playerId, fx.stabilityBuffUsed, usedSlots);
            }
            if (fx.drawDiscardAfter) {
              next = drawForPlayer(next, playerId, 1, rng, ruleset, { allowExtra: true });
              if (next.players[playerId].hand.length > 0) {
                const removed = next.players[playerId].hand.pop();
                if (removed) next.piles.discard.push(removed);
              }
            }
            break;
          case 'mirror_shield_on_hit':
            if (mode === 'block') {
              prep.mirrorThornsOnFullBlock += fx.amount;
            } else if (mode === 'instant' && instantShieldApplied > 0) {
              const opp = opponentOf(playerId);
              next.players[opp].hp = clampHp(
                next.players[opp].hp - fx.amount,
                ruleset,
              );
            } else {
              prep.mirrorShieldOnHit += fx.amount;
            }
            break;
          case 'echo_next_start': {
            const primary = Math.max(
              Math.abs(prep.attackCombatBonus),
              Math.abs(prep.blockCombatBonus),
              Math.abs(prep.boostValueBonus),
              1,
            );
            const echoAmt = Math.min(fx.amount, primary);
            const prev = next.meta.v5EchoPrimary ?? { p1: 0, p2: 0 };
            next.meta.v5EchoPrimary = {
              p1: prev.p1 ?? 0,
              p2: prev.p2 ?? 0,
              [playerId]: (prev[playerId] ?? 0) + echoAmt,
            };
            if (fx.stayExhausted && formula.katalysator) {
              const keep = next.meta.v5KeepExhaustedFormula ?? { p1: [], p2: [] };
              next.meta.v5KeepExhaustedFormula = {
                p1: [...(keep.p1 ?? [])],
                p2: [...(keep.p2 ?? [])],
                [playerId]: [...(keep[playerId] ?? []), formula.katalysator.instanceId],
              };
            }
            break;
          }
          case 'spread_stability': {
            if (mode === 'attack') {
              adjustEnemyStability(next, playerId, -fx.amount);
            } else {
              const comps = listFormulaComponents(formula);
              const first = comps[0];
              if (first) {
                const c = formula[first.slot];
                if (c) {
                  formula[first.slot] = {
                    ...c,
                    stabilityBonus: c.stabilityBonus + fx.amount,
                  };
                }
              }
            }
            break;
          }
          case 'chain_same_action':
            prep.chainSameActionBonus += fx.amount;
            break;
          case 'delay_primary':
            delayedPrimary = true;
            prep.attackCombatBonus += fx.bonus;
            prep.blockCombatBonus += fx.bonus;
            prep.boostValueBonus += fx.bonus;
            break;
          case 'invert_damage_heal':
            invertMax = fx.maxPoints;
            break;
          case 'offer_discard_for_bonus':
            offerBonus = fx.amount;
            break;
          case 'safety_valve':
            safetyValve = true;
            break;
        }
      }
    }
  }

  if (used === 0) throw new Error('No activatable formula components');

  if (offerBonus > 0 && next.players[playerId].hand.length > 0) {
    const removed = next.players[playerId].hand.pop();
    if (removed) {
      next.piles.discard.push(removed);
      prep.attackCombatBonus += offerBonus;
      prep.blockCombatBonus += offerBonus;
      prep.boostValueBonus += offerBonus;
    }
  }

  if (invertMax > 0) {
    if (prep.pendingSelfDamage > 0) {
      const pts = Math.min(invertMax, prep.pendingSelfDamage);
      prep.pendingSelfDamage -= pts;
      next.players[playerId].hp = clampHp(next.players[playerId].hp + pts, ruleset);
    } else {
      const healLike = Math.min(
        invertMax,
        Math.max(0, prep.boostValueBonus, prep.blockCombatBonus),
      );
      if (healLike > 0) {
        prep.boostValueBonus = Math.max(0, prep.boostValueBonus - healLike);
        prep.blockCombatBonus = Math.max(0, prep.blockCombatBonus - healLike);
        const opp = opponentOf(playerId);
        next.players[opp].hp = clampHp(next.players[opp].hp - healLike, ruleset);
      }
    }
  }

  if (prep.pendingSelfDamage > 0) {
    if (safetyValve) {
      prep.pendingSelfDamage = 0;
      const mark = firstOwnPrimaryMark(next, playerId);
      if (mark) next = removeStatus(next, playerId, mark);
    } else {
      next.players[playerId].hp = clampHp(
        next.players[playerId].hp - prep.pendingSelfDamage,
        ruleset,
      );
      prep.pendingSelfDamage = 0;
    }
  } else if (safetyValve) {
    const mark = firstOwnPrimaryMark(next, playerId);
    if (mark) next = removeStatus(next, playerId, mark);
  }

  if (delayedPrimary) {
    const deferred =
      prep.attackCombatBonus || prep.blockCombatBonus || prep.boostValueBonus;
    const prev = next.meta.v5DelayedPrimary ?? { p1: 0, p2: 0 };
    next.meta.v5DelayedPrimary = {
      p1: prev.p1 ?? 0,
      p2: prev.p2 ?? 0,
      [playerId]: (prev[playerId] ?? 0) + deferred,
    };
    prep.attackCombatBonus = 0;
    prep.blockCombatBonus = 0;
    prep.boostValueBonus = 0;
  }

  if (mode === 'attack' || mode === 'block' || mode === 'boost') {
    prep.preparedActionType = mode;
  }

  next.players[playerId].formulaPrep = prepHasValue(prep) ? prep : null;
  next.phase = 'action';
  next.lastEvent = `Formel aktiviert (${usedNames.join(' + ') || `${used} Komponenten`}).`;
  return next;
}

function clearPrepIfEmpty(prep: FormulaPrepState): FormulaPrepState | null {
  return prepHasValue(prep) ? prep : null;
}

/** Consume attack prep bonuses into combat value; leave other prep fields. */
export function takeAttackPrepBonus(state: GameState, playerId: PlayerId): {
  state: GameState;
  combatBonus: number;
  ignoreShield: number;
  extraHitImpulse: Element | null;
} {
  const prep = state.players[playerId].formulaPrep;
  if (!prep) return { state, combatBonus: 0, ignoreShield: 0, extraHitImpulse: null };
  const combatBonus = prep.attackCombatBonus;
  const ignoreShield = prep.attackIgnoreShield;
  const extraHitImpulse = prep.extraHitImpulse ?? null;
  const next = cloneState(state);
  const p = next.players[playerId].formulaPrep;
  if (p) {
    p.attackCombatBonus = 0;
    p.attackIgnoreShield = 0;
    p.extraHitImpulse = undefined;
    next.players[playerId].formulaPrep = clearPrepIfEmpty(p);
  }
  return { state: next, combatBonus, ignoreShield, extraHitImpulse };
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
    next.players[playerId].formulaPrep = clearPrepIfEmpty(p);
  }
  return { state: next, combatBonus };
}

/** Consume boost prep: numeric value bonus and/or filter-hand flag. */
export function takeBoostPrepBonus(state: GameState, playerId: PlayerId): {
  state: GameState;
  valueBonus: number;
  filterHandIfNoValue: boolean;
} {
  const prep = state.players[playerId].formulaPrep;
  if (!prep) return { state, valueBonus: 0, filterHandIfNoValue: false };
  if (prep.boostValueBonus === 0 && !prep.boostFilterHandIfNoValue) {
    return { state, valueBonus: 0, filterHandIfNoValue: false };
  }
  const valueBonus = prep.boostValueBonus;
  const filterHandIfNoValue = prep.boostFilterHandIfNoValue;
  const next = cloneState(state);
  const p = next.players[playerId].formulaPrep;
  if (p) {
    p.boostValueBonus = 0;
    p.boostFilterHandIfNoValue = false;
    next.players[playerId].formulaPrep = clearPrepIfEmpty(p);
  }
  return { state: next, valueBonus, filterHandIfNoValue };
}

/** After a successful prepared action, arm Kettenkopplung for the next same-type action. */
export function armChainSameAction(
  state: GameState,
  playerId: PlayerId,
  action: 'attack' | 'block' | 'boost',
): GameState {
  const prep = state.players[playerId].formulaPrep;
  if (!prep || prep.chainSameActionBonus <= 0) return state;
  if (prep.preparedActionType && prep.preparedActionType !== action) return state;
  const next = cloneState(state);
  const bonus = prep.chainSameActionBonus;
  const p = next.players[playerId].formulaPrep;
  if (p) {
    p.chainSameActionBonus = 0;
    p.preparedActionType = undefined;
    next.players[playerId].formulaPrep = clearPrepIfEmpty(p);
  }
  next.meta.v5ChainSameAction = {
    ...(next.meta.v5ChainSameAction ?? { p1: null, p2: null }),
    [playerId]: { action, bonus },
  };
  return next;
}

/** Consume armed Kettenkopplung bonus for a matching action type. */
export function takeChainSameActionBonus(
  state: GameState,
  playerId: PlayerId,
  action: 'attack' | 'block' | 'boost',
): { state: GameState; bonus: number } {
  const armed = state.meta.v5ChainSameAction?.[playerId];
  if (!armed || armed.action !== action || armed.bonus <= 0) {
    return { state, bonus: 0 };
  }
  const next = cloneState(state);
  next.meta.v5ChainSameAction = {
    ...(next.meta.v5ChainSameAction ?? { p1: null, p2: null }),
    [playerId]: null,
  };
  return { state: next, bonus: armed.bonus };
}

/** Consume reaction damage bonus once (Explosionspüree). */
export function takeReactionDamageBonus(
  state: GameState,
  playerId: PlayerId,
): { state: GameState; bonus: number } {
  const prep = state.players[playerId].formulaPrep;
  if (!prep || prep.reactionDamageBonus <= 0) return { state, bonus: 0 };
  const bonus = prep.reactionDamageBonus;
  const next = cloneState(state);
  const p = next.players[playerId].formulaPrep;
  if (p) {
    p.reactionDamageBonus = 0;
    next.players[playerId].formulaPrep = clearPrepIfEmpty(p);
  }
  return { state: next, bonus };
}

/** Apply Echo / delayed primary at start of owner's turn; keep Doppelecho exhausted. */
export function applyV5StartFormulaMeta(
  state: GameState,
  playerId: PlayerId,
): GameState {
  const next = cloneState(state);
  const echo = next.meta.v5EchoPrimary?.[playerId] ?? 0;
  const delayed = next.meta.v5DelayedPrimary?.[playerId] ?? 0;
  const bonus = echo + delayed;
  if (bonus !== 0) {
    const prep = next.players[playerId].formulaPrep ?? emptyFormulaPrep();
    prep.attackCombatBonus += bonus;
    prep.blockCombatBonus += bonus;
    prep.boostValueBonus += bonus;
    next.players[playerId].formulaPrep = prep;
  }
  if (next.meta.v5EchoPrimary) {
    next.meta.v5EchoPrimary = { ...next.meta.v5EchoPrimary, [playerId]: 0 };
  }
  if (next.meta.v5DelayedPrimary) {
    next.meta.v5DelayedPrimary = { ...next.meta.v5DelayedPrimary, [playerId]: 0 };
  }

  const keepIds = next.meta.v5KeepExhaustedFormula?.[playerId] ?? [];
  if (keepIds.length > 0) {
    const board = next.players[playerId].formula;
    for (const slot of ['technik', 'essenz', 'katalysator'] as const) {
      const comp = board[slot];
      if (comp && keepIds.includes(comp.instanceId)) {
        board[slot] = { ...comp, exhausted: true };
      }
    }
    next.meta.v5KeepExhaustedFormula = {
      ...(next.meta.v5KeepExhaustedFormula ?? { p1: [], p2: [] }),
      [playerId]: [],
    };
  }
  return next;
}

/** Consume Sperrkreis penalty for the attacking player. */
export function takeEnemyAttackPenalty(
  state: GameState,
  attackerId: PlayerId,
): { state: GameState; penalty: number } {
  const penalty = state.meta.v5NextAttackPenalty?.[attackerId] ?? 0;
  if (penalty <= 0) return { state, penalty: 0 };
  const next = cloneState(state);
  next.meta.v5NextAttackPenalty = {
    ...(next.meta.v5NextAttackPenalty ?? { p1: 0, p2: 0 }),
    [attackerId]: 0,
  };
  return { state: next, penalty };
}
