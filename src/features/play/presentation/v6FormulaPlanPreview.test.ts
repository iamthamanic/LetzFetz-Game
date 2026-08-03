/**
 * Hard-gate tests: V6 formula preview is engine-plan-only (#321).
 * Location: src/features/play/presentation/v6FormulaPlanPreview.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../../../game/engine/createGame';
import { planFormulaActivation } from '../../../game/engine/v6';
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

describe('v6FormulaPlanPreview hard-gate', () => {
  it('preview lines match plan primary / catalyst / fetz / lock', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 5,
    });
    state = place(state, 'technik', 'v6-technik-impulsgeschoss', 't1');
    state = place(state, 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'katalysator', 'v6-katalysator-verdichtung', 'k1');

    const plan = planFormulaActivation({
      state,
      pack: V6_CORE_PACK,
      playerId: 'p1',
      ruleset: V6_PACK_RULESET,
      rng: () => 0.01,
      defenseRoll: 1,
      asOverformula: false,
    });
    const preview = formatV6FormulaPlanPreview(plan);
    expect(() => assertPreviewMatchesPlan(plan, preview)).not.toThrow();
    expect(preview.catalystLine).toMatch(/verbraucht/);
    expect(preview.fetzLine).toMatch(/\+1/);
    expect(preview.lockLine).toMatch(/gesperrt/);
    expect(preview.primaryLine).toContain(String(plan.primary.value));
  });
});
