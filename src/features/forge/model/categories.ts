/**
 * Card Forge sidebar categories — matches Letz Fetz V1 rulebook §3.
 * Location: src/features/forge/model/categories.ts
 */
import type { CardKind } from '../../../components/cards/cardTypes';

export const CARD_CATEGORIES = [
  { id: 'Character', label: 'Charakter', icon: '⚔️', expectedCount: 7 },
  { id: 'Ultimate', label: 'Ultimativ', icon: '💫', expectedCount: 7 },
  { id: 'Element', label: 'Element', icon: '🃏', expectedCount: 60 },
  { id: 'Arena', label: 'Arena', icon: '🏟️', expectedCount: 6 },
  { id: 'Glitch', label: 'Glitch', icon: '🌀', expectedCount: 10 },
  { id: 'Formula', label: 'Formeln', icon: '🧪', expectedCount: 25 },
  { id: 'Item', label: 'Gegenstände', icon: '🎒', expectedCount: 8 },
] as const satisfies ReadonlyArray<{ id: CardKind; label: string; icon: string; expectedCount: number }>;

export function categoryLabel(kind: string): string {
  return CARD_CATEGORIES.find((c) => c.id === kind)?.label ?? kind;
}
