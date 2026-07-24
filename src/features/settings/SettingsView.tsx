/**
 * App settings — Audio, Display, Gameplay, Accessibility.
 * Location: src/features/settings/SettingsView.tsx
 */
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { BrandLogoText } from '../../components/ui/BrandLogoText';
import { GrungeAppShell } from '../../components/ui/GrungeAppShell';
import { Panel } from '../../components/ui/Panel';
import { audioManager } from '../../services/audio/audioManager';
import { useSettings } from '../../services/settings/SettingsProvider';

interface SettingsViewProps {
  onBack: () => void;
  onOpenNotes: () => void;
}

function SliderRow({
  label,
  testId,
  value,
  onChange,
}: {
  label: string;
  testId: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block space-y-1">
      <span className="flex items-center justify-between text-xs text-stone-300">
        <span>{label}</span>
        <span className="tabular-nums text-stone-500">{Math.round(value * 100)}%</span>
      </span>
      <input
        data-testid={testId}
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-amber-500"
      />
    </label>
  );
}

function ToggleRow({
  label,
  testId,
  checked,
  onChange,
}: {
  label: string;
  testId: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm text-stone-200">
      <span>{label}</span>
      <input
        data-testid={testId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-amber-500"
      />
    </label>
  );
}

export function SettingsView({ onBack, onOpenNotes }: SettingsViewProps) {
  const { settings, updateSettings, resetSettings } = useSettings();

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
              Einstellungen
            </BrandLogoText>
          </div>

          <div data-testid="settings-section-audio">
          <Panel className="space-y-4">
            <h2 className="text-sm font-semibold text-stone-200">Audio</h2>
            <ToggleRow
              label="Stumm"
              testId="settings-mute"
              checked={settings.audio.muted}
              onChange={(muted) => updateSettings({ audio: { muted } })}
            />
            <SliderRow
              label="Master"
              testId="settings-volume-master"
              value={settings.audio.master}
              onChange={(master) => updateSettings({ audio: { master } })}
            />
            <SliderRow
              label="SFX"
              testId="settings-volume-sfx"
              value={settings.audio.sfx}
              onChange={(sfx) => updateSettings({ audio: { sfx } })}
            />
            <SliderRow
              label="UI"
              testId="settings-volume-ui"
              value={settings.audio.ui}
              onChange={(ui) => updateSettings({ audio: { ui } })}
            />
            <SliderRow
              label="Ambiente"
              testId="settings-volume-ambience"
              value={settings.audio.ambience}
              onChange={(ambience) => updateSettings({ audio: { ambience } })}
            />
            <SliderRow
              label="Musik"
              testId="settings-volume-music"
              value={settings.audio.music}
              onChange={(music) => updateSettings({ audio: { music } })}
            />
            <Button
              variant="secondary"
              size="sm"
              data-testid="settings-test-sound"
              onClick={() => {
                audioManager.unlock();
                audioManager.playStinger('play');
              }}
            >
              Testton abspielen
            </Button>
          </Panel>
          </div>

          <div data-testid="settings-section-display">
          <Panel className="space-y-4">
            <h2 className="text-sm font-semibold text-stone-200">Anzeige</h2>
            <label className="block space-y-1">
              <span className="flex items-center justify-between text-xs text-stone-300">
                <span>UI-Skalierung</span>
                <span className="tabular-nums text-stone-500">
                  {Math.round(settings.display.uiScale * 100)}%
                </span>
              </span>
              <input
                data-testid="settings-ui-scale"
                type="range"
                min={0.75}
                max={1.5}
                step={0.05}
                value={settings.display.uiScale}
                onChange={(e) =>
                  updateSettings({ display: { uiScale: Number(e.target.value) } })
                }
                className="w-full accent-amber-500"
              />
            </label>
            <p className="text-xs text-stone-500">
              Skalierung über CSS-Variable (--lf-ui-scale), nicht transform:scale.
            </p>
            <ToggleRow
              label="Vollbild bevorzugen"
              testId="settings-fullscreen"
              checked={settings.display.preferFullscreen}
              onChange={(preferFullscreen) =>
                updateSettings({ display: { preferFullscreen } })
              }
            />
          </Panel>
          </div>

          <div data-testid="settings-section-gameplay">
          <Panel className="space-y-4">
            <h2 className="text-sm font-semibold text-stone-200">Gameplay</h2>
            <ToggleRow
              label="Zugende bestätigen"
              testId="settings-confirm-end-turn"
              checked={settings.gameplay.confirmEndTurn}
              onChange={(confirmEndTurn) =>
                updateSettings({ gameplay: { confirmEndTurn } })
              }
            />
          </Panel>
          </div>

          <div data-testid="settings-section-a11y">
          <Panel className="space-y-4">
            <h2 className="text-sm font-semibold text-stone-200">Barrierefreiheit</h2>
            <ToggleRow
              label="Weniger Bewegung"
              testId="settings-reduced-motion"
              checked={settings.a11y.reducedMotion}
              onChange={(reducedMotion) => updateSettings({ a11y: { reducedMotion } })}
            />
            <ToggleRow
              label="Hoher Kontrast"
              testId="settings-high-contrast"
              checked={settings.a11y.highContrast}
              onChange={(highContrast) => updateSettings({ a11y: { highContrast } })}
            />
          </Panel>
          </div>

          <Panel className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-stone-200">Notizen</h2>
              <p className="mt-1 text-xs text-stone-400">
                Spielnotizen und Ideen — lokal im Browser.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={onOpenNotes}
              >
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
            <Button
              variant="danger"
              size="sm"
              data-testid="settings-reset"
              onClick={() => {
                if (
                  window.confirm(
                    'Einstellungen auf Standard zurücksetzen?',
                  )
                ) {
                  resetSettings();
                }
              }}
            >
              Auf Standard zurücksetzen
            </Button>
          </Panel>
        </div>
      </div>
    </GrungeAppShell>
  );
}
