/**
 * V6 feste Macken engine hooks (Option B, #349).
 * Location: src/game/engine/v6/mackes.ts
 *
 * Do not extend V5 characterPassives.ts — separate budget and triggers.
 */
import type {
  ContentPack,
  Element,
  GameState,
  PlayerId,
  RulesetConfig,
} from '../../types';
import { isV6FormulaEnabled } from '../../types';
import { cloneState, drawForPlayer, getCharacterElements } from '../helpers';
import { listFormulaComponents } from '../formulaChallenge';
import type { Rng } from '../deck';
import { getV6MackeForCharacter } from '../../packs/v6/mackes';

export type V6MackeScryMode = 'keep' | 'bottom' | 'swap';

function isV6(state: GameState, ruleset: RulesetConfig): boolean {
  return isV6FormulaEnabled(ruleset) || state.meta.v6FormulaEnabled === true;
}

function mackeUsed(state: GameState, playerId: PlayerId, mackeId: string): boolean {
  return (state.meta.v6MackeUsed?.[playerId] ?? []).includes(mackeId);
}

function markMackeUsed(state: GameState, playerId: PlayerId, mackeId: string): GameState {
  const next = cloneState(state);
  const prev = next.meta.v6MackeUsed ?? { p1: [], p2: [] };
  next.meta.v6MackeUsed = {
    p1: [...(prev.p1 ?? [])],
    p2: [...(prev.p2 ?? [])],
    [playerId]: [...(prev[playerId] ?? []), mackeId],
  };
  return next;
}

function characterMackeId(state: GameState, playerId: PlayerId): string | undefined {
  const characterId = state.players[playerId].characterId;
  return getV6MackeForCharacter(characterId)?.id;
}

function canTrigger(
  state: GameState,
  playerId: PlayerId,
  mackeId: string,
  ruleset: RulesetConfig,
): boolean {
  if (!isV6(state, ruleset)) return false;
  if (characterMackeId(state, playerId) !== mackeId) return false;
  if (mackeUsed(state, playerId, mackeId)) return false;
  return true;
}

/** Peek top N deck cards without drawing (for scry pending). */
function peekDeckTop(state: GameState, count: number): string[] {
  return state.piles.deck.slice(0, count).map((c) => c.instanceId);
}

function openScry(
  state: GameState,
  playerId: PlayerId,
  mackeId: string,
  count: number,
  label: string,
): GameState {
  if (state.pendingChoice) return state;
  const revealed = peekDeckTop(state, count);
  if (revealed.length === 0) {
    const next = markMackeUsed(state, playerId, mackeId);
    next.lastEvent = `${next.lastEvent ?? ''} ${label}: Deck leer.`.trim();
    return next;
  }
  let next = markMackeUsed(state, playerId, mackeId);
  next.pendingChoice = {
    type: 'v6-macke-scry',
    playerId,
    mackeId,
    revealedInstanceIds: revealed,
  };
  next.lastEvent = `${next.lastEvent ?? ''} ${label}: Scry ${revealed.length}.`.trim();
  return next;
}

/** Apply scry choice: keep order, move first to bottom, or swap top two. */
export function resolveV6MackeScry(
  state: GameState,
  playerId: PlayerId,
  mode: V6MackeScryMode,
): GameState {
  const pending = state.pendingChoice;
  if (pending?.type !== 'v6-macke-scry') throw new Error('No V6 Macke scry pending');
  if (pending.playerId !== playerId) throw new Error('Not Macke scry chooser');

  const next = cloneState(state);
  next.pendingChoice = null;
  const ids = pending.revealedInstanceIds;
  const deck = next.piles.deck;
  if (ids.length === 0 || deck.length === 0) {
    next.lastEvent = 'Macke Scry: nichts zu ordnen.';
    return next;
  }

  // Ensure revealed cards are still on top in the same relative order.
  const top = deck.slice(0, ids.length);
  const rest = deck.slice(ids.length);
  const byId = new Map(top.map((c) => [c.instanceId, c]));
  const ordered = ids.map((id) => byId.get(id)).filter((c): c is (typeof top)[number] => Boolean(c));
  if (ordered.length === 0) {
    next.lastEvent = 'Macke Scry: Karten nicht mehr oben.';
    return next;
  }

  let newTop = ordered;
  if (mode === 'bottom' && ordered.length >= 1) {
    const [first, ...mid] = ordered;
    newTop = [...mid];
    next.piles.deck = [...newTop, ...rest, first];
    next.lastEvent = 'Macke Scry: oberste Karte unterlegt.';
    return next;
  }
  if (mode === 'swap' && ordered.length >= 2) {
    newTop = [ordered[1], ordered[0], ...ordered.slice(2)];
  }
  next.piles.deck = [...newTop, ...rest];
  next.lastEvent =
    mode === 'swap' ? 'Macke Scry: oberste zwei getauscht.' : 'Macke Scry: Reihenfolge behalten.';
  return next;
}

/** Track Formeländerung; Resteverwertung on 2nd. */
export function noteV6FormulaChange(
  state: GameState,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  if (!isV6(state, ruleset)) return state;
  const next = cloneState(state);
  const prev = next.meta.v6FormulaChangesThisTurn ?? { p1: 0, p2: 0 };
  const count = (prev[playerId] ?? 0) + 1;
  next.meta.v6FormulaChangesThisTurn = {
    p1: prev.p1 ?? 0,
    p2: prev.p2 ?? 0,
    [playerId]: count,
  };
  if (count !== 2) return next;
  if (!canTrigger(next, playerId, 'resteverwertung', ruleset)) return next;
  return openScry(next, playerId, 'resteverwertung', 1, 'Resteverwertung');
}

/** Schluckspecht — after Vollblock. */
export function tryV6ErstMalGucken(
  state: GameState,
  defenderId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  if (!canTrigger(state, defenderId, 'erst-mal-gucken', ruleset)) return state;
  return openScry(state, defenderId, 'erst-mal-gucken', 2, 'Erst mal gucken');
}

/** Stiernacken — after HP damage: last hand under deck, draw 1. */
export function tryV6JetztErstRecht(
  state: GameState,
  damagedPlayerId: PlayerId,
  hpDamage: number,
  rng: Rng,
  ruleset: RulesetConfig,
): GameState {
  if (hpDamage <= 0) return state;
  if (!canTrigger(state, damagedPlayerId, 'jetzt-erst-recht', ruleset)) return state;

  let next = markMackeUsed(state, damagedPlayerId, 'jetzt-erst-recht');
  const hand = next.players[damagedPlayerId].hand;
  if (hand.length > 0) {
    const card = hand.pop();
    if (card) next.piles.deck.push(card);
  }
  next = drawForPlayer(next, damagedPlayerId, 1, rng, ruleset, { allowExtra: true });
  next.lastEvent = `${next.lastEvent ?? ''} Jetzt erst recht: 1 unter Stapel, 1 gezogen.`.trim();
  return next;
}

/** Kokabell — after heal or shield gain: +1 stability on first own component. */
export function tryV6Nachjustiert(
  state: GameState,
  playerId: PlayerId,
  gained: number,
  ruleset: RulesetConfig,
): GameState {
  if (gained <= 0) return state;
  if (!canTrigger(state, playerId, 'nachjustiert', ruleset)) return state;

  const comps = listFormulaComponents(state.players[playerId].formula);
  if (comps.length === 0) return state;

  let next = markMackeUsed(state, playerId, 'nachjustiert');
  const first = comps[0];
  const c = next.players[playerId].formula[first.slot];
  if (c) {
    next.players[playerId].formula[first.slot] = {
      ...c,
      stabilityBonus: c.stabilityBonus + 1,
    };
  }
  next.lastEvent = `${next.lastEvent ?? ''} Nachjustiert: +1 Stabilität.`.trim();
  return next;
}

/** Pillendoktora — after boost: draw then must-discard. */
export function tryV6Dosisaenderung(
  state: GameState,
  playerId: PlayerId,
  rng: Rng,
  ruleset: RulesetConfig,
): GameState {
  if (!canTrigger(state, playerId, 'dosisaenderung', ruleset)) return state;
  if (state.pendingChoice) return state;

  let next = markMackeUsed(state, playerId, 'dosisaenderung');
  next = drawForPlayer(next, playerId, 1, rng, ruleset, { allowExtra: true });
  if (next.players[playerId].hand.length === 0) {
    next.lastEvent = `${next.lastEvent ?? ''} Dosisänderung: gezogen (nichts abzuwerfen).`.trim();
    return next;
  }
  next.pendingChoice = {
    type: 'must-discard',
    playerId,
    source: 'v6-dosisaenderung',
  };
  next.lastEvent = `${next.lastEvent ?? ''} Dosisänderung: 1 gezogen — wirf 1 ab.`.trim();
  return next;
}

/** Dripministerin — after opponent formula disturb: Scry 1. */
export function tryV6SchwachstelleErkannt(
  state: GameState,
  playerId: PlayerId,
  ruleset: RulesetConfig,
): GameState {
  if (!canTrigger(state, playerId, 'schwachstelle-erkannt', ruleset)) return state;
  return openScry(state, playerId, 'schwachstelle-erkannt', 1, 'Schwachstelle erkannt');
}

/** Whether Falsche Farbe can expand Affinity to a non-affinity element. */
export function canUseV6FalscheFarbe(
  state: GameState,
  pack: ContentPack,
  playerId: PlayerId,
  cardElement: Element,
  ruleset: RulesetConfig,
): boolean {
  if (!canTrigger(state, playerId, 'falsche-farbe', ruleset)) return false;
  const characterId = state.players[playerId].characterId;
  const affinities = getCharacterElements(pack, characterId);
  return !affinities.includes(cardElement);
}

/** Arm Falsche Farbe for the upcoming Affinity spend on this action. */
export function armV6FalscheFarbe(state: GameState, playerId: PlayerId): GameState {
  const next = cloneState(state);
  next.meta.v6FalscheFarbeArmed = {
    p1: next.meta.v6FalscheFarbeArmed?.p1 ?? false,
    p2: next.meta.v6FalscheFarbeArmed?.p2 ?? false,
    [playerId]: true,
  };
  return next;
}

/** Consume armed Falsche Farbe when Affinity is actually spent. */
export function consumeV6FalscheFarbeIfArmed(
  state: GameState,
  playerId: PlayerId,
  affinitySpent: boolean,
): GameState {
  if (!affinitySpent) {
    if (!state.meta.v6FalscheFarbeArmed?.[playerId]) return state;
    const next = cloneState(state);
    next.meta.v6FalscheFarbeArmed = {
      p1: next.meta.v6FalscheFarbeArmed?.p1 ?? false,
      p2: next.meta.v6FalscheFarbeArmed?.p2 ?? false,
      [playerId]: false,
    };
    return next;
  }
  if (!state.meta.v6FalscheFarbeArmed?.[playerId]) return state;
  let next = markMackeUsed(state, playerId, 'falsche-farbe');
  next.meta.v6FalscheFarbeArmed = {
    p1: next.meta.v6FalscheFarbeArmed?.p1 ?? false,
    p2: next.meta.v6FalscheFarbeArmed?.p2 ?? false,
    [playerId]: false,
  };
  next.lastEvent = `${next.lastEvent ?? ''} Falsche Farbe genutzt.`.trim();
  return next;
}
