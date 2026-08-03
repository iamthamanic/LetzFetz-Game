/**
 * Unit tests for V5 play-rules section parse / copy helpers.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  parseMarkdownSections,
  sectionIdFromTitle,
  formatRulesWithComments,
  formatSectionWithComments,
  loadPlayRulesComments,
  savePlayRulesComments,
  PLAY_RULES_COMMENTS_STORAGE_KEY,
  type RulesSection,
} from './playRulesSections';

class MockStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

const SAMPLE = `# Title

Preamble ignored.

## 1. Identität & Sieg

Ziel: Gegner auf 0.

## 2. Grundwerte

Handlimit 6.

## 10b. Artefakt-Auktion

Optional.
`;

describe('sectionIdFromTitle', () => {
  it('slugifies German headings', () => {
    expect(sectionIdFromTitle('1. Identität & Sieg')).toBe('1-identitat-sieg');
    expect(sectionIdFromTitle('10b. Artefakt-Auktion')).toBe('10b-artefakt-auktion');
  });
});

describe('parseMarkdownSections', () => {
  it('splits on ## and drops preamble', () => {
    const sections = parseMarkdownSections(SAMPLE);
    expect(sections).toHaveLength(3);
    expect(sections[0]?.id).toBe('1-identitat-sieg');
    expect(sections[0]?.title).toBe('1. Identität & Sieg');
    expect(sections[0]?.body).toContain('Ziel: Gegner auf 0.');
    expect(sections[1]?.title).toBe('2. Grundwerte');
    expect(sections[2]?.id).toBe('10b-artefakt-auktion');
  });
});

describe('formatSectionWithComments', () => {
  const section: RulesSection = { id: 'a', title: 'A', body: 'Body A' };

  it('omits empty Kommentar', () => {
    expect(formatSectionWithComments(section, { a: '  ' })).not.toContain('Kommentar:');
  });

  it('includes Kommentar when present', () => {
    expect(formatSectionWithComments(section, { a: 'Nice' })).toContain('Kommentar:\nNice');
  });
});

describe('formatRulesWithComments', () => {
  const sections: RulesSection[] = [
    { id: 'a', title: 'A', body: 'Body A' },
    { id: 'b', title: 'B', body: 'Body B' },
  ];

  it('omits empty Kommentar lines', () => {
    const text = formatRulesWithComments(sections, { a: '  ', b: '' });
    expect(text).not.toContain('Kommentar:');
    expect(text).toContain('## A');
    expect(text).toContain('Body A');
  });

  it('includes Kommentar when present', () => {
    const text = formatRulesWithComments(sections, { a: 'Nice' });
    expect(text).toContain('Kommentar:\nNice');
    expect(text).not.toMatch(/## B[\s\S]*Kommentar:/);
  });

  it('separates sections with ---', () => {
    const text = formatRulesWithComments(sections, {});
    expect(text).toContain('Body A\n\n---\n\n## B');
  });
});

describe('play rules comment persistence', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', new MockStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('round-trips comments under storage key', () => {
    savePlayRulesComments({ '1-identitat-sieg': 'Kill pressure' });
    expect(localStorage.getItem(PLAY_RULES_COMMENTS_STORAGE_KEY)).toContain('Kill pressure');
    expect(loadPlayRulesComments()).toEqual({ '1-identitat-sieg': 'Kill pressure' });
  });

  it('prunes blank comments on save', () => {
    savePlayRulesComments({ keep: 'yes', drop: '   ' });
    expect(loadPlayRulesComments()).toEqual({ keep: 'yes' });
  });
});
