/**
 * Sync looped music beds via AudioManager (typed IDs only).
 * Location: src/services/audio/MusicBedSync.tsx
 *
 * menu → music.menu.main (Pulsefront); match → music.match.default (Iron Surge).
 * Does not restart when the same bed is already active.
 * No feature imports — App composition root chooses the bed.
 */
import { useEffect } from 'react';
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
  useEffect(() => {
    const unlockOnce = () => {
      audioManager.unlock();
    };
    window.addEventListener('pointerdown', unlockOnce, { once: true });
    window.addEventListener('keydown', unlockOnce, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockOnce);
      window.removeEventListener('keydown', unlockOnce);
    };
  }, []);

  useEffect(() => {
    audioManager.playMusic(BED_TO_ID[bed]);
  }, [bed]);

  return null;
}
