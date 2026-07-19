/**
 * Programmatic base pack — matches Letz Fetz V1 rulebook counts:
 * 60 element cards, 7 characters, 7 ultimates, 6 arenas, 10 glitches.
 */
import type {
  ArenaCardDef,
  CharacterCardDef,
  ContentPack,
  Element,
  ElementCardDef,
  GlitchCardDef,
  UltimateCardDef,
} from '../types';

const ELEMENT_LABELS: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

const BOUND_ACTIVATE: Record<Element, string> = {
  fire: 'Aktivieren: Füge dem Gegner 2 Schaden zu.',
  water: 'Aktivieren: Heile 2 Leben.',
  earth: 'Aktivieren: Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.',
  air: 'Aktivieren: Ziehe 2 Karten und wirf danach 1 Karte ab.',
  shadow: 'Aktivieren: Erschöpfe 1 gegnerische gebundene Karte.',
  light: 'Aktivieren: Ziehe 1 Karte und heile 1 Leben.',
};

const BOOST_INSTANT: Record<Element, string> = {
  fire: 'Füge dem Gegner 2 Schaden zu.',
  water: 'Heile 2 Leben.',
  earth: 'Eine deiner gebundenen Karten bekommt bis zu deinem nächsten Zug +2 Widerstand.',
  air: 'Ziehe 2 Karten und wirf danach 1 Karte ab.',
  shadow: 'Gegner wirft 1 Karte ab. Gegner wählt.',
  light: 'Ziehe 1 Karte und heile 1 Leben.',
};

function elementCardsFor(element: Element): ElementCardDef[] {
  const label = ELEMENT_LABELS[element];
  const bound = BOUND_ACTIVATE[element];
  const boostInstant = BOOST_INSTANT[element];
  const cards: ElementCardDef[] = [];

  for (const value of [2, 4, 6] as const) {
    cards.push({
      id: `${element}-attack-${value}`,
      name: `${label} ${value} Angriff`,
      kind: 'element',
      element,
      cardType: 'attack',
      value,
      instantText: `Angriff ${value}. Würfle 1W6 für Würfelbonus.`,
      boundText: bound,
    });
    cards.push({
      id: `${element}-block-${value}`,
      name: `${label} ${value} Block`,
      kind: 'element',
      element,
      cardType: 'block',
      value,
      instantText: `Block ${value}. Würfle 1W6 für Würfelbonus.`,
      boundText: bound,
    });
  }

  cards.push({
    id: `${element}-boost-1`,
    name: `${label} 1 Boost`,
    kind: 'element',
    element,
    cardType: 'boost',
    value: 1,
    instantText: boostInstant,
    boundText: bound,
  });
  cards.push({
    id: `${element}-boost-3`,
    name: `${label} 3 Boost`,
    kind: 'element',
    element,
    cardType: 'boost',
    value: 3,
    instantText: boostInstant,
    boundText: bound,
  });
  cards.push({
    id: `${element}-boost-5a`,
    name: `${label} 5 Boost`,
    kind: 'element',
    element,
    cardType: 'boost',
    value: 5,
    instantText: boostInstant,
    boundText: bound,
  });
  cards.push({
    id: `${element}-boost-5b`,
    name: `${label} 5 Boost`,
    kind: 'element',
    element,
    cardType: 'boost',
    value: 5,
    instantText: boostInstant,
    boundText: bound,
  });

  return cards;
}

const CHARACTERS: CharacterCardDef[] = [
  {
    id: 'knuspergnom',
    name: 'Knuspergnom',
    kind: 'character',
    elements: ['earth', 'fire'],
    role: 'Allrounder, Druck + Stabilität',
    passiveText:
      'Einmal pro Zug, wenn du Feuer oder Erde bindest, darfst du 1 Karte abwerfen und 1 Karte ziehen.',
    ultimateId: 'ulti-knuspergnom',
    strategyHint: 'Baue Feuer/Erde auf, halte Druck und nutze Binden für Kartenvorteil.',
  },
  {
    id: 'schluckspecht',
    name: 'Schluckspecht',
    kind: 'character',
    elements: ['water', 'light'],
    role: 'Sustain, Block, Überleben',
    passiveText:
      'Einmal pro gegnerischem Zug, wenn du einen Angriff komplett blockst, heile 1 Leben.',
    ultimateId: 'ulti-schluckspecht',
    strategyHint: 'Blocken, heilen, Überleben bis der Gegner keine Karten mehr hat.',
  },
  {
    id: 'stiernackenkommando',
    name: 'Stiernackenkommando',
    kind: 'character',
    elements: ['shadow', 'air'],
    role: 'Bruiser, Tempo, Gegenschlag',
    passiveText:
      'Wenn du Schaden bekommst, erhält dein nächster Angriff oder dein nächstes Herausfordern +1. Maximal +2.',
    ultimateId: 'ulti-stiernackenkommando',
    strategyHint: 'Nimm Schaden bewusst in Kauf und schlage zurück.',
  },
  {
    id: 'kokabell',
    name: 'Kokabell',
    kind: 'character',
    elements: ['earth', 'light'],
    role: 'Defensive Engine, Heilung, Auslagenschutz',
    passiveText:
      'Einmal pro Zug, wenn du heilst, bekommt eine deiner gebundenen Karten bis zu deinem nächsten Zug +1 Widerstand.',
    ultimateId: 'ulti-kokabell',
    strategyHint: 'Heile und verstärke deine gebundenen Karten.',
  },
  {
    id: 'pillendoktora',
    name: 'Pillendoktora',
    kind: 'character',
    elements: ['air', 'fire'],
    role: 'Risk/Reward, Boosts, Kartenvorteil',
    passiveText:
      'Einmal pro Zug, wenn du einen Boost spielst, wähle eins: Ziehe 1 und verliere 1 Leben / 1 Schaden / Heile 1.',
    ultimateId: 'ulti-pillendoktora',
    strategyHint: 'Boosts für Tempo und flexible Effekte.',
  },
  {
    id: 'dripministerin',
    name: 'Dripministerin',
    kind: 'character',
    elements: ['water', 'shadow'],
    role: 'Control, Discard, Erschöpfen',
    passiveText:
      'Einmal pro Zug, wenn du eine gegnerische gebundene Karte erschöpfst oder zerstörst, ziehe 1 Karte und wirf danach 1 Karte ab.',
    ultimateId: 'ulti-dripministerin',
    strategyHint: 'Sabotiere die Engine des Gegners.',
  },
  {
    id: 'mysterium',
    name: 'Das Mysterium',
    kind: 'character',
    elements: ['light', 'shadow'],
    role: 'Flexibel, Kopieren, Expertencharakter',
    passiveText:
      'Einmal pro Zug darfst du eine Karte, die du spielst oder bindest, als beliebiges Element behandeln.',
    ultimateId: 'ulti-mysterium',
    strategyHint: 'Flexibel bleiben und gegnerische Strategien spiegeln.',
  },
];

const ULTIMATES: UltimateCardDef[] = [
  {
    id: 'ulti-knuspergnom',
    name: 'Mit Alles und Scharf',
    kind: 'ultimate',
    characterId: 'knuspergnom',
    effectText: 'Füge 5 Schaden zu, heile 3 Leben und darfst danach 1 Karte aus deiner Hand binden.',
  },
  {
    id: 'ulti-schluckspecht',
    name: 'Lass laufen, Bruder',
    kind: 'ultimate',
    characterId: 'schluckspecht',
    effectText: 'Heile 4 Leben und füge 3 Schaden zu. Wenn du danach weniger Leben hast als der Gegner, ziehe 1 Karte.',
  },
  {
    id: 'ulti-stiernackenkommando',
    name: 'Rückhandbombe',
    kind: 'ultimate',
    characterId: 'stiernackenkommando',
    effectText:
      'Dein nächster Angriff in diesem Zug macht doppelten Schaden nach allen Boni. Danach verlierst du 1 Leben.',
  },
  {
    id: 'ulti-kokabell',
    name: 'Golden (S)hou(we)r Transzendenz',
    kind: 'ultimate',
    characterId: 'kokabell',
    effectText:
      'Setze deine Leben auf 12, falls du unter 12 bist. Danach stelle bis zu 2 erschöpfte gebundene Karten wieder aufrecht.',
  },
  {
    id: 'ulti-pillendoktora',
    name: '3 Tage wach',
    kind: 'ultimate',
    characterId: 'pillendoktora',
    effectText: 'Heile 4 Leben, füge 4 Schaden zu und ziehe 2 Karten. Danach wirf 1 Karte ab.',
  },
  {
    id: 'ulti-dripministerin',
    name: 'Runway ins Schattenreich',
    kind: 'ultimate',
    characterId: 'dripministerin',
    effectText: 'Gegner wirft 2 Karten ab, verliert 3 Leben und erschöpft 1 gebundene Karte.',
  },
  {
    id: 'ulti-mysterium',
    name: 'Echo der ungeschriebenen Mythen',
    kind: 'ultimate',
    characterId: 'mysterium',
    effectText:
      'Kopiere die Ultimativfähigkeit des Gegners und führe sie aus. Danach ziehe 1 Karte.',
  },
];

const ARENAS: ArenaCardDef[] = [
  {
    id: 'arena-spaeti',
    name: 'Späti der Erleuchtung',
    kind: 'arena',
    role: 'Boosts, Kartenfilter, flexible Züge',
    baseEffect:
      'Einmal pro Zug, wenn du einen Boost spielst, darfst du 1 Karte ziehen und danach 1 Karte abwerfen.',
    trigger: 'Wenn ein Spieler seinen dritten Boost der Partie spielt, darf er sofort 1 Karte binden.',
    specialRule: 'Boosts, die Schaden machen, verursachen maximal 3 Schaden.',
  },
  {
    id: 'arena-kristall',
    name: 'Kristallkathedrale',
    kind: 'arena',
    role: 'Heilung, Licht, Ultis, Defensive',
    baseEffect: 'Die erste Heilung jedes Spielers pro Zug heilt +1.',
    trigger: 'Wenn ein Spieler seine Ultimativkarte spielt, zieht er danach 1 Karte.',
    specialRule: 'Kein Spieler kann durch Heilung über 20 Leben steigen.',
  },
  {
    id: 'arena-vulkan',
    name: 'Vulkan der schlechten Entscheidungen',
    kind: 'arena',
    role: 'Angriff, Feuer, Druck',
    baseEffect:
      'Der erste Angriffswurf jedes Spielers pro Zug bekommt +1 auf das Würfelergebnis, maximal 6.',
    trigger:
      'Wenn ein Spieler in seinem Zug keinen Angriff spielt und keine gegnerische gebundene Karte herausfordert, verliert er am Ende seines Zuges 1 Leben.',
    specialRule:
      'Wenn ein einzelner Angriff nach allen Boni einen Angriffswert von 9 oder höher erreicht, verliert der Angreifer nach der Abrechnung 1 Leben.',
  },
  {
    id: 'arena-sumpf',
    name: 'Sumpf der passiv-aggressiven Heilung',
    kind: 'arena',
    role: 'Block, Wasser, Defensive',
    baseEffect:
      'Der erste Blockwurf jedes Spielers pro gegnerischem Zug bekommt +1 auf das Würfelergebnis, maximal 6.',
    trigger:
      'Wenn ein Angriff komplett geblockt wird, darf der blockende Spieler 1 Karte ziehen und danach 1 Karte abwerfen.',
    specialRule: 'Herausfordern benötigt +1 Angriff, um erfolgreich zu sein.',
  },
  {
    id: 'arena-club',
    name: 'Club der fliegenden Backpfeifen',
    kind: 'arena',
    role: 'Luft, Bewegung, Umbau',
    baseEffect: 'Zu Spielbeginn 1W6 würfeln.',
    trigger: 'Variante abhängig vom W6-Wurf.',
    specialRule: 'Siehe Varianten 1–2 / 3–4 / 5–6.',
    d6Variants: [
      'Schlechter Bassdrop: Am Ende des Zuges 1 Karte abwerfen wenn >4 Handkarten.',
      'Seitenwechsel im Nebel: Einmal pro Zug 1 gebundene Karte auf die Hand nehmen und 1 binden.',
      'Alles bewegt sich: Bei Herausfordern wird das Ziel erschöpft, auch wenn es nicht zerstört wird.',
    ],
  },
  {
    id: 'arena-schattenbasar',
    name: 'Schattenbasar der toxischen Angebote',
    kind: 'arena',
    role: 'Schatten, Glitches, Discard, Sabotage',
    baseEffect: 'Zu Spielbeginn 1W6 würfeln.',
    trigger: 'Variante abhängig vom W6-Wurf.',
    specialRule: 'Siehe Varianten 1–2 / 3–4 / 5–6.',
    d6Variants: [
      'Schlechter Deal: Wenn du eine gegnerische gebundene Karte zerstörst, verlierst du 1 Leben.',
      'Flüsterpreise: Einmal pro Zug 1 Handkarte abwerfen, um 1 gegnerische gebundene Karte zu erschöpfen (keine Hauptaktion).',
      'Alles hat seinen Preis: Ohne Handkarten am Zugstart: 2 Schaden, dann 2 Karten ziehen.',
    ],
  },
];

const GLITCHES: GlitchCardDef[] = [
  {
    id: 'glitch-riss',
    name: 'Riss in der Realität',
    kind: 'glitch',
    glitchType: 'playable',
    timing: 'In deinem Zug.',
    effectText: 'Wechsle die Arena. Ziehe eine neue Arena zufällig.',
  },
  {
    id: 'glitch-nein',
    name: 'Nein, Bruder',
    kind: 'glitch',
    glitchType: 'playable',
    timing: 'Wenn der Gegner einen Boost spielt.',
    effectText: 'Der Boost wird verhindert und abgelegt.',
  },
  {
    id: 'glitch-kurzschluss',
    name: 'Kurzschluss',
    kind: 'glitch',
    glitchType: 'playable',
    timing: 'In deinem Zug.',
    effectText: 'Erschöpfe 1 gegnerische gebundene Karte.',
  },
  {
    id: 'glitch-rueckkopplung',
    name: 'Rückkopplung',
    kind: 'glitch',
    glitchType: 'playable',
    timing: 'Wenn du Angriffsschaden bekommst.',
    effectText: 'Reduziere diesen Schaden um 2.',
  },
  {
    id: 'glitch-empfang',
    name: 'Schlechter Empfang',
    kind: 'glitch',
    glitchType: 'playable',
    timing: 'In deinem Zug.',
    effectText:
      'Gegner darf bis zum Ende seines nächsten Zuges keine Karten außerhalb der normalen Ziehphase ziehen.',
  },
  {
    id: 'glitch-systemfehler',
    name: 'Systemfehler',
    kind: 'glitch',
    glitchType: 'playable',
    timing: 'In deinem Zug.',
    effectText:
      'Wähle 1 gebundene Karte. Sie verliert bis zum Beginn deines nächsten Zuges ihren Aktivierungseffekt.',
  },
  {
    id: 'glitch-download',
    name: 'Illegaler Download',
    kind: 'glitch',
    glitchType: 'playable',
    timing: 'In deinem Zug.',
    effectText:
      'Kopiere den Aktivierungseffekt einer gegnerischen gebundenen Karte. Wirf 1 Handkarte ab.',
  },
  {
    id: 'glitch-selbstschaden',
    name: 'Selbstschaden.exe',
    kind: 'glitch',
    glitchType: 'instant',
    timing: 'Wenn gezogen.',
    effectText: 'Du verlierst 2 Leben.',
  },
  {
    id: 'glitch-datenleck',
    name: 'Datenleck',
    kind: 'glitch',
    glitchType: 'instant',
    timing: 'Wenn gezogen.',
    effectText: 'Beide Spieler ziehen 1 Karte.',
  },
  {
    id: 'glitch-absturz',
    name: 'Absturz',
    kind: 'glitch',
    glitchType: 'instant',
    timing: 'Wenn gezogen.',
    effectText: 'Wirf 1 Handkarte ab. Wenn du keine hast, verlierst du 1 Leben.',
  },
];

const ALL_ELEMENTS: Element[] = ['fire', 'water', 'earth', 'air', 'shadow', 'light'];

export function buildBasePack(): ContentPack {
  const elementCards = ALL_ELEMENTS.flatMap(elementCardsFor);
  return {
    id: 'base-pack-v1',
    name: 'Letz Fetz Base Pack',
    version: '1.0.0',
    characters: CHARACTERS,
    ultimates: ULTIMATES,
    arenas: ARENAS,
    elementCards,
    glitches: GLITCHES,
  };
}

export const BASE_PACK = buildBasePack();

/** Lookup map for all card definitions by id. */
export function buildCardIndex(
  pack: ContentPack,
): Map<
  string,
  | ContentPack['characters'][0]
  | ElementCardDef
  | UltimateCardDef
  | ArenaCardDef
  | GlitchCardDef
  | NonNullable<ContentPack['engineParts']>[number]
> {
  const map = new Map();
  for (const c of pack.characters) map.set(c.id, c);
  for (const u of pack.ultimates) map.set(u.id, u);
  for (const a of pack.arenas) map.set(a.id, a);
  for (const e of pack.elementCards) map.set(e.id, e);
  for (const g of pack.glitches) map.set(g.id, g);
  for (const p of pack.engineParts ?? []) map.set(p.id, p);
  return map;
}
