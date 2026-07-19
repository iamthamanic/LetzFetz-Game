/**
 * Pre-match setup — mode first, then character carousel (bot) or online notice.
 * Location: src/components/game/GameSetup.tsx
 */
import React, { useState } from 'react';
import { ArrowLeft, Bot, Globe, Layers, Package, WifiOff } from 'lucide-react';
import { BASE_PACK } from '../../game';
import { Button } from '../ui/Button';
import { BrandLogoText } from '../ui/BrandLogoText';
import { CharacterCarousel } from './CharacterCarousel';
import { Badge } from '../ui/Badge';
import { Panel } from '../ui/Panel';

export type GameSetupMode = 'bot' | 'online';
export type GameSetupPhase = 'mode' | 'bot' | 'online';
export type GamePackChoice = 'base' | 'p100';

export interface BotMatchStart {
  mode: 'bot';
  humanCharacterId: string;
  packChoice: GamePackChoice;
}

interface GameSetupProps {
  onStart: (options: BotMatchStart) => void;
}

export function GameSetup({ onStart }: GameSetupProps) {
  const [phase, setPhase] = useState<GameSetupPhase>('mode');
  const [selected, setSelected] = useState(BASE_PACK.characters[0].id);
  const [packChoice, setPackChoice] = useState<GamePackChoice>('base');

  if (phase === 'mode') {
    return (
      <div
        className="flex h-full min-h-0 flex-1 flex-col items-center justify-center bg-stone-950 px-4"
        data-testid="game-setup"
      >
        <div
          className="mx-auto grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2"
          data-testid="game-mode-select"
          role="group"
          aria-label="Spielmodus"
        >
          <button
            type="button"
            data-testid="game-mode-bot"
            onClick={() => setPhase('bot')}
            className="flex flex-col items-start gap-2 rounded-xl border border-stone-800 bg-stone-900/60 p-4 text-left transition-all hover:border-stone-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Bot className="h-6 w-6 text-emerald-400" aria-hidden />
              <Badge variant="success">Solo</Badge>
            </div>
            <span className="font-brand text-lg uppercase leading-none tracking-wide">
              Gegen Bot
            </span>
            <span className="text-xs text-stone-400">
              KI-Gegner mit zufälligem Charakter — sofort spielbar.
            </span>
          </button>

          <button
            type="button"
            data-testid="game-mode-online"
            onClick={() => setPhase('online')}
            className="flex flex-col items-start gap-2 rounded-xl border border-stone-800 bg-stone-900/60 p-4 text-left transition-all hover:border-stone-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Globe className="h-6 w-6 text-purple-400" aria-hidden />
              <Badge variant="accent">Bald</Badge>
            </div>
            <span className="font-brand text-lg uppercase leading-none tracking-wide">
              Online PvP
            </span>
            <span className="text-xs text-stone-400">
              1 gegen 1 über WebRTC — kommt in Phase 2.
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-full min-h-0 flex-1 flex-col items-center overflow-y-auto bg-stone-950 px-4 py-6 pt-6 sm:pt-10"
      data-testid="game-setup"
    >
      <div className="w-full max-w-3xl space-y-4">
        {phase === 'online' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft className="h-4 w-4" />}
              className="mx-auto text-stone-400 hover:text-stone-200"
              data-testid="game-setup-back"
              onClick={() => setPhase('mode')}
            >
              Modus wählen
            </Button>
            <Panel className="mx-auto max-w-lg space-y-3 text-center" tone="game" data-testid="online-pvp-soon">
              <WifiOff className="mx-auto h-10 w-10 text-stone-500" aria-hidden />
              <h3 className="text-lg font-semibold text-stone-100">Online-Duell noch nicht verfügbar</h3>
              <p className="text-sm text-stone-400">
                Remote 1v1 mit verdeckten Händen ist geplant (WebRTC P2P + Host-Authority). Bis dahin:
                trainiere gegen den Bot.
              </p>
              <Button variant="secondary" className="mx-auto" onClick={() => setPhase('bot')}>
                Zum Bot-Duell
              </Button>
            </Panel>
          </>
        )}

        {phase === 'bot' && (
          <>
            <div className="relative px-2">
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowLeft className="h-4 w-4" />}
                className="absolute left-0 top-0 text-stone-400 hover:text-stone-200"
                data-testid="game-setup-back"
                onClick={() => setPhase('mode')}
              >
                Modus wählen
              </Button>
              <h2 data-testid="character-select-heading" className="text-center">
                <BrandLogoText as="span" glitch className="text-xl sm:text-2xl">
                  Charakterauswahl
                </BrandLogoText>
              </h2>
            </div>

            <Panel className="mx-auto max-w-md space-y-3" tone="game" data-testid="game-pack-select">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-200">
                <Layers className="h-4 w-4 text-purple-400" aria-hidden />
                Kartenset
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="group" aria-label="Kartenset wählen">
                <button
                  type="button"
                  data-testid="game-pack-base"
                  aria-pressed={packChoice === 'base'}
                  onClick={() => setPackChoice('base')}
                  className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                    packChoice === 'base'
                      ? 'border-emerald-500/60 bg-emerald-950/30'
                      : 'border-stone-800 bg-stone-900/40 hover:border-stone-600'
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <Package className="h-4 w-4 text-emerald-400" aria-hidden />
                    {packChoice === 'base' ? <Badge variant="success">Standard</Badge> : null}
                  </div>
                  <span className="text-sm font-semibold text-stone-100">Basis-Pack (V1)</span>
                  <span className="text-xs text-stone-400">70 Karten · 20 Leben</span>
                </button>

                <button
                  type="button"
                  data-testid="game-pack-p100"
                  aria-pressed={packChoice === 'p100'}
                  onClick={() => setPackChoice('p100')}
                  className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                    packChoice === 'p100'
                      ? 'border-purple-500/60 bg-purple-950/30'
                      : 'border-stone-800 bg-stone-900/40 hover:border-stone-600'
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <Layers className="h-4 w-4 text-purple-400" aria-hidden />
                    {packChoice === 'p100' ? <Badge variant="accent">Playtest</Badge> : null}
                  </div>
                  <span className="text-sm font-semibold text-stone-100">V2 P100 Playtest</span>
                  <span className="text-xs text-stone-400">100 Karten · 30 Leben · Phrase</span>
                </button>
              </div>
            </Panel>

            <CharacterCarousel
              characters={BASE_PACK.characters}
              selectedId={selected}
              onSelect={setSelected}
            />

            <div className="-mt-6 mx-auto w-full max-w-md">
              <Button
                variant="ghost"
                className="btn-brand-shimmer w-full text-base"
                data-testid="start-bot-match"
                onClick={() =>
                  onStart({ mode: 'bot', humanCharacterId: selected, packChoice })
                }
              >
                <span className="btn-brand-shimmer__shine" aria-hidden="true" />
                <span className="relative z-10">
                  <BrandLogoText as="span" className="text-base leading-none tracking-wide">
                    Partie starten
                  </BrandLogoText>
                </span>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
