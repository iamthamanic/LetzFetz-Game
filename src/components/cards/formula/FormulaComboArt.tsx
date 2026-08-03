/**
 * Combo card art (catalog slug → /cards/formula/<slug>.png) or shared Kombi placeholder.
 * Location: src/components/cards/formula/FormulaComboArt.tsx
 */
import React, { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';
import { resolveFormulaCombinationArtPath } from '../../../services/cardArt/manifest';

interface FormulaComboArtPlaceholderProps {
  compact?: boolean;
  className?: string;
  testId?: string;
}

/** Violet “Kombi” tile used when combination art is missing or fails to load. */
export function FormulaComboArtPlaceholder({
  compact = false,
  className = '',
  testId = 'formula-combo-thumb-placeholder',
}: FormulaComboArtPlaceholderProps) {
  const sizeClass = className.trim()
    ? ''
    : compact
      ? 'h-12 w-12'
      : 'h-16 w-16';
  return (
    <div
      className={`flex flex-col items-center justify-center gap-0.5 rounded-lg border border-violet-400/50 bg-gradient-to-br from-violet-950/90 via-stone-950 to-black text-violet-200 shadow-[inset_0_0_18px_rgba(167,139,250,0.18)] ${sizeClass} ${className}`.trim()}
      data-testid={testId}
      aria-hidden
    >
      <Layers className={compact ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={2} />
      <span className="text-[8px] font-bold uppercase tracking-[0.18em]">Kombi</span>
    </div>
  );
}

interface FormulaComboArtProps {
  /** Catalog combination slug (e.g. raubhiebsirenen). */
  slug: string;
  alt: string;
  /**
   * Outer frame classes (size, margin). When set, replaces default thumb sizes.
   * Example: `mx-auto h-28 w-28 sm:h-32 sm:w-32`
   */
  className?: string;
  compact?: boolean;
  /** data-testid on the loaded <img>. */
  testId?: string;
  /** data-testid on the placeholder fallback. */
  placeholderTestId?: string;
}

/**
 * Tries `/cards/formula/<slug>.png`; on missing slug or load error shows Kombi placeholder.
 */
export function FormulaComboArt({
  slug,
  alt,
  className = '',
  compact = false,
  testId = 'formula-combo-art',
  placeholderTestId = 'formula-combo-thumb-placeholder',
}: FormulaComboArtProps) {
  const src = resolveFormulaCombinationArtPath(slug);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const frameClass = className.trim()
    ? className
    : compact
      ? 'h-12 w-12'
      : 'h-16 w-16';

  if (!src || failed) {
    return (
      <FormulaComboArtPlaceholder
        compact={compact}
        className={frameClass}
        testId={placeholderTestId}
      />
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-lg border border-violet-400/40 bg-stone-950/80 ${frameClass}`.trim()}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        data-testid={testId}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
