/**
 * Ultimate action prompts — same character performing exaggerated ultimate (7).
 * Location: src/services/cardArt/prompts/ultimates.ts
 */
import { wrapHiggsfieldIllustrationPrompt } from '../styleGuide';
import { CHARACTER_IDENTITY } from './characters';

/** Forces ultimates to read as climax actions, not portrait repeats. */
const ULTIMATE_FINISHER =
  'ultimate finisher climax scene, completely different dynamic action pose than character portrait card, ' +
  'not standing still, extreme exaggerated motion impact, chaotic energy burst';

export const ULTIMATE_ACTIONS: Record<string, string> = {
  'ulti-knuspergnom':
    'ultimate Mit Alles und Scharf completely different dynamic pose from portrait: tiny dwarf pale goblin dönermann leaping mid-air jump slamming colossal flaming döner spit skewer downward toward ground like overhead smash, ' +
      'earth plant wooden arm raised other hand driving spit down impact explosion, exploding döner kebab sandwich fire burst embers rock tornado gritty Berlin alley, ' +
      'absurdly massive swarm of hundreds of extremely burning hot red green chili peppers floating hovering everywhere all on fire trailing flames, ' +
      'entire scene engulfed in flames everything burning walls ground food chili inferno, full body',
  'ulti-schluckspecht':
    'ultimate Lass laufen Bruder: specht surfing catastrophic tsunami flood wave diagonally through frame, deep rich blue ocean water not white, ' +
      'glowing metal Flachmann raised overhead radiating light magic, apocalyptic blue water deluge, completely different pose from portrait',
  'ulti-stiernackenkommando':
    'ultimate Rückhandbombe: minotaur in black harness delivering massive backhand slap Rückhandschelle, ' +
      'black purple demon erupting emerging from behind minotaur body coming out of his back, ' +
      'victim falling backward knocked away, multiple duplicate shadow character copies trailing behind victim fading into darkness like afterimages dissolving, ' +
      'shadow air shockwave from open palm slap, furious mid-swing full body',
  'ulti-kokabell':
    'ultimate Golden Shower Transzendenz: blonde woman flowers in hair faint glowing angel wings floating mid-air with all arms and legs fully stretched outward star pose, ' +
      'powerful golden yellow divine light beams pouring down from above illuminating her from top, ' +
      'weed cannabis plants everywhere around her glowing green radiant aura, vines ranken glitter rave healing transcendence climax, ' +
      'no Letz Fetz text no title, completely different pose from portrait',
  'ulti-pillendoktora':
    'ultimate 3 Tage wach: head split open with surreal dream montage exploding outward, pill on tongue glowing eyes wide, ' +
      'entire lower body from waist down inside swirling tornado whirlwind, upper body unchanged, ' +
      'multiple party hallucination scenes bursting from skull, psychedelic nightmare vision not calm scientist pose',
  'ulti-dripministerin':
    'ultimate Runway ins Schattenreich: designer fashion woman split down middle on runway, shadow side from left black hole shadow torrent transforming her into demon horns claws black purple flesh, ' +
      'free side on right still beautiful human with massive water wing Wasserflügel made of liquid, right hand gripping water whip Wasserpeitsche, dramatic half-demon half-angel pose',
  'ulti-mysterium':
    'ultimate Echo der ungeschriebenen Myten hybrid finisher combining all previous versions: transparent amorphous ghost entity with many scattered mouths and eyes exploding into catastrophic dimensional apocalypse, ' +
      'broken time and space clock fragments temporal rifts spatial tears dimensional portals, massive time space collapse infinite fractal splinters shattering outward and inward simultaneously, ' +
      'cosmic vortex swallowing reality mirror echo duplicates from every dimension past and future colliding, reality tearing apart, extreme chaotic finisher not calm portrait',
};

const ULTIMATE_CHARACTER_MAP: Record<string, keyof typeof CHARACTER_IDENTITY> = {
  'ulti-knuspergnom': 'knuspergnom',
  'ulti-schluckspecht': 'schluckspecht',
  'ulti-stiernackenkommando': 'stiernackenkommando',
  'ulti-kokabell': 'kokabell',
  'ulti-pillendoktora': 'pillendoktora',
  'ulti-dripministerin': 'dripministerin',
  'ulti-mysterium': 'mysterium',
};

export const ULTIMATE_PROMPTS: Record<string, string> = Object.fromEntries(
  Object.entries(ULTIMATE_ACTIONS).map(([id, action]) => {
    const charId = ULTIMATE_CHARACTER_MAP[id];
    const identity = CHARACTER_IDENTITY[charId];
    return [
      id,
      wrapHiggsfieldIllustrationPrompt(`${identity}, ${action}, ${ULTIMATE_FINISHER}`),
    ];
  }),
);

/** Map ultimate key to character id for image reference. */
export function ultimateCharacterId(ultimateKey: string): string | null {
  return ULTIMATE_CHARACTER_MAP[ultimateKey] ?? null;
}
