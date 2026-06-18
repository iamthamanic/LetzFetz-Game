/**
 * Shared visual style for Letz Fetz card illustrations (center art only).
 * Matches grunge urban TCG reference: gritty street fantasy, room for React frame overlay.
 * Location: src/services/cardArt/styleGuide.ts
 */

export const CARD_ART_SIZE = {
  width: 768,
  height: 1024,
} as const;

export const OLLAMA_FLUX_MODEL = 'x/flux2-klein:4b';

const STYLE_CORE =
  'Letz Fetz trading card game center illustration, gritty urban fantasy grunge aesthetic, ' +
  'weathered street culture, Berlin-night-alley mood, torn paper and wheatpaste poster texture hints, ' +
  'desaturated muddy palette with selective neon accent highlights, cinematic rim lighting, ' +
  'high detail digital painting, portrait composition for TCG card art, ' +
  'subject centered in middle 60 percent, calm empty space in top and bottom thirds for UI frame overlay';

const STYLE_NEGATIVE =
  'no text, no letters, no numbers, no words, no typography, no captions, no card frame, ' +
  'no border, no watermark, no logo, no title bar, no UI elements, no speech bubbles, ' +
  'no nudity, no nipples, no explicit nudity, no genitals';

/** Wrap a subject description with the shared Letz Fetz illustration style. */
export function wrapIllustrationPrompt(subject: string): string {
  return `${STYLE_CORE}, ${subject}, ${STYLE_NEGATIVE}`;
}

const HIGGSFIELD_STYLE_CORE =
  'Letz Fetz TCG card center illustration, dark gritty urban grunge aesthetic, cartoon satirical but moody not cute, ' +
  'extremely exaggerated proportions, bold ink outlines, desaturated muddy palette with sickly neon accent glows, ' +
  'Berlin night alley grime, wet pavement, steam smoke rust torn posters, cinematic harsh shadows, ' +
  'full character or full scene visible head to toe, nothing cropped at frame edges, 3:4 portrait filling frame tightly';

/** Higgsfield Nano Banana — cartoon/satire batch (v2 art direction). */
export function wrapHiggsfieldIllustrationPrompt(subject: string): string {
  return `${HIGGSFIELD_STYLE_CORE}, ${subject}, ${STYLE_NEGATIVE}`;
}

const STYLE_NEGATIVE_NO_CARD_TEXT =
  'no card frame, no border, no watermark, no title bar, no UI elements, no speech bubbles, ' +
  'no nudity, no nipples, no explicit nudity, no genitals';

/** Allows product label on object; blocks card UI text. */
export function wrapHiggsfieldIllustrationPromptAllowCanLabel(subject: string): string {
  return `${HIGGSFIELD_STYLE_CORE}, ${subject}, ${STYLE_NEGATIVE_NO_CARD_TEXT}`;
}
