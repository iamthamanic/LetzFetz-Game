import React, { useState } from 'react';
import { ForgeView } from './features/forge/ForgeView';
import { SandboxView } from './features/sandbox/SandboxView';
import { Notes } from './features/shell/Notes';
import { PlayView } from './features/play/PlayView';
import { PlaymatZonePreview } from './features/play/board/PlaymatZonePreview';
import { AppBrand } from './features/shell/AppBrand';
import { AppNav, type AppView } from './features/shell/AppNav';
import { MainMenu } from './features/shell/MainMenu';
import { SettingsView } from './features/settings/SettingsView';
import { isPlaymatPreview } from './features/play/services/playtest/isPlaymatPreview';
import { AppHistoryProvider, useAppHistory } from './services/history/AppHistoryContext';
import { AudioSettingsSync } from './services/audio/AudioSettingsSync';
import { MusicBedSync } from './services/audio/MusicBedSync';
import { DisplaySettingsSync } from './services/settings/DisplaySettingsSync';
import { SettingsProvider } from './services/settings/SettingsProvider';
import { Modal } from './components/ui/Modal';

function AppShell() {
  const [currentView, setCurrentView] = useState<AppView>('menu');
  const [notesOpen, setNotesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [arenaKey, setArenaKey] = useState(0);
  const [playSessionKey, setPlaySessionKey] = useState(0);
  const { push, canGoBack, canGoForward, goBack, goForward } = useAppHistory();
  const musicBed = currentView === 'play' ? 'match' : 'menu';

  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  const handleViewChange = (view: AppView) => {
    if (view === currentView) return;
    const from = currentView;
    const to = view;
    if (to === 'arena') {
      setArenaKey((prev) => prev + 1);
    }
    if (to === 'play' && from !== 'play') {
      setPlaySessionKey((prev) => prev + 1);
    }
    push({
      undo: () => setCurrentView(from),
      redo: () => setCurrentView(to),
    });
    setCurrentView(to);
  };

  /** Logo home: end any active match and return to the main menu. */
  const handleBrandHome = () => {
    setPlaySessionKey((prev) => prev + 1);
    if (currentView !== 'menu') {
      handleViewChange('menu');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      <MusicBedSync bed={musicBed} />
      <header
        data-testid="app-header"
        className="flex-none border-b border-stone-800 bg-stone-950/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <AppBrand onHome={handleBrandHome} />
          <AppNav
            currentView={currentView}
            onViewChange={handleViewChange}
            onOpenSettings={openSettings}
            settingsOpen={settingsOpen}
            onOpenNotes={() => setNotesOpen(true)}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            onGoBack={goBack}
            onGoForward={goForward}
          />
        </div>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className={`flex min-h-0 flex-1 flex-col ${currentView === 'menu' ? '' : 'hidden'}`}
        >
          <MainMenu onNavigate={handleViewChange} onOpenSettings={openSettings} />
        </div>
        {/* Keep feature views mounted so undo across tabs still works */}
        <div
          className={`flex min-h-0 flex-1 flex-col ${currentView === 'forge' ? '' : 'hidden'}`}
        >
          <ForgeView />
        </div>
        <div
          className={`flex min-h-0 flex-1 flex-col ${currentView === 'arena' ? '' : 'hidden'}`}
        >
          <SandboxView key={arenaKey} />
        </div>
        <div
          className={`flex min-h-0 flex-1 flex-col ${currentView === 'play' ? '' : 'hidden'}`}
        >
          <PlayView key={playSessionKey} />
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
          onOpenNotes={() => {
            closeSettings();
            setNotesOpen(true);
          }}
        />
      </Modal>

      <Notes isOpen={notesOpen} onClose={() => setNotesOpen(false)} />
    </div>
  );
}

export default function App() {
  if (isPlaymatPreview()) {
    return <PlaymatZonePreview />;
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
