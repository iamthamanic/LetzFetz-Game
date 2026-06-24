/**
 * App header brand — official Letz Fetz logo image.
 * Location: src/components/AppBrand.tsx
 */
import React from 'react';

export const LETZ_FETZ_LOGO_SRC = '/brand/letz-fetz-logo.png';

export function AppBrand() {
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
