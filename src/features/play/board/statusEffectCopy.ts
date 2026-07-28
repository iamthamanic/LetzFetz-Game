/**
 * Short German Wirkungscopy for V3 status chips (§6/§7).
 * Location: src/features/play/board/statusEffectCopy.ts
 */
import type { StatusId } from '../../../game/types';

const STATUS_EFFECT_DE: Record<StatusId, string> = {
  brennen: 'Primärmarke Feuer: Tick-Schaden; Impuls kann Reaktionen auslösen.',
  durchnaesst: 'Primärmarke Wasser: schwächt Brand; Impuls kann Dampf o.ä. auslösen.',
  high: 'Primärmarke Luft: stapelbar; Überdosierung → Verpeilt.',
  aufgewirbelt: 'Primärmarke Luft/Erde-Nähe: erschwert Zielen / Kontrolle.',
  erleuchtet: 'Primärmarke Licht: deckt auf / verstärkt Licht-Impulse.',
  verflucht: 'Primärmarke Schatten: stapelbar; dunkle Impulse und Reaktionen.',
  nebel: 'Sicht und Treffer erschwert; oft aus Dampf/Reaktionen.',
  dichter_nebel: 'Stärkerer Nebel: noch schwerer zu treffen.',
  verpeilt: 'Überdosierung High: Aktionen gestört / Risiko erhöht.',
  geblendet: 'Blendung: Angriffe und Reaktionen erschwert.',
  gift: 'Tick-Schaden über Züge; stapelbar bis Cap.',
  ueberflutet: 'Wasser-Überladung: Kontrolle / Bewegung beeinträchtigt.',
  fokus: 'Konzentration: stärkt nächste Aktion oder Impuls.',
  ausgeblendet: 'Schwerer zu treffen / aus dem Fokus genommen.',
};

const SHIELD_EFFECT_DE =
  'Schild absorbiert Schaden vor Leben (nicht gleich Vollblock). Max. 5.';

const FALLBACK_DE = 'Aktiver Status — siehe Regelwerk V3 für Details.';

/** Wirkungstext für einen Status; unbekannte Ids → generischer Fallback. */
export function statusEffectCopyDe(id: string): string {
  if (id in STATUS_EFFECT_DE) {
    return STATUS_EFFECT_DE[id as StatusId];
  }
  return FALLBACK_DE;
}

export function shieldEffectCopyDe(): string {
  return SHIELD_EFFECT_DE;
}
