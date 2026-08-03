/**
 * Hover/focus tooltip with full card effect text + element synergies (§11).
 * Location: src/features/play/board/CardEffectTooltip.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ElementCardDef, GlitchCardDef } from '../../../game/types';
import { getElementSynergy } from '../../../game/rules/elementSynergies';
import { ELEMENT_LABELS_DE } from '../../../components/ui/ElementIcon';
import { formatImpulseTooltipLine } from '../../../components/cards/impulseKeywordCopy';

const CARD_TYPE_DE: Record<ElementCardDef['cardType'], string> = {
  attack: 'Angriff',
  block: 'Block',
  boost: 'Boost',
};

const GLITCH_TYPE_DE: Record<GlitchCardDef['glitchType'], string> = {
  playable: 'Spielbar',
  instant: 'Sofort',
};

interface CardEffectTooltipProps {
  def?: ElementCardDef | null;
  glitchDef?: GlitchCardDef | null;
  /** Extra line (e.g. attack targeting hint). */
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function CardEffectTooltip({
  def,
  glitchDef,
  hint,
  children,
  className = '',
}: CardEffectTooltipProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePos = () => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      top: rect.top - 10,
      left: rect.left + rect.width / 2,
    });
  };

  const show = () => {
    updatePos();
    setOpen(true);
  };

  const hide = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => updatePos();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open]);

  if (!def && !glitchDef) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={anchorRef}
      className={`relative ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open &&
        createPortal(
          <div
            role="tooltip"
            data-testid="card-effect-tooltip"
            className="pointer-events-none fixed z-[300] max-h-[min(70vh,28rem)] w-[min(20rem,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-full overflow-y-auto rounded-lg border border-stone-600 bg-stone-950/95 px-3 py-2.5 text-left shadow-2xl backdrop-blur-md"
            style={{ top: pos.top, left: pos.left }}
          >
            {def ? <ElementTooltipBody def={def} hint={hint} /> : null}
            {glitchDef ? <GlitchTooltipBody glitch={glitchDef} hint={hint} /> : null}
          </div>,
          document.body,
        )}
    </div>
  );
}

function ElementTooltipBody({ def, hint }: { def: ElementCardDef; hint?: string }) {
  const typeLabel = CARD_TYPE_DE[def.cardType];
  const elementLabel = ELEMENT_LABELS_DE[def.element];
  const synergy = getElementSynergy(def.element);
  const impulseLine = def.elementImpulse
    ? formatImpulseTooltipLine(def.elementImpulse)
    : null;
  const handOnly = def.boundText == null || def.boundText.length === 0;
  const roleLabel =
    def.valueRole === 'starter'
      ? 'Starter'
      : def.valueRole === 'standard'
        ? 'Standard'
        : def.valueRole === 'payoff'
          ? 'Payoff'
          : def.valueRole === 'drawback'
            ? 'Rohwert mit Nachteil'
            : null;

  return (
    <>
      <p className="text-sm font-bold text-stone-100">{def.name}</p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-400/90">
        {elementLabel} · {typeLabel} · {def.value}
        {roleLabel ? ` · ${roleLabel}` : ''}
      </p>
      {impulseLine && (
        <p
          data-testid="card-effect-tooltip-impulse"
          className="mt-1 text-[11px] font-semibold text-amber-200/95"
        >
          {impulseLine}
        </p>
      )}
      <dl className="mt-2 space-y-2 text-xs leading-snug text-stone-200">
        <div>
          <dt className="font-semibold text-emerald-400/90">Sofort</dt>
          <dd className="mt-0.5 whitespace-pre-wrap">{def.instantText}</dd>
        </div>
        {handOnly ? (
          <div data-testid="card-effect-tooltip-hand-only">
            <dt className="font-semibold text-sky-400/90">Handaktion</dt>
            <dd className="mt-0.5 text-[10px] text-stone-400">
              Nur Angriff / Block / Boost von der Hand. Nicht auf Formelplätze baubar.
            </dd>
          </div>
        ) : (
          <>
            <div>
              <dt className="font-semibold text-sky-400/90">Gebaut</dt>
              <dd className="mt-0.5 whitespace-pre-wrap">{def.boundText}</dd>
              <dd className="mt-1 text-[10px] text-stone-400">
                Widerstand = Kartenwert ({def.value}). Aktivieren kostet 1 Handkarte und erschöpft
                diese Karte.
              </dd>
            </div>
            <div data-testid="card-effect-tooltip-synergy">
              <dt className="font-semibold text-violet-300/95">Synergie · {elementLabel} gebaut</dt>
              <dd className="mt-1 space-y-1.5">
                <p>
                  <span className="font-semibold text-violet-200/90">Ab 2× {elementLabel}:</span>{' '}
                  {synergy.at2}
                </p>
                <p>
                  <span className="font-semibold text-violet-200/90">Ab 3× {elementLabel}:</span>{' '}
                  {synergy.at3}
                </p>
              </dd>
              <dd className="mt-1 text-[10px] text-stone-500">
                Zählt nur deine gebauten Karten dieses Elements (auch erschöpft). Noch nicht in der
                Engine aktiv — Regelbuch §11.
              </dd>
            </div>
          </>
        )}
      </dl>
      {hint && (
        <p className="mt-2 border-t border-stone-700 pt-2 text-[11px] text-amber-200/90">{hint}</p>
      )}
    </>
  );
}

function GlitchTooltipBody({ glitch, hint }: { glitch: GlitchCardDef; hint?: string }) {
  return (
    <>
      <p className="text-sm font-bold text-stone-100">{glitch.name}</p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-fuchsia-400/90">
        Glitch · {GLITCH_TYPE_DE[glitch.glitchType]}
      </p>
      <dl className="mt-2 space-y-2 text-xs leading-snug text-stone-200">
        <div>
          <dt className="font-semibold text-amber-400/90">Timing</dt>
          <dd className="mt-0.5 whitespace-pre-wrap">{glitch.timing}</dd>
        </div>
        <div>
          <dt className="font-semibold text-emerald-400/90">Effekt</dt>
          <dd className="mt-0.5 whitespace-pre-wrap">{glitch.effectText}</dd>
        </div>
      </dl>
      {hint && (
        <p className="mt-2 border-t border-stone-700 pt-2 text-[11px] text-amber-200/90">{hint}</p>
      )}
    </>
  );
}
