/**
 * Craft Letz-Fetz combination names from slotted Bausteine + effects.
 * Location: src/features/build/model/combinateNameSuggest.ts
 *
 * Local synthesizer first; optional Ollama polish via /api/llm-bot.
 */
import {
  COMBINATION_NAME_MAX,
  findFormulaCard,
  type FormulaCatalogCard,
} from './combinateFormula';
import { BUILD_SLOT_ORDER, type BuildSlots } from './buildTypes';
import type { Element } from '../../../game/types/elements';

const STOP_TOKENS = new Set([
  'erste',
  'erster',
  'der',
  'die',
  'das',
  'und',
  'mit',
  'für',
  'ein',
  'eine',
  'vom',
  'zum',
]);

const DROP_SUFFIXES = [
  'konzentrat',
  'technik',
  'essenz',
  'katalysator',
  'formel',
];

const ELEMENT_STEM: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Beton',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

const EFFECT_THEMES: Array<{ re: RegExp; stem: string }> = [
  { re: /\bheil/i, stem: 'Heil' },
  { re: /\bschild/i, stem: 'Schild' },
  { re: /\bblock/i, stem: 'Block' },
  { re: /\bangriff/i, stem: 'Schlag' },
  { re: /\bboost/i, stem: 'Boost' },
  { re: /\bw6|würfel/i, stem: 'Würfel' },
  { re: /\bzieh/i, stem: 'Zug' },
  { re: /\babwerf/i, stem: 'Abfall' },
  { re: /\bmarke|verstrahlt|aufgewirbelt|erleuchtet/i, stem: 'Marke' },
  { re: /\bschaden/i, stem: 'Treffer' },
  { re: /\bignoriert.*schild|schild.*ignor/i, stem: 'Durchbruch' },
];

function clampName(name: string): string {
  const trimmed = name.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= COMBINATION_NAME_MAX) return trimmed;
  return `${trimmed.slice(0, COMBINATION_NAME_MAX - 1).trimEnd()}…`;
}

function titleCaseToken(token: string): string {
  if (!token) return token;
  return token.charAt(0).toUpperCase() + token.slice(1);
}

/** Split German compound / hyphenated names into usable stems. */
export function extractNameStems(name: string): string[] {
  const raw = name
    .split(/[-·/\s]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const stems: string[] = [];
  for (const part of raw) {
    const lower = part.toLowerCase();
    if (STOP_TOKENS.has(lower)) continue;

    let core = part;
    for (const suffix of DROP_SUFFIXES) {
      if (lower.length > suffix.length + 3 && lower.endsWith(suffix)) {
        core = part.slice(0, part.length - suffix.length);
        break;
      }
    }
    if (core.length < 3) continue;
    stems.push(titleCaseToken(core));
  }
  return stems;
}

export function extractEffectThemes(effectText: string): string[] {
  const found: string[] = [];
  for (const theme of EFFECT_THEMES) {
    if (theme.re.test(effectText) && !found.includes(theme.stem)) {
      found.push(theme.stem);
    }
  }
  return found;
}

function pickStem(stems: string[], avoid: Set<string>, prefer?: string[]): string | null {
  if (prefer) {
    for (const want of prefer) {
      const hit = stems.find((s) => s.toLowerCase() === want.toLowerCase());
      if (hit && !avoid.has(hit.toLowerCase())) return hit;
    }
  }
  for (const stem of [...stems].reverse()) {
    if (!avoid.has(stem.toLowerCase())) return stem;
  }
  return stems[stems.length - 1] ?? null;
}

function slottedCards(
  slots: BuildSlots,
  catalog: FormulaCatalogCard[],
): FormulaCatalogCard[] {
  return BUILD_SLOT_ORDER.map((role) => findFormulaCard(catalog, slots[role])).filter(
    (card): card is FormulaCatalogCard => card != null,
  );
}

/**
 * Deterministic Letz-Fetz style name from ≥2 slotted cards.
 * Blends distinctive name stems with effect/element themes — not a · join.
 */
export function craftSuggestedCombinationName(
  slots: BuildSlots,
  catalog: FormulaCatalogCard[],
): string | null {
  const cards = slottedCards(slots, catalog);
  if (cards.length < 2) return null;

  const byRole = {
    technik: cards.find((c) => c.role === 'technik') ?? null,
    essenz: cards.find((c) => c.role === 'essenz') ?? null,
    katalysator: cards.find((c) => c.role === 'katalysator') ?? null,
  };

  const themes = cards.flatMap((c) => extractEffectThemes(c.effectText));
  const used = new Set<string>();
  const parts: string[] = [];

  const elementStem = byRole.essenz?.element
    ? ELEMENT_STEM[byRole.essenz.element]
    : null;

  const preferTechnik =
    themes.includes('Heil') ? ['Hilfe', 'Ritual'] : themes.includes('Schild') ? ['Barriere', 'Schild'] : undefined;

  const technikStem = byRole.technik
    ? pickStem(extractNameStems(byRole.technik.name), used, preferTechnik)
    : null;
  if (technikStem) used.add(technikStem.toLowerCase());

  const essenzStem = byRole.essenz
    ? pickStem(extractNameStems(byRole.essenz.name), used)
    : null;
  if (essenzStem) used.add(essenzStem.toLowerCase());

  const kataStem = byRole.katalysator
    ? pickStem(extractNameStems(byRole.katalysator.name), used)
    : null;

  const primaryTheme = themes[0] ?? null;

  /** Prefer element + technik flavor when both exist. */
  if (elementStem && technikStem) {
    if (technikStem.toLowerCase() === 'hilfe') {
      parts.push(`${elementStem}hilfe`);
    } else if (elementStem.toLowerCase() !== technikStem.toLowerCase()) {
      parts.push(`${elementStem}-${technikStem}`);
    } else {
      parts.push(technikStem);
    }
  } else if (essenzStem && technikStem) {
    parts.push(`${essenzStem}-${technikStem}`);
  } else if (technikStem && primaryTheme) {
    parts.push(`${technikStem}-${primaryTheme}`);
  } else if (essenzStem && primaryTheme) {
    parts.push(`${essenzStem}-${primaryTheme}`);
  } else if (technikStem) {
    parts.push(technikStem);
  } else if (essenzStem) {
    parts.push(essenzStem);
  }

  /** Fold heal/shield theme when not already implied by the title. */
  if (primaryTheme && parts.length > 0) {
    const blob = parts.join('').toLowerCase();
    const implied =
      (primaryTheme === 'Heil' && (blob.includes('heil') || blob.includes('hilfe'))) ||
      (primaryTheme === 'Schild' && blob.includes('schild'));
    if (
      !implied &&
      !blob.includes(primaryTheme.toLowerCase()) &&
      (primaryTheme === 'Heil' || primaryTheme === 'Schild')
    ) {
      if (parts[0] && !parts[0].includes('-')) {
        parts[0] = `${parts[0]}-${primaryTheme}`;
      }
    }
  }

  if (kataStem) {
    const blob = parts.join('').toLowerCase();
    if (!blob.includes(kataStem.toLowerCase())) {
      parts.push(kataStem);
    }
  }

  if (parts.length === 0) {
    return clampName(cards.map((c) => c.name).join(' · '));
  }

  /** 2 parts → hyphen compound; 3 → mid-dot rhythm like pack names. */
  const crafted =
    parts.length === 1
      ? parts[0]
      : parts.length === 2
        ? `${parts[0]}-${parts[1]}`.replace(/--+/g, '-')
        : `${parts[0]} · ${parts.slice(1).join('-')}`;

  return clampName(crafted.replace(/-+/g, '-').replace(/^-|-$/g, ''));
}

const NAME_SYSTEM = `Du benennst Letz-Fetz Formel-Kombinationen.
Antworte NUR als JSON: {"name":"..."}.
Regeln:
- Deutsch, urban/street, wie Pack-Namen (Retourkutsche, Klarspüler, Sofortzünder).
- Ein neuer Name, KEINE bloße Verkettung der Baustein-Namen mit ·.
- Maximal 48 Zeichen.
- Spiegelt Technik/Essenz/Katalysator-Effekte, nicht nur die Labels.`;

export function buildCombinationNamePrompt(cards: FormulaCatalogCard[]): string {
  const lines = cards.map((card) => {
    const element = card.element ? ` Element=${card.element}` : '';
    return `- ${card.role}: „${card.name}"${element} — Effekt: ${card.effectText || '(leer)'}`;
  });
  return `Bausteine:\n${lines.join('\n')}\n\nErfinde einen passenden Kombinationsnamen.`;
}

function parseSuggestedNameJson(content: string): string | null {
  const trimmed = content.trim();
  if (!trimmed) return null;

  const candidates = [trimmed];
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) candidates.push(fenced[1].trim());

  for (const candidate of candidates) {
    try {
      let parsed: unknown = JSON.parse(candidate);
      /** Some models return a JSON string that itself contains JSON. */
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      if (
        parsed &&
        typeof parsed === 'object' &&
        'name' in parsed &&
        typeof (parsed as { name: unknown }).name === 'string'
      ) {
        const name = (parsed as { name: string }).name.trim();
        if (name.length > 0) return clampName(name);
      }
    } catch {
      /* try next */
    }
  }

  const match = trimmed.match(/"name"\s*:\s*"([^"]+)"/);
  if (!match?.[1]) return null;
  return clampName(match[1].trim());
}

export { parseSuggestedNameJson };

/**
 * Suggested display name from filled Bausteine + effects (not a raw · join).
 * Null when fewer than 2 slots are filled.
 */
export function buildSuggestedCombinationName(
  slots: BuildSlots,
  catalog: FormulaCatalogCard[],
): string | null {
  return craftSuggestedCombinationName(slots, catalog);
}

/**
 * Ask Ollama (via /api/llm-bot, kimi-k2.7-code) for a name.
 * Falls back to local craft only if the API is unavailable.
 */
export async function suggestCombinationNameWithAi(
  slots: BuildSlots,
  catalog: FormulaCatalogCard[],
): Promise<string | null> {
  const cards = slottedCards(slots, catalog);
  if (cards.length < 2) return null;

  const res = await fetch('/api/llm-bot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      purpose: 'formula-name',
      system: NAME_SYSTEM,
      user: buildCombinationNamePrompt(cards),
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    let detail = errText;
    try {
      const errBody = JSON.parse(errText) as { error?: unknown; detail?: unknown };
      if (typeof errBody.error === 'string') detail = errBody.error;
      else if (typeof errBody.detail === 'string') detail = errBody.detail;
    } catch {
      /* keep raw text */
    }
    throw new Error(
      detail
        ? `Namen-API ${res.status}: ${detail.slice(0, 140)}`
        : `Namen-API Fehler (${res.status})`,
    );
  }
  const data = (await res.json()) as { content?: unknown };
  const content = typeof data.content === 'string' ? data.content : '';
  if (!content) throw new Error('Leere KI-Antwort');
  const parsed = parseSuggestedNameJson(content);
  if (!parsed) throw new Error('Ungültige Namens-Antwort');
  return parsed;
}
