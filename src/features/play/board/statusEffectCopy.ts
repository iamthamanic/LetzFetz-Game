/**
 * Short German Wirkungscopy for combat status chips (V5 §18 / §20).
 * Location: src/features/play/board/statusEffectCopy.ts
 */
import {
  PRIMARY_MARK_LABEL_DE,
  type PrimaryMarkId,
  type StatusId,
  isStatusId,
} from '../../../game/types';

const STATUS_EFFECT_DE: Record<StatusId, string> = {
  brennen: 'Zu Beginn des nächsten eigenen Zuges: 1 Lebensschaden (ignoriert Schild). Danach entfernen.',
  durchnaesst: 'Nächster Block −1 Kampfwert. Danach entfernen (sonst spätestens Endphase).',
  high: 'Nächster W6-Bonus auf Angriff oder Block wird zu +0. Danach entfernen (sonst Endphase).',
  aufgewirbelt: 'Nächster Angriff oder Herausforderung −1 Kampfwert. Danach entfernen (sonst Endphase).',
  erleuchtet:
    'Nächste Herausforderung gegen eine eigene Formelkomponente erhält +1 Angriffswert. Danach entfernen (sonst Endphase).',
  verflucht: 'Nächster eigener Heil- oder Schildgewinn −1. Danach entfernen (sonst Endphase).',
  nebel: 'Nächster Angriff und nächster Block jeweils −1. Danach entfernen.',
  dichter_nebel: 'Stärkerer Nebel: Angriff und Block stärker erschwert.',
  nebelbank: 'Angriffe von und gegen dich −1 bis zur nächsten Startphase.',
  verpeilt: 'Überdosierung High: Aktionen gestört.',
  geblendet: 'Nächster Block −2; bis zur nächsten Startphase kein Reaktions-Glitch.',
  gift: 'Tick-Schaden über Züge; stapelbar bis Cap.',
  toxisch: 'Beim nächsten Boost oder Gegenstand: 1 Lebensschaden. Danach entfernen.',
  ueberflutet: 'Bis zu 2 Schild entfernt; ohne Schild nächster Block −1.',
  fokus: 'Konzentration: stärkt nächste Aktion.',
  ausgeblendet: 'Schwerer zu treffen / aus dem Fokus.',
  heilblockade: 'Keine Heilung bis zum angegebenen Zeitpunkt.',
  katalysatorausfall: 'Katalysator wird bei der nächsten Formelaktivierung ignoriert.',
  stabilitaetsbruch: 'Gewählte Formelkomponente vorübergehend −1 Stabilität.',
};

const SHIELD_EFFECT_DE =
  'Schild absorbiert Schaden vor Leben (nicht gleich Vollblock). Max. 5.';

const FALLBACK_DE = 'Aktiver Status — siehe SPIELANLEITUNG_V5_DRAFT / Spielkonzept.';

/** Display name for chips (V5 labels for primary marks). */
export function statusLabelDe(id: string): string {
  if (id in PRIMARY_MARK_LABEL_DE) {
    return PRIMARY_MARK_LABEL_DE[id as PrimaryMarkId];
  }
  if (isStatusId(id)) {
    return id
      .split('_')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }
  return id;
}

/** Wirkungstext für einen Status; unbekannte Ids → generischer Fallback. */
export function statusEffectCopyDe(id: string): string {
  if (isStatusId(id)) {
    return STATUS_EFFECT_DE[id];
  }
  return FALLBACK_DE;
}

export function shieldEffectCopyDe(): string {
  return SHIELD_EFFECT_DE;
}
