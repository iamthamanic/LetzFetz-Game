/**
 * Motion prompts for short card-play videos (image-to-video via Seedance 2.0).
 * Location: src/services/cardArt/prompts/cardVideos.ts
 */

const COMIC_STYLE =
  'Comic book graphic novel style, bold black ink outlines, cel shaded, NOT photorealistic. ' +
  'Keep exact characters and art style from start image. Fast dynamic cuts, exaggerated impact effects.';

/** Cards that support animated play videos (arena, ultimate, glitch, element-attack). */
export type CardVideoKind = 'arena' | 'ultimate' | 'glitch' | 'element-attack';

export const CARD_VIDEO_PROMPTS: Partial<Record<string, string>> = {
  'arena-club':
    '10 second explosive multi-scene action brawl montage in underground techno rave club. ' +
    'Scene 1: flying backhand slap WHAM neon impact burst, grandma reels back. ' +
    'Scene 2: rapid combo punches and slaps, both grandmas trading brutal hits, sparks flying. ' +
    'Scene 3: one grandma grabs the other and throws her across the dancefloor, crowd gasps. ' +
    'Scene 4: both jump at each other mid-air, double slap collision with massive comic BOOM explosion. ' +
    'Scene 5: final haymaker knockout slap, opponent spins and crashes into speakers, dust and neon debris. ' +
    'Fast dynamic cuts, intense satirical cartoon violence, exaggerated impact effects POW WHAM BAM, ' +
    'strobe lights flash, laser beams sweep, crowd silhouettes react wildly. ' +
    'Same tattooed elderly grandmas in black latex techno outfits. Underground Berghain rave club. ' +
    COMIC_STYLE,

  'arena-kristall':
    '10 second explosive multi-scene action montage in vast crystal cathedral arena. ' +
    'Scene 1: hovering rapper with gold chains and grillz spreads arms preaching, rainbow divine light beams blast from stained glass windows, money bags and coins erupt outward. ' +
    'Scene 2: praying gemstone jewels leap violently from church pews and smash into each other mid-air, crystal shards flying, comic CRACK impacts. ' +
    'Scene 3: massive jagged crystals burst explosively from cathedral walls and pillars, stone crumbles, DJ altar turntables spin at hyperspeed with bass shockwaves. ' +
    'Scene 4: rapper dives down like prophet slam preaching, gold chains whip through air like weapons, grillz flash lightning, congregation gems scatter. ' +
    'Scene 5: epic cathedral enlightenment finale, all colorful gems ascend and detonate into massive rainbow prism explosion, money tsunami floods the nave, smoke and crystal debris. ' +
    'Intense satirical cartoon action, POW BOOM WHAM effects, healing light beams sweep, exaggerated grunge cathedral chaos. ' +
    COMIC_STYLE,

  'arena-spaeti':
    '10 second explosive multi-scene action montage at Berlin späti corner shop at night. ' +
    'Scene 1: brilliant holy enlightenment light beams erupt violently outward from windows and door onto dark alley, blinding sacred flash. ' +
    'Scene 2: glowing fridge drinks and neon bottles shake loose and launch like missiles through the shop, comic WHAM impacts. ' +
    'Scene 3: divine god rays tornado spins in alley, Späti hanging sign swings wildly, door bursts open with shockwave. ' +
    'Scene 4: volumetric sacred glow sucks in street debris and trash, neon drink crates spiral outward in explosion. ' +
    'Scene 5: epic enlightenment finale engulfs entire späti kiosk and alley, holy light tsunami floods the night, smoke and neon debris. ' +
    'Intense satirical cartoon action, exaggerated divine chaos, no people. ' +
    COMIC_STYLE,

  'arena-vulkan':
    '10 second explosive multi-scene action montage in volcanic casino hellscape arena. ' +
    'Scene 1: active volcano erupts, massive lava rivers surge through casino floor between blackjack and poker tables, chips scatter. ' +
    'Scene 2: slot machines explode in fiery jackpots, cards dice and roulette wheels burn and fly mid-air, comic BOOM impacts. ' +
    'Scene 3: fiery siren spirit with flame hair sings on lava rocks, hypnotized trance people with spiral eyes shuffle desperately toward the fire. ' +
    'Scene 4: gambling tables flip and crash into magma fountains, velvet curtains ignite, pink neon jackpot signs melt and explode. ' +
    'Scene 5: apocalyptic casino meltdown finale, ash cloud eruption, entire floor sinks into molten rock, scorching heat wave. ' +
    'Intense satirical cartoon action, bad decisions vibe, volcanic apocalyptic chaos. ' +
    COMIC_STYLE,

  'arena-sumpf':
    '10 second explosive multi-scene action montage in toxic healing swamp Behörden bureaucracy arena. ' +
    'Scene 1: muddy swamp water rises violently, goblin at desk yells angrily while bandaging patient mid-healing, comic SLAP. ' +
    'Scene 2: towering Aktenstapel file stacks topple and crash into swamp, bureaucratic papers fly everywhere, WHAM impacts. ' +
    'Scene 3: annoyed grumpy goblins at desks throw stamp machines and forms at each other across the office islands. ' +
    'Scene 4: patient breaks free mid-treatment, goblin chases through reeds fog and vines, fluorescent lamp sparks. ' +
    'Scene 5: entire Behörden desk island sinks into toxic bog, goblins flail in mud, passive aggressive bureaucracy apocalypse finale. ' +
    'Intense satirical cartoon action, swamp chaos, exaggerated grunge arena. ' +
    COMIC_STYLE,

  'arena-schattenbasar':
    '10 second explosive multi-scene action montage in dark shadow bazaar online shop arena. ' +
    'Scene 1: translucent ghost soul stretched and vacuumed violently into glowing computer screen portal, comic WHOOSH. ' +
    'Scene 2: toxic product cards labeled SOULS ATTENTION LOVE explode off screen like digital projectiles, hellish prices flash. ' +
    'Scene 3: shopping cart full of ghost souls crashes and spills, souls swirl chaotically into monitor vortex. ' +
    'Scene 4: shadow tentacles burst from corrupted marketplace UI storefront, purple black neon smoke erupts. ' +
    'Scene 5: epic digital soul harvest finale, multiple souls sucked simultaneously into screen overload glitch explosion, shadow debris. ' +
    'Intense satirical cartoon action, corrupted e-commerce chaos, no people only souls. ' +
    COMIC_STYLE,

  'ulti-knuspergnom':
    '10 second explosive ultimate finisher montage Mit Alles und Scharf. ' +
    'Scene 1: tiny döner dwarf goblin leaps mid-air slamming colossal flaming döner spit downward, impact crater BOOM. ' +
    'Scene 2: hundreds of burning red green chilies swarm and explode outward trailing flames, comic WHAM. ' +
    'Scene 3: döner kebab sandwich detonates in fire burst, Berlin alley walls ignite. ' +
    'Scene 4: goblin spins döner spit like weapon, embers tornado engulfs entire scene. ' +
    'Scene 5: epic chili inferno finale, everything burning ground walls food, maximum fire explosion. ' +
    'Ultimate climax action, completely different dynamic pose from portrait, chaotic energy burst. ' +
    COMIC_STYLE,

  'ulti-schluckspecht':
    '10 second explosive ultimate finisher montage Lass laufen Bruder. ' +
    'Scene 1: specht character surfs catastrophic deep blue tsunami wave diagonally through frame, comic SPLASH. ' +
    'Scene 2: glowing metal Flachmann raised overhead radiates blinding light magic beam. ' +
    'Scene 3: apocalyptic blue water deluge crashes over buildings, wave crests explode. ' +
    'Scene 4: specht carves through wave barrel roll, water sprays everywhere WHAM. ' +
    'Scene 5: epic flood finale, entire frame submerged in rich blue ocean tsunami, light magic burst. ' +
    'Ultimate climax action, completely different dynamic pose from portrait. ' +
    COMIC_STYLE,

  'ulti-stiernackenkommando':
    '10 second explosive ultimate finisher montage Rückhandbombe. ' +
    'Scene 1: minotaur in black harness delivers massive backhand slap Rückhandschelle, shadow shockwave BOOM. ' +
    'Scene 2: black purple demon erupts emerging from behind minotaur body, claws spread. ' +
    'Scene 3: victim knocked backward flying away, multiple shadow duplicate copies trailing fading into darkness. ' +
    'Scene 4: furious mid-swing follow-through, open palm slap creates air ripples. ' +
    'Scene 5: epic shadow demon finale, demon and minotaur merge in knockout explosion, victim crashes off screen. ' +
    'Ultimate climax action, completely different dynamic pose from portrait. ' +
    COMIC_STYLE,

  'ulti-kokabell':
    '10 second dramatic ultimate transformation Golden Shower Transzendenz morphing from start frame to end frame. ' +
    'Scene 1: blonde fairy woman with flowers in hair small wings hovers in dark Berlin alley surrounded by cannabis plants, golden sparkles between hands. ' +
    'Scene 2: golden divine light begins pouring down from sky breaking through clouds, green weed plants start glowing brighter. ' +
    'Scene 3: she spreads arms and legs outward into star pose levitating higher, vines and ranken wrap around her legs. ' +
    'Scene 4: powerful yellow golden light beams intensify from above, green radiant weed aura pulses violently around her. ' +
    'Scene 5: full transcendence ultimate form star pose, then massive yellow golden flood wave tsunami rushes directly toward camera engulfing the viewer, blinding golden deluge fills entire frame. ' +
    'Smooth cinematic character-to-ultimate morph, rave healing transcendence climax ending with camera-facing golden flood wave impact. ' +
    'No text no labels no titles no card frame no UI no Letz Fetz branding anywhere. ' +
    COMIC_STYLE,

  'ulti-pillendoktora':
    '10 second explosive ultimate finisher montage 3 Tage wach. ' +
    'Scene 1: doctor head splits open surreal dream montage exploding outward, pill on tongue glowing eyes wide. ' +
    'Scene 2: entire lower body from waist down spins inside violent tornado whirlwind. ' +
    'Scene 3: multiple party hallucination scenes burst from skull like comic panels WHAM. ' +
    'Scene 4: psychedelic nightmare visions flash rapidly, upper body unchanged screaming. ' +
    'Scene 5: epic insomnia finale, skull explosion of dreams and tornado merge into chaotic vision apocalypse. ' +
    'Ultimate climax action, completely different dynamic pose from portrait, not calm scientist. ' +
    COMIC_STYLE,

  'ulti-dripministerin':
    '10 second dramatic ultimate transformation Runway ins Schattenreich morphing from start frame to end frame. ' +
    'Scene 1: beautiful fashion designer woman with teal glowing hair in gothic outfit levitates in dark alley, confident smirk. ' +
    'Scene 2: black purple shadow torrent rises from ground and creeps up her body, demonic corruption begins spreading. ' +
    'Scene 3: body splits down middle, left side transforms into demon horns claws black purple chitinous armor shadow wing. ' +
    'Scene 4: demonic side aggressively consumes human side, water wing and whip dissolve as shadow wins, glowing white demon eye opens. ' +
    'Scene 5: full demonic takeover complete, end frame ultimate form with spiky purple armor massive shadow wings levitating in alley vortex. ' +
    'Smooth cinematic character-to-ultimate morph, demonic side takes over completely, dark alley runway transformation. ' +
    COMIC_STYLE,

  'ulti-mysterium':
    '10 second explosive ultimate finisher montage Echo der ungeschriebenen Mythen. ' +
    'Scene 1: transparent amorphous ghost entity with scattered mouths and eyes explodes outward, comic BOOM. ' +
    'Scene 2: broken time space clock fragments and temporal rifts tear open reality, spatial portals swirl. ' +
    'Scene 3: massive time space collapse infinite fractal splinters shatter outward and inward simultaneously. ' +
    'Scene 4: cosmic vortex swallows environment, mirror echo duplicates from every dimension collide WHAM. ' +
    'Scene 5: epic dimensional apocalypse finale, reality tearing apart catastrophic finisher explosion. ' +
    'Ultimate climax action, extreme chaotic energy not calm portrait. ' +
    COMIC_STYLE,
};

/** Default video duration per card (seconds). */
export const CARD_VIDEO_DURATION: Partial<Record<string, number>> = {
  'arena-club': 10,
  'arena-kristall': 10,
  'arena-spaeti': 10,
  'arena-vulkan': 10,
  'arena-sumpf': 10,
  'arena-schattenbasar': 10,
  'ulti-knuspergnom': 10,
  'ulti-schluckspecht': 10,
  'ulti-stiernackenkommando': 10,
  'ulti-kokabell': 10,
  'ulti-pillendoktora': 10,
  'ulti-dripministerin': 10,
  'ulti-mysterium': 10,
};

/** Optional start/end frame overrides (public paths). Used for character→ultimate morphs. */
export const CARD_VIDEO_FRAMES: Partial<
  Record<string, { start?: string; end?: string }>
> = {
  'ulti-dripministerin': {
    start: '/cards/character/dripministerin.png',
    end: '/cards/ultimate/ulti-dripministerin.png',
  },
  'ulti-kokabell': {
    start: '/cards/character/kokabell.png',
    end: '/cards/ultimate/ulti-kokabell.png',
  },
};

export function cardVideoStartPath(cardId: string): string | null {
  return CARD_VIDEO_FRAMES[cardId]?.start ?? null;
}

export function cardVideoEndPath(cardId: string): string | null {
  return CARD_VIDEO_FRAMES[cardId]?.end ?? null;
}

export function cardVideoPrompt(cardId: string): string | null {
  return CARD_VIDEO_PROMPTS[cardId] ?? null;
}

export function cardVideoKindForId(cardId: string): CardVideoKind | null {
  if (cardId.startsWith('arena-')) return 'arena';
  if (cardId.startsWith('ulti-')) return 'ultimate';
  if (cardId.startsWith('glitch-')) return 'glitch';
  // Element attack cards (e.g. fire-attack-4, water-attack-6a)
  if (/^(fire|water|earth|air|shadow|light)-attack(-\d+[ab]?)?$/.test(cardId)) {
    return 'element-attack';
  }
  return null;
}

/** Skip leading dead frames when looping card videos in UI (seconds). */
export const CARD_VIDEO_PLAYBACK_OFFSET_SEC: Partial<Record<string, number>> = {
  'ulti-knuspergnom': 1,
};

export function cardVideoPlaybackOffsetSec(cardId: string): number {
  return CARD_VIDEO_PLAYBACK_OFFSET_SEC[cardId] ?? 0;
}
