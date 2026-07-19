/**
 * Client: ask Vite `/api/llm-bot` for a move, fallback to heuristic.
 * Location: src/services/bot/chooseLlmBotAction.ts
 */
import type { ContentPack, GameAction, GameState } from '../../game/types';
import { getLegalActions } from '../../game/engine/actions';
import { chooseBotAction } from '../../game/engine/bot';
import { buildBotPublicView, withBotDiceRoll } from '../../game/engine/botView';
import { rollD6 } from '../../game/engine/dice';
import { parseLlmBotResponse } from './parseLlmBotResponse';
import { buildLlmBotUserPrompt, LLM_BOT_SYSTEM } from './llmBotPrompt';

export type BotDecisionSource = 'llm' | 'heuristic';

export type BotDecision = {
  action: GameAction | null;
  reason: string;
  source: BotDecisionSource;
};

const BOT_ID = 'p2' as const;

export async function chooseLlmBotAction(
  state: GameState,
  pack: ContentPack,
): Promise<BotDecision> {
  const legal = getLegalActions(state, { pack, playerId: BOT_ID });
  if (legal.length === 0) {
    return { action: null, reason: 'Keine legale Aktion.', source: 'heuristic' };
  }

  const view = buildBotPublicView(state, pack, BOT_ID);
  try {
    const res = await fetch('/api/llm-bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system: LLM_BOT_SYSTEM,
        user: buildLlmBotUserPrompt(view, legal),
        actionCount: legal.length,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`LLM API ${res.status}: ${errText.slice(0, 200)}`);
    }
    const data = (await res.json()) as { content?: string };
    if (!data.content) throw new Error('Empty LLM content');
    const pick = parseLlmBotResponse(data.content, legal.length);
    const action = withBotDiceRoll(legal[pick.actionIndex], rollD6);
    return { action, reason: pick.reason, source: 'llm' };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'LLM fehlgeschlagen';
    const fallback = chooseBotAction(state, pack);
    return {
      action: fallback,
      reason: `Fallback Heuristik (${message})`,
      source: 'heuristic',
    };
  }
}
