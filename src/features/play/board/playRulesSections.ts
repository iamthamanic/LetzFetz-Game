/**
 * V5 play-rules sections: parse SPIELANLEITUNG_V5_DRAFT.md, comment storage, copy text.
 * Location: src/features/play/board/playRulesSections.ts
 */
import spielanleitungV5Raw from '../../../../docs/rules/SPIELANLEITUNG_V5_DRAFT.md?raw';

/** localStorage key — Record<sectionId, comment text>. */
export const PLAY_RULES_COMMENTS_STORAGE_KEY = 'letz-fetz:play-rules-section-comments';

export interface RulesSection {
  id: string;
  title: string;
  body: string;
}

/** Stable slug from a `##` heading (numbers + ASCII letters). */
export function sectionIdFromTitle(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Split markdown on top-level `##` headings. Preamble before the first `##` is dropped.
 */
export function parseMarkdownSections(markdown: string): RulesSection[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const sections: RulesSection[] = [];
  let currentTitle: string | null = null;
  let bodyLines: string[] = [];

  const flush = () => {
    if (currentTitle == null) return;
    const title = currentTitle.trim();
    const body = bodyLines.join('\n').trim();
    sections.push({
      id: sectionIdFromTitle(title),
      title,
      body,
    });
    currentTitle = null;
    bodyLines = [];
  };

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flush();
      currentTitle = line.slice(3);
      continue;
    }
    if (currentTitle != null) {
      bodyLines.push(line);
    }
  }
  flush();
  return sections;
}

/** Cached V5 draft sections for the Play rules modal. */
export const V5_PLAY_RULE_SECTIONS: RulesSection[] = parseMarkdownSections(spielanleitungV5Raw);

export function loadPlayRulesComments(): Record<string, string> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PLAY_RULES_COMMENTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed == null || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'string') out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

export function savePlayRulesComments(comments: Record<string, string>): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const pruned: Record<string, string> = {};
    for (const [key, value] of Object.entries(comments)) {
      if (value.trim()) pruned[key] = value;
    }
    localStorage.setItem(PLAY_RULES_COMMENTS_STORAGE_KEY, JSON.stringify(pruned));
  } catch {
    // Quota / private mode — keep in-memory only.
  }
}

/**
 * Copy payload for one section: title, body, then „Kommentar:“ when non-empty.
 */
export function formatSectionWithComments(
  section: RulesSection,
  comments: Record<string, string>,
): string {
  const parts = [`## ${section.title}`, '', section.body];
  const comment = (comments[section.id] ?? '').trim();
  if (comment) {
    parts.push('', 'Kommentar:', comment);
  }
  return parts.join('\n').trimEnd() + '\n';
}

/**
 * Copy payload: each section title, body, then „Kommentar:“ when non-empty.
 * Sections separated by `---`.
 */
export function formatRulesWithComments(
  sections: RulesSection[],
  comments: Record<string, string>,
): string {
  const blocks = sections.map((section) =>
    formatSectionWithComments(section, comments).trimEnd(),
  );
  return blocks.join('\n\n---\n\n').trim() + '\n';
}

/** Clipboard write with textarea fallback for older / restricted contexts. */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to execCommand.
  }
  if (typeof document === 'undefined') return false;
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
