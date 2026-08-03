/**
 * V6 Gegenstände / Ausrüstung — pack + engine gates (#377).
 * Location: src/game/engine/v6/items.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { applyAction, getLegalActions } from '../actions';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6/v6-pack';
import { V6_ITEMS, V6_EQUIPMENT_ITEMS, V6_CONSUMABLE_ITEMS } from '../../../content/v6/cards/itemCards';
import { getStatus } from '../status/applyStatus';
import { V6_MAX_EQUIPMENT_SLOTS } from './items';

const CTX = {
  pack: V6_CORE_PACK,
  playerId: 'p1' as const,
  ruleset: V6_PACK_RULESET,
};

function baseState() {
  return createGame({
    pack: V6_CORE_PACK,
    p1CharacterId: V6_CORE_PACK.characters[0].id,
    p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
    startingPlayer: 'p1',
    seed: 77,
    ruleset: V6_PACK_RULESET,
  });
}

describe('V6 items §37–40', () => {
  it('ships 3 equipment + 5 consumables with DE texts', () => {
    expect(V6_EQUIPMENT_ITEMS).toHaveLength(3);
    expect(V6_CONSUMABLE_ITEMS).toHaveLength(5);
    expect(V6_ITEMS).toHaveLength(8);
    expect(V6_CORE_PACK.items).toHaveLength(8);
    expect(V6_ITEMS.every((i) => i.name.trim().length > 0 && i.effectText.trim().length > 0)).toBe(
      true,
    );
    expect(V6_CONSUMABLE_ITEMS.every((i) => i.permanence === 'consumable')).toBe(true);
    expect(V6_EQUIPMENT_ITEMS.every((i) => i.permanence === 'equipment')).toBe(true);
  });

  it('equips Ausrüstung onto player.equipment (max 2)', () => {
    let state = baseState();
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [
            { instanceId: 'eq1', defId: 'v6-item-werkzeugkoffer' },
            { instanceId: 'eq2', defId: 'v6-item-kaputter-rueckspiegel' },
            { instanceId: 'eq3', defId: 'v6-item-gezinkter-wuerfel' },
          ],
          equipment: [],
        },
      },
    };
    state = applyAction(state, { type: 'PLAY_ITEM', cardInstanceId: 'eq1' }, 'p1', CTX);
    expect(state.players.p1.equipment).toHaveLength(1);
    expect(state.players.p1.equipment[0].defId).toBe('v6-item-werkzeugkoffer');
    expect(state.piles.discard.some((c) => c.instanceId === 'eq1')).toBe(false);

    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [
            { instanceId: 'eq2', defId: 'v6-item-kaputter-rueckspiegel' },
            { instanceId: 'eq3', defId: 'v6-item-gezinkter-wuerfel' },
          ],
        },
      },
    };
    state = applyAction(state, { type: 'PLAY_ITEM', cardInstanceId: 'eq2' }, 'p1', CTX);
    expect(state.players.p1.equipment).toHaveLength(V6_MAX_EQUIPMENT_SLOTS);

    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'eq3', defId: 'v6-item-gezinkter-wuerfel' }],
        },
      },
    };
    const legal = getLegalActions(state, CTX);
    expect(
      legal.some(
        (a) =>
          a.type === 'PLAY_ITEM' &&
          a.cardInstanceId === 'eq3' &&
          Boolean(a.replaceEquipmentInstanceId),
      ),
    ).toBe(true);
    expect(
      legal.some(
        (a) =>
          a.type === 'PLAY_ITEM' &&
          a.cardInstanceId === 'eq3' &&
          !a.replaceEquipmentInstanceId,
      ),
    ).toBe(false);

    const replaceId = state.players.p1.equipment[0].instanceId;
    state = applyAction(
      state,
      {
        type: 'PLAY_ITEM',
        cardInstanceId: 'eq3',
        replaceEquipmentInstanceId: replaceId,
      },
      'p1',
      CTX,
    );
    expect(state.players.p1.equipment).toHaveLength(2);
    expect(state.players.p1.equipment.some((e) => e.defId === 'v6-item-gezinkter-wuerfel')).toBe(
      true,
    );
    expect(state.piles.discard.some((c) => c.instanceId === replaceId)).toBe(true);
  });

  it('limits consumables to 1 per own turn under v6Formula', () => {
    let state = baseState();
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [
            { instanceId: 'c1', defId: 'v6-item-verdaechtiger-pilz' },
            { instanceId: 'c2', defId: 'v6-item-rostiger-nagel' },
          ],
          shield: 0,
          formulaPrep: null,
        },
      },
    };
    state = applyAction(state, { type: 'PLAY_ITEM', cardInstanceId: 'c1' }, 'p1', CTX);
    expect(state.players.p1.shield).toBe(2);
    expect(getStatus(state, 'p1', 'high')?.stacks).toBe(1);

    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'c2', defId: 'v6-item-rostiger-nagel' }],
        },
      },
    };
    const legal = getLegalActions(state, CTX);
    expect(legal.some((a) => a.type === 'PLAY_ITEM' && a.cardInstanceId === 'c2')).toBe(false);
  });

  it('activates Kaputter Rückspiegel from equipment in combat', () => {
    let state = baseState();
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      combat: {
        attackerId: 'p1',
        defenderId: 'p2',
        attackCardDefId: 'v6-fire-attack-3',
        attackRoll: 4,
        attackValue: 5,
        mode: 'player',
      },
      players: {
        ...state.players,
        p2: {
          ...state.players.p2,
          hand: [],
          equipment: [{ instanceId: 'spiegel', defId: 'v6-item-kaputter-rueckspiegel' }],
        },
      },
    };
    // Prefer a known element id from pack if present
    const attackId = V6_CORE_PACK.elementCards.find((c) => c.cardType === 'attack')?.id;
    if (attackId) {
      state = {
        ...state,
        combat: { ...state.combat!, attackCardDefId: attackId },
      };
    }
    const legal = getLegalActions(state, { ...CTX, playerId: 'p2' });
    expect(
      legal.some(
        (a) => a.type === 'ACTIVATE_EQUIPMENT' && a.equipmentInstanceId === 'spiegel',
      ),
    ).toBe(true);
    state = applyAction(
      state,
      { type: 'ACTIVATE_EQUIPMENT', equipmentInstanceId: 'spiegel' },
      'p2',
      { ...CTX, playerId: 'p2' },
    );
    expect(state.combat?.attackValue).toBe(4);
    expect(state.combat?.rueckspiegelArmed).toBe(true);
    expect(state.players.p2.equipment).toHaveLength(1);
  });

  it('activates Werkzeugkoffer: discard 1 draw 1', () => {
    let state = baseState();
    state = {
      ...state,
      phase: 'action',
      activePlayer: 'p1',
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'h1', defId: V6_CORE_PACK.elementCards[0].id }],
          equipment: [{ instanceId: 'wk', defId: 'v6-item-werkzeugkoffer' }],
        },
      },
      piles: {
        ...state.piles,
        deck: [
          { instanceId: 'd1', defId: V6_CORE_PACK.elementCards[1]?.id ?? V6_CORE_PACK.elementCards[0].id },
          ...state.piles.deck,
        ],
      },
    };
    const handBefore = state.players.p1.hand.length;
    state = applyAction(
      state,
      {
        type: 'ACTIVATE_EQUIPMENT',
        equipmentInstanceId: 'wk',
        discardHandInstanceId: 'h1',
      },
      'p1',
      CTX,
    );
    expect(state.players.p1.hand.length).toBe(handBefore); // −1 discard +1 draw
    expect(state.piles.discard.some((c) => c.instanceId === 'h1')).toBe(true);
    expect(state.players.p1.equipment).toHaveLength(1);
  });
});
