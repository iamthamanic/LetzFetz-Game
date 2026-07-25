/**
 * Maps Play setup Kartenset choice → pack + ruleset for createGame.
 * Location: src/features/play/setup/resolveGamePackChoice.ts
 */
import {
  BASE_PACK,
  V2_P100_PACK,
  P100_RULESET,
  V3_RULESET,
  type ContentPack,
  type RulesetConfig,
} from '../../../game';

/** Kartenset tile in Play setup (V1 base, V2 P100, or V3 combat on base cards). */
export type GamePackChoice = 'base' | 'p100' | 'v3';

export interface ResolvedGamePackChoice {
  pack: ContentPack;
  ruleset: RulesetConfig | undefined;
  playtestHpCap: number | undefined;
}

/** Resolve Kartenset tile to engine pack + optional ruleset / playtest HP cap. */
export function resolveGamePackChoice(choice: GamePackChoice): ResolvedGamePackChoice {
  switch (choice) {
    case 'p100':
      return { pack: V2_P100_PACK, ruleset: P100_RULESET, playtestHpCap: 30 };
    case 'v3':
      return { pack: BASE_PACK, ruleset: V3_RULESET, playtestHpCap: undefined };
    case 'base':
    default:
      return { pack: BASE_PACK, ruleset: undefined, playtestHpCap: undefined };
  }
}
