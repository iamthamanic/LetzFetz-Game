/**
 * Unit tests for FOW bot view.
 * Location: src/game/engine/botView.test.ts
 */
import { describe, it, expect } from 'vitest';
import { createGame } from './createGame';
import { BASE_PACK } from '../packs/base-pack';
import { buildBotPublicView, botNeedsToAct } from './botView';

describe('buildBotPublicView', () => {
  it('exposes bot hand but only opponent hand count', () => {
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'kokabell',
      p2CharacterId: 'pillendoktora',
      startingPlayer: 'p1',
      seed: 42,
    });
    const view = buildBotPublicView(state, BASE_PACK, 'p2');
    expect(view.yourHand.length).toBe(state.players.p2.hand.length);
    expect(view.opponentHandCount).toBe(state.players.p1.hand.length);
    const p1HandIds = new Set(state.players.p1.hand.map((c) => c.instanceId));
    for (const h of view.yourHand) {
      expect(p1HandIds.has(h.instanceId)).toBe(false);
    }
    expect(Object.keys(view).includes('opponentHand')).toBe(false);
  });

  it('botNeedsToAct is false on human turn without combat', () => {
    const state = createGame({
      pack: BASE_PACK,
      p1CharacterId: 'kokabell',
      p2CharacterId: 'pillendoktora',
      startingPlayer: 'p1',
      seed: 7,
    });
    expect(botNeedsToAct(state, 'p2')).toBe(false);
    expect(botNeedsToAct({ ...state, activePlayer: 'p2' }, 'p2')).toBe(true);
  });
});
