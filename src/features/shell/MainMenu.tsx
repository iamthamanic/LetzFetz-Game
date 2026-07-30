/**
 * App home — vertical menu: Play, Material, Build, Settings.
 * Location: src/features/shell/MainMenu.tsx
 */
import React from 'react';
import { Boxes, Gamepad2, Layers, Settings } from 'lucide-react';
import { LETZ_FETZ_LOGO_SRC } from '../../components/brand/letzFetzLogo';
import { GrungeAppShell } from '../../components/ui/GrungeAppShell';
import { MenuGlitchBackdrop } from '../../components/ui/MenuGlitchBackdrop';
import type { AppView } from './AppNav';
import type { TabTone } from '../../components/ui/Tabs';

interface MainMenuProps {
  onNavigate: (view: Exclude<AppView, 'menu'>) => void;
  onOpenSettings: () => void;
}

/** Match AppNav / Tabs active tones (play emerald, cards purple, sandbox amber). */
function itemToneClasses(tone: TabTone): {
  button: string;
  iconWrap: string;
  icon: string;
  label: string;
} {
  switch (tone) {
    case 'play':
      return {
        button:
          'border-emerald-500/50 bg-emerald-900/55 text-emerald-50 shadow-[0_0_18px_rgba(52,211,153,0.28)] ring-1 ring-emerald-400/60 hover:border-emerald-400/80 hover:bg-emerald-800/60 hover:shadow-[0_0_22px_rgba(52,211,153,0.4)] focus-visible:ring-emerald-400',
        iconWrap: 'border-emerald-400/50 bg-emerald-950/70 text-emerald-300',
        icon: 'text-emerald-300',
        label: 'text-emerald-50',
      };
    case 'editor':
      return {
        button:
          'border-purple-500/45 bg-purple-900/50 text-purple-100 shadow-[0_0_18px_rgba(168,85,247,0.28)] ring-1 ring-purple-500/55 hover:border-purple-400/70 hover:bg-purple-900/70 hover:shadow-[0_0_22px_rgba(168,85,247,0.4)] focus-visible:ring-purple-400',
        iconWrap: 'border-purple-500/45 bg-purple-950/60 text-purple-200',
        icon: 'text-purple-200',
        label: 'text-brand-cream',
      };
    case 'sandbox':
      return {
        button:
          'border-amber-500/40 bg-stone-800 text-amber-100 ring-1 ring-amber-500/45 shadow-sm hover:border-amber-400/60 hover:bg-stone-800/90 hover:ring-amber-400/60 focus-visible:ring-amber-400',
        iconWrap: 'border-amber-500/40 bg-amber-950/40 text-amber-200',
        icon: 'text-amber-200',
        label: 'text-amber-100',
      };
    case 'settings':
      return {
        button:
          'border-stone-700 bg-stone-900/80 text-stone-300 hover:border-stone-500 hover:bg-stone-800 hover:text-stone-100 focus-visible:ring-stone-500',
        iconWrap: 'border-stone-700 bg-stone-950 text-stone-400',
        icon: 'text-stone-400',
        label: 'text-brand-cream',
      };
  }
}

const PRIMARY_ITEMS: {
  id: Exclude<AppView, 'menu'>;
  label: string;
  hint: string;
  icon: React.ReactNode;
  tone: TabTone;
}[] = [
  {
    id: 'play',
    label: 'Play',
    hint: 'Solo vs Bot — Partie starten',
    icon: <Gamepad2 className="h-6 w-6" aria-hidden />,
    tone: 'play',
  },
  {
    id: 'forge',
    label: 'Material',
    hint: 'Material — alle Karten durchsuchen',
    icon: <Layers className="h-6 w-6" aria-hidden />,
    tone: 'editor',
  },
  {
    id: 'build',
    label: 'Build',
    hint: 'Werkbank — Combinate & Development',
    icon: <Boxes className="h-6 w-6" aria-hidden />,
    tone: 'sandbox',
  },
];

export function MainMenu({ onNavigate, onOpenSettings }: MainMenuProps) {
  return (
    <GrungeAppShell>
      <div
        data-testid="main-menu"
        className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto bg-stone-950 px-4 py-10 text-stone-100"
      >
        <MenuGlitchBackdrop />
        <div className="relative z-10 isolate flex w-full max-w-md flex-col items-center gap-10">
          <div className="relative z-10 flex flex-col items-center gap-3 text-center">
            <div className="brand-logo-shimmer relative z-10" data-testid="main-menu-logo">
              <img
                src={LETZ_FETZ_LOGO_SRC}
                alt="Letz Fetz"
                className="relative z-10 h-20 w-auto max-w-[240px] object-contain sm:h-24 sm:max-w-[280px]"
                loading="eager"
                decoding="async"
              />
              <span className="btn-brand-shimmer__shine brand-logo-shimmer__shine" aria-hidden="true" />
            </div>
          </div>

          <nav
            className="relative z-10 flex w-full flex-col gap-3"
            aria-label="Hauptmenü"
            data-testid="main-menu-nav"
          >
            {PRIMARY_ITEMS.map((item) => {
              const tones = itemToneClasses(item.tone);
              return (
                <button
                  key={item.id}
                  type="button"
                  data-testid={`main-menu-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 ${tones.button}`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${tones.iconWrap}`}
                  >
                    <span className={tones.icon}>{item.icon}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`font-brand block text-xl uppercase leading-none tracking-wide ${tones.label}`}
                    >
                      {item.label}
                    </span>
                    <span className="mt-1.5 block text-xs text-stone-400">{item.hint}</span>
                  </span>
                </button>
              );
            })}

            <div className="my-2 border-t border-stone-800" aria-hidden />

            <button
              type="button"
              data-testid="main-menu-settings"
              onClick={onOpenSettings}
              className="flex w-full items-center gap-4 rounded-xl border border-stone-700 bg-stone-900/80 px-5 py-3.5 text-left text-stone-300 transition-all hover:border-stone-500 hover:bg-stone-800 hover:text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stone-700 bg-stone-950 text-stone-400">
                <Settings className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-brand block text-base uppercase leading-none tracking-wide text-brand-cream">
                  Settings
                </span>
                <span className="mt-1 block text-xs text-stone-500">App-Einstellungen</span>
              </span>
            </button>
          </nav>
        </div>
      </div>
    </GrungeAppShell>
  );
}
