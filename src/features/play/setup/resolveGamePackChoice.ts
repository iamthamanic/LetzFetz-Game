/**
 * Maps Play setup Kartenset choice → pack + ruleset for createGame.
 * Location: src/features/play/setup/resolveGamePackChoice.ts
 */
import {
  BASE_PACK,
  V2_P100_PACK,
  P100_RULESET,
  V3_RULESET,
  V5_PACK,
  V5_PACK_RULESET,
  V6_CORE_PACK,
  V6_PACK_RULESET,
  type ContentPack,
  type PlaytestHpCap,
  type RulesetConfig,
} from '../../../game';
import { mergeFormulaPlayOverlay } from '../../../game/packs/mergeFormulaPlayOverlay';
import { loadFormulaPlayOptInStore } from '../../../services/storage/formulaPlayOptIn';
import { isV6PlayableEnabled } from './v6PlayableFlag';

/** Kartenset tile in Play setup. */
export type GamePackChoice = 'base' | 'p100' | 'v3' | 'v5' | 'v6';

export interface ResolvedGamePackChoice {
  pack: ContentPack;
  ruleset: RulesetConfig | undefined;
  playtestHpCap: PlaytestHpCap | undefined;
}

/** Resolve Kartenset tile to engine pack + optional ruleset / playtest HP cap. */
export function resolveGamePackChoice(choice: GamePackChoice): ResolvedGamePackChoice {
  switch (choice) {
    case 'v6': {
      if (!isV6PlayableEnabled()) {
        throw new Error('V6_PLAYABLE required for pack choice v6');
      }
      return { pack: V6_CORE_PACK, ruleset: V6_PACK_RULESET, playtestHpCap: 30 };
    }
    case 'v5': {
      const optIn = loadFormulaPlayOptInStore();
      const pack = mergeFormulaPlayOverlay(V5_PACK, optIn.deckOptIns);
      return { pack, ruleset: V5_PACK_RULESET, playtestHpCap: 30 };
    }
    case 'p100':
      return { pack: V2_P100_PACK, ruleset: P100_RULESET, playtestHpCap: 30 };
    case 'v3':
      return { pack: BASE_PACK, ruleset: V3_RULESET, playtestHpCap: undefined };
    case 'base':
    default:
      return { pack: BASE_PACK, ruleset: undefined, playtestHpCap: undefined };
  }
}
