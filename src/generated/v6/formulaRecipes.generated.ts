/**
 * GENERATED FILE — DO NOT HAND-EDIT.
 * Produced by scripts/generate-v6-formula-recipes.ts
 * Location: src/generated/v6/formulaRecipes.generated.ts
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
  techniqueId: string | null;
  essenceId: string | null;
  catalystId: string | null;
  name: string;
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

export const V6_GENERATED_FORMULA_RECIPES: readonly V6GeneratedFormulaRecipe[] = [
  {
    "recipeId": "v6-te-impulsgeschoss-feuer",
    "kind": "te",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": null,
    "name": "Glutimpuls",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": null,
    "name": "Spritzschuss",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": null,
    "name": "Luftnadel",
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
    "recipeId": "v6-te-adrenalinschrei-feuer",
    "kind": "te",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": null,
    "name": "Kampfschrei",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": null,
    "name": "Klärschrei",
    "primary": {
      "kind": "prep_boost",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": null,
    "name": "Tempeschrei",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": null,
    "name": "Hitzepanzer",
    "primary": {
      "kind": "shield",
      "value": 1,
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
    "recipeId": "v6-te-magiepanzer-wasser",
    "kind": "te",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": null,
    "name": "Nasspanzer",
    "primary": {
      "kind": "heal",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": null,
    "name": "Windpanzer",
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
    "recipeId": "v6-tk-impulsgeschoss-ueberladung",
    "kind": "tk",
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": null,
    "catalystId": "v6-katalysator-ueberladung",
    "name": "TK impulsgeschoss+ueberladung",
    "primary": {
      "kind": "damage",
      "value": 3,
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": null,
    "catalystId": "v6-katalysator-verdichtung",
    "name": "TK impulsgeschoss+verdichtung",
    "primary": {
      "kind": "damage",
      "value": 2,
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": null,
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "TK impulsgeschoss+sofortzuender",
    "primary": {
      "kind": "damage",
      "value": 0,
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": null,
    "catalystId": "v6-katalysator-opfergabe",
    "name": "TK impulsgeschoss+opfergabe",
    "primary": {
      "kind": "damage",
      "value": 1,
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": null,
    "catalystId": "v6-katalysator-ueberladung",
    "name": "TK adrenalinschrei+ueberladung",
    "primary": {
      "kind": "prep_attack",
      "value": 3,
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": null,
    "catalystId": "v6-katalysator-verdichtung",
    "name": "TK adrenalinschrei+verdichtung",
    "primary": {
      "kind": "prep_attack",
      "value": 2,
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": null,
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "TK adrenalinschrei+sofortzuender",
    "primary": {
      "kind": "prep_attack",
      "value": 0,
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": null,
    "catalystId": "v6-katalysator-opfergabe",
    "name": "TK adrenalinschrei+opfergabe",
    "primary": {
      "kind": "prep_attack",
      "value": 1,
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": null,
    "catalystId": "v6-katalysator-ueberladung",
    "name": "TK magiepanzer+ueberladung",
    "primary": {
      "kind": "shield",
      "value": 3,
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": null,
    "catalystId": "v6-katalysator-verdichtung",
    "name": "TK magiepanzer+verdichtung",
    "primary": {
      "kind": "shield",
      "value": 2,
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": null,
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "TK magiepanzer+sofortzuender",
    "primary": {
      "kind": "shield",
      "value": 0,
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": null,
    "catalystId": "v6-katalysator-opfergabe",
    "name": "TK magiepanzer+opfergabe",
    "primary": {
      "kind": "shield",
      "value": 1,
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
    "techniqueId": null,
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "EK feuer+ueberladung",
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
    "techniqueId": null,
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "EK feuer+verdichtung",
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
    "techniqueId": null,
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "EK feuer+sofortzuender",
    "primary": {
      "kind": "damage",
      "value": 0,
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
    "techniqueId": null,
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "EK feuer+opfergabe",
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
    "techniqueId": null,
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "EK wasser+ueberladung",
    "primary": {
      "kind": "heal",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": null,
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "EK wasser+verdichtung",
    "primary": {
      "kind": "heal",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": null,
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "EK wasser+sofortzuender",
    "primary": {
      "kind": "heal",
      "value": 0,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": null,
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "EK wasser+opfergabe",
    "primary": {
      "kind": "heal",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": null,
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "EK luft+ueberladung",
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
    "techniqueId": null,
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "EK luft+verdichtung",
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
    "techniqueId": null,
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "EK luft+sofortzuender",
    "primary": {
      "kind": "prep_boost",
      "value": 0,
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
    "techniqueId": null,
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "EK luft+opfergabe",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Glutimpuls · Fusion",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Glutimpuls · Überformel",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Glutimpuls · Fusion",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Glutimpuls · Überformel",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Glutimpuls · Fusion",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Glutimpuls · Überformel",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Glutimpuls · Fusion",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Glutimpuls · Überformel",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Spritzschuss · Fusion",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Spritzschuss · Überformel",
    "primary": {
      "kind": "damage",
      "value": 6,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub). (verstärkt)",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Spritzschuss · Fusion",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Spritzschuss · Überformel",
    "primary": {
      "kind": "damage",
      "value": 5,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub). (verstärkt)",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Spritzschuss · Fusion",
    "primary": {
      "kind": "damage",
      "value": 1,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Spritzschuss · Überformel",
    "primary": {
      "kind": "damage",
      "value": 3,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub). (verstärkt)",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Spritzschuss · Fusion",
    "primary": {
      "kind": "damage",
      "value": 2,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Spritzschuss · Überformel",
    "primary": {
      "kind": "damage",
      "value": 4,
      "target": "opponent",
      "offensive": true
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub). (verstärkt)",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Luftnadel · Fusion",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Luftnadel · Überformel",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Luftnadel · Fusion",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Luftnadel · Überformel",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Luftnadel · Fusion",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Luftnadel · Überformel",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Luftnadel · Fusion",
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
    "techniqueId": "v6-technik-impulsgeschoss",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Luftnadel · Überformel",
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
    "recipeId": "v6-tek-adrenalinschrei-feuer-ueberladung",
    "kind": "tek",
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Kampfschrei · Fusion",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Kampfschrei · Überformel",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Kampfschrei · Fusion",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Kampfschrei · Überformel",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Kampfschrei · Fusion",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Kampfschrei · Überformel",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Kampfschrei · Fusion",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Kampfschrei · Überformel",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Klärschrei · Fusion",
    "primary": {
      "kind": "prep_boost",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Klärschrei · Überformel",
    "primary": {
      "kind": "prep_boost",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub). (verstärkt)",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Klärschrei · Fusion",
    "primary": {
      "kind": "prep_boost",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Klärschrei · Überformel",
    "primary": {
      "kind": "prep_boost",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub). (verstärkt)",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Klärschrei · Fusion",
    "primary": {
      "kind": "prep_boost",
      "value": 0,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Klärschrei · Überformel",
    "primary": {
      "kind": "prep_boost",
      "value": 0,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub). (verstärkt)",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Klärschrei · Fusion",
    "primary": {
      "kind": "prep_boost",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Klärschrei · Überformel",
    "primary": {
      "kind": "prep_boost",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub). (verstärkt)",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Tempeschrei · Fusion",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Tempeschrei · Überformel",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Tempeschrei · Fusion",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Tempeschrei · Überformel",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Tempeschrei · Fusion",
    "primary": {
      "kind": "prep_attack",
      "value": 0,
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Tempeschrei · Überformel",
    "primary": {
      "kind": "prep_attack",
      "value": 0,
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Tempeschrei · Fusion",
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
    "techniqueId": "v6-technik-adrenalinschrei",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Tempeschrei · Überformel",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Hitzepanzer · Fusion",
    "primary": {
      "kind": "shield",
      "value": 3,
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
    "recipeId": "v6-over-magiepanzer-feuer-ueberladung",
    "kind": "overformula",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Hitzepanzer · Überformel",
    "primary": {
      "kind": "shield",
      "value": 5,
      "target": "self"
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
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
    "recipeId": "v6-tek-magiepanzer-feuer-verdichtung",
    "kind": "tek",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Hitzepanzer · Fusion",
    "primary": {
      "kind": "shield",
      "value": 2,
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
    "recipeId": "v6-over-magiepanzer-feuer-verdichtung",
    "kind": "overformula",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Hitzepanzer · Überformel",
    "primary": {
      "kind": "shield",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
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
    "recipeId": "v6-tek-magiepanzer-feuer-sofortzuender",
    "kind": "tek",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Hitzepanzer · Fusion",
    "primary": {
      "kind": "shield",
      "value": 0,
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
    "recipeId": "v6-over-magiepanzer-feuer-sofortzuender",
    "kind": "overformula",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Hitzepanzer · Überformel",
    "primary": {
      "kind": "shield",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
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
    "recipeId": "v6-tek-magiepanzer-feuer-opfergabe",
    "kind": "tek",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Hitzepanzer · Fusion",
    "primary": {
      "kind": "shield",
      "value": 1,
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
    "recipeId": "v6-over-magiepanzer-feuer-opfergabe",
    "kind": "overformula",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-feuer",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Hitzepanzer · Überformel",
    "primary": {
      "kind": "shield",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-brennen",
      "summary": "Bei Lebensschaden: Brennen, falls keine Reaktion. (verstärkt)",
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
    "recipeId": "v6-tek-magiepanzer-wasser-ueberladung",
    "kind": "tek",
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Nasspanzer · Fusion",
    "primary": {
      "kind": "heal",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Nasspanzer · Überformel",
    "primary": {
      "kind": "heal",
      "value": 6,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub). (verstärkt)",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Nasspanzer · Fusion",
    "primary": {
      "kind": "heal",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Nasspanzer · Überformel",
    "primary": {
      "kind": "heal",
      "value": 5,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub). (verstärkt)",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Nasspanzer · Fusion",
    "primary": {
      "kind": "heal",
      "value": 1,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Nasspanzer · Überformel",
    "primary": {
      "kind": "heal",
      "value": 3,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub). (verstärkt)",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Nasspanzer · Fusion",
    "primary": {
      "kind": "heal",
      "value": 2,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub).",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-wasser",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Nasspanzer · Überformel",
    "primary": {
      "kind": "heal",
      "value": 4,
      "target": "self"
    },
    "rider": {
      "id": "rider-reinigen",
      "summary": "Bei Heilung/Schild: optional Marke entfernen (Slice-1 stub). (verstärkt)",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Windpanzer · Fusion",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-ueberladung",
    "name": "Windpanzer · Überformel",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Windpanzer · Fusion",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-verdichtung",
    "name": "Windpanzer · Überformel",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Windpanzer · Fusion",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-sofortzuender",
    "name": "Windpanzer · Überformel",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Windpanzer · Fusion",
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
    "techniqueId": "v6-technik-magiepanzer",
    "essenceId": "v6-essenz-luft",
    "catalystId": "v6-katalysator-opfergabe",
    "name": "Windpanzer · Überformel",
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
  }
] as const;

export const V6_GENERATED_CATALOG_VERSION = 1 as const;

export const V6_GENERATED_RECIPE_COUNT = 105 as const;
