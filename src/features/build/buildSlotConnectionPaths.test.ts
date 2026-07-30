/**
 * Unit tests for Combinate slot→preview connection geometry.
 * Location: src/features/build/buildSlotConnectionPaths.test.ts
 */
import { describe, expect, it } from 'vitest';
import { buildSlotConnectionGeometry } from './buildSlotConnectionPaths';

describe('buildSlotConnectionGeometry', () => {
  it('returns null for no slots', () => {
    expect(buildSlotConnectionGeometry([], { x: 100, y: 40 })).toBeNull();
  });

  it('builds a path for a single filled slot', () => {
    const geo = buildSlotConnectionGeometry(
      [{ role: 'technik', x: 80, y: 220 }],
      { x: 170, y: 50 },
    );
    expect(geo).not.toBeNull();
    expect(geo?.curves).toHaveLength(1);
    expect(geo?.curves[0]?.role).toBe('technik');
    expect(geo?.stem.includes('170')).toBe(true);
  });

  it('routes each slot to a shared rail then stems into the preview', () => {
    const target = { x: 170, y: 50 };
    const geo = buildSlotConnectionGeometry(
      [
        { role: 'essenz', x: 170, y: 220 },
        { role: 'katalysator', x: 260, y: 220 },
      ],
      target,
    );
    expect(geo).not.toBeNull();
    expect(geo?.merge.x).toBe(target.x);
    expect(geo?.merge.y).toBeGreaterThan(target.y);
    expect(geo?.merge.y).toBeLessThan(220);
    expect(geo?.curves).toHaveLength(2);
    /** Near-center Essenz still gets a full path (vertical + horizontal rail). */
    expect(geo?.curves[0]?.d.includes('L')).toBe(true);
    expect(geo?.stem.startsWith('M ')).toBe(true);
    expect(geo?.stem.includes(` ${target.y}`)).toBe(true);
  });

  it('builds three curves when all slots are filled', () => {
    const geo = buildSlotConnectionGeometry(
      [
        { role: 'technik', x: 40, y: 200 },
        { role: 'essenz', x: 140, y: 200 },
        { role: 'katalysator', x: 240, y: 200 },
      ],
      { x: 140, y: 40 },
    );
    expect(geo?.curves).toHaveLength(3);
    expect(geo?.merge.x).toBe(140);
  });
});
