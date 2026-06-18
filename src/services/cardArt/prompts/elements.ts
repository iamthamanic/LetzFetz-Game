/**
 * Element illustration prompts — 6 elements × 3 card types = 18 shared motifs.
 * Location: src/services/cardArt/prompts/elements.ts
 */
import type { Element } from '../../../game/types';
import { wrapHiggsfieldIllustrationPrompt, wrapHiggsfieldIllustrationPromptAllowCanLabel } from '../styleGuide';

export type ElementCardType = 'attack' | 'block' | 'boost';

/** Element-saturated environment woven into every element card scene. */
const ELEMENT_ENV: Record<Element, string> = {
  fire: 'entire environment engulfed in fire embers smoke scorched walls orange glow burning graffiti heat haze',
  water: 'entire environment soaked flooded dripping wet puddles mist humidity water streaming down walls',
  earth: 'entire environment cracked soil roots rocks plants vines growing through pavement mud gravel earth energy',
  air: 'entire environment windy debris flying dust gust streams atmospheric pressure leaves swirling in cyclone',
  shadow: 'entire environment dark purple black mist void shadows consuming light eerie darkness creeping on walls',
  light: 'entire environment flooded radiant cyan white glow holy light beams illuminating alley neon bleached bright',
};

const ELEMENT_ATTACK: Record<Element, string> = {
  fire:
    'red spray paint can in foreground with black flame logo on label, nozzle spraying fire stream that morphs into giant menacing fire monster face with glowing yellow eyes and sharp teeth jaws, ' +
    'dark urban brick alley at night graffiti crown and flame tag on walls, wet pavement reflecting intense orange fire glow, gritty street art painterly illustration, fire creature not human',
  water:
    'catastrophic tsunami flood wave crashing through gritty urban city street, deep rich blue ocean water not white foam, ' +
    'cars submerged buildings flooded massive wall of dark blue water towering over Berlin alley, apocalyptic water attack, no human people',
  earth:
    'concrete slab earth fist smash from cracked pavement rebar boulders erupting, cartoon shockwave soil rocks flying, heavy earth magic strike gritty Berlin alley',
  air:
    'clean powerful tornado funnel in gritty urban city street, swirling wind vortex sucking debris upward, ' +
    'sharp air elemental magic cyclone blue white wind streams, dramatic exaggerated cartoon tornado attack, no human people',
  shadow:
    'shadow tendril claw erupting from sewer grate purple-black smoke ambush, darkness consuming alley walls void tendrils striking, shadow magic attack no human people',
  light:
    'extremely exaggerated Black Clover style light magic attack, hundreds of glowing cyan white light beams radiating from dark center vanishing point like warp speed burst, ' +
    'sharp holy light sword streaks and laser bolts shooting outward in all directions intense bloom glow, ' +
    'over-the-top light barrage filling frame, dark void center bright cyan speed lines, apocalyptic light strike no human people',
};

const ELEMENT_BLOCK: Record<Element, string> = {
  fire:
    'classic angular medieval knight heater shield shape NOT round with flat top and pointed bottom, made of living fire flames merged with melted street sign metal ember edges, bold flame emblem burning in shield center, ' +
    'cartoon fire magic ember barrier flames wrapping shield scorched alley glowing heat haze smoke everywhere mixed style',
  water:
    'real medieval round shield made of solid deep blue water and ice held upright, mixed with water bottle wall barrier flowing puddle armor splash dome, ' +
    'torrents of dark blue water magic pouring around shield, massive blue splash waves water dome barrier flooding scene, gritty urban alley',
  earth:
    'absurdly oversized monumental giant round shield taller than buildings decorated with flowers vines blooming plants wrapped around it, ' +
    'massive earth magic barrier of floating boulders rocks soil roots behind colossal shield, glowing green brown earth runes crystal shards, ' +
    'cracked pavement rising stone wall, heavy elemental earth magic fortification dominating frame, gritty urban alley',
  air:
    'multiple wind shields floating in formation made of swirling compressed air and wind magic, several transparent gust barriers overlapping deflecting debris, ' +
    'visible air currents spiraling around each shield edge, heavy air elemental protection wall, gritty urban alley no person no human',
  shadow:
    'one large rectangular square shield in center made of dark shadow magic held upright, many smaller rectangular shadow shields floating hovering around it in orbit formation, ' +
      'large center shield actively sucking in dark purple energy streams spiraling into shield center being absorbed, unmistakable shield silhouettes with rim and boss, ' +
      'shadow elemental barrier formation gritty urban alley no cross no human',
  light:
    'Roman legionnaire shield wall formation made of pure light magic, one massive glowing light scutum shield in front many smaller light shields behind it, ' +
    'no cross no religious symbols, radiant cyan white holy light barriers overlapping, exaggerated light magic fortification gritty urban alley',
};

const ELEMENT_BOOST: Record<Element, string> = {
  fire:
    'red gasoline Benzinkanister petrol jerry can tipped pouring fuel onto open flame below igniting massive fire burst, ' +
    'bold label text PYRO EXPRESS written clearly on canister, wall graffiti tags reading feu feu and this girl is and fire, ' +
    'no Berlin brennt no Feuer und Wut text anywhere, exaggerated cartoon fire boost alley no human people',
  water:
    'single giant glowing water droplet falling toward deep blue water surface about to impact, moment before impact triggers massive waterfall cascade explosion ripple, ' +
    'tiny drop causing enormous water boost surge healing blue magic, exaggerated cartoon alley puddle no human people',
  earth:
    'giant magical cannabis weed plant sprouting from cracked earth with glowing green leaves refreshing revitalizing energy, mixed with stone skin gravel armor earth hardening, ' +
    'rocky soil crust boulders roots vines wrapping around plant base, green brown earth magic aura healing boost, urban grunge not human',
  air:
    'magical speed turbine booster like Mario Kart speed pad but extremely exaggerated cartoon, glowing air magic turbo fan spinning, ' +
    'wind acceleration arrows speed lines gust burst, blue white air elemental boost device on cracked pavement, no human people',
  shadow:
    'hybrid mix of two versions: giant dark shadow energy battery cell AND rusted industrial cylindrical tank canister cracked open with shattered glass, ' +
      'glowing purple black runes on metal pipes wrapping vessel, ghost souls with haunting faces both flowing into battery charging spiraling inward AND escaping from central porthole cracks and top vent, ' +
      'intense purple necromantic glow inside vessel, no person no human figures only soul wisps, shadow boost revival power gritty Berlin alley exaggerated cartoon grunge',
  light:
    'angelic light transcendence scene, ghostly transparent fading angel spirit barely visible dissolving into light, ' +
      'ethereal translucent wings and halo made of faint cyan white light wisps fading at edges, ' +
      'divine radiant blessing surge ascending and fading into holy illumination above gritty Berlin alley below, no human people no cross',
};

export function elementIllustrationPrompt(
  element: Element,
  cardType: ElementCardType,
): string {
  const subject =
    cardType === 'attack'
      ? ELEMENT_ATTACK[element]
      : cardType === 'block'
        ? ELEMENT_BLOCK[element]
        : ELEMENT_BOOST[element];

  const noPeople =
    (element === 'fire' || element === 'water' || element === 'air' || element === 'light' || element === 'shadow') &&
    cardType === 'attack'
      ? 'no human people no human face'
      : cardType === 'block' && element === 'air'
        ? 'no person no human no people'
        : cardType === 'boost' && element === 'air'
        ? 'no human people'
        : cardType === 'boost' && element === 'light'
          ? 'angelic spirit allowed no living human people no cross'
          : cardType === 'boost' && element === 'shadow'
          ? 'no person no human figures ghost soul energy only'
          : 'no character face, no people';

  const env =
    element === 'air' && cardType === 'boost' ? '' : `${ELEMENT_ENV[element]}, `;

  const body = `${element} element ${cardType} TCG symbol art, ${subject}, ${env}exaggerated cartoon grunge scene, ${noPeople}`;

  if (element === 'fire' && cardType === 'boost') {
    return wrapHiggsfieldIllustrationPromptAllowCanLabel(body);
  }

  return wrapHiggsfieldIllustrationPrompt(body);
}

export const ALL_ELEMENTS: Element[] = ['fire', 'water', 'earth', 'air', 'shadow', 'light'];

export const ALL_ELEMENT_CARD_TYPES: ElementCardType[] = ['attack', 'block', 'boost'];
