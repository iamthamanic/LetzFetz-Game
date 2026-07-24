/**
 * Decorative glitch + spark ambience behind the main menu.
 * Location: src/components/ui/MenuGlitchBackdrop.tsx
 */
import React from 'react';

const SPARKS: {
  left: string;
  top: string;
  delay: string;
  duration: string;
  tone: 'cyan' | 'magenta' | 'emerald' | 'amber';
}[] = [
  { left: '8%', top: '18%', delay: '0s', duration: '3.2s', tone: 'cyan' },
  { left: '22%', top: '72%', delay: '0.4s', duration: '2.8s', tone: 'magenta' },
  { left: '35%', top: '12%', delay: '1.1s', duration: '3.6s', tone: 'emerald' },
  { left: '48%', top: '85%', delay: '0.7s', duration: '2.4s', tone: 'amber' },
  { left: '61%', top: '28%', delay: '1.8s', duration: '3.1s', tone: 'cyan' },
  { left: '74%', top: '64%', delay: '0.2s', duration: '2.9s', tone: 'magenta' },
  { left: '88%', top: '22%', delay: '1.4s', duration: '3.4s', tone: 'emerald' },
  { left: '14%', top: '48%', delay: '2.1s', duration: '2.6s', tone: 'amber' },
  { left: '42%', top: '55%', delay: '0.9s', duration: '3.8s', tone: 'cyan' },
  { left: '67%', top: '8%', delay: '1.6s', duration: '2.7s', tone: 'magenta' },
  { left: '81%', top: '78%', delay: '2.4s', duration: '3.3s', tone: 'emerald' },
  { left: '5%', top: '88%', delay: '0.5s', duration: '2.5s', tone: 'amber' },
  { left: '93%', top: '42%', delay: '1.9s', duration: '3s', tone: 'cyan' },
  { left: '28%', top: '35%', delay: '2.7s', duration: '2.8s', tone: 'magenta' },
  { left: '55%', top: '68%', delay: '0.3s', duration: '3.5s', tone: 'emerald' },
];

/** Sparse horizontal slashes — keep rare vs sparks. */
const GLITCH_BARS = [{ top: '58%', delay: '5s', duration: '18s' }];

export function MenuGlitchBackdrop() {
  return (
    <div className="menu-glitch-backdrop" aria-hidden>
      <div className="menu-glitch-backdrop__vignette" />
      <div className="menu-glitch-backdrop__scanlines" />
      <div className="menu-glitch-backdrop__rgb menu-glitch-backdrop__rgb--cyan" />

      <div className="menu-glitch-backdrop__bars">
        {GLITCH_BARS.map((bar, i) => (
          <span
            key={i}
            className="menu-glitch-backdrop__bar"
            style={
              {
                '--bar-top': bar.top,
                '--bar-delay': bar.delay,
                '--bar-duration': bar.duration,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="menu-glitch-backdrop__sparks">
        {SPARKS.map((spark, i) => (
          <span
            key={i}
            className={`menu-glitch-backdrop__spark menu-glitch-backdrop__spark--${spark.tone}`}
            style={
              {
                '--spark-left': spark.left,
                '--spark-top': spark.top,
                '--spark-delay': spark.delay,
                '--spark-duration': spark.duration,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
