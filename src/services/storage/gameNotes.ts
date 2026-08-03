/**
 * Game / playtest notes in localStorage (settings + shell Notes modal).
 * Location: src/services/storage/gameNotes.ts
 */

export const GAME_NOTES_STORAGE_KEY = 'letz-fetz:game-notes';

export interface GameNote {
  id: string;
  title: string;
  content: string;
  /** ISO-8601 */
  createdAt: string;
  /** ISO-8601 */
  updatedAt: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function parseNote(raw: unknown): GameNote | null {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  if (
    !isNonEmptyString(record.id) ||
    typeof record.title !== 'string' ||
    typeof record.content !== 'string' ||
    !isNonEmptyString(record.createdAt) ||
    !isNonEmptyString(record.updatedAt)
  ) {
    return null;
  }
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/** Format note timestamps for German UI (date + time). */
export function formatGameNoteTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function loadGameNotes(): GameNote[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GAME_NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(parseNote).filter((n): n is GameNote => n !== null);
  } catch {
    return [];
  }
}

/** Returns false when localStorage is unavailable or write fails. */
export function saveGameNotes(notes: GameNote[]): boolean {
  if (typeof localStorage === 'undefined') return false;
  try {
    localStorage.setItem(GAME_NOTES_STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
}

export function createGameNoteId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
