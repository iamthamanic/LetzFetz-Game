import { describe, it, expect } from 'vitest';
import { BASE_PACK } from '../packs/base-pack';
import { getLegalActions } from '../engine/actions';
import {
  PLAYTEST_SCENARIOS,
  buildPlaytestScenario,
} from './scenarios';
import { preparePlaytestState, applyAndValidatePlaytestPatch } from './patches';

describe('playtest scenarios', () => {
  for (const scenario of PLAYTEST_SCENARIOS) {
    it(`${scenario.id} passes invariant validation`, () => {
      const state = scenario.build(BASE_PACK);
      const result = preparePlaytestState(state);
      expect(result.ok, result.error).toBe(true);
    });
  }

  it('fresh-action is in action phase with p1 active', () => {
    const state = buildPlaytestScenario(BASE_PACK, 'fresh-action');
    expect(state.phase).toBe('action');
    expect(state.activePlayer).toBe('p1');
    const attacks = getLegalActions(state, { pack: BASE_PACK, playerId: 'p1' }).filter(
      (a) => a.type === 'PLAY_ATTACK',
    );
    expect(attacks.length).toBeGreaterThan(0);
  });

  it('defender-block leaves human as defender', () => {
    const state = buildPlaytestScenario(BASE_PACK, 'defender-block');
    expect(state.combat).not.toBeNull();
    expect(state.combat?.defenderId).toBe('p1');
    expect(state.combat?.mode).toBe('player');
  });

  it('challenge-ready offers CHALLENGE', () => {
    const state = buildPlaytestScenario(BASE_PACK, 'challenge-ready');
    const challenges = getLegalActions(state, { pack: BASE_PACK, playerId: 'p1' }).filter(
      (a) => a.type === 'CHALLENGE',
    );
    expect(challenges.length).toBeGreaterThan(0);
  });

  it('low-hp sets both players to 5 hp', () => {
    const state = buildPlaytestScenario(BASE_PACK, 'low-hp');
    expect(state.players.p1.hp).toBe(5);
    expect(state.players.p2.hp).toBe(5);
  });
});

describe('playtest patches', () => {
  it('applies phase and hp patch', () => {
    const base = buildPlaytestScenario(BASE_PACK, 'fresh-action');
    const result = applyAndValidatePlaytestPatch(base, {
      phase: 'bind',
      p1Hp: 3,
      p2Hp: 7,
    });
    expect(result.ok).toBe(true);
    expect(result.state?.phase).toBe('bind');
    expect(result.state?.players.p1.hp).toBe(3);
    expect(result.state?.players.p2.hp).toBe(7);
  });

  it('rejects negative hp', () => {
    const base = buildPlaytestScenario(BASE_PACK, 'fresh-action');
    const result = applyAndValidatePlaytestPatch(base, { p1Hp: -1 });
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('rejects non-numeric hp', () => {
    const base = buildPlaytestScenario(BASE_PACK, 'fresh-action');
    const result = applyAndValidatePlaytestPatch(base, { p1Hp: Number.NaN });
    expect(result.ok).toBe(false);
    expect(result.error).toContain('P1 HP');
  });

  it('O11: sets playtest HP cap 30 and both players to 30', () => {
    const base = buildPlaytestScenario(BASE_PACK, 'fresh-action');
    const result = applyAndValidatePlaytestPatch(base, {
      playtestHpCap: 30,
      p1Hp: 30,
      p2Hp: 30,
    });
    expect(result.ok, result.error).toBe(true);
    expect(result.state?.playtest?.hpCap).toBe(30);
    expect(result.state?.players.p1.hp).toBe(30);
    expect(result.state?.players.p2.hp).toBe(30);
  });

  it('O11: rejects HP above current cap without raising cap', () => {
    const base = buildPlaytestScenario(BASE_PACK, 'fresh-action');
    const result = applyAndValidatePlaytestPatch(base, { p1Hp: 25 });
    expect(result.ok).toBe(false);
  });

  it('O11: stores mono bonus mode', () => {
    const base = buildPlaytestScenario(BASE_PACK, 'fresh-action');
    const result = applyAndValidatePlaytestPatch(base, { monoBonusMode: 'mb3' });
    expect(result.ok, result.error).toBe(true);
    expect(result.state?.playtest?.monoBonusMode).toBe('mb3');
  });
});
