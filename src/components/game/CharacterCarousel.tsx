/**
 * Center-focused character card carousel for solo match setup.
 * Location: src/components/game/CharacterCarousel.tsx
 */
import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CharacterCardDef } from '../../game';
import { LetzFetzCard } from '../cards/LetzFetzCard';
import { characterDefToForgeProps } from '../cards/characterCardProps';
import { Button } from '../ui/button';

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
    <div className="relative w-full" data-testid="character-carousel">
      <style>{`
        .character-carousel-slide {
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            filter 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .character-carousel-slide:not(.is-center) {
          opacity: 0.45;
          filter: blur(2px);
          transform: scale(0.88);
        }
        .character-carousel-slide.is-center {
          opacity: 1;
          filter: blur(0);
          transform: scale(1);
          z-index: 10;
        }
        @media (prefers-reduced-motion: reduce) {
          .character-carousel-slide {
            transition: none;
          }
          .character-carousel-slide:not(.is-center) {
            filter: none;
          }
        }
      `}</style>

      <div className="overflow-hidden px-2 py-4" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {characters.map((character, index) => {
            const props = characterDefToForgeProps(character);
            const isCenter = index === centerIndex;

            return (
              <div
                key={character.id}
                className={`character-carousel-slide min-w-0 flex-[0_0_78%] sm:flex-[0_0_62%] md:flex-[0_0_48%] ${
                  isCenter ? 'is-center' : ''
                }`}
                data-testid={`character-slide-${character.id}`}
              >
                <div className="flex justify-center px-3">
                  <LetzFetzCard
                    {...props}
                    id={props.id ?? character.id}
                    name={props.name ?? character.name}
                    type="Character"
                    element="Neutral"
                    size="lg"
                    interactive
                    selected={isCenter}
                    onClick={() => handleCardClick(index)}
                    className={isCenter ? 'shadow-2xl shadow-purple-900/40' : ''}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {characters.length > 1 && (
        <>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={<ChevronLeft className="h-5 w-5" />}
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full border-stone-600 bg-stone-900/95 shadow-lg"
            onClick={scrollPrev}
            aria-label="Vorheriger Charakter"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={<ChevronRight className="h-5 w-5" />}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full border-stone-600 bg-stone-900/95 shadow-lg"
            onClick={scrollNext}
            aria-label="Nächster Charakter"
          />

          <div className="mt-2 flex justify-center gap-2" role="tablist" aria-label="Charakterauswahl">
            {characters.map((character, index) => (
              <button
                key={character.id}
                type="button"
                role="tab"
                aria-selected={index === centerIndex}
                aria-label={character.name}
                className={`h-2 w-2 rounded-full transition-opacity ${
                  index === centerIndex ? 'bg-purple-400 opacity-100' : 'bg-stone-600 opacity-40'
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
              />
            ))}
          </div>
        </>
      )}

      {characters[centerIndex] && (
        <p className="mt-4 text-center text-sm text-stone-300">
          <span className="font-semibold text-stone-100">{characters[centerIndex].name}</span>
          {' — '}
          {characters[centerIndex].role}
        </p>
      )}
    </div>
  );
}
