/**
 * Unit tests for targeting-arrow DOM measurement helpers.
 * Location: src/features/play/board/zones/measureTargetingArrowCoords.test.ts
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import { measureTargetingArrowCoords } from './measureTargetingArrowCoords';

function stubRect(
  el: HTMLElement,
  box: { left: number; top: number; width: number; height: number },
): void {
  el.getBoundingClientRect = () =>
    ({
      left: box.left,
      top: box.top,
      width: box.width,
      height: box.height,
      right: box.left + box.width,
      bottom: box.top + box.height,
      x: box.left,
      y: box.top,
      toJSON: () => ({}),
    }) as DOMRect;
}

describe('measureTargetingArrowCoords', () => {
  it('points from selected hand card to challenge-selected formula/construct target', () => {
    const root = document.createElement('div');
    stubRect(root, { left: 0, top: 0, width: 800, height: 600 });

    const hand = document.createElement('div');
    hand.setAttribute('data-hand-card-id', 'atk-1');
    hand.setAttribute('data-selected-attack', 'true');
    stubRect(hand, { left: 100, top: 500, width: 80, height: 100 });
    root.appendChild(hand);

    const targetable = document.createElement('div');
    targetable.setAttribute('data-targetable', 'true');
    stubRect(targetable, { left: 200, top: 40, width: 60, height: 80 });
    root.appendChild(targetable);

    const selected = document.createElement('div');
    selected.setAttribute('data-targetable', 'true');
    selected.setAttribute('data-challenge-selected', 'true');
    selected.setAttribute('data-formula-slot', 'technik');
    stubRect(selected, { left: 400, top: 50, width: 60, height: 80 });
    root.appendChild(selected);

    document.body.appendChild(root);

    const result = measureTargetingArrowCoords({
      root,
      attackInstanceId: 'atk-1',
      targetBoundInstanceId: 'formula-tech-1',
    });

    expect(result.rootRect).toEqual({ width: 800, height: 600 });
    expect(result.coords).toEqual({
      source: { x: 140, y: 600 },
      target: { x: 430, y: 90 },
    });

    root.remove();
  });

  it('falls back to bot character dock for direct attack', () => {
    const root = document.createElement('div');
    stubRect(root, { left: 10, top: 20, width: 700, height: 500 });

    const hand = document.createElement('div');
    hand.setAttribute('data-hand-card-id', 'atk-2');
    stubRect(hand, { left: 60, top: 420, width: 70, height: 90 });
    root.appendChild(hand);

    const dock = document.createElement('div');
    dock.setAttribute('data-character-dock', 'bot');
    stubRect(dock, { left: 610, top: 40, width: 80, height: 120 });
    root.appendChild(dock);

    document.body.appendChild(root);

    const result = measureTargetingArrowCoords({
      root,
      attackInstanceId: 'atk-2',
    });

    expect(result.coords).toEqual({
      source: { x: 85, y: 490 },
      target: { x: 640, y: 80 },
    });

    root.remove();
  });

  it('returns null coords when attack hand card is missing', () => {
    const root = document.createElement('div');
    stubRect(root, { left: 0, top: 0, width: 100, height: 100 });
    document.body.appendChild(root);

    const result = measureTargetingArrowCoords({
      root,
      attackInstanceId: 'missing',
    });

    expect(result.coords).toBeNull();
    root.remove();
  });
});
