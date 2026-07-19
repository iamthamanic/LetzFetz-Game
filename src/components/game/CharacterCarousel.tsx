/**
 * Scriptony-style center-focus carousel — character cards only.
 * Location: src/components/game/CharacterCarousel.tsx
 */
import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CharacterCardDef } from '../../game';
import { Button } from '../ui/Button';
import { CharacterSelectCard } from './CharacterSelectCard';
import { CharacterPreviewWithDetails } from './CharacterPreviewWithDetails';

interface CharacterCarouselProps {
  characters: CharacterCardDef[];
  selectedId: string;
  onSelect: (characterId: string) => void;
}

export function CharacterCarousel({ characters, selectedId, onSelect }: CharacterCarouselProps) {
  const initialIndex = Math.max(
    0,
    characters.findIndex((c) => c.id === selectedId),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: characters.length > 1,
    skipSnaps: false,
    containScroll: 'trimSnaps',
    startIndex: initialIndex,
    duration: 25,
  });

  const [centerIndex, setCenterIndex] = useState(initialIndex);

  const syncSelection = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setCenterIndex(index);
    const character = characters[index];
    if (character) onSelect(character.id);
  }, [characters, emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    syncSelection();
    emblaApi.on('select', syncSelection);
    emblaApi.on('reInit', syncSelection);
    return () => {
      emblaApi.off('select', syncSelection);
      emblaApi.off('reInit', syncSelection);
    };
  }, [emblaApi, syncSelection]);

  useEffect(() => {
    const idx = characters.findIndex((c) => c.id === selectedId);
    if (idx >= 0 && emblaApi && idx !== emblaApi.selectedScrollSnap()) {
      emblaApi.scrollTo(idx);
    }
  }, [selectedId, characters, emblaApi]);

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
        <div className={`flex ${characters.length === 1 ? '' : '-ml-4 md:ml-0'}`}>
          {characters.map((character, index) => {
            const isCenter = index === centerIndex;

            return (
              <div
                key={character.id}
                className={`character-carousel-slide min-w-0 flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_38%] lg:flex-[0_0_36%] ${
                  characters.length === 1 ? '' : 'pl-4 md:pl-0'
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

      {characters.length > 1 && (
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
            {characters.map((character, index) => (
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
            ))}
          </div>
        </>
      )}
    </div>
  );
}
