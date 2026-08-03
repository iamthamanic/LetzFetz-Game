/**
 * Construct summon preview lines (#347).
 * Location: src/features/play/presentation/v6FormulaPlanPreview.construct.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../../../game/engine/createGame';
import { planFormulaActivation, V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID } from '../../../game/engine/v6';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../../game/packs/v6';
import type { FormulaComponentInstance, GameState } from '../../../game/types';
import {
  assertPreviewMatchesPlan,
  formatV6FormulaPlanPreview,
} from './v6FormulaPlanPreview';

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

describe('v6FormulaPlanPreview construct summon', () => {
  it('labels summon_construct in German and matches plan', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 11,
    });
    state = place(state, 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'katalysator', V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID, 'k1');

    const plan = planFormulaActivation({
      state,
      pack: V6_CORE_PACK,
      playerId: 'p1',
      ruleset: V6_PACK_RULESET,
      rng: () => 0.5,
      asOverformula: false,
    });
    expect(plan.primary.kind).toBe('summon_construct');
    const preview = formatV6FormulaPlanPreview(plan);
    expect(() => assertPreviewMatchesPlan(plan, preview)).not.toThrow();
    expect(preview.primaryLine).toMatch(/Konstrukt beschwören/);
    expect(preview.primaryLine).toContain('3');
  });
});
