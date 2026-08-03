/**
 * V6 Spielregeln sections smoke.
 * Location: src/features/play/board/playRulesSectionsV6.test.ts
 */
import { describe, expect, it } from 'vitest';
import { V6_PLAY_RULE_SECTIONS } from './playRulesSectionsV6';

describe('V6_PLAY_RULE_SECTIONS', () => {
  it('covers Slice-1 topics without V5 ulti-as-core wording', () => {
    expect(V6_PLAY_RULE_SECTIONS.length).toBeGreaterThanOrEqual(4);
    const blob = V6_PLAY_RULE_SECTIONS.map((s) => `${s.title}\n${s.body}`).join('\n');
    expect(blob).toMatch(/Rezept/);
    expect(blob).toMatch(/Katalysator/);
    expect(blob).toMatch(/Echo/);
    expect(blob).toMatch(/Konstrukt/);
    expect(blob).toMatch(/Affinität/);
    expect(blob).toMatch(/feste Macke/i);
    expect(blob).toMatch(/keine charaktergebundenen Großformeln/i);
    expect(blob).toMatch(/Überformel/);
    expect(blob).toMatch(/\+2 Primär/);
    expect(blob).toMatch(/Arenen/);
    expect(blob).toMatch(/Vulkan/);
    expect(blob).toMatch(/max 1 pro Timing/);
  });
});
