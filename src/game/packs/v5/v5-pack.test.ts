/**
 * V5 MVP pack smoke tests (#225).
 * Location: src/game/packs/v5/v5-pack.test.ts
 */
import { describe, expect, it } from 'vitest';
import { createGame } from '../../engine/createGame';
import { applyAction, getLegalActions } from '../../engine/actions';
import { buildMainDeckInstances, createSeededRng } from '../../engine/deck';
import {
  V5_MIX,
  V5_PACK,
  V5_PACK_MAIN_DECK_SIZE,
  V5_PACK_RULESET,
} from './v5-pack';
import { formulaSlotForDef } from '../../engine/formulaSlots';

describe('V5_PACK', () => {
  it('exports MVP-9 formula + 6 items', () => {
    expect(V5_PACK.techniques).toHaveLength(3);
    expect(V5_PACK.essences).toHaveLength(3);
    expect(V5_PACK.catalysts).toHaveLength(3);
    expect(V5_PACK.items).toHaveLength(6);
    expect(V5_PACK_MAIN_DECK_SIZE).toBe(
      V5_MIX.element +
        V5_MIX.technique +
        V5_MIX.essence +
        V5_MIX.catalyst +
        V5_MIX.item +
        V5_MIX.glitch,
    );
    expect(V5_PACK_MAIN_DECK_SIZE).toBeLessThan(106);
  });

  it('builds main deck including formula + items', () => {
    const deck = buildMainDeckInstances(V5_PACK, createSeededRng(1));
    expect(deck).toHaveLength(V5_PACK_MAIN_DECK_SIZE);
    expect(deck.some((c) => c.defId === 'v5-technik-durchschuss')).toBe(true);
    expect(deck.some((c) => c.defId === 'v5-item-rostiger-nagel')).toBe(true);
  });

  it('createGame smoke: draw + formula build', () => {
    let state = createGame({
      pack: V5_PACK,
      p1CharacterId: 'knuspergnom',
      p2CharacterId: 'schluckspecht',
      startingPlayer: 'p1',
      seed: 42,
      ruleset: V5_PACK_RULESET,
    });
    expect(state.meta.v5FormulaEnabled).toBe(true);
    expect(state.players.p1.hp).toBe(20);

    state = applyAction(
      state,
      { type: 'ADVANCE_PHASE' },
      'p1',
      { pack: V5_PACK, ruleset: V5_PACK_RULESET },
    );
    state = applyAction(
      state,
      { type: 'ADVANCE_PHASE' },
      'p1',
      { pack: V5_PACK, ruleset: V5_PACK_RULESET },
    );
    expect(state.phase).toBe('build');

    // Inject a formula card if not drawn
    if (!state.players.p1.hand.some((c) => formulaSlotForDef(V5_PACK, c.defId))) {
      state = {
        ...state,
        players: {
          ...state.players,
          p1: {
            ...state.players.p1,
            hand: [
              ...state.players.p1.hand,
              { instanceId: 'force-tech', defId: 'v5-technik-durchschuss' },
            ],
          },
        },
      };
    }
    const tech = state.players.p1.hand.find((c) => formulaSlotForDef(V5_PACK, c.defId));
    expect(tech).toBeDefined();
    const builds = getLegalActions(state, {
      pack: V5_PACK,
      playerId: 'p1',
      ruleset: V5_PACK_RULESET,
    }).filter((a) => a.type === 'FORMULA_BUILD');
    expect(builds.length).toBeGreaterThan(0);
    state = applyAction(
      state,
      { type: 'FORMULA_BUILD', cardInstanceId: tech!.instanceId },
      'p1',
      { pack: V5_PACK, ruleset: V5_PACK_RULESET },
    );
    const slot = formulaSlotForDef(V5_PACK, tech!.defId)!;
    expect(state.players.p1.formula[slot]?.defId).toBe(tech!.defId);
  });

  it('ships V5 §25 character passive + Großformel copy', () => {
    expect(V5_PACK.characters).toHaveLength(7);
    expect(V5_PACK.ultimates).toHaveLength(7);
    const knusp = V5_PACK.characters.find((c) => c.id === 'knuspergnom');
    expect(knusp?.passiveText).toMatch(/Formel/);
    const ulti = V5_PACK.ultimates.find((u) => u.id === 'ulti-kokabell');
    expect(ulti?.effectText).toMatch(/Formelkomponenten/);
  });
});
