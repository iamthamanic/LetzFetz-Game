import React, { useState } from 'react';
import { Hammer, Swords, StickyNote } from 'lucide-react';
import { CardForge } from './components/CardForge';
import { Arena } from './components/Arena';
import { Notes } from './components/Notes';

type View = 'forge' | 'arena';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('forge');
  const [notesOpen, setNotesOpen] = useState(false);
  const [arenaKey, setArenaKey] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header Navigation */}
      <header className="bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 border-b border-purple-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">⚔️</div>
              <div>
                <h1 className="text-2xl text-white">Letz Fetz</h1>
                <p className="text-sm text-purple-300">Prototype Engine</p>
              </div>
            </div>
            
            <nav className="flex gap-2">
              <button
                onClick={() => setCurrentView('forge')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  currentView === 'forge'
                    ? 'bg-white text-purple-900 shadow-lg'
                    : 'bg-purple-800/50 text-white hover:bg-purple-800'
                }`}
              >
                <Hammer className="w-5 h-5" />
                Edit
              </button>
              <button
                onClick={() => {
                  setCurrentView('arena');
                  setArenaKey(prev => prev + 1); // Force Arena to reload cards
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  currentView === 'arena'
                    ? 'bg-white text-purple-900 shadow-lg'
                    : 'bg-purple-800/50 text-white hover:bg-purple-800'
                }`}
              >
                <Swords className="w-5 h-5" />
                Test Live
              </button>
              <button
                onClick={() => setNotesOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all bg-amber-600/80 text-white hover:bg-amber-600"
              >
                <StickyNote className="w-5 h-5" />
                Notes
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-88px)]">
        {currentView === 'forge' ? <CardForge /> : <Arena key={arenaKey} />}
      </main>

      {/* Notes Modal */}
      <Notes isOpen={notesOpen} onClose={() => setNotesOpen(false)} />
    </div>
  );
}
