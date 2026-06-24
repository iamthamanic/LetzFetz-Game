import { describe, expect, it } from 'vitest';
import {
  buildDripPaths,
  buildFramePoints,
  buildGlitchBars,
  buildSplatter,
  buildStarburstPoints,
  hashString,
  namePlateRotation,
  namePlateTextMetrics,
} from './cardNamePlateGeometry';

describe('cardNamePlateGeometry', () => {
  it('hashes strings deterministically', () => {
    expect(hashString('knuspergnom')).toBe(hashString('knuspergnom'));
    expect(hashString('a')).not.toBe(hashString('b'));
  });

  it('builds frame polygon point strings', () => {
    const points = buildFramePoints(42);
    expect(points).toMatch(/^\d+,\d+( \d+,\d+)+$/);
    expect(points.split(' ').length).toBeGreaterThan(10);
  });

  it('builds starburst with many spikes', () => {
    const points = buildStarburstPoints(7);
    expect(points.split(' ').length).toBe(28);
    expect(points).not.toBe(buildStarburstPoints(8));
  });

  it('builds drip paths', () => {
    const drips = buildDripPaths(99);
    expect(drips.length).toBe(5);
    expect(drips[0]).toMatch(/^M /);
  });

  it('builds outer glitch bars', () => {
    const left = buildGlitchBars(12, 'left');
    const right = buildGlitchBars(12, 'right');
    expect(left.length).toBe(7);
    expect(right[0][0]).toBeGreaterThan(900);
  });

  it('builds splatter specks', () => {
    const splatter = buildSplatter(99);
    expect(splatter).toHaveLength(56);
  });

  it('scales text metrics for long names', () => {
    expect(namePlateTextMetrics(8).fontSize).toBe(162);
    expect(namePlateTextMetrics(12).fontSize).toBe(142);
    expect(namePlateTextMetrics(16).fontSize).toBe(122);
  });

  it('applies slight deterministic rotation', () => {
    expect(namePlateRotation(42)).toBeGreaterThan(-4);
    expect(namePlateRotation(42)).toBeLessThan(0);
  });
});
