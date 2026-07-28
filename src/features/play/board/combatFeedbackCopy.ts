/**
 * German combat feedback toast copy (Vollblock / Auto-Reaktion / Schild).
 * Location: src/features/play/board/combatFeedbackCopy.ts
 */

export type CombatFeedbackKind = 'vollblock' | 'auto-reaction' | 'shield-absorb';

export interface CombatFeedbackToastItem {
  kind: CombatFeedbackKind;
  title: string;
  body: string;
  testId: string;
}

const VOLLBLOCK_TOAST: CombatFeedbackToastItem = {
  kind: 'vollblock',
  title: 'Vollblock',
  body: 'Angriff vollständig geblockt — kein Schaden.',
  testId: 'combat-feedback-vollblock',
};

/**
 * Derive visible combat-feedback toasts from engine `lastEvent`.
 * Safe for partial blocks / hits: no Vollblock toast when damage text is present.
 */
export function parseCombatFeedbackToasts(
  lastEvent: string | null | undefined,
): CombatFeedbackToastItem[] {
  if (!lastEvent) return [];

  const toasts: CombatFeedbackToastItem[] = [];

  const hasDamage = /\d+\s+Schaden/.test(lastEvent);
  const isVollblock =
    !hasDamage &&
    (lastEvent.includes('Vollblock') || lastEvent.includes('Komplett geblockt'));
  if (isVollblock) {
    toasts.push(VOLLBLOCK_TOAST);
  }

  const autoMatch = lastEvent.match(/Auto-Reaktion:\s*([^.\n]+)/);
  if (autoMatch) {
    const name = autoMatch[1].trim();
    toasts.push({
      kind: 'auto-reaction',
      title: 'Auto-Reaktion',
      body: `${name} — automatisch ausgelöst (keine Wahl nötig).`,
      testId: 'combat-feedback-auto-reaction',
    });
  }

  const shieldMatch = lastEvent.match(/Schild\s+(\d+)/);
  if (shieldMatch) {
    const amount = shieldMatch[1];
    toasts.push({
      kind: 'shield-absorb',
      title: 'Schild',
      body: `${amount} Schaden vom Schild absorbiert.`,
      testId: 'combat-feedback-shield-absorb',
    });
  }

  return toasts;
}

/** Resolve-screen outcome label when post-block damage is 0. */
export function formatVollblockOutcomeLabel(): string {
  return 'Vollblock';
}
