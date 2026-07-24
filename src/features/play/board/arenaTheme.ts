/**
 * Per-arena ambient theme tokens for duel board backdrop.
 * Location: src/features/play/board/arenaTheme.ts
 */
export interface ArenaTheme {
  gradient: string;
  tint: string;
  accent: string;
}

const DEFAULT: ArenaTheme = {
  gradient: 'from-stone-900/90 via-stone-950/95 to-stone-950',
  tint: 'bg-amber-950/10',
  accent: 'border-amber-800/40',
};

const THEMES: Record<string, ArenaTheme> = {
  'arena-spaeti': {
    gradient: 'from-fuchsia-950/70 via-stone-950/95 to-stone-950',
    tint: 'bg-fuchsia-900/12',
    accent: 'border-fuchsia-700/35',
  },
  'arena-kristall': {
    gradient: 'from-amber-950/75 via-stone-950/95 to-stone-950',
    tint: 'bg-amber-400/8',
    accent: 'border-amber-500/35',
  },
  'arena-vulkan': {
    gradient: 'from-red-950/80 via-stone-950/95 to-stone-950',
    tint: 'bg-red-900/15',
    accent: 'border-red-700/40',
  },
  'arena-sumpf': {
    gradient: 'from-cyan-950/75 via-stone-950/95 to-stone-950',
    tint: 'bg-cyan-900/12',
    accent: 'border-cyan-700/35',
  },
  'arena-club': {
    gradient: 'from-sky-950/70 via-stone-950/95 to-stone-950',
    tint: 'bg-sky-500/10',
    accent: 'border-sky-600/35',
  },
  'arena-schattenbasar': {
    gradient: 'from-purple-950/80 via-stone-950/95 to-stone-950',
    tint: 'bg-purple-900/15',
    accent: 'border-purple-600/40',
  },
};

export function getArenaTheme(arenaId: string): ArenaTheme {
  return THEMES[arenaId] ?? DEFAULT;
}
