/**
 * Looping card illustration video with poster/image fallback.
 * Idle: baked-seamless MP4 uses native loop; raw AI clips use dual-buffer crossfade.
 * Location: src/components/ui/CardIllustrationLoop.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  resolveCardArtPath,
  resolveCardVideoPath,
  resolveCharacterIdleVideoPath,
} from '../../services/cardArt/manifest';
import { cardVideoPlaybackOffsetSec } from '../../services/cardArt/prompts/cardVideos';
import {
  characterIdleLoopWindow,
  characterIdlePlaybackOffsetSec,
  type CharacterIdleLoopWindow,
} from '../../services/cardArt/prompts/characterIdleVideos';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export type CardIllustrationVariant = 'play' | 'idle';

interface CardIllustrationLoopProps {
  cardId: string;
  variant?: CardIllustrationVariant;
  posterSrc?: string;
  className?: string;
  testId?: string;
}

interface ResolvedLoopWindow {
  start: number;
  end: number;
  crossfade: number;
}

function resolveLoopWindow(
  duration: number,
  config: CharacterIdleLoopWindow | null,
  fallbackStart: number,
): ResolvedLoopWindow {
  const crossfade = config?.crossfade ?? 0.42;
  const start = config?.start ?? fallbackStart ?? 0.12;
  const end = config?.end ?? Math.max(start + 0.5, duration - 0.1);
  return { start, end: Math.min(end, duration - 0.05), crossfade };
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

/** FFmpeg-blended idle clip — single element, native loop. */
function BakedSeamlessVideoLoop({
  src,
  poster,
  className,
  testId,
  onError,
}: {
  src: string;
  poster?: string;
  className: string;
  testId?: string;
  onError: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.playsInline = true;
    el.loop = true;
    el.preload = 'auto';
    el.play().catch(onError);
    return () => el.pause();
  }, [src, onError]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden
      className={className}
      data-testid={testId}
      onError={onError}
    />
  );
}

/** Two stacked videos + eased opacity crossfade before each loop restart. */
function IdleSeamlessVideoLoop({
  src,
  poster,
  className,
  loopConfig,
  fallbackStart,
  testId,
  onError,
}: {
  src: string;
  poster?: string;
  className: string;
  loopConfig: CharacterIdleLoopWindow | null;
  fallbackStart: number;
  testId?: string;
  onError: () => void;
}) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const leadRef = useRef<'a' | 'b'>('a');
  const windowRef = useRef<ResolvedLoopWindow | null>(null);
  const swappingRef = useRef(false);
  const [opacityA, setOpacityA] = useState(1);
  const [opacityB, setOpacityB] = useState(0);

  const frameClass = 'absolute inset-0 h-full w-full object-cover object-center';

  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    const initVideo = (el: HTMLVideoElement) => {
      el.muted = true;
      el.playsInline = true;
      el.loop = false;
      el.preload = 'auto';
    };
    initVideo(a);
    initVideo(b);

    const primeAtStart = (el: HTMLVideoElement, win: ResolvedLoopWindow) => {
      el.currentTime = win.start;
    };

    const onMeta = (lead: HTMLVideoElement) => {
      if (!Number.isFinite(lead.duration) || lead.duration <= 0) return;
      windowRef.current = resolveLoopWindow(lead.duration, loopConfig, fallbackStart);
      const win = windowRef.current;
      primeAtStart(a, win);
      primeAtStart(b, win);
      a.play().catch(onError);
    };

    const onMetaA = () => {
      if (leadRef.current === 'a') onMeta(a);
    };
    const onMetaB = () => {
      if (leadRef.current === 'b') onMeta(b);
    };

    a.addEventListener('loadedmetadata', onMetaA);
    b.addEventListener('loadedmetadata', onMetaB);
    if (a.readyState >= 1 && leadRef.current === 'a') onMeta(a);

    let rafId = 0;

    const runCrossfade = (from: 'a' | 'b', to: 'a' | 'b', win: ResolvedLoopWindow) => {
      const fromEl = from === 'a' ? a : b;
      const toEl = to === 'a' ? a : b;
      swappingRef.current = true;

      const startFade = () => {
        toEl.play().catch(onError);
        const t0 = performance.now();
        const durationMs = win.crossfade * 1000;

        const fade = (now: number) => {
          const raw = Math.min(1, (now - t0) / durationMs);
          const t = easeInOut(raw);
          if (from === 'a') {
            setOpacityA(1 - t);
            setOpacityB(t);
          } else {
            setOpacityB(1 - t);
            setOpacityA(t);
          }
          if (raw < 1) {
            rafId = requestAnimationFrame(fade);
            return;
          }
          fromEl.pause();
          primeAtStart(fromEl, win);
          leadRef.current = to;
          swappingRef.current = false;
        };
        rafId = requestAnimationFrame(fade);
      };

      primeAtStart(toEl, win);
      if (toEl.seeking) {
        toEl.addEventListener('seeked', () => startFade(), { once: true });
      } else {
        startFade();
      }
    };

    const tick = () => {
      const win = windowRef.current;
      if (!win || swappingRef.current) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const lead = leadRef.current === 'a' ? a : b;
      if (lead.readyState >= 2 && lead.currentTime >= win.end - win.crossfade) {
        const follower = leadRef.current === 'a' ? 'b' : 'a';
        runCrossfade(leadRef.current, follower, win);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      a.removeEventListener('loadedmetadata', onMetaA);
      b.removeEventListener('loadedmetadata', onMetaB);
      a.pause();
      b.pause();
    };
  }, [src, loopConfig, fallbackStart, onError]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <video
        ref={videoARef}
        src={src}
        poster={poster}
        autoPlay
        muted
        playsInline
        aria-hidden
        className={frameClass}
        style={{ opacity: opacityA, transition: 'none' }}
        data-testid={testId}
        onError={onError}
      />
      <video
        ref={videoBRef}
        src={src}
        poster={poster}
        muted
        playsInline
        aria-hidden
        className={frameClass}
        style={{ opacity: opacityB, transition: 'none' }}
        onError={onError}
      />
    </div>
  );
}

export function CardIllustrationLoop({
  cardId,
  variant = 'play',
  posterSrc,
  className = '',
  testId,
}: CardIllustrationLoopProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const videoSrc =
    variant === 'idle' ? resolveCharacterIdleVideoPath(cardId) : resolveCardVideoPath(cardId);
  const poster = posterSrc || resolveCardArtPath(cardId);
  const showVideo = Boolean(videoSrc) && !videoFailed && !reduceMotion;

  const playbackOffset =
    variant === 'idle'
      ? characterIdlePlaybackOffsetSec(cardId)
      : cardVideoPlaybackOffsetSec(cardId);

  const idleLoopConfig = variant === 'idle' ? characterIdleLoopWindow(cardId) : null;
  const useBakedIdle =
    variant === 'idle' && isCharacterIdleWithVideo(cardId) && idleLoopConfig?.bakedSeamless;
  const useDualCrossfadeIdle =
    variant === 'idle' && isCharacterIdleWithVideo(cardId) && !idleLoopConfig?.bakedSeamless;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!showVideo || useBakedIdle || useDualCrossfadeIdle) return;
    const el = videoRef.current;
    if (!el) return;

    const seekToLoopStart = () => {
      const start = idleLoopConfig?.start ?? playbackOffset;
      if (start <= 0) return;
      if (!Number.isFinite(el.duration) || el.duration <= start) return;
      el.currentTime = start;
    };

    const onLoadedMetadata = () => {
      if (idleLoopConfig) {
        el.currentTime = idleLoopConfig.start;
      } else {
        seekToLoopStart();
      }
    };

    const onTimeUpdate = () => {
      if (el.seeking) return;
      if (idleLoopConfig && el.currentTime >= idleLoopConfig.end) {
        el.currentTime = idleLoopConfig.start;
        return;
      }
      if (!idleLoopConfig && playbackOffset > 0 && el.currentTime < 0.12) {
        seekToLoopStart();
      }
    };

    el.addEventListener('loadedmetadata', onLoadedMetadata);
    el.addEventListener('timeupdate', onTimeUpdate);
    if (el.readyState >= 1) onLoadedMetadata();
    el.play().catch(() => setVideoFailed(true));

    return () => {
      el.removeEventListener('loadedmetadata', onLoadedMetadata);
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.pause();
    };
  }, [showVideo, useBakedIdle, useDualCrossfadeIdle, cardId, playbackOffset, idleLoopConfig]);

  if (showVideo && useBakedIdle) {
    return (
      <BakedSeamlessVideoLoop
        src={videoSrc}
        poster={poster || undefined}
        className={className}
        testId={testId}
        onError={() => setVideoFailed(true)}
      />
    );
  }

  if (showVideo && useDualCrossfadeIdle) {
    return (
      <IdleSeamlessVideoLoop
        src={videoSrc}
        poster={poster || undefined}
        className={className}
        loopConfig={idleLoopConfig}
        fallbackStart={playbackOffset}
        testId={testId}
        onError={() => setVideoFailed(true)}
      />
    );
  }

  if (showVideo) {
    return (
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster || undefined}
        autoPlay
        loop={!idleLoopConfig}
        muted
        playsInline
        aria-hidden
        className={className}
        data-testid={testId}
        onError={() => setVideoFailed(true)}
      />
    );
  }

  return (
    <ImageWithFallback
      src={poster}
      alt=""
      aria-hidden
      className={className}
      loading="lazy"
      data-testid={testId}
    />
  );
}

function isCharacterIdleWithVideo(cardId: string): boolean {
  return Boolean(resolveCharacterIdleVideoPath(cardId));
}
