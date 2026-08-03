import React, { useEffect, useRef, useState } from 'react';
import { ForgeView } from './features/forge/ForgeView';
import { BuildView } from './features/build/BuildView';
import { Notes } from './features/shell/Notes';
import { PlayView } from './features/play/PlayView';
import { PlaymatZonePreview } from './features/play/board/PlaymatZonePreview';
import { PlayRulesModal } from './features/play/board/PlayRulesModal';
import { AppBrand } from './features/shell/AppBrand';
import { AppNav, type AppView } from './features/shell/AppNav';
import { classifyLeavePlay } from './features/shell/leavePlayGuard';
import { MainMenu } from './features/shell/MainMenu';
import { SettingsView } from './features/settings/SettingsView';
import { isPlaymatPreview } from './features/play/services/playtest/isPlaymatPreview';
import { isVfxBatchPreview } from './features/build/vfx/batch/isVfxBatchPreview';
import { VfxBatchPreviewPage } from './features/build/vfx/batch/VfxBatchPreviewPage';
import { AppHistoryProvider, useAppHistory } from './services/history/AppHistoryContext';
import { AudioSettingsSync } from './services/audio/AudioSettingsSync';
import { MusicBedSync, resolveMusicBed } from './services/audio/MusicBedSync';
import { DisplaySettingsSync } from './services/settings/DisplaySettingsSync';
import { SettingsProvider } from './services/settings/SettingsProvider';
import { Modal } from './components/ui/Modal';

const END_MATCH_HOME_MSG =
  'Zum Hauptmenü? Die laufende Partie wird beendet und kann nicht fortgesetzt werden.';
const LEAVE_SETUP_HOME_MSG =
  'Zum Hauptmenü? Das aktuelle Play-Setup wird verworfen.';
const PAUSE_MATCH_LEAVE_MSG =
  'Anderen Bereich öffnen? Die laufende Partie bleibt erhalten und wird pausiert.';
const LEAVE_SETUP_TAB_MSG =
  'Play verlassen? Das Setup bleibt im Hintergrund erhalten.';
const RESTART_MATCH_MSG =
  'Partie neu starten? Der aktuelle Spielstand geht verloren.';

function AppShell() {
  const [currentView, setCurrentView] = useState<AppView>('menu');
  const [notesOpen, setNotesOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [playSessionKey, setPlaySessionKey] = useState(0);
  /** True only while Play has a live board after MatchIntro (from PlayView). */
  const [battleMusicActive, setBattleMusicActive] = useState(false);
  /** True only while Play has a live board after MatchIntro continues. */
  const [matchActive, setMatchActive] = useState(false);
  /** Soft pause: stops bot auto-play; composition-root owned for AppNav. */
  const [matchPaused, setMatchPaused] = useState(false);
  /** Bumped to ask PlayView to rematch with the same setup. */
  const [matchRestartNonce, setMatchRestartNonce] = useState(0);
  const { push, canGoBack, canGoForward, goBack, goForward, clear } = useAppHistory();
  const musicBed = resolveMusicBed(currentView === 'play', battleMusicActive);

  const currentViewRef = useRef(currentView);
  const matchActiveRef = useRef(matchActive);
  useEffect(() => {
    currentViewRef.current = currentView;
  }, [currentView]);

  const handleMatchActiveChange = (active: boolean) => {
    const wasActive = matchActiveRef.current;
    matchActiveRef.current = active;
    setMatchActive(active);
    if (active && !wasActive) {
      clear();
    }
  };

  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  const openRules = () => {
    closeSettings();
    setNotesOpen(false);
    setRulesOpen(true);
  };

  const openNotes = () => {
    closeSettings();
    setRulesOpen(false);
    setNotesOpen(true);
  };

  const resetPlaySession = () => {
    setPlaySessionKey((prev) => prev + 1);
    setMatchPaused(false);
    matchActiveRef.current = false;
    setMatchActive(false);
    setBattleMusicActive(false);
  };

  const applyViewChange = (to: AppView): boolean => {
    const from = currentViewRef.current;
    if (to === from) return true;

    const leaveAction = classifyLeavePlay(from, to, matchActiveRef.current);
    if (leaveAction === 'block-leave-to-menu') {
      return false;
    }
    if (leaveAction === 'confirm-pause-match') {
      if (!window.confirm(PAUSE_MATCH_LEAVE_MSG)) return false;
      setMatchPaused(true);
    } else if (leaveAction === 'confirm-leave-setup') {
      if (!window.confirm(LEAVE_SETUP_TAB_MSG)) return false;
    }

    currentViewRef.current = to;
    setCurrentView(to);
    return true;
  };

  const handleViewChange = (view: AppView) => {
    if (view === currentViewRef.current) return;
    const from = currentViewRef.current;
    const to = view;
    if (!applyViewChange(to)) return;
    push({
      undo: () => applyViewChange(from),
      redo: () => applyViewChange(to),
    });
  };

  const quitToMenu = () => {
    if (matchActiveRef.current) {
      if (!window.confirm(END_MATCH_HOME_MSG)) return;
    } else if (currentViewRef.current === 'play') {
      if (!window.confirm(LEAVE_SETUP_HOME_MSG)) return;
    } else if (currentViewRef.current === 'menu') {
      return;
    }
    const from = currentViewRef.current;
    resetPlaySession();
    clear();
    if (from !== 'menu') {
      push({
        undo: () => applyViewChange(from),
        redo: () => {
          resetPlaySession();
          currentViewRef.current = 'menu';
          setCurrentView('menu');
          return true;
        },
      });
      currentViewRef.current = 'menu';
      setCurrentView('menu');
    }
  };

  const handleRestartMatch = () => {
    if (!matchActiveRef.current) return;
    if (!window.confirm(RESTART_MATCH_MSG)) return;
    setMatchPaused(false);
    clear();
    setMatchRestartNonce((n) => n + 1);
  };

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-gray-950">
      <MusicBedSync bed={musicBed} />
      <header
        data-testid="app-header"
        className="relative z-[250] flex-none border-b border-stone-800 bg-stone-950/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <AppBrand onHome={quitToMenu} />
          <AppNav
            currentView={currentView}
            onViewChange={handleViewChange}
            onOpenSettings={openSettings}
            settingsOpen={settingsOpen}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            onGoBack={goBack}
            onGoForward={goForward}
            showMatchPause={currentView === 'play'}
            matchActive={matchActive}
            matchPaused={matchPaused}
            onToggleMatchPause={() => setMatchPaused((prev) => !prev)}
            onQuitMatch={quitToMenu}
            onRestartMatch={handleRestartMatch}
          />
        </div>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className={`flex min-h-0 flex-1 flex-col ${currentView === 'menu' ? '' : 'hidden'}`}
        >
          <MainMenu onNavigate={handleViewChange} onOpenSettings={openSettings} />
        </div>
        <div
          className={`flex min-h-0 flex-1 flex-col ${currentView === 'forge' ? '' : 'hidden'}`}
        >
          <ForgeView />
        </div>
        <div
          className={`flex h-full min-h-0 flex-1 flex-col overflow-hidden ${currentView === 'build' ? '' : 'hidden'}`}
        >
          <BuildView active={currentView === 'build'} />
        </div>
        <div
          className={`flex min-h-0 flex-1 flex-col ${currentView === 'play' ? '' : 'hidden'}`}
        >
          <PlayView
            key={playSessionKey}
            onBattleMusicActiveChange={setBattleMusicActive}
            onMatchActiveChange={handleMatchActiveChange}
            matchPaused={matchPaused}
            onMatchPausedChange={setMatchPaused}
            matchRestartNonce={matchRestartNonce}
            onOpenRules={openRules}
          />
        </div>
      </main>

      <Modal
        open={settingsOpen}
        onClose={closeSettings}
        title="Einstellungen"
        size="lg"
        testId="settings-modal"
      >
        <SettingsView
          embedded
          onOpenNotes={openNotes}
          onOpenRules={openRules}
        />
      </Modal>

      <Notes
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
        onOpenRules={openRules}
      />
      <PlayRulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}

export default function App() {
  if (isPlaymatPreview()) {
    return <PlaymatZonePreview />;
  }

  if (isVfxBatchPreview()) {
    return <VfxBatchPreviewPage />;
  }

  return (
    <AppHistoryProvider>
      <SettingsProvider>
        <AudioSettingsSync />
        <DisplaySettingsSync />
        <AppShell />
      </SettingsProvider>
    </AppHistoryProvider>
  );
}
