/**
 * V5 Primärmarken Wirkungscopy (spielkonzept §18) — shared by mark tokens + StatusChips.
 * Location: src/components/cards/primaryMarkEffectCopy.ts
 */
import type { PrimaryMarkId } from '../../game/types';
import { primaryMarkLabelDe } from '../../game/types';

/** Short DE effect lines for the six primary element marks. */
export const PRIMARY_MARK_EFFECT_DE: Record<PrimaryMarkId, string> = {
  brennen:
    'Zu Beginn des nächsten eigenen Zuges: 1 Lebensschaden (ignoriert Schild). Danach entfernen.',
  durchnaesst: 'Nächster Block −1 Kampfwert. Danach entfernen (sonst spätestens Endphase).',
  high: 'Nächster W6-Bonus auf Angriff oder Block wird zu +0. Danach entfernen (sonst Endphase).',
  aufgewirbelt:
    'Nächster Angriff oder Herausforderung −1 Kampfwert. Danach entfernen (sonst Endphase).',
  erleuchtet:
    'Nächste Herausforderung gegen eine eigene Formelkomponente erhält +1 Angriffswert. Danach entfernen (sonst Endphase).',
  verflucht: 'Nächster eigener Heil- oder Schildgewinn −1. Danach entfernen (sonst Endphase).',
};

export function primaryMarkEffectCopyDe(markId: PrimaryMarkId): string {
  return PRIMARY_MARK_EFFECT_DE[markId];
}

/** Tooltip / aria string: name, optional stacks, Wirkung. */
export function primaryMarkTooltipDe(markId: PrimaryMarkId, stacks = 1): string {
  const label = primaryMarkLabelDe(markId);
  const name = stacks > 1 ? `${label} ×${stacks}` : label;
  return `${name}: ${PRIMARY_MARK_EFFECT_DE[markId]}`;
}
