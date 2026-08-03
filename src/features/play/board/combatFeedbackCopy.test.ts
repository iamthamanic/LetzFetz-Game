/**
 * Unit tests for combat feedback toast copy (#150).
 * Location: src/features/play/board/combatFeedbackCopy.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  formatVollblockOutcomeLabel,
  parseCombatFeedbackToasts,
} from './combatFeedbackCopy';

describe('combatFeedbackCopy', () => {
  it('emits Vollblock toast for full-block lastEvent', () => {
    const toasts = parseCombatFeedbackToasts(
      'Komplett geblockt — Vollblock (6 vs 8).',
    );
    expect(toasts.map((t) => t.kind)).toEqual(['vollblock']);
    expect(toasts[0]?.testId).toBe('combat-feedback-vollblock');
    expect(toasts[0]?.title).toBe('Vollblock');
  });

  it('emits Auto-Reaktion toast with reaction name', () => {
    const toasts = parseCombatFeedbackToasts('Auto-Reaktion: Überhitzt.');
    expect(toasts).toHaveLength(1);
    expect(toasts[0]?.kind).toBe('auto-reaction');
    expect(toasts[0]?.body).toContain('Überhitzt');
    expect(toasts[0]?.body).toContain('keine Wahl');
    expect(toasts[0]?.testId).toBe('combat-feedback-auto-reaction');
  });

  it('emits Vollblock + Auto-Reaktion when both appear in lastEvent', () => {
    const toasts = parseCombatFeedbackToasts(
      'Komplett geblockt — Vollblock (6 vs 8). Auto-Reaktion: Dampf.',
    );
    expect(toasts.map((t) => t.kind)).toEqual(['vollblock', 'auto-reaction']);
  });

  it('skips Vollblock when damage text is present', () => {
    expect(
      parseCombatFeedbackToasts('3 Schaden (6 vs 3 Block). Schild 2.'),
    ).toEqual([
      expect.objectContaining({
        kind: 'shield-absorb',
        testId: 'combat-feedback-shield-absorb',
      }),
    ]);
  });

  it('ignores pick-reaction prompt (no auto toast)', () => {
    expect(parseCombatFeedbackToasts('Reaktion wählen.')).toEqual([]);
  });

  it('ignores manual Reaktion log without Auto- prefix', () => {
    expect(parseCombatFeedbackToasts('Reaktion: Überhitzt.')).toEqual([]);
  });

  it('labels resolve outcome as Vollblock', () => {
    expect(formatVollblockOutcomeLabel()).toBe('Vollblock');
  });

  it('emits Echo queue / resolve toasts', () => {
    expect(
      parseCombatFeedbackToasts('V6 Foo · Echo in Warteschlange (1).').map(
        (t) => t.kind,
      ),
    ).toEqual(['echo-resolve']);
    expect(
      parseCombatFeedbackToasts('Echo: Glutimpuls-Echo: damage 1').map(
        (t) => t.title,
      ),
    ).toEqual(['Echo aufgelöst']);
  });

  it('emits Verzögerung queue toast', () => {
    expect(
      parseCombatFeedbackToasts('V6 Bar · Verzögerung in Warteschlange (1).')[0]
        ?.kind,
    ).toBe('delay-resolve');
  });

  it('emits construct summon / replace toasts', () => {
    expect(
      parseCombatFeedbackToasts(
        'Konstrukt beschworen: Schattenpuppe (Haltbarkeit 3).',
      )[0],
    ).toMatchObject({
      kind: 'construct-summon',
      title: 'Konstrukt beschworen',
      testId: 'combat-feedback-construct',
    });
    expect(
      parseCombatFeedbackToasts(
        'Konstrukt beschworen: Schattenpuppe (Haltbarkeit 3) — vorheriges abgelegt.',
      )[0]?.title,
    ).toBe('Konstrukt ersetzt');
  });

  it('emits Überformel toast from overformula lastEvent', () => {
    expect(
      parseCombatFeedbackToasts(
        'V6 Überformel Glutimpuls · Verdichtung (overformula) damage 6 · Katalysator verbraucht [Impulsgeschoss]',
      )[0],
    ).toMatchObject({
      kind: 'ueberformel',
      title: 'Überformel',
      testId: 'combat-feedback-ueberformel',
    });
  });
});
