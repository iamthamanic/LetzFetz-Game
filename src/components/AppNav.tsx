/**
 * App shell navigation — view tabs, history back/forward, notes action.
 * Location: src/components/AppNav.tsx
 */
import React from 'react';
import { ChevronLeft, ChevronRight, Gamepad2, Layers, Swords, StickyNote } from 'lucide-react';
import { Tabs, type TabItem } from './ui/Tabs';
import { Button } from './ui/Button';

export type AppView = 'menu' | 'forge' | 'arena' | 'play' | 'settings';

interface AppNavProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onOpenNotes: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
}

const NAV_ITEMS: TabItem[] = [
  { id: 'play', label: 'Play', icon: <Gamepad2 className="h-4 w-4 shrink-0" />, tone: 'play' },
  { id: 'forge', label: 'Cards', icon: <Layers className="h-4 w-4 shrink-0" />, tone: 'editor' },
  { id: 'arena', label: 'Sandbox', icon: <Swords className="h-4 w-4 shrink-0" />, tone: 'sandbox' },
];

export function AppNav({
  currentView,
  onViewChange,
  onOpenNotes,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
}: AppNavProps) {
  const tabActive =
    currentView === 'play' || currentView === 'forge' || currentView === 'arena'
      ? currentView
      : '';

  return (
    <div
      data-testid="app-nav"
      className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3"
    >
      <div className="flex shrink-0 items-center gap-0.5" data-testid="app-nav-history">
        <Button
          variant="ghost"
          size="sm"
          icon={<ChevronLeft className="h-4 w-4" />}
          aria-label="Zurück"
          title="Zurück"
          disabled={!canGoBack}
          onClick={onGoBack}
          className="shrink-0 px-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200 disabled:opacity-30"
          data-testid="app-nav-back"
        />
        <Button
          variant="ghost"
          size="sm"
          icon={<ChevronRight className="h-4 w-4" />}
          aria-label="Vor"
          title="Vor"
          disabled={!canGoForward}
          onClick={onGoForward}
          className="shrink-0 px-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200 disabled:opacity-30"
          data-testid="app-nav-forward"
        />
      </div>
      <div className="min-w-0 overflow-x-auto">
        <Tabs
          items={NAV_ITEMS}
          active={tabActive}
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
