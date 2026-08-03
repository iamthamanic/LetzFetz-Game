/**
 * App shell navigation — view tabs, history back/forward, match pause / quit / restart.
 * Location: src/features/shell/AppNav.tsx
 */
import React from 'react';
import { Boxes, ChevronLeft, ChevronRight, Gamepad2, Layers, Settings, StickyNote } from 'lucide-react';
import { Tabs, type TabItem } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { AppNavMatchControls } from './AppNavMatchControls';

export type AppView = 'menu' | 'forge' | 'build' | 'play';

interface AppNavProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onOpenSettings: () => void;
  settingsOpen: boolean;
  onOpenNotes: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  /** True on Play route (setup or match) — pause control visible in history cluster. */
  showMatchPause?: boolean;
  /** True while Play has a live match board after MatchIntro (pause / quit / restart enabled). */
  matchActive?: boolean;
  matchPaused?: boolean;
  onToggleMatchPause?: () => void;
  /** Explicit end-match → Hauptmenü (only shown while matchActive). */
  onQuitMatch?: () => void;
  /** Explicit rematch with same setup (only shown while matchActive). */
  onRestartMatch?: () => void;
}

const NAV_ITEMS: TabItem[] = [
  { id: 'play', label: 'Play', icon: <Gamepad2 className="h-4 w-4 shrink-0" />, tone: 'play' },
  { id: 'forge', label: 'Material', icon: <Layers className="h-4 w-4 shrink-0" />, tone: 'editor' },
  { id: 'build', label: 'Build', icon: <Boxes className="h-4 w-4 shrink-0" />, tone: 'sandbox' },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="h-4 w-4 shrink-0" />,
    tone: 'settings',
  },
];

export function AppNav({
  currentView,
  onViewChange,
  onOpenSettings,
  settingsOpen,
  onOpenNotes,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  showMatchPause = false,
  matchActive = false,
  matchPaused = false,
  onToggleMatchPause,
  onQuitMatch,
  onRestartMatch,
}: AppNavProps) {
  const tabActive =
    settingsOpen
      ? 'settings'
      : currentView === 'play' || currentView === 'forge' || currentView === 'build'
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
        <AppNavMatchControls
          showMatchPause={showMatchPause}
          matchActive={matchActive}
          matchPaused={matchPaused}
          onToggleMatchPause={onToggleMatchPause}
          onQuitMatch={onQuitMatch}
          onRestartMatch={onRestartMatch}
        />
      </div>
      <div className="min-w-0 overflow-x-auto">
        <Tabs
          items={NAV_ITEMS}
          active={tabActive}
          onChange={(id) => {
            if (id === 'settings') {
              onOpenSettings();
              return;
            }
            onViewChange(id as AppView);
          }}
          ariaLabel="Hauptnavigation"
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        icon={<StickyNote className="h-4 w-4" />}
        aria-label="Notizen"
        title="Notizen"
        onClick={onOpenNotes}
        className="shrink-0 px-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
        data-testid="app-nav-notes"
      />
    </div>
  );
}
