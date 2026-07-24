/**
 * Sync looped music beds via AudioManager (typed IDs only).
 * Location: src/services/audio/MusicBedSync.tsx
 *
 * menu → music.menu.main (Pulsefront); match → music.match.default (Iron Surge).
 * Does not restart when the same bed is already active.
 * No feature imports — App composition root chooses the bed.
 *
 * First pointer/key gesture unlocks audio and retries playMusic (autoplay policy).
 */
import { useEffect, useRef } from 'react';
import { audioManager } from './audioManager';
import type { SoundId } from './types';

export type MusicBed = 'menu' | 'match';

const BED_TO_ID: Record<MusicBed, SoundId> = {
  menu: 'music.menu.main',
  match: 'music.match.default',
};

interface MusicBedSyncProps {
  bed: MusicBed;
}

export function MusicBedSync({ bed }: MusicBedSyncProps) {
  const bedRef = useRef(bed);
  bedRef.current = bed;

  useEffect(() => {
    const onGesture = () => {
      audioManager.unlock();
      // Retry in the same gesture stack — unlock alone is not enough for HTML5 beds.
      audioManager.playMusic(BED_TO_ID[bedRef.current]);
    };
    window.addEventListener('pointerdown', onGesture, { once: true });
    window.addEventListener('keydown', onGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
    };
  }, []);

  useEffect(() => {
    audioManager.playMusic(BED_TO_ID[bed]);
  }, [bed]);

  return null;
}
