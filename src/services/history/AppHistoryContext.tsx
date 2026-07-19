/**
 * Global back/forward stack for user actions (views, setup, human game moves).
 * Location: src/services/history/AppHistoryContext.tsx
 */
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

export interface HistoryEntry {
  undo: () => void;
  redo: () => void;
}

interface AppHistoryValue {
  canGoBack: boolean;
  canGoForward: boolean;
  push: (entry: HistoryEntry) => void;
  goBack: () => void;
  goForward: () => void;
  /** True while applying undo/redo — skip nested push. */
  isApplying: () => boolean;
}

const AppHistoryContext = createContext<AppHistoryValue | null>(null);

export function AppHistoryProvider({ children }: { children: React.ReactNode }) {
  const stackRef = useRef<HistoryEntry[]>([]);
  const indexRef = useRef(-1);
  const applyingRef = useRef(false);
  const [, setTick] = useState(0);

  const bump = useCallback(() => setTick((n) => n + 1), []);

  const push = useCallback(
    (entry: HistoryEntry) => {
      if (applyingRef.current) return;
      const next = stackRef.current.slice(0, indexRef.current + 1);
      next.push(entry);
      stackRef.current = next;
      indexRef.current = next.length - 1;
      bump();
    },
    [bump],
  );

  const goBack = useCallback(() => {
    if (indexRef.current < 0) return;
    applyingRef.current = true;
    try {
      stackRef.current[indexRef.current].undo();
      indexRef.current -= 1;
      bump();
    } finally {
      applyingRef.current = false;
    }
  }, [bump]);

  const goForward = useCallback(() => {
    if (indexRef.current >= stackRef.current.length - 1) return;
    applyingRef.current = true;
    try {
      indexRef.current += 1;
      stackRef.current[indexRef.current].redo();
      bump();
    } finally {
      applyingRef.current = false;
    }
  }, [bump]);

  const isApplying = useCallback(() => applyingRef.current, []);

  const value: AppHistoryValue = {
    canGoBack: indexRef.current >= 0,
    canGoForward: indexRef.current < stackRef.current.length - 1,
    push,
    goBack,
    goForward,
    isApplying,
  };

  return <AppHistoryContext.Provider value={value}>{children}</AppHistoryContext.Provider>;
}

export function useAppHistory(): AppHistoryValue {
  const ctx = useContext(AppHistoryContext);
  if (!ctx) {
    throw new Error('useAppHistory must be used within AppHistoryProvider');
  }
  return ctx;
}
