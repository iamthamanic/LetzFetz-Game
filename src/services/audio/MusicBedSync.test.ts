import { describe, expect, it } from 'vitest';
import { isBattleMusicActive, resolveMusicBed } from './MusicBedSync';

describe('isBattleMusicActive', () => {
  it('is false during Play setup (no state)', () => {
    expect(isBattleMusicActive(false, false)).toBe(false);
  });

  it('is false during MatchIntro (state exists, intro open)', () => {
    expect(isBattleMusicActive(true, true)).toBe(false);
  });

  it('is true only after intro continues with state on board', () => {
    expect(isBattleMusicActive(true, false)).toBe(true);
  });
});

describe('resolveMusicBed', () => {
  it('keeps menu bed outside Play and during Play setup/intro', () => {
    expect(resolveMusicBed(false, false)).toBe('menu');
    expect(resolveMusicBed(false, true)).toBe('menu');
    expect(resolveMusicBed(true, false)).toBe('menu');
  });

  it('switches to match bed only when Play tab + battle active', () => {
    expect(resolveMusicBed(true, true)).toBe('match');
  });
});
