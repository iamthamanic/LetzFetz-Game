/**
 * Compact arena label — effects open as a floating hover tooltip (no layout shift).
 * Location: src/components/game/ArenaPlaymatBadge.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ArenaCardDef } from '../../game/types';
import type { ArenaState } from '../../game/types/game';
import { getArenaTheme } from './arenaTheme';
import { Badge } from '../ui/Badge';

interface ArenaPlaymatBadgeProps {
  arena: ArenaCardDef;
  arenaState: ArenaState;
  /** overlay = absolute on playmat; inline = duel tableau; sidebar = bot dock column */
  placement?: 'overlay' | 'inline' | 'sidebar';
  className?: string;
}

export function ArenaPlaymatBadge({
  arena,
  arenaState,
  placement = 'overlay',
  className = '',
}: ArenaPlaymatBadgeProps) {
  const theme = getArenaTheme(arena.id);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, align: 'left' as 'left' | 'right' });

  const placementClass =
    placement === 'inline'
      ? 'relative z-10 self-start'
      : placement === 'sidebar'
        ? 'relative z-10 w-full'
        : 'absolute right-3 top-3 z-20';

  const textAlign = placement === 'overlay' ? 'text-right' : 'text-left';
  const chipJustify = placement === 'overlay' ? 'justify-end' : 'justify-start';
  const tooltipAlign = placement === 'overlay' || placement === 'sidebar' ? 'right' : 'left';

  const variantText =
    arenaState.d6Variant != null && arena.d6Variants
      ? arena.d6Variants[arenaState.d6Variant]
      : null;

  const tooltipId = `arena-fx-${arena.id}`;

  const updatePos = () => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      top: rect.bottom + 8,
      left: tooltipAlign === 'left' ? rect.left : rect.right,
      align: tooltipAlign,
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
  }, [open, placement]);

  return (
    <div
      ref={anchorRef}
      data-testid="arena-playmat-badge"
      data-placement={placement}
      className={`${placementClass} ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <div
        className={`rounded-lg border bg-stone-950/90 px-3 py-2 shadow-lg backdrop-blur-md ${theme.accent}`}
      >
        <button
          type="button"
          className={`w-full max-w-xs ${textAlign} rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 ${
            placement === 'sidebar' ? 'max-w-none' : ''
          }`}
          aria-describedby={open ? tooltipId : undefined}
          aria-expanded={open}
          onFocus={show}
          onBlur={hide}
        >
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/90">
            🏟️ Arena
          </h2>
          <p className={`text-sm font-bold text-stone-100 ${textAlign}`}>{arena.name}</p>
          <div className={`mt-1 flex flex-wrap gap-1 ${chipJustify}`}>
            <Badge variant="accent" className="normal-case tracking-normal">
              Effekte
            </Badge>
            {arenaState.d6Variant != null && (
              <Badge variant="info" className="text-[10px]">
                W6: {arenaState.d6Variant}
              </Badge>
            )}
          </div>
        </button>
      </div>

      {open &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            data-testid="arena-playmat-badge-tooltip"
            className="pointer-events-none fixed z-[300] w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-amber-500/50 bg-stone-950 p-3 text-left shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-stone-800"
            style={{
              top: pos.top,
              left: pos.left,
              transform: pos.align === 'right' ? 'translateX(-100%)' : undefined,
            }}
          >
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Arena-Effekte
            </p>
            <dl className="space-y-2 text-xs text-stone-200">
              <div>
                <dt className="font-semibold text-stone-400">Grund</dt>
                <dd className="mt-0.5 leading-snug">{arena.baseEffect}</dd>
              </div>
              <div>
                <dt className="font-semibold text-stone-400">Trigger</dt>
                <dd className="mt-0.5 leading-snug">{arena.trigger}</dd>
              </div>
              <div>
                <dt className="font-semibold text-stone-400">Sonder</dt>
                <dd className="mt-0.5 leading-snug">{arena.specialRule}</dd>
              </div>
              {variantText && (
                <div>
                  <dt className="font-semibold text-sky-300">
                    W6-Variante {arenaState.d6Variant}
                  </dt>
                  <dd className="mt-0.5 leading-snug text-sky-100/90">{variantText}</dd>
                </div>
              )}
            </dl>
          </div>,
          document.body,
        )}
    </div>
  );
}
