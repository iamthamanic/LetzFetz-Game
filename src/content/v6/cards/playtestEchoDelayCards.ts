/**
 * Playtest Echo / Delay catalyst card defs (#344) — outside Slice-1 locked set.
 * Location: src/content/v6/cards/playtestEchoDelayCards.ts
 */
import type { CatalystCardDef } from '../../../game/types';

export const V6_PLAYTEST_ECHO_CATALYST_ID = 'v6-katalysator-echo';
export const V6_PLAYTEST_DELAY_CATALYST_ID = 'v6-katalysator-verzoegerung';

export const V6_PLAYTEST_ECHO_DELAY_CATALYSTS: CatalystCardDef[] = [
  {
    kind: 'catalyst',
    id: V6_PLAYTEST_ECHO_CATALYST_ID,
    name: 'Echo',
    stability: 2,
    effectText:
      'Wiederhole zu Beginn deines nächsten Zuges 1 Punkt des Primärwerts. Bleibt bis zur Echo-Auflösung, dann Ablage.',
  },
  {
    kind: 'catalyst',
    id: V6_PLAYTEST_DELAY_CATALYST_ID,
    name: 'Verzögerung',
    stability: 3,
    effectText:
      'Primäreffekt zu Beginn deines nächsten Zuges mit +2. Bleibt bis zur Auflösung, dann Ablage.',
  },
];
