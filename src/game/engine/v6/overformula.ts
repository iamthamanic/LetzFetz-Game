/**
 * V6 Überformel locked Slice-1 defaults (spielkonzept §26–27).
 * Location: src/game/engine/v6/overformula.ts
 *
 * First playable slice: always +2 Primär for numeric primary kinds.
 * Player choice (+2 Primär vs +1 Intensität) is out of scope until a later ticket.
 */
export const V6_OVERFORMULA_DEFAULT_PRIMARY_BONUS = 2;

/** Intensity bump when primary kind is not damage/heal/shield (prep / fessel). */
export const V6_OVERFORMULA_DEFAULT_INTENSITY_BONUS = 1;
