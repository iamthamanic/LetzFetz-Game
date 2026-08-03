/**
 * Slice-1 formula authoring SoT (TE / TK / EK bases + catalyst transforms).
 * Location: src/content/v6/formulaAuthoring.slice1.ts
 *
 * Current catalog: 3 Techniken × 6 Essenzen × 4 Katalysatoren → 198 generated recipes.
 * Generator expands TE×catalyst → TEK + Überformel. Missing required keys fail closed.
 * Full 10T×10K matrix is a later catalog-expansion issue — do not invent unsupported keys.
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
    'v6-essenz-erde': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-luft': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-licht': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-schatten': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
  },
  'v6-technik-adrenalinschrei': {
    'v6-essenz-feuer': { kind: 'prep_attack', value: 2, target: 'self' },
    /** Base 2 so Sofortzünder (−1) still leaves prep 1. */
    'v6-essenz-wasser': { kind: 'prep_boost', value: 2, target: 'self' },
    'v6-essenz-erde': { kind: 'prep_attack', value: 2, target: 'self' },
    'v6-essenz-luft': { kind: 'prep_attack', value: 2, target: 'self' },
    'v6-essenz-licht': { kind: 'prep_boost', value: 2, target: 'self' },
    'v6-essenz-schatten': { kind: 'prep_attack', value: 2, target: 'self' },
  },
  'v6-technik-magiepanzer': {
    /** Fessel TE — manual pick of occupied enemy formula slot (engine). Base 2 for Sofortzünder. */
    'v6-essenz-feuer': { kind: 'fessel', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-wasser': { kind: 'heal', value: 2, target: 'self' },
    'v6-essenz-erde': { kind: 'shield', value: 2, target: 'self' },
    'v6-essenz-luft': { kind: 'shield', value: 2, target: 'self' },
    'v6-essenz-licht': { kind: 'shield', value: 2, target: 'self' },
    'v6-essenz-schatten': { kind: 'fessel', value: 2, target: 'opponent', offensive: true },
  },
};

const TE_NAMES: Record<TechId, Record<EssId, string>> = {
  'v6-technik-impulsgeschoss': {
    'v6-essenz-feuer': 'Glutimpuls',
    'v6-essenz-wasser': 'Spritzschuss',
    'v6-essenz-erde': 'Felsnadel',
    'v6-essenz-luft': 'Luftnadel',
    'v6-essenz-licht': 'Lichtstich',
    'v6-essenz-schatten': 'Schattenstich',
  },
  'v6-technik-adrenalinschrei': {
    'v6-essenz-feuer': 'Kampfschrei',
    'v6-essenz-wasser': 'Klärschrei',
    'v6-essenz-erde': 'Standschrei',
    'v6-essenz-luft': 'Tempeschrei',
    'v6-essenz-licht': 'Klarschrei',
    'v6-essenz-schatten': 'Fluchschrei',
  },
  'v6-technik-magiepanzer': {
    'v6-essenz-feuer': 'Glutfessel',
    'v6-essenz-wasser': 'Nasspanzer',
    'v6-essenz-erde': 'Erdpanzer',
    'v6-essenz-luft': 'Windpanzer',
    'v6-essenz-licht': 'Lichtpanzer',
    'v6-essenz-schatten': 'Schattenfessel',
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
    summary: 'Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.',
    defenseSuppressible: false,
  },
  'v6-essenz-erde': {
    id: 'rider-stabilitaet',
    summary: 'Verwendete Komponenten +1 Stabilität bis nächste Startphase.',
    defenseSuppressible: false,
  },
  'v6-essenz-luft': {
    id: 'rider-w6',
    summary: 'Nächster eigener Aktions-W6 +1 (max +2).',
    defenseSuppressible: true,
  },
  'v6-essenz-licht': {
    id: 'rider-reinigen-licht',
    summary: 'Bei Schildgewinn: entferne optional eine Marke von dir.',
    defenseSuppressible: false,
  },
  'v6-essenz-schatten': {
    id: 'rider-fluch',
    summary: 'Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.',
    defenseSuppressible: true,
  },
};

/** Proper German TK display names (not machine Tech·Cat labels). */
const TK_NAMES: Record<TechId, Record<CatId, string>> = {
  'v6-technik-impulsgeschoss': {
    'v6-katalysator-ueberladung': 'Überimpuls',
    'v6-katalysator-verdichtung': 'Dichtimpuls',
    'v6-katalysator-sofortzuender': 'Zündimpuls',
    'v6-katalysator-opfergabe': 'Opferimpuls',
  },
  'v6-technik-adrenalinschrei': {
    'v6-katalysator-ueberladung': 'Überschrei',
    'v6-katalysator-verdichtung': 'Dichtschrei',
    'v6-katalysator-sofortzuender': 'Zündschrei',
    'v6-katalysator-opfergabe': 'Opferschrei',
  },
  'v6-technik-magiepanzer': {
    'v6-katalysator-ueberladung': 'Überpanzer',
    'v6-katalysator-verdichtung': 'Dichtpanzer',
    'v6-katalysator-sofortzuender': 'Zündpanzer',
    'v6-katalysator-opfergabe': 'Opferpanzer',
  },
};

/** Proper German EK display names (not Ritual·Cat compounds). */
const EK_NAMES: Record<EssId, Record<CatId, string>> = {
  'v6-essenz-feuer': {
    'v6-katalysator-ueberladung': 'Glutüberladung',
    'v6-katalysator-verdichtung': 'Glutverdichtung',
    'v6-katalysator-sofortzuender': 'Funkenzünder',
    'v6-katalysator-opfergabe': 'Brandopfer',
  },
  'v6-essenz-wasser': {
    'v6-katalysator-ueberladung': 'Flutüberladung',
    'v6-katalysator-verdichtung': 'Quellverdichtung',
    'v6-katalysator-sofortzuender': 'Spritzzünder',
    'v6-katalysator-opfergabe': 'Wellenopfer',
  },
  'v6-essenz-erde': {
    'v6-katalysator-ueberladung': 'Felsüberladung',
    'v6-katalysator-verdichtung': 'Felsverdichtung',
    'v6-katalysator-sofortzuender': 'Felszünder',
    'v6-katalysator-opfergabe': 'Felsopfer',
  },
  'v6-essenz-luft': {
    'v6-katalysator-ueberladung': 'Sturmüberladung',
    'v6-katalysator-verdichtung': 'Windverdichtung',
    'v6-katalysator-sofortzuender': 'Windzünder',
    'v6-katalysator-opfergabe': 'Luftopfer',
  },
  'v6-essenz-licht': {
    'v6-katalysator-ueberladung': 'Lichtüberladung',
    'v6-katalysator-verdichtung': 'Lichtverdichtung',
    'v6-katalysator-sofortzuender': 'Lichtzünder',
    'v6-katalysator-opfergabe': 'Lichtopfer',
  },
  'v6-essenz-schatten': {
    'v6-katalysator-ueberladung': 'Schattenüberladung',
    'v6-katalysator-verdichtung': 'Schattenverdichtung',
    'v6-katalysator-sofortzuender': 'Schattenzünder',
    'v6-katalysator-opfergabe': 'Schattenopfer',
  },
};

const CAT_SHORT: Record<CatId, string> = {
  'v6-katalysator-ueberladung': 'Überladung',
  'v6-katalysator-verdichtung': 'Verdichtung',
  'v6-katalysator-sofortzuender': 'Sofortzünder',
  'v6-katalysator-opfergabe': 'Opfergabe',
};

export function v6Slice1CatalystShortName(catalystId: string): string {
  if (catalystId in CAT_SHORT) {
    return CAT_SHORT[catalystId as CatId];
  }
  return catalystId;
}

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
        rider: ESSENCE_RIDERS[e],
        intensity:
          primary.kind === 'damage'
            ? undefined
            : primary.kind === 'fessel'
              ? primary.value
              : 1,
      });
    }
  }
  return rows;
}

function buildTkBases(): V6TkBaseAuthoring[] {
  const rows: V6TkBaseAuthoring[] = [];
  /** Base 2 so Sofortzünder (−1) still leaves a playable primary of 1. */
  const techPrimary: Record<TechId, V6PrimaryEffectAuthoring> = {
    'v6-technik-impulsgeschoss': {
      kind: 'damage',
      value: 2,
      target: 'opponent',
      offensive: true,
    },
    'v6-technik-adrenalinschrei': { kind: 'prep_attack', value: 2, target: 'self' },
    'v6-technik-magiepanzer': { kind: 'shield', value: 2, target: 'self' },
  };
  for (const t of V6_SLICE1_TECHNIQUE_IDS) {
    for (const c of V6_SLICE1_CATALYST_IDS) {
      rows.push({
        recipeId: tkId(t, c),
        techniqueId: t,
        catalystId: c,
        name: TK_NAMES[t][c],
        primary: { ...techPrimary[t] },
      });
    }
  }
  return rows;
}

function buildEkBases(): V6EkBaseAuthoring[] {
  const rows: V6EkBaseAuthoring[] = [];
  /** Base 2 so Sofortzünder (−1) still leaves a playable primary of 1. */
  const essPrimary: Record<EssId, V6PrimaryEffectAuthoring> = {
    'v6-essenz-feuer': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-wasser': { kind: 'heal', value: 2, target: 'self' },
    'v6-essenz-erde': { kind: 'shield', value: 2, target: 'self' },
    'v6-essenz-luft': { kind: 'prep_boost', value: 2, target: 'self' },
    'v6-essenz-licht': { kind: 'shield', value: 2, target: 'self' },
    'v6-essenz-schatten': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
  };
  for (const e of V6_SLICE1_ESSENCE_IDS) {
    for (const c of V6_SLICE1_CATALYST_IDS) {
      rows.push({
        recipeId: ekId(e, c),
        essenceId: e,
        catalystId: c,
        name: EK_NAMES[e][c],
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
      summary: 'Primärwert +2; danach erleidest du 1 Selbstschaden.',
    },
    {
      transformId: 'xform-verdichtung',
      catalystId: 'v6-katalysator-verdichtung',
      primaryDelta: 1,
      stabilityBuffUsed: 1,
      summary: 'Primärwert +1; verwendete Komponenten erhalten +1 Stabilität.',
    },
    {
      transformId: 'xform-sofortzuender',
      catalystId: 'v6-katalysator-sofortzuender',
      primaryDelta: -1,
      drawDiscardAfter: true,
      summary: 'Primärwert −1; danach ziehe 1 und wirf 1 ab.',
    },
    {
      transformId: 'xform-opfergabe',
      catalystId: 'v6-katalysator-opfergabe',
      primaryDelta: 0,
      offerDiscardBonus: 2,
      summary: 'Optional: wirf 1 Handkarte ab für Primärwert +2.',
    },
  ];
}

/**
 * Slice-1 authoring catalog — locked card set for the current recipe matrix.
 * Later catalog expansion must keep existing recipeIds stable.
 */
export const V6_FORMULA_AUTHORING_SLICE1: V6FormulaAuthoringCatalog = {
  version: 1,
  slice: 'slice1',
  teBases: buildTeBases(),
  tkBases: buildTkBases(),
  ekBases: buildEkBases(),
  catalystTransforms: buildCatalystTransforms(),
};
