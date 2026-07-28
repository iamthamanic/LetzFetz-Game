/**
 * V3 Area51 blueprint seed content (§16).
 * Location: src/game/packs/v3/blueprints.ts
 */
import type { BlueprintDef } from '../../types';

/** Playable seed — not the full physical catalog. */
export const V3_BLUEPRINT_SEED: BlueprintDef[] = [
  {
    id: 'bp-dampf-nebelkanone',
    name: 'Illegale Nebelkanone',
    effectText: 'Wenn Dampf ausgelöst wird, entsteht Dichter Nebel statt Nebel.',
    requiredRoles: ['traeger', 'antrieb', 'aufsatz'],
    hooks: { dampfBecomesDichterNebel: true },
  },
  {
    id: 'bp-hotbox-erhalt',
    name: 'Hotbox-Markenerhalt',
    effectText: 'Die erste verwendete Elementmarke dieser Aktion wird nicht entfernt.',
    sameElementCount: 2,
    element: 'earth',
    hooks: { preserveFirstConsumedMark: true },
  },
  {
    id: 'bp-doppelreaktion',
    name: 'Doppelzündung',
    effectText: 'Einmal pro Aktion dürfen zwei Reaktionen ausgelöst werden.',
    sameElementCount: 3,
    element: 'fire',
    hooks: { doubleReaction: true },
  },
];
