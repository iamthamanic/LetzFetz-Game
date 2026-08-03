/**
 * Surface tests for V6 Überformel offer gate (#348).
 * Location: src/features/play/board/v6OverformulaSurface.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../../../game/engine/createGame';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../../game/packs/v6';
import type { FormulaComponentInstance, GameState } from '../../../game/types';
import { canOfferV6Overformula } from './v6OverformulaSurface';

function place(
  state: GameState,
  slot: 'technik' | 'essenz' | 'katalysator',
  defId: string,
  instanceId: string,
): GameState {
  const next = structuredClone(state);
  const comp: FormulaComponentInstance = {
    instanceId,
    defId,
    slot,
    exhausted: false,
    disturbed: false,
    stabilityBonus: 0,
  };
  next.players.p1.formula[slot] = comp;
  next.phase = 'build';
  next.activePlayer = 'p1';
  return next;
}

describe('canOfferV6Overformula', () => {
  it('is false below full Fetz even with TEK', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 1,
    });
    state = place(state, 'technik', 'v6-technik-impulsgeschoss', 't1');
    state = place(state, 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'katalysator', 'v6-katalysator-verdichtung', 'k1');
    state.players.p1.fetzCharge = 2;
    expect(canOfferV6Overformula(state, 'p1', V6_PACK_RULESET)).toBe(false);
  });

  it('is true at Fetz=3 with upright TEK', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 2,
    });
    state = place(state, 'technik', 'v6-technik-impulsgeschoss', 't1');
    state = place(state, 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'katalysator', 'v6-katalysator-verdichtung', 'k1');
    state.players.p1.fetzCharge = 3;
    expect(canOfferV6Overformula(state, 'p1', V6_PACK_RULESET)).toBe(true);
  });

  it('is false when a slot is disturbed', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 3,
    });
    state = place(state, 'technik', 'v6-technik-impulsgeschoss', 't1');
    state = place(state, 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'katalysator', 'v6-katalysator-verdichtung', 'k1');
    state.players.p1.fetzCharge = 3;
    const kat = state.players.p1.formula.katalysator;
    if (kat) kat.disturbed = true;
    expect(canOfferV6Overformula(state, 'p1', V6_PACK_RULESET)).toBe(false);
  });
});
