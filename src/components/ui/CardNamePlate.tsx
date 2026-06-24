/**
 * HF raster name plate PNG + procedural SVG fallback.
 * Location: src/components/ui/CardNamePlate.tsx
 */
import React, { useMemo, useId } from 'react';
import { BrandLogoText } from './BrandLogoText';
import {
  buildDripPaths,
  buildFramePoints,
  buildGlitchBars,
  buildSplatter,
  buildStarburstPoints,
  hashString,
  namePlateRotation,
  namePlateTextMetrics,
} from './cardNamePlateGeometry';

export type CardNamePlateSize = 'sm' | 'md' | 'lg';

interface CardNamePlateProps {
  cardId: string;
  name: string;
  size?: CardNamePlateSize;
  /** parchment = red on beige bar; dark = cream on stone UI */
  surface?: 'parchment' | 'dark';
  className?: string;
}

function sanitizeSvgId(input: string): string {
  return input.replace(/[^a-zA-Z0-9_-]/g, '');
}

function CardNamePlateSvg({
  name,
  cardId,
  size,
  className,
}: {
  name: string;
  cardId: string;
  size: CardNamePlateSize;
  className: string;
}) {
  const reactId = useId();
  const upperName = name.trim().toUpperCase() || '—';
  const seed = useMemo(() => hashString(cardId || upperName), [cardId, upperName]);

  const svgId = sanitizeSvgId(`lf-nameplate-${reactId}`);
  const textFilterId = `${svgId}-rough-text`;
  const edgeFilterId = `${svgId}-rough-edge`;
  const redGlitchFilterId = `${svgId}-red-glitch`;

  const framePoints = useMemo(() => buildFramePoints(seed), [seed]);
  const starburstPoints = useMemo(() => buildStarburstPoints(seed), [seed]);
  const dripPaths = useMemo(() => buildDripPaths(seed), [seed]);
  const splatter = useMemo(() => buildSplatter(seed), [seed]);
  const glitchLeft = useMemo(() => buildGlitchBars(seed, 'left'), [seed]);
  const glitchRight = useMemo(() => buildGlitchBars(seed, 'right'), [seed]);
  const rotation = useMemo(() => namePlateRotation(seed), [seed]);
  const { textLength, fontSize } = namePlateTextMetrics(upperName.length);

  return (
    <div
      className={['lf-card-nameplate', `lf-card-nameplate--${size}`, className]
        .filter(Boolean)
        .join(' ')}
      aria-label={upperName}
    >
      <svg
        className="lf-card-nameplate__svg"
        viewBox="0 0 1200 320"
        role="img"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter
            id={edgeFilterId}
            x="-12%"
            y="-35%"
            width="124%"
            height="170%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.022 0.08"
              numOctaves="3"
              seed={(seed % 97) + 1}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          <filter
            id={textFilterId}
            x="-6%"
            y="-25%"
            width="112%"
            height="150%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05 0.18"
              numOctaves="3"
              seed={(seed % 113) + 11}
              result="textNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="textNoise"
              scale="2.5"
              xChannelSelector="R"
              yChannelSelector="G"
              result="wobbledText"
            />
            <feDropShadow
              dx="4"
              dy="5"
              stdDeviation="0.4"
              floodColor="#7a5240"
              floodOpacity="0.72"
              result="shadowedText"
            />
            <feMerge>
              <feMergeNode in="shadowedText" />
            </feMerge>
          </filter>

          <filter
            id={redGlitchFilterId}
            x="-15%"
            y="-40%"
            width="130%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.06 0.42"
              numOctaves="3"
              seed={(seed % 131) + 29}
              result="redNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="redNoise"
              scale="11"
              xChannelSelector="R"
              yChannelSelector="G"
              result="warpedRed"
            />
            <feMerge>
              <feMergeNode in="warpedRed" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`rotate(${rotation} 600 152)`}>
          <g className="lf-card-nameplate__red-glitch" filter={`url(#${redGlitchFilterId})`}>
            <polygon
              className="lf-card-nameplate__starburst lf-card-nameplate__starburst--ghost-cyan"
              points={starburstPoints}
              transform="translate(6 2)"
            />
            <polygon
              className="lf-card-nameplate__starburst lf-card-nameplate__starburst--ghost-magenta"
              points={starburstPoints}
              transform="translate(-5 -2)"
            />
            <polygon className="lf-card-nameplate__starburst" points={starburstPoints} />

            <g className="lf-card-nameplate__splatter">
              {splatter.map(([x, y, radius], index) => (
                <circle key={`${x}-${y}-${index}`} cx={x} cy={y} r={radius} />
              ))}
            </g>

            {dripPaths.map((path, index) => (
              <path key={`drip-${index}`} className="lf-card-nameplate__drip" d={path} />
            ))}
          </g>

          <g className="lf-card-nameplate__glitch lf-card-nameplate__glitch--burst">
            {glitchLeft.slice(0, 4).map(([x, y, width, height], index) => (
              <rect key={`gl-b-${index}`} x={x + 180} y={y} width={width} height={height} />
            ))}
            {glitchRight.slice(0, 4).map(([x, y, width, height], index) => (
              <rect key={`gl-b-r-${index}`} x={x - 120} y={y} width={width} height={height} />
            ))}
          </g>

          <g className="lf-card-nameplate__glitch lf-card-nameplate__glitch--left">
            {glitchLeft.map(([x, y, width, height], index) => (
              <rect key={`gl-l-${index}`} x={x} y={y} width={width} height={height} />
            ))}
          </g>

          <g className="lf-card-nameplate__glitch lf-card-nameplate__glitch--right">
            {glitchRight.map(([x, y, width, height], index) => (
              <rect key={`gl-r-${index}`} x={x} y={y} width={width} height={height} />
            ))}
          </g>

          <polygon
            className="lf-card-nameplate__outer-outline"
            points={framePoints}
            filter={`url(#${edgeFilterId})`}
          />

          <polygon
            className="lf-card-nameplate__outer"
            points={framePoints}
            filter={`url(#${edgeFilterId})`}
          />

          <text
            className="lf-card-nameplate__text lf-card-nameplate__text-rim"
            x="604"
            y="166"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={fontSize}
            textLength={textLength}
            lengthAdjust="spacingAndGlyphs"
          >
            {upperName}
          </text>

          <text
            className="lf-card-nameplate__text"
            x="600"
            y="162"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={fontSize}
            textLength={textLength}
            lengthAdjust="spacingAndGlyphs"
            filter={`url(#${textFilterId})`}
          >
            {upperName}
          </text>
        </g>
      </svg>
    </div>
  );
}

function CardNamePlateWrittenText({
  name,
  size,
  surface,
  className,
}: {
  name: string;
  size: CardNamePlateSize;
  surface: 'parchment' | 'dark';
  className: string;
}) {
  const textClass =
    size === 'sm'
      ? 'text-[8px] leading-none tracking-wide'
      : size === 'md'
        ? 'text-[10px] leading-none tracking-wide md:text-xs'
        : 'text-sm leading-none tracking-wide md:text-base';

  const brandClass =
    surface === 'dark' ? 'font-brand-on-dark' : 'font-brand-on-parchment';

  return (
    <div className={`card-name-on-parchment ${className}`}>
      <h3 className={`${brandClass} text-center uppercase ${textClass}`}>{name}</h3>
    </div>
  );
}

function CardNamePlateTextFallback({
  name,
  size,
  className,
}: {
  name: string;
  size: CardNamePlateSize;
  className: string;
}) {
  const textClass =
    size === 'sm'
      ? 'text-[8px] leading-none tracking-wide'
      : size === 'md'
        ? 'text-[10px] leading-none tracking-wide'
        : 'text-base leading-none tracking-normal md:text-lg';

  return (
    <div className={`card-name-on-parchment ${className}`}>
      <BrandLogoText as="h3" surface="parchment" glitch className={textClass}>
        {name}
      </BrandLogoText>
    </div>
  );
}

export function CardNamePlate({
  cardId,
  name,
  size = 'lg',
  surface = 'parchment',
  className = '',
}: CardNamePlateProps) {
  void cardId;
  return (
    <CardNamePlateWrittenText name={name} size={size} surface={surface} className={className} />
  );
}
