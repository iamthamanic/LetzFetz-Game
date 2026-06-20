import React, { useState } from 'react';
import { CardForge } from './components/CardForge';
import { Arena } from './components/Arena';
import { Notes } from './components/Notes';
import { GameView } from './components/game/GameView';
import { AppBrand } from './components/AppBrand';
import { AppNav, type AppView } from './components/AppNav';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('forge');
  const [notesOpen, setNotesOpen] = useState(false);
  const [arenaKey, setArenaKey] = useState(0);

  const handleViewChange = (view: AppView) => {
    if (view === 'arena') {
      setArenaKey((prev) => prev + 1);
    }
    setCurrentView(view);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      <header
        data-testid="app-header"
        className="flex-none border-b border-stone-800 bg-stone-950/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <AppBrand />
          <AppNav
            currentView={currentView}
            onViewChange={handleViewChange}
            onOpenNotes={() => setNotesOpen(true)}
          />
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-hidden">
        {currentView === 'forge' && <CardForge />}
        {currentView === 'arena' && <Arena key={arenaKey} />}
        {currentView === 'play' && <GameView />}
      </main>

      <Notes isOpen={notesOpen} onClose={() => setNotesOpen(false)} />
    </div>
  );
}
