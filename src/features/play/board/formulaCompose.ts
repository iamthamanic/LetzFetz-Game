/**
 * Property-driven Formelgestell compose layers from VisualRecipe (§28.1).
 * Location: src/features/play/board/formulaCompose.ts
 *
 * Placeholder path until Meshy GLBs (#286) — CSS layers, not Bound/Fetz-3D.
 */
import type { Element, VisualRecipe } from '../../../game/types';

export type FormulaComposeRole = 'vessel' | 'core' | 'ring';

export interface FormulaComposeLayer {
  role: FormulaComposeRole;
  labelDe: string;
  /** Tailwind-ish tone key for UI chrome. */
  tone: string;
  /** Short DE hint from recipe properties. */
  hintDe: string;
  active: boolean;
}

const ELEMENT_DE: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

const SHAPE_DE: Record<VisualRecipe['shape'], string> = {
  drill: 'Bohrer',
  slash: 'Schnitt',
  sphere: 'Kugel',
  cone: 'Kegel',
  wall: 'Wall',
};

const DELIVERY_DE: Record<VisualRecipe['delivery'], string> = {
  projectile: 'Projektil',
  beam: 'Strahl',
  melee: 'Nahkampf',
  area: 'Fläche',
  barrier: 'Barriere',
};

const TRANSFORM_DE: Record<NonNullable<VisualRecipe['transformation']>, string> = {
  duplicate: 'Echo',
  spread: 'Ausbreitung',
  chain: 'Kette',
  reflect: 'Spiegel',
  overcharge: 'Überladung',
};

/** Map VisualRecipe → vessel / core / ring layers for Formelgestell UI. */
export function composeFormulaGestellLayers(
  recipe: VisualRecipe | null,
): FormulaComposeLayer[] {
  if (!recipe) {
    return [
      { role: 'vessel', labelDe: 'Essenzbehälter', tone: 'idle', hintDe: 'leer', active: false },
      { role: 'core', labelDe: 'Technikkern', tone: 'idle', hintDe: 'leer', active: false },
      { role: 'ring', labelDe: 'Katalysatorring', tone: 'idle', hintDe: 'leer', active: false },
    ];
  }

  const vesselActive = Boolean(recipe.secondaryElement || recipe.material);
  const vesselHint = [
    recipe.secondaryElement ? ELEMENT_DE[recipe.secondaryElement] : null,
    recipe.material ?? null,
  ]
    .filter((p): p is string => Boolean(p))
    .join(' · ');

  const coreHint = [
    SHAPE_DE[recipe.shape] ?? recipe.shape,
    DELIVERY_DE[recipe.delivery] ?? recipe.delivery,
    recipe.primaryElement ? `Primär ${ELEMENT_DE[recipe.primaryElement]}` : null,
  ]
    .filter((p): p is string => Boolean(p))
    .join(' · ');

  const ringActive = Boolean(recipe.timing || recipe.transformation);
  const ringHint = [
    recipe.transformation ? TRANSFORM_DE[recipe.transformation] : null,
    recipe.timing ?? null,
  ]
    .filter((p): p is string => Boolean(p))
    .join(' · ');

  return [
    {
      role: 'vessel',
      labelDe: 'Essenzbehälter',
      tone: vesselActive ? `element-${recipe.secondaryElement ?? 'neutral'}` : 'idle',
      hintDe: vesselHint || 'ohne Essenz',
      active: vesselActive,
    },
    {
      role: 'core',
      labelDe: 'Technikkern',
      tone: 'core',
      hintDe: coreHint || 'Kern',
      active: true,
    },
    {
      role: 'ring',
      labelDe: 'Katalysatorring',
      tone: ringActive ? 'ring' : 'idle',
      hintDe: ringHint || 'ohne Katalysator',
      active: ringActive,
    },
  ];
}
