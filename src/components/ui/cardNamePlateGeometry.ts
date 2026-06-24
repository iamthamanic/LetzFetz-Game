/**
 * Procedural geometry for SVG card name plates (deterministic per cardId/name).
 * Location: src/components/ui/cardNamePlateGeometry.ts
 */

export function hashString(input: string): number {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash);
}

/** Black stamp frame — irregular rectangle (HF hand-cut edge). */
export function buildFramePoints(seed: number): string {
  const topY = 72;
  const bottomY = 232;
  const leftX = 118;
  const rightX = 1082;
  const jitter = (shift: number, span: number) => shift + (seed >> shift) % span;

  const top: [number, number][] = [
    [leftX, topY + jitter(1, 8)],
    [280, topY - 6 + jitter(2, 6)],
    [460, topY + jitter(3, 8)],
    [640, topY - 4 + jitter(4, 6)],
    [820, topY + jitter(5, 8)],
    [rightX, topY + jitter(6, 8)],
  ];

  const right: [number, number][] = [
    [rightX + 14, 118],
    [rightX + 8, 168],
    [rightX + 16, bottomY - 20],
  ];

  const bottom: [number, number][] = [
    [920, bottomY + 10],
    [740, bottomY + 4],
    [560, bottomY + 12],
    [340, bottomY + 6],
    [leftX, bottomY + jitter(7, 8)],
  ];

  const left: [number, number][] = [
    [leftX - 12, bottomY - 24],
    [leftX - 8, 156],
    [leftX - 14, 108],
  ];

  return [...top, ...right, ...bottom, ...left].map(([x, y]) => `${x},${y}`).join(' ');
}

/** Large asymmetric starburst behind the frame (HF explosion, not crown). */
export function buildStarburstPoints(seed: number, cx = 600, cy = 152): string {
  const spikeCount = 28;
  const points: [number, number][] = [];

  for (let index = 0; index < spikeCount; index += 1) {
    const mixed = hashString(`${seed}-star-${index}`);
    const angle = (index / spikeCount) * Math.PI * 2 + ((seed % 17) - 8) * 0.04;
    const isOuter = index % 2 === 0;
    const innerR = 118 + (mixed % 36);
    const outerR = 248 + ((mixed >> 4) % 90) + (index % 5) * 18;
    const radius = isOuter ? outerR : innerR;
    const verticalSquash = 0.52 + ((mixed >> 8) % 12) * 0.01;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius * verticalSquash;
    points.push([Math.round(x), Math.round(y)]);
  }

  return points.map(([x, y]) => `${x},${y}`).join(' ');
}

/** Paint drip paths below the frame. */
export function buildDripPaths(seed: number): string[] {
  const drips: string[] = [];
  const anchors = [420, 520, 640, 760, 880];

  for (let index = 0; index < anchors.length; index += 1) {
    const mixed = hashString(`${seed}-drip-${index}`);
    const x = anchors[index] + (mixed % 24) - 12;
    const tipY = 268 + ((mixed >> 3) % 28);
    const width = 10 + ((mixed >> 6) % 14);
    drips.push(
      `M ${x - width / 2},238 Q ${x - 4},${tipY - 8} ${x},${tipY} Q ${x + 5},${tipY - 10} ${x + width / 2},238 Z`,
    );
  }

  return drips;
}

/** Red specks around the burst (outside frame). */
export function buildSplatter(seed: number): Array<[number, number, number]> {
  const splatter: Array<[number, number, number]> = [];

  for (let index = 0; index < 56; index += 1) {
    const mixed = hashString(`${seed}-speck-${index}`);
    const x = 40 + (mixed % 1120);
    const y = 8 + ((mixed >> 5) % 300);
    const radius = 1 + ((mixed >> 11) % 7);
    splatter.push([x, y, radius]);
  }

  return splatter;
}

/** Glitch scan bars on left or right outer edge. */
export function buildGlitchBars(
  seed: number,
  side: 'left' | 'right',
): Array<[number, number, number, number]> {
  const bars: Array<[number, number, number, number]> = [];
  const count = 7;

  for (let index = 0; index < count; index += 1) {
    const mixed = hashString(`${seed}-glitch-${side}-${index}`);
    const y = 88 + ((mixed % 140) + index * 18);
    const height = 4 + ((mixed >> 4) % 7);
    const width = 28 + ((mixed >> 6) % 72);

    if (side === 'left') {
      bars.push([4 + (mixed % 18), y, width, height]);
    } else {
      const x = 1120 - width - (mixed % 22);
      bars.push([x, y, width, height]);
    }
  }

  return bars;
}

export function namePlateTextMetrics(nameLength: number): { textLength: number; fontSize: number } {
  if (nameLength > 15) return { textLength: 920, fontSize: 122 };
  if (nameLength > 11) return { textLength: 860, fontSize: 142 };
  return { textLength: 780, fontSize: 162 };
}

/** Slight CCW tilt like HF reference. */
export function namePlateRotation(seed: number): number {
  return -2.8 + ((seed % 9) - 4) * 0.15;
}
