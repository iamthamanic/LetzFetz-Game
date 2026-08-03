/**
 * Playtest Construct + Beschwörung catalyst (#346) — outside Slice-1 locked set.
 * Location: src/content/v6/cards/playtestConstructCards.ts
 */
import type { CatalystCardDef } from '../../../game/types';

export const V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID = 'v6-katalysator-beschwoerung';
export const V6_PLAYTEST_CONSTRUCT_DEF_ID = 'v6-konstrukt-spieltest-schattenpuppe';

/** Lightweight construct definition (not a deck card / ContentPack entry). */
export interface V6ConstructDef {
  kind: 'construct';
  id: string;
  name: string;
  printedHaltbarkeit: number;
  effectText: string;
}

const V6_PLAYTEST_CONSTRUCT_DEFS: readonly V6ConstructDef[] = [
  {
    kind: 'construct',
    id: V6_PLAYTEST_CONSTRUCT_DEF_ID,
    name: 'Schattenpuppe',
    printedHaltbarkeit: 3,
    effectText:
      'Playtest-Konstrukt. Max 1 pro Spieler. Haltbarkeit −1 in der Startphase. Herausforderbar. Keine Fetz.',
  },
];

export const V6_PLAYTEST_BESCHWOERUNG_CATALYSTS: CatalystCardDef[] = [
  {
    kind: 'catalyst',
    id: V6_PLAYTEST_BESCHWOERUNG_CATALYST_ID,
    name: 'Beschwörung',
    stability: 3,
    effectText:
      'EK-Ritual: beschwöre ein Konstrukt mit Haltbarkeit 3. Ersetzt ein bestehendes Konstrukt sofort. Wird verbraucht.',
  },
];

export function getV6ConstructDef(defId: string): V6ConstructDef | undefined {
  return V6_PLAYTEST_CONSTRUCT_DEFS.find((d) => d.id === defId);
}
