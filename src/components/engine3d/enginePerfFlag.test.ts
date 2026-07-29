/**
 * Unit tests for engine perf HUD flag.
 * Location: src/components/engine3d/enginePerfFlag.test.ts
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest';
import { isEnginePerfHudEnabled } from './enginePerfFlag';

describe('isEnginePerfHudEnabled', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/');
    window.localStorage.removeItem('lf-engine-perf');
  });

  it('is false by default', () => {
    expect(isEnginePerfHudEnabled()).toBe(false);
  });

  it('reads ?enginePerf=1', () => {
    window.history.replaceState({}, '', '/?enginePerf=1');
    expect(isEnginePerfHudEnabled()).toBe(true);
  });

  it('reads localStorage lf-engine-perf', () => {
    window.localStorage.setItem('lf-engine-perf', '1');
    expect(isEnginePerfHudEnabled()).toBe(true);
  });
});
