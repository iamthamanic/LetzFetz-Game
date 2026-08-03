/**
 * V6 element cards hand-only (#376) — pack + engine isolation.
 * Location: src/game/engine/v6/elementHandOnly.test.ts
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyAction, getLegalActions } from '../actions';
import { createGame } from '../createGame';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';
import { V6_ELEMENT_CARDS, V6_ELEMENT_MIX } from '../../../content/v6/cards/elementCards';
import { applyV6DrawbackAfterCombat, v6PayoffCombatBonus } from './elementValueRoles';
import type { GameState } from '../../types';

const here = dirname(fileURLToPath(import.meta.url));

const V6_CTX = {
  pack: V6_CORE_PACK,
  playerId: 'p1' as const,
  ruleset: V6_PACK_RULESET,
};

function advanceToBuild(state: GameState): GameState {
  let s = state;
  while (s.phase !== 'build' || s.activePlayer !== 'p1') {
    const legal = getLegalActions(s, { ...V6_CTX, playerId: s.activePlayer });
    const adv = legal.find((a) => a.type === 'ADVANCE_PHASE' || a.type === 'END_TURN');
    if (!adv) break;
    s = applyAction(s, adv, s.activePlayer, {
      pack: V6_CORE_PACK,
      ruleset: V6_PACK_RULESET,
    });
  }
  return s;
}

describe('V6 element cards (§36 hand-only)', () => {
  it('ships own V6 defs with value roles and no boundText', () => {
    expect(V6_ELEMENT_CARDS).toHaveLength(V6_ELEMENT_MIX.total);
    expect(V6_CORE_PACK.elementCards).toBe(V6_ELEMENT_CARDS);
    expect(V6_CORE_PACK.elementCards.every((c) => c.id.startsWith('v6-'))).toBe(true);
    expect(V6_CORE_PACK.elementCards.every((c) => c.boundText == null)).toBe(true);
    expect(V6_CORE_PACK.elementCards.some((c) => c.valueRole === 'starter')).toBe(true);
    expect(V6_CORE_PACK.elementCards.some((c) => c.valueRole === 'standard')).toBe(true);
    expect(V6_CORE_PACK.elementCards.some((c) => c.valueRole === 'payoff')).toBe(true);
    expect(V6_CORE_PACK.elementCards.some((c) => c.valueRole === 'drawback')).toBe(true);
  });

  it('Formelphase never offers BUILD_CARD or FORMULA_* for element cards', () => {
    let state = advanceToBuild(
      createGame({
        pack: V6_CORE_PACK,
        p1CharacterId: V6_CORE_PACK.characters[0].id,
        p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
        startingPlayer: 'p1',
        seed: 376,
        ruleset: V6_PACK_RULESET,
      }),
    );
    const attack = V6_CORE_PACK.elementCards.find((c) => c.cardType === 'attack')!;
    state = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [
            { instanceId: 'el-0', defId: attack.id },
            { instanceId: 'tek-0', defId: V6_CORE_PACK.techniques![0].id },
          ],
        },
      },
    };
    const legal = getLegalActions(state, V6_CTX);
    expect(legal.some((a) => a.type === 'BUILD_CARD')).toBe(false);
    expect(legal.some((a) => a.type === 'FORMULA_BUILD' && a.cardInstanceId === 'el-0')).toBe(
      false,
    );
    expect(legal.some((a) => a.type === 'FORMULA_BUILD' && a.cardInstanceId === 'tek-0')).toBe(
      true,
    );
  });

  it('hard-rejects BUILD_CARD under v6Formula', () => {
    let state = advanceToBuild(
      createGame({
        pack: V6_CORE_PACK,
        p1CharacterId: V6_CORE_PACK.characters[0].id,
        p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
        startingPlayer: 'p1',
        seed: 377,
        ruleset: V6_PACK_RULESET,
      }),
    );
    const attack = V6_CORE_PACK.elementCards.find((c) => c.cardType === 'attack')!;
    state = {
      ...state,
      players: {
        ...state.players,
        p1: {
          ...state.players.p1,
          hand: [{ instanceId: 'el-x', defId: attack.id }],
        },
      },
    };
    expect(() =>
      applyAction(state, { type: 'BUILD_CARD', cardInstanceId: 'el-x' }, 'p1', {
        pack: V6_CORE_PACK,
        ruleset: V6_PACK_RULESET,
      }),
    ).toThrow(/hand-only|v6Formula/i);
  });

  it('payoff +1 with opponent Fessel; drawback −1 HP after combat helper', () => {
    const payoff = V6_CORE_PACK.elementCards.find((c) => c.valueRole === 'payoff')!;
    const drawback = V6_CORE_PACK.elementCards.find((c) => c.valueRole === 'drawback')!;
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      startingPlayer: 'p1',
      seed: 378,
      ruleset: V6_PACK_RULESET,
    });
    expect(v6PayoffCombatBonus(state, 'p1', payoff, V6_PACK_RULESET)).toBe(0);
    state = {
      ...state,
      players: {
        ...state.players,
        p2: {
          ...state.players.p2,
          formula: {
            technik: {
              instanceId: 'f1',
              defId: V6_CORE_PACK.techniques![0].id,
              slot: 'technik',
              exhausted: false,
              disturbed: false,
              stabilityBonus: 0,
              fesselIntensity: 2,
            },
            essenz: null,
            katalysator: null,
          },
        },
      },
    };
    expect(v6PayoffCombatBonus(state, 'p1', payoff, V6_PACK_RULESET)).toBe(1);

    const hpBefore = state.players.p1.hp;
    const after = applyV6DrawbackAfterCombat(state, 'p1', drawback.id, V6_CORE_PACK, V6_PACK_RULESET);
    expect(after.players.p1.hp).toBe(hpBefore - 1);
  });

  it('does not import V5 elementCards or BASE element bound tables from V6 pack sources', () => {
    const sources = [
      join(here, '../../packs/v6/v6-pack.ts'),
      join(here, '../../../content/v6/cards/elementCards.ts'),
    ];
    for (const path of sources) {
      const text = readFileSync(path, 'utf8');
      expect(text, path).not.toMatch(/packs\/v5\/elementCards/);
      expect(text, path).not.toMatch(/BASE_PACK\.elementCards/);
      expect(text, path).not.toMatch(/BOUND_ACTIVATE/);
    }
  });
});
