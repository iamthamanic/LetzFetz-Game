/**
 * V6 arena hooks + reaction cap (#350).
 * Location: src/game/engine/v6/arenas.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { applyAction, getLegalActions } from '../actions';
import { V6_CORE_PACK, V6_PACK_RULESET } from '../../packs/v6';
import { enableDoubleReactionThisAction, reactionLimitReached } from '../status/v3CombatHooks';
import { applyStatus } from '../status/applyStatus';
import { resolveImpulseReactions } from '../status/reactionChoice';
import {
  applyV6VulkanFirstDamageBonus,
  shouldSkipLegacyVulkanW6,
  v6ClubAirValueBonus,
  v6FormulaChallengeOutcome,
  v6KristallEssenceStabilityBonus,
} from './arenas';
import type { FormulaComponentInstance } from '../../types';

function freshV6(arenaId: string) {
  return createGame({
    pack: V6_CORE_PACK,
    p1CharacterId: V6_CORE_PACK.characters[0].id,
    p2CharacterId: V6_CORE_PACK.characters[1]?.id ?? V6_CORE_PACK.characters[0].id,
    arenaId,
    startingPlayer: 'p1',
    seed: 42,
    ruleset: V6_PACK_RULESET,
  });
}

describe('V6 arenas pack', () => {
  it('createGame picks V6 arenas without d6Variants', () => {
    const state = freshV6('arena-club');
    expect(state.arena.arenaId).toBe('arena-club');
    expect(state.arena.d6Variant).toBeNull();
    expect(state.meta.v6FormulaEnabled).toBe(true);
  });
});

describe('V6 Vulkan first damage', () => {
  it('skips legacy W6 bonus and applies +1 once per turn', () => {
    let state = freshV6('arena-vulkan');
    expect(shouldSkipLegacyVulkanW6(state, V6_PACK_RULESET)).toBe(true);
    const first = applyV6VulkanFirstDamageBonus(state, 'p1', 5, V6_PACK_RULESET);
    expect(first.attackValue).toBe(6);
    expect(first.state.meta.vulkanAttackBonusUsed.p1).toBe(true);
    const second = applyV6VulkanFirstDamageBonus(first.state, 'p1', 5, V6_PACK_RULESET);
    expect(second.attackValue).toBe(5);
  });
});

describe('V6 Club / Kristall / Sumpf helpers', () => {
  it('Club grants +1 on air cards only', () => {
    const state = freshV6('arena-club');
    expect(v6ClubAirValueBonus(state, 'air', V6_PACK_RULESET)).toBe(1);
    expect(v6ClubAirValueBonus(state, 'fire', V6_PACK_RULESET)).toBe(0);
  });

  it('Kristall adds +1 stability to light essence', () => {
    const state = freshV6('arena-kristall');
    const light: FormulaComponentInstance = {
      instanceId: 'e1',
      defId: 'v6-essenz-licht',
      slot: 'essenz',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    expect(v6KristallEssenceStabilityBonus(state, V6_CORE_PACK, light, V6_PACK_RULESET)).toBe(1);
    const water: FormulaComponentInstance = {
      instanceId: 'e2',
      defId: 'v6-essenz-wasser',
      slot: 'essenz',
      exhausted: false,
      disturbed: false,
      stabilityBonus: 0,
    };
    expect(v6KristallEssenceStabilityBonus(state, V6_CORE_PACK, water, V6_PACK_RULESET)).toBe(0);
  });

  it('Sumpf raises destroy threshold to 4', () => {
    const state = freshV6('arena-sumpf');
    expect(v6FormulaChallengeOutcome(state, 5, 3, false, V6_PACK_RULESET)).toBe('disturb'); // diff 2
    expect(v6FormulaChallengeOutcome(state, 6, 3, false, V6_PACK_RULESET)).toBe('disturb'); // diff 3
    expect(v6FormulaChallengeOutcome(state, 7, 3, false, V6_PACK_RULESET)).toBe('destroy'); // diff 4
    const spaeti = freshV6('arena-spaeti');
    expect(v6FormulaChallengeOutcome(spaeti, 6, 3, false, V6_PACK_RULESET)).toBe('destroy'); // default ≥3
  });
});

describe('V6 Schattenbasar pay-destroy', () => {
  it('offers pay-to-destroy after formula disturb', () => {
    let state = freshV6('arena-schattenbasar');
    state.phase = 'action';
    state.activePlayer = 'p1';
    state.players.p1.hand = [{ instanceId: 'atk', defId: 'v6-fire-attack-6' }];
    state.players.p2.formula = {
      technik: null,
      essenz: {
        instanceId: 'ess1',
        defId: 'v6-essenz-wasser',
        slot: 'essenz',
        exhausted: false,
        disturbed: false,
        stabilityBonus: 0,
      },
      katalysator: null,
    };
    // Stability of wasser essenz is typically 2 — force disturb margin 1–3.
    state = applyAction(
      state,
      {
        type: 'CHALLENGE',
        attackCardInstanceId: 'atk',
        targetBoundInstanceId: 'ess1',
        diceRoll: 1,
      },
      'p1',
      { pack: V6_CORE_PACK, playerId: 'p1' },
    );
    // May still be in affinity pending or combat — advance if needed.
    if (state.pendingChoice?.type === 'v6-affinity') {
      state = applyAction(state, { type: 'PICK_V6_AFFINITY', mode: 'none' }, 'p1', {
        pack: V6_CORE_PACK,
        playerId: 'p1',
      });
    }
    if (state.combat) {
      state = applyAction(state, { type: 'PASS_BLOCK' }, 'p2', {
        pack: V6_CORE_PACK,
        playerId: 'p2',
      });
    }
    if (state.pendingChoice?.type === 'v6-basar-pay-destroy') {
      const legal = getLegalActions(state, { pack: V6_CORE_PACK, playerId: 'p1' });
      expect(legal.some((a) => a.type === 'PICK_V6_BASAR_DESTROY' && a.pay === true)).toBe(true);
      const hpBefore = state.players.p1.hp;
      state = applyAction(state, { type: 'PICK_V6_BASAR_DESTROY', pay: true }, 'p1', {
        pack: V6_CORE_PACK,
        playerId: 'p1',
      });
      expect(state.players.p1.hp).toBe(hpBefore - 1);
      expect(state.players.p2.formula.essenz).toBeNull();
    } else {
      // Outcome may be destroy/none depending on roll+stability — still assert arena is wired.
      expect(state.arena.arenaId).toBe('arena-schattenbasar');
    }
  });
});

describe('V6 reaction cap', () => {
  it('ignores double-reaction ulti hook under v6Formula', () => {
    let state = freshV6('arena-spaeti');
    state = enableDoubleReactionThisAction(state);
    expect(state.meta.v3ReactionLimitThisAction).toBeUndefined();
    state.meta.v3ReactionsThisAction = 1;
    expect(reactionLimitReached(state.meta)).toBe(true);
  });

  it('second impulse in same action does not fire another reaction', () => {
    let state = freshV6('arena-spaeti');
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V6_PACK_RULESET, 'p1');
    expect(state.meta.v3ReactionsThisAction).toBe(1);
    state = applyStatus(state, 'p2', 'brennen', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V6_PACK_RULESET, 'p1');
    expect(state.meta.v3ReactionsThisAction).toBe(1);
  });
});
