/**
 * V5 formula + item card defs — 9 Technik + 6 Essenz + 10 Katalysator + 6 Items.
 * Location: src/game/packs/v5/formulaCards.ts
 *
 * Direct-formula cutover: Technik offense uses formula_damage (W6 defend);
 * Magiepanzer engine = 1 Schild (catalog hygiene). Schatten → Verflucht mark.
 */
import type {
  CatalystCardDef,
  EssenceCardDef,
  ItemCardDef,
  TechniqueCardDef,
} from '../../types';

function techVisual(
  id: string,
  delivery: TechniqueCardDef['visual'] extends infer V
    ? V extends { delivery: infer D }
      ? D
      : never
    : never,
  shape: 'drill' | 'slash' | 'sphere' | 'cone' | 'wall',
  castOrigin: string,
  forwardAxis: 'x' | 'y' | 'z' = 'z',
): NonNullable<TechniqueCardDef['visual']> {
  return {
    id,
    delivery,
    shape,
    castOrigin,
    forwardAxis,
    scaleClass: 'medium',
  };
}

/** Basic Technik set — display names match `/cards/formula/<slug>.png` (no Technik-prefix). */
export const V5_TECHNIQUES: TechniqueCardDef[] = [
  {
    kind: 'technique',
    id: 'v5-technik-impulsgeschoss',
    name: 'Impulsgeschoss',
    stability: 3,
    activationMode: 'instant',
    effectText: 'Verursache 2 Formelschaden.',
    formulaEffect: { kind: 'formula_damage', amount: 2 },
    visual: techVisual('impulsgeschoss', 'projectile', 'drill', 'hand', 'z'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-adrenalinschrei',
    name: 'Adrenalinschrei',
    stability: 3,
    activationMode: 'prep_boost',
    effectText:
      'Deine nächste Aktionskarte mit Zahlenwert erhält +2; ohne Zahlenwert ziehst du danach 1 und wirfst 1 ab.',
    formulaEffect: { kind: 'prep_boost', valueBonus: 2, filterHandIfNoValue: true },
    visual: techVisual('adrenalinschrei', 'area', 'sphere', 'self', 'y'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-fintenschnitt',
    name: 'Fintenschnitt',
    stability: 2,
    activationMode: 'instant',
    effectText: 'Der nächste gegen dich gerichtete Aktionsangriff erhält −2 Kampfwert.',
    formulaEffect: { kind: 'enemy_next_attack_penalty', amount: 2 },
    visual: techVisual('fintenschnitt', 'melee', 'slash', 'hand', 'x'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-brechschlag',
    name: 'Brechschlag',
    stability: 3,
    activationMode: 'instant',
    effectText: 'Verursache 1 Formelschaden und entferne zusätzlich 2 Schild.',
    formulaEffect: { kind: 'formula_damage', amount: 1, stripShield: 2 },
    visual: techVisual('brechschlag', 'melee', 'slash', 'hand', 'x'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-kettenfessel',
    name: 'Kettenfessel',
    stability: 3,
    activationMode: 'instant',
    effectText:
      'Wähle eine gegnerische Formelkomponente. Sie kann in der nächsten Formelphase nicht aktiviert werden.',
    formulaEffect: { kind: 'lock_enemy_formula_component' },
    visual: techVisual('kettenfessel', 'melee', 'slash', 'hand', 'x'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-bannkreis',
    name: 'Bannkreis',
    stability: 4,
    activationMode: 'instant',
    effectText:
      'Der nächste gegen dich gerichtete Formeleffekt wird um 1 Punkt reduziert.',
    formulaEffect: { kind: 'enemy_next_formula_mitigation', amount: 1 },
    visual: techVisual('bannkreis', 'area', 'wall', 'self', 'y'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-ueberraschungsangriff',
    name: 'Überraschungsangriff',
    stability: 3,
    activationMode: 'instant',
    effectText:
      'Verursache 2 Formelschaden. Der gegnerische Formel-Abwehrwurf erhält −1.',
    formulaEffect: { kind: 'formula_damage', amount: 2, defendPenalty: 1 },
    visual: techVisual('ueberraschungsangriff', 'melee', 'slash', 'hand', 'z'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-schicksalmanifestation',
    name: 'Schicksalmanifestation',
    stability: 2,
    activationMode: 'instant',
    effectText: 'Ziehe 2 Karten, behalte 1 davon und lege die andere auf den Ablagestapel.',
    formulaEffect: { kind: 'instant_draw_keep_one', draw: 2 },
    visual: techVisual('schicksalmanifestation', 'projectile', 'sphere', 'hand', 'z'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-magiepanzer',
    name: 'Magiepanzer',
    stability: 4,
    activationMode: 'instant',
    effectText: 'Erhalte 1 Schild.',
    formulaEffect: { kind: 'instant_shield', amount: 1 },
    visual: techVisual('magiepanzer', 'barrier', 'wall', 'self', 'y'),
  },
];

function essVisual(
  id: string,
  element: EssenceCardDef['element'],
  material: string,
  particle: string,
  trail: string,
  impact: string,
): NonNullable<EssenceCardDef['visual']> {
  return {
    id,
    element,
    materialProfile: material,
    particleProfile: particle,
    trailProfile: trail,
    impactProfile: impact,
  };
}

/** Basic Essenz set — display names = element labels matching `/cards/formula/<slug>.png`. */
export const V5_ESSENCES: EssenceCardDef[] = [
  {
    kind: 'essence',
    id: 'v5-essenz-feuer',
    name: 'Feuer',
    element: 'fire',
    stability: 2,
    effectText:
      'Fügt die Formel Lebensschaden zu und entsteht keine Reaktion, erhält das Ziel Brennen.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'brennen' },
    visual: essVisual('feuer', 'fire', 'ember', 'sparks', 'heat', 'burn'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-wasser',
    name: 'Wasser',
    element: 'water',
    stability: 3,
    effectText: 'Entsteht keine Reaktion, erhält das Ziel Durchnässt.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'durchnaesst' },
    visual: essVisual('wasser', 'water', 'mist', 'droplets', 'vapor', 'splash'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-erde',
    name: 'Erde',
    element: 'earth',
    stability: 2,
    effectText: 'Entsteht keine Reaktion, erhält das Ziel High.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'high' },
    visual: essVisual('erde', 'earth', 'stone', 'dust', 'quake', 'settle'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-luft',
    name: 'Luft',
    element: 'air',
    stability: 2,
    effectText: 'Entsteht keine Reaktion, erhält das Ziel Verwirbelt.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'aufgewirbelt' },
    visual: essVisual('luft', 'air', 'gale', 'wisps', 'spiral', 'gust'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-licht',
    name: 'Licht',
    element: 'light',
    stability: 2,
    effectText: 'Entsteht keine Reaktion, erhält das Ziel Verstrahlt.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'erleuchtet' },
    visual: essVisual('licht', 'light', 'prism', 'shards', 'beam', 'flare'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-schatten',
    name: 'Schatten',
    element: 'shadow',
    stability: 3,
    effectText:
      'Bei gegnergerichteter Formelwirkung entsteht Verflucht, sofern keine Elementreaktion entsteht.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'verflucht' },
    visual: essVisual('schatten', 'shadow', 'void', 'wisps', 'drain', 'siphon'),
  },
];

function catVisual(
  id: string,
  timing: NonNullable<CatalystCardDef['visual']>['timing'],
  transformation: NonNullable<CatalystCardDef['visual']>['transformation'],
  animationProfile: string,
): NonNullable<CatalystCardDef['visual']> {
  return { id, timing, transformation, animationProfile };
}

export const V5_CATALYSTS: CatalystCardDef[] = [
  {
    kind: 'catalyst',
    id: 'v5-katalysator-echo',
    name: 'Echo',
    stability: 2,
    effectText: 'Wiederhole zu Beginn deines nächsten Zuges 1 Punkt des Primärwerts.',
    formulaEffect: { kind: 'echo_next_start', amount: 1 },
    visual: catVisual('echo', 'delayed', 'duplicate', 'echo-ring'),
  },
  {
    kind: 'catalyst',
    id: 'v5-katalysator-ueberspannung',
    name: 'Überspannung',
    stability: 2,
    effectText: 'Erhöhe den Primärwert um 2. Nach vollständiger Auflösung verlierst du 1 Leben.',
    formulaEffect: { kind: 'primary_bonus', amount: 2, selfDamage: 1 },
    visual: catVisual('ueberspannung', 'instant', 'overcharge', 'surge'),
  },
  {
    kind: 'catalyst',
    id: 'v5-katalysator-verdichtung',
    name: 'Verdichtung',
    stability: 4,
    effectText:
      'Erhöhe den Primärwert um 1. Deine nächste Elementarkarte (Angriff, Block oder Boost) mit Zahlenwert erhält ebenfalls +1. Alle verwendeten Formelkomponenten erhalten bis zur nächsten Startphase +1 Stabilität.',
    formulaEffect: {
      kind: 'primary_bonus',
      amount: 1,
      stabilityBuffUsed: 1,
      nextActionValueBonus: 1,
    },
    visual: catVisual('verdichtung', 'instant', 'overcharge', 'compress'),
  },
  {
    kind: 'catalyst',
    id: 'v5-katalysator-ausbreitung',
    name: 'Ausbreitung',
    stability: 3,
    effectText:
      'Ein gegnergerichteter Effekt berührt zusätzlich eine Formelkomponente: Sie erhält bis zur nächsten Startphase −1 Stabilität. Ein selbstgerichteter Effekt gibt zusätzlich einer eigenen Komponente +1 Stabilität.',
    formulaEffect: { kind: 'spread_stability', amount: 1 },
    visual: catVisual('ausbreitung', 'instant', 'spread', 'spread-wave'),
  },
  {
    kind: 'catalyst',
    id: 'v5-katalysator-kettenkopplung',
    name: 'Kettenkopplung',
    stability: 3,
    effectText:
      'Wird die Formel erfolgreich, erhält deine nächste Aktion desselben Typs +1.',
    formulaEffect: { kind: 'chain_same_action', amount: 1 },
    visual: catVisual('kettenkopplung', 'continuous', 'chain', 'chain-link'),
  },
  {
    kind: 'catalyst',
    id: 'v5-katalysator-verzoegerung',
    name: 'Verzögerung',
    stability: 3,
    effectText:
      'Der Primäreffekt geschieht nicht sofort, sondern zu Beginn deines nächsten Zuges und erhält +2 auf seinen Primärwert.',
    formulaEffect: { kind: 'delay_primary', bonus: 2 },
    visual: catVisual('verzoegerung', 'delayed', 'duplicate', 'delay-clock'),
  },
  {
    kind: 'catalyst',
    id: 'v5-katalysator-sofortzuender',
    name: 'Sofortzünder',
    stability: 2,
    effectText:
      'Reduziere den Primärwert um 1. Ziehe nach der Auflösung 1 Karte und wirf anschließend 1 Karte ab.',
    formulaEffect: { kind: 'primary_bonus', amount: -1, drawDiscardAfter: true },
    visual: catVisual('sofortzuender', 'instant', 'overcharge', 'fuse'),
  },
  {
    kind: 'catalyst',
    id: 'v5-katalysator-spiegelung',
    name: 'Spiegelung',
    stability: 3,
    effectText:
      'Offensive Formel: Nach erfolgreichem Treffer erhältst du 1 Schild. Defensive Formel: Bei Vollblock oder Schildgewinn erleidet der Gegner 1 Schaden.',
    formulaEffect: { kind: 'mirror_shield_on_hit', amount: 1 },
    visual: catVisual('spiegelung', 'instant', 'reflect', 'mirror-flash'),
  },
  {
    kind: 'catalyst',
    id: 'v5-katalysator-umkehrung',
    name: 'Umkehrung',
    stability: 2,
    effectText:
      'Wähle bei Aktivierung: Bis zu 2 Punkte Schaden werden zu Heilung oder bis zu 2 Punkte Heilung/Schild werden zu Schaden. Das Ziel muss legal bleiben.',
    formulaEffect: { kind: 'invert_damage_heal', maxPoints: 2 },
    visual: catVisual('umkehrung', 'instant', 'reflect', 'invert'),
  },
  {
    kind: 'catalyst',
    id: 'v5-katalysator-opfergabe',
    name: 'Opfergabe',
    stability: 3,
    effectText:
      'Du darfst bei Aktivierung 1 Handkarte abwerfen. Tust du dies, erhöht sich der Primärwert um 2.',
    formulaEffect: { kind: 'offer_discard_for_bonus', amount: 2 },
    visual: catVisual('opfergabe', 'instant', 'overcharge', 'offering'),
  },
];

/** §21 Gegenstände — consumables + permanent equipment (not formula). */
export const V5_ITEMS: ItemCardDef[] = [
  {
    kind: 'item',
    id: 'v5-item-nasser-socken',
    name: 'Nasser Socken',
    timing: 'action',
    permanence: 'equipment',
    effectText:
      'Ausrüstung (einmalig). Belegt einen Ausrüstungsslot. Dein nächster Angriff erhält zusätzlich Wasser; bei erfolgreichem Treffer ohne Reaktion mindestens Durchnässt — danach Ablage.',
  },
  {
    kind: 'item',
    id: 'v5-item-kaputter-rueckspiegel',
    name: 'Kaputter Rückspiegel',
    timing: 'reaction',
    permanence: 'equipment',
    effectText:
      'Ausrüstung. Einmal pro Runde, wenn du angegriffen wirst: Angriffswert −1. Bei Vollblock erhält der Angreifer Verstrahlt.',
  },
  {
    kind: 'item',
    id: 'v5-item-halbe-dose-energy',
    name: 'Halbe Dose Energy',
    timing: 'action',
    permanence: 'consumable',
    effectText: 'Ziehe 2 Karten. Zu Beginn deines nächsten Zuges verlierst du 1 Leben.',
  },
  {
    kind: 'item',
    id: 'v5-item-rostiger-nagel',
    name: 'Rostiger Nagel',
    timing: 'action',
    permanence: 'equipment',
    effectText:
      'Ausrüstung (einmalig). Belegt einen Ausrüstungsslot. Dein nächster Angriff ignoriert 2 Schild; danach wird der Nagel abgelegt.',
  },
  {
    kind: 'item',
    id: 'v5-item-verdaechtiger-pilz',
    name: 'Verdächtiger Pilz',
    timing: 'action',
    permanence: 'consumable',
    effectText: 'Erhalte 2 Schild und High.',
  },
  {
    kind: 'item',
    id: 'v5-item-kabelbinder-deluxe',
    name: 'Kabelbinder Deluxe',
    timing: 'action',
    permanence: 'consumable',
    effectText: 'Störe eine gegnerische Formelkomponente mit Stabilität 3 oder weniger.',
  },
  {
    kind: 'item',
    id: 'v5-item-werkzeugkoffer',
    name: 'Werkzeugkoffer',
    timing: 'action',
    permanence: 'equipment',
    effectText: 'Ausrüstung. Einmal pro Runde: Wirf 1 Handkarte ab und ziehe 1 Karte.',
  },
  {
    kind: 'item',
    id: 'v5-item-gezinkter-wuerfel',
    name: 'Gezinkter Würfel',
    timing: 'reaction',
    permanence: 'equipment',
    effectText:
      'Ausrüstung. Einmal pro Runde: Verändere deinen Abwehrwurf gegen einen Formelangriff um ±1.',
  },
];


/** MVP subset aliases (first 3 of each) — prefer V5_* for new code. */
export const V5_MVP_TECHNIQUES = V5_TECHNIQUES.filter((c) =>
  ['v5-technik-impulsgeschoss', 'v5-technik-bannkreis', 'v5-technik-adrenalinschrei'].includes(
    c.id,
  ),
);
export const V5_MVP_ESSENCES = V5_ESSENCES.filter((c) =>
  ['v5-essenz-feuer', 'v5-essenz-wasser', 'v5-essenz-erde'].includes(c.id),
);
export const V5_MVP_CATALYSTS = V5_CATALYSTS.filter((c) =>
  ['v5-katalysator-echo', 'v5-katalysator-ueberspannung', 'v5-katalysator-spiegelung'].includes(
    c.id,
  ),
);
export const V5_MVP_ITEMS = V5_ITEMS;
