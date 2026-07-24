/**
 * German UI labels for V2 phrase board slots.
 * Location: src/features/play/board/phraseSlotLabels.ts
 */
import type { PhraseSlot } from '../../../game';

export const PHRASE_SLOT_UI_LABELS: Record<PhraseSlot, string> = {
  core: 'Kern',
  mode: 'Modus',
  tool: 'Werkzeug',
  charge: 'Ladung',
};

/** Fixed left-to-right order on the bound row (3 phrase + 1 charge). */
export const V2_BOUND_SLOT_ORDER: PhraseSlot[] = ['core', 'mode', 'tool', 'charge'];
