/**
 * V5 §25 character + Großformel copy for the V5 pack (Base pack keeps V1 wording).
 * Location: src/game/packs/v5/characters.ts
 */
import type { CharacterCardDef, UltimateCardDef } from '../../types';
import { BASE_PACK } from '../base-pack';

const V5_PASSIVE: Record<string, { role: string; passiveText: string; strategyHint: string }> = {
  knuspergnom: {
    role: 'Allrounder und Kartenfilter',
    passiveText:
      'Einmal pro Zug, wenn du eine Erde- oder Feuerkomponente baust oder eine Erde-/Feuerkarte in einer Formel verwendest: Du darfst 1 Karte abwerfen und 1 Karte ziehen.',
    strategyHint: 'Baue Erde/Feuer in die Formel und filtere die Hand.',
  },
  schluckspecht: {
    role: 'Sustain und Vollblock',
    passiveText: 'Einmal pro gegnerischem Zug bei Vollblock: Heile 1.',
    strategyHint: 'Blocke vollständig und heile Stück für Stück.',
  },
  stiernackenkommando: {
    role: 'Bruiser und Gegenangriff',
    passiveText:
      'Nach erlittenem Lebensschaden: Der nächste Angriff oder die nächste Herausforderung erhält +1. Maximum gespeicherter Bonus: +2.',
    strategyHint: 'Nimm Schaden und schlage mit Bonus zurück.',
  },
  kokabell: {
    role: 'Defensive und Stabilität',
    passiveText:
      'Einmal pro Zug, wenn du geheilt wirst: Eine eigene Formelkomponente erhält bis zu deiner nächsten Startphase +1 Stabilität.',
    strategyHint: 'Heile und härte deine Formel ab.',
  },
  pillendoktora: {
    role: 'Risiko und Tempo',
    passiveText:
      'Einmal pro Zug, wenn du einen Boost spielst, wähle: Ziehe 1 und verliere 1 Leben / Füge dem Gegner 1 Schaden zu / Heile 1.',
    strategyHint: 'Boosts für Tempo und flexible Risiken.',
  },
  dripministerin: {
    role: 'Kontrolle und Formelstörung',
    passiveText:
      'Einmal pro Zug, wenn eine gegnerische Formelkomponente gestört oder zerstört wird: Ziehe 1 und wirf danach 1 Karte ab.',
    strategyHint: 'Störe die gegnerische Formel und filtere die Hand.',
  },
  mysterium: {
    role: 'Flexibilität und Kopieren',
    passiveText:
      'Einmal pro Zug: Eine von dir gespielte Elementkarte oder eine verwendete Essenz zählt für diese Aktion als ein Element deiner Wahl.',
    strategyHint: 'Flexibel bleiben und Großformeln spiegeln.',
  },
};

const V5_ULTI_TEXT: Record<string, string> = {
  'ulti-knuspergnom':
    'Füge 5 Schaden zu. Heile 3. Du darfst danach eine Formelkomponente aus deiner Hand bauen.',
  'ulti-schluckspecht':
    'Heile 4. Füge 3 Schaden zu. Hast du danach weniger Leben als der Gegner, ziehe 1 Karte.',
  'ulti-stiernackenkommando':
    'Der nächste Angriff in diesem Zug wird nach allen Boni verdoppelt. Danach verlierst du 1 Leben. Die Großformel selbst verbraucht die Hauptaktion nicht; unmittelbar danach darf ausschließlich dieser Angriff gespielt werden.',
  'ulti-kokabell':
    'Bist du unter 12 Leben, setze dein Leben auf 12. Richte danach bis zu 2 eigene Formelkomponenten auf.',
  'ulti-pillendoktora': 'Heile 4. Füge 4 Schaden zu. Ziehe 2. Wirf danach 1 Karte ab.',
  'ulti-dripministerin':
    'Der Gegner wirft 2 Karten ab. Er verliert 3 Leben. Störe 1 gegnerische Formelkomponente.',
  'ulti-mysterium':
    'Kopiere die bereits verwendete oder noch verfügbare Großformel des Gegners. Führe sie mit dir als Zielbesitzer aus. Ziehe danach 1 Karte.',
};

export const V5_CHARACTERS: CharacterCardDef[] = BASE_PACK.characters.map((c) => {
  const overlay = V5_PASSIVE[c.id];
  if (!overlay) return c;
  return { ...c, ...overlay };
});

export const V5_ULTIMATES: UltimateCardDef[] = BASE_PACK.ultimates.map((u) => {
  const effectText = V5_ULTI_TEXT[u.id];
  if (!effectText) return u;
  return { ...u, effectText };
});
