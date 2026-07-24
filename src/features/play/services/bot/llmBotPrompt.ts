/**
 * Prompt + payload helpers for the Ollama Cloud LLM opponent.
 * Location: src/features/play/services/bot/llmBotPrompt.ts
 */
import type { GameAction } from '../../../../game/types';
import type { BotPublicView } from '../../../../game/engine/botView';

export const LLM_BOT_SYSTEM = `Du bist der Gegner in Letz Fetz (1v1 Kartenduell).
Du siehst NUR Informationen, die Spieler p2 kennen würde — nie die Hand des Gegners.
Du darfst NUR eine der nummerierten legalen Aktionen wählen (actionIndex = 0-basierter Index).
Antworte NUR mit JSON: {"actionIndex":number,"reason":"kurze Begründung auf Deutsch"}.
Kein Markdown, kein anderer Text.`;

export function buildLlmBotUserPrompt(view: BotPublicView, actions: GameAction[]): string {
  const listed = actions.map((a, i) => `${i}: ${JSON.stringify(a)}`).join('\n');
  return [
    'Aktueller Sichtbarkeits-State (FOW):',
    JSON.stringify(view, null, 2),
    '',
    'Legale Aktionen (wähle genau einen Index):',
    listed,
  ].join('\n');
}
