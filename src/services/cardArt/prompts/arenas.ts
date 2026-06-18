/**
 * Arena environment prompts — oversaturated places only, no figures (6).
 * Location: src/services/cardArt/prompts/arenas.ts
 */
import { wrapHiggsfieldIllustrationPrompt, wrapHiggsfieldIllustrationPromptAllowCanLabel } from '../styleGuide';

export const ARENA_PROMPTS: Record<string, string> = {
  'arena-spaeti': wrapHiggsfieldIllustrationPromptAllowCanLabel(
    'authentic Berlin späti corner shop kiosk at night radiating brilliant holy enlightenment light beams bursting outward from windows and door onto the street, ' +
      'divine god rays volumetric sacred glow flooding the dark alley outside, glowing fridge drinks neon inside, ' +
      'outdoor hanging sign clearly reading Späti, door sign clearly reading sky is the limit 24/7, empty location no people no characters, environment only',
  ),
  'arena-kristall': wrapHiggsfieldIllustrationPrompt(
    'wide expansive crystal cathedral interior wide angle view showing vast vaulted nave stained glass windows towering arches and deep perspective, ' +
      'many colorful gemstones and jewels sitting on church pews clearly praying with tiny folded hands bowed heads devout worship, ' +
      'at cathedral DJ pulpit altar area hovering floating rapper with massive heavy gold chains diamond grillz teeth preaching sermon with arms spread like prophet, ' +
      'stained glass healing light enlightenment through drip radiant drip luxury aura divine light beams filling the huge sacred space, exaggerated cartoon grunge cathedral arena',
  ),
  'arena-vulkan': wrapHiggsfieldIllustrationPrompt(
    'seedy neon casino merged with red light bordello lounge built inside erupting active volcano crater rim, ' +
      'massive lava rivers waterfalls magma fountains flowing through casino floor between gambling tables, volcanic eruption ash clouds glowing molten rock everywhere, ' +
      'packed gambling floor many slot machines one-armed bandits blackjack tables poker tables roulette wheels chips cards dice half submerged in lava, ' +
      'dense casino vibe velvet curtains pink neon jackpot signs surrounded by scorching heat smoke bad decisions vibe, ' +
      'provocative fiery siren spirit with flame hair singing on lava rocks hypnotizing trance people with spiral eyes shuffling toward the fire, ' +
      'extremely volcanic apocalyptic hellscape exaggerated cartoon grunge arena full scene',
  ),
  'arena-sumpf': wrapHiggsfieldIllustrationPrompt(
    'vast toxic healing swamp bog filling almost entire scene muddy water moss reeds fog vines everywhere only dry islands are government office Behörden desks as contrast, ' +
      'towering stacks of files Aktenstapel on desks fluorescent office lamps passive aggressive bureaucracy vibe, ' +
      'annoyed grumpy goblins sitting at desks one goblin yelling angrily at patient while bandaging and treating them mid-healing, ' +
      'exaggerated cartoon grunge arena full scene',
  ),
  'arena-club': wrapHiggsfieldIllustrationPrompt(
    'top down overhead bird eye view of underground Berghain techno rave club dancefloor, strobe fog laser lights from above, ' +
      'two fully tattooed elderly grandmas Omas in black latex techno outfits seen from above giving each other flying backhand slaps Backpfeifen, ' +
      'magical shockwave sparks neon aura from each slap mid-air, ' +
      'comic book illustration style bold black ink outlines cel shaded graphic novel NOT photorealistic NOT realistic, exaggerated satirical cartoon grunge arena full scene',
  ),
  'arena-schattenbasar': wrapHiggsfieldIllustrationPromptAllowCanLabel(
    'demonized dark online shop e-commerce website in shadow bazaar alley, glowing computer screen storefront selling souls attention and love as toxic products, ' +
      'product cards labeled SOULS ATTENTION LOVE with hellish prices, ghost soul spirit being sucked vacuumed into the computer screen not a demon creature, ' +
      'translucent soul stretched and pulled into monitor portal purple black neon, shopping cart full of ghost souls corrupted marketplace UI tentacles shadow smoke, ' +
      'no Letz Fetz text no soul exchange title no logo, exaggerated cartoon grunge arena no people',
  ),
};
