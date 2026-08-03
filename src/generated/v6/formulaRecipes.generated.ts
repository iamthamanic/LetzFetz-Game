/**
 * GENERATED FILE — DO NOT HAND-EDIT.
 * Produced by scripts/generate-v6-formula-recipes.ts
 * Location: src/generated/v6/formulaRecipes.generated.ts
 *
 * Catalog: V6 Slice-1 (3 Techniken × 6 Essenzen × 4 Katalysatoren).
 * These 198 recipes are the locked current set — later expansion
 * adds new ids; do not renumber or replace Slice-1 recipeIds.
 */

export type V6GeneratedRecipeKind = 'te' | 'tk' | 'ek' | 'tek' | 'overformula';

export interface V6GeneratedPrimaryEffect {
  kind: string;
  value: number;
  target: 'opponent' | 'self';
  offensive?: boolean;
}

export interface V6GeneratedRider {
  id: string;
  summary: string;
  defenseSuppressible: boolean;
}

export interface V6GeneratedFormulaRecipe {
  recipeId: string;
  kind: V6GeneratedRecipeKind;
  catalogSlice: 'slice1';
  techniqueId: string | null;
  essenceId: string | null;
  catalystId: string | null;
  name: string;
  effectSummary: string;
  primary: V6GeneratedPrimaryEffect;
  rider: V6GeneratedRider | null;
  intensity: number | null;
  transformId: string | null;
  grantsFetz: boolean;
  catalystConsumed: boolean;
  overformulaPrimaryBonus: number | null;
  overformulaIntensityBonus: number | null;
  formulaDefensePenalty: number | null;
}

/** Meta for the locked Slice-1 recipe catalog (not the future 60×K matrix). */
export const V6_SLICE1_RECIPE_CATALOG = {
  id: 'v6-slice1',
  label: 'V6 Slice-1 Formelkatalog (3T×6E×4K)',
  recipeCount: 198,
  breakdown: {"te":18,"tk":12,"ek":24,"tek":72,"overformula":72},
} as const;

export const V6_GENERATED_FORMULA_RECIPES: readonly V6GeneratedFormulaRecipe[] = [
  {
    "recipeId": "v6-te-impulsgeschoss-feuer",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": null,
    "name": "Glutimpuls",
    "effectSummary": "Verursache 3 Schaden am Gegner. Bei Lebensschaden: Brennen, falls keine Reaktion.",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-impulsgeschoss-wasser",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": null,
    "name": "Spritzschuss",
    "effectSummary": "Verursache 2 Schaden am Gegner. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-impulsgeschoss-erde",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-erde",
    "catalystId": null,
    "name": "Felsnadel",
    "effectSummary": "Verursache 2 Schaden am Gegner. Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-impulsgeschoss-luft",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": null,
    "name": "Luftnadel",
    "effectSummary": "Verursache 2 Schaden am Gegner. Nächster eigener Aktions-W6 +1 (max +2).",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-impulsgeschoss-licht",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-licht",
    "catalystId": null,
    "name": "Lichtstich",
    "effectSummary": "Verursache 2 Schaden am Gegner. Bei Schildgewinn: entferne optional eine Marke von dir.",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-impulsgeschoss-schatten",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-schatten",
    "catalystId": null,
    "name": "Schattenstich",
    "effectSummary": "Verursache 2 Schaden am Gegner. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-adrenalinschrei-feuer",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": null,
    "name": "Kampfschrei",
    "effectSummary": "Bereite Angriff +2 vor. Bei Lebensschaden: Brennen, falls keine Reaktion.",
    "primary": {
      "kind": "prep_attack",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-adrenalinschrei-wasser",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": null,
    "name": "Klärschrei",
    "effectSummary": "Bereite Boost +2 vor. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
    "primary": {
      "kind": "prep_boost",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-adrenalinschrei-erde",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-erde",
    "catalystId": null,
    "name": "Standschrei",
    "effectSummary": "Bereite Angriff +2 vor. Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
    "primary": {
      "kind": "prep_attack",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-adrenalinschrei-luft",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": null,
    "name": "Tempeschrei",
    "effectSummary": "Bereite Angriff +2 vor. Nächster eigener Aktions-W6 +1 (max +2).",
    "primary": {
      "kind": "prep_attack",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-adrenalinschrei-licht",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-licht",
    "catalystId": null,
    "name": "Klarschrei",
    "effectSummary": "Bereite Boost +2 vor. Bei Schildgewinn: entferne optional eine Marke von dir.",
    "primary": {
      "kind": "prep_boost",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-adrenalinschrei-schatten",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-schatten",
    "catalystId": null,
    "name": "Fluchschrei",
    "effectSummary": "Bereite Angriff +2 vor. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
    "primary": {
      "kind": "prep_attack",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-magiepanzer-feuer",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": null,
    "name": "Glutfessel",
    "effectSummary": "Fessel Intensität 2 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Lebensschaden: Brennen, falls keine Reaktion.",
    "primary": {
      "kind": "fessel",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-magiepanzer-wasser",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": null,
    "name": "Nasspanzer",
    "effectSummary": "Heile 2 Leben. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
    "primary": {
      "kind": "heal",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-magiepanzer-erde",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-erde",
    "catalystId": null,
    "name": "Erdpanzer",
    "effectSummary": "Gewinne 2 Schild. Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
    "primary": {
      "kind": "shield",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-magiepanzer-luft",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": null,
    "name": "Windpanzer",
    "effectSummary": "Gewinne 2 Schild. Nächster eigener Aktions-W6 +1 (max +2).",
    "primary": {
      "kind": "shield",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-magiepanzer-licht",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-licht",
    "catalystId": null,
    "name": "Lichtpanzer",
    "effectSummary": "Gewinne 2 Schild. Bei Schildgewinn: entferne optional eine Marke von dir.",
    "primary": {
      "kind": "shield",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-te-magiepanzer-schatten",
    "kind": "te",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-schatten",
    "catalystId": null,
    "name": "Schattenfessel",
    "effectSummary": "Fessel Intensität 2 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
    "primary": {
      "kind": "fessel",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": null,
    "grantsFetz": false,
    "catalystConsumed": false,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-tk-impulsgeschoss-ueberladung",
    "kind": "tk",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": null,
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überimpuls",
    "effectSummary": "Verursache 4 Schaden am Gegner. Primärwert +2; danach erleidest du 1 Selbstschaden.",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": null,
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-tk-impulsgeschoss-verdichtung",
    "kind": "tk",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": null,
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Dichtimpuls",
    "effectSummary": "Verursache 3 Schaden am Gegner. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität.",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": null,
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-tk-impulsgeschoss-sofortzuender",
    "kind": "tk",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": null,
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Zündimpuls",
    "effectSummary": "Verursache 1 Schaden am Gegner. Primärwert −1; danach ziehe 1 und wirf 1 ab.",
    "primary": {
      "kind": "damage",
      "value": 1,
      "target": "opponent",
      "offensive": true
    },
    "rider": null,
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-tk-impulsgeschoss-opfergabe",
    "kind": "tk",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": null,
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Opferimpuls",
    "effectSummary": "Verursache 2 Schaden am Gegner. Optional: wirf 1 Handkarte ab für Primärwert +2.",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": null,
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-tk-adrenalinschrei-ueberladung",
    "kind": "tk",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": null,
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überschrei",
    "effectSummary": "Bereite Angriff +4 vor. Primärwert +2; danach erleidest du 1 Selbstschaden.",
    "primary": {
      "kind": "prep_attack",
      "value": 4,
      "target": "self"
    },
    "rider": null,
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-tk-adrenalinschrei-verdichtung",
    "kind": "tk",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": null,
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Dichtschrei",
    "effectSummary": "Bereite Angriff +3 vor. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität.",
    "primary": {
      "kind": "prep_attack",
      "value": 3,
      "target": "self"
    },
    "rider": null,
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-tk-adrenalinschrei-sofortzuender",
    "kind": "tk",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": null,
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Zündschrei",
    "effectSummary": "Bereite Angriff +1 vor. Primärwert −1; danach ziehe 1 und wirf 1 ab.",
    "primary": {
      "kind": "prep_attack",
      "value": 1,
      "target": "self"
    },
    "rider": null,
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-tk-adrenalinschrei-opfergabe",
    "kind": "tk",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": null,
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Opferschrei",
    "effectSummary": "Bereite Angriff +2 vor. Optional: wirf 1 Handkarte ab für Primärwert +2.",
    "primary": {
      "kind": "prep_attack",
      "value": 2,
      "target": "self"
    },
    "rider": null,
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-tk-magiepanzer-ueberladung",
    "kind": "tk",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": null,
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überpanzer",
    "effectSummary": "Gewinne 4 Schild. Primärwert +2; danach erleidest du 1 Selbstschaden.",
    "primary": {
      "kind": "shield",
      "value": 4,
      "target": "self"
    },
    "rider": null,
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-tk-magiepanzer-verdichtung",
    "kind": "tk",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": null,
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Dichtpanzer",
    "effectSummary": "Gewinne 3 Schild. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität.",
    "primary": {
      "kind": "shield",
      "value": 3,
      "target": "self"
    },
    "rider": null,
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-tk-magiepanzer-sofortzuender",
    "kind": "tk",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": null,
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Zündpanzer",
    "effectSummary": "Gewinne 1 Schild. Primärwert −1; danach ziehe 1 und wirf 1 ab.",
    "primary": {
      "kind": "shield",
      "value": 1,
      "target": "self"
    },
    "rider": null,
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-tk-magiepanzer-opfergabe",
    "kind": "tk",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": null,
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Opferpanzer",
    "effectSummary": "Gewinne 2 Schild. Optional: wirf 1 Handkarte ab für Primärwert +2.",
    "primary": {
      "kind": "shield",
      "value": 2,
      "target": "self"
    },
    "rider": null,
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-feuer-ueberladung",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Glutüberladung",
    "effectSummary": "Verursache 4 Schaden am Gegner. Bei Lebensschaden: Brennen, falls keine Reaktion. Primärwert +2; danach erleidest du 1 Selbstschaden.",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-feuer-verdichtung",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Glutverdichtung",
    "effectSummary": "Verursache 3 Schaden am Gegner. Bei Lebensschaden: Brennen, falls keine Reaktion. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität.",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-feuer-sofortzuender",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Funkenzünder",
    "effectSummary": "Verursache 1 Schaden am Gegner. Bei Lebensschaden: Brennen, falls keine Reaktion. Primärwert −1; danach ziehe 1 und wirf 1 ab.",
    "primary": {
      "kind": "damage",
      "value": 1,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-feuer-opfergabe",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Brandopfer",
    "effectSummary": "Verursache 2 Schaden am Gegner. Bei Lebensschaden: Brennen, falls keine Reaktion. Optional: wirf 1 Handkarte ab für Primärwert +2.",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-wasser-ueberladung",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Flutüberladung",
    "effectSummary": "Heile 4 Leben. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Primärwert +2; danach erleidest du 1 Selbstschaden.",
    "primary": {
      "kind": "heal",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-wasser-verdichtung",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Quellverdichtung",
    "effectSummary": "Heile 3 Leben. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität.",
    "primary": {
      "kind": "heal",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-wasser-sofortzuender",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Spritzzünder",
    "effectSummary": "Heile 1 Leben. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Primärwert −1; danach ziehe 1 und wirf 1 ab.",
    "primary": {
      "kind": "heal",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-wasser-opfergabe",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Wellenopfer",
    "effectSummary": "Heile 2 Leben. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Optional: wirf 1 Handkarte ab für Primärwert +2.",
    "primary": {
      "kind": "heal",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-erde-ueberladung",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Felsüberladung",
    "effectSummary": "Gewinne 4 Schild. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Primärwert +2; danach erleidest du 1 Selbstschaden.",
    "primary": {
      "kind": "shield",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-erde-verdichtung",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Felsverdichtung",
    "effectSummary": "Gewinne 3 Schild. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität.",
    "primary": {
      "kind": "shield",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-erde-sofortzuender",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Felszünder",
    "effectSummary": "Gewinne 1 Schild. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Primärwert −1; danach ziehe 1 und wirf 1 ab.",
    "primary": {
      "kind": "shield",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-erde-opfergabe",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Felsopfer",
    "effectSummary": "Gewinne 2 Schild. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Optional: wirf 1 Handkarte ab für Primärwert +2.",
    "primary": {
      "kind": "shield",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-luft-ueberladung",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Sturmüberladung",
    "effectSummary": "Bereite Boost +4 vor. Nächster eigener Aktions-W6 +1 (max +2). Primärwert +2; danach erleidest du 1 Selbstschaden.",
    "primary": {
      "kind": "prep_boost",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-luft-verdichtung",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Windverdichtung",
    "effectSummary": "Bereite Boost +3 vor. Nächster eigener Aktions-W6 +1 (max +2). Primärwert +1; verwendete Komponenten erhalten +1 Stabilität.",
    "primary": {
      "kind": "prep_boost",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-luft-sofortzuender",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Windzünder",
    "effectSummary": "Bereite Boost +1 vor. Nächster eigener Aktions-W6 +1 (max +2). Primärwert −1; danach ziehe 1 und wirf 1 ab.",
    "primary": {
      "kind": "prep_boost",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-luft-opfergabe",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Luftopfer",
    "effectSummary": "Bereite Boost +2 vor. Nächster eigener Aktions-W6 +1 (max +2). Optional: wirf 1 Handkarte ab für Primärwert +2.",
    "primary": {
      "kind": "prep_boost",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-licht-ueberladung",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Lichtüberladung",
    "effectSummary": "Gewinne 4 Schild. Bei Schildgewinn: entferne optional eine Marke von dir. Primärwert +2; danach erleidest du 1 Selbstschaden.",
    "primary": {
      "kind": "shield",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-licht-verdichtung",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Lichtverdichtung",
    "effectSummary": "Gewinne 3 Schild. Bei Schildgewinn: entferne optional eine Marke von dir. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität.",
    "primary": {
      "kind": "shield",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-licht-sofortzuender",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Lichtzünder",
    "effectSummary": "Gewinne 1 Schild. Bei Schildgewinn: entferne optional eine Marke von dir. Primärwert −1; danach ziehe 1 und wirf 1 ab.",
    "primary": {
      "kind": "shield",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-licht-opfergabe",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Lichtopfer",
    "effectSummary": "Gewinne 2 Schild. Bei Schildgewinn: entferne optional eine Marke von dir. Optional: wirf 1 Handkarte ab für Primärwert +2.",
    "primary": {
      "kind": "shield",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-schatten-ueberladung",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Schattenüberladung",
    "effectSummary": "Verursache 4 Schaden am Gegner. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Primärwert +2; danach erleidest du 1 Selbstschaden.",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-schatten-verdichtung",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Schattenverdichtung",
    "effectSummary": "Verursache 3 Schaden am Gegner. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität.",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-schatten-sofortzuender",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Schattenzünder",
    "effectSummary": "Verursache 1 Schaden am Gegner. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Primärwert −1; danach ziehe 1 und wirf 1 ab.",
    "primary": {
      "kind": "damage",
      "value": 1,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-ek-schatten-opfergabe",
    "kind": "ek",
    "catalogSlice": "slice1",
    "techniqueId": null,
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Schattenopfer",
    "effectSummary": "Verursache 2 Schaden am Gegner. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Optional: wirf 1 Handkarte ab für Primärwert +2.",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-feuer-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Glutimpuls · Überladung",
    "effectSummary": "Verursache 5 Schaden am Gegner. Bei Lebensschaden: Brennen, falls keine Reaktion. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 5,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-feuer-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Glutimpuls · Überladung",
    "effectSummary": "Verursache 7 Schaden am Gegner. Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 7,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-feuer-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Glutimpuls · Verdichtung",
    "effectSummary": "Verursache 4 Schaden am Gegner. Bei Lebensschaden: Brennen, falls keine Reaktion. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-feuer-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Glutimpuls · Verdichtung",
    "effectSummary": "Verursache 6 Schaden am Gegner. Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 6,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-feuer-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Glutimpuls · Sofortzünder",
    "effectSummary": "Verursache 2 Schaden am Gegner. Bei Lebensschaden: Brennen, falls keine Reaktion. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-feuer-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Glutimpuls · Sofortzünder",
    "effectSummary": "Verursache 4 Schaden am Gegner. Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-feuer-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Glutimpuls · Opfergabe",
    "effectSummary": "Verursache 3 Schaden am Gegner. Bei Lebensschaden: Brennen, falls keine Reaktion. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-feuer-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Glutimpuls · Opfergabe",
    "effectSummary": "Verursache 5 Schaden am Gegner. Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 5,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-wasser-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Spritzschuss · Überladung",
    "effectSummary": "Verursache 4 Schaden am Gegner. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-wasser-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Spritzschuss · Überladung",
    "effectSummary": "Verursache 6 Schaden am Gegner. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 6,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-wasser-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Spritzschuss · Verdichtung",
    "effectSummary": "Verursache 3 Schaden am Gegner. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-wasser-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Spritzschuss · Verdichtung",
    "effectSummary": "Verursache 5 Schaden am Gegner. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 5,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-wasser-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Spritzschuss · Sofortzünder",
    "effectSummary": "Verursache 1 Schaden am Gegner. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 1,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-wasser-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Spritzschuss · Sofortzünder",
    "effectSummary": "Verursache 3 Schaden am Gegner. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-wasser-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Spritzschuss · Opfergabe",
    "effectSummary": "Verursache 2 Schaden am Gegner. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-wasser-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Spritzschuss · Opfergabe",
    "effectSummary": "Verursache 4 Schaden am Gegner. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-erde-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Felsnadel · Überladung",
    "effectSummary": "Verursache 4 Schaden am Gegner. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-erde-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Felsnadel · Überladung",
    "effectSummary": "Verursache 6 Schaden am Gegner. Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 6,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-erde-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Felsnadel · Verdichtung",
    "effectSummary": "Verursache 3 Schaden am Gegner. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-erde-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Felsnadel · Verdichtung",
    "effectSummary": "Verursache 5 Schaden am Gegner. Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 5,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-erde-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Felsnadel · Sofortzünder",
    "effectSummary": "Verursache 1 Schaden am Gegner. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 1,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-erde-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Felsnadel · Sofortzünder",
    "effectSummary": "Verursache 3 Schaden am Gegner. Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-erde-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Felsnadel · Opfergabe",
    "effectSummary": "Verursache 2 Schaden am Gegner. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-erde-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Felsnadel · Opfergabe",
    "effectSummary": "Verursache 4 Schaden am Gegner. Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-luft-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Luftnadel · Überladung",
    "effectSummary": "Verursache 4 Schaden am Gegner. Nächster eigener Aktions-W6 +1 (max +2). Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-luft-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Luftnadel · Überladung",
    "effectSummary": "Verursache 6 Schaden am Gegner. Nächster eigener Aktions-W6 +1 (max +2). (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 6,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2). (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-luft-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Luftnadel · Verdichtung",
    "effectSummary": "Verursache 3 Schaden am Gegner. Nächster eigener Aktions-W6 +1 (max +2). Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-luft-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Luftnadel · Verdichtung",
    "effectSummary": "Verursache 5 Schaden am Gegner. Nächster eigener Aktions-W6 +1 (max +2). (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 5,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2). (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-luft-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Luftnadel · Sofortzünder",
    "effectSummary": "Verursache 1 Schaden am Gegner. Nächster eigener Aktions-W6 +1 (max +2). Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 1,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-luft-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Luftnadel · Sofortzünder",
    "effectSummary": "Verursache 3 Schaden am Gegner. Nächster eigener Aktions-W6 +1 (max +2). (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2). (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-luft-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Luftnadel · Opfergabe",
    "effectSummary": "Verursache 2 Schaden am Gegner. Nächster eigener Aktions-W6 +1 (max +2). Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-luft-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Luftnadel · Opfergabe",
    "effectSummary": "Verursache 4 Schaden am Gegner. Nächster eigener Aktions-W6 +1 (max +2). (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2). (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-licht-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Lichtstich · Überladung",
    "effectSummary": "Verursache 4 Schaden am Gegner. Bei Schildgewinn: entferne optional eine Marke von dir. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-licht-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Lichtstich · Überladung",
    "effectSummary": "Verursache 6 Schaden am Gegner. Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 6,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-licht-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Lichtstich · Verdichtung",
    "effectSummary": "Verursache 3 Schaden am Gegner. Bei Schildgewinn: entferne optional eine Marke von dir. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-licht-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Lichtstich · Verdichtung",
    "effectSummary": "Verursache 5 Schaden am Gegner. Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 5,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-licht-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Lichtstich · Sofortzünder",
    "effectSummary": "Verursache 1 Schaden am Gegner. Bei Schildgewinn: entferne optional eine Marke von dir. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 1,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-licht-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Lichtstich · Sofortzünder",
    "effectSummary": "Verursache 3 Schaden am Gegner. Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-licht-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Lichtstich · Opfergabe",
    "effectSummary": "Verursache 2 Schaden am Gegner. Bei Schildgewinn: entferne optional eine Marke von dir. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-licht-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Lichtstich · Opfergabe",
    "effectSummary": "Verursache 4 Schaden am Gegner. Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-schatten-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Schattenstich · Überladung",
    "effectSummary": "Verursache 4 Schaden am Gegner. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-schatten-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Schattenstich · Überladung",
    "effectSummary": "Verursache 6 Schaden am Gegner. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 6,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-schatten-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Schattenstich · Verdichtung",
    "effectSummary": "Verursache 3 Schaden am Gegner. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-schatten-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Schattenstich · Verdichtung",
    "effectSummary": "Verursache 5 Schaden am Gegner. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 5,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-schatten-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Schattenstich · Sofortzünder",
    "effectSummary": "Verursache 1 Schaden am Gegner. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 1,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-schatten-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Schattenstich · Sofortzünder",
    "effectSummary": "Verursache 3 Schaden am Gegner. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-impulsgeschoss-schatten-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Schattenstich · Opfergabe",
    "effectSummary": "Verursache 2 Schaden am Gegner. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-impulsgeschoss-schatten-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Schattenstich · Opfergabe",
    "effectSummary": "Verursache 4 Schaden am Gegner. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": null,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-feuer-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Kampfschrei · Überladung",
    "effectSummary": "Bereite Angriff +4 vor. Bei Lebensschaden: Brennen, falls keine Reaktion. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-feuer-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Kampfschrei · Überladung",
    "effectSummary": "Bereite Angriff +4 vor. Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-feuer-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Kampfschrei · Verdichtung",
    "effectSummary": "Bereite Angriff +3 vor. Bei Lebensschaden: Brennen, falls keine Reaktion. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-feuer-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Kampfschrei · Verdichtung",
    "effectSummary": "Bereite Angriff +3 vor. Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-feuer-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Kampfschrei · Sofortzünder",
    "effectSummary": "Bereite Angriff +1 vor. Bei Lebensschaden: Brennen, falls keine Reaktion. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-feuer-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Kampfschrei · Sofortzünder",
    "effectSummary": "Bereite Angriff +1 vor. Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-feuer-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Kampfschrei · Opfergabe",
    "effectSummary": "Bereite Angriff +2 vor. Bei Lebensschaden: Brennen, falls keine Reaktion. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-feuer-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Kampfschrei · Opfergabe",
    "effectSummary": "Bereite Angriff +2 vor. Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-wasser-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Klärschrei · Überladung",
    "effectSummary": "Bereite Boost +4 vor. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_boost",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-wasser-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Klärschrei · Überladung",
    "effectSummary": "Bereite Boost +4 vor. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_boost",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 2,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-wasser-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Klärschrei · Verdichtung",
    "effectSummary": "Bereite Boost +3 vor. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_boost",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-wasser-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Klärschrei · Verdichtung",
    "effectSummary": "Bereite Boost +3 vor. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_boost",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 2,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-wasser-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Klärschrei · Sofortzünder",
    "effectSummary": "Bereite Boost +1 vor. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_boost",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-wasser-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Klärschrei · Sofortzünder",
    "effectSummary": "Bereite Boost +1 vor. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_boost",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 2,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-wasser-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Klärschrei · Opfergabe",
    "effectSummary": "Bereite Boost +2 vor. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_boost",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-wasser-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Klärschrei · Opfergabe",
    "effectSummary": "Bereite Boost +2 vor. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_boost",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 2,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-erde-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Standschrei · Überladung",
    "effectSummary": "Bereite Angriff +4 vor. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-erde-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Standschrei · Überladung",
    "effectSummary": "Bereite Angriff +4 vor. Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 2,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-erde-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Standschrei · Verdichtung",
    "effectSummary": "Bereite Angriff +3 vor. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-erde-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Standschrei · Verdichtung",
    "effectSummary": "Bereite Angriff +3 vor. Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 2,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-erde-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Standschrei · Sofortzünder",
    "effectSummary": "Bereite Angriff +1 vor. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-erde-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Standschrei · Sofortzünder",
    "effectSummary": "Bereite Angriff +1 vor. Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 2,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-erde-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Standschrei · Opfergabe",
    "effectSummary": "Bereite Angriff +2 vor. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-erde-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Standschrei · Opfergabe",
    "effectSummary": "Bereite Angriff +2 vor. Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 2,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-luft-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Tempeschrei · Überladung",
    "effectSummary": "Bereite Angriff +4 vor. Nächster eigener Aktions-W6 +1 (max +2). Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-luft-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Tempeschrei · Überladung",
    "effectSummary": "Bereite Angriff +4 vor. Nächster eigener Aktions-W6 +1 (max +2). (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2). (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-luft-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Tempeschrei · Verdichtung",
    "effectSummary": "Bereite Angriff +3 vor. Nächster eigener Aktions-W6 +1 (max +2). Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-luft-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Tempeschrei · Verdichtung",
    "effectSummary": "Bereite Angriff +3 vor. Nächster eigener Aktions-W6 +1 (max +2). (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2). (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-luft-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Tempeschrei · Sofortzünder",
    "effectSummary": "Bereite Angriff +1 vor. Nächster eigener Aktions-W6 +1 (max +2). Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-luft-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Tempeschrei · Sofortzünder",
    "effectSummary": "Bereite Angriff +1 vor. Nächster eigener Aktions-W6 +1 (max +2). (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2). (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-luft-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Tempeschrei · Opfergabe",
    "effectSummary": "Bereite Angriff +2 vor. Nächster eigener Aktions-W6 +1 (max +2). Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-luft-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Tempeschrei · Opfergabe",
    "effectSummary": "Bereite Angriff +2 vor. Nächster eigener Aktions-W6 +1 (max +2). (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2). (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-licht-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Klarschrei · Überladung",
    "effectSummary": "Bereite Boost +4 vor. Bei Schildgewinn: entferne optional eine Marke von dir. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_boost",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-licht-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Klarschrei · Überladung",
    "effectSummary": "Bereite Boost +4 vor. Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_boost",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 2,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-licht-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Klarschrei · Verdichtung",
    "effectSummary": "Bereite Boost +3 vor. Bei Schildgewinn: entferne optional eine Marke von dir. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_boost",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-licht-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Klarschrei · Verdichtung",
    "effectSummary": "Bereite Boost +3 vor. Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_boost",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 2,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-licht-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Klarschrei · Sofortzünder",
    "effectSummary": "Bereite Boost +1 vor. Bei Schildgewinn: entferne optional eine Marke von dir. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_boost",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-licht-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Klarschrei · Sofortzünder",
    "effectSummary": "Bereite Boost +1 vor. Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_boost",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 2,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-licht-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Klarschrei · Opfergabe",
    "effectSummary": "Bereite Boost +2 vor. Bei Schildgewinn: entferne optional eine Marke von dir. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_boost",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-licht-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Klarschrei · Opfergabe",
    "effectSummary": "Bereite Boost +2 vor. Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_boost",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 2,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-schatten-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Fluchschrei · Überladung",
    "effectSummary": "Bereite Angriff +4 vor. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-schatten-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Fluchschrei · Überladung",
    "effectSummary": "Bereite Angriff +4 vor. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-schatten-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Fluchschrei · Verdichtung",
    "effectSummary": "Bereite Angriff +3 vor. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-schatten-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Fluchschrei · Verdichtung",
    "effectSummary": "Bereite Angriff +3 vor. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-schatten-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Fluchschrei · Sofortzünder",
    "effectSummary": "Bereite Angriff +1 vor. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-schatten-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Fluchschrei · Sofortzünder",
    "effectSummary": "Bereite Angriff +1 vor. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-adrenalinschrei-schatten-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Fluchschrei · Opfergabe",
    "effectSummary": "Bereite Angriff +2 vor. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "prep_attack",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-adrenalinschrei-schatten-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Fluchschrei · Opfergabe",
    "effectSummary": "Bereite Angriff +2 vor. Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "prep_attack",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-feuer-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Glutfessel · Überladung",
    "effectSummary": "Fessel Intensität 4 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Lebensschaden: Brennen, falls keine Reaktion. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "fessel",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": 4,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-feuer-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Glutfessel · Überladung",
    "effectSummary": "Fessel Intensität 5 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "fessel",
      "value": 5,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 5,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-feuer-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Glutfessel · Verdichtung",
    "effectSummary": "Fessel Intensität 3 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Lebensschaden: Brennen, falls keine Reaktion. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "fessel",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": 3,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-feuer-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Glutfessel · Verdichtung",
    "effectSummary": "Fessel Intensität 4 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "fessel",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 4,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-feuer-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Glutfessel · Sofortzünder",
    "effectSummary": "Fessel Intensität 1 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Lebensschaden: Brennen, falls keine Reaktion. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "fessel",
      "value": 1,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-feuer-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Glutfessel · Sofortzünder",
    "effectSummary": "Fessel Intensität 2 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "fessel",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-feuer-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Glutfessel · Opfergabe",
    "effectSummary": "Fessel Intensität 2 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Lebensschaden: Brennen, falls keine Reaktion. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "fessel",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion.",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-feuer-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Glutfessel · Opfergabe",
    "effectSummary": "Fessel Intensität 3 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "fessel",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 3,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-wasser-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Nasspanzer · Überladung",
    "effectSummary": "Heile 4 Leben. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "heal",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-wasser-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Nasspanzer · Überladung",
    "effectSummary": "Heile 6 Leben. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "heal",
      "value": 6,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-wasser-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Nasspanzer · Verdichtung",
    "effectSummary": "Heile 3 Leben. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "heal",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-wasser-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Nasspanzer · Verdichtung",
    "effectSummary": "Heile 5 Leben. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "heal",
      "value": 5,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-wasser-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Nasspanzer · Sofortzünder",
    "effectSummary": "Heile 1 Leben. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "heal",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-wasser-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Nasspanzer · Sofortzünder",
    "effectSummary": "Heile 3 Leben. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "heal",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-wasser-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Nasspanzer · Opfergabe",
    "effectSummary": "Heile 2 Leben. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "heal",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-wasser-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Nasspanzer · Opfergabe",
    "effectSummary": "Heile 4 Leben. Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "heal",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung oder Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-erde-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Erdpanzer · Überladung",
    "effectSummary": "Gewinne 4 Schild. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "shield",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-erde-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Erdpanzer · Überladung",
    "effectSummary": "Gewinne 6 Schild. Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "shield",
      "value": 6,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-erde-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Erdpanzer · Verdichtung",
    "effectSummary": "Gewinne 3 Schild. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "shield",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-erde-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Erdpanzer · Verdichtung",
    "effectSummary": "Gewinne 5 Schild. Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "shield",
      "value": 5,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-erde-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Erdpanzer · Sofortzünder",
    "effectSummary": "Gewinne 1 Schild. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "shield",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-erde-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Erdpanzer · Sofortzünder",
    "effectSummary": "Gewinne 3 Schild. Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "shield",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-erde-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Erdpanzer · Opfergabe",
    "effectSummary": "Gewinne 2 Schild. Verwendete Komponenten +1 Stabilität bis nächste Startphase. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "shield",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-erde-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-erde",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Erdpanzer · Opfergabe",
    "effectSummary": "Gewinne 4 Schild. Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "shield",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-stabilitaet",
      "summary": "Verwendete Komponenten +1 Stabilität bis nächste Startphase. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-luft-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Windpanzer · Überladung",
    "effectSummary": "Gewinne 4 Schild. Nächster eigener Aktions-W6 +1 (max +2). Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "shield",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-luft-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Windpanzer · Überladung",
    "effectSummary": "Gewinne 6 Schild. Nächster eigener Aktions-W6 +1 (max +2). (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "shield",
      "value": 6,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2). (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-luft-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Windpanzer · Verdichtung",
    "effectSummary": "Gewinne 3 Schild. Nächster eigener Aktions-W6 +1 (max +2). Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "shield",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-luft-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Windpanzer · Verdichtung",
    "effectSummary": "Gewinne 5 Schild. Nächster eigener Aktions-W6 +1 (max +2). (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "shield",
      "value": 5,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2). (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-luft-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Windpanzer · Sofortzünder",
    "effectSummary": "Gewinne 1 Schild. Nächster eigener Aktions-W6 +1 (max +2). Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "shield",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-luft-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Windpanzer · Sofortzünder",
    "effectSummary": "Gewinne 3 Schild. Nächster eigener Aktions-W6 +1 (max +2). (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "shield",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2). (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-luft-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Windpanzer · Opfergabe",
    "effectSummary": "Gewinne 2 Schild. Nächster eigener Aktions-W6 +1 (max +2). Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "shield",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2).",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-luft-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Windpanzer · Opfergabe",
    "effectSummary": "Gewinne 4 Schild. Nächster eigener Aktions-W6 +1 (max +2). (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "shield",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-w6",
      "summary": "Nächster eigener Aktions-W6 +1 (max +2). (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-licht-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Lichtpanzer · Überladung",
    "effectSummary": "Gewinne 4 Schild. Bei Schildgewinn: entferne optional eine Marke von dir. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "shield",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-licht-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Lichtpanzer · Überladung",
    "effectSummary": "Gewinne 6 Schild. Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "shield",
      "value": 6,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-licht-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Lichtpanzer · Verdichtung",
    "effectSummary": "Gewinne 3 Schild. Bei Schildgewinn: entferne optional eine Marke von dir. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "shield",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-licht-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Lichtpanzer · Verdichtung",
    "effectSummary": "Gewinne 5 Schild. Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "shield",
      "value": 5,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-licht-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Lichtpanzer · Sofortzünder",
    "effectSummary": "Gewinne 1 Schild. Bei Schildgewinn: entferne optional eine Marke von dir. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "shield",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-licht-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Lichtpanzer · Sofortzünder",
    "effectSummary": "Gewinne 3 Schild. Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "shield",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-licht-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Lichtpanzer · Opfergabe",
    "effectSummary": "Gewinne 2 Schild. Bei Schildgewinn: entferne optional eine Marke von dir. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "shield",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir.",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-licht-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-licht",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Lichtpanzer · Opfergabe",
    "effectSummary": "Gewinne 4 Schild. Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Primär +2 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "shield",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen-licht",
      "summary": "Bei Schildgewinn: entferne optional eine Marke von dir. (verstärkt)",
      "defenseSuppressible": false
    },
    "intensity": 1,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": 2,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-schatten-ueberladung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Schattenfessel · Überladung",
    "effectSummary": "Fessel Intensität 4 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Primärwert +2; danach erleidest du 1 Selbstschaden. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "fessel",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": 4,
    "transformId": "xform-ueberladung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-schatten-ueberladung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Überformel Schattenfessel · Überladung",
    "effectSummary": "Fessel Intensität 5 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt) Primärwert +2; danach erleidest du 1 Selbstschaden. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "fessel",
      "value": 5,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 5,
    "transformId": "xform-ueberladung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-schatten-verdichtung",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Schattenfessel · Verdichtung",
    "effectSummary": "Fessel Intensität 3 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "fessel",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": 3,
    "transformId": "xform-verdichtung",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-schatten-verdichtung",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Überformel Schattenfessel · Verdichtung",
    "effectSummary": "Fessel Intensität 4 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt) Primärwert +1; verwendete Komponenten erhalten +1 Stabilität. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "fessel",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 4,
    "transformId": "xform-verdichtung",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-schatten-sofortzuender",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Schattenfessel · Sofortzünder",
    "effectSummary": "Fessel Intensität 1 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Primärwert −1; danach ziehe 1 und wirf 1 ab. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "fessel",
      "value": 1,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": 1,
    "transformId": "xform-sofortzuender",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-schatten-sofortzuender",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Überformel Schattenfessel · Sofortzünder",
    "effectSummary": "Fessel Intensität 2 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt) Primärwert −1; danach ziehe 1 und wirf 1 ab. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "fessel",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-sofortzuender",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  },
  {
    "recipeId": "v6-tek-magiepanzer-schatten-opfergabe",
    "kind": "tek",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Schattenfessel · Opfergabe",
    "effectSummary": "Fessel Intensität 2 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. Optional: wirf 1 Handkarte ab für Primärwert +2. TEK: +1 Fetzladung (max 1×/Zug).",
    "primary": {
      "kind": "fessel",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente.",
      "defenseSuppressible": true
    },
    "intensity": 2,
    "transformId": "xform-opfergabe",
    "grantsFetz": true,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": null,
    "formulaDefensePenalty": null
  },
  {
    "recipeId": "v6-over-magiepanzer-schatten-opfergabe",
    "kind": "overformula",
    "catalogSlice": "slice1",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-schatten",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Überformel Schattenfessel · Opfergabe",
    "effectSummary": "Fessel Intensität 3 auf einen besetzten gegnerischen Formelplatz (manuelle Wahl). Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt) Optional: wirf 1 Handkarte ab für Primärwert +2. Überformel: Intensität +1 (fester Slice-1-Bonus). Überformel: Fetzladung wird verbraucht. Formelabwehr −1.",
    "primary": {
      "kind": "fessel",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-fluch",
      "summary": "Bei Treffer: erschöpfe optional 1 gegnerische Formelkomponente. (verstärkt)",
      "defenseSuppressible": true
    },
    "intensity": 3,
    "transformId": "xform-opfergabe",
    "grantsFetz": false,
    "catalystConsumed": true,
    "overformulaPrimaryBonus": null,
    "overformulaIntensityBonus": 1,
    "formulaDefensePenalty": -1
  }
] as const;

export const V6_GENERATED_CATALOG_VERSION = 1 as const;

export const V6_GENERATED_RECIPE_COUNT = 198 as const;
