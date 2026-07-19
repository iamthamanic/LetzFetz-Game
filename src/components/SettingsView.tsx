/**
 * App settings screen — lightweight preferences / about.
 * Location: src/components/SettingsView.tsx
 */
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';
import { BrandLogoText } from './ui/BrandLogoText';
import { GrungeAppShell } from './ui/GrungeAppShell';
import { Panel } from './ui/Panel';

interface SettingsViewProps {
  onBack: () => void;
  onOpenNotes: () => void;
}

export function SettingsView({ onBack, onOpenNotes }: SettingsViewProps) {
  return (
    <GrungeAppShell>
      <div
        data-testid="settings-view"
        className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-stone-950 px-4 py-6 text-stone-100 sm:px-6"
      >
        <div className="mx-auto w-full max-w-lg space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft className="h-4 w-4" />}
              onClick={onBack}
              aria-label="Zurück zum Hauptmenü"
            >
              Menü
            </Button>
            <BrandLogoText as="h1" className="text-2xl leading-none">
              Settings
            </BrandLogoText>
          </div>

          <Panel className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-stone-200">Notizen</h2>
              <p className="mt-1 text-xs text-stone-400">
                Spielnotizen und Ideen — lokal im Browser.
              </p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={onOpenNotes}>
                Notizen öffnen
              </Button>
            </div>

            <div className="border-t border-stone-700 pt-4">
              <h2 className="text-sm font-semibold text-stone-200">Über Letz Fetz</h2>
              <p className="mt-1 text-xs leading-relaxed text-stone-400">
                Digitale Playtest-Plattform für das physische 1v1-Kartenduell. Local-first —
                kein Game-Server nötig.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </GrungeAppShell>
  );
}
