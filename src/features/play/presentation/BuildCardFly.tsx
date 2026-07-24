/**
 * Face-up card flying from hand into an engine slot, with impact dust on land.
 * Location: src/features/play/presentation/BuildCardFly.tsx
 */
import React, { useEffect, useState } from 'react';
import { resolveCardArtPath } from '../../../services/cardArt/manifest';
import type { PlayerId } from '../../../game/types';
import { prefersReducedMotion } from './prefersReducedMotion';
import type { PresentationStep } from './types';
import { BUILD_FLY_MS, isBuildSnapStep } from './buildBuildSnapStep';

interface BuildCardFlyProps {
  activeStep: PresentationStep | null;
  humanPlayerId: PlayerId;
}

interface FlyGeom {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  width: number;
  height: number;
}

function measureFly(
  cardInstanceId: string,
  playerId: PlayerId,
  humanPlayerId: PlayerId,
): FlyGeom | null {
  const slot =
    (document.querySelector(
      `[data-bound-instance-id="${cardInstanceId}"]`,
    ) as HTMLElement | null) ?? null;

  const hand =
    playerId === humanPlayerId
      ? (document.querySelector('[data-testid="player-hand"]') as HTMLElement | null)
      : (document.querySelector(
          '[data-testid="opponent-plate"][data-dock-variant="full"]',
        ) as HTMLElement | null) ??
        (document.querySelector('[data-testid="opponent-plate"]') as HTMLElement | null);

  if (!slot) return null;

  const target = slot.getBoundingClientRect();
  const origin = hand?.getBoundingClientRect() ?? {
    left: target.left,
    top: target.top + 180,
    width: target.width,
    height: target.height,
    right: 0,
    bottom: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  };

  const fromX =
    playerId === humanPlayerId
      ? origin.left + origin.width * 0.72 - target.width / 2
      : origin.left + origin.width / 2 - target.width / 2;
  const fromY =
    playerId === humanPlayerId
      ? origin.top + origin.height * 0.35 - target.height / 2
      : origin.top + origin.height * 0.55 - target.height / 2;

  return {
    fromX,
    fromY,
    toX: target.left,
    toY: target.top,
    width: target.width || 112,
    height: target.height || 160,
  };
}

export function BuildCardFly({ activeStep, humanPlayerId }: BuildCardFlyProps) {
  const [geom, setGeom] = useState<FlyGeom | null>(null);
  const [landed, setLanded] = useState(false);
  const stepId = activeStep?.id;

  useEffect(() => {
    if (!activeStep || !isBuildSnapStep(activeStep)) {
      setGeom(null);
      setLanded(false);
      return;
    }

    if (prefersReducedMotion()) {
      setGeom(null);
      setLanded(true);
      return;
    }

    const cardInstanceId = activeStep.payload?.cardInstanceId as string | undefined;
    const playerId = activeStep.payload?.playerId as PlayerId | undefined;
    if (!cardInstanceId || !playerId) return;

    setLanded(false);
    // Wait one frame so the bound slot is mounted (even if opacity 0).
    const raf = requestAnimationFrame(() => {
      const next = measureFly(cardInstanceId, playerId, humanPlayerId);
      setGeom(next);
    });

    const landTimer = window.setTimeout(() => setLanded(true), BUILD_FLY_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(landTimer);
    };
  }, [stepId, activeStep, humanPlayerId]);

  if (!activeStep || !isBuildSnapStep(activeStep) || !geom) return null;

  const cardDefId = activeStep.payload?.cardDefId as string | undefined;
  if (!cardDefId) return null;

  const dx = geom.toX - geom.fromX;
  const dy = geom.toY - geom.fromY;

  return (
    <div className="pointer-events-none fixed inset-0 z-[45]" aria-hidden>
      <div
        data-testid="build-card-fly"
        data-landed={landed ? 'true' : 'false'}
        className={`build-card-fly ${landed ? 'build-card-fly--landed' : 'build-card-fly--flying'}`}
        style={
          {
            width: geom.width,
            height: geom.height,
            left: geom.fromX,
            top: geom.fromY,
            '--build-fly-x': `${dx}px`,
            '--build-fly-y': `${dy}px`,
          } as React.CSSProperties
        }
      >
        <img
          src={resolveCardArtPath(cardDefId)}
          alt=""
          className="h-full w-full rounded-md border-2 border-emerald-400/70 object-cover shadow-2xl shadow-emerald-950/50"
        />
      </div>

      {landed && (
        <div
          data-testid="build-impact-dust"
          className="build-impact-dust"
          style={{
            left: geom.toX + geom.width / 2,
            top: geom.toY + geom.height / 2,
          }}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className="build-impact-dust__speck" style={{ '--i': i } as React.CSSProperties} />
          ))}
          <span className="build-impact-dust__ring" />
        </div>
      )}
    </div>
  );
}
