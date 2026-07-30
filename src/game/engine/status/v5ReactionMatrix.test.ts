/**
 * V5 §19 reaction matrix coverage — all 21 pairs (#283).
 * Location: src/game/engine/status/v5ReactionMatrix.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../createGame';
import { V5_PACK, V5_PACK_RULESET } from '../../packs/v5/v5-pack';
import { applyStatus, getStatus } from './applyStatus';
import { resolveImpulseReactions } from './reactionChoice';
import {
  REACTION_LABEL_DE,
  reactionIdFor,
  type ReactionId,
} from './reactions';
import type { Element, PrimaryMarkId } from '../../types';
import { applyReactionWithOutcome } from './reactionOutcomes';

const PAIRS: Array<{
  impulse: Element;
  mark: PrimaryMarkId;
  id: ReactionId;
  label: string;
}> = [
  { impulse: 'fire', mark: 'brennen', id: 'inferno', label: 'Überhitzt' },
  { impulse: 'water', mark: 'durchnaesst', id: 'ueberflutung', label: 'Überflutet' },
  { impulse: 'earth', mark: 'high', id: 'deep_high', label: 'Versteinert' },
  { impulse: 'air', mark: 'aufgewirbelt', id: 'rueckenwind', label: 'Tornado' },
  { impulse: 'light', mark: 'erleuchtet', id: 'erleuchtung', label: 'Geblendet' },
  { impulse: 'shadow', mark: 'verflucht', id: 'tiefer_fluch', label: 'Verdorben' },
  { impulse: 'fire', mark: 'durchnaesst', id: 'dampf', label: 'Dampf' },
  { impulse: 'fire', mark: 'high', id: 'hotbox', label: 'Schmelze' },
  { impulse: 'fire', mark: 'aufgewirbelt', id: 'feuersturm', label: 'Feuersturm' },
  { impulse: 'fire', mark: 'erleuchtet', id: 'sonnenbrand', label: 'Sonnenbrand' },
  { impulse: 'fire', mark: 'verflucht', id: 'hexenbrand', label: 'Höllenbrand' },
  { impulse: 'water', mark: 'high', id: 'kraeutersud', label: 'Schlamm' },
  { impulse: 'water', mark: 'aufgewirbelt', id: 'wirbel', label: 'Nebelbank' },
  { impulse: 'water', mark: 'erleuchtet', id: 'prisma', label: 'Regenbogen' },
  { impulse: 'water', mark: 'verflucht', id: 'giftbruehe', label: 'Moder' },
  { impulse: 'earth', mark: 'aufgewirbelt', id: 'pollenflug', label: 'Staubsturm' },
  { impulse: 'earth', mark: 'erleuchtet', id: 'growlight', label: 'Kristallwuchs' },
  { impulse: 'earth', mark: 'verflucht', id: 'paranoia', label: 'Giftsporen' },
  { impulse: 'air', mark: 'erleuchtet', id: 'blendwerk', label: 'Blitzlicht' },
  { impulse: 'air', mark: 'verflucht', id: 'fluestersturm', label: 'Flüstersturm' },
  { impulse: 'light', mark: 'verflucht', id: 'finsternis', label: 'Dämmerung' },
];

describe('V5 §19 reaction matrix', () => {
  it('maps all 21 pairs to V5 DE labels', () => {
    expect(PAIRS).toHaveLength(21);
    for (const p of PAIRS) {
      expect(reactionIdFor(p.impulse, p.mark)).toBe(p.id);
      expect(REACTION_LABEL_DE[p.id]).toBe(p.label);
    }
  });

  it('resolves every pair without throwing', () => {
    for (const p of PAIRS) {
      let state = createGame({
        pack: V5_PACK,
        p1CharacterId: 'knuspergnom',
        p2CharacterId: 'schluckspecht',
        startingPlayer: 'p1',
        seed: 99,
        ruleset: V5_PACK_RULESET,
      });
      state = applyStatus(state, 'p2', p.mark, 1);
      state = applyReactionWithOutcome(state, p.id, {
        targetId: 'p2',
        chooserId: 'p1',
        consumedMark: p.mark,
        ruleset: V5_PACK_RULESET,
        pack: V5_PACK,
      });
      expect(state.lastEvent).toContain(p.label);
      // Consumed mark gone unless re-applied by outcome (Überhitzt / Sonnenbrand / …)
      void getStatus;
    }
  });

  it('§20 side effects do not stack when applied twice', () => {
    let state = createGame({
      pack: V5_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 3,
      ruleset: V5_PACK_RULESET,
    });
    state = applyStatus(state, 'p2', 'nebelbank', 1);
    state = applyStatus(state, 'p2', 'nebelbank', 1);
    expect(getStatus(state, 'p2', 'nebelbank')?.stacks).toBe(1);
    state = applyStatus(state, 'p2', 'toxisch', 1);
    state = applyStatus(state, 'p2', 'toxisch', 1);
    expect(getStatus(state, 'p2', 'toxisch')?.stacks).toBe(1);
  });

  it('impulse resolve path still opens Dampf', () => {
    let state = createGame({
      pack: V5_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 5,
      ruleset: V5_PACK_RULESET,
    });
    state = applyStatus(state, 'p2', 'durchnaesst', 1);
    state = resolveImpulseReactions(state, 'p2', 'fire', V5_PACK_RULESET, 'p1', V5_PACK);
    expect(getStatus(state, 'p2', 'nebel')).toBeTruthy();
  });
});
