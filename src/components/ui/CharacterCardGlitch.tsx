/**
 * Subtle logo-style glitch bars on card frame edges.
 * Location: src/components/ui/CharacterCardGlitch.tsx
 */
import React from 'react';

export function CharacterCardGlitch() {
  return (
    <>
      <div className="character-card-glitch character-card-glitch--left" aria-hidden>
        <span className="character-card-glitch-bar character-card-glitch-bar--magenta" />
        <span className="character-card-glitch-bar character-card-glitch-bar--cyan" />
        <span className="character-card-glitch-bar character-card-glitch-bar--lime" />
      </div>
      <div className="character-card-glitch character-card-glitch--right" aria-hidden>
        <span className="character-card-glitch-bar character-card-glitch-bar--purple" />
        <span className="character-card-glitch-bar character-card-glitch-bar--cyan" />
        <span className="character-card-glitch-bar character-card-glitch-bar--magenta" />
      </div>
    </>
  );
}
