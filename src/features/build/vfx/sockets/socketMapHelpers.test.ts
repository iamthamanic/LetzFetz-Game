/**
 * Unit tests for VFX technique socket map helpers.
 * Location: src/features/build/vfx/sockets/socketMapHelpers.test.ts
 */
import { describe, expect, it } from 'vitest';
import {
  createDefaultSocketMap,
  formatSocketPositionDe,
  parseTechniqueSocketMap,
  updateSocketInMap,
  roundVec3,
} from './socketMapHelpers';
import { VFX_TECHNIQUE_SOCKET_NAMES } from './vfxSocketRoles';

describe('socketMapHelpers', () => {
  it('creates default map with all named sockets at origin', () => {
    const map = createDefaultSocketMap();
    expect(Object.keys(map).sort()).toEqual([...VFX_TECHNIQUE_SOCKET_NAMES].sort());
    for (const name of VFX_TECHNIQUE_SOCKET_NAMES) {
      expect(map[name]).toEqual({ x: 0, y: 0, z: 0 });
    }
  });

  it('updates a single socket without mutating others', () => {
    const base = createDefaultSocketMap();
    const next = updateSocketInMap(base, 'impact', { x: 1, y: 2, z: 3 });
    expect(next.impact).toEqual({ x: 1, y: 2, z: 3 });
    expect(next.essenceOrigin).toEqual({ x: 0, y: 0, z: 0 });
    expect(base.impact).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('parses partial socket maps with defaults for missing keys', () => {
    const parsed = parseTechniqueSocketMap({
      essenceOrigin: { x: 0.1, y: 0.2, z: 0.3 },
      trailStart: { x: -1, y: 0, z: 0.5 },
    });
    expect(parsed.essenceOrigin).toEqual({ x: 0.1, y: 0.2, z: 0.3 });
    expect(parsed.trailStart).toEqual({ x: -1, y: 0, z: 0.5 });
    expect(parsed.trailEnd).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('returns full defaults when sockets field is absent', () => {
    expect(parseTechniqueSocketMap(undefined)).toEqual(createDefaultSocketMap());
  });

  it('formats German coordinate summary', () => {
    expect(formatSocketPositionDe({ x: 1, y: 2.5, z: -3.456 })).toBe('(1.00, 2.50, -3.46)');
  });

  it('rounds vec3 for stable persistence', () => {
    expect(roundVec3({ x: 1.23456, y: 0, z: -9.9999 })).toEqual({
      x: 1.235,
      y: 0,
      z: -10,
    });
  });
});
