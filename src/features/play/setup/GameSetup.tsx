/**
 * Pre-match setup — mode first, then character carousel (bot) or online notice.
 * Location: src/features/play/setup/GameSetup.tsx
 */
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bot, Globe, Layers, Package, Sparkles, WifiOff, AlertTriangle } from 'lucide-react';
import { BASE_PACK } from '../../../game';
import { Button } from '../../../components/ui/Button';
import { BrandLogoText } from '../../../components/ui/BrandLogoText';
import { CharacterCarousel } from './CharacterCarousel';
import { Badge } from '../../../components/ui/Badge';
import { Panel } from '../../../components/ui/Panel';
import { useAppHistory } from '../../../services/history/AppHistoryContext';
import { MenuGlitchBackdrop } from '../../../components/ui/MenuGlitchBackdrop';
import type { GamePackChoice } from './resolveGamePackChoice';
import { isV6PlayableEnabled } from './v6PlayableFlag';
import {
  FORMULA_PLAY_OPTIN_UPDATED_EVENT,
  loadFormulaPlayOptInStore,
  summarizeOutdatedOptIns,
} from '../../../services/storage/formulaPlayOptIn';
import { createFormulaPlayVersionResolvers } from '../../../services/storage/formulaPlayVersions';

export type GameSetupMode = 'bot' | 'online';
export type GameSetupPhase = 'mode' | 'bot' | 'online';
export type { GamePackChoice };

export interface BotMatchStart {
  mode: 'bot';
  humanCharacterId: string;
  packChoice: GamePackChoice;
}

interface GameSetupProps {
  phase: GameSetupPhase;
  selectedId: string;
  onPhaseChange: (phase: GameSetupPhase) => void;
  onSelectCharacter: (id: string) => void;
  onStart: (options: BotMatchStart) => void;
}

export function GameSetup({
  phase,
  selectedId,
  onPhaseChange,
  onSelectCharacter,
  onStart,
}: GameSetupProps) {
  const { push } = useAppHistory();
  const [packChoice, setPackChoice] = useState<GamePackChoice>('v5');
  const [optInTick, setOptInTick] = useState(0);
  const v6Playable = isV6PlayableEnabled();

  useEffect(() => {
    const refresh = () => setOptInTick((n) => n + 1);
    window.addEventListener(FORMULA_PLAY_OPTIN_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(FORMULA_PLAY_OPTIN_UPDATED_EVENT, refresh);
  }, []);

  void optInTick;

  const outdatedSummary =
    packChoice === 'v5'
      ? (() => {
          const store = loadFormulaPlayOptInStore();
          return summarizeOutdatedOptIns({
            deckOptIns: store.deckOptIns,
            activatedRecipes: store.activatedRecipes,
            ...createFormulaPlayVersionResolvers(),
          });
        })()
      : { outdatedDeckCount: 0, outdatedRecipeCount: 0, hasOutdated: false };

  const goPhase = (next: GameSetupPhase) => {
    if (next === phase) return;
    const from = phase;
    push({
      undo: () => onPhaseChange(from),
      redo: () => onPhaseChange(next),
    });
    onPhaseChange(next);
  };

  const selectCharacter = (id: string) => {
    if (id === selectedId) return;
    const from = selectedId;
    push({
      undo: () => onSelectCharacter(from),
      redo: () => onSelectCharacter(id),
    });
    onSelectCharacter(id);
  };

  if (phase === 'mode') {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center bg-stone-950/95 backdrop-blur-md"
        data-testid="game-setup"
      >
        <MenuGlitchBackdrop />
        <div
          className="relative z-10 grid w-full max-w-2xl grid-cols-1 gap-4 px-6 sm:grid-cols-2 sm:gap-5 sm:px-8"
          data-testid="game-mode-select"
          role="group"
          aria-label="Spielmodus"
        >
          <button
            type="button"
            data-testid="game-mode-bot"
            onClick={() => goPhase('bot')}
            className="flex flex-col items-start gap-2 rounded-xl border border-stone-700/80 bg-stone-900/80 p-5 text-left text-stone-100 transition-all hover:border-emerald-500/50 hover:bg-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Bot className="h-6 w-6 text-emerald-400" aria-hidden />
              <Badge variant="success">Solo</Badge>
            </div>
            <span className="font-brand-on-dark text-lg uppercase leading-none tracking-wide">
              Gegen Bot
            </span>
            <span className="text-xs text-stone-400">
              KI-Gegner mit zufälligem Charakter — sofort spielbar.
            </span>
          </button>

          <button
            type="button"
            data-testid="game-mode-online"
            onClick={() => goPhase('online')}
            className="flex flex-col items-start gap-2 rounded-xl border border-stone-700/80 bg-stone-900/80 p-5 text-left text-stone-100 transition-all hover:border-purple-500/50 hover:bg-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Globe className="h-6 w-6 text-purple-400" aria-hidden />
              <Badge variant="accent" className="normal-case tracking-wide">
                Coming soon
              </Badge>
            </div>
            <span className="font-brand-on-dark text-lg uppercase leading-none tracking-wide">
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
      className="absolute inset-0 flex flex-col items-center overflow-y-auto bg-stone-950/95 px-4 py-6 pt-6 backdrop-blur-md sm:pt-10"
      data-testid="game-setup"
    >
      <MenuGlitchBackdrop />
      <div className="relative z-10 w-full max-w-3xl space-y-4">
        {phase === 'online' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft className="h-4 w-4" />}
              className="mx-auto text-stone-400 hover:text-stone-200"
              data-testid="game-setup-back"
              onClick={() => goPhase('mode')}
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
              <Button variant="secondary" className="mx-auto" onClick={() => goPhase('bot')}>
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
                onClick={() => goPhase('mode')}
              >
                Modus wählen
              </Button>
              <h2 data-testid="character-select-heading" className="text-center">
                <BrandLogoText as="span" glitch className="text-xl sm:text-2xl">
                  Charakterauswahl
                </BrandLogoText>
              </h2>
            </div>

            <Panel className="mx-auto max-w-2xl space-y-3" tone="game" data-testid="game-pack-select">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-200">
                <Layers className="h-4 w-4 text-purple-400" aria-hidden />
                Kartenset
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label="Kartenset wählen">
                <button
                  type="button"
                  data-testid="game-pack-v5"
                  aria-pressed={packChoice === 'v5'}
                  onClick={() => setPackChoice('v5')}
                  className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                    packChoice === 'v5'
                      ? 'border-emerald-500/60 bg-emerald-950/30'
                      : 'border-stone-800 bg-stone-900/40 hover:border-stone-600'
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" aria-hidden />
                    {packChoice === 'v5' ? <Badge variant="success">Standard</Badge> : null}
                  </div>
                  <span className="text-sm font-semibold text-stone-100">V5 Formel</span>
                  <span className="text-xs text-stone-400">
                    12+12+12 Formel · Gegenstände · 20 Leben
                  </span>
                </button>

                {v6Playable ? (
                  <button
                    type="button"
                    data-testid="game-pack-v6"
                    aria-pressed={packChoice === 'v6'}
                    onClick={() => setPackChoice('v6')}
                    className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                      packChoice === 'v6'
                        ? 'border-amber-500/60 bg-amber-950/30'
                        : 'border-stone-800 bg-stone-900/40 hover:border-stone-600'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <Sparkles className="h-4 w-4 text-amber-400" aria-hidden />
                      {packChoice === 'v6' ? <Badge variant="accent">INTERNAL</Badge> : null}
                    </div>
                    <span className="text-sm font-semibold text-stone-100">V6 Slice-1</span>
                    <span className="text-xs text-stone-400">
                      Playtest · 3×3×4 Formelkern · 30 Leben (Flag)
                    </span>
                  </button>
                ) : null}

                <button
                  type="button"
                  data-testid="game-pack-base"
                  aria-pressed={packChoice === 'base'}
                  onClick={() => setPackChoice('base')}
                  className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                    packChoice === 'base'
                      ? 'border-stone-500/60 bg-stone-900/60'
                      : 'border-stone-800 bg-stone-900/40 hover:border-stone-600'
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <Package className="h-4 w-4 text-stone-400" aria-hidden />
                    {packChoice === 'base' ? <Badge variant="default">V1</Badge> : null}
                  </div>
                  <span className="text-sm font-semibold text-stone-100">Basis-Pack (V1)</span>
                  <span className="text-xs text-stone-400">Regression · Bound-4 · 20 Leben</span>
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
                  <span className="text-xs text-stone-400">Historisch · Phrase · 30 Leben</span>
                </button>

                <button
                  type="button"
                  data-testid="game-pack-v3"
                  aria-pressed={packChoice === 'v3'}
                  onClick={() => setPackChoice('v3')}
                  className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                    packChoice === 'v3'
                      ? 'border-amber-500/60 bg-amber-950/30'
                      : 'border-stone-800 bg-stone-900/40 hover:border-stone-600'
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400" aria-hidden />
                    <Badge variant="warning">Legacy</Badge>
                  </div>
                  <span className="text-sm font-semibold text-stone-100">V3 Playtest</span>
                  <span className="text-xs text-stone-400">
                    Soft-Retire · Fetzgerät-3D · Bound-Slots
                  </span>
                </button>
              </div>
              {outdatedSummary.hasOutdated ? (
                <div
                  className="flex items-start gap-2 rounded-lg border border-amber-700/50 bg-amber-950/30 px-3 py-2 text-xs text-amber-100/90"
                  data-testid="game-setup-formula-outdated-warning"
                  role="status"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
                  <p>
                    {outdatedSummary.outdatedDeckCount > 0 && outdatedSummary.outdatedRecipeCount > 0
                      ? `${outdatedSummary.outdatedDeckCount} Spieldeck-Einträge und ${outdatedSummary.outdatedRecipeCount} Feld-Rezepte sind OUTDATED — in Material → Formeln erneut hinzufügen oder aktivieren.`
                      : outdatedSummary.outdatedDeckCount > 0
                        ? `${outdatedSummary.outdatedDeckCount} Spieldeck-Einträge sind OUTDATED — in Material → Formeln erneut zum Spieldeck hinzufügen.`
                        : `${outdatedSummary.outdatedRecipeCount} Feld-Rezepte sind OUTDATED — in Material → Formeln erneut aktivieren.`}
                  </p>
                </div>
              ) : null}
            </Panel>

            <CharacterCarousel
              characters={BASE_PACK.characters}
              selectedId={selectedId}
              onSelect={selectCharacter}
            />

            <div className="-mt-6 mx-auto w-full max-w-md">
              <Button
                variant="accent"
                className="btn-brand-shimmer w-full py-2.5 text-base"
                data-testid="start-bot-match"
                onClick={() =>
                  onStart({ mode: 'bot', humanCharacterId: selectedId, packChoice })
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

export const DEFAULT_SETUP_CHARACTER_ID = BASE_PACK.characters[0].id;
