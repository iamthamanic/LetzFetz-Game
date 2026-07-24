/**
 * Reads prefers-reduced-motion for instant presentation paths.
 * Location: src/features/play/presentation/prefersReducedMotion.ts
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
