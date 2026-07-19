import type { Element } from './elements';

export type ElementCardType = 'attack' | 'block' | 'boost';
export type GlitchTiming = 'playable' | 'instant';

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
  boundText: string;
}

export interface CharacterCardDef extends CardBase {
  kind: 'character';
  elements: [Element, Element];
  role: string;
  passiveText: string;
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

/** Light passive while built (V2 E3 start set). */
export type PassiveArchetype = 'p_atk' | 'p_block' | 'p_draw';

/** Activation effect (V2 E3 start set); costs always A1. */
export type ActivateArchetype = 'a_dmg' | 'a_heal' | 'a_exhaust';

/** V2 Engine-Teil — phrase part only; not playable as attack/block. */
export interface EnginePartCardDef extends CardBase {
  kind: 'enginePart';
  element: Element;
  preferredTag: PhraseTag;
  resistance: number;
  passiveArchetype: PassiveArchetype;
  activateArchetype: ActivateArchetype;
}

export type CardDef =
  | ElementCardDef
  | CharacterCardDef
  | UltimateCardDef
  | ArenaCardDef
  | GlitchCardDef
  | EnginePartCardDef;

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
}
