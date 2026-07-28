/**
 * Reads prefers-reduced-motion for engine 3D mount animation.
 * Location: src/components/engine3d/prefersReducedMotion.ts
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
