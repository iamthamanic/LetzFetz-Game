/**
 * V5 formula visual contracts — data before Meshy / runtime VFX.
 * Location: src/game/types/formulaVisual.ts
 * Spec: docs/letz-fetz-v5-spielkonzept.md §28
 */

import type { Element } from './elements';

export type TechniqueDelivery = 'projectile' | 'beam' | 'melee' | 'area' | 'barrier';
export type TechniqueShape = 'drill' | 'slash' | 'sphere' | 'cone' | 'wall';
export type Axis = 'x' | 'y' | 'z';
export type ScaleClass = 'small' | 'medium' | 'large';

export type CatalystTiming = 'instant' | 'delayed' | 'repeating' | 'continuous';
export type CatalystTransformation =
  | 'duplicate'
  | 'spread'
  | 'chain'
  | 'reflect'
  | 'overcharge';

/** Technik = Körper / Ausführungsform — no element. */
export interface TechniqueVisual {
  id: string;
  delivery: TechniqueDelivery;
  shape: TechniqueShape;
  castOrigin: string;
  forwardAxis: Axis;
  scaleClass: ScaleClass;
}

/** Essenz = Energie / Sekundärelement. */
export interface EssenceVisual {
  id: string;
  element: Element;
  materialProfile: string;
  particleProfile: string;
  trailProfile: string;
  impactProfile: string;
}

/** Katalysator = Verhalten. */
export interface CatalystVisual {
  id: string;
  timing: CatalystTiming;
  transformation: CatalystTransformation;
  animationProfile: string;
}

/**
 * Property-based cast recipe (no hard-coded combo IDs).
 * Primary element comes from the action card when casting.
 */
export interface VisualRecipe {
  delivery: TechniqueDelivery;
  shape: TechniqueShape;
  primaryElement?: Element;
  secondaryElement?: Element;
  material?: string;
  timing?: CatalystTiming;
  transformation?: CatalystTransformation;
  reactionId?: string;
}
