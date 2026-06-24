/**
 * Pregame intro: VS → card crash → arena video teaser (auto after crash).
 * Location: src/components/game/MatchIntro.tsx
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ContentPack } from '../../game';
import { CharacterSelectCard } from './CharacterSelectCard';
import { GameCharacterCard } from './GameCharacterCard';
import { arenaDefToForgeProps } from '../cards/characterCardProps';
import { resolveCardArtPath, resolveCardVideoPath } from '../../services/cardArt/manifest';
import { Button } from '../ui/Button';

type IntroPhase = 'vs' | 'crash' | 'arena';

const CRASH_MS = 800;
/** Sound fires at visual impact (~50 % of crash — flash peak ~70 %, cards meet ~85 %). */
const CLASH_SOUND_DELAY_MS = Math.round(CRASH_MS * 0.5);
const CLASH_SOUND = '/sounds/card-clash.mp3';

interface MatchIntroProps {
  pack: ContentPack;
  humanCharacterId: string;
  botCharacterId: string;
  arenaId: string;
  arenaName?: string;
  d6Variant: number | null;
  onContinue: () => void;
}

function playClashSound() {
  const audio = new Audio(CLASH_SOUND);
  audio.volume = 0.75;
  audio.play().catch(() => {
    /* graceful silence if asset missing or blocked */
  });
}

export function MatchIntro({
  pack,
  humanCharacterId,
  botCharacterId,
  arenaId,
  arenaName,
  d6Variant,
  onContinue,
}: MatchIntroProps) {
  const [phase, setPhase] = useState<IntroPhase>('vs');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clashSoundPlayedRef = useRef(false);

  const humanChar = pack.characters.find((c) => c.id === humanCharacterId);
  const botChar = pack.characters.find((c) => c.id === botCharacterId);
  const arenaDef = pack.arenas.find((a) => a.id === arenaId);
  const videoSrc = resolveCardVideoPath(arenaId);
  const posterSrc = resolveCardArtPath(arenaId);
  const showVideo = Boolean(videoSrc) && !reduceMotion && !videoFailed;

  const goToArena = useCallback(() => {
    setPhase('arena');
  }, []);

  const startPregame = useCallback(() => {
    if (reduceMotion) {
      goToArena();
      return;
    }
    setPhase('crash');
  }, [reduceMotion, goToArena]);

  useEffect(() => {
    if (phase !== 'crash' || reduceMotion) return;

    clashSoundPlayedRef.current = false;
    const soundTimer = window.setTimeout(() => {
      if (clashSoundPlayedRef.current) return;
      clashSoundPlayedRef.current = true;
      playClashSound();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(12);
      }
    }, CLASH_SOUND_DELAY_MS);

    return () => window.clearTimeout(soundTimer);
  }, [phase, reduceMotion]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (phase !== 'crash') return;
    const timer = window.setTimeout(goToArena, CRASH_MS);
    return () => window.clearTimeout(timer);
  }, [phase, goToArena]);

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

  return (
    <div
      className="absolute inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-950/95 px-4 pb-8 pt-6 backdrop-blur-sm sm:pt-10"
      data-testid="match-intro"
      role="dialog"
      aria-labelledby="match-intro-title"
      aria-busy={isCrash}
    >
      <div className="w-full max-w-4xl text-center">
        {showVsLayout ? (
          <div
            data-testid={isCrash ? 'match-intro-crash' : 'match-intro-vs'}
            className={isCrash ? 'intro-screen-shake' : undefined}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-purple-400">
              Duell beginnt
            </p>
            <h2 id="match-intro-title" className="mb-4 text-xl font-black text-stone-100 sm:text-2xl">
              ⚔️ Bereit für die Arena?
            </h2>

            <div className="relative mb-5 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
              {humanChar && (
                <div className={`flex flex-col items-center ${isCrash ? 'intro-crash-left' : ''}`}>
                  <CharacterSelectCard character={humanChar} isCenter interactive={false} selected />
                </div>
              )}

              <div
                className={`text-3xl font-black text-purple-500 transition-opacity sm:text-4xl ${isCrash ? 'opacity-0' : 'opacity-100'}`}
              >
                VS
              </div>

              {botChar && (
                <div className={`flex flex-col items-center ${isCrash ? 'intro-crash-right' : ''}`}>
                  <CharacterSelectCard character={botChar} isCenter interactive={false} />
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
              <Button variant="accent" className="min-w-[220px] text-base" onClick={startPregame}>
                Letz Fetz
              </Button>
            )}
          </div>
        ) : (
          <div data-testid="match-intro-arena">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              Stage Reveal
            </p>
            <h2 className="mb-4 text-2xl font-black text-stone-100 sm:text-3xl">
              🏟️ {arenaName ?? 'Arena'}
            </h2>

            <div className="relative mx-auto max-w-lg overflow-hidden rounded-xl border-2 border-purple-500/40 shadow-2xl shadow-purple-950/50">
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
                  <GameCharacterCard {...arenaDefToForgeProps(arenaDef)} size="lg" />
                </div>
              ) : null}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/95 via-stone-950/70 to-transparent px-4 pb-3 pt-10">
                {d6Variant != null ? (
                  <p className="mb-3 text-sm font-semibold text-amber-300" data-testid="arena-mutation">
                    W6-Variante: {d6Variant}
                  </p>
                ) : (
                  <p className="mb-3 text-sm text-stone-400">Keine W6-Variante</p>
                )}
                <Button
                  variant="secondary"
                  className="w-full"
                  aria-label="Intro überspringen"
                  onClick={onContinue}
                >
                  Überspringen
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
