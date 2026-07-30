/**
 * Unit tests for Development bridge helpers.
 * Location: src/features/build/development/assetBridgeClient.test.ts
 */
import { describe, expect, it } from 'vitest';
import { slugifyPartId, stageIndexForStatus } from './assetBridgeClient';

describe('slugifyPartId', () => {
  it('slugifies German names', () => {
    expect(slugifyPartId('Sogkammer')).toBe('sogkammer');
    expect(slugifyPartId('Schatten-Saug Gerät')).toBe('schatten-saug-geraet');
  });
});

describe('stageIndexForStatus', () => {
  it('maps pipeline statuses to stage strip index', () => {
    expect(stageIndexForStatus('draft')).toBe(0);
    expect(stageIndexForStatus('concept-sheet-awaiting-review')).toBe(1);
    expect(stageIndexForStatus('model-awaiting-review')).toBe(5);
    expect(stageIndexForStatus('published')).toBe(5);
  });
});
