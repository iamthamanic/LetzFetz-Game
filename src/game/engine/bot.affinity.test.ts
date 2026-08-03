/**
 * V6 bot Affinity + playbook tests (#351).
 * Location: src/game/engine/bot.affinity.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from './createGame';
import { applyAction, getLegalActions } from './actions';
import { chooseBotAction } from './bot';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../packs/v6';
import { pickBeneficialV6AffinityMode, V6_BOT_PLAYBOOK_DIGEST } from './v6BotPlaybook';
import type { ElementCardDef, GameState, PendingChoice } from '../types';

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

describe('V6_BOT_PLAYBOOK_DIGEST', () => {
  it('mentions Affinity spend priority', () => {
    expect(V6_BOT_PLAYBOOK_DIGEST).toMatch(/Affinität/);
    expect(V6_BOT_PLAYBOOK_DIGEST).toMatch(/value-plus/);
  });
});

describe('pickBeneficialV6AffinityMode', () => {
  const basePending = (
    overrides: Partial<Extract<PendingChoice, { type: 'v6-affinity' }>> = {},
  ): Extract<PendingChoice, { type: 'v6-affinity' }> => ({
    type: 'v6-affinity',
    playerId: 'p2',
    kind: 'attack',
    cardInstanceId: 'atk-1',
    cardDefId: 'x',
    cardElement: 'fire',
    diceRoll: 4,
    baseValue: 5,
    ...overrides,
  });

  it('prefers value-plus when it increases attack value', () => {
    const state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 1,
    });
    const mode = pickBeneficialV6AffinityMode(
      basePending({ diceRoll: 3, baseValue: 4 }),
      state,
      V6_PACK_RULESET,
    );
    expect(mode).toBe('value-plus');
  });

  it('returns none when block already covers attack', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 2,
    });
    state = {
      ...state,
      combat: {
        attackerId: 'p1',
        defenderId: 'p2',
        attackCardDefId: 'x',
        attackRoll: 2,
        attackValue: 3,
        mode: 'player',
      },
    };
    const mode = pickBeneficialV6AffinityMode(
      basePending({ kind: 'block', diceRoll: 5, baseValue: 5 }),
      state,
      V6_PACK_RULESET,
    );
    expect(mode).toBe('none');
  });
});

describe('chooseBotAction V6 Affinity', () => {
  it('spends Affinity with value-plus after matching attack', () => {
    const fireChar =
      V6_CORE_PACK.characters.find((c) => c.elements.includes('fire')) ??
      V6_CORE_PACK.characters[0];
    const otherChar =
      V6_CORE_PACK.characters.find((c) => c.id !== fireChar.id) ?? fireChar;

    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: otherChar.id,
      p2CharacterId: fireChar.id,
      startingPlayer: 'p2',
      ruleset: V6_PACK_RULESET,
      seed: 11,
    });
    const atk = fireAttackDef();
    state = putAttackInHand(state, 'p2', atk.id);

    state = applyAction(
      state,
      { type: 'PLAY_ATTACK', cardInstanceId: 'atk-1', diceRoll: 4 },
      'p2',
      { pack: V6_CORE_PACK, playerId: 'p2', rng: () => 0.5 },
    );
    expect(state.pendingChoice?.type).toBe('v6-affinity');

    const legal = getLegalActions(state, {
      pack: V6_CORE_PACK,
      playerId: 'p2',
      ruleset: V6_PACK_RULESET,
    });
    expect(legal.some((a) => a.type === 'PICK_V6_AFFINITY')).toBe(true);

    const action = chooseBotAction(state, V6_CORE_PACK);
    expect(action).toEqual({ type: 'PICK_V6_AFFINITY', mode: 'value-plus' });
  });

  it('picks FORMULA_BUILD or SKIP_BUILD in V6 Formelphase', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      startingPlayer: 'p2',
      seed: 22,
      ruleset: V6_PACK_RULESET,
    });
    const tech = V6_CORE_PACK.techniques?.[0];
    if (!tech) throw new Error('missing technique');
    state = {
      ...state,
      phase: 'build',
      activePlayer: 'p2',
      players: {
        ...state.players,
        p2: {
          ...state.players.p2,
          hand: [
            ...state.players.p2.hand,
            { instanceId: 'bot-tech', defId: tech.id },
          ],
        },
      },
    };
    const action = chooseBotAction(state, V6_CORE_PACK);
    expect(action).not.toBeNull();
    expect(
      action!.type === 'FORMULA_BUILD' ||
        action!.type === 'FORMULA_REPLACE' ||
        action!.type === 'FORMULA_SCHNELLMIX' ||
        action!.type === 'FORMULA_ACTIVATE' ||
        action!.type === 'SKIP_BUILD',
    ).toBe(true);
  });
});
