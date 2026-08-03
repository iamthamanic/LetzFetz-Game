/**
 * Transient combat feedback toasts — Vollblock, Auto-Reaktion, Schild-Absorb.
 * Location: src/features/play/board/CombatFeedbackToasts.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  parseCombatFeedbackToasts,
  type CombatFeedbackToastItem,
} from './combatFeedbackCopy';

export const COMBAT_FEEDBACK_TOAST_MS = 4200;

interface VisibleToast extends CombatFeedbackToastItem {
  key: string;
}

interface CombatFeedbackToastsProps {
  lastEvent: string | null | undefined;
}

function toneClass(kind: CombatFeedbackToastItem['kind']): string {
  if (kind === 'vollblock') {
    return 'border-emerald-500/55 bg-emerald-950/90 text-emerald-100';
  }
  if (kind === 'auto-reaction') {
    return 'border-amber-500/55 bg-amber-950/90 text-amber-100';
  }
  if (kind === 'delay-resolve') {
    return 'border-orange-500/55 bg-orange-950/90 text-orange-100';
  }
  if (kind === 'echo-resolve') {
    return 'border-cyan-500/55 bg-cyan-950/90 text-cyan-100';
  }
  if (kind === 'construct-summon') {
    return 'border-violet-500/55 bg-violet-950/90 text-violet-100';
  }
  if (kind === 'ueberformel') {
    return 'border-amber-500/55 bg-amber-950/90 text-amber-100';
  }
  return 'border-cyan-500/55 bg-cyan-950/90 text-cyan-100';
}

export function CombatFeedbackToasts({ lastEvent }: CombatFeedbackToastsProps) {
  const [toasts, setToasts] = useState<VisibleToast[]>([]);
  const prevEventRef = useRef<string | null | undefined>(undefined);
  const seqRef = useRef(0);

  useEffect(() => {
    if (!lastEvent || lastEvent === prevEventRef.current) return;
    prevEventRef.current = lastEvent;

    const parsed = parseCombatFeedbackToasts(lastEvent);
    if (parsed.length === 0) return;

    const batch = parsed.map((item) => {
      seqRef.current += 1;
      return { ...item, key: `${item.kind}-${seqRef.current}` };
    });
    setToasts((prev) => [...prev, ...batch]);

    const timers = batch.map((item) =>
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.key !== item.key));
      }, COMBAT_FEEDBACK_TOAST_MS),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [lastEvent]);

  if (toasts.length === 0) return null;

  return (
    <div
      data-testid="combat-feedback-toasts"
      className="pointer-events-none fixed inset-x-0 top-16 z-[70] flex flex-col items-center gap-2 px-3 sm:top-20"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.key}
          data-testid={toast.testId}
          data-feedback-kind={toast.kind}
          className={`w-full max-w-md rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm ${toneClass(toast.kind)}`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">
            {toast.title}
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug">{toast.body}</p>
        </div>
      ))}
    </div>
  );
}
