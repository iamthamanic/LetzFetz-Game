/**
 * Ollama Flux image generation backend for card art batch scripts.
 * Location: src/services/cardArt/ollamaGenerate.ts
 */
import { CARD_ART_SIZE, OLLAMA_FLUX_MODEL } from './styleGuide';

export interface OllamaGenerateOptions {
  prompt: string;
  host?: string;
  model?: string;
  width?: number;
  height?: number;
}

export interface OllamaGenerateResult {
  image: Buffer;
  durationMs: number;
}

export function defaultOllamaHost(): string {
  return process.env.OLLAMA_HOST?.replace(/\/$/, '') || 'http://127.0.0.1:11434';
}

/** Generate a PNG buffer via local Ollama Flux API. */
export async function generateOllamaImage(
  options: OllamaGenerateOptions,
): Promise<OllamaGenerateResult> {
  const host = options.host ?? defaultOllamaHost();
  const started = Date.now();
  const response = await fetch(`${host}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options.model ?? OLLAMA_FLUX_MODEL,
      prompt: options.prompt,
      stream: false,
      width: options.width ?? CARD_ART_SIZE.width,
      height: options.height ?? CARD_ART_SIZE.height,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama generate failed (${response.status}): ${text.slice(0, 300)}`);
  }

  const data = (await response.json()) as { image?: string; error?: string };
  if (data.error) throw new Error(`Ollama error: ${data.error}`);
  if (!data.image) throw new Error('Ollama response missing image field');

  return {
    image: Buffer.from(data.image, 'base64'),
    durationMs: Date.now() - started,
  };
}
