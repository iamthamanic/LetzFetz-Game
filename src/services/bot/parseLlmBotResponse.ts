/**
 * Parse LLM bot JSON reply into a legal action index.
 * Location: src/services/bot/parseLlmBotResponse.ts
 */

export type LlmBotPick = {
  actionIndex: number;
  reason: string;
};

/** Extract first JSON object from model text (handles fences / chatter). */
export function extractJsonObject(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object in LLM reply');
  }
  return JSON.parse(raw.slice(start, end + 1));
}

export function parseLlmBotResponse(text: string, actionCount: number): LlmBotPick {
  if (actionCount <= 0) throw new Error('No legal actions');
  const parsed = extractJsonObject(text) as { actionIndex?: unknown; reason?: unknown };
  const idx = Number(parsed.actionIndex);
  if (!Number.isInteger(idx) || idx < 0 || idx >= actionCount) {
    throw new Error(`Invalid actionIndex: ${String(parsed.actionIndex)}`);
  }
  const reason =
    typeof parsed.reason === 'string' && parsed.reason.trim()
      ? parsed.reason.trim()
      : 'Keine Begründung.';
  return { actionIndex: idx, reason };
}
