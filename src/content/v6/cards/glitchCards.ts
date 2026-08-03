/**
 * V6 core Standard-Glitches — explicit Aktionsphase / Reaktion timing (§9, §37–40).
 * Location: src/content/v6/cards/glitchCards.ts
 *
 * SoT for V6_CORE_PACK.glitches. Same defIds as Base so art + reaction hooks stay wired.
 * Negative Sofort-Glitches are intentionally absent (Chaos expansion later).
 */
import type { GlitchCardDef } from '../../../game/types';

/** V6 Standard-Glitches — playable only; no Sofort-Negativ. */
export const V6_STANDARD_GLITCHES: GlitchCardDef[] = [
  {
    id: 'glitch-riss',
    name: 'Riss in der Realität',
    kind: 'glitch',
    glitchType: 'playable',
    timing: 'Aktionsphase (Hauptaktion)',
    effectText:
      'Lege die aktuelle Arena ab und decke zufällig eine andere Arena auf. Die neue Arena gilt sofort; bereits ausgelöste Effekte der alten Arena bleiben bestehen.',
  },
  {
    id: 'glitch-nein',
    name: 'Nein, Bruder',
    kind: 'glitch',
    glitchType: 'playable',
    timing: 'Reaktion: wenn der Gegner einen Boost spielt',
    effectText: 'Der Boost wird verhindert und abgelegt.',
  },
  {
    id: 'glitch-kurzschluss',
    name: 'Kurzschluss',
    kind: 'glitch',
    glitchType: 'playable',
    timing: 'Aktionsphase (Hauptaktion)',
    effectText: 'Erschöpfe 1 gegnerische Formelkomponente.',
  },
  {
    id: 'glitch-rueckkopplung',
    name: 'Rückkopplung',
    kind: 'glitch',
    glitchType: 'playable',
    timing: 'Reaktion: wenn du Angriffsschaden bekommst',
    effectText: 'Reduziere diesen Schaden um 2.',
  },
  {
    id: 'glitch-empfang',
    name: 'Schlechter Empfang',
    kind: 'glitch',
    glitchType: 'playable',
    timing: 'Aktionsphase (Hauptaktion)',
    effectText:
      'Gegner darf bis zum Ende seines nächsten Zuges keine Karten außerhalb der normalen Ziehphase ziehen.',
  },
  {
    id: 'glitch-systemfehler',
    name: 'Systemfehler',
    kind: 'glitch',
    glitchType: 'playable',
    timing: 'Aktionsphase (Hauptaktion)',
    effectText:
      'Störe 1 Formelkomponente. Sie verliert bis zur Startphase ihres Besitzers ihre Aktivierbarkeit.',
  },
  {
    id: 'glitch-download',
    name: 'Illegaler Download',
    kind: 'glitch',
    glitchType: 'playable',
    timing: 'Aktionsphase (Hauptaktion)',
    effectText:
      'Wirf 1 Handkarte ab. Erschöpfe 1 gegnerische Formelkomponente und ziehe 1 Karte.',
  },
];
