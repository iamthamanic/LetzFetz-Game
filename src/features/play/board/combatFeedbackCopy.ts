/**
 * German combat feedback toast copy (Vollblock / Auto-Reaktion / Schild / Echo).
 * Location: src/features/play/board/combatFeedbackCopy.ts
 */

export type CombatFeedbackKind =
  | 'vollblock'
  | 'auto-reaction'
  | 'shield-absorb'
  | 'echo-resolve'
  | 'delay-resolve'
  | 'construct-summon';

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

  if (/\bEcho:/.test(lastEvent) || lastEvent.includes('Echo in Warteschlange')) {
    const queued = lastEvent.includes('Warteschlange');
    toasts.push({
      kind: 'echo-resolve',
      title: queued ? 'Echo geplant' : 'Echo aufgelöst',
      body: queued
        ? 'Primäreffekt jetzt; Wiederholung in der nächsten Startphase. Katalysator bleibt.'
        : lastEvent.replace(/^.*?(Echo:)/, '$1').trim(),
      testId: 'combat-feedback-echo',
    });
  }

  if (
    /\bVerzögerung:/.test(lastEvent) ||
    lastEvent.includes('Verzögerung in Warteschlange')
  ) {
    const queued = lastEvent.includes('Warteschlange');
    toasts.push({
      kind: 'delay-resolve',
      title: queued ? 'Verzögerung geplant' : 'Verzögerung aufgelöst',
      body: queued
        ? 'Primäreffekt in der nächsten Startphase. Katalysator bleibt bis Auflösung.'
        : lastEvent.replace(/^.*?(Verzögerung:)/, '$1').trim(),
      testId: 'combat-feedback-delay',
    });
  }

  if (lastEvent.includes('Konstrukt beschworen')) {
    const replaced = lastEvent.includes('vorheriges abgelegt');
    toasts.push({
      kind: 'construct-summon',
      title: replaced ? 'Konstrukt ersetzt' : 'Konstrukt beschworen',
      body: replaced
        ? 'Neues Konstrukt steht — das vorherige wurde abgelegt.'
        : lastEvent.replace(/^.*?(Konstrukt beschworen)/, 'Konstrukt beschworen').trim(),
      testId: 'combat-feedback-construct',
    });
  }

  return toasts;
}

/** Resolve-screen outcome label when post-block damage is 0. */
export function formatVollblockOutcomeLabel(): string {
  return 'Vollblock';
}
