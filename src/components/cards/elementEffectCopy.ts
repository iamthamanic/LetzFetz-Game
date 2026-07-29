/**
 * German rule copy for V3 primary Elementeffekte (library detail).
 * Location: src/components/cards/elementEffectCopy.ts
 */
import type { Element, PrimaryMarkId } from '../../game/types';
import { ELEMENT_LABELS_DE } from '../ui/ElementIcon';
import { PRIMARY_MARK_LABEL_DE } from './elementMarkArt';

export interface ElementEffectCopy {
  markId: PrimaryMarkId;
  element: Element;
  name: string;
  elementLabel: string;
  stackable: boolean;
  maxStacks: number | null;
  summary: string;
  details: string[];
  tags: string[];
}

const COPY: Record<PrimaryMarkId, Omit<ElementEffectCopy, 'markId' | 'element' | 'name' | 'elementLabel'>> = {
  brennen: {
    stackable: true,
    maxStacks: 3,
    summary:
      'Nachdem der betroffene Charakter eine Hauptaktion vollständig ausgeführt hat, erleidet er einen Schaden und entfernt einen Brennen-Stapel.',
    details: [
      'Hauptaktionen: Angriff spielen, Block als aktive Aktion, Fetzgerät bauen/aktivieren, charaktereigene Hauptfähigkeit.',
      'Reaktionen und passive Trigger zählen nicht als Hauptaktion.',
    ],
    tags: ['Debuff', 'Reaktionsvorbereitung'],
  },
  durchnaesst: {
    stackable: false,
    maxStacks: null,
    summary: 'Keine eigenständige Wirkung. Durchnässt bereitet Wasserreaktionen vor.',
    details: [],
    tags: ['Neutrale Marke', 'Reaktionsvorbereitung'],
  },
  high: {
    stackable: true,
    maxStacks: 3,
    summary:
      'Vor einem eigenen Würfelwurf darf einmal pro Würfelwurf ein High-Stapel ausgegeben werden, um einen eigenen Würfel neu zu würfeln. Das neue Ergebnis muss akzeptiert werden.',
    details: [
      'Würde ein Charakter einen vierten High-Stapel erhalten, werden alle High-Stapel entfernt. Der Charakter erhält Verpeilt.',
    ],
    tags: ['Gemischter Buff', 'Reaktionsvorbereitung'],
  },
  aufgewirbelt: {
    stackable: false,
    maxStacks: null,
    summary: 'Keine eigenständige Wirkung. Aufgewirbelt bereitet Luftreaktionen vor.',
    details: [
      'Bestimmte Luftkarten und Engines dürfen Aufgewirbelt zusätzlich als Ressource verbrauchen.',
    ],
    tags: ['Reaktionsvorbereitung'],
  },
  erleuchtet: {
    stackable: false,
    maxStacks: null,
    summary:
      'Zu Beginn des eigenen Zuges darf Verstrahlt entfernt werden, um entweder einen negativen Status zu entfernen oder einen Schild zu erhalten.',
    details: [],
    tags: ['Positiver Status', 'Reaktionsvorbereitung'],
  },
  verflucht: {
    stackable: true,
    maxStacks: 3,
    summary:
      'Beim nächsten Würfelwurf des betroffenen Charakters wird ein Fluch-Stapel entfernt. Der Gegner darf nach dem Wurf einen Würfel um 1 erhöhen oder verringern.',
    details: ['Pro Würfelwurf kann nur ein normaler Fluch-Stapel ausgelöst werden.'],
    tags: ['Debuff', 'Reaktionsvorbereitung'],
  },
};

export function getElementEffectCopy(
  markId: PrimaryMarkId,
  element: Element,
): ElementEffectCopy {
  const base = COPY[markId];
  return {
    markId,
    element,
    name: PRIMARY_MARK_LABEL_DE[markId],
    elementLabel: ELEMENT_LABELS_DE[element],
    ...base,
  };
}
