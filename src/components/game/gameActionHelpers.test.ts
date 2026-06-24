import { describe, expect, it } from 'vitest';
import type { GameAction } from '../../game';
import {
  bindRequiresReplace,
  findBindReplaceAction,
  findChallengeAction,
  findDirectBindAction,
  findDiscardDrawAction,
  hasChallengeForAttack,
} from './gameActionHelpers';

describe('gameActionHelpers', () => {
  const legal: GameAction[] = [
    { type: 'BIND_CARD', cardInstanceId: 'h1' },
    { type: 'BIND_CARD', cardInstanceId: 'h2', discardBoundId: 'b1' },
    { type: 'BIND_CARD', cardInstanceId: 'h2', discardBoundId: 'b2' },
    { type: 'CHALLENGE', attackCardInstanceId: 'a1', targetBoundInstanceId: 'ob1' },
    { type: 'PLAY_ATTACK', cardInstanceId: 'a1' },
    { type: 'DISCARD_DRAW', discardInstanceId: 'h3' },
    { type: 'ACTIVATE_BOUND', boundInstanceId: 'b1', discardHandInstanceId: 'h4' },
  ];

  it('detects bind replace requirement', () => {
    expect(bindRequiresReplace(legal, 'h1')).toBe(false);
    expect(bindRequiresReplace(legal, 'h2')).toBe(true);
  });

  it('finds direct and replace bind actions', () => {
    expect(findDirectBindAction(legal, 'h1')).toEqual({ type: 'BIND_CARD', cardInstanceId: 'h1' });
    expect(findBindReplaceAction(legal, 'h2', 'b1')).toEqual({
      type: 'BIND_CARD',
      cardInstanceId: 'h2',
      discardBoundId: 'b1',
    });
  });

  it('finds challenge for attack and target', () => {
    expect(hasChallengeForAttack(legal, 'a1')).toBe(true);
    expect(findChallengeAction(legal, 'a1', 'ob1')?.type).toBe('CHALLENGE');
  });

  it('finds discard-draw per hand card', () => {
    expect(findDiscardDrawAction(legal, 'h3')?.type).toBe('DISCARD_DRAW');
    expect(findDiscardDrawAction(legal, 'h1')).toBeNull();
  });
});
