/**
 * Pregame intro: VS → clash → initiative W6 → winner → arena reveal with effects.
 * Location: src/features/play/setup/MatchIntro.tsx
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ContentPack, PlayerId } from '../../../game';
import { rollD6, resolveInitiative, startingPlayerFromInitiative } from '../../../game';
import { CharacterSelectCard } from './CharacterSelectCard';
import { CharacterPreviewWithDetails } from './CharacterPreviewWithDetails';
import { GameCharacterCard } from './GameCharacterCard';
import { arenaDefToCardProps } from '../../../components/cards/characterCardProps';
import { resolveCardArtPath, resolveCardVideoPath } from '../../../services/cardArt/manifest';
import { Button } from '../../../components/ui/Button';
import { BrandLogoText } from '../../../components/ui/BrandLogoText';
import { W6Die3D, W6_DIE_ROLL_MS } from '../../../components/game/W6Die3D';
import { prefersReducedMotion } from '../../../components/game/presentation/prefersReducedMotion';
import {
  CLASH_IMPACT_FRACTION,
  playClashSoundAt,
  preloadClashSound,
} from '../services/audio/clashSound';

type IntroPhase = 'vs' | 'crash' | 'initiative' | 'winner' | 'arena';

export const CRASH_MS = 800;
/** Visual collision frame — linear easing so % == wall-clock. */
export const CLASH_SOUND_DELAY_MS = Math.round(CRASH_MS * CLASH_IMPACT_FRACTION);
const TIE_REROLL_MS = 900;
const WINNER_HOLD_MS = 2200;

interface MatchIntroProps {
  pack: ContentPack;
  humanCharacterId: string;
  botCharacterId: string;
  arenaId: string;
  arenaName?: string;
  d6Variant: number | null;
  /** Called once when initiative is decided (before arena reveal). */
  onInitiativeResolved: (startingPlayer: PlayerId) => void;
  onContinue: () => void;
}

function cardOutcomeClass(side: PlayerId, winnerId: PlayerId | null): string {
  if (!winnerId) return 'intro-char-card';
  if (side === winnerId) return 'intro-char-card intro-char-card--win';
  return 'intro-char-card intro-char-card--lose';
}

export function MatchIntro({
  pack,
  humanCharacterId,
  botCharacterId,
  arenaId,
  arenaName,
  d6Variant,
  onInitiativeResolved,
  onContinue,
}: MatchIntroProps) {
  const [phase, setPhase] = useState<IntroPhase>('vs');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [humanRoll, setHumanRoll] = useState(1);
  const [botRoll, setBotRoll] = useState(1);
  const [rollKey, setRollKey] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [statusText, setStatusText] = useState('Wer fängt an?');
  const [winnerId, setWinnerId] = useState<PlayerId | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const initiativeDoneRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearInitiativeTimers = useCallback(() => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearInitiativeTimers(), [clearInitiativeTimers]);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  const humanChar = pack.characters.find((c) => c.id === humanCharacterId);
  const botChar = pack.characters.find((c) => c.id === botCharacterId);
  const arenaDef = pack.arenas.find((a) => a.id === arenaId);
  const videoSrc = resolveCardVideoPath(arenaId);
  const posterSrc = resolveCardArtPath(arenaId);
  const showVideo = Boolean(videoSrc) && !reduceMotion && !videoFailed;
  const variantText =
    d6Variant != null && arenaDef?.d6Variants ? arenaDef.d6Variants[d6Variant] : null;

  const goToArena = useCallback(() => {
    setPhase('arena');
  }, []);

  const showWinnerThenContinue = useCallback(
    (starter: PlayerId) => {
      const name =
        starter === 'p1' ? humanChar?.name ?? 'Du' : botChar?.name ?? 'Gegner';
      setStatusText(`${name} beginnt`);
      setPhase('winner');
      if (!initiativeDoneRef.current) {
        initiativeDoneRef.current = true;
        onInitiativeResolved(starter);
      }
      schedule(() => goToArena(), prefersReducedMotion() ? 400 : WINNER_HOLD_MS);
    },
    [botChar?.name, goToArena, humanChar?.name, onInitiativeResolved, schedule],
  );

  const runInitiativeRoll = useCallback(() => {
    const h = rollD6();
    const b = rollD6();
    setHumanRoll(h);
    setBotRoll(b);
    setRollKey((k) => k + 1);
    setRolling(true);
    setWinnerId(null);
    setPhase('initiative');
    setStatusText('Würfel fallen…');

    const delay = prefersReducedMotion() ? 0 : W6_DIE_ROLL_MS;
    schedule(() => {
      const result = resolveInitiative(h, b);
      if (result.outcome === 'tie') {
        // Land without a winner, then re-roll.
        setRolling(false);
        setStatusText('Unentschieden — nochmal!');
        schedule(() => runInitiativeRoll(), prefersReducedMotion() ? 200 : TIE_REROLL_MS);
        return;
      }
      const starter = startingPlayerFromInitiative(result)!;
      // Same frame: stop roll (settle) + green die + card scale.
      setRolling(false);
      setWinnerId(starter);
      showWinnerThenContinue(starter);
    }, delay);
  }, [schedule, showWinnerThenContinue]);

  const startPregame = useCallback(() => {
    clearInitiativeTimers();
    initiativeDoneRef.current = false;
    setWinnerId(null);
    if (reduceMotion || prefersReducedMotion()) {
      void preloadClashSound();
      runInitiativeRoll();
      return;
    }

    // Decode during this gesture; start crash CSS immediately, then schedule
    // the gong from the first painted crash frame (avoids setState paint lag).
    void preloadClashSound();
    setPhase('crash');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        playClashSoundAt(CLASH_SOUND_DELAY_MS / 1000);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          window.setTimeout(() => navigator.vibrate?.(12), CLASH_SOUND_DELAY_MS);
        }
      });
    });
    schedule(() => runInitiativeRoll(), CRASH_MS);
  }, [clearInitiativeTimers, reduceMotion, runInitiativeRoll, schedule]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (phase !== 'arena' || !showVideo) return;
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.volume = 0.85;
    el.play().catch(() => setVideoFailed(true));
    return () => {
      el.pause();
    };
  }, [phase, showVideo]);

  const showVsLayout = phase === 'vs' || phase === 'crash';
  const isCrash = phase === 'crash';
  const showDuel = phase === 'initiative' || phase === 'winner';
  const resolved = winnerId != null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-950/95 px-4 pb-8 pt-6 backdrop-blur-sm sm:pt-10"
      data-testid="match-intro"
      role="dialog"
      aria-labelledby="match-intro-title"
      aria-busy={isCrash || phase === 'initiative' || phase === 'winner'}
    >
      <div className="w-full max-w-4xl text-center">
        {showDuel ? (
          <div
            data-testid={resolved ? 'match-intro-winner' : 'match-intro-initiative'}
            className="py-4"
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              Initiative
            </p>
            <h2 id="match-intro-title" className="mb-2 text-xl font-black text-stone-100 sm:text-2xl">
              {resolved ? statusText : 'Wer fängt an?'}
            </h2>
            <p className="mb-5 text-sm text-stone-300" data-testid="initiative-status">
              {statusText}
            </p>

            <div className="relative mb-2 flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-center sm:gap-8 lg:gap-12">
              {humanChar && (
                <div
                  className={`flex w-[min(100%,240px)] flex-col items-center gap-3 sm:w-[220px] md:w-[240px] ${cardOutcomeClass('p1', winnerId)}`}
                  data-testid="initiative-side-p1"
                >
                  <CharacterSelectCard
                    character={humanChar}
                    isCenter={!resolved || winnerId === 'p1'}
                    interactive={false}
                    selected={winnerId === 'p1'}
                    className="intro-char-card__inner w-full max-w-none"
                  />
                  <W6Die3D
                    value={humanRoll}
                    label="Du"
                    rolling={rolling}
                    rollKey={rollKey}
                    outcome={resolved ? (winnerId === 'p1' ? 'win' : 'lose') : null}
                  />
                </div>
              )}

              <div
                className={`flex shrink-0 items-center justify-center transition-opacity ${
                  resolved ? 'opacity-40' : 'opacity-100'
                }`}
                aria-hidden
              >
                <span className="match-intro-vs-text text-lg uppercase leading-none tracking-[0.2em] sm:text-xl">
                  VS
                </span>
              </div>

              {botChar && (
                <div
                  className={`flex w-[min(100%,240px)] flex-col items-center gap-3 sm:w-[220px] md:w-[240px] ${cardOutcomeClass('p2', winnerId)}`}
                  data-testid="initiative-side-p2"
                >
                  <CharacterSelectCard
                    character={botChar}
                    isCenter={!resolved || winnerId === 'p2'}
                    interactive={false}
                    selected={winnerId === 'p2'}
                    className="intro-char-card__inner w-full max-w-none"
                  />
                  <W6Die3D
                    value={botRoll}
                    label="Gegner"
                    rolling={rolling}
                    rollKey={rollKey}
                    outcome={resolved ? (winnerId === 'p2' ? 'win' : 'lose') : null}
                  />
                </div>
              )}
            </div>
          </div>
        ) : showVsLayout ? (
          <div
            data-testid={isCrash ? 'match-intro-crash' : 'match-intro-vs'}
            className={isCrash ? 'intro-screen-shake' : undefined}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-purple-400">
              Duell beginnt
            </p>
            <h2 id="match-intro-title" className="mb-4 text-xl font-black text-stone-100 sm:text-2xl">
              Bereit für die Arena?
            </h2>

            <div className="relative mb-5 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
              {humanChar && (
                <div className={isCrash ? 'intro-crash-left' : undefined}>
                  {isCrash ? (
                    <CharacterSelectCard character={humanChar} isCenter interactive={false} selected />
                  ) : (
                    <CharacterPreviewWithDetails character={humanChar} selected />
                  )}
                </div>
              )}

              <div
                className={`match-intro-vs transition-opacity ${isCrash ? 'opacity-0' : 'opacity-100'}`}
                aria-hidden
              >
                <span className="match-intro-vs-text uppercase leading-none tracking-[0.2em]">
                  VS
                </span>
              </div>

              {botChar && (
                <div className={isCrash ? 'intro-crash-right' : undefined}>
                  {isCrash ? (
                    <CharacterSelectCard character={botChar} isCenter interactive={false} />
                  ) : (
                    <CharacterPreviewWithDetails character={botChar} />
                  )}
                </div>
              )}

              {isCrash && (
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  aria-hidden
                >
                  <div className="intro-crash-flash h-24 w-24 rounded-full bg-amber-400/40 blur-2xl" />
                </div>
              )}
            </div>

            {phase === 'vs' && (
              <Button
                variant="accent"
                className="btn-brand-pulse min-w-[220px] py-2.5 text-base"
                onClick={startPregame}
              >
                <BrandLogoText as="span" className="text-base leading-none tracking-wide">
                  Letz Fetz
                </BrandLogoText>
              </Button>
            )}
          </div>
        ) : (
          <div data-testid="match-intro-arena" className="mx-auto max-w-lg">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              Stage Reveal
            </p>
            <h2 id="match-intro-title" className="mb-4 text-2xl font-black text-stone-100 sm:text-3xl">
              {arenaName ?? arenaDef?.name ?? 'Arena'}
            </h2>

            <div className="relative overflow-hidden rounded-xl border-2 border-purple-500/40 shadow-2xl shadow-purple-950/50">
              {showVideo ? (
                <video
                  ref={videoRef}
                  className="aspect-video w-full object-cover"
                  src={videoSrc}
                  poster={posterSrc || undefined}
                  loop
                  playsInline
                  data-testid="arena-teaser-video"
                  onError={() => setVideoFailed(true)}
                />
              ) : arenaDef ? (
                <div className="flex justify-center bg-stone-900 p-4" data-testid="arena-teaser-fallback">
                  <GameCharacterCard {...arenaDefToCardProps(arenaDef)} size="lg" />
                </div>
              ) : null}
            </div>

            {arenaDef && (
              <div
                className="mt-4 space-y-3 rounded-xl border border-stone-700 bg-stone-900/80 px-4 py-3 text-left"
                data-testid="arena-intro-effects"
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                    Grund
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-stone-200">{arenaDef.baseEffect}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                    Trigger
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-stone-200">{arenaDef.trigger}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                    Sonder
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-stone-200">{arenaDef.specialRule}</p>
                </div>
                {variantText ? (
                  <div data-testid="arena-mutation">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500/80">
                      W6-Variante
                    </p>
                    <p className="mt-0.5 text-sm font-semibold leading-snug text-amber-300">
                      {variantText}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-stone-500" data-testid="arena-mutation">
                    Keine W6-Variante
                  </p>
                )}
              </div>
            )}

            <Button
              variant="secondary"
              className="mt-4 w-full"
              aria-label="Intro überspringen"
              onClick={onContinue}
            >
              Weiter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
