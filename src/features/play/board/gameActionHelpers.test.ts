import { describe, expect, it } from 'vitest';
import type { GameAction } from '../../../game';
import {
  buildRequiresReplace,
  findBuildReplaceAction,
  findChallengeAction,
  findDirectBuildAction,
  findDiscardDrawAction,
  findPlayGlitchAction,
  findPlayItemAction,
  findPoolActivateAction,
  formulaChallengeTargetIds,
  hasChallengeForAttack,
} from './gameActionHelpers';

describe('gameActionHelpers', () => {
  const legal: GameAction[] = [
    { type: 'BUILD_CARD', cardInstanceId: 'h1' },
    { type: 'BUILD_CARD', cardInstanceId: 'h2', discardBoundId: 'b1' },
    { type: 'BUILD_CARD', cardInstanceId: 'h2', discardBoundId: 'b2' },
    { type: 'CHALLENGE', attackCardInstanceId: 'a1', targetBoundInstanceId: 'ob1' },
    { type: 'PLAY_ATTACK', cardInstanceId: 'a1' },
    { type: 'DISCARD_DRAW', discardInstanceId: 'h3' },
    { type: 'ACTIVATE_BOUND', boundInstanceId: 'b1', discardHandInstanceId: 'h4' },
    { type: 'ACTIVATE_BOUND', boundInstanceId: 'b-pool' },
  ];

  it('detects build replace requirement', () => {
    expect(buildRequiresReplace(legal, 'h1')).toBe(false);
    expect(buildRequiresReplace(legal, 'h2')).toBe(true);
  });

  it('finds direct and replace build actions', () => {
    expect(findDirectBuildAction(legal, 'h1')).toEqual({ type: 'BUILD_CARD', cardInstanceId: 'h1' });
    expect(findBuildReplaceAction(legal, 'h2', 'b1')).toEqual({
      type: 'BUILD_CARD',
      cardInstanceId: 'h2',
      discardBoundId: 'b1',
    });
  });

  it('finds V5 formula build/replace without slot pick', () => {
    const v5: GameAction[] = [
      { type: 'FORMULA_BUILD', cardInstanceId: 'f1' },
      { type: 'FORMULA_REPLACE', cardInstanceId: 'f2' },
      { type: 'FORMULA_SCHNELLMIX', cardInstanceId: 'f3' },
      { type: 'PLAY_ITEM', cardInstanceId: 'i1' },
      { type: 'CHALLENGE', attackCardInstanceId: 'a1', targetBoundInstanceId: 'fc1' },
      { type: 'CHALLENGE', attackCardInstanceId: 'a1', targetBoundInstanceId: 'fc2' },
    ];
    expect(findDirectBuildAction(v5, 'f1')?.type).toBe('FORMULA_BUILD');
    expect(findDirectBuildAction(v5, 'f2')?.type).toBe('FORMULA_REPLACE');
    expect(findDirectBuildAction(v5, 'f3')?.type).toBe('FORMULA_SCHNELLMIX');
    expect(buildRequiresReplace(v5, 'f2')).toBe(false);
    expect(findPlayItemAction(v5, 'i1')?.type).toBe('PLAY_ITEM');
    expect(formulaChallengeTargetIds(v5, 'a1')).toEqual(['fc1', 'fc2']);
  });

  it('finds challenge for attack and target', () => {
    expect(hasChallengeForAttack(legal, 'a1')).toBe(true);
    expect(findChallengeAction(legal, 'a1', 'ob1')?.type).toBe('CHALLENGE');
  });

  it('finds discard-draw per hand card', () => {
    expect(findDiscardDrawAction(legal, 'h3')?.type).toBe('DISCARD_DRAW');
    expect(findDiscardDrawAction(legal, 'h1')).toBeNull();
  });

  it('finds mandatory resolve-discard and simple play-glitch', () => {
    const pending: GameAction[] = [
      { type: 'RESOLVE_DRAW_DISCARD', discardInstanceId: 'h5' },
      { type: 'PLAY_GLITCH', glitchInstanceId: 'g1' },
      {
        type: 'PLAY_GLITCH',
        glitchInstanceId: 'g2',
        targetBoundInstanceId: 'b9',
        discardHandInstanceId: 'h9',
      },
    ];
    expect(findDiscardDrawAction(pending, 'h5')?.type).toBe('RESOLVE_DRAW_DISCARD');
    expect(findPlayGlitchAction(pending, 'g1')?.type).toBe('PLAY_GLITCH');
    expect(findPlayGlitchAction(pending, 'g2')).toBeNull();
  });

  it('finds V3 pool activate without hand discard', () => {
    expect(findPoolActivateAction(legal, 'b-pool')).toEqual({
      type: 'ACTIVATE_BOUND',
      boundInstanceId: 'b-pool',
    });
    expect(findPoolActivateAction(legal, 'b1')).toBeNull();
  });
});
