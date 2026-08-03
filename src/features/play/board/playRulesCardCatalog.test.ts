/**
 * Unit tests for V5 play-rules card catalog builder.
 * Location: src/features/play/board/playRulesCardCatalog.test.ts
 */
import { describe, it, expect } from 'vitest';
import { V5_PACK } from '../../../game/packs/v5';
import {
  PLAY_RULES_CARDS_SECTION_ID,
  V5_PLAY_RULES_CARD_SECTIONS,
  buildPlayRulesCardSections,
} from './playRulesCardCatalog';

describe('buildPlayRulesCardSections', () => {
  const sections = V5_PLAY_RULES_CARD_SECTIONS;

  it('exposes stable cards catalog id', () => {
    expect(PLAY_RULES_CARDS_SECTION_ID).toBe('play-rules-cards');
  });

  it('includes all required category section ids', () => {
    const ids = sections.map((s) => s.id);
    expect(ids).toContain('karten-katalog-intro');
    expect(ids).toContain('karten-element');
    expect(ids).toContain('karten-glitch');
    expect(ids).toContain('karten-charakter');
    expect(ids).toContain('karten-ulti');
    expect(ids).toContain('karten-technik');
    expect(ids).toContain('karten-essenz');
    expect(ids).toContain('karten-katalysator');
    expect(ids).toContain('karten-gegenstand');
    expect(ids).toContain('karten-arena');
  });

  it('lists every V5 pack card name in the matching category body', () => {
    const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
    for (const card of V5_PACK.elementCards) {
      expect(byId['karten-element']!.body).toContain(card.name);
      expect(byId['karten-element']!.body).toContain(card.instantText);
    }
    for (const card of V5_PACK.glitches) {
      expect(byId['karten-glitch']!.body).toContain(card.name);
      expect(byId['karten-glitch']!.body).toContain(card.effectText);
    }
    for (const card of V5_PACK.characters) {
      expect(byId['karten-charakter']!.body).toContain(card.name);
      expect(byId['karten-charakter']!.body).toContain(card.passiveText);
    }
    for (const card of V5_PACK.ultimates) {
      expect(byId['karten-ulti']!.body).toContain(card.name);
      expect(byId['karten-ulti']!.body).toContain(card.effectText);
    }
    for (const card of V5_PACK.techniques ?? []) {
      expect(byId['karten-technik']!.body).toContain(card.name);
      expect(byId['karten-technik']!.body).toContain(card.effectText);
    }
    for (const card of V5_PACK.essences ?? []) {
      expect(byId['karten-essenz']!.body).toContain(card.name);
    }
    for (const card of V5_PACK.catalysts ?? []) {
      expect(byId['karten-katalysator']!.body).toContain(card.name);
    }
    for (const card of V5_PACK.items ?? []) {
      expect(byId['karten-gegenstand']!.body).toContain(card.name);
      expect(byId['karten-gegenstand']!.body).toContain(card.effectText);
    }
    for (const card of V5_PACK.arenas) {
      expect(byId['karten-arena']!.body).toContain(card.name);
    }
  });

  it('buildPlayRulesCardSections is deterministic for same inputs', () => {
    const a = buildPlayRulesCardSections(V5_PACK);
    const b = buildPlayRulesCardSections(V5_PACK);
    expect(a.map((s) => s.id)).toEqual(b.map((s) => s.id));
    expect(a[0]?.body).toBe(b[0]?.body);
  });
});
