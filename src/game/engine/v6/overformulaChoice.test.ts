/**
 * V6 Überformel bonus choice (#385).
 * Location: src/game/engine/v6/overformulaChoice.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';
import { planFormulaActivation } from './planFormulaActivation';
import {
  pickBotOverformulaBonusChoice,
  resolveOverformulaBonusChoice,
} from './overformula';
import { formatV6FormulaPlanPreview } from '../../../features/play/presentation/v6FormulaPlanPreview';
import type { FormulaComponentInstance, GameState } from '../../types';

function place(
  state: GameState,
  playerId: 'p1' | 'p2',
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
  next.players[playerId].formula[slot] = comp;
  next.phase = 'build';
  next.activePlayer = playerId;
  return next;
}

describe('V6 Überformel Spielerwahl (#385)', () => {
  it('resolves omitted choice to primary fallback', () => {
    expect(resolveOverformulaBonusChoice(undefined)).toBe('primary');
    expect(resolveOverformulaBonusChoice(null)).toBe('primary');
  });

  it('bot prefers primary for damage and intensity for prep/fessel', () => {
    expect(pickBotOverformulaBonusChoice('damage')).toBe('primary');
    expect(pickBotOverformulaBonusChoice('heal')).toBe('primary');
    expect(pickBotOverformulaBonusChoice('prep_attack')).toBe('intensity');
    expect(pickBotOverformulaBonusChoice('fessel')).toBe('intensity');
  });

  it('plans +2 Primär XOR +1 Intensität and preview shows choice', () => {
    let state = createGame({
      pack: V6_CORE_PACK,
      p1CharacterId: V6_CORE_PACK.characters[0].id,
      p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
      ruleset: V6_PACK_RULESET,
      seed: 385,
    });
    state = place(state, 'p1', 'technik', 'v6-technik-impulsgeschoss', 't1');
    state = place(state, 'p1', 'essenz', 'v6-essenz-feuer', 'e1');
    state = place(state, 'p1', 'katalysator', 'v6-katalysator-verdichtung', 'k1');
    state.players.p1.fetzCharge = 3;

    const planPrimary = planFormulaActivation({
      state,
      pack: V6_CORE_PACK,
      playerId: 'p1',
      ruleset: V6_PACK_RULESET,
      rng: () => 0.01,
      defenseRoll: 1,
      overformulaBonusChoice: 'primary',
    });
    expect(planPrimary.kind).toBe('overformula');
    expect(planPrimary.overformulaBonusChoice).toBe('primary');
    expect(planPrimary.overformulaPrimaryBonus).toBe(2);
    expect(planPrimary.primary.value).toBeGreaterThan(3);

    const planIntensity = planFormulaActivation({
      state,
      pack: V6_CORE_PACK,
      playerId: 'p1',
      ruleset: V6_PACK_RULESET,
      rng: () => 0.01,
      defenseRoll: 1,
      overformulaBonusChoice: 'intensity',
    });
    expect(planIntensity.overformulaBonusChoice).toBe('intensity');
    expect(planIntensity.overformulaIntensityBonus).toBe(1);
    expect(planIntensity.overformulaPrimaryBonus).toBe(0);
    expect(planIntensity.primary.value).toBeLessThan(planPrimary.primary.value);
    expect(planIntensity.intensity).toBeGreaterThanOrEqual(1);

    const preview = formatV6FormulaPlanPreview(planIntensity);
    expect(preview.overformulaLine).toMatch(/Intensität/);
  });
});
