/**
 * React hook wrapping the pure presentation queue reducer.
 * Location: src/features/play/presentation/usePresentationQueue.ts
 *
 * Allowed hooks: useState, useRef, useEffect only (project standard).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IDLE_PRESENTATION_QUEUE,
  completePresentationStep,
  enqueuePresentationSteps,
  flushPresentationQueue,
  isPresentationIdle,
  pendingPresentationCount,
  skipPresentation,
} from './presentationQueue';
import { prefersReducedMotion } from './prefersReducedMotion';
import type { PresentationQueueSnapshot, PresentationStep } from './types';

export type UsePresentationQueueOptions = {
  /** When true, enqueue immediately completes (skip animations). */
  reducedMotion?: boolean;
  onStepStart?: (step: PresentationStep) => void;
  onStepComplete?: (step: PresentationStep) => void;
  onQueueIdle?: () => void;
};

export function usePresentationQueue(options: UsePresentationQueueOptions = {}) {
  const [snapshot, setSnapshot] = useState<PresentationQueueSnapshot>(
    IDLE_PRESENTATION_QUEUE,
  );
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const wasIdleRef = useRef(true);
  const lastStartedIdRef = useRef<string | null>(null);

  useEffect(() => {
    const idle = isPresentationIdle(snapshot);
    const active = snapshot.active;
    if (active && active.id !== lastStartedIdRef.current) {
      lastStartedIdRef.current = active.id;
      optionsRef.current.onStepStart?.(active);
    }
    if (!active) {
      lastStartedIdRef.current = null;
    }
    if (idle && !wasIdleRef.current) {
      optionsRef.current.onQueueIdle?.();
    }
    wasIdleRef.current = idle;
  }, [snapshot]);

  useEffect(() => {
    const active = snapshot.active;
    if (!active || active.durationMs <= 0) return;

    const timer = window.setTimeout(() => {
      setSnapshot((prev) => {
        if (!prev.active || prev.active.id !== active.id) return prev;
        optionsRef.current.onStepComplete?.(active);
        return completePresentationStep(prev);
      });
    }, active.durationMs);

    return () => window.clearTimeout(timer);
  }, [snapshot.active]);

  const enqueue = useCallback((steps: PresentationStep | PresentationStep[]) => {
    const list = Array.isArray(steps) ? steps : [steps];
    if (list.length === 0) return;

    const motionReduced =
      optionsRef.current.reducedMotion ?? prefersReducedMotion();

    setSnapshot((prev) => {
      const next = enqueuePresentationSteps(prev, list);
      if (motionReduced) {
        return skipPresentation(next);
      }
      return next;
    });
  }, []);

  const completeStep = useCallback(() => {
    setSnapshot((prev) => {
      if (!prev.active) return prev;
      optionsRef.current.onStepComplete?.(prev.active);
      return completePresentationStep(prev);
    });
  }, []);

  const skip = useCallback(() => {
    setSnapshot((prev) => skipPresentation(prev));
  }, []);

  const flush = useCallback(() => {
    setSnapshot((prev) => flushPresentationQueue(prev));
  }, []);

  return {
    activeStep: snapshot.active,
    pendingCount: pendingPresentationCount(snapshot),
    isInputLocked: snapshot.inputLocked,
    isPlaying: !isPresentationIdle(snapshot),
    skipped: snapshot.skipped,
    enqueue,
    completeStep,
    skip,
    flush,
  };
}
