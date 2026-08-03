/**
 * Pre-match setup — mode first, then character carousel (bot) or online notice.
 * Location: src/features/play/setup/GameSetup.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bot,
  Globe,
  Layers,
  Package,
  Settings,
  Sparkles,
  WifiOff,
  AlertTriangle,
} from 'lucide-react';
import {
  BASE_PACK,
  DEFAULT_TIMED_MATCH_MINUTES,
  MAX_TIMED_MATCH_MINUTES,
  MIN_TIMED_MATCH_MINUTES,
  clampTimedMatchMinutes,
} from '../../../game';
import { Button } from '../../../components/ui/Button';
import { BrandLogoText } from '../../../components/ui/BrandLogoText';
import { CharacterCarousel } from './CharacterCarousel';
import { CharacterRandomSpin } from './CharacterRandomSpin';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Panel } from '../../../components/ui/Panel';
import { Input } from '../../../components/ui/Input';
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

export const DEFAULT_SETUP_CHARACTER_ID = BASE_PACK.characters[0].id;

/** Uniform pick from the setup character list; avoids the current id when alternatives exist. */
function pickRandomSetupCharacterId(
  excludeId?: string,
  rng: () => number = Math.random,
): string {
  const list = BASE_PACK.characters;
  if (list.length === 0) return DEFAULT_SETUP_CHARACTER_ID;
  const pool =
    list.length >= 2 && excludeId ? list.filter((c) => c.id !== excludeId) : list;
  const usable = pool.length > 0 ? pool : list;
  return usable[Math.floor(rng() * usable.length)].id;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Initial pack selection — always V5 until PLAYABLE cutover (flag only reveals V6 tile). */
export function defaultPackChoice(_v6Playable?: boolean): GamePackChoice {
  void _v6Playable;
  return 'v5';
}

export interface BotMatchStart {
  mode: 'bot';
  humanCharacterId: string;
  packChoice: GamePackChoice;
  /** V5: artifact auction playtest (default false / off). */
  enableArtifactAuction?: boolean;
  /**
   * Forced starter for createGame / MatchIntro.
   * Omit when neither Spieleinstellungen checkbox is set (initiative default).
   * Solo: human = p1, bot = p2.
   */
  startingPlayer?: 'p1' | 'p2';
  /** Match end: standard (0 LP) or timed wall-clock. Default standard. */
  matchEndMode?: 'standard' | 'timed';
  /** Timed mode duration in minutes (clamped 1–60). Used when matchEndMode is timed. */
  timedMatchMinutes?: number;
}

interface GameSetupProps {
  phase: GameSetupPhase;
  selectedId: string;
  onPhaseChange: (phase: GameSetupPhase) => void;
  onSelectCharacter: (id: string) => void;
  onStart: (options: BotMatchStart) => void;
}

function PackChoiceButton({
  choice,
  active,
  onSelect,
  icon,
  title,
  subtitle,
  badge,
  testId,
  activeClass,
}: {
  choice: GamePackChoice;
  active: boolean;
  onSelect: (c: GamePackChoice) => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  testId: string;
  activeClass: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={active}
      onClick={() => onSelect(choice)}
      className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
        active ? activeClass : 'border-stone-800 bg-stone-900/40 hover:border-stone-600'
      }`}
    >
      <div className="flex w-full items-center justify-between gap-2">
        {icon}
        {badge}
      </div>
      <span className="text-sm font-semibold text-stone-100">{title}</span>
      <span className="text-xs text-stone-400">{subtitle}</span>
    </button>
  );
}

export function GameSetup({
  phase,
  selectedId,
  onPhaseChange,
  onSelectCharacter,
  onStart,
}: GameSetupProps) {
  const { push } = useAppHistory();
  const v6Playable = isV6PlayableEnabled();
  const [packChoice, setPackChoice] = useState<GamePackChoice>(() =>
    defaultPackChoice(isV6PlayableEnabled()),
  );
  const [optInTick, setOptInTick] = useState(0);
  const [artifactAuction, setArtifactAuction] = useState(false);
  const [forceStartPlayer, setForceStartPlayer] = useState(false);
  const [forceStartOpponent, setForceStartOpponent] = useState(false);
  const [matchEndMode, setMatchEndMode] = useState<'standard' | 'timed'>('standard');
  const [timedMinutes, setTimedMinutes] = useState(DEFAULT_TIMED_MATCH_MINUTES);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [legacyOpen, setLegacyOpen] = useState(false);
  const [spinTargetId, setSpinTargetId] = useState<string | null>(null);
  const spinning = spinTargetId !== null;
  const spinLockRef = useRef(false);
  const startMatchAnchorRef = useRef<HTMLDivElement>(null);

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

  const scrollStartMatchIntoView = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        startMatchAnchorRef.current?.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'nearest',
        });
      });
    });
  };

  const startRandomCharacterSpin = () => {
    if (spinLockRef.current || spinning) return;
    const nextId = pickRandomSetupCharacterId(selectedId);
    if (prefersReducedMotion()) {
      selectCharacter(nextId);
      scrollStartMatchIntoView();
      return;
    }
    spinLockRef.current = true;
    setSpinTargetId(nextId);
  };

  const finishRandomCharacterSpin = (characterId: string) => {
    selectCharacter(characterId);
    setSpinTargetId(null);
    spinLockRef.current = false;
    scrollStartMatchIntoView();
  };

  const packLabel =
    packChoice === 'v6'
      ? 'V6 Formel (Standard)'
      : packChoice === 'v5'
        ? 'V5 Formel'
        : packChoice === 'p100'
          ? 'V2 P100 (Legacy)'
          : packChoice === 'v3'
            ? 'V3 (Legacy)'
            : 'Basis V1 (Legacy)';

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

            <div
              className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2"
              data-testid="game-pack-select"
            >
              <Button
                variant="secondary"
                size="sm"
                icon={<Settings className="h-4 w-4" aria-hidden />}
                data-testid="game-setup-settings"
                onClick={() => setSettingsOpen(true)}
              >
                Spieleinstellungen
              </Button>
              <span className="text-xs text-stone-400" data-testid="game-setup-pack-summary">
                Kartenset: {packLabel}
              </span>
            </div>

            {outdatedSummary.hasOutdated ? (
              <div
                className="mx-auto flex max-w-2xl items-start gap-2 px-3 py-2 text-xs text-amber-100/90"
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

            <Modal
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              title="Spieleinstellungen"
              size="sm"
              testId="game-setup-settings-modal"
              dismissible
              footer={
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    type="button"
                    data-testid="game-settings-apply"
                    onClick={() => setSettingsOpen(false)}
                  >
                    Übernehmen
                  </Button>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="space-y-2" data-testid="game-setup-pack-options" role="group" aria-label="Kartenset">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Kartenset
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <PackChoiceButton
                      choice="v5"
                      active={packChoice === 'v5'}
                      onSelect={setPackChoice}
                      testId="game-pack-v5"
                      icon={<Sparkles className="h-4 w-4 text-emerald-400" aria-hidden />}
                      badge={
                        packChoice === 'v5' ? <Badge variant="success">Standard</Badge> : null
                      }
                      title="V5 Formel"
                      subtitle="Play-Default · Formel · Gegenstände · 30 Leben"
                      activeClass="border-emerald-500/60 bg-emerald-950/30"
                    />
                    {v6Playable ? (
                      <PackChoiceButton
                        choice="v6"
                        active={packChoice === 'v6'}
                        onSelect={setPackChoice}
                        testId="game-pack-v6"
                        icon={<Sparkles className="h-4 w-4 text-amber-400" aria-hidden />}
                        badge={
                          packChoice === 'v6' ? <Badge variant="accent">INTERNAL</Badge> : (
                            <Badge variant="default">Opt-in</Badge>
                          )
                        }
                        title="V6 Formel"
                        subtitle="Slice-1 INTERNAL · Rezepte · nicht Play-Default"
                        activeClass="border-amber-500/60 bg-amber-950/30"
                      />
                    ) : null}
                  </div>
                  {v6Playable ? (
                    <p className="text-xs text-stone-500" data-testid="game-setup-v6-flag-hint">
                      V6-Kachel aktiv (Flag). Enable: <code className="text-stone-400">VITE_V6_PLAYABLE=true</code>{' '}
                      oder localStorage <code className="text-stone-400">letz-fetz:v6-playable=1</code>. Standard
                      bleibt V5 bis Cutover. Combo-Art = T+E+K-Komponentenbilder.
                    </p>
                  ) : null}
                  <button
                    type="button"
                    className="text-xs text-stone-400 underline-offset-2 hover:text-stone-200 hover:underline"
                    data-testid="game-setup-legacy-toggle"
                    onClick={() => setLegacyOpen((v) => !v)}
                  >
                    {legacyOpen ? 'Legacy ausblenden' : 'Legacy-Packs (V1 / V2 / V3)'}
                  </button>
                  {legacyOpen ? (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <PackChoiceButton
                        choice="base"
                        active={packChoice === 'base'}
                        onSelect={setPackChoice}
                        testId="game-pack-base"
                        icon={<Package className="h-4 w-4 text-stone-400" aria-hidden />}
                        badge={packChoice === 'base' ? <Badge variant="default">V1</Badge> : null}
                        title="Basis V1"
                        subtitle="Regression · Bound-4"
                        activeClass="border-stone-500/60 bg-stone-900/60"
                      />
                      <PackChoiceButton
                        choice="p100"
                        active={packChoice === 'p100'}
                        onSelect={setPackChoice}
                        testId="game-pack-p100"
                        icon={<Layers className="h-4 w-4 text-purple-400" aria-hidden />}
                        badge={
                          packChoice === 'p100' ? <Badge variant="accent">Playtest</Badge> : null
                        }
                        title="V2 P100"
                        subtitle="Historisch · Phrase"
                        activeClass="border-purple-500/60 bg-purple-950/30"
                      />
                      <PackChoiceButton
                        choice="v3"
                        active={packChoice === 'v3'}
                        onSelect={setPackChoice}
                        testId="game-pack-v3"
                        icon={<Sparkles className="h-4 w-4 text-amber-400" aria-hidden />}
                        badge={<Badge variant="warning">Legacy</Badge>}
                        title="V3 Playtest"
                        subtitle="Soft-Retire · Fetzgerät"
                        activeClass="border-amber-500/60 bg-amber-950/30"
                      />
                    </div>
                  ) : null}
                </div>

                <div
                  data-testid="game-setup-match-mode"
                  role="radiogroup"
                  aria-label="Partie-Ende"
                  className="space-y-2"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Partie-Ende
                  </p>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-stone-200">
                    <input
                      type="radio"
                      name="match-end-mode"
                      className="mt-0.5 h-4 w-4 shrink-0 border-stone-600 bg-stone-800"
                      checked={matchEndMode === 'standard'}
                      onChange={() => setMatchEndMode('standard')}
                      data-testid="game-setup-match-mode-standard"
                    />
                    <span>
                      <span className="font-medium">Standard</span>
                      <span className="mt-0.5 block text-xs text-stone-400">
                        Bis ein Spieler 0 Leben hat
                      </span>
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-stone-200">
                    <input
                      type="radio"
                      name="match-end-mode"
                      className="mt-0.5 h-4 w-4 shrink-0 border-stone-600 bg-stone-800"
                      checked={matchEndMode === 'timed'}
                      onChange={() => setMatchEndMode('timed')}
                      data-testid="game-setup-match-mode-timed"
                    />
                    <span>
                      <span className="font-medium">Zeit</span>
                      <span className="mt-0.5 block text-xs text-stone-400">
                        Nach Ablauf gewinnt, wer mehr Leben hat (Gleichstand = Unentschieden)
                      </span>
                    </span>
                  </label>
                  {matchEndMode === 'timed' ? (
                    <Input
                      label="Minuten"
                      type="number"
                      min={MIN_TIMED_MATCH_MINUTES}
                      max={MAX_TIMED_MATCH_MINUTES}
                      value={timedMinutes}
                      onChange={(e) => {
                        const raw = Number(e.target.value);
                        setTimedMinutes(
                          Number.isFinite(raw)
                            ? clampTimedMatchMinutes(raw)
                            : DEFAULT_TIMED_MATCH_MINUTES,
                        );
                      }}
                      data-testid="game-setup-timed-minutes"
                      className="pl-7"
                    />
                  ) : null}
                </div>

                <label className="flex cursor-pointer items-start gap-3 text-sm text-stone-200">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-600 bg-stone-800"
                    checked={artifactAuction}
                    onChange={(e) => setArtifactAuction(e.target.checked)}
                    data-testid="game-setup-artifact-auction"
                  />
                  <span>
                    <span className="font-medium">Artefakt-Auktion</span>
                    <span className="mt-0.5 block text-xs text-stone-400">
                      Playtest — Flag für Auktion (Engine folgt)
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 text-sm text-stone-200">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-600 bg-stone-800"
                    checked={forceStartPlayer}
                    onChange={(e) => {
                      const on = e.target.checked;
                      setForceStartPlayer(on);
                      if (on) setForceStartOpponent(false);
                    }}
                    data-testid="game-setup-start-player"
                  />
                  <span>
                    <span className="font-medium">Immer Spieler beginnt</span>
                    <span className="mt-0.5 block text-xs text-stone-400">
                      Keine Initiative — du startest die Partie
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 text-sm text-stone-200">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-600 bg-stone-800"
                    checked={forceStartOpponent}
                    onChange={(e) => {
                      const on = e.target.checked;
                      setForceStartOpponent(on);
                      if (on) setForceStartPlayer(false);
                    }}
                    data-testid="game-setup-start-opponent"
                  />
                  <span>
                    <span className="font-medium">Immer Gegner beginnt</span>
                    <span className="mt-0.5 block text-xs text-stone-400">
                      Keine Initiative — der Bot startet die Partie
                    </span>
                  </span>
                </label>
              </div>
            </Modal>

            <div
              className="relative"
              aria-busy={spinning}
              data-testid="game-setup-character-picker"
            >
              <div
                className={spinning ? 'pointer-events-none select-none' : undefined}
                aria-hidden={spinning}
              >
                <CharacterCarousel
                  characters={BASE_PACK.characters}
                  selectedId={selectedId}
                  onSelect={spinning ? () => undefined : selectCharacter}
                  onRandom={startRandomCharacterSpin}
                  randomDisabled={spinning}
                  randomBusy={spinning}
                />
              </div>
              {spinTargetId ? (
                <CharacterRandomSpin
                  characters={BASE_PACK.characters}
                  targetId={spinTargetId}
                  onComplete={finishRandomCharacterSpin}
                />
              ) : null}
            </div>

            <div ref={startMatchAnchorRef} className="-mt-6 mx-auto w-full max-w-md">
              <Button
                variant="accent"
                className="btn-brand-shimmer w-full py-2.5 text-base"
                data-testid="start-bot-match"
                disabled={spinning}
                onClick={() =>
                  onStart({
                    mode: 'bot',
                    humanCharacterId: selectedId,
                    packChoice,
                    enableArtifactAuction: artifactAuction,
                    matchEndMode,
                    ...(matchEndMode === 'timed'
                      ? { timedMatchMinutes: clampTimedMatchMinutes(timedMinutes) }
                      : {}),
                    ...(forceStartPlayer
                      ? { startingPlayer: 'p1' as const }
                      : forceStartOpponent
                        ? { startingPlayer: 'p2' as const }
                        : {}),
                  })
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
