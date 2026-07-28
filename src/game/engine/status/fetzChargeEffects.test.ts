/**
 * Tests for V3 shared Fetzgerät charge pool + part activate/triggers.
 * Location: src/game/engine/status/fetzChargeEffects.test.ts
 */
import { describe, expect, it } from 'vitest';
import { V3_PACK, V3_PACK_RULESET } from '../../packs/v3';
import { createGame } from '../createGame';
import { applyAction, getLegalActions } from '../actions';
import { clampFetzCharge, gainFetzCharge, MAX_FETZ_CHARGE } from './fetzCharge';
import { activateFetzPart, runFetzPassiveTrigger } from './fetzgeraetEffects';
import { applyStatus } from './applyStatus';

const RULESET = V3_PACK_RULESET;

function startV3() {
  return createGame({
    pack: V3_PACK,
    p1CharacterId: 'knuspergnom',
    p2CharacterId: 'schluckspecht',
    startingPlayer: 'p1',
    seed: 42,
    ruleset: RULESET,
  });
}

function bindPart(
  state: ReturnType<typeof createGame>,
  playerId: 'p1' | 'p2',
  defId: string,
  fetzSlot: 'traeger' | 'antrieb' | 'aufsatz',
) {
  const next = structuredClone(state);
  next.players[playerId].bound.push({
    instanceId: `bound-${defId}`,
    defId,
    exhausted: false,
    resistanceBonus: 0,
    phraseSlot: fetzSlot === 'traeger' ? 'core' : fetzSlot === 'antrieb' ? 'mode' : 'tool',
    fetzSlot,
  });
  return next;
}

describe('fetzCharge pool', () => {
  it('clamps to 0..6', () => {
    expect(clampFetzCharge(-1)).toBe(0);
    expect(clampFetzCharge(99)).toBe(MAX_FETZ_CHARGE);
  });

  it('createGame starts at 0', () => {
    const state = startV3();
    expect(state.players.p1.fetzCharge).toBe(0);
    expect(state.players.p2.fetzCharge).toBe(0);
  });

  it('building a boost under V3 fills the pool (no charge slot)', () => {
    let state = startV3();
    state.phase = 'build';
    state.activePlayer = 'p1';
    const boost = V3_PACK.elementCards.find((c) => c.cardType === 'boost' && c.value === 3)!;
    state.players.p1.hand = [{ instanceId: 'boost-1', defId: boost.id }];

    const ctx = { pack: V3_PACK, playerId: 'p1' as const, ruleset: RULESET };
    state = applyAction(state, { type: 'BUILD_CARD', cardInstanceId: 'boost-1' }, 'p1', ctx);

    expect(state.players.p1.fetzCharge).toBe(3);
    expect(state.players.p1.bound.some((b) => b.phraseSlot === 'charge')).toBe(false);
    expect(state.piles.discard.some((c) => c.defId === boost.id)).toBe(true);
  });

  it('gainFetzCharge caps at 6', () => {
    let state = startV3();
    state = gainFetzCharge(state, 'p1', 5);
    state = gainFetzCharge(state, 'p1', 5);
    expect(state.players.p1.fetzCharge).toBe(6);
  });
});

describe('Aufsatz pool activate', () => {
  it('activates Feuerteufeltrigger for 2 charge without hand discard', () => {
    let state = startV3();
    state.phase = 'action';
    state.activePlayer = 'p1';
    state = bindPart(state, 'p1', 'v3-part-fire-aufsatz-02', 'aufsatz');
    state = gainFetzCharge(state, 'p1', 2);

    const ctx = { pack: V3_PACK, playerId: 'p1' as const, ruleset: RULESET };
    const legal = getLegalActions(state, ctx);
    expect(
      legal.some(
        (a) =>
          a.type === 'ACTIVATE_BOUND' &&
          a.boundInstanceId === 'bound-v3-part-fire-aufsatz-02' &&
          !a.discardHandInstanceId,
      ),
    ).toBe(true);

    state = applyAction(
      state,
      { type: 'ACTIVATE_BOUND', boundInstanceId: 'bound-v3-part-fire-aufsatz-02' },
      'p1',
      ctx,
    );

    expect(state.players.p1.fetzCharge).toBe(0);
    expect(state.players.p1.bound[0]?.exhausted).toBe(true);
  });

  it('rejects activate when pool too low', () => {
    let state = startV3();
    state = bindPart(state, 'p1', 'v3-part-fire-aufsatz-01', 'aufsatz');
    state = gainFetzCharge(state, 'p1', 1);
    expect(() =>
      activateFetzPart(state, V3_PACK, 'p1', 'bound-v3-part-fire-aufsatz-01', RULESET),
    ).toThrow(/Ladung/);
  });
});

describe('Träger / Antrieb triggers', () => {
  it('Brandbeschleuniger gains charge on attack hit', () => {
    let state = startV3();
    state = bindPart(state, 'p1', 'v3-part-fire-antrieb-02', 'antrieb');
    const result = runFetzPassiveTrigger(state, V3_PACK, 'p1', RULESET, 'onAttackHit', {
      bonus: false,
    });
    expect(result.state.players.p1.fetzCharge).toBe(1);
  });

  it('Brandbeschleuniger gains 2 when target already burning', () => {
    let state = startV3();
    state = bindPart(state, 'p1', 'v3-part-fire-antrieb-02', 'antrieb');
    state = applyStatus(state, 'p2', 'brennen', 1);
    const result = runFetzPassiveTrigger(state, V3_PACK, 'p1', RULESET, 'onAttackHit', {
      bonus: true,
    });
    expect(result.state.players.p1.fetzCharge).toBe(2);
  });

  it('Kometensehne spends 1 charge on hit for fire impulse mark', () => {
    let state = startV3();
    state = bindPart(state, 'p1', 'v3-part-fire-traeger-01', 'traeger');
    state = gainFetzCharge(state, 'p1', 1);
    const result = runFetzPassiveTrigger(state, V3_PACK, 'p1', RULESET, 'onAttackHit', {});
    expect(result.state.players.p1.fetzCharge).toBe(0);
    expect(result.state.players.p2.statuses.some((s) => s.id === 'brennen')).toBe(true);
  });

  it('Bongturbine gains charge on High gain (onHighGainOrSpend)', () => {
    let state = startV3();
    state = bindPart(state, 'p1', 'v3-part-earth-antrieb-01', 'antrieb');
    const result = runFetzPassiveTrigger(state, V3_PACK, 'p1', RULESET, 'onHighGainOrSpend', {
      bonus: false,
    });
    expect(result.state.players.p1.fetzCharge).toBe(1);
  });

  it('Luft-Antrieb gains charge on Fokus/reroll trigger', () => {
    let state = startV3();
    state = bindPart(state, 'p1', 'v3-part-air-antrieb-02', 'antrieb');
    const result = runFetzPassiveTrigger(state, V3_PACK, 'p1', RULESET, 'onFocusOrReroll', {});
    expect(result.state.players.p1.fetzCharge).toBe(1);
  });

  it('Wasser-Träger fires onAfterOwnBlock for charge spend path', () => {
    let state = startV3();
    state = bindPart(state, 'p1', 'v3-part-water-traeger-02', 'traeger');
    state = gainFetzCharge(state, 'p1', 1);
    const result = runFetzPassiveTrigger(state, V3_PACK, 'p1', RULESET, 'onAfterOwnBlock', {
      bonus: false,
    });
    expect(result.state.players.p1.fetzCharge).toBe(0);
    expect(result.state.players.p1.shield).toBeGreaterThanOrEqual(1);
  });
});
