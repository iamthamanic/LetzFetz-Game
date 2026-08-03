/**
 * V5 full formula pack smoke tests (#231).
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
  V5_TARGET_MAIN_DECK_SIZE,
} from './v5-pack';
import { formulaSlotForDef } from '../../engine/formulaSlots';

describe('V5_PACK', () => {
  it('exports 9+6+10 formula + 8 items and deck size 97', () => {
    expect(V5_PACK.techniques).toHaveLength(9);
    expect(V5_PACK.essences).toHaveLength(6);
    expect(V5_PACK.catalysts).toHaveLength(10);
    expect(V5_PACK.items).toHaveLength(8);
    expect(V5_MIX.technique).toBe(9);
    expect(V5_MIX.essence).toBe(6);
    expect(V5_MIX.catalyst).toBe(10);
    expect(V5_MIX.item).toBe(8);
    expect(V5_MIX.element).toBe(54);
    expect(V5_PACK.elementCards).toHaveLength(54);
    expect(V5_PACK.elementCards.filter((c) => c.cardType === 'attack')).toHaveLength(24);
    expect(V5_PACK.elementCards.filter((c) => c.cardType === 'block')).toHaveLength(24);
    expect(V5_PACK.elementCards.filter((c) => c.cardType === 'boost')).toHaveLength(6);
    expect(V5_PACK_MAIN_DECK_SIZE).toBe(
      V5_MIX.element +
        V5_MIX.technique +
        V5_MIX.essence +
        V5_MIX.catalyst +
        V5_MIX.item +
        V5_MIX.glitch,
    );
    expect(V5_TARGET_MAIN_DECK_SIZE).toBe(97);
    expect(V5_PACK_MAIN_DECK_SIZE).toBe(97);
    expect(V5_PACK_RULESET.mainDeckSize).toBe(97);
    expect(V5_PACK.arenas).toHaveLength(6);
    expect(V5_PACK.arenas.every((a) => !a.d6Variants)).toBe(true);
  });

  it('ships resolving formulaEffect on every formula card', () => {
    for (const t of V5_PACK.techniques ?? []) {
      expect(t.formulaEffect, t.id).toBeDefined();
    }
    for (const e of V5_PACK.essences ?? []) {
      expect(e.formulaEffect, e.id).toBeDefined();
    }
    for (const c of V5_PACK.catalysts ?? []) {
      expect(c.formulaEffect, c.id).toBeDefined();
    }
  });

  it('Verdichtung effectText mentions elemental Angriff/Block/Boost +1', () => {
    const cat = V5_PACK.catalysts?.find((c) => c.id === 'v5-katalysator-verdichtung');
    expect(cat).toBeDefined();
    expect(cat?.effectText).toMatch(/Elementarkarte/);
    expect(cat?.effectText).toMatch(/Angriff/);
    expect(cat?.effectText).toMatch(/Block/);
    expect(cat?.effectText).toMatch(/Boost/);
    expect(cat?.formulaEffect).toMatchObject({
      kind: 'primary_bonus',
      amount: 1,
      stabilityBuffUsed: 1,
      nextActionValueBonus: 1,
    });
  });

  it('ships visual profiles on all formula cards', () => {
    for (const t of V5_PACK.techniques ?? []) {
      expect(t.visual?.id, t.id).toBeTruthy();
      expect(t.visual?.delivery, t.id).toBeTruthy();
      expect(t.visual?.shape, t.id).toBeTruthy();
    }
    for (const e of V5_PACK.essences ?? []) {
      expect(e.visual?.id, e.id).toBeTruthy();
      expect(e.visual?.element, e.id).toBe(e.element);
      expect(e.visual?.materialProfile, e.id).toBeTruthy();
    }
    for (const c of V5_PACK.catalysts ?? []) {
      expect(c.visual?.id, c.id).toBeTruthy();
      expect(c.visual?.timing, c.id).toBeTruthy();
      expect(c.visual?.transformation, c.id).toBeTruthy();
      expect(c.visual?.animationProfile, c.id).toBeTruthy();
    }
  });

  it('builds main deck including full formula + items', () => {
    const deck = buildMainDeckInstances(V5_PACK, createSeededRng(1));
    expect(deck).toHaveLength(V5_PACK_MAIN_DECK_SIZE);
    expect(deck.some((c) => c.defId === 'v5-technik-impulsgeschoss')).toBe(true);
    expect(deck.some((c) => c.defId === 'v5-technik-bannkreis')).toBe(true);
    expect(deck.some((c) => c.defId === 'v5-essenz-wasser')).toBe(true);
    expect(deck.some((c) => c.defId === 'v5-katalysator-ueberspannung')).toBe(true);
    expect(deck.some((c) => c.defId === 'v5-item-rostiger-nagel')).toBe(true);
  });

  it('includes every shipped Technik / Essenz / Katalysator def in the main deck', () => {
    const deck = buildMainDeckInstances(V5_PACK, createSeededRng(7));
    const deckIds = new Set(deck.map((c) => c.defId));
    for (const t of V5_PACK.techniques ?? []) {
      expect(deckIds.has(t.id), `missing Technik ${t.id}`).toBe(true);
    }
    for (const e of V5_PACK.essences ?? []) {
      expect(deckIds.has(e.id), `missing Essenz ${e.id}`).toBe(true);
    }
    for (const c of V5_PACK.catalysts ?? []) {
      expect(deckIds.has(c.id), `missing Katalysator ${c.id}`).toBe(true);
    }
    expect(V5_PACK.techniques).toHaveLength(9);
    expect(V5_PACK.essences).toHaveLength(6);
    expect(V5_PACK.catalysts).toHaveLength(10);
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
    expect(state.players.p1.hp).toBe(30);

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

    if (!state.players.p1.hand.some((c) => formulaSlotForDef(V5_PACK, c.defId))) {
      state = {
        ...state,
        players: {
          ...state.players,
          p1: {
            ...state.players.p1,
            hand: [
              ...state.players.p1.hand,
              { instanceId: 'force-tech', defId: 'v5-technik-impulsgeschoss' },
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
