/**
 * App shell navigation — view tabs + notes action.
 * Location: src/components/AppNav.tsx
 */
import React from 'react';
import { Gamepad2, Hammer, Swords, StickyNote } from 'lucide-react';
import { Tabs, type TabItem } from './ui/Tabs';
import { Button } from './ui/Button';

export type AppView = 'forge' | 'arena' | 'play';

interface AppNavProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onOpenNotes: () => void;
}

const NAV_ITEMS: TabItem[] = [
  { id: 'play', label: 'Play', icon: <Gamepad2 className="h-4 w-4 shrink-0" />, tone: 'play' },
  { id: 'forge', label: 'Edit', icon: <Hammer className="h-4 w-4 shrink-0" />, tone: 'editor' },
  { id: 'arena', label: 'Sandbox', icon: <Swords className="h-4 w-4 shrink-0" />, tone: 'sandbox' },
];

export function AppNav({ currentView, onViewChange, onOpenNotes }: AppNavProps) {
  return (
    <div
      data-testid="app-nav"
      className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3"
    >
      <div className="min-w-0 overflow-x-auto">
        <Tabs
          items={NAV_ITEMS}
          active={currentView}
          onChange={(id) => onViewChange(id as AppView)}
          ariaLabel="Hauptnavigation"
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        icon={<StickyNote className="h-4 w-4" />}
        aria-label="Notizen öffnen"
        title="Notizen"
        onClick={onOpenNotes}
        className="shrink-0 text-amber-400/90 hover:bg-stone-800 hover:text-amber-300"
      />
    </div>
  );
}
