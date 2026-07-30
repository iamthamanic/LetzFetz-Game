/**
 * SVG overlay: flowing connections from filled Formelplätze into the preview.
 * Location: src/features/build/BuildSlotConnectionOverlay.tsx
 */
import React, { useEffect, useState } from 'react';
import {
  BUILD_SLOT_ORDER,
  type BuildSlotRole,
  type BuildSlots,
} from './model/buildTypes';
import {
  buildSlotConnectionGeometry,
  type SlotAnchorPoint,
  type SlotConnectionGeometry,
} from './buildSlotConnectionPaths';

const STROKE_BY_ROLE: Record<BuildSlotRole, string> = {
  technik: '#34d399',
  essenz: '#38bdf8',
  katalysator: '#fbbf24',
};

const FLOW_DELAY_BY_ROLE: Record<BuildSlotRole, string> = {
  technik: '0ms',
  essenz: '120ms',
  katalysator: '240ms',
};

interface BuildSlotConnectionOverlayProps {
  slots: BuildSlots;
  containerRef: React.RefObject<HTMLElement | null>;
  previewTargetRef: React.RefObject<HTMLElement | null>;
  slotAnchorRefs: React.MutableRefObject<Partial<Record<BuildSlotRole, HTMLElement | null>>>;
}

function readCenter(el: HTMLElement, container: DOMRect): { x: number; y: number } {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - container.left,
    y: rect.top + rect.height / 2 - container.top,
  };
}

export function BuildSlotConnectionOverlay({
  slots,
  containerRef,
  previewTargetRef,
  slotAnchorRefs,
}: BuildSlotConnectionOverlayProps) {
  const [geometry, setGeometry] = useState<SlotConnectionGeometry | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafOuter = 0;
    let rafInner = 0;

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      setSize({ width: containerRect.width, height: containerRect.height });

      const targetEl = previewTargetRef.current;
      if (!targetEl) {
        setGeometry(null);
        return;
      }

      const portEl = targetEl.querySelector<HTMLElement>(
        '[data-testid="build-preview-connection-port"]',
      );
      const target = portEl
        ? readCenter(portEl, containerRect)
        : {
            x: (() => {
              const r = targetEl.getBoundingClientRect();
              return r.left + r.width / 2 - containerRect.left;
            })(),
            y: targetEl.getBoundingClientRect().bottom - containerRect.top,
          };

      const filled: SlotAnchorPoint[] = [];
      for (const role of BUILD_SLOT_ORDER) {
        if (!slots[role]) continue;
        const el = slotAnchorRefs.current[role];
        if (!el) continue;
        filled.push({ role, ...readCenter(el, containerRect) });
      }

      setGeometry(buildSlotConnectionGeometry(filled, target));
    };

    const schedule = () => {
      cancelAnimationFrame(rafOuter);
      cancelAnimationFrame(rafInner);
      rafOuter = requestAnimationFrame(() => {
        rafInner = requestAnimationFrame(measure);
      });
    };

    schedule();

    const observer = new ResizeObserver(schedule);
    observer.observe(container);
    const targetEl = previewTargetRef.current;
    if (targetEl) observer.observe(targetEl);
    for (const role of BUILD_SLOT_ORDER) {
      const el = slotAnchorRefs.current[role];
      if (el) observer.observe(el);
    }

    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(rafOuter);
      cancelAnimationFrame(rafInner);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [slots, containerRef, previewTargetRef, slotAnchorRefs]);

  if (!geometry || size.width <= 0 || size.height <= 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[5] overflow-visible"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      aria-hidden
      data-testid="build-slot-connections"
    >
      {geometry.curves.map((curve) => (
        <path
          key={`${curve.role}-under`}
          d={curve.d}
          fill="none"
          stroke="#0c0a09"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.85}
        />
      ))}
      <path
        d={geometry.stem}
        fill="none"
        stroke="#0c0a09"
        strokeWidth={5.5}
        strokeLinecap="round"
        opacity={0.85}
      />

      {/* Dim solid base in role color */}
      {geometry.curves.map((curve) => (
        <path
          key={`${curve.role}-base`}
          d={curve.d}
          fill="none"
          stroke={STROKE_BY_ROLE[curve.role]}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.35}
        />
      ))}
      <path
        d={geometry.stem}
        fill="none"
        stroke="#a78bfa"
        strokeWidth={2.25}
        strokeLinecap="round"
        opacity={0.35}
      />

      {/* Flowing dashes toward the preview */}
      {geometry.curves.map((curve) => (
        <path
          key={curve.role}
          d={curve.d}
          fill="none"
          stroke={STROKE_BY_ROLE[curve.role]}
          strokeWidth={2.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="build-connection-flow"
          style={{ animationDelay: FLOW_DELAY_BY_ROLE[curve.role] }}
          data-testid={`build-slot-connection-${curve.role}`}
        />
      ))}

      <path
        d={geometry.stem}
        fill="none"
        stroke="#c4b5fd"
        strokeWidth={3}
        strokeLinecap="round"
        className="build-connection-flow build-connection-flow--stem"
        data-testid="build-slot-connection-stem"
      />

      <circle
        cx={geometry.merge.x}
        cy={geometry.merge.y}
        r={4.5}
        fill="#a78bfa"
        stroke="#0c0a09"
        strokeWidth={1.5}
        className="build-connection-merge-pulse"
      />

      <path
        d={geometry.arrow}
        fill="#c4b5fd"
        stroke="#0c0a09"
        strokeWidth={1}
        data-testid="build-slot-connection-arrow"
      />
    </svg>
  );
}
