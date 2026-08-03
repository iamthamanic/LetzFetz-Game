/**
 * V6 Gegenstände / Ausrüstung helpers (§37–40).
 * Location: src/game/engine/v6/items.ts
 *
 * Max 2 equipment slots; consumables max 1 / own turn under v6Formula.
 */
import type { CardInstance, ItemCardDef, PlayerId, GameState } from '../../types';

export const V6_MAX_EQUIPMENT_SLOTS = 2;

/** Strip v5-/v6-item- prefix for shared effect dispatch. */
export function itemEffectSlug(defId: string): string {
  const match = defId.match(/^v[56]-item-(.+)$/);
  return match?.[1] ?? defId;
}

export function isEquipmentItem(item: ItemCardDef): boolean {
  return item.permanence === 'equipment';
}

export function isConsumableItem(item: ItemCardDef): boolean {
  return item.permanence !== 'equipment';
}

export function playerEquipment(state: GameState, playerId: PlayerId): CardInstance[] {
  return state.players[playerId].equipment ?? [];
}

export function consumablePlayedThisTurn(state: GameState, playerId: PlayerId): boolean {
  return state.meta.v6ConsumablePlayed?.[playerId] === true;
}

export function equipmentActivatedThisTurn(
  state: GameState,
  playerId: PlayerId,
  instanceId: string,
): boolean {
  return (state.meta.v6EquipmentActivated?.[playerId] ?? []).includes(instanceId);
}

export function markConsumablePlayed(state: GameState, playerId: PlayerId): GameState {
  return {
    ...state,
    meta: {
      ...state.meta,
      v6ConsumablePlayed: {
        ...(state.meta.v6ConsumablePlayed ?? { p1: false, p2: false }),
        [playerId]: true,
      },
    },
  };
}

export function markEquipmentActivated(
  state: GameState,
  playerId: PlayerId,
  instanceId: string,
): GameState {
  const prev = state.meta.v6EquipmentActivated?.[playerId] ?? [];
  if (prev.includes(instanceId)) return state;
  return {
    ...state,
    meta: {
      ...state.meta,
      v6EquipmentActivated: {
        ...(state.meta.v6EquipmentActivated ?? { p1: [], p2: [] }),
        [playerId]: [...prev, instanceId],
      },
    },
  };
}

/**
 * Equip from hand card onto board. When slots full, `replaceInstanceId` must
 * identify an existing equipment card to discard.
 */
export function equipItemFromHand(
  equipment: CardInstance[],
  handCard: CardInstance,
  replaceInstanceId: string | undefined,
): { equipment: CardInstance[]; discarded: CardInstance | null } {
  if (equipment.length < V6_MAX_EQUIPMENT_SLOTS) {
    return { equipment: [...equipment, handCard], discarded: null };
  }
  if (!replaceInstanceId) {
    throw new Error('Ausrüstung voll — wähle einen Slot zum Ersetzen.');
  }
  const idx = equipment.findIndex((e) => e.instanceId === replaceInstanceId);
  if (idx < 0) throw new Error('Replace target not in equipment');
  const discarded = equipment[idx];
  const next = [...equipment];
  next[idx] = handCard;
  return { equipment: next, discarded };
}
