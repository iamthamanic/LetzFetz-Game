/**
 * Generate V3 Elementeffekt square icons via Ollama Z-Image Turbo.
 * Matches card-art grunge style; no typography on the image.
 *
 * Usage:
 *   npx tsx scripts/generate-element-effect-art.ts --all
 *   npx tsx scripts/generate-element-effect-art.ts --key=brennen
 *
 * Location: scripts/generate-element-effect-art.ts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateOllamaImage } from '../src/services/cardArt/ollamaGenerate';
import { OLLAMA_FLUX_MODEL } from '../src/services/cardArt/styleGuide';
import type { PrimaryMarkId } from '../src/game/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'icons', 'marks');

const STYLE =
  'square 1:1 status token illustration for a dark comedy card game, pure painted scene only, ' +
  'NOT a trading card, NOT a product mockup, no frame, no border, no chrome, ' +
  'cartoon satirical but moody not cute, extremely exaggerated proportions, bold thick black ink outlines, ' +
  'desaturated muddy palette with one selective neon accent color, cinematic harsh shadows, ' +
  'subject centered filling most of the frame, solid charcoal black void background with subtle smoke only, ' +
  'no environment buildings';

const NEGATIVE =
  'absolutely no text anywhere, no letters, no words, no typography, no captions, no titles, no logos, ' +
  'no watermarks, no UI, no HUD, no trading card, no card frame, no card border, no nameplate, no icons in corners, ' +
  'no speech bubbles, no neon signs, no store signs, no graffiti, no numbers, no labels, no alley walls, no posters';

const SUBJECTS: Record<PrimaryMarkId, string> = {
  brennen:
    'iconic German grillwurst bratwurst sausage on a small grill, TOP HALF heavily verkokelt charred black burnt crispy carbonized, ' +
    'bottom half still grilled brown with grill marks, roaring orange neon flames licking the sausage, dripping grease sparks, ' +
    'decorative frame around the image made of roaring fire flames and embers like a fiery border, ' +
    'fire glow as main light, sausage clearly recognizable, NO text, NO logos, NO UI icons',
  durchnaesst:
    'awkward adult standing waist-to-feet, blue denim jeans soaked with clear WATER only, ' +
    'huge dark WET WATER patch on crotch and fly of blue jeans, denim turned darker BLUE from water saturation not brown, ' +
    'glistening clear water drips running down thighs, puddle of clear blue-tinted water at bare feet, ' +
    'water-drenched durchnässt comedy gag, NO mud, NO dirt, NO brown splatters, NO urine yellow, ' +
    'both arms at sides with elegant slender ELF hands, long fingers, long bright PINK fingernails on elf hands, ' +
    'thick decorative WATER FRAME on all four edges of square, flowing cyan aqua water waves and bubbles clearly visible, ' +
    'bright cyan water border wraps entire image, NO icons, NO text',
  high:
    'extreme close-up ashen GREY orc face dull grey mottled skin not green, soft goofy chill NOT evil, ' +
    'thick swirling cannabis smoke haze everywhere verraucht filling half the frame, ' +
    'eyes VERY half closed with extremely heavy droopy eyelids covering much of the eyeballs like the stoned emoji, sleepy and exhausted, ' +
    'visible eyeballs are mostly WHITE with bloodshot red veins and soft pink inner corners, only a smaller visible eye opening under the lids, tiny black pupil dots, NOT fully solid red, NO blue iris, ' +
    'sleepy tired mouth corners sagging downward in a dumb blissed stoned expression, ' +
    'decorative frame around the border made of MANY overlapping cannabis weed leaves, more weed leaves than smoke on the frame, ' +
    'NO wide open eyes, NO surprised expression, NO glowing solid eye orbs without lids, NO bright green skin, NO text',
  aufgewirbelt:
    'confused dizzy fantasy UNICORN trapped inside a swirling tornado, body spinning off-balance, ' +
    'spiral dazed pupils, several small yellow cartoon stars Sternchen circling above its horn like classic dizzy stars, ' +
    'mane and debris flying in the wind funnel, unicorn clearly readable in the tornado center, ' +
    'decorative frame around the image made of bright WHITE wind gusts and white whirlwind swirls on all four sides, ' +
    'white airy wind border clearly visible, NO grey orc, NO text, NO logos, NO UI icons',
  erleuchtet:
    'slender radioactive fantasy FAIRY fee with pointed ears and translucent glowing wings, pale skin cracked with luminous neon yellow veins, ' +
    'bright radioactive neon yellow light beams blasting from eyes mouth and ears, eerie nuclear yellow glow not green, ' +
    'decorative glowing frame around the image made of radiant neon yellow light rays and luminous yellow border, ' +
    'upper body portrait centered, fully clothed, NO green glow, NO text, NO logos, NO UI icons',
  verflucht:
    'stumbling undead zombie off-balance, decayed fleshy humanoid with torn grey-purple skin, ' +
    'shadow-infused body coated in black-lilac cursed veins and dripping shadow ooze, ' +
    'zombie face partially obscured by shadow smoke, NO visible skull, NO teeth, NO exposed bones, no ribcage, ' +
    'clawed ghost hands partly covered by rotting flesh, spooky not cute, ' +
    'decorative frame around the image made of lilac-black shadow mist tendrils forming a sharp shadow border all edges, ' +
    'NO text, NO logos, NO UI icons, NO trading card frame',
};

function buildPrompt(id: PrimaryMarkId): string {
  const style =
    id === 'durchnaesst'
      ? 'square 1:1 status token illustration for a dark comedy card game, pure painted scene only, ' +
        'NOT a trading card, NOT a product mockup, cartoon satirical but moody not cute, ' +
        'bold thick black ink outlines, cyan-blue wet color palette with darker blue wet denim, NO brown mud tones, ' +
        'subject centered filling most of the frame, solid charcoal black void background with subtle smoke only'
      : STYLE;
  const negative =
    id === 'durchnaesst'
      ? `${NEGATIVE}, no brown mud, no dirt splatters, no brown stains, no yellow urine`
      : NEGATIVE;
  return `${style}, ${SUBJECTS[id]}, ${negative}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetries(prompt: string, key: string, attempts = 4) {
  let lastError: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await generateOllamaImage({
        prompt,
        model: OLLAMA_FLUX_MODEL,
        width: 768,
        height: 768,
      });
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  retry ${i}/${attempts} for ${key}: ${msg.slice(0, 120)}`);
      if (i < attempts) await sleep(4000 * i);
    }
  }
  throw lastError;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const keyArg = args.find((a) => a.startsWith('--key='))?.slice('--key='.length);
  const all = args.includes('--all') || !keyArg;
  const ids = (Object.keys(SUBJECTS) as PrimaryMarkId[]).filter(
    (id) => all || id === keyArg,
  );
  if (ids.length === 0) throw new Error(`Unknown mark key: ${keyArg}`);

  await fs.mkdir(OUT_DIR, { recursive: true });
  console.log(`Model: ${OLLAMA_FLUX_MODEL}`);
  console.log(`Output: ${OUT_DIR}`);
  console.log(`Generating ${ids.length} effect(s)…\n`);

  for (const id of ids) {
    const outPath = path.join(OUT_DIR, `${id}.png`);
    console.log(`→ ${id}`);
    const { image, durationMs } = await generateWithRetries(buildPrompt(id), id);
    await fs.writeFile(outPath, image);
    console.log(`  wrote ${outPath} (${Math.round(durationMs / 1000)}s, ${image.length} bytes)`);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
