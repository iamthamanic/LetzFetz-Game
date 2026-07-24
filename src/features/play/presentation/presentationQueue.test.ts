import { describe, expect, it } from 'vitest';
import {
  IDLE_PRESENTATION_QUEUE,
  completePresentationStep,
  enqueuePresentationSteps,
  flushPresentationQueue,
  isPresentationIdle,
  pendingPresentationCount,
  skipPresentation,
} from './presentationQueue';
import type { PresentationStep } from './types';

const step = (id: string, kind = 'test', durationMs = 0): PresentationStep => ({
  id,
  kind,
  durationMs,
});

describe('presentationQueue', () => {
  it('starts first step on enqueue when idle', () => {
    const next = enqueuePresentationSteps(IDLE_PRESENTATION_QUEUE, [
      step('a'),
      step('b'),
    ]);

    expect(next.active?.id).toBe('a');
    expect(next.pending.map((s) => s.id)).toEqual(['b']);
    expect(next.inputLocked).toBe(true);
    expect(isPresentationIdle(next)).toBe(false);
  });

  it('plays steps in FIFO order via completeStep', () => {
    let state = enqueuePresentationSteps(IDLE_PRESENTATION_QUEUE, [
      step('1'),
      step('2'),
      step('3'),
    ]);

    expect(state.active?.id).toBe('1');
    state = completePresentationStep(state);
    expect(state.active?.id).toBe('2');
    state = completePresentationStep(state);
    expect(state.active?.id).toBe('3');
    state = completePresentationStep(state);

    expect(state.active).toBeNull();
    expect(state.pending).toEqual([]);
    expect(state.inputLocked).toBe(false);
    expect(isPresentationIdle(state)).toBe(true);
  });

  it('appends to pending while a step is active', () => {
    let state = enqueuePresentationSteps(IDLE_PRESENTATION_QUEUE, [step('a')]);
    state = enqueuePresentationSteps(state, [step('b'), step('c')]);

    expect(state.active?.id).toBe('a');
    expect(state.pending.map((s) => s.id)).toEqual(['b', 'c']);
    expect(pendingPresentationCount(state)).toBe(3);
  });

  it('skip clears queue and unlocks input', () => {
    const state = enqueuePresentationSteps(IDLE_PRESENTATION_QUEUE, [
      step('a'),
      step('b'),
    ]);
    const skipped = skipPresentation(state);

    expect(skipped.active).toBeNull();
    expect(skipped.pending).toEqual([]);
    expect(skipped.inputLocked).toBe(false);
    expect(skipped.skipped).toBe(true);
  });

  it('flush resets to idle including skipped flag', () => {
    const skipped = skipPresentation(
      enqueuePresentationSteps(IDLE_PRESENTATION_QUEUE, [step('a')]),
    );
    const flushed = flushPresentationQueue(skipped);

    expect(flushed).toEqual(IDLE_PRESENTATION_QUEUE);
  });

  it('completeStep is noop when idle', () => {
    expect(completePresentationStep(IDLE_PRESENTATION_QUEUE)).toEqual(
      IDLE_PRESENTATION_QUEUE,
    );
  });

  it('enqueue with empty array is noop', () => {
    const state = enqueuePresentationSteps(IDLE_PRESENTATION_QUEUE, []);
    expect(state).toEqual(IDLE_PRESENTATION_QUEUE);
  });

  it('non-locking active step keeps input unlocked', () => {
    const botDraw = { ...step('bot-draw'), locksInput: false };
    const state = enqueuePresentationSteps(IDLE_PRESENTATION_QUEUE, [botDraw]);

    expect(state.active?.id).toBe('bot-draw');
    expect(state.inputLocked).toBe(false);
  });
});
