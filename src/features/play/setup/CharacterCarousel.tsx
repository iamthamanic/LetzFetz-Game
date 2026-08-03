/**
 * Scriptony-style center-focus carousel — leading „Zufällig“ tile + character cards.
 * Location: src/features/play/setup/CharacterCarousel.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import type { CharacterCardDef } from '../../../game';
import { Button } from '../../../components/ui/Button';
import { CharacterSelectCard } from './CharacterSelectCard';
import { CharacterPreviewWithDetails } from './CharacterPreviewWithDetails';

const RANDOM_SLIDE_ID = 'zufaellig';

interface CharacterCarouselProps {
  characters: CharacterCardDef[];
  selectedId: string;
  onSelect: (characterId: string) => void;
  onRandom?: () => void;
  randomDisabled?: boolean;
  randomBusy?: boolean;
}

/** Card-sized Zufällig face — matches CharacterSelectCard fluid portrait footprint. */
function ZufaelligSelectCard({
  isCenter,
  disabled,
  busy,
  onActivate,
  onFocusSlide,
}: {
  isCenter: boolean;
  disabled: boolean;
  busy: boolean;
  onActivate: () => void;
  onFocusSlide: () => void;
}) {
  return (
    <button
      type="button"
      data-testid="game-setup-random-character"
      disabled={disabled}
      aria-busy={busy}
      aria-label="Zufälligen Charakter wählen"
      onClick={() => {
        if (isCenter) onActivate();
        else onFocusSlide();
      }}
      className={`flex aspect-[2/3] w-full max-w-[240px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-amber-500/55 bg-stone-900/85 text-stone-100 shadow-lg transition-all sm:max-w-[260px] md:max-w-[280px] hover:border-amber-400 hover:bg-stone-800/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/80 disabled:cursor-not-allowed disabled:opacity-50 ${
        isCenter ? 'character-card-frame-highlighted ring-amber-700/30' : ''
      }`}
    >
      <Shuffle className="h-10 w-10 text-amber-400 sm:h-12 sm:w-12" aria-hidden />
      <span className="font-brand-on-dark text-base uppercase leading-none tracking-wide sm:text-lg">
        Zufällig
      </span>
    </button>
  );
}

export function CharacterCarousel({
  characters,
  selectedId,
  onSelect,
  onRandom,
  randomDisabled = false,
  randomBusy = false,
}: CharacterCarouselProps) {
  const hasRandom = Boolean(onRandom);
  const slideCount = characters.length + (hasRandom ? 1 : 0);
  /** Zufällig is the first slide when present (default on mount). */
  const randomIndex = hasRandom ? 0 : -1;
  const characterOffset = hasRandom ? 1 : 0;

  /** Freeze startIndex: Zufällig only on initial mount — never reset after spin. */
  const startIndexRef = useRef(
    hasRandom ? 0 : Math.max(0, characters.findIndex((c) => c.id === selectedId)),
  );
  const prevSelectedIdRef = useRef(selectedId);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: slideCount > 1,
    skipSnaps: false,
    containScroll: 'trimSnaps',
    startIndex: startIndexRef.current,
    duration: 25,
  });

  const [centerIndex, setCenterIndex] = useState(startIndexRef.current);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!emblaApi) return;

    const syncSelection = () => {
      const index = emblaApi.selectedScrollSnap();
      setCenterIndex(index);
      if (index === randomIndex) return;
      const character = characters[index - characterOffset];
      if (character) onSelectRef.current(character.id);
    };

    syncSelection();
    emblaApi.on('select', syncSelection);
    emblaApi.on('reInit', syncSelection);
    return () => {
      emblaApi.off('select', syncSelection);
      emblaApi.off('reInit', syncSelection);
    };
  }, [emblaApi, characters, randomIndex, characterOffset]);

  useEffect(() => {
    const charIdx = characters.findIndex((c) => c.id === selectedId);
    if (charIdx < 0 || !emblaApi) return;
    const idx = charIdx + characterOffset;
    const current = emblaApi.selectedScrollSnap();
    const selectedChanged = prevSelectedIdRef.current !== selectedId;
    prevSelectedIdRef.current = selectedId;
    if (idx === current) return;
    // Stay on Zufällig for mount / browsing; scroll there only when selection changes (spin).
    if (current === randomIndex && !selectedChanged) return;
    emblaApi.scrollTo(idx);
  }, [selectedId, characters, emblaApi, randomIndex, characterOffset]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const handleCardClick = (index: number) => {
    if (!emblaApi) return;
    if (index === centerIndex) return;
    emblaApi.scrollTo(index);
  };

  if (characters.length === 0) {
    return null;
  }

  const showNav = slideCount > 1;

  return (
    <div className="relative px-0 pb-10 pt-0 md:pb-8" data-testid="character-carousel">
      <style>{`
        .character-carousel-slide {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .character-carousel-slide:not(.is-center) {
          opacity: 0.5;
          filter: blur(2px);
        }
        .character-carousel-slide:not(.is-center) > div {
          transform: scale(0.92);
        }
        .character-carousel-slide.is-center {
          opacity: 1;
          filter: blur(0);
          z-index: 10;
        }
        .character-carousel-slide.is-center > div {
          transform: scale(1);
        }
        @media (prefers-reduced-motion: reduce) {
          .character-carousel-slide {
            transition: none;
          }
          .character-carousel-slide:not(.is-center) {
            filter: none;
          }
        }
        .character-carousel-nav {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 20;
        }
        .character-carousel-nav-btn {
          pointer-events: auto;
          position: absolute;
        }
      `}</style>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className={`flex ${slideCount === 1 ? '' : '-ml-4 md:ml-0'}`}>
          {hasRandom ? (
            <div
              key={RANDOM_SLIDE_ID}
              className={`character-carousel-slide min-w-0 flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_38%] lg:flex-[0_0_36%] ${
                slideCount === 1 ? '' : 'pl-4 md:pl-0'
              } ${centerIndex === randomIndex ? 'is-center' : ''}`}
              data-testid="character-slide-zufaellig"
            >
              <div className="flex flex-col items-center gap-2 transition-all duration-300">
                <ZufaelligSelectCard
                  isCenter={centerIndex === randomIndex}
                  disabled={randomDisabled}
                  busy={randomBusy}
                  onActivate={() => onRandom?.()}
                  onFocusSlide={() => handleCardClick(randomIndex)}
                />
              </div>
            </div>
          ) : null}

          {characters.map((character, charIdx) => {
            const index = charIdx + characterOffset;
            const isCenter = index === centerIndex;

            return (
              <div
                key={character.id}
                className={`character-carousel-slide min-w-0 flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_38%] lg:flex-[0_0_36%] ${
                  slideCount === 1 ? '' : 'pl-4 md:pl-0'
                } ${isCenter ? 'is-center' : ''}`}
                data-testid={`character-slide-${character.id}`}
              >
                <div className="flex flex-col items-center gap-2 transition-all duration-300">
                  {isCenter ? (
                    <CharacterPreviewWithDetails character={character} selected />
                  ) : (
                    <CharacterSelectCard
                      character={character}
                      selected={false}
                      isCenter={false}
                      onClick={() => handleCardClick(index)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showNav && (
        <>
          <div className="character-carousel-nav">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />}
              className="character-carousel-nav-btn left-1 top-[38%] h-10 w-10 rounded-full border-2 border-stone-600 bg-stone-900/95 shadow-xl md:left-4 md:top-[35%] md:h-12 md:w-12"
              onClick={scrollPrev}
              aria-label="Vorheriger Charakter"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<ChevronRight className="h-5 w-5 md:h-6 md:w-6" />}
              className="character-carousel-nav-btn right-1 top-[38%] h-10 w-10 rounded-full border-2 border-stone-600 bg-stone-900/95 shadow-xl md:right-4 md:top-[35%] md:h-12 md:w-12"
              onClick={scrollNext}
              aria-label="Nächster Charakter"
            />
          </div>

          <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Charakterauswahl">
            {hasRandom ? (
              <button
                type="button"
                role="tab"
                aria-selected={centerIndex === randomIndex}
                aria-label="Zufällig"
                className={`h-2 w-2 rounded-full transition-opacity ${
                  centerIndex === randomIndex ? 'bg-amber-400 opacity-100' : 'bg-stone-600 opacity-40'
                }`}
                onClick={() => emblaApi?.scrollTo(randomIndex)}
              />
            ) : null}
            {characters.map((character, charIdx) => {
              const index = charIdx + characterOffset;
              return (
                <button
                  key={character.id}
                  type="button"
                  role="tab"
                  aria-selected={index === centerIndex}
                  aria-label={character.name}
                  className={`h-2 w-2 rounded-full transition-opacity ${
                    index === centerIndex ? 'bg-amber-400 opacity-100' : 'bg-stone-600 opacity-40'
                  }`}
                  onClick={() => emblaApi?.scrollTo(index)}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
