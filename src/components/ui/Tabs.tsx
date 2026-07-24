/**
 * Horizontal tab navigation primitive with per-tab tone variants.
 * Location: src/components/ui/Tabs.tsx
 */
import React from 'react';

export type TabTone = 'play' | 'editor' | 'sandbox' | 'settings';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  tone?: TabTone;
}

interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}

function activeClasses(tone: TabTone): string {
  switch (tone) {
    case 'play':
      return 'bg-purple-900/90 text-white shadow-[0_0_14px_rgba(52,211,153,0.35)] ring-2 ring-emerald-400/70';
    case 'sandbox':
      return 'bg-stone-800 text-amber-100 ring-1 ring-amber-500/50 shadow-sm';
    case 'editor':
      return 'bg-purple-900/90 text-purple-100 shadow-[0_0_14px_rgba(168,85,247,0.35)] ring-2 ring-purple-500/70';
    case 'settings':
      return 'bg-stone-800 text-stone-100 ring-1 ring-stone-500/50 shadow-sm';
    default:
      return 'bg-stone-800 text-stone-100 shadow-sm';
  }
}

function inactiveClasses(tone: TabTone): string {
  switch (tone) {
    case 'play':
      return 'text-stone-300 hover:bg-stone-800 hover:text-emerald-200/90';
    case 'sandbox':
      return 'text-stone-400 hover:bg-stone-800 hover:text-amber-200/90';
    case 'editor':
      return 'text-stone-400 hover:bg-stone-800 hover:text-purple-200/90';
    case 'settings':
      return 'text-stone-400 hover:bg-stone-800 hover:text-stone-200';
    default:
      return 'text-stone-400 hover:bg-stone-800 hover:text-stone-200';
  }
}

export function Tabs({ items, active, onChange, ariaLabel = 'Tabs' }: TabsProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 rounded-xl border border-stone-800 bg-stone-900/80 p-1"
    >
      {items.map((item) => {
        const isActive = item.id === active;
        const tone = item.tone ?? 'editor';
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-current={isActive ? 'page' : undefined}
            data-testid={`nav-tab-${item.id}`}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 sm:px-4 ${
              isActive ? activeClasses(tone) : inactiveClasses(tone)
            }`}
          >
            {item.icon}
            <span className="font-brand whitespace-nowrap text-xs uppercase leading-none tracking-wide sm:text-sm">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
