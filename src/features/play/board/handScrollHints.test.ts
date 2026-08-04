import { describe, expect, it } from 'vitest';
import {
  measureHandScrollHints,
  pickHandScrollHint,
} from './handScrollHints';

describe('measureHandScrollHints', () => {
  it('returns no scroll when content fits', () => {
    expect(
      measureHandScrollHints({ scrollLeft: 0, clientWidth: 300, scrollWidth: 300 }),
    ).toEqual({ canScrollLeft: false, canScrollRight: false });
  });

  it('detects right overflow at the start', () => {
    expect(
      measureHandScrollHints({ scrollLeft: 0, clientWidth: 300, scrollWidth: 900 }),
    ).toEqual({ canScrollLeft: false, canScrollRight: true });
  });

  it('detects left overflow at the end', () => {
    expect(
      measureHandScrollHints({ scrollLeft: 600, clientWidth: 300, scrollWidth: 900 }),
    ).toEqual({ canScrollLeft: true, canScrollRight: false });
  });

  it('detects both directions in the middle', () => {
    expect(
      measureHandScrollHints({ scrollLeft: 200, clientWidth: 300, scrollWidth: 900 }),
    ).toEqual({ canScrollLeft: true, canScrollRight: true });
  });
});

describe('pickHandScrollHint', () => {
  it('prefers right when both directions are available', () => {
    expect(pickHandScrollHint(true, true)).toBe('right');
  });

  it('shows left only when at the right end', () => {
    expect(pickHandScrollHint(true, false)).toBe('left');
  });

  it('shows right when only right is available', () => {
    expect(pickHandScrollHint(false, true)).toBe('right');
  });

  it('hides when neither direction is available', () => {
    expect(pickHandScrollHint(false, false)).toBeNull();
  });
});
