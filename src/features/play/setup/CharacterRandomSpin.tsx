/**
 * Horizontal slot-machine reel overlay for Zufällig character pick.
 * Location: src/features/play/setup/CharacterRandomSpin.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import type { CharacterCardDef } from '../../../game';
import { resolveCardArtPath } from '../../../services/cardArt/manifest';

/** Match CharacterSelectCard max-w-[240px] + LetzFetzCard fluid aspect-[2/3]. */
const ITEM_GAP_PX = 16;
const ITEM_WIDTH_PX = 240;
const LOCK_WIDTH_PX = ITEM_WIDTH_PX + 8;
const STRIDE_PX = ITEM_WIDTH_PX + ITEM_GAP_PX;
/** Full spin duration before ease-out lands on the pick. */
const SPIN_MS = 2200;
const REEL_LOOPS = 5;

export interface CharacterRandomSpinProps {
  characters: CharacterCardDef[];
  targetId: string;
  onComplete: (characterId: string) => void;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function buildReel(characters: CharacterCardDef[], targetId: string): {
  reel: CharacterCardDef[];
  landIndex: number;
} {
  const reel: CharacterCardDef[] = [];
  for (let loop = 0; loop < REEL_LOOPS; loop++) {
    for (const c of characters) reel.push(c);
  }
  // Prefer landing in the last loop so the reel travels a satisfying distance.
  let landIndex = 0;
  for (let i = reel.length - 1; i >= 0; i--) {
    if (reel[i].id === targetId) {
      landIndex = i;
      break;
    }
  }
  return { reel, landIndex };
}

export function CharacterRandomSpin({ characters, targetId, onComplete }: CharacterRandomSpinProps) {
  const { reel, landIndex } = buildReel(characters, targetId);
  const [offsetPx, setOffsetPx] = useState(0);
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
    setDone(false);
    setOffsetPx(0);

    if (characters.length === 0) {
      onCompleteRef.current(targetId);
      return;
    }

    const finalOffset = landIndex * STRIDE_PX;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SPIN_MS);
      setOffsetPx(finalOffset * easeOutCubic(t));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      setDone(true);
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current(targetId);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [characters.length, landIndex, targetId]);

  const target = characters.find((c) => c.id === targetId);

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-xl bg-stone-950/90 backdrop-blur-sm"
      data-testid="character-random-spin"
      role="status"
      aria-live="polite"
      aria-busy={!done}
      aria-label={done ? `Charakter gewählt: ${target?.name ?? targetId}` : 'Zufällige Charakterauswahl läuft'}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400/90">
        {done ? 'Gewählt!' : 'Dreht…'}
      </p>

      <div className="relative w-full max-w-3xl overflow-hidden px-2">
        {/* Center lock marker — card-sized viewport frame */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-lg border-2 border-amber-400/80 shadow-[0_0_24px_rgba(251,191,36,0.25)]"
          style={{ width: LOCK_WIDTH_PX, aspectRatio: '2 / 3' }}
          aria-hidden
        />
        <div
          className="flex items-start will-change-transform"
          style={{
            gap: ITEM_GAP_PX,
            transform: `translateX(calc(50% - ${ITEM_WIDTH_PX / 2}px - ${offsetPx}px))`,
          }}
        >
          {reel.map((character, index) => {
            const src = resolveCardArtPath(character.id);
            const isLand = done && index === landIndex;
            return (
              <div
                key={`${character.id}-${index}`}
                className={`flex shrink-0 flex-col items-center gap-1.5 transition-opacity duration-200 ${
                  isLand ? 'opacity-100' : done ? 'opacity-40' : 'opacity-90'
                }`}
                style={{ width: ITEM_WIDTH_PX }}
              >
                <div
                  className={`aspect-[2/3] w-full overflow-hidden rounded-lg border bg-stone-900 ${
                    isLand ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-stone-600'
                  }`}
                >
                  {src ? (
                    <img
                      src={src}
                      alt=""
                      draggable={false}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-stone-500">
                      ?
                    </div>
                  )}
                </div>
                <span className="truncate text-center text-xs text-stone-300">{character.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
