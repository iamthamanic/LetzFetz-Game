import type { CardInstance, ContentPack } from '../types';

export type Rng = () => number;

export function createSeededRng(seed: number): Rng {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export function shuffle<T>(items: T[], rng: Rng): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

let instanceCounter = 0;

export function nextInstanceId(): string {
  instanceCounter += 1;
  return `inst-${instanceCounter}`;
}

export function resetInstanceIdCounter(): void {
  instanceCounter = 0;
}

export function buildMainDeckInstances(pack: ContentPack, rng: Rng): CardInstance[] {
  const defs = [
    ...pack.elementCards,
    ...(pack.engineParts ?? []),
    ...pack.glitches,
  ];
  const instances = defs.map((d) => ({
    instanceId: nextInstanceId(),
    defId: d.id,
  }));
  return shuffle(instances, rng);
}

export function drawCards(
  deck: CardInstance[],
  discard: CardInstance[],
  count: number,
  rng: Rng,
): { deck: CardInstance[]; discard: CardInstance[]; drawn: CardInstance[]; deckEmptyHits: number } {
  let currentDeck = [...deck];
  let currentDiscard = [...discard];
  const drawn: CardInstance[] = [];
  let deckEmptyHits = 0;

  for (let i = 0; i < count; i++) {
    if (currentDeck.length === 0) {
      if (currentDiscard.length === 0) break;
      currentDeck = shuffle(currentDiscard, rng);
      currentDiscard = [];
      deckEmptyHits += 1;
    }
    const card = currentDeck.shift();
    if (card) drawn.push(card);
  }

  return { deck: currentDeck, discard: currentDiscard, drawn, deckEmptyHits };
}
