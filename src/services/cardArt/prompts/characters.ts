/**
 * Character portrait prompts — Higgsfield Nano Banana (7 characters).
 * Location: src/services/cardArt/prompts/characters.ts
 */
import { wrapHiggsfieldIllustrationPrompt } from '../styleGuide';

export const CHARACTER_PROMPTS: Record<string, string> = {
  knuspergnom: wrapHiggsfieldIllustrationPrompt(
    'extremely tiny dwarf-bodied pale white-skinned goblin dönermann vendor, short stocky zwerg dwarf proportions very small body, white gray skin, ' +
      'beard made entirely of burning fire flames not hair, grimy apron, dark alley, ' +
      'absurdly colossal oversized giant döner spit skewer towering over him with massive flames in one small hand, ' +
      'other arm made of earth soil roots vines plants with open palm, absurdly giant döner bread floating above earth plant arm, ' +
      'heavy fire magic embers plus earth magic rocks soil cracks, full body visible',
  ),
  schluckspecht: wrapHiggsfieldIllustrationPrompt(
    'anthropomorphic specht bird cool underground street magician, charismatic edgy stylish not homeless, ' +
      'intentionally worn long coat with streetwise flair, one hand clearly gripping raised metal hip flask Flachmann, ' +
      'Flachmann glowing bright radiating light magic beams and holy runes, ' +
      'surrounded by heavy water magic torrents floating water spheres mist waves droplets orbiting body, ' +
      'other hand casting light magic, confident cool stance, full body visible',
  ),
  stiernackenkommando: wrapHiggsfieldIllustrationPrompt(
    'minotaur bull head human body NOT centaur, fully tattooed muscular, black leather harness straps chest and shoulders Berghain techno club outfit, ' +
      'black latex neon accents minimal clothing, shadow and air magic swirling debris, intimidating bouncer stance, full body visible',
  ),
  kokabell: wrapHiggsfieldIllustrationPrompt(
    'extremely exaggerated caricature stunning beautiful blonde woman with pretty delicate face hovering in grimy Berlin night alley, long blonde hair with flowers woven in hair floral crown, ' +
      'faint suggested glowing angel wings translucent light wings behind her, exaggerated beautiful strung-out party junkie look dark heavy eye circles wide awake manic eyes, ' +
      'white rave crop top and white mini skirt bare midriff bare legs, no staff no wand, both hands scattering glitter powder, ' +
      'magical vines ranken wrapping around her legs and body, dense cannabis weed plants glowing green leaves, golden light magic, no Letz Fetz text no title no logo words, full body',
  ),
  pillendoktora: wrapHiggsfieldIllustrationPrompt(
    'stunning beautiful nerdy scientist woman, hair on fire flaming burning locks, fitted open lab coat over bodysuit, ' +
      'almost no potions bottles, many absurdly oversized giant glowing magical pills floating around her, ' +
      'pills much bigger than her head orbiting body, air and fire chemistry sparks, glamorous confident pose, full body',
  ),
  dripministerin: wrapHiggsfieldIllustrationPrompt(
    'extremely exaggerated caricature stunning goth woman very long flowing hair made entirely of liquid water streaming down, water hair cascading like waterfall, ' +
      'enormous spread black purple demon wings behind her, extreme luxury haute couture designer outfit layered runway fashion, visible black fishnet techno harness straps, heavy jewelry, tattoos, ' +
      'floating on giant sphere of water, dark shadow aura water magic, dramatically überzeichnet proportions, full body',
  ),
  mysterium: wrapHiggsfieldIllustrationPrompt(
    'hybrid mix first version and current ghost: transparent amorphous entity body predominantly made of countless floating dimensional splinter shards glass fragments, ' +
      'extremely ghostly spectral phantom ninety percent invisible wisps, many random mouths and eyes scattered throughout splinter mass not one face, ' +
      'merging mixed art styles glass smoke light shadow chaos no fixed human body, faint ghost hints among shards, ' +
      'clock fragments temporal rifts spatial tears dimensional portals flickering around splinter spirit, surreal full figure',
  ),
};

/** Character identity snippet reused in ultimate prompts for consistency. */
export const CHARACTER_IDENTITY: Record<string, string> = {
  knuspergnom:
    'same tiny dwarf pale white goblin dönermann fire beard colossal döner spit earth plant arm floating döner bread',
  schluckspecht:
    'same cool specht magician, glowing Flachmann, heavy water magic mist waves droplets surrounding him, light magic',
  stiernackenkommando:
    'same tattooed minotaur black harness Berghain techno bouncer NOT centaur',
  kokabell: 'same blonde junkie party woman flowers in hair faint angel wings vines ranken weed glitter white skirt',
  pillendoktora: 'same stunning scientist flaming hair giant floating pills few potions',
  dripministerin:
    'same überzeichnet goth woman water hair liquid flowing demon wings fishnet harness designer fashion',
  mysterium:
    'same splinter shard ghost amorphous entity many scattered mouths eyes glass fragments barely visible phantom',
};
