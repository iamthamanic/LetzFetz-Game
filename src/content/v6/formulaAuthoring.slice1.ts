/**
 * Slice-1 formula authoring SoT (TE / TK / EK bases + catalyst transforms).
 * Location: src/content/v6/formulaAuthoring.slice1.ts
 *
 * Generator expands TE×catalyst → TEK + Überformel. Missing required keys fail closed.
 */
import type {
  V6CatalystTransformAuthoring,
  V6EkBaseAuthoring,
  V6FormulaAuthoringCatalog,
  V6PrimaryEffectAuthoring,
  V6TeBaseAuthoring,
  V6TkBaseAuthoring,
} from './schemas/formulaRecipeAuthoring';
import {
  V6_SLICE1_CATALYST_IDS,
  V6_SLICE1_ESSENCE_IDS,
  V6_SLICE1_TECHNIQUE_IDS,
} from './slice1Ids';

type TechId = (typeof V6_SLICE1_TECHNIQUE_IDS)[number];
type EssId = (typeof V6_SLICE1_ESSENCE_IDS)[number];
type CatId = (typeof V6_SLICE1_CATALYST_IDS)[number];

function teId(t: TechId, e: EssId): string {
  return `v6-te-${t.replace('v6-technik-', '')}-${e.replace('v6-essenz-', '')}`;
}

function tkId(t: TechId, c: CatId): string {
  return `v6-tk-${t.replace('v6-technik-', '')}-${c.replace('v6-katalysator-', '')}`;
}

function ekId(e: EssId, c: CatId): string {
  return `v6-ek-${e.replace('v6-essenz-', '')}-${c.replace('v6-katalysator-', '')}`;
}

/** Playtest TE primaries by technique role × essence color. */
const TE_PRIMARY: Record<TechId, Record<EssId, V6PrimaryEffectAuthoring>> = {
  'v6-technik-impulsgeschoss': {
    'v6-essenz-feuer': { kind: 'damage', value: 3, target: 'opponent', offensive: true },
    'v6-essenz-wasser': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-luft': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
  },
  'v6-technik-adrenalinschrei': {
    'v6-essenz-feuer': { kind: 'prep_attack', value: 2, target: 'self' },
    'v6-essenz-wasser': { kind: 'prep_boost', value: 1, target: 'self' },
    'v6-essenz-luft': { kind: 'prep_attack', value: 1, target: 'self' },
  },
  'v6-technik-magiepanzer': {
    'v6-essenz-feuer': { kind: 'shield', value: 1, target: 'self' },
    'v6-essenz-wasser': { kind: 'heal', value: 2, target: 'self' },
    'v6-essenz-luft': { kind: 'shield', value: 2, target: 'self' },
  },
};

const TE_NAMES: Record<TechId, Record<EssId, string>> = {
  'v6-technik-impulsgeschoss': {
    'v6-essenz-feuer': 'Glutimpuls',
    'v6-essenz-wasser': 'Spritzschuss',
    'v6-essenz-luft': 'Luftnadel',
  },
  'v6-technik-adrenalinschrei': {
    'v6-essenz-feuer': 'Kampfschrei',
    'v6-essenz-wasser': 'Klärschrei',
    'v6-essenz-luft': 'Tempeschrei',
  },
  'v6-technik-magiepanzer': {
    'v6-essenz-feuer': 'Hitzepanzer',
    'v6-essenz-wasser': 'Nasspanzer',
    'v6-essenz-luft': 'Windpanzer',
  },
};

const ESSENCE_RIDERS: Record<
  EssId,
  { id: string; summary: string; defenseSuppressible: boolean }
> = {
  'v6-essenz-feuer': {
    id: 'rider-brennen',
    summary: 'Bei Lebensschaden: Brennen, falls keine Reaktion.',
    defenseSuppressible: true,
  },
  'v6-essenz-wasser': {
    id: 'rider-reinigen',
    summary: 'Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).',
    defenseSuppressible: false,
  },
  'v6-essenz-luft': {
    id: 'rider-w6',
    summary: 'Nächster eigener Aktions-W6 +1 (max +2).',
    defenseSuppressible: true,
  },
};

function buildTeBases(): V6TeBaseAuthoring[] {
  const rows: V6TeBaseAuthoring[] = [];
  for (const t of V6_SLICE1_TECHNIQUE_IDS) {
    for (const e of V6_SLICE1_ESSENCE_IDS) {
      const primary = TE_PRIMARY[t][e];
      rows.push({
        recipeId: teId(t, e),
        techniqueId: t,
        essenceId: e,
        name: TE_NAMES[t][e],
        primary,
        rider: primary.target === 'opponent' ? ESSENCE_RIDERS[e] : ESSENCE_RIDERS[e],
        intensity: primary.kind === 'damage' ? undefined : 1,
      });
    }
  }
  return rows;
}

function buildTkBases(): V6TkBaseAuthoring[] {
  const rows: V6TkBaseAuthoring[] = [];
  const techPrimary: Record<TechId, V6PrimaryEffectAuthoring> = {
    'v6-technik-impulsgeschoss': {
      kind: 'damage',
      value: 1,
      target: 'opponent',
      offensive: true,
    },
    'v6-technik-adrenalinschrei': { kind: 'prep_attack', value: 1, target: 'self' },
    'v6-technik-magiepanzer': { kind: 'shield', value: 1, target: 'self' },
  };
  for (const t of V6_SLICE1_TECHNIQUE_IDS) {
    for (const c of V6_SLICE1_CATALYST_IDS) {
      rows.push({
        recipeId: tkId(t, c),
        techniqueId: t,
        catalystId: c,
        name: `TK ${t.replace('v6-technik-', '')}+${c.replace('v6-katalysator-', '')}`,
        primary: { ...techPrimary[t] },
      });
    }
  }
  return rows;
}

function buildEkBases(): V6EkBaseAuthoring[] {
  const rows: V6EkBaseAuthoring[] = [];
  const essPrimary: Record<EssId, V6PrimaryEffectAuthoring> = {
    'v6-essenz-feuer': { kind: 'damage', value: 1, target: 'opponent', offensive: true },
    'v6-essenz-wasser': { kind: 'heal', value: 1, target: 'self' },
    'v6-essenz-luft': { kind: 'prep_boost', value: 1, target: 'self' },
  };
  for (const e of V6_SLICE1_ESSENCE_IDS) {
    for (const c of V6_SLICE1_CATALYST_IDS) {
      rows.push({
        recipeId: ekId(e, c),
        essenceId: e,
        catalystId: c,
        name: `EK ${e.replace('v6-essenz-', '')}+${c.replace('v6-katalysator-', '')}`,
        primary: { ...essPrimary[e] },
        rider: ESSENCE_RIDERS[e],
      });
    }
  }
  return rows;
}

function buildCatalystTransforms(): V6CatalystTransformAuthoring[] {
  return [
    {
      transformId: 'xform-ueberladung',
      catalystId: 'v6-katalysator-ueberladung',
      primaryDelta: 2,
      selfDamage: 1,
      summary: 'Primär +2; danach 1 Selbstschaden.',
    },
    {
      transformId: 'xform-verdichtung',
      catalystId: 'v6-katalysator-verdichtung',
      primaryDelta: 1,
      stabilityBuffUsed: 1,
      summary: 'Primär +1; verwendete Komponenten +1 Stabilität.',
    },
    {
      transformId: 'xform-sofortzuender',
      catalystId: 'v6-katalysator-sofortzuender',
      primaryDelta: -1,
      drawDiscardAfter: true,
      summary: 'Primär −1; danach ziehen+abwerfen.',
    },
    {
      transformId: 'xform-opfergabe',
      catalystId: 'v6-katalysator-opfergabe',
      primaryDelta: 0,
      offerDiscardBonus: 2,
      summary: 'Optional Handabwurf: Primär +2.',
    },
  ];
}

export const V6_FORMULA_AUTHORING_SLICE1: V6FormulaAuthoringCatalog = {
  version: 1,
  slice: 'slice1',
  teBases: buildTeBases(),
  tkBases: buildTkBases(),
  ekBases: buildEkBases(),
  catalystTransforms: buildCatalystTransforms(),
};
