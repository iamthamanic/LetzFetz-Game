/**
 * App header brand — official Letz Fetz logo; click returns to the main menu.
 * Location: src/features/shell/AppBrand.tsx
 */
import React from 'react';
import { LETZ_FETZ_LOGO_SRC } from '../../components/brand/letzFetzLogo';

export { LETZ_FETZ_LOGO_SRC };

interface AppBrandProps {
  onHome?: () => void;
}

export function AppBrand({ onHome }: AppBrandProps) {
  if (!onHome) {
    return (
      <div data-testid="app-brand" className="flex shrink-0 items-center justify-start">
        <img
          src={LETZ_FETZ_LOGO_SRC}
          alt="Letz Fetz"
          className="h-11 w-auto max-w-[200px] object-contain object-left sm:h-12 sm:max-w-[220px]"
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      data-testid="app-brand"
      onClick={onHome}
      title="Zum Hauptmenü — beendet die laufende Partie"
      aria-label="Zum Hauptmenü — beendet die laufende Partie"
      className="flex shrink-0 cursor-pointer items-center justify-start rounded-md outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
    >
      <img
        src={LETZ_FETZ_LOGO_SRC}
        alt="Letz Fetz"
        className="h-11 w-auto max-w-[200px] object-contain object-left sm:h-12 sm:max-w-[220px]"
        loading="eager"
        decoding="async"
      />
    </button>
  );
}
