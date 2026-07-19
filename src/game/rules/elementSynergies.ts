/**
 * Element synergies from rulebook §11 — display + future engine source of truth.
 * Counts only your bound cards of that element (exhausted still count).
 * Location: src/game/rules/elementSynergies.ts
 */
import type { Element } from '../types/elements';

export interface ElementSynergyTexts {
  /** Effect when ≥2 bound cards of this element. */
  at2: string;
  /** Effect when ≥3 bound cards of this element. */
  at3: string;
}

/** Rulebook §11 — not yet applied by the engine; UI shows these for playtest clarity. */
export const ELEMENT_SYNERGIES: Record<Element, ElementSynergyTexts> = {
  fire: {
    at2: '1×/Zug Angriffswurf wiederholen (neues Ergebnis zählt)',
    at3: 'Bei Wurf 5–6: +1 Schaden nach Abrechnung (nur wenn ≥1 Schaden)',
  },
  water: {
    at2: '1×/gegnerischem Zug Blockwurf wiederholen',
    at3: 'Bei Blockwurf 5–6: heile 1 nach Abrechnung',
  },
  earth: {
    at2: 'Gebaute Karten +1 Widerstand gegen Herausfordern',
    at3: '1×/Zug 1 Schaden verhindern (Angriff/Boost/Glitch/Ulti)',
  },
  air: {
    at2: 'Nach dem Bauen: 1 ziehen, dann 1 abwerfen (1×/Zug)',
    at3: '1×/Zug: 1 eigene Gebaute auf Hand, dann 1 von Hand bauen (kein normaler Bau)',
  },
  shadow: {
    at2: 'Beim Boost: Gegner wirft 1 ab (Gegner wählt)',
    at3: '1×/Zug: 1 Handkarte abwerfen → 1 gegnerische Gebaute erschöpfen',
  },
  light: {
    at2: 'Beim Ulti: danach 1 ziehen',
    at3: '1×/Zug beim Aktivieren einer Gebauten: heile 1',
  },
};

export function getElementSynergy(element: Element): ElementSynergyTexts {
  return ELEMENT_SYNERGIES[element];
}
