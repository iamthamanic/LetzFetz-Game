import { describe, expect, it } from 'vitest';
import { getPlaymatLayoutForArena, SPAETI_PLAYMAT_SPEC } from './arenaPlaymatLayouts';
import {
  resolvePlaymatLayout,
  scalePlaymatHandPath,
  scalePlaymatRect,
} from './playmatLayout';

describe('playmatLayout', () => {
  it('scales design rects to background asset size', () => {
    const scaled = scalePlaymatRect(
      SPAETI_PLAYMAT_SPEC.designViewBox,
      SPAETI_PLAYMAT_SPEC.bgSize,
      { x: 960, y: 540, width: 400, height: 280 },
    );

    expect(scaled.x).toBe(724);
    expect(scaled.y).toBe(543);
    expect(scaled.width).toBe(302);
    expect(scaled.height).toBe(282);
  });

  it('scales hand path coordinates', () => {
    const path = scalePlaymatHandPath(
      SPAETI_PLAYMAT_SPEC.designViewBox,
      SPAETI_PLAYMAT_SPEC.bgSize,
      'M 340 1000 Q 1020 910 1640 1000',
    );

    expect(path).toContain('M 256');
    expect(path).toContain('1006');
  });

  it('resolves spaeti layout with scaled zones and engine slots', () => {
    const layout = resolvePlaymatLayout(SPAETI_PLAYMAT_SPEC);

    expect(layout.viewBox).toEqual({ width: 1448, height: 1086 });
    expect(layout.zones.find((z) => z.id === 'player-character')?.label).toBe('Du');
    expect(layout.engineSlots.player).toHaveLength(4);
    expect(layout.engineSlots.opponent[0].width).toBeGreaterThan(0);
  });

  it('falls back to default layout for unknown arenas', () => {
    const layout = getPlaymatLayoutForArena('arena-vulkan');
    expect(layout.arenaId).toBe('arena-vulkan');
    expect(layout.zones.length).toBeGreaterThan(0);
    expect(layout.assets.fallback).toBeTruthy();
  });
});
