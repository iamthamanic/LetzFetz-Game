/**
 * Batch / preview render artifact from VFX Studio worker.
 * Location: src/features/build/vfx/types/renderOutput.ts
 */

import {
  assertObject,
  parseRequiredIsoTimestamp,
  parseRequiredPositiveInt,
  parseRequiredString,
} from './parseHelpers';

export const VFX_RENDER_FORMATS = ['png', 'webp'] as const;
export type VfxRenderFormat = (typeof VFX_RENDER_FORMATS)[number];

export interface RenderOutput {
  kind: 'renderOutput';
  id: string;
  url: string;
  format: VfxRenderFormat;
  width: number;
  height: number;
  capturedAt: string;
}

export function isVfxRenderFormat(value: unknown): value is VfxRenderFormat {
  return typeof value === 'string' && (VFX_RENDER_FORMATS as readonly string[]).includes(value);
}

export function parseRenderOutput(raw: unknown): RenderOutput {
  const record = assertObject(raw, 'RenderOutput');
  if (record.kind !== 'renderOutput') {
    throw new Error('RenderOutput.kind must be "renderOutput"');
  }
  const format = record.format;
  if (!isVfxRenderFormat(format)) {
    throw new Error(
      `RenderOutput.format must be one of: ${VFX_RENDER_FORMATS.join(', ')}`,
    );
  }
  return {
    kind: 'renderOutput',
    id: parseRequiredString(record, 'id'),
    url: parseRequiredString(record, 'url'),
    format,
    width: parseRequiredPositiveInt(record, 'width'),
    height: parseRequiredPositiveInt(record, 'height'),
    capturedAt: parseRequiredIsoTimestamp(record, 'capturedAt'),
  };
}

export function isRenderOutput(value: unknown): value is RenderOutput {
  try {
    parseRenderOutput(value);
    return true;
  } catch {
    return false;
  }
}

export function serializeRenderOutput(output: RenderOutput): RenderOutput {
  return parseRenderOutput(JSON.parse(JSON.stringify(output)));
}
