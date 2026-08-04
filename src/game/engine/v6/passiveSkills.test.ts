/**
 * V6 feste Passive-Skills engine tests (#349 Option B).
 * Location: src/game/engine/v6/passiveSkills.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { applyAction, getLegalActions } from '../actions';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';
import { V6_CHARACTER_PASSIVE_SKILLS } from '../../packs/v6/passiveSkills';
import {
  noteV6FormulaChange,
  resolveV6PassiveSkillScry,
  tryV6JetztErstRecht,
  tryV6Nachjustiert,
} from './passiveSkills';
import type { GameState } from '../../types';
import { createSeededRng } from '../deck';

const CTX = {
  pack: V6_CORE_PACK,
  playerId: 'p1' as const,
  ruleset: V6_PACK_RULESET,
};

function gameWithChar(characterId: string): GameState {
  const other =
    V6_CORE_PACK.characters.find((c) => c.id !== characterId)?.id ?? characterId;
  return createGame({
    pack: V6_CORE_PACK,
    p1CharacterId: characterId,
    p2CharacterId: other,
    ruleset: V6_PACK_RULESET,
    seed: 42,
  });
}

describe('V6_CHARACTER_PASSIVE_SKILLS data', () => {
  it('ships one fester Passive-Skill for every V6 character', () => {
    for (const ch of V6_CORE_PACK.characters) {
      const skill = V6_CHARACTER_PASSIVE_SKILLS[ch.id];
      expect(skill, ch.id).toBeDefined();
      expect(ch.passiveSkillId).toBe(skill.id);
      expect(ch.passiveSkillName).toBe(skill.name);
      expect(ch.passiveText).toContain(skill.name);
      expect(ch.ultimateId).toBe('');
      expect(ch.passiveText).not.toMatch(/Keine V5-Passive/);
    }
  });
});

describe('Resteverwertung (2nd formula change → scry 1)', () => {
  it('opens scry pending on second change and resolves keep', () => {
    let state = gameWithChar('knuspergnom');
    state.phase = 'build';
    state.activePlayer = 'p1';
    state.pendingChoice = null;
    state.piles.deck = [
      { instanceId: 'top-1', defId: 'attack-fire-1' },
      { instanceId: 'top-2', defId: 'attack-water-1' },
      ...state.piles.deck,
    ];

    state = noteV6FormulaChange(state, 'p1', V6_PACK_RULESET);
    expect(state.pendingChoice).toBeNull();
    expect(state.meta.v6FormulaChangesThisTurn?.p1).toBe(1);

    state = noteV6FormulaChange(state, 'p1', V6_PACK_RULESET);
    expect(state.pendingChoice?.type).toBe('v6-passive-skill-scry');
    if (state.pendingChoice?.type !== 'v6-passive-skill-scry') throw new Error('expected scry');
    expect(state.pendingChoice.passiveSkillId).toBe('resteverwertung');
    expect(state.pendingChoice.revealedInstanceIds[0]).toBe('top-1');

    const legal = getLegalActions(state, CTX);
    expect(legal.some((a) => a.type === 'PICK_V6_PASSIVE_SKILL_SCRY' && a.mode === 'keep')).toBe(
      true,
    );

    state = applyAction(state, { type: 'PICK_V6_PASSIVE_SKILL_SCRY', mode: 'bottom' }, 'p1', CTX);
    expect(state.pendingChoice).toBeNull();
    expect(state.piles.deck[state.piles.deck.length - 1]?.instanceId).toBe('top-1');
    expect(state.meta.v6PassiveSkillUsed?.p1).toContain('resteverwertung');

    // Second trigger same cycle blocked
    const again = noteV6FormulaChange(
      {
        ...state,
        meta: {
          ...state.meta,
          v6FormulaChangesThisTurn: { p1: 1, p2: 0 },
        },
      },
      'p1',
      V6_PACK_RULESET,
    );
    expect(again.pendingChoice).toBeNull();
  });
});

describe('Jetzt erst recht / Nachjustiert', () => {
  it('puts last hand under deck and draws after HP damage', () => {
    let state = gameWithChar('stiernackenkommando');
    state.players.p1.hand = [
      { instanceId: 'h1', defId: 'attack-fire-1' },
      { instanceId: 'h2', defId: 'block-water-1' },
    ];
    const deckBefore = state.piles.deck.length;
    state = tryV6JetztErstRecht(state, 'p1', 2, createSeededRng(7), V6_PACK_RULESET);
    expect(state.meta.v6PassiveSkillUsed?.p1).toContain('jetzt-erst-recht');
    expect(state.piles.deck.length).toBe(deckBefore); // −1 under + draw from same pile net ~same or -0
    expect(state.players.p1.hand.some((c) => c.instanceId === 'h2')).toBe(false);
  });

  it('adds stability after heal gain', () => {
    let state = gameWithChar('kokabell');
    state.players.p1.formula = {
      technik: {
        instanceId: 't1',
        defId: V6_CORE_PACK.techniques![0].id,
        slot: 'technik',
        exhausted: false,
        disturbed: false,
        stabilityBonus: 0,
      },
      essenz: null,
      katalysator: null,
    };
    state = tryV6Nachjustiert(state, 'p1', 1, V6_PACK_RULESET);
    expect(state.players.p1.formula.technik?.stabilityBonus).toBe(1);
    expect(state.meta.v6PassiveSkillUsed?.p1).toContain('nachjustiert');
  });
});

describe('resolveV6PassiveSkillScry swap', () => {
  it('swaps top two', () => {
    let state = gameWithChar('schluckspecht');
    state.piles.deck = [
      { instanceId: 'a', defId: 'attack-fire-1' },
      { instanceId: 'b', defId: 'attack-water-1' },
      { instanceId: 'c', defId: 'block-earth-1' },
    ];
    state.pendingChoice = {
      type: 'v6-passive-skill-scry',
      playerId: 'p1',
      passiveSkillId: 'erst-mal-gucken',
      revealedInstanceIds: ['a', 'b'],
    };
    state = resolveV6PassiveSkillScry(state, 'p1', 'swap');
    expect(state.piles.deck.map((c) => c.instanceId).slice(0, 3)).toEqual(['b', 'a', 'c']);
  });
});
