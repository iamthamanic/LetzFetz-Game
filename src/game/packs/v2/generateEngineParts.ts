/**
 * V2 Ggen — generic Engine-Teil templates with Cbias tag→archetype defaults.
 * Location: src/game/packs/v2/generateEngineParts.ts
 */
import type {
  ActivateArchetype,
  Element,
  EnginePartCardDef,
  PassiveArchetype,
  PhraseTag,
} from '../../types';
import type { Rng } from '../../engine/deck';

const ELEMENTS: Element[] = ['fire', 'water', 'earth', 'air', 'shadow', 'light'];

const ELEMENT_LABELS: Record<Element, string> = {
  fire: 'Feuer',
  water: 'Wasser',
  earth: 'Erde',
  air: 'Luft',
  shadow: 'Schatten',
  light: 'Licht',
};

const TAG_LABELS: Record<PhraseTag, string> = {
  core: 'Kern',
  mode: 'Modus',
  tool: 'Werkzeug',
};

const TAGS: PhraseTag[] = ['core', 'mode', 'tool'];

const PASSIVES: PassiveArchetype[] = ['p_atk', 'p_block', 'p_draw'];
const ACTIVATES: ActivateArchetype[] = ['a_dmg', 'a_heal', 'a_exhaust'];

/** Cbias defaults (D33). */
export const CBIAS_DEFAULTS: Record<
  PhraseTag,
  { passive: PassiveArchetype; activate: ActivateArchetype }
> = {
  core: { passive: 'p_atk', activate: 'a_dmg' },
  mode: { passive: 'p_draw', activate: 'a_heal' },
  tool: { passive: 'p_block', activate: 'a_exhaust' },
};

const RESISTANCE_BY_TAG: Record<PhraseTag, number[]> = {
  core: [4, 5, 6],
  mode: [3, 4, 5],
  tool: [2, 3, 4],
};

function pick<T>(items: T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)]!;
}

function pickOffDefault<T>(defaults: T, all: T[], rng: Rng): T {
  const others = all.filter((x) => x !== defaults);
  return pick(others, rng);
}

export interface GenerateEnginePartsOptions {
  count?: number;
  /** Probability of Off-Default archetype (D33 ~20–30%). */
  offBiasRate?: number;
  rng: Rng;
}

/** Generate generic Engine-Teil defs (Ggen + Cbias). */
export function generateEngineParts(
  options: GenerateEnginePartsOptions,
): EnginePartCardDef[] {
  const count = options.count ?? 30;
  const offBiasRate = options.offBiasRate ?? 0.25;
  const { rng } = options;
  const parts: EnginePartCardDef[] = [];

  for (let i = 0; i < count; i++) {
    const element = ELEMENTS[i % ELEMENTS.length]!;
    const preferredTag = TAGS[i % TAGS.length]!;
    const bias = CBIAS_DEFAULTS[preferredTag];
    const off = rng() < offBiasRate;

    const passiveArchetype = off
      ? pickOffDefault(bias.passive, PASSIVES, rng)
      : bias.passive;
    const activateArchetype = off
      ? pickOffDefault(bias.activate, ACTIVATES, rng)
      : bias.activate;

    const resistance = pick(RESISTANCE_BY_TAG[preferredTag], rng);
    const n = String(Math.floor(i / ELEMENTS.length) + 1).padStart(2, '0');
    const label = ELEMENT_LABELS[element];
    const tagLabel = TAG_LABELS[preferredTag];

    parts.push({
      id: `v2-part-${element}-${preferredTag}-${n}`,
      name: `${label}-${tagLabel} ${n}`,
      kind: 'enginePart',
      element,
      preferredTag,
      resistance,
      passiveArchetype,
      activateArchetype,
    });
  }

  return parts;
}

/** Share of parts whose archetypes deviate from Cbias defaults. */
export function measureOffBiasRate(parts: EnginePartCardDef[]): number {
  if (parts.length === 0) return 0;
  let off = 0;
  for (const part of parts) {
    const bias = CBIAS_DEFAULTS[part.preferredTag];
    if (
      part.passiveArchetype !== bias.passive ||
      part.activateArchetype !== bias.activate
    ) {
      off += 1;
    }
  }
  return off / parts.length;
}
