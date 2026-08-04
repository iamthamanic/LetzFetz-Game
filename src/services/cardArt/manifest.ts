/**
 * Card art manifest — 48 shared illustrations mapped to all 90 pack cards.
 * Location: src/services/cardArt/manifest.ts
 *
 * Engine-part thumbs: registry `previewUrl` via `lookupEnginePartAsset` when
 * `ENGINE_PART_PNG_ART_SHIPPED`; otherwise empty until PNGs are committed.
 * Play prefers snapshot cache (`resolveEnginePartThumb`) over static PNG.
 */
import type { Element } from '../../game/types';
import {
  ENGINE_CARD_ART_PUBLIC_ROOT,
  lookupEnginePartAsset,
} from '../engineAssets/partRegistry';
import { CHARACTER_PROMPTS } from './prompts/characters';
import { ULTIMATE_PROMPTS } from './prompts/ultimates';
import {
  ALL_ELEMENT_CARD_TYPES,
  ALL_ELEMENTS,
  elementIllustrationPrompt,
  type ElementCardType,
} from './prompts/elements';
import { ARENA_PROMPTS } from './prompts/arenas';
import { GLITCH_PROMPTS } from './prompts/glitches';
import { cardVideoKindForId } from './prompts/cardVideos';
import { isCharacterIdleVideoId } from './prompts/characterIdleVideos';
import { elementAttackVideoKey, ALL_ELEMENTS_WITH_ATTACK_VIDEOS } from './prompts/elementAttackVideos';

export type IllustrationKind = 'character' | 'ultimate' | 'element' | 'arena' | 'glitch';

export interface IllustrationDef {
  key: string;
  kind: IllustrationKind;
  prompt: string;
}

function elementKey(element: Element, cardType: ElementCardType): string {
  return `${element}-${cardType}`;
}

/** All 48 unique illustration definitions for batch generation. */
export function buildIllustrationManifest(): IllustrationDef[] {
  const items: IllustrationDef[] = [];

  for (const [key, prompt] of Object.entries(CHARACTER_PROMPTS)) {
    items.push({ key, kind: 'character', prompt });
  }
  for (const [key, prompt] of Object.entries(ULTIMATE_PROMPTS)) {
    items.push({ key, kind: 'ultimate', prompt });
  }
  for (const element of ALL_ELEMENTS) {
    for (const cardType of ALL_ELEMENT_CARD_TYPES) {
      items.push({
        key: elementKey(element, cardType),
        kind: 'element',
        prompt: elementIllustrationPrompt(element, cardType),
      });
    }
  }
  for (const [key, prompt] of Object.entries(ARENA_PROMPTS)) {
    items.push({ key, kind: 'arena', prompt });
  }
  for (const [key, prompt] of Object.entries(GLITCH_PROMPTS)) {
    items.push({ key, kind: 'glitch', prompt });
  }

  return items;
}

export const ILLUSTRATION_MANIFEST = buildIllustrationManifest();

const manifestByKey = new Map(ILLUSTRATION_MANIFEST.map((item) => [item.key, item]));

/** Join Vite base URL with a public-folder path (always absolute from site root). */
export function publicAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${normalizedPath}`;
}

/** Public URL path for a generated illustration PNG. */
export function illustrationPublicPath(key: string, kind: IllustrationKind): string {
  return publicAssetUrl(`/cards/${kind}/${key}.png`);
}

/** Resolve illustration key from any base-pack / V6 element card id. */
export function illustrationKeyForCardId(cardId: string): string | null {
  const elementMatch = cardId.match(
    /^(?:v6-)?(fire|water|earth|air|shadow|light)-(attack|block|boost)(?:-\d+[ab]?)?$/,
  );
  if (elementMatch) {
    return `${elementMatch[1]}-${elementMatch[2]}`;
  }

  if (cardId.startsWith('ulti-')) return cardId;
  if (cardId.startsWith('arena-')) return cardId;
  if (cardId.startsWith('glitch-')) return cardId;

  if (CHARACTER_PROMPTS[cardId]) return cardId;

  return null;
}

/**
 * Pack id slug → committed PNG slug when filenames diverge.
 * Keep tiny; prefer shipping `/cards/formula/{slug}.png` under the pack id slug.
 */
const FORMULA_ART_SLUG_ALIASES: Readonly<Record<string, string>> = {
  // Playtest Beschwörung catalyst (#346) + catalog Beschwörungsritual (#381) — reuse ritual art.
  beschwoerung: 'opfergabe',
  beschwoerungsritual: 'opfergabe',
  // V6 Überladung ↔ V5 Überspannung — same white line-art (avoid leftover colored ueberladung.png).
  ueberladung: 'ueberspannung',
};

/** Public path for a V5/V6 Formelkomponente PNG under `/cards/formula/`. */
export function resolveFormulaCardArtPath(cardId: string): string {
  const match = cardId.match(/^v[56]-(?:technik|essenz|katalysator)-([a-z0-9-]+)$/);
  if (!match) return '';
  const slug = FORMULA_ART_SLUG_ALIASES[match[1]] ?? match[1];
  return publicAssetUrl(`/cards/formula/${slug}.png`);
}

/**
 * Public path for a V5 Formel-Kombination PNG under `/cards/formula/`.
 * Uses the catalog combination slug (e.g. `raubhiebsirenen` → `…/raubhiebsirenen.png`).
 */
export function resolveFormulaCombinationArtPath(slug: string): string {
  const normalized = slug.trim().toLowerCase();
  if (!normalized || !/^[a-z0-9-]+$/.test(normalized)) return '';
  return publicAssetUrl(`/cards/formula/${normalized}.png`);
}

/** Public path for a V5/V6 Gegenstand PNG under `/cards/item/`. */
export function resolveItemCardArtPath(cardId: string): string {
  const match = cardId.match(/^v[56]-item-([a-z0-9-]+)$/);
  if (!match) return '';
  return publicAssetUrl(`/cards/item/${match[1]}.png`);
}

/** Public path for a V5 Artefakt PNG under `/cards/artifact/`. */
export function resolveArtifactCardArtPath(cardId: string): string {
  const match = cardId.match(/^v5-artifact-([a-z0-9-]+)$/);
  if (!match) return '';
  return publicAssetUrl(`/cards/artifact/${match[1]}.png`);
}

/**
 * Prefer non-blank registry preview; otherwise `/cards/engine/{id}.png`.
 * Pure — Vitest covers blank preview without mocking the registry.
 */
export function enginePartPreviewOrFallback(cardId: string, previewUrl: string): string {
  const preview = previewUrl.trim();
  const path = preview || `${ENGINE_CARD_ART_PUBLIC_ROOT}/${cardId}.png`;
  return publicAssetUrl(path);
}

/**
 * When false, `resolveEnginePartArtPath` does not emit `/cards/engine/{id}.png`
 * URLs. When true, only ids in `ENGINE_PART_PNG_SHIPPED_IDS` resolve (MVP trio
 * first; batch issues grow the set). Play still prefers snapshot cache via
 * `resolveEnginePartThumb`.
 */
export const ENGINE_PART_PNG_ART_SHIPPED = true;

/** Committed preview PNGs under `public/cards/engine/` (grow with GLB batches). */
export const ENGINE_PART_PNG_SHIPPED_IDS: ReadonlySet<string> = new Set([
  'v3-part-water-traeger-01',
  'v3-part-shadow-antrieb-01',
  'v3-part-light-aufsatz-01',
]);

/**
 * Resolve static art for a registered engine part.
 * Prefers registry `previewUrl`; blank/missing → `/cards/engine/{id}.png`
 * when shipped for that id. Unknown id → empty string.
 */
export function resolveEnginePartArtPath(cardId: string): string {
  const entry = lookupEnginePartAsset(cardId);
  if (!entry) return '';
  if (!ENGINE_PART_PNG_ART_SHIPPED || !ENGINE_PART_PNG_SHIPPED_IDS.has(cardId)) {
    if (!ENGINE_PART_PNG_ART_SHIPPED) {
      const preview = entry.previewUrl.trim();
      // Convention paths 404 until assets land; keep non-convention overrides.
      if (!preview || preview.startsWith(`${ENGINE_CARD_ART_PUBLIC_ROOT}/`)) {
        return '';
      }
      return publicAssetUrl(preview);
    }
    return '';
  }
  return enginePartPreviewOrFallback(cardId, entry.previewUrl);
}

/** Default image path for a pack card id, or empty string if unknown. */
export function resolveCardArtPath(cardId: string): string {
  const key = illustrationKeyForCardId(cardId);
  if (key) {
    const def = manifestByKey.get(key);
    if (def) return illustrationPublicPath(key, def.kind);
  }
  const formulaPath = resolveFormulaCardArtPath(cardId);
  if (formulaPath) return formulaPath;
  const itemPath = resolveItemCardArtPath(cardId);
  if (itemPath) return itemPath;
  const artifactPath = resolveArtifactCardArtPath(cardId);
  if (artifactPath) return artifactPath;
  return resolveEnginePartArtPath(cardId);
}

/** Public URL for the shared Letz Fetz card back (brand logo). */
export const CARD_BACK_PUBLIC_PATH = publicAssetUrl('/brand/letz-fetz-logo.png');

export function resolveCardBackPath(): string {
  return CARD_BACK_PUBLIC_PATH;
}

/** Public URL path for a card-play video, or empty string if unsupported / not generated yet. */
export function resolveCardVideoPath(cardId: string): string {
  const kind = cardVideoKindForId(cardId);
  if (!kind) return '';
  return publicAssetUrl(`/videos/${kind}/${cardId}.mp4`);
}

/** Character idle loop (setup + forge preview), or empty if not generated. */
export function resolveCharacterIdleVideoPath(characterId: string): string {
  if (!isCharacterIdleVideoId(characterId)) return '';
  return publicAssetUrl(`/videos/character/${characterId}.mp4`);
}

/** Element attack loop video path, or empty string if unsupported. */
export function resolveElementAttackVideoPath(element: Element): string {
  const key = elementAttackVideoKey(element);
  return publicAssetUrl(`/videos/element-attack/${key}.mp4`);
}

/** All element-attack video manifest keys for batch generation. */
export const ELEMENT_ATTACK_VIDEO_MANIFEST = ALL_ELEMENTS_WITH_ATTACK_VIDEOS.map(
  (element) => elementAttackVideoKey(element),
);

export function getIllustrationDef(key: string): IllustrationDef | undefined {
  return manifestByKey.get(key);
}
