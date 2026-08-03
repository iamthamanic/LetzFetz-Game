/**
 * Slice-1 formula authoring SoT (TE / TK / EK bases + catalyst transforms).
 * Location: src/content/v6/formulaAuthoring.slice1.ts
 *
 * Catalog: 10 Techniken × 6 Essenzen × 6 matrix Katalysatoren → generated recipes.
 * All 10 catalysts have explicit transforms; 4 are `unsupported` (no TEK invent, #383).
 * Generator expands TE×supported-catalyst → TEK + Überformel. Missing keys fail closed.
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
  V6_MATRIX_CATALYST_IDS,
  V6_SLICE1_ESSENCE_IDS,
  V6_SLICE1_TECHNIQUE_IDS,
  type V6MatrixCatalystId,
  type V6Slice1CatalystId,
} from './slice1Ids';
import { V6_PLAYTEST_CONSTRUCT_DEF_ID } from './cards/playtestConstructCards';

type TechId = (typeof V6_SLICE1_TECHNIQUE_IDS)[number];
type EssId = (typeof V6_SLICE1_ESSENCE_IDS)[number];
type MatrixCatId = V6MatrixCatalystId;

function teId(t: TechId, e: EssId): string {
  return `v6-te-${t.replace('v6-technik-', '')}-${e.replace('v6-essenz-', '')}`;
}

function tkId(t: TechId, c: MatrixCatId): string {
  return `v6-tk-${t.replace('v6-technik-', '')}-${c.replace('v6-katalysator-', '')}`;
}

function ekId(e: EssId, c: MatrixCatId): string {
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
  'v6-technik-fintenschnitt': {
    'v6-essenz-feuer': { kind: 'prep_block', value: 2, target: 'self' },
    'v6-essenz-wasser': { kind: 'prep_block', value: 2, target: 'self' },
    'v6-essenz-erde': { kind: 'prep_block', value: 2, target: 'self' },
    'v6-essenz-luft': { kind: 'prep_block', value: 2, target: 'self' },
    'v6-essenz-licht': { kind: 'prep_block', value: 2, target: 'self' },
    'v6-essenz-schatten': { kind: 'prep_block', value: 2, target: 'self' },
  },
  'v6-technik-brechschlag': {
    'v6-essenz-feuer': { kind: 'damage', value: 3, target: 'opponent', offensive: true },
    'v6-essenz-wasser': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-erde': { kind: 'damage', value: 3, target: 'opponent', offensive: true },
    'v6-essenz-luft': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-licht': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-schatten': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
  },
  'v6-technik-kettenfessel': {
    'v6-essenz-feuer': { kind: 'fessel', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-wasser': { kind: 'fessel', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-erde': { kind: 'fessel', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-luft': { kind: 'fessel', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-licht': { kind: 'fessel', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-schatten': { kind: 'fessel', value: 2, target: 'opponent', offensive: true },
  },
  'v6-technik-bannkreis': {
    'v6-essenz-feuer': { kind: 'shield', value: 2, target: 'self' },
    'v6-essenz-wasser': { kind: 'heal', value: 2, target: 'self' },
    'v6-essenz-erde': { kind: 'shield', value: 2, target: 'self' },
    'v6-essenz-luft': { kind: 'shield', value: 2, target: 'self' },
    'v6-essenz-licht': { kind: 'shield', value: 2, target: 'self' },
    'v6-essenz-schatten': { kind: 'shield', value: 2, target: 'self' },
  },
  'v6-technik-ueberraschungsangriff': {
    'v6-essenz-feuer': { kind: 'damage', value: 3, target: 'opponent', offensive: true },
    'v6-essenz-wasser': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-erde': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-luft': { kind: 'damage', value: 3, target: 'opponent', offensive: true },
    'v6-essenz-licht': { kind: 'damage', value: 2, target: 'opponent', offensive: true },
    'v6-essenz-schatten': { kind: 'damage', value: 3, target: 'opponent', offensive: true },
  },
  'v6-technik-schicksalmanifestation': {
    'v6-essenz-feuer': { kind: 'prep_boost', value: 2, target: 'self' },
    'v6-essenz-wasser': { kind: 'prep_boost', value: 2, target: 'self' },
    'v6-essenz-erde': { kind: 'prep_boost', value: 2, target: 'self' },
    'v6-essenz-luft': { kind: 'prep_boost', value: 2, target: 'self' },
    'v6-essenz-licht': { kind: 'prep_boost', value: 2, target: 'self' },
    'v6-essenz-schatten': { kind: 'prep_boost', value: 2, target: 'self' },
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
  'v6-technik-beschwoerungsritual': {
    'v6-essenz-feuer': { kind: 'summon_construct', value: 3, target: 'self' },
    'v6-essenz-wasser': { kind: 'summon_construct', value: 3, target: 'self' },
    'v6-essenz-erde': { kind: 'summon_construct', value: 3, target: 'self' },
    'v6-essenz-luft': { kind: 'summon_construct', value: 3, target: 'self' },
    'v6-essenz-licht': { kind: 'summon_construct', value: 3, target: 'self' },
    'v6-essenz-schatten': { kind: 'summon_construct', value: 3, target: 'self' },
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
  'v6-technik-fintenschnitt': {
    'v6-essenz-feuer': 'Glutfinte',
    'v6-essenz-wasser': 'Wellenfinte',
    'v6-essenz-erde': 'Felsfinte',
    'v6-essenz-luft': 'Windfinte',
    'v6-essenz-licht': 'Lichtfinte',
    'v6-essenz-schatten': 'Schattenfinte',
  },
  'v6-technik-brechschlag': {
    'v6-essenz-feuer': 'Glutbruch',
    'v6-essenz-wasser': 'Wellenbruch',
    'v6-essenz-erde': 'Felsbruch',
    'v6-essenz-luft': 'Windbruch',
    'v6-essenz-licht': 'Lichtbruch',
    'v6-essenz-schatten': 'Schattenbruch',
  },
  'v6-technik-kettenfessel': {
    'v6-essenz-feuer': 'Glutkette',
    'v6-essenz-wasser': 'Wellenkette',
    'v6-essenz-erde': 'Felskette',
    'v6-essenz-luft': 'Windkette',
    'v6-essenz-licht': 'Lichtkette',
    'v6-essenz-schatten': 'Schattenkette',
  },
  'v6-technik-bannkreis': {
    'v6-essenz-feuer': 'Glutkreis',
    'v6-essenz-wasser': 'Wellenkreis',
    'v6-essenz-erde': 'Felskreis',
    'v6-essenz-luft': 'Windkreis',
    'v6-essenz-licht': 'Lichtkreis',
    'v6-essenz-schatten': 'Schattenkreis',
  },
  'v6-technik-ueberraschungsangriff': {
    'v6-essenz-feuer': 'Glutüberraschung',
    'v6-essenz-wasser': 'Wellenüberraschung',
    'v6-essenz-erde': 'Felsüberraschung',
    'v6-essenz-luft': 'Windüberraschung',
    'v6-essenz-licht': 'Lichtüberraschung',
    'v6-essenz-schatten': 'Schattenüberraschung',
  },
  'v6-technik-schicksalmanifestation': {
    'v6-essenz-feuer': 'Glutschicksal',
    'v6-essenz-wasser': 'Wellenschicksal',
    'v6-essenz-erde': 'Felsschicksal',
    'v6-essenz-luft': 'Windschicksal',
    'v6-essenz-licht': 'Lichtschicksal',
    'v6-essenz-schatten': 'Schattenschicksal',
  },
  'v6-technik-magiepanzer': {
    'v6-essenz-feuer': 'Glutfessel',
    'v6-essenz-wasser': 'Nasspanzer',
    'v6-essenz-erde': 'Erdpanzer',
    'v6-essenz-luft': 'Windpanzer',
    'v6-essenz-licht': 'Lichtpanzer',
    'v6-essenz-schatten': 'Schattenfessel',
  },
  'v6-technik-beschwoerungsritual': {
    'v6-essenz-feuer': 'Glutbeschwörung',
    'v6-essenz-wasser': 'Wellenbeschwörung',
    'v6-essenz-erde': 'Felsbeschwörung',
    'v6-essenz-luft': 'Windbeschwörung',
    'v6-essenz-licht': 'Lichtbeschwörung',
    'v6-essenz-schatten': 'Schattenbeschwörung',
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

/** Proper German TK display names (not machine Tech·Cat labels). Matrix catalysts only. */
const TK_NAMES: Record<TechId, Record<MatrixCatId, string>> = {
  'v6-technik-impulsgeschoss': {
    'v6-katalysator-echo': 'Echoimpuls',
    'v6-katalysator-ueberladung': 'Überimpuls',
    'v6-katalysator-verdichtung': 'Dichtimpuls',
    'v6-katalysator-verzoegerung': 'Delayimpuls',
    'v6-katalysator-sofortzuender': 'Zündimpuls',
    'v6-katalysator-opfergabe': 'Opferimpuls',
  },
  'v6-technik-adrenalinschrei': {
    'v6-katalysator-echo': 'Echoschrei',
    'v6-katalysator-ueberladung': 'Überschrei',
    'v6-katalysator-verdichtung': 'Dichtschrei',
    'v6-katalysator-verzoegerung': 'Delayschrei',
    'v6-katalysator-sofortzuender': 'Zündschrei',
    'v6-katalysator-opfergabe': 'Opferschrei',
  },
  'v6-technik-fintenschnitt': {
    'v6-katalysator-echo': 'Echofinte',
    'v6-katalysator-ueberladung': 'Überfinte',
    'v6-katalysator-verdichtung': 'Dichtfinte',
    'v6-katalysator-verzoegerung': 'Delayfinte',
    'v6-katalysator-sofortzuender': 'Zündfinte',
    'v6-katalysator-opfergabe': 'Opferfinte',
  },
  'v6-technik-brechschlag': {
    'v6-katalysator-echo': 'Echobruch',
    'v6-katalysator-ueberladung': 'Überbruch',
    'v6-katalysator-verdichtung': 'Dichtbruch',
    'v6-katalysator-verzoegerung': 'Delaybruch',
    'v6-katalysator-sofortzuender': 'Zündbruch',
    'v6-katalysator-opfergabe': 'Opferbruch',
  },
  'v6-technik-kettenfessel': {
    'v6-katalysator-echo': 'Echokette',
    'v6-katalysator-ueberladung': 'Überkette',
    'v6-katalysator-verdichtung': 'Dichtkette',
    'v6-katalysator-verzoegerung': 'Delaykette',
    'v6-katalysator-sofortzuender': 'Zündkette',
    'v6-katalysator-opfergabe': 'Opferkette',
  },
  'v6-technik-bannkreis': {
    'v6-katalysator-echo': 'Echokreis',
    'v6-katalysator-ueberladung': 'Überkreis',
    'v6-katalysator-verdichtung': 'Dichtkreis',
    'v6-katalysator-verzoegerung': 'Delaykreis',
    'v6-katalysator-sofortzuender': 'Zündkreis',
    'v6-katalysator-opfergabe': 'Opferkreis',
  },
  'v6-technik-ueberraschungsangriff': {
    'v6-katalysator-echo': 'Echostoß',
    'v6-katalysator-ueberladung': 'Überfallstoß',
    'v6-katalysator-verdichtung': 'Dichtstoß',
    'v6-katalysator-verzoegerung': 'Delaystoß',
    'v6-katalysator-sofortzuender': 'Zündstoß',
    'v6-katalysator-opfergabe': 'Opferstoß',
  },
  'v6-technik-schicksalmanifestation': {
    'v6-katalysator-echo': 'Echoschicksal',
    'v6-katalysator-ueberladung': 'Überschicksal',
    'v6-katalysator-verdichtung': 'Dichtschicksal',
    'v6-katalysator-verzoegerung': 'Delayschicksal',
    'v6-katalysator-sofortzuender': 'Zündschicksal',
    'v6-katalysator-opfergabe': 'Opferschicksal',
  },
  'v6-technik-magiepanzer': {
    'v6-katalysator-echo': 'Echopanzer',
    'v6-katalysator-ueberladung': 'Überpanzer',
    'v6-katalysator-verdichtung': 'Dichtpanzer',
    'v6-katalysator-verzoegerung': 'Delaypanzer',
    'v6-katalysator-sofortzuender': 'Zündpanzer',
    'v6-katalysator-opfergabe': 'Opferpanzer',
  },
  'v6-technik-beschwoerungsritual': {
    'v6-katalysator-echo': 'Echoritual',
    'v6-katalysator-ueberladung': 'Überritual',
    'v6-katalysator-verdichtung': 'Dichtritual',
    'v6-katalysator-verzoegerung': 'Delayritual',
    'v6-katalysator-sofortzuender': 'Zündritual',
    'v6-katalysator-opfergabe': 'Opferritual',
  },
};

/** Proper German EK display names (not Ritual·Cat compounds). Matrix catalysts only. */
const EK_NAMES: Record<EssId, Record<MatrixCatId, string>> = {
  'v6-essenz-feuer': {
    'v6-katalysator-echo': 'Glutecho',
    'v6-katalysator-ueberladung': 'Glutüberladung',
    'v6-katalysator-verdichtung': 'Glutverdichtung',
    'v6-katalysator-verzoegerung': 'Glutverzögerung',
    'v6-katalysator-sofortzuender': 'Funkenzünder',
    'v6-katalysator-opfergabe': 'Brandopfer',
  },
  'v6-essenz-wasser': {
    'v6-katalysator-echo': 'Wellenecho',
    'v6-katalysator-ueberladung': 'Flutüberladung',
    'v6-katalysator-verdichtung': 'Quellverdichtung',
    'v6-katalysator-verzoegerung': 'Wellenverzögerung',
    'v6-katalysator-sofortzuender': 'Spritzzünder',
    'v6-katalysator-opfergabe': 'Wellenopfer',
  },
  'v6-essenz-erde': {
    'v6-katalysator-echo': 'Felsecho',
    'v6-katalysator-ueberladung': 'Felsüberladung',
    'v6-katalysator-verdichtung': 'Felsverdichtung',
    'v6-katalysator-verzoegerung': 'Felsverzögerung',
    'v6-katalysator-sofortzuender': 'Felszünder',
    'v6-katalysator-opfergabe': 'Felsopfer',
  },
  'v6-essenz-luft': {
    'v6-katalysator-echo': 'Windecho',
    'v6-katalysator-ueberladung': 'Sturmüberladung',
    'v6-katalysator-verdichtung': 'Windverdichtung',
    'v6-katalysator-verzoegerung': 'Windverzögerung',
    'v6-katalysator-sofortzuender': 'Windzünder',
    'v6-katalysator-opfergabe': 'Luftopfer',
  },
  'v6-essenz-licht': {
    'v6-katalysator-echo': 'Lichtecho',
    'v6-katalysator-ueberladung': 'Lichtüberladung',
    'v6-katalysator-verdichtung': 'Lichtverdichtung',
    'v6-katalysator-verzoegerung': 'Lichtverzögerung',
    'v6-katalysator-sofortzuender': 'Lichtzünder',
    'v6-katalysator-opfergabe': 'Lichtopfer',
  },
  'v6-essenz-schatten': {
    'v6-katalysator-echo': 'Schattenecho',
    'v6-katalysator-ueberladung': 'Schattenüberladung',
    'v6-katalysator-verdichtung': 'Schattenverdichtung',
    'v6-katalysator-verzoegerung': 'Schattenverzögerung',
    'v6-katalysator-sofortzuender': 'Schattenzünder',
    'v6-katalysator-opfergabe': 'Schattenopfer',
  },
};

const CAT_SHORT: Record<V6Slice1CatalystId, string> = {
  'v6-katalysator-echo': 'Echo',
  'v6-katalysator-ueberladung': 'Überladung',
  'v6-katalysator-verdichtung': 'Verdichtung',
  'v6-katalysator-ausbreitung': 'Ausbreitung',
  'v6-katalysator-kettenkopplung': 'Kettenkopplung',
  'v6-katalysator-verzoegerung': 'Verzögerung',
  'v6-katalysator-sofortzuender': 'Sofortzünder',
  'v6-katalysator-spiegelung': 'Spiegelung',
  'v6-katalysator-umkehrung': 'Umkehrung',
  'v6-katalysator-opfergabe': 'Opfergabe',
};

export function v6Slice1CatalystShortName(catalystId: string): string {
  if (catalystId in CAT_SHORT) {
    return CAT_SHORT[catalystId as V6Slice1CatalystId];
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
          primary.kind === 'damage' || primary.kind === 'summon_construct'
            ? undefined
            : primary.kind === 'fessel'
              ? primary.value
              : 1,
        ...(primary.kind === 'summon_construct'
          ? { summonConstructDefId: V6_PLAYTEST_CONSTRUCT_DEF_ID }
          : {}),
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
    'v6-technik-fintenschnitt': { kind: 'prep_block', value: 2, target: 'self' },
    'v6-technik-brechschlag': {
      kind: 'damage',
      value: 2,
      target: 'opponent',
      offensive: true,
    },
    'v6-technik-kettenfessel': {
      kind: 'fessel',
      value: 2,
      target: 'opponent',
      offensive: true,
    },
    'v6-technik-bannkreis': { kind: 'shield', value: 2, target: 'self' },
    'v6-technik-ueberraschungsangriff': {
      kind: 'damage',
      value: 2,
      target: 'opponent',
      offensive: true,
    },
    'v6-technik-schicksalmanifestation': { kind: 'prep_boost', value: 2, target: 'self' },
    'v6-technik-magiepanzer': { kind: 'shield', value: 2, target: 'self' },
    'v6-technik-beschwoerungsritual': {
      kind: 'summon_construct',
      value: 3,
      target: 'self',
    },
  };
  for (const t of V6_SLICE1_TECHNIQUE_IDS) {
    for (const c of V6_MATRIX_CATALYST_IDS) {
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
    for (const c of V6_MATRIX_CATALYST_IDS) {
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
      transformId: 'xform-echo',
      catalystId: 'v6-katalysator-echo',
      availability: 'supported',
      primaryDelta: 0,
      timingMode: 'echo',
      echoAmount: 1,
      summary:
        'Echo: zu Beginn deines nächsten Zuges wiederhole 1 Punkt des Primärwerts. Katalysator bleibt bis zur Echo-Auflösung.',
    },
    {
      transformId: 'xform-ueberladung',
      catalystId: 'v6-katalysator-ueberladung',
      availability: 'supported',
      primaryDelta: 2,
      selfDamage: 1,
      summary: 'Primärwert +2; danach erleidest du 1 Selbstschaden.',
    },
    {
      transformId: 'xform-verdichtung',
      catalystId: 'v6-katalysator-verdichtung',
      availability: 'supported',
      primaryDelta: 1,
      stabilityBuffUsed: 1,
      summary: 'Primärwert +1; verwendete Komponenten erhalten +1 Stabilität.',
    },
    {
      transformId: 'xform-ausbreitung',
      catalystId: 'v6-katalysator-ausbreitung',
      availability: 'unsupported',
      primaryDelta: 0,
      summary:
        'Ausbreitung: Spread-Ziele nur per approved Authoring — generische Matrix gesperrt (#383).',
    },
    {
      transformId: 'xform-kettenkopplung',
      catalystId: 'v6-katalysator-kettenkopplung',
      availability: 'unsupported',
      primaryDelta: 0,
      summary:
        'Kettenkopplung: Folgeaktions-Bonus nur per approved Authoring — generische Matrix gesperrt (#383).',
    },
    {
      transformId: 'xform-verzoegerung',
      catalystId: 'v6-katalysator-verzoegerung',
      availability: 'supported',
      primaryDelta: 0,
      timingMode: 'delay',
      delayBonus: 2,
      summary:
        'Verzögerung: Primäreffekt geschieht nicht sofort, sondern zu Beginn deines nächsten Zuges und erhält +2. Katalysator bleibt bis zur Auflösung.',
    },
    {
      transformId: 'xform-sofortzuender',
      catalystId: 'v6-katalysator-sofortzuender',
      availability: 'supported',
      primaryDelta: -1,
      drawDiscardAfter: true,
      summary: 'Primärwert −1; danach ziehe 1 und wirf 1 ab.',
    },
    {
      transformId: 'xform-spiegelung',
      catalystId: 'v6-katalysator-spiegelung',
      availability: 'unsupported',
      primaryDelta: 0,
      summary:
        'Spiegelung: Offensiv/Defensiv-Rider nur per approved Authoring — generische Matrix gesperrt (#383).',
    },
    {
      transformId: 'xform-umkehrung',
      catalystId: 'v6-katalysator-umkehrung',
      availability: 'unsupported',
      primaryDelta: 0,
      summary:
        'Umkehrung: Schaden↔Heilung nie generisch geraten — nur approved Authoring (#383).',
    },
    {
      transformId: 'xform-opfergabe',
      catalystId: 'v6-katalysator-opfergabe',
      availability: 'supported',
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
