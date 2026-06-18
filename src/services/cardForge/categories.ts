/**
 * Card Forge sidebar categories — matches Letz Fetz V1 rulebook §3.
 * Location: src/services/cardForge/categories.ts
 */
export const CARD_CATEGORIES = [
  { id: 'Character', label: 'Charakter', icon: '⚔️', expectedCount: 7 },
  { id: 'Ultimate', label: 'Ultimativ', icon: '💫', expectedCount: 7 },
  { id: 'Element', label: 'Element', icon: '🃏', expectedCount: 60 },
  { id: 'Arena', label: 'Arena', icon: '🏟️', expectedCount: 6 },
  { id: 'Glitch', label: 'Glitch', icon: '🌀', expectedCount: 10 },
] as const;

export type ForgeCardKind = (typeof CARD_CATEGORIES)[number]['id'];

export const FORGE_CARD_KINDS: ForgeCardKind[] = CARD_CATEGORIES.map((c) => c.id);

export function categoryLabel(kind: string): string {
  return CARD_CATEGORIES.find((c) => c.id === kind)?.label ?? kind;
}
