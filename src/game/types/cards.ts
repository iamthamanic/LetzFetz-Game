import type { Element } from './elements';
import type { ElementImpulseKeyword } from './impulseSchema';

export type ElementCardType = 'attack' | 'block' | 'boost';
export type GlitchTiming = 'playable' | 'instant';

/** V6 §36 value roles — absent on V1/V5 element defs. */
export type ElementValueRole = 'starter' | 'standard' | 'payoff' | 'drawback';

export interface CardBase {
  id: string;
  name: string;
}

export interface ElementCardDef extends CardBase {
  kind: 'element';
  element: Element;
  cardType: ElementCardType;
  value: number;
  instantText: string;
  /**
   * Bound / activate copy after building the card.
   * Optional: V6 hand-only element cards omit this (no bound-build path).
   */
  boundText?: string;
  /** V6 §36: 2 starter · 3 standard · 4 payoff · 6 drawback. */
  valueRole?: ElementValueRole;
  /** V3: typed impulse keyword (optional; legacy cards omit). */
  elementImpulse?: ElementImpulseKeyword;
}

export interface CharacterCardDef extends CardBase {
  kind: 'character';
  elements: [Element, Element];
  role: string;
  passiveText: string;
  /** V6 Option B: feste Macke id (absent on V5). */
  mackeId?: string;
  /** V6 Option B: German Macke display name. */
  mackeName?: string;
  ultimateId: string;
  strategyHint: string;
}

export interface UltimateCardDef extends CardBase {
  kind: 'ultimate';
  characterId: string;
  effectText: string;
}

export interface ArenaCardDef extends CardBase {
  kind: 'arena';
  role: string;
  baseEffect: string;
  trigger: string;
  specialRule: string;
  /** If set, roll W6 at arena start for variant index 0|1|2 (maps to 1-2, 3-4, 5-6). */
  d6Variants?: [string, string, string];
}

export interface GlitchCardDef extends CardBase {
  kind: 'glitch';
  glitchType: GlitchTiming;
  timing: string;
  effectText: string;
}

/** Phrase tag roles (V2 T3) — preferred tag on Engine-Teil. */
export type PhraseTag = 'core' | 'mode' | 'tool';

/** Built slot on the phrase board (V2). */
export type PhraseSlot = PhraseTag | 'charge';

/** V3 Fetzgerät roles (§12) — legacy; V5 uses FormulaSlot. */
export type FetzgeraetSlot = 'traeger' | 'antrieb' | 'aufsatz';

/** V5 Formelplätze (Technik / Essenz / Katalysator). */
export type FormulaSlot = 'technik' | 'essenz' | 'katalysator';

export type FormulaActivationMode =
  | 'instant'
  | 'prep_attack'
  | 'prep_block'
  | 'prep_boost'
  | 'reaction';

/** Map legacy V2 phrase slots → V3 Fetzgerät roles (charge has no role slot). */
export const PHRASE_TO_FETZ: Record<Exclude<PhraseSlot, 'charge'>, FetzgeraetSlot> = {
  core: 'traeger',
  mode: 'antrieb',
  tool: 'aufsatz',
};

export const FETZ_TO_PHRASE: Record<FetzgeraetSlot, Exclude<PhraseSlot, 'charge'>> = {
  traeger: 'core',
  antrieb: 'mode',
  aufsatz: 'tool',
};

/** Light passive while built (V2 E3 start set). */
export type PassiveArchetype = 'p_atk' | 'p_block' | 'p_draw';

/** Activation effect (V2 E3 start set); costs always A1. */
export type ActivateArchetype = 'a_dmg' | 'a_heal' | 'a_exhaust';

/** V2 Engine-Teil — phrase part only; not playable as attack/block. */
export interface EnginePartCardDef extends CardBase {
  kind: 'enginePart';
  element: Element;
  preferredTag: PhraseTag;
  /** V3 preferred role; defaults from preferredTag via PHRASE_TO_FETZ when omitted. */
  preferredRole?: FetzgeraetSlot;
  resistance: number;
  passiveArchetype: PassiveArchetype;
  activateArchetype: ActivateArchetype;
  /** V3 authored effect copy (display/canon; hooks may still use archetypes). */
  effectText?: string;
  /** V3 Aufsatz activation cost in shared charge units (when set). */
  activateCost?: number;
}

/** V5 Technik — execution form; no element. */
export interface TechniqueCardDef extends CardBase {
  kind: 'technique';
  stability: number;
  activationMode: FormulaActivationMode;
  effectText: string;
  visual?: import('./formulaVisual').TechniqueVisual;
  /** Structured effect for engine resolve (optional until pack authoring). */
  formulaEffect?: import('./formulaEffects').FormulaTechniqueEffect;
}

/** V5 Essenz — secondary element + status contribution. */
export interface EssenceCardDef extends CardBase {
  kind: 'essence';
  element: Element;
  stability: number;
  effectText: string;
  visual?: import('./formulaVisual').EssenceVisual;
  formulaEffect?: import('./formulaEffects').FormulaEssenceEffect;
}

/** V5 Katalysator — timing / transformation. */
export interface CatalystCardDef extends CardBase {
  kind: 'catalyst';
  stability: number;
  effectText: string;
  visual?: import('./formulaVisual').CatalystVisual;
  formulaEffect?: import('./formulaEffects').FormulaCatalystEffect;
}

/** V5 Gegenstand — consumable (hand, once) or permanent equipment (board slots). */
export type ItemPermanence = 'consumable' | 'equipment';

/** V5 Gegenstand — one-shot tactical card or permanent equipment. */
export interface ItemCardDef extends CardBase {
  kind: 'item';
  timing: 'action' | 'reaction';
  effectText: string;
  /**
   * `consumable` (default): play from hand, discard immediately.
   * `equipment`: equip to board slots (not formula); stays until replaced
   *   (or consumed — e.g. Rostiger Nagel on attack that takes ignore-shield prep).
   */
  permanence?: ItemPermanence;
}

export type CardDef =
  | ElementCardDef
  | CharacterCardDef
  | UltimateCardDef
  | ArenaCardDef
  | GlitchCardDef
  | EnginePartCardDef
  | TechniqueCardDef
  | EssenceCardDef
  | CatalystCardDef
  | ItemCardDef;

/** Runtime card instance in a match (deck/hand/bound). */
export interface CardInstance {
  instanceId: string;
  defId: string;
}

export interface BoundCardInstance extends CardInstance {
  exhausted: boolean;
  /** Temporary resistance bonus until owner's next turn start. */
  resistanceBonus: number;
  /** Mysterium: treat as this element for synergies this binding. */
  treatedElement?: Element;
  /** V2 phrase board slot when built from a V2 pack. */
  phraseSlot?: PhraseSlot;
  /** V3 Fetzgerät role slot (Träger/Antrieb/Aufsatz). */
  fetzSlot?: FetzgeraetSlot;
}

/** V5 Formelkomponente on the formula board. */
export interface FormulaComponentInstance extends CardInstance {
  slot: FormulaSlot;
  exhausted: boolean;
  /** V5 §24 — disturbed components ignore effect/element until start restore. */
  disturbed: boolean;
  /** Temporary stability delta until owner's next start (can be negative). */
  stabilityBonus: number;
  /**
   * V5 Elementarladung — only meaningful on Essenz.
   * Absent/false on old saves = inactive. Persists across start-phase upright.
   */
  elementalCharge?: boolean;
  /**
   * V6 Fessel intensity 1–3 on this component (spielkonzept §33.5).
   * Absent/0 = none. Decays −1 on owner's Startphase after effects apply.
   */
  fesselIntensity?: number;
  /**
   * V6: set during Startphase when Fessel was ≥2 — component cannot activate this cycle.
   */
  fesselBlocksActivation?: boolean;
}

export interface ContentPack {
  id: string;
  name: string;
  version: string;
  characters: CharacterCardDef[];
  ultimates: UltimateCardDef[];
  arenas: ArenaCardDef[];
  elementCards: ElementCardDef[];
  glitches: GlitchCardDef[];
  /** V2 phrase parts — optional; included in main deck when present. */
  engineParts?: EnginePartCardDef[];
  /** V5 Formelkomponenten — optional; main deck when present. */
  techniques?: TechniqueCardDef[];
  essences?: EssenceCardDef[];
  catalysts?: CatalystCardDef[];
  items?: ItemCardDef[];
  /** V3 Area51 blueprint seed combos (optional). */
  blueprints?: import('./blueprint').BlueprintDef[];
}
