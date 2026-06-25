/**
 * Motion prompts for element attack-loop videos (image-to-video via Seedance 2.0).
 * Location: src/services/cardArt/prompts/elementAttackVideos.ts
 *
 * Pilot: one short loop clip per element (6 total) for the card-play zone.
 * Source images: /cards/element/{element}-attack.png
 * Output: /videos/element/{element}-attack.mp4
 */
import type { Element } from '../../../game/types';

const COMIC_STYLE =
  'Comic book graphic novel style, bold black ink outlines, cel shaded, NOT photorealistic. ' +
  'Keep exact characters and art style from start image. Fast dynamic cuts, exaggerated impact effects.';

export const ELEMENT_ATTACK_VIDEO_PROMPTS: Record<Element, string> = {
  fire:
    '5 second explosive attack action loop. ' +
    'Scene 1: fire character winds up, flames intensify around fists. ' +
    'Scene 2: massive fireball punch launches toward camera, comic BOOM impact. ' +
    'Scene 3: flame explosion engulfs frame, embers scatter, screen shakes. ' +
    'Scene 4: flames recede revealing character in victory pose, embers fade. ' +
    'Seamless loop back to scene 1. Intense fire chaos, POW WHAM effects. ' +
    COMIC_STYLE,

  water:
    '5 second explosive attack action loop. ' +
    'Scene 1: water character channels swirling water vortex around arms. ' +
    'Scene 2: massive tidal wave punch crashes forward, comic SPLASH impact. ' +
    'Scene 3: water explosion floods frame, droplets freeze mid-air. ' +
    'Scene 4: water recedes revealing character, ripples fade. ' +
    'Seamless loop back to scene 1. Dynamic water chaos, WHOOSH effects. ' +
    COMIC_STYLE,

  earth:
    '5 second explosive attack action loop. ' +
    'Scene 1: earth character stomps ground, rock pillars erupt from earth. ' +
    'Scene 2: massive boulder fist smash crashes down, comic CRACK impact. ' +
    'Scene 3: rock explosion shatters frame, stone debris flies. ' +
    'Scene 4: dust settles revealing character, rubble crumbles. ' +
    'Seamless loop back to scene 1. Heavy earth chaos, BOOM effects. ' +
    COMIC_STYLE,

  air:
    '5 second explosive attack action loop. ' +
    'Scene 1: air character spins, wind tornado forms around body. ' +
    'Scene 2: massive cyclone slash cuts through frame, comic SWISH impact. ' +
    'Scene 3: air pressure explosion, leaves and debris spiral. ' +
    'Scene 4: wind calms revealing character, petals settle. ' +
    'Seamless loop back to scene 1. Dynamic air chaos, WHOOSH effects. ' +
    COMIC_STYLE,

  shadow:
    '5 second explosive attack action loop. ' +
    'Scene 1: shadow character melds into darkness, eyes glow purple. ' +
    'Scene 2: shadow tentacle lash strikes from void, comic WHAM impact. ' +
    'Scene 3: darkness explosion consumes frame, purple smoke billows. ' +
    'Scene 4: shadows recede revealing character, smoke wisps fade. ' +
    'Seamless loop back to scene 1. Ominous shadow chaos, DARK effects. ' +
    COMIC_STYLE,

  light:
    '5 second explosive attack action loop. ' +
    'Scene 1: light character radiates golden halo, divine energy builds. ' +
    'Scene 2: massive light beam blast fires forward, comic FLASH impact. ' +
    'Scene 3: holy light explosion fills frame, golden particles scatter. ' +
    'Scene 4: light fades revealing character, sparkles dim. ' +
    'Seamless loop back to scene 1. Radiant light chaos, BANG effects. ' +
    COMIC_STYLE,
};

export const ALL_ELEMENTS_WITH_ATTACK_VIDEOS: Element[] = [
  'fire',
  'water',
  'earth',
  'air',
  'shadow',
  'light',
];

/** Default duration for element attack loop videos (seconds). */
export const ELEMENT_ATTACK_VIDEO_DURATION = 5;

export function elementAttackVideoPrompt(element: Element): string {
  return ELEMENT_ATTACK_VIDEO_PROMPTS[element];
}

/** Manifest key for an element attack video (e.g. "fire-attack"). */
export function elementAttackVideoKey(element: Element): string {
  return `${element}-attack`;
}