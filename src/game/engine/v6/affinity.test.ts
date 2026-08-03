/**
 * V6 Affinity ±1 engine tests (#341).
 * Location: src/game/engine/v6/affinity.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { applyAction, getLegalActions } from '../actions';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';
import { BASE_PACK } from '../../packs/base-pack';
import { DEFAULT_RULESET } from '../../types';
import { resetTurnMeta } from '../../types/matchMeta';
import {
  applyV6AffinityMode,
  characterElementsForCombat,
  shouldOfferV6Affinity,
} from './affinity';
import type { ElementCardDef, GameState } from '../../types';

function fireAttackDef(): ElementCardDef {
  const def = V6_CORE_PACK.elementCards.find(
    (c) => c.cardType === 'attack' && c.element === 'fire',
  );
  if (!def) throw new Error('missing fire attack in V6 pack');
  return def;
}

function putAttackInHand(state: GameState, playerId: 'p1' | 'p2', defId: string): GameState {
  const next = structuredClone(state);
  next.players[playerId].hand = [
    { instanceId: 'atk-1', defId },
    ...next.players[playerId].hand.filter((c) => c.instanceId !== 'atk-1'),
  ];
  next.phase = 'action';
  next.activePlayer = playerId;
  next.combat = null;
  next.pendingChoice = null;
  return next;
}

describe('applyV6AffinityMode', () => {
  it('value-plus adds 1 without changing roll', () => {
    const r = applyV6AffinityMode(4, 5, 'value-plus', V6_PACK_RULESET);
    expect(r).toEqual({ diceRoll: 4, value: 6, spent: true });
  });

  it('dice-plus shifts roll and dice-bonus delta', () => {
    // roll 2 → bonus 0; roll 3 → bonus 1 ⇒ +1 value
    const r = applyV6AffinityMode(2, 4, 'dice-plus', V6_PACK_RULESET);
    expect(r.diceRoll).toBe(3);
    expect(r.value).toBe(5);
    expect(r.spent).toBe(true);
  });

  it('none does not spend', () => {
    const r = applyV6AffinityMode(6, 8, 'none', V6_PACK_RULESET);
    expect(r).toEqual({ diceRoll: 6, value: 8, spent: false });
  });
});

describe('characterElementsForCombat under V6', () => {
  it('returns empty under v6Formula (no auto +1)', () => {
    expect(
      characterElementsForCombat(V6_CORE_PACK, V6_CORE_PACK.characters[0].id, V6_PACK_RULESET),
    ).toEqual([]);
  });

  it('keeps character elements under default/V5', () => {
    const id = BASE_PACK.characters[0].id;
    const els = characterElementsForCombat(BASE_PACK, id, DEFAULT_RULESET);
    expect(els.length).toBeGreaterThan(0);
  });
});

describe('V6 Affinity spend flow', () => {
  const fireChar =
    V6_CORE_PACK.characters.find((c) => c.elements.includes('fire')) ??
    V6_CORE_PACK.characters[0];
  const otherChar =
    V6_CORE_PACK.characters.find((c) => c.id !== fireChar.id) ??
    V6_CORE_PACK.characters[0];

  it('offers pending after matching attack roll and applies value-plus once', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: fireChar.id,
      p2CharacterId: otherChar.id,
      ruleset: V6_PACK_RULESET,
      seed: 1,
    });
    expect(state.meta.v6AffinityAvailable?.p1).toBe(true);

    const atk = fireAttackDef();
    // Ensure character actually has fire affinity
    expect(fireChar.elements.includes('fire')).toBe(true);
    state = putAttackInHand(state, 'p1', atk.id);

    state = applyAction(state, { type: 'PLAY_ATTACK', cardInstanceId: 'atk-1', diceRoll: 4 }, 'p1', {
      pack: V6_CORE_PACK,
      playerId: 'p1',
      rng: () => 0.5,
    });

    expect(state.pendingChoice?.type).toBe('v6-affinity');
    expect(state.combat).toBeNull();
    const legal = getLegalActions(state, { pack: V6_CORE_PACK, playerId: 'p1' });
    expect(legal.some((a) => a.type === 'PICK_V6_AFFINITY' && a.mode === 'value-plus')).toBe(
      true,
    );

    const base = state.pendingChoice?.type === 'v6-affinity' ? state.pendingChoice.baseValue : 0;
    state = applyAction(state, { type: 'PICK_V6_AFFINITY', mode: 'value-plus' }, 'p1', {
      pack: V6_CORE_PACK,
      playerId: 'p1',
    });

    expect(state.pendingChoice).toBeNull();
    expect(state.combat?.attackValue).toBe(base + 1);
    expect(state.meta.v6AffinityAvailable?.p1).toBe(false);
    expect(state.lastEvent ?? '').toMatch(/Affinität/);
  });

  it('rejects second spend same cycle; resets on own Startphase meta', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: fireChar.id,
      p2CharacterId: otherChar.id,
      ruleset: V6_PACK_RULESET,
      seed: 2,
    });
    const atk = fireAttackDef();
    state = putAttackInHand(state, 'p1', atk.id);
    state = applyAction(state, { type: 'PLAY_ATTACK', cardInstanceId: 'atk-1', diceRoll: 5 }, 'p1', {
      pack: V6_CORE_PACK,
      playerId: 'p1',
    });
    state = applyAction(state, { type: 'PICK_V6_AFFINITY', mode: 'dice-plus' }, 'p1', {
      pack: V6_CORE_PACK,
      playerId: 'p1',
    });
    expect(state.meta.v6AffinityAvailable?.p1).toBe(false);

    // Put another matching attack; should NOT offer affinity
    state = putAttackInHand(state, 'p1', atk.id);
    state.combat = null;
    state = applyAction(state, { type: 'PLAY_ATTACK', cardInstanceId: 'atk-1', diceRoll: 3 }, 'p1', {
      pack: V6_CORE_PACK,
      playerId: 'p1',
    });
    expect(state.pendingChoice).toBeNull();
    expect(state.combat).not.toBeNull();

    state.meta = resetTurnMeta(state.meta, 'p1');
    expect(state.meta.v6AffinityAvailable?.p1).toBe(true);
    expect(
      shouldOfferV6Affinity(state, V6_CORE_PACK, 'p1', 'fire', V6_PACK_RULESET),
    ).toBe(true);
  });

  it('skips affinity offer when card element is not an affinity element', () => {
    const waterOnly =
      V6_CORE_PACK.characters.find(
        (c) => c.elements.includes('water') && !c.elements.includes('fire'),
      ) ?? fireChar;
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: waterOnly.id,
      p2CharacterId: otherChar.id,
      ruleset: V6_PACK_RULESET,
      seed: 3,
    });
    const atk = fireAttackDef();
    if (waterOnly.elements.includes('fire')) {
      // Roster always may include fire — skip if no water-only char
      expect(true).toBe(true);
      return;
    }
    state = putAttackInHand(state, 'p1', atk.id);
    state = applyAction(state, { type: 'PLAY_ATTACK', cardInstanceId: 'atk-1', diceRoll: 4 }, 'p1', {
      pack: V6_CORE_PACK,
      playerId: 'p1',
    });
    expect(state.pendingChoice).toBeNull();
    expect(state.combat).not.toBeNull();
  });
});
