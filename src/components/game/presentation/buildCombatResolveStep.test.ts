/**
 * Unit tests for combat-resolve presentation snapshot.
 * Location: src/components/game/presentation/buildCombatResolveStep.test.ts
 */
import { describe, expect, it } from 'vitest';
import { BASE_PACK } from '../../../game';
import type { GameState } from '../../../game/types';
import {
  buildCombatResolveSnapshot,
  buildCombatResolveStep,
  isCombatResolveStep,
  COMBAT_RESOLVE_MS,
} from './buildCombatResolveStep';

function stubCombatState(overrides?: {
  blockInHand?: boolean;
  mode?: 'player' | 'challenge';
}): GameState {
  const attackDef = BASE_PACK.elementCards.find((e) => e.cardType === 'attack')!;
  const blockDef = BASE_PACK.elementCards.find((e) => e.cardType === 'block')!;
  return {
    players: {
      p1: {
        characterId: 'knuspergnom',
        hp: 20,
        hand: [],
        bound: [],
        ultimateAvailable: false,
        doubleNextAttack: false,
        notes: '',
      },
      p2: {
        characterId: 'kokabell',
        hp: 20,
        hand: overrides?.blockInHand
          ? [{ instanceId: 'b1', defId: blockDef.id }]
          : [],
        bound:
          overrides?.mode === 'challenge'
            ? [{ instanceId: 'bound1', defId: attackDef.id, resistanceBonus: 0, exhausted: false }]
            : [],
        ultimateAvailable: false,
        doubleNextAttack: false,
        notes: '',
      },
    },
    piles: { deck: [], discard: [] },
    combat: {
      attackerId: 'p1',
      defenderId: 'p2',
      attackCardDefId: attackDef.id,
      attackRoll: 5,
      attackValue: 6,
      mode: overrides?.mode ?? 'player',
      targetBoundInstanceId: overrides?.mode === 'challenge' ? 'bound1' : undefined,
    },
    pendingChoice: null,
    lastEvent: null,
  } as unknown as GameState;
}

describe('buildCombatResolveSnapshot', () => {
  it('builds pass-block damage resolve', () => {
    const prev = stubCombatState();
    const next = {
      ...prev,
      combat: null,
      players: {
        ...prev.players,
        p2: { ...prev.players.p2, hp: 14 },
      },
      lastEvent: '6 Schaden (6 vs 0 Block).',
    } as GameState;

    const snap = buildCombatResolveSnapshot(prev, next, BASE_PACK);
    expect(snap).not.toBeNull();
    expect(snap!.blockValue).toBe(0);
    expect(snap!.damage).toBe(6);
    expect(snap!.outcome).toBe('damage');
    expect(snap!.attackBonus).toBe(2);
    expect(snap!.attackBase).toBe(4);
  });

  it('parses block card and complete block', () => {
    const prev = stubCombatState({ blockInHand: true });
    const blockDef = BASE_PACK.elementCards.find((e) => e.cardType === 'block')!;
    const next = {
      ...prev,
      combat: null,
      players: {
        ...prev.players,
        p2: { ...prev.players.p2, hand: [], hp: 20 },
      },
      piles: { deck: [], discard: [{ instanceId: 'b1', defId: blockDef.id }] },
      lastEvent: 'Block 8 (Würfel 6). Komplett geblockt (6 vs 8).',
    } as GameState;

    const snap = buildCombatResolveSnapshot(prev, next, BASE_PACK);
    expect(snap!.blockCardDefId).toBe(blockDef.id);
    expect(snap!.blockRoll).toBe(6);
    expect(snap!.blockValue).toBe(8);
    expect(snap!.damage).toBe(0);
    expect(snap!.outcome).toBe('blocked');
  });

  it('detects challenge destroy', () => {
    const prev = stubCombatState({ mode: 'challenge' });
    const next = {
      ...prev,
      combat: null,
      players: {
        ...prev.players,
        p2: { ...prev.players.p2, bound: [] },
      },
      lastEvent: 'Herausforderung erfolgreich — Foo zerstört (6 vs 4).',
    } as GameState;

    const snap = buildCombatResolveSnapshot(prev, next, BASE_PACK);
    expect(snap!.outcome).toBe('challenge-destroy');
    expect(snap!.destroyedCardDefId).toBeTruthy();
  });

  it('builds a locking presentation step', () => {
    const prev = stubCombatState();
    const next = {
      ...prev,
      combat: null,
      players: { ...prev.players, p2: { ...prev.players.p2, hp: 18 } },
      lastEvent: '2 Schaden (6 vs 4 Block).',
    } as GameState;
    const snap = buildCombatResolveSnapshot(prev, next, BASE_PACK)!;
    const step = buildCombatResolveStep(snap);
    expect(isCombatResolveStep(step)).toBe(true);
    expect(step.durationMs).toBe(COMBAT_RESOLVE_MS);
    expect(step.locksInput).toBe(true);
  });
});
