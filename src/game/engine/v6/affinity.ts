/**
 * V6 Affinity ±1 spend helpers (§28.1).
 * Location: src/game/engine/v6/affinity.ts
 */
import type {
  ContentPack,
  Element,
  GameState,
  PlayerId,
  RulesetConfig,
} from '../../types';
import { isV6FormulaEnabled } from '../../types';
import { getCharacterElements } from '../helpers';
import { diceBonusFromRoll, modifyDieRoll } from '../dice';
import { findEssenceDef } from '../formulaSlots';
import { formulaComponentUsableForActivation } from './fessel';

export type V6AffinityMode = 'none' | 'value-plus' | 'dice-plus' | 'dice-minus';

function isV6AffinityAvailable(state: GameState, playerId: PlayerId): boolean {
  if (!state.meta.v6FormulaEnabled) return false;
  const flag = state.meta.v6AffinityAvailable?.[playerId];
  // Missing map ⇒ treat as available (first spend / pre-reset).
  return flag !== false;
}

export function markV6AffinitySpent(state: GameState, playerId: PlayerId): GameState {
  return {
    ...state,
    meta: {
      ...state.meta,
      v6AffinityAvailable: {
        p1: state.meta.v6AffinityAvailable?.p1 ?? true,
        p2: state.meta.v6AffinityAvailable?.p2 ?? true,
        [playerId]: false,
      },
    },
  };
}

function characterHasAffinityElement(
  pack: ContentPack,
  characterId: string,
  element: Element,
): boolean {
  return getCharacterElements(pack, characterId).includes(element);
}

/** Offer Affinity when V6, available, and card element matches character affinities. */
export function shouldOfferV6Affinity(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  cardElement: Element,
  ruleset: RulesetConfig,
): boolean {
  if (!isV6FormulaEnabled(ruleset) && !state.meta.v6FormulaEnabled) return false;
  if (!isV6AffinityAvailable(state, playerId)) return false;
  const characterId = state.players[playerId].characterId;
  return characterHasAffinityElement(pack, characterId, cardElement);
}

/**
 * Block Affinity only on own action turn — not when defending on the opponent's turn.
 */
export function shouldOfferV6AffinityOnBlock(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  cardElement: Element,
  ruleset: RulesetConfig,
): boolean {
  if (state.activePlayer !== playerId) return false;
  return shouldOfferV6Affinity(state, pack, playerId, cardElement, ruleset);
}

/** Essence element of the activating formula (TE/TEK/EK), if usable. */
export function formulaAffinityElement(
  pack: ContentPack,
  state: GameState,
  playerId: PlayerId,
): Element | null {
  const ess = state.players[playerId].formula.essenz;
  if (!ess || !formulaComponentUsableForActivation(ess)) return null;
  return findEssenceDef(pack, ess.defId)?.element ?? null;
}

/**
 * Apply Affinity mode to a rolled combat value.
 * Dice modes shift the visible W6 (clamped 1–6) and adjust by dice-bonus delta.
 */
export function applyV6AffinityMode(
  diceRoll: number,
  baseValue: number,
  mode: V6AffinityMode,
  ruleset: RulesetConfig,
): { diceRoll: number; value: number; spent: boolean } {
  if (mode === 'none') {
    return { diceRoll, value: baseValue, spent: false };
  }
  if (mode === 'value-plus') {
    return { diceRoll, value: baseValue + 1, spent: true };
  }
  const delta = mode === 'dice-plus' ? 1 : -1;
  const newRoll = modifyDieRoll(diceRoll, delta);
  const bonusDelta = diceBonusFromRoll(newRoll, ruleset) - diceBonusFromRoll(diceRoll, ruleset);
  return { diceRoll: newRoll, value: baseValue + bonusDelta, spent: true };
}

/** Under V6, automatic V1/V5 character-element +1 is disabled (spend replaces it). */
export function characterElementsForCombat(
  pack: ContentPack,
  characterId: string,
  ruleset: RulesetConfig,
  metaV6?: boolean,
): Element[] {
  if (isV6FormulaEnabled(ruleset) || metaV6 === true) return [];
  return getCharacterElements(pack, characterId);
}
