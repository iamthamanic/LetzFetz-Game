/**
 * Shared Formelplatz role meta + slot chrome themes (Build Combinate + Play rack).
 * Location: src/components/cards/formula/formulaSlotMeta.ts
 */

export type FormulaSlotRole = 'technik' | 'essenz' | 'katalysator';

export const FORMULA_SLOT_ORDER: FormulaSlotRole[] = ['technik', 'essenz', 'katalysator'];

export const FORMULA_SLOT_LABEL_DE: Record<FormulaSlotRole, string> = {
  technik: 'Technik',
  essenz: 'Essenz',
  katalysator: 'Katalysator',
};

export const FORMULA_SLOT_THEME: Record<
  FormulaSlotRole,
  {
    empty: string;
    filled: string;
    label: string;
    port: string;
    header: string;
  }
> = {
  technik: {
    empty: 'border-emerald-700/50 bg-stone-900/70',
    filled:
      'border-emerald-400/90 bg-gradient-to-b from-emerald-950/80 to-stone-950 shadow-[0_0_24px_rgba(52,211,153,0.22)]',
    label: 'text-emerald-300',
    port: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]',
    header: 'border-emerald-800/60 bg-emerald-950/40',
  },
  essenz: {
    empty: 'border-sky-700/50 bg-stone-900/70',
    filled:
      'border-sky-400/90 bg-gradient-to-b from-sky-950/80 to-stone-950 shadow-[0_0_24px_rgba(56,189,248,0.22)]',
    label: 'text-sky-300',
    port: 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]',
    header: 'border-sky-800/60 bg-sky-950/40',
  },
  katalysator: {
    empty: 'border-amber-700/50 bg-stone-900/70',
    filled:
      'border-amber-400/90 bg-gradient-to-b from-amber-950/70 to-stone-950 shadow-[0_0_24px_rgba(251,191,36,0.2)]',
    label: 'text-amber-300',
    port: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.65)]',
    header: 'border-amber-800/60 bg-amber-950/35',
  },
};

/** Equipment zone chrome — distinct from Formelplatz colors. */
export const EQUIPMENT_SLOT_THEME = {
  empty: 'border-fuchsia-700/50 bg-stone-900/70',
  filled:
    'border-fuchsia-400/90 bg-gradient-to-b from-fuchsia-950/80 to-stone-950 shadow-[0_0_24px_rgba(232,121,249,0.22)]',
  label: 'text-fuchsia-300',
  header: 'border-fuchsia-800/60 bg-fuchsia-950/40',
} as const;
