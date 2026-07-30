/**
 * R3F bridge: create Effekseer effect on the shared WebGL context and drive playhead.
 * Location: src/features/build/vfx/preview/EffekseerPlayback.tsx
 */
import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  getEffekseerAdapter,
  type EffekseerEffectInstance,
  type EffekseerLoadState,
} from './effekseerAdapter';

export interface EffekseerPlaybackProps {
  effectPath: string;
  loadState: EffekseerLoadState;
  playheadMs: number;
  /** Notifies parent whether a live Effekseer instance is driving the canvas. */
  onLiveChange?: (live: boolean) => void;
}

function asWebGlContext(
  raw: RenderingContext | null,
): WebGLRenderingContext | WebGL2RenderingContext | null {
  if (raw instanceof WebGLRenderingContext || raw instanceof WebGL2RenderingContext) {
    return raw;
  }
  return null;
}

export function EffekseerPlayback({
  effectPath,
  loadState,
  playheadMs,
  onLiveChange,
}: EffekseerPlaybackProps) {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const instanceRef = useRef<EffekseerEffectInstance | null>(null);
  const playheadRef = useRef(playheadMs);
  const [live, setLive] = useState(false);

  playheadRef.current = playheadMs;

  useEffect(() => {
    onLiveChange?.(live);
  }, [live, onLiveChange]);

  useEffect(() => {
    if (loadState !== 'ready') {
      instanceRef.current?.dispose();
      instanceRef.current = null;
      setLive(false);
      return;
    }

    const context = asWebGlContext(gl.getContext());
    if (!context) {
      setLive(false);
      return;
    }

    const instance = getEffekseerAdapter().createEffect(effectPath, context);
    if (!instance) {
      setLive(false);
      return;
    }

    instanceRef.current = instance;
    instance.setPlayheadMs(playheadRef.current);
    setLive(instance.isLive);
    invalidate();

    return () => {
      instance.dispose();
      if (instanceRef.current === instance) {
        instanceRef.current = null;
      }
      setLive(false);
    };
  }, [effectPath, loadState, gl, invalidate]);

  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    instance.setPlayheadMs(playheadMs);
    setLive(instance.isLive);
    invalidate();
  }, [playheadMs, invalidate]);

  useFrame((_state, delta) => {
    const instance = instanceRef.current;
    if (!instance || !instance.isLive) return;
    instance.renderFrame(delta * 1000);
  });

  return null;
}
