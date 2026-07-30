/**
 * Full V5 formula + item card defs (§12–14, §21) — 12+12+12+6.
 * Location: src/game/packs/v5/formulaCards.ts
 *
 * Every technique/essence/catalyst ships a resolving `formulaEffect` (§12–14).
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

export const V5_TECHNIQUES: TechniqueCardDef[] = [
  {
    kind: 'technique',
    id: 'v5-technik-rueckhandtechnik',
    name: 'Rückhandtechnik',
    stability: 3,
    activationMode: 'prep_attack',
    effectText: 'Der nächste Angriff erhält +1.',
    formulaEffect: { kind: 'prep_attack', combatBonus: 1 },
    visual: techVisual('rueckhandtechnik', 'melee', 'slash', 'hand', 'x'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-durchschuss',
    name: 'Durchschuss',
    stability: 3,
    activationMode: 'prep_attack',
    effectText: 'Der nächste Angriff ignoriert 1 Schild.',
    formulaEffect: { kind: 'prep_attack', ignoreShield: 1 },
    visual: techVisual('durchschuss', 'beam', 'drill', 'hand', 'z'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-faecherstoss',
    name: 'Fächerstoß',
    stability: 2,
    activationMode: 'prep_attack',
    effectText:
      'Der nächste Angriff erhält −1 Kampfwert, erzeugt seinen Elementimpuls aber bereits bei Gleichstand.',
    formulaEffect: { kind: 'prep_attack', combatBonus: -1, impulseOnTie: true },
    visual: techVisual('faecherstoss', 'area', 'cone', 'hand', 'x'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-kettenhieb',
    name: 'Kettenhieb',
    stability: 3,
    activationMode: 'prep_attack',
    effectText:
      'Verursacht der nächste Angriff Lebensschaden, verliert der Gegner zusätzlich 1 Schild.',
    formulaEffect: { kind: 'prep_attack', stripShieldOnHpDamage: 1 },
    visual: techVisual('kettenhieb', 'melee', 'slash', 'hand', 'x'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-notfallbarriere',
    name: 'Notfallbarriere',
    stability: 4,
    activationMode: 'instant',
    effectText: 'Erhalte 1 Schild.',
    formulaEffect: { kind: 'instant_shield', amount: 1 },
    visual: techVisual('notfallbarriere', 'area', 'wall', 'self', 'y'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-retourkutsche',
    name: 'Retourkutsche',
    stability: 3,
    activationMode: 'prep_block',
    effectText: 'Der nächste Block erhält +1. Bei Vollblock erleidet der Angreifer 1 Schaden.',
    formulaEffect: { kind: 'prep_block', combatBonus: 1, thornsOnFullBlock: 1 },
    visual: techVisual('retourkutsche', 'barrier', 'wall', 'self', 'y'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-erste-hilfe-ritual',
    name: 'Erste-Hilfe-Ritual',
    stability: 2,
    activationMode: 'instant',
    effectText: 'Heile 1.',
    formulaEffect: { kind: 'instant_heal', amount: 1 },
    visual: techVisual('erste-hilfe-ritual', 'area', 'sphere', 'self', 'y'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-klarspueler',
    name: 'Klarspüler',
    stability: 3,
    activationMode: 'instant',
    effectText: 'Entferne eine eigene Primärmarke.',
    formulaEffect: { kind: 'instant_clear_own_mark' },
    visual: techVisual('klarspueler', 'area', 'sphere', 'self', 'y'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-fokuskurbel',
    name: 'Fokuskurbel',
    stability: 3,
    activationMode: 'prep_boost',
    effectText:
      'Der nächste Boost mit Zahlenwert erhält +1; ohne Zahlenwert ziehst du danach 1 und wirfst 1 ab.',
    formulaEffect: { kind: 'prep_boost', valueBonus: 1, filterHandIfNoValue: true },
    visual: techVisual('fokuskurbel', 'projectile', 'sphere', 'hand', 'z'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-sperrkreis',
    name: 'Sperrkreis',
    stability: 4,
    activationMode: 'instant',
    effectText: 'Der nächste gegnerische Angriff erhält −1 Kampfwert.',
    formulaEffect: { kind: 'enemy_next_attack_penalty', amount: 1 },
    visual: techVisual('sperrkreis', 'area', 'wall', 'self', 'y'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-soggriff',
    name: 'Soggriff',
    stability: 2,
    activationMode: 'instant',
    effectText:
      'Eine gegnerische Formelkomponente erhält bis zu deren nächster Startphase −1 Stabilität.',
    formulaEffect: { kind: 'instant_enemy_stability', amount: -1 },
    visual: techVisual('soggriff', 'melee', 'slash', 'hand', 'z'),
  },
  {
    kind: 'technique',
    id: 'v5-technik-rueckrufzeichen',
    name: 'Rückrufzeichen',
    stability: 2,
    activationMode: 'instant',
    effectText:
      'Nimm eine Formelkarte aus dem Ablagestapel auf die Hand und wirf danach 1 Handkarte ab.',
    formulaEffect: { kind: 'instant_retrieve_formula' },
    visual: techVisual('rueckrufzeichen', 'projectile', 'sphere', 'hand', 'z'),
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

export const V5_ESSENCES: EssenceCardDef[] = [
  {
    kind: 'essence',
    id: 'v5-essenz-eingekochte-glut',
    name: 'Eingekochte Glut',
    element: 'fire',
    stability: 2,
    effectText:
      'Fügt die Formel Lebensschaden zu und entsteht keine Reaktion, erhält das Ziel Brennen.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'brennen' },
    visual: essVisual('eingekochte-glut', 'fire', 'ember', 'sparks', 'heat', 'burn'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-explosionspueree',
    name: 'Explosionspüree',
    element: 'fire',
    stability: 2,
    effectText:
      'Die erste durch diese Formel ausgelöste Reaktion verursacht +1 Schaden. Danach erhalten die verwendeten Formelkomponenten bis zur nächsten Startphase −1 Stabilität.',
    formulaEffect: {
      kind: 'reaction_bonus_then_stability',
      reactionDamageBonus: 1,
      stabilityDelta: -1,
    },
    visual: essVisual('explosionspueree', 'fire', 'blast', 'embers', 'shock', 'burst'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-ueberdrucktes-kondensat',
    name: 'Überdrucktes Kondensat',
    element: 'water',
    stability: 3,
    effectText: 'Entsteht keine Reaktion, erhält das Ziel Durchnässt.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'durchnaesst' },
    visual: essVisual('ueberdrucktes-kondensat', 'water', 'mist', 'droplets', 'vapor', 'splash'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-tiefenwasserextrakt',
    name: 'Tiefenwasserextrakt',
    element: 'water',
    stability: 3,
    effectText: 'Heilt die Formel oder erzeugt Schild, erhöht sich der erste Zahlenwert um 1.',
    formulaEffect: { kind: 'amplify_heal_or_shield', amount: 1 },
    visual: essVisual('tiefenwasserextrakt', 'water', 'deep', 'bubbles', 'current', 'soak'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-kraeuterstaub',
    name: 'Kräuterstaub',
    element: 'earth',
    stability: 2,
    effectText: 'Entsteht keine Reaktion, erhält das Ziel High.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'high' },
    visual: essVisual('kraeuterstaub', 'earth', 'pollen', 'dust', 'haze', 'settle'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-betonkern',
    name: 'Betonkern',
    element: 'earth',
    stability: 4,
    effectText:
      'Alle bei der Aktivierung verwendeten Formelkomponenten erhalten bis zur nächsten Startphase +1 Stabilität.',
    formulaEffect: { kind: 'stability_buff_used', amount: 1 },
    visual: essVisual('betonkern', 'earth', 'stone', 'grit', 'quake', 'crack'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-wirbelluft',
    name: 'Wirbelluft',
    element: 'air',
    stability: 2,
    effectText: 'Entsteht keine Reaktion, erhält das Ziel Verwirbelt.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'aufgewirbelt' },
    visual: essVisual('wirbelluft', 'air', 'gale', 'wisps', 'spiral', 'gust'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-druckluftkonzentrat',
    name: 'Druckluftkonzentrat',
    element: 'air',
    stability: 3,
    effectText:
      'Der nächste zugehörige Angriff oder Block erhält +1 auf seinen W6-Bonus, maximal +2.',
    formulaEffect: { kind: 'w6_bonus', amount: 1, max: 2 },
    visual: essVisual('druckluftkonzentrat', 'air', 'pressure', 'jets', 'stream', 'blast'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-prismalicht',
    name: 'Prismalicht',
    element: 'light',
    stability: 2,
    effectText: 'Entsteht keine Reaktion, erhält das Ziel Verstrahlt.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'erleuchtet' },
    visual: essVisual('prismalicht', 'light', 'prism', 'shards', 'beam', 'flare'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-reinlicht',
    name: 'Reinlicht',
    element: 'light',
    stability: 3,
    effectText:
      'Entferne bei Aktivierung eine eigene Primärmarke. Gibt es keine, erhältst du 1 Schild.',
    formulaEffect: { kind: 'clear_mark_or_shield' },
    visual: essVisual('reinlicht', 'light', 'pure', 'motes', 'glow', 'cleanse'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-fluchruss',
    name: 'Fluchruß',
    element: 'shadow',
    stability: 2,
    effectText: 'Entsteht keine Reaktion, erhält das Ziel Verflucht.',
    formulaEffect: { kind: 'mark_if_no_reaction', mark: 'verflucht' },
    visual: essVisual('fluchruss', 'shadow', 'soot', 'ash', 'smoke', 'curse'),
  },
  {
    kind: 'essence',
    id: 'v5-essenz-sogschatten',
    name: 'Sogschatten',
    element: 'shadow',
    stability: 3,
    effectText: 'Fügt die Formel Lebensschaden zu, heile 1. Maximal einmal pro Aktivierung.',
    formulaEffect: { kind: 'lifesteal_on_hp', amount: 1 },
    visual: essVisual('sogschatten', 'shadow', 'void', 'wisps', 'drain', 'siphon'),
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
    id: 'v5-katalysator-doppelecho',
    name: 'Doppelecho',
    stability: 2,
    effectText:
      'Wiederhole zu Beginn deines nächsten Zuges bis zu 2 Punkte des Primärwerts. Dieser Katalysator bleibt in deiner nächsten Startphase erschöpft.',
    formulaEffect: { kind: 'echo_next_start', amount: 2, stayExhausted: true },
    visual: catVisual('doppelecho', 'delayed', 'duplicate', 'double-echo'),
  },
  {
    kind: 'catalyst',
    id: 'v5-katalysator-ueberladung',
    name: 'Überladung',
    stability: 2,
    effectText: 'Erhöhe den Primärwert um 2. Nach vollständiger Auflösung verlierst du 1 Leben.',
    formulaEffect: { kind: 'primary_bonus', amount: 2, selfDamage: 1 },
    visual: catVisual('ueberladung', 'instant', 'overcharge', 'surge'),
  },
  {
    kind: 'catalyst',
    id: 'v5-katalysator-verdichtung',
    name: 'Verdichtung',
    stability: 4,
    effectText:
      'Erhöhe den Primärwert um 1. Alle verwendeten Formelkomponenten erhalten bis zur nächsten Startphase +1 Stabilität.',
    formulaEffect: { kind: 'primary_bonus', amount: 1, stabilityBuffUsed: 1 },
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
      'Wird die vorbereitete Aktion erfolgreich, erhält deine nächste Aktion desselben Typs +1.',
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
  {
    kind: 'catalyst',
    id: 'v5-katalysator-sicherheitsventil',
    name: 'Sicherheitsventil',
    stability: 4,
    effectText:
      'Verhindere den ersten Selbstschaden oder Kartenabwurf, den die eigene Formel verursachen würde. Entferne danach eine eigene Primärmarke.',
    formulaEffect: { kind: 'safety_valve' },
    visual: catVisual('sicherheitsventil', 'continuous', 'reflect', 'valve'),
  },
];

/** §21 Gegenstände (6). */
export const V5_ITEMS: ItemCardDef[] = [
  {
    kind: 'item',
    id: 'v5-item-nasser-socken',
    name: 'Nasser Socken',
    timing: 'action',
    effectText:
      'Die nächste von dir gespielte Elementkarte erhält zusätzlich Wasser. Verursacht sie einen erfolgreichen Treffer, entsteht mindestens Durchnässt, sofern keine Reaktion entsteht.',
  },
  {
    kind: 'item',
    id: 'v5-item-kaputter-rueckspiegel',
    name: 'Kaputter Rückspiegel',
    timing: 'reaction',
    effectText:
      'Wenn du angegriffen wirst: Angriffswert −1. Bei Vollblock erhält der Angreifer Verstrahlt.',
  },
  {
    kind: 'item',
    id: 'v5-item-halbe-dose-energy',
    name: 'Halbe Dose Energy',
    timing: 'action',
    effectText: 'Ziehe 2 Karten. Zu Beginn deines nächsten Zuges verlierst du 1 Leben.',
  },
  {
    kind: 'item',
    id: 'v5-item-rostiger-nagel',
    name: 'Rostiger Nagel',
    timing: 'action',
    effectText: 'Dein nächster Angriff ignoriert 2 Schild.',
  },
  {
    kind: 'item',
    id: 'v5-item-verdaechtiger-pilz',
    name: 'Verdächtiger Pilz',
    timing: 'action',
    effectText: 'Erhalte 2 Schild und High.',
  },
  {
    kind: 'item',
    id: 'v5-item-kabelbinder-deluxe',
    name: 'Kabelbinder Deluxe',
    timing: 'action',
    effectText: 'Störe eine gegnerische Formelkomponente mit Stabilität 3 oder weniger.',
  },
];

/** MVP subset aliases (first 3 of each) — prefer V5_* for new code. */
export const V5_MVP_TECHNIQUES = V5_TECHNIQUES.filter((c) =>
  ['v5-technik-durchschuss', 'v5-technik-notfallbarriere', 'v5-technik-rueckhandtechnik'].includes(
    c.id,
  ),
);
export const V5_MVP_ESSENCES = V5_ESSENCES.filter((c) =>
  [
    'v5-essenz-eingekochte-glut',
    'v5-essenz-ueberdrucktes-kondensat',
    'v5-essenz-kraeuterstaub',
  ].includes(c.id),
);
export const V5_MVP_CATALYSTS = V5_CATALYSTS.filter((c) =>
  ['v5-katalysator-echo', 'v5-katalysator-ueberladung', 'v5-katalysator-spiegelung'].includes(
    c.id,
  ),
);
export const V5_MVP_ITEMS = V5_ITEMS;
